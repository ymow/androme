import Container from './container';
import SvgGroup from './svggroup';
import SvgImage from './svgimage';
import SvgPath from './svgpath';

import { cssAttribute } from '../lib/dom';
import { applyMatrixX, applyMatrixY, createColorStop } from '../lib/svg';
import { resolvePath } from '../lib/util';

export default class Svg extends Container<SvgGroup> implements androme.lib.base.Svg {
    public static createClipPath(element: SVGClipPathElement) {
        const result: SvgPath[] = [];
        if (element.id) {
            for (const item of Array.from(element.children)) {
                const path = new SvgPath(<SVGGraphicsElement> item);
                if (path) {
                    result.push(path);
                }
            }
        }
        return result;
    }

    public name = '';

    public readonly defs: SvgDefs<SvgImage, SvgPath> = {
        image: [],
        clipPath: new Map<string, SvgPath[]>(),
        gradient: new Map<string, Gradient>()
    };

    private _width = 0;
    private _height = 0;
    private _viewBoxWidth = 0;
    private _viewBoxHeight = 0;
    private _opacity = 1;

    constructor(public readonly element: SVGSVGElement) {
        super();
        this.name = element.id;
        this.build();
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
        const element = this.element;
        this.defs.image = [];
        this.setDimensions(element.width.baseVal.value, element.height.baseVal.value);
        this.setViewBox(element.viewBox.baseVal.width, element.viewBox.baseVal.height);
        this.setOpacity(cssAttribute(element, 'opacity'));
        element.querySelectorAll('clipPath, linearGradient, radialGradient, image').forEach((item: SVGElement) => {
            switch (item.tagName) {
                case 'clipPath': {
                    const clipPath = Svg.createClipPath(<SVGClipPathElement> item);
                    if (clipPath.length) {
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
                        colorStop: createColorStop(gradient)
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
                        colorStop: createColorStop(gradient)
                    });
                    break;
                }
                case 'image': {
                    const image = <SVGImageElement> item;
                    const svg = new SvgImage(image, resolvePath(image.href.baseVal));
                    const transform = image.transform.baseVal;
                    let x = image.x.baseVal.value;
                    let y = image.y.baseVal.value;
                    if (transform.numberOfItems) {
                        for (let i = transform.numberOfItems - 1; i >= 0; i--) {
                            const subitem = transform.getItem(i);
                            const matrix = subitem.matrix;
                            switch (subitem.type) {
                                case SVGTransform.SVG_TRANSFORM_TRANSLATE:
                                    x += matrix.e;
                                    y += matrix.f;
                                    break;
                                case SVGTransform.SVG_TRANSFORM_SCALE:
                                    x *= matrix.a;
                                    y *= matrix.d;
                                    svg.width *= matrix.a;
                                    svg.height *= matrix.d;
                                    break;
                                case SVGTransform.SVG_TRANSFORM_ROTATE:
                                    x = applyMatrixX(matrix, x, x);
                                    y = applyMatrixY(matrix, y, y);
                                    if (matrix.a < 0) {
                                        x += matrix.a * svg.width;
                                    }
                                    if (matrix.c < 0) {
                                        x += matrix.c * svg.width;
                                    }
                                    if (matrix.b < 0) {
                                        y += matrix.b * svg.height;
                                    }
                                    if (matrix.d < 0) {
                                        y += matrix.d * svg.height;
                                    }
                                    break;
                            }
                        }
                    }
                    svg.x = x;
                    svg.y = y;
                    this.defs.image.push(svg);
                    break;
                }
            }
        });
        const baseTags = new Set(['svg', 'g']);
        [element, ...Array.from(element.children).filter(item => baseTags.has(item.tagName))].forEach((item: SVGGraphicsElement, index) => {
            const group = new SvgGroup(item);
            if (index > 0 && item.tagName === 'svg') {
                const svg = <SVGSVGElement> item;
                group.x = svg.x.baseVal.value;
                group.y = svg.y.baseVal.value;
                group.width = svg.width.baseVal.value;
                group.height = svg.height.baseVal.value;
            }
            for (let i = 0; i < item.children.length; i++) {
                switch (item.children[i].tagName) {
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
                    const use = new SvgPath(item, pathParent.d);
                    if (use) {
                        let found = false;
                        if (item.transform.baseVal.numberOfItems === 0 && item.x.baseVal.value === 0 && item.y.baseVal.value === 0 && item.width.baseVal.value === 0 && item.height.baseVal.value === 0) {
                            this.some(groupItem => {
                                if (item.parentElement instanceof SVGGraphicsElement && item.parentElement === groupItem.element) {
                                    groupItem.append(use);
                                    found = true;
                                    return true;
                                }
                                return false;
                            });
                        }
                        if (!found) {
                            const group = new SvgGroup(item);
                            group.x = item.x.baseVal.value;
                            group.y = item.y.baseVal.value;
                            group.width = item.width.baseVal.value;
                            group.height = item.height.baseVal.value;
                            group.append(use);
                            this.append(group);
                        }
                    }
                }
            }
        });
        const sorted = new Set<SvgGroup>();
        for (const item of Array.from(element.children)) {
            const nested = new Set(Array.from(item.querySelectorAll('*')));
            for (const group of this.children) {
                if (group.element && (group.element === item || nested.has(group.element))) {
                    sorted.delete(group);
                    sorted.add(group);
                    break;
                }
                for (const path of group) {
                    if (path.element && (path.element === item || nested.has(path.element))) {
                        sorted.delete(group);
                        sorted.add(group);
                        break;
                    }
                }
            }
        }
        this.retain([...this.filter(item => item.length > 0 && !sorted.has(item)), ...sorted]);
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