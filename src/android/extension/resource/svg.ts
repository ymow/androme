import LAYERLIST_TMPL from '../../template/resource/layer-list';
import VECTOR_TMPL from '../../template/resource/vector';

import Resource from '../../resource';
import View from '../../view';

import { getXmlNs } from '../../lib/util';

import $Svg = androme.lib.base.Svg;

import $svg = androme.lib.svg;
import $util = androme.lib.util;
import $xml = androme.lib.xml;

export default class ResourceSvg<T extends View> extends androme.lib.base.Extension<T> {
    public readonly options = {
        vectorColorResourceValue: true
    };

    public readonly eventOnly = true;

    public beforeInit() {
        this.application.controllerHandler.localSettings.unsupported.tagName.delete('svg');
    }

    public afterResources() {
        for (const node of this.application.processing.cache) {
            if (node.svgElement && node.element.children.length) {
                const svg = new $Svg(<SVGSVGElement> node.element);
                svg.defs.image.forEach(item => {
                    const dimensions = Resource.ASSETS.images.get(item.uri);
                    if (dimensions) {
                        if (item.width === 0) {
                            item.width = dimensions.width;
                        }
                        if (item.height === 0) {
                            item.height = dimensions.height;
                        }
                    }
                });
                let result = '';
                let vectorName = '';
                if (svg.length) {
                    const namespace = new Set<string>();
                    const groups: StringMap[] = [];
                    for (const group of svg) {
                        const data: ExternalData = {
                            name: group.name,
                            '2': []
                        };
                        if (group.element && group.element !== node.element) {
                            const transform = $svg.createTransformSingle(group.element);
                            let x = group.x || 0;
                            let y = group.y || 0;
                            if (transform.operations.length) {
                                x += transform.translateX;
                                y += transform.translateY;
                                if (transform.scaleX !== 1) {
                                    data.scaleX = transform.scaleX.toString();
                                }
                                if (transform.scaleY !== 1) {
                                    data.scaleY = transform.scaleY.toString();
                                }
                                if (transform.rotateAngle !== 0) {
                                    data.rotation = transform.rotateAngle.toString();
                                }
                                let pivotX = transform.rotateOriginX || 0;
                                let pivotY = transform.rotateOriginY || 0;
                                if (transform.origin) {
                                    pivotX += transform.origin.x;
                                    pivotY += transform.origin.y;
                                }
                                if (pivotX !== 0) {
                                    data.pivotX = pivotX.toString();
                                }
                                if (pivotY !== 0) {
                                    data.pivotY = pivotY.toString();
                                }
                            }
                            if (x !== 0) {
                                data.translateX = x.toString();
                            }
                            if (y !== 0) {
                                data.translateY = y.toString();
                            }
                        }
                        for (const item of group) {
                            if (item.visibility) {
                                const clipPaths: ExternalData[] = [];
                                if (item.clipPath !== '') {
                                    const clipPath = svg.defs.clipPath.get(item.clipPath);
                                    if (clipPath) {
                                        clipPath.forEach(path => clipPaths.push({ name: path.name, d: path.d }));
                                    }
                                }
                                ['fill', 'stroke'].forEach(value => {
                                    if ($util.isString(item[value])) {
                                        if (item[value].charAt(0) === '@') {
                                            const gradient = svg.defs.gradient.get(item[value]);
                                            if (gradient) {
                                                switch (item.element.tagName) {
                                                    case 'path':
                                                        if (!/[zZ]\s*$/.test(item.d)) {
                                                            break;
                                                        }
                                                    case 'rect':
                                                    case 'polygon':
                                                    case 'circle':
                                                    case 'ellipse':
                                                        const gradients = Resource.createBackgroundGradient(node, [gradient], item, this.options.vectorColorResourceValue);
                                                        item[value] = [{ gradients }];
                                                        namespace.add('aapt');
                                                        return;
                                                }
                                            }
                                            else {
                                                item[value] = item.color;
                                            }
                                        }
                                        if (this.options.vectorColorResourceValue) {
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
                        namespace: namespace.size ? getXmlNs(...Array.from(namespace)) : '',
                        width: $util.formatPX(svg.width),
                        height: $util.formatPX(svg.height),
                        viewportWidth: svg.viewBoxWidth > 0 ? svg.viewBoxWidth.toString() : false,
                        viewportHeight: svg.viewBoxHeight > 0 ? svg.viewBoxHeight.toString() : false,
                        alpha: svg.opacity < 1 ? svg.opacity.toString() : false,
                        '1': groups
                    });
                    vectorName = Resource.getStoredName('drawables', xml);
                    if (vectorName === '') {
                        vectorName = `${node.tagName.toLowerCase()}_${node.controlId + (svg.defs.image.length ? '_vector' : '')}`;
                        Resource.STORED.drawables.set(vectorName, xml);
                    }
                }
                if (svg.defs.image.length) {
                    const images: ExternalData = [];
                    const rotate: ExternalData = [];
                    for (const item of svg.defs.image) {
                        if (item.viewable) {
                            const scaleX = svg.width / svg.viewBoxWidth;
                            const scaleY = svg.height / svg.viewBoxHeight;
                            let x = (item.x || 0) * scaleX;
                            let y = (item.y || 0) * scaleY;
                            item.width *= scaleX;
                            item.height *= scaleY;
                            let parent = item.element ? item.element.parentElement : null;
                            while (parent instanceof SVGSVGElement && parent !== node.element) {
                                const attributes = $svg.createTransformSingle(parent);
                                x += parent.x.baseVal.value + attributes.translateX;
                                y += parent.y.baseVal.value + attributes.translateY;
                                parent = parent.parentElement;
                            }
                            const data: ExternalData = {
                                width: item.width > 0 ? $util.formatPX(item.width) : '',
                                height: item.height > 0 ? $util.formatPX(item.height) : '',
                                left: x !== 0 ? $util.formatPX(x) : '',
                                top: y !== 0 ? $util.formatPX(y) : '',
                                src: Resource.addImage({ mdpi: item.uri })
                            };
                            const transform = $svg.createTransformSingle(item.element);
                            if (transform.rotateAngle !== 0) {
                                data.fromDegrees = transform.rotateAngle.toString();
                                data.visible = item.visibility ? 'true' : 'false';
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
                        result = `${node.tagName.toLowerCase()}_${node.controlId}`;
                        Resource.STORED.drawables.set(result, xml);
                    }
                }
                else {
                    result = vectorName;
                }
                if (result !== '') {
                    node.android('src', `@drawable/${result}`, node.renderExtension.size === 0);
                }
                if (!node.hasWidth) {
                    node.android('layout_width', 'wrap_content');
                }
                if (!node.hasHeight) {
                    node.android('layout_height', 'wrap_content');
                }
            }
        }
    }

    public afterFinalize() {
        this.application.controllerHandler.localSettings.unsupported.tagName.add('svg');
    }
}