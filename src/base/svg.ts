import Container from './container';
import SvgGroup from './svggroup';
import SvgPath from './svgpath';
import SvgImage from './svgimage';

import { resolvePath } from '../lib/util';
import { cssAttribute } from '../lib/dom';
import { getColorStop } from '../lib/svg';

export default class Svg extends Container<SvgGroup> implements androme.lib.base.Svg {
    public static getClipPath(clipPath: SVGClipPathElement) {
        const result: SvgPath[] = [];
        if (clipPath.id) {
            for (const item of Array.from(clipPath.children)) {
                const path = new SvgPath(<SVGGraphicsElement> item);
                if (path) {
                    result.push(path);
                }
            }
        }
        return result;
    }

    public name: string;
    public readonly defs: SvgDefs<SvgImage, SvgPath> = {
        image: [],
        clipPath: new Map<string, SvgPath[]>(),
        gradient: new Map<string, Gradient>()
    };

    private _element: SVGSVGElement | undefined;
    private _width = 0;
    private _height = 0;
    private _viewBoxWidth = 0;
    private _viewBoxHeight = 0;
    private _opacity = 1;

    constructor(element: SVGSVGElement) {
        super();
        if (element) {
            this.setElement(element);
            this.build();
        }
    }

    public setElement(element: SVGSVGElement) {
        if (element instanceof SVGSVGElement) {
            this._element = element;
        }
    }

    public setDimensions(width: number, height: number) {
        this._width = width;
        this._height = height;
    }

    public setViewBox(width: number, height: number) {
        this._viewBoxWidth = width;
        this._viewBoxHeight = height;
    }

    public setOpacity(value: string | number) {
        value = parseFloat(value.toString());
        this._opacity = !isNaN(value) && value < 1 ? value : 1;
    }

    public build() {
        const element = this._element;
        if (element) {
            this.name = element.id;
            this.setDimensions(element.width.baseVal.value, element.height.baseVal.value);
            this.setViewBox(element.viewBox.baseVal.width, element.viewBox.baseVal.height);
            this.setOpacity(cssAttribute(element, 'opacity'));
            this.defs.image = [];
            element.querySelectorAll('clipPath, linearGradient, radialGradient, image').forEach((item: SVGElement) => {
                switch (item.tagName) {
                    case 'clipPath': {
                        const clipPath = Svg.getClipPath(<SVGClipPathElement> item);
                        if (clipPath.length > 0) {
                            this.defs.clipPath.set(`${item.id}`, clipPath);
                        }
                        break;
                    }
                    case 'linearGradient': {
                        const gradient = <SVGLinearGradientElement> item;
                        this.defs.gradient.set(`@${gradient.id}`, <LinearGradient> {
                            type: 'linear',
                            x1: gradient.x1.baseVal.value,
                            x2: gradient.x2.baseVal.value,
                            y1: gradient.y1.baseVal.value,
                            y2: gradient.y2.baseVal.value,
                            x1AsString: gradient.x1.baseVal.valueAsString,
                            x2AsString: gradient.x2.baseVal.valueAsString,
                            y1AsString: gradient.y1.baseVal.valueAsString,
                            y2AsString: gradient.y2.baseVal.valueAsString,
                            colorStop: getColorStop(gradient)
                        });
                        break;
                    }
                    case 'radialGradient': {
                        const gradient = <SVGRadialGradientElement> item;
                        this.defs.gradient.set(`@${gradient.id}`, <RadialGradient> {
                            type: 'radial',
                            cx: gradient.cx.baseVal.value,
                            cy: gradient.cy.baseVal.value,
                            r: gradient.r.baseVal.value,
                            cxAsString: gradient.cx.baseVal.valueAsString,
                            cyAsString: gradient.cy.baseVal.valueAsString,
                            rAsString: gradient.r.baseVal.valueAsString,
                            fx: gradient.fx.baseVal.value,
                            fy: gradient.fy.baseVal.value,
                            fxAsString: gradient.fx.baseVal.valueAsString,
                            fyAsString: gradient.fy.baseVal.valueAsString,
                            colorStop: getColorStop(gradient)
                        });
                        break;
                    }
                    case 'image': {
                        const image = <SVGImageElement> item;
                        const svgImage = new SvgImage(image, resolvePath(image.href.baseVal));
                        svgImage.width = image.width.baseVal.value;
                        svgImage.height = image.height.baseVal.value;
                        svgImage.imageAsset.position = {
                            x: image.x.baseVal.value,
                            y: image.y.baseVal.value
                        };
                        this.defs.image.push(svgImage);
                        break;
                    }
                }
            });
            const baseTags = new Set(['svg', 'g']);
            [element, ...Array.from(element.children).filter(item => baseTags.has(item.tagName))].forEach((item: SVGGraphicsElement, index) => {
                const group = new SvgGroup(item);
                group.name = item.id;
                if (index > 0 && item.tagName === 'svg') {
                    const svg = <SVGSVGElement> item;
                    group.x = svg.x.baseVal.value;
                    group.y = svg.y.baseVal.value;
                    group.width = svg.width.baseVal.value;
                    group.height = svg.height.baseVal.value;
                }
                for (let i = 0; i < item.children.length; i++) {
                    const subitem = item.children[i];
                    switch (subitem.tagName) {
                        case 'g':
                        case 'use':
                        case 'image':
                        case 'clipPath':
                        case 'linearGradient':
                        case 'radialGradient':
                            break;
                        default:
                            const path = new SvgPath(<SVGGraphicsElement> item.children[i]);
                            if (path.d && path.d !== 'none') {
                                group.append(path);
                            }
                            break;
                    }
                }
                this.append(group);
            });
            element.querySelectorAll('use').forEach((item: SVGUseElement) => {
                if (cssAttribute(item, 'display') !== 'none') {
                    let pathParent: SvgPath | undefined;
                    this.some(parent => {
                        return parent.some(path => {
                            if (item.href.baseVal === `#${path.name}`) {
                                pathParent = path;
                                return true;
                            }
                            return false;
                        });
                    });
                    if (pathParent) {
                        const usePath = new SvgPath(item, pathParent.d);
                        if (usePath) {
                            if (item.transform.baseVal.numberOfItems === 0 && item.x.baseVal.value === 0 && item.y.baseVal.value === 0 && item.width.baseVal.value === 0 && item.height.baseVal.value === 0) {
                                this.some(groupItem => {
                                    if (item.parentElement instanceof SVGGraphicsElement && item.parentElement === groupItem.element) {
                                        groupItem.append(usePath);
                                        return true;
                                    }
                                    return false;
                                });
                            }
                            else {
                                const useGroup = new SvgGroup(item);
                                useGroup.name = item.id;
                                useGroup.x = item.x.baseVal.value;
                                useGroup.y = item.y.baseVal.value;
                                useGroup.width = item.width.baseVal.value;
                                useGroup.height = item.height.baseVal.value;
                                useGroup.append(usePath);
                                this.append(useGroup);
                            }
                        }
                    }
                }
            });
            const sorted = new Set<SvgGroup>();
            for (const item of Array.from(element.children)) {
                const children = new Set(Array.from(item.querySelectorAll('*')));
                for (const group of this) {
                    if (group instanceof SvgGroup && group.length > 0) {
                        if (group.element && (group.element === item || children.has(group.element))) {
                            sorted.delete(group);
                            sorted.add(group);
                            break;
                        }
                        for (const path of group) {
                            if (path.element && (path.element === item || children.has(path.element))) {
                                sorted.delete(group);
                                sorted.add(group);
                                break;
                            }
                        }
                    }
                }
            }
            this.replace([...this.filter(item => item.length > 0 && !sorted.has(item)), ...sorted]);
        }
    }

    get element() {
        return this._element;
    }

    get width() {
        return this._width;
    }
    get height() {
        return this._height;
    }

    get viewBoxWidth() {
        return this._viewBoxWidth;
    }
    get viewBoxHeight() {
        return this._viewBoxHeight;
    }

    get opacity() {
        return this._opacity;
    }
}