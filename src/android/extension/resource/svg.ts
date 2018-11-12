import LAYERLIST_TMPL from '../../template/resource/layer-list';
import VECTOR_TMPL from '../../template/resource/vector';

import Resource from '../../resource';
import View from '../../view';

import { getXmlNs } from '../../lib/util';

import $Svg = androme.lib.base.Svg;

import $enum = androme.lib.enumeration;
import $svg = androme.lib.svg;
import $util = androme.lib.util;
import $xml = androme.lib.xml;

function setPivotXY(data: TemplateData, origin: BoxPosition | undefined) {
    if (origin) {
        if (origin.left !== 0) {
            data.pivotX = $util.isPercent(origin.originalX) ? origin.originalX : origin.left.toString();
        }
        if (origin.top !== 0) {
            data.pivotY = $util.isPercent(origin.originalY) ? origin.originalY : origin.top.toString();
        }
    }
}

export default class ResourceSvg<T extends View> extends androme.lib.base.Extension<T> {
    public readonly options = {
        useColorAlias: true
    };
    public readonly eventOnly = true;

    public beforeInit() {
        this.application.viewController.localSettings.unsupported.tagName.delete('svg');
    }

    public afterResources() {
        for (const node of this.application.cacheProcessing) {
            const stored: $Svg = node.data(Resource.KEY_NAME, 'imageSource');
            if (stored && !node.hasBit('excludeResource', $enum.NODE_RESOURCE.IMAGE_SOURCE)) {
                let result = '';
                let vectorName = '';
                if (stored.length > 0) {
                    const namespace = new Set<string>();
                    const groups: StringMap[] = [];
                    for (const group of stored) {
                        const data: TemplateData = {
                            name: group.name,
                            '2': []
                        };
                        if (group.element !== node.element) {
                            const transform = group.transform;
                            const x = (group.x || 0) + (transform ? transform.translateX : 0);
                            const y = (group.y || 0) + (transform ? transform.translateY : 0);
                            if (x !== 0) {
                                data.translateX = x.toString();
                            }
                            if (y !== 0) {
                                data.translateY = y.toString();
                            }
                            if (transform) {
                                if (transform.scaleX !== 1) {
                                    data.scaleX = transform.scaleX.toString();
                                }
                                if (transform.scaleY !== 1) {
                                    data.scaleY = transform.scaleY.toString();
                                }
                                if (transform.rotateAngle !== 0) {
                                    data.rotation = transform.rotateAngle.toString();
                                    if (transform.rotateX !== 0 || transform.rotateY !== 0) {
                                        data.pivotX = transform.rotateX.toString();
                                        data.pivotY = transform.rotateX.toString();
                                    }
                                }
                                setPivotXY(data, transform.origin);
                            }
                        }
                        for (const item of group) {
                            if (item.visibility) {
                                const clipPaths: TemplateData[] = [];
                                if (item.clipPath !== '') {
                                    const clipPath = stored.defs.clipPath.get(item.clipPath);
                                    if (clipPath) {
                                        clipPath.forEach(path => clipPaths.push({ name: path.name, d: path.d }));
                                    }
                                }
                                ['fill', 'stroke'].forEach(value => {
                                    if ($util.isString(item[value])) {
                                        if (item[value].charAt(0) === '@') {
                                            const gradient = stored.defs.gradient.get(item[value]);
                                            if (gradient) {
                                                const gradients = Resource.createBackgroundGradient(node, [gradient], this.options.useColorAlias);
                                                item[value] = [{ gradients }];
                                                namespace.add('aapt');
                                                return;
                                            }
                                            else {
                                                item[value] = item.color;
                                            }
                                        }
                                        if (this.options.useColorAlias) {
                                            const colorValue = Resource.addColor(item[value]);
                                            if (colorValue !== '') {
                                                item[value] = `@color/${colorValue}`;
                                            }
                                        }
                                    }
                                });
                                if (item.fillRule) {
                                    switch (item.fillRule) {
                                        case 'evenodd':
                                            item.fillRule = 'evenOdd';
                                            break;
                                        default:
                                            item.fillRule = 'nonZero';
                                            break;
                                    }
                                }
                                data['2'].push(Object.assign({}, item, { clipPaths }));
                            }
                        }
                        if (data['2'].length) {
                            groups.push(data);
                        }
                    }
                    const xml = $xml.createTemplate($xml.parseTemplate(VECTOR_TMPL), {
                        namespace: namespace.size > 0 ? getXmlNs(...Array.from(namespace)) : '',
                        width: $util.formatPX(stored.width),
                        height: $util.formatPX(stored.height),
                        viewportWidth: stored.viewBoxWidth > 0 ? stored.viewBoxWidth.toString() : false,
                        viewportHeight: stored.viewBoxHeight > 0 ? stored.viewBoxHeight.toString() : false,
                        alpha: stored.opacity < 1 ? stored.opacity : false,
                        '1': groups
                    });
                    vectorName = Resource.getStoredName('drawables', xml);
                    if (vectorName === '') {
                        vectorName = `${node.nodeName.toLowerCase()}_${node.nodeId + (stored.defs.image.length > 0 ? '_vector' : '')}`;
                        Resource.STORED.drawables.set(vectorName, xml);
                    }
                }
                if (stored.defs.image.length > 0) {
                    const images: TemplateData = [];
                    const rotate: TemplateData = [];
                    for (const item of stored.defs.image) {
                        if (item.uri) {
                            const transform = item.transform;
                            const scaleX = stored.width / stored.viewBoxWidth;
                            const scaleY = stored.height / stored.viewBoxHeight;
                            if (transform) {
                                if (item.width) {
                                    item.width *= scaleX * transform.scaleX;
                                }
                                if (item.height) {
                                    item.height *= scaleY * transform.scaleY;
                                }
                            }
                            let x = (item.x || 0) * scaleX;
                            let y = (item.y || 0) * scaleY;
                            let parent = item.element && item.element.parentElement;
                            while (parent instanceof SVGSVGElement && parent !== node.element) {
                                const attributes = $svg.createTransform(parent);
                                x += parent.x.baseVal.value + attributes.translateX;
                                y += parent.y.baseVal.value + attributes.translateY;
                                parent = parent.parentElement;
                            }
                            const data: TemplateData = {
                                width: item.width ? $util.formatPX(item.width) : '',
                                height: item.height ? $util.formatPX(item.height) : '',
                                left: x !== 0 ? $util.formatPX(x) : '',
                                top: y !== 0 ? $util.formatPX(y) : '',
                                src: Resource.addImage({ mdpi: item.uri })
                            };
                            if (transform && transform.rotateAngle !== 0) {
                                data.fromDegrees = transform.rotateAngle.toString();
                                data.visible = item.visibility ? 'true' : 'false';
                                setPivotXY(data, transform.origin);
                                rotate.push(data);
                            }
                            else {
                                images.push(data);
                            }
                        }
                    }
                    const xml = $xml.createTemplate($xml.parseTemplate(LAYERLIST_TMPL), {
                        '1': false,
                        '2': false,
                        '3': [{ vector: vectorName }],
                        '4': rotate,
                        '5': images,
                        '6': false,
                        '7': false
                    });
                    result = Resource.getStoredName('drawables', xml);
                    if (result === '') {
                        result = `${node.nodeName.toLowerCase()}_${node.nodeId}`;
                        Resource.STORED.drawables.set(result, xml);
                    }
                }
                else {
                    result = vectorName;
                }
                if (result !== '') {
                    node.android('src', `@drawable/${result}`, node.renderExtension.size === 0);
                }
            }
        }
    }

    public afterFinalize() {
        this.application.viewController.localSettings.unsupported.tagName.add('svg');
    }
}