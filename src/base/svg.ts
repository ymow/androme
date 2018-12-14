import { USER_AGENT } from '../lib/enumeration';

import Container from './container';
import SvgGroup from './svggroup';
import SvgImage from './svgimage';
import SvgPath from './svgpath';

import { cssAttribute, getElementAsNode, isUserAgent } from '../lib/dom';
import { applyMatrixX, applyMatrixY, createColorStop } from '../lib/svg';
import { resolvePath } from '../lib/util';

export default class Svg extends Container<SvgGroup> implements androme.lib.base.Svg {
    public static createClipPath(element: SVGClipPathElement) {
        const result: SvgPath[] = [];
        for (const item of Array.from(element.children)) {
            if (item instanceof SVGGraphicsElement) {
                const path = new SvgPath(item);
                if (path.d !== '') {
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
        if (isUserAgent(USER_AGENT.FIREFOX)) {
            const node = getElementAsNode<androme.lib.base.Node>(element);
            if (node && node.bounds.width > this.width && node.bounds.height > this.height) {
                this.setDimensions(node.bounds.width, node.bounds.height);
            }
        }
        this.setViewBox(element.viewBox.baseVal.width, element.viewBox.baseVal.height);
        this.setOpacity(cssAttribute(element, 'opacity'));
        element.querySelectorAll('clipPath, linearGradient, radialGradient, image').forEach((svg: SVGElement) => {
            switch (svg.tagName) {
                case 'clipPath': {
                    if (svg.id) {
                        const clipPath = Svg.createClipPath(<SVGClipPathElement> svg);
                        if (clipPath.length) {
                            this.defs.clipPath.set(`${svg.id}`, clipPath);
                        }
                    }
                    break;
                }
                case 'linearGradient': {
                    if (svg.id) {
                        const svgElement = <SVGLinearGradientElement> svg;
                        this.defs.gradient.set(`@${svg.id}`, <LinearGradient> {
                            type: 'linear',
                            x1: svgElement.x1.baseVal.value,
                            x2: svgElement.x2.baseVal.value,
                            y1: svgElement.y1.baseVal.value,
                            y2: svgElement.y2.baseVal.value,
                            x1AsString: svgElement.x1.baseVal.valueAsString,
                            x2AsString: svgElement.x2.baseVal.valueAsString,
                            y1AsString: svgElement.y1.baseVal.valueAsString,
                            y2AsString: svgElement.y2.baseVal.valueAsString,
                            colorStop: createColorStop(svgElement)
                        });
                    }
                    break;
                }
                case 'radialGradient': {
                    if (svg.id) {
                        const svgElement = <SVGRadialGradientElement> svg;
                        this.defs.gradient.set(`@${svg.id}`, <RadialGradient> {
                            type: 'radial',
                            cx: svgElement.cx.baseVal.value,
                            cy: svgElement.cy.baseVal.value,
                            r: svgElement.r.baseVal.value,
                            cxAsString: svgElement.cx.baseVal.valueAsString,
                            cyAsString: svgElement.cy.baseVal.valueAsString,
                            rAsString: svgElement.r.baseVal.valueAsString,
                            fx: svgElement.fx.baseVal.value,
                            fy: svgElement.fy.baseVal.value,
                            fxAsString: svgElement.fx.baseVal.valueAsString,
                            fyAsString: svgElement.fy.baseVal.valueAsString,
                            colorStop: createColorStop(svgElement)
                        });
                    }
                    break;
                }
                case 'image': {
                    const svgElement = <SVGImageElement> svg;
                    const image = new SvgImage(svgElement, resolvePath(svgElement.href.baseVal));
                    const transform = svgElement.transform.baseVal;
                    let x = svgElement.x.baseVal.value;
                    let y = svgElement.y.baseVal.value;
                    if (transform.numberOfItems) {
                        for (let i = transform.numberOfItems - 1; i >= 0; i--) {
                            const item = transform.getItem(i);
                            const matrix = item.matrix;
                            switch (item.type) {
                                case SVGTransform.SVG_TRANSFORM_TRANSLATE:
                                    x += matrix.e;
                                    y += matrix.f;
                                    break;
                                case SVGTransform.SVG_TRANSFORM_SCALE:
                                    x *= matrix.a;
                                    y *= matrix.d;
                                    image.width *= matrix.a;
                                    image.height *= matrix.d;
                                    break;
                                case SVGTransform.SVG_TRANSFORM_ROTATE:
                                    x = applyMatrixX(matrix, x, x);
                                    y = applyMatrixY(matrix, y, y);
                                    if (matrix.a < 0) {
                                        x += matrix.a * image.width;
                                    }
                                    if (matrix.c < 0) {
                                        x += matrix.c * image.width;
                                    }
                                    if (matrix.b < 0) {
                                        y += matrix.b * image.height;
                                    }
                                    if (matrix.d < 0) {
                                        y += matrix.d * image.height;
                                    }
                                    break;
                            }
                        }
                    }
                    image.x = x;
                    image.y = y;
                    this.defs.image.push(image);
                    break;
                }
            }
        });
        const baseTags = new Set(['svg', 'g']);
        [element, ...Array.from(element.children).filter(item => baseTags.has(item.tagName))].forEach((svg: SVGGraphicsElement, index) => {
            const createGroup = (baseElement: SVGGraphicsElement) => {
                const group = new SvgGroup(baseElement);
                if (svg.tagName === 'svg' && index > 0) {
                    const svgElement = <SVGSVGElement> svg;
                    group.x = svgElement.x.baseVal.value;
                    group.y = svgElement.y.baseVal.value;
                    group.width = svgElement.width.baseVal.value;
                    group.height = svgElement.height.baseVal.value;
                }
                this.append(group);
                return group;
            };
            let current: SvgGroup | null = null;
            for (let i = 0; i < svg.children.length; i++) {
                const svgElement = <SVGGraphicsElement> svg.children[i];
                let newGroup = false;
                switch (svg.children[i].tagName) {
                    case 'g':
                    case 'use':
                    case 'image':
                    case 'clipPath':
                    case 'linearGradient':
                    case 'radialGradient':
                        break;
                    case 'path':
                    case 'circle':
                    case 'ellipse':
                        if (svgElement.transform.baseVal.numberOfItems) {
                            current = createGroup(svgElement);
                            newGroup = true;
                        }
                    default:
                        if (current === null) {
                            current = createGroup(svg);
                        }
                        const path = new SvgPath(svgElement);
                        if (path.d && path.d !== 'none') {
                            current.append(path);
                        }
                        break;
                }
                if (newGroup) {
                    current = null;
                }
            }
        });
        element.querySelectorAll('use').forEach((svg: SVGUseElement) => {
            if (cssAttribute(svg, 'display') !== 'none') {
                let parentPath: SvgPath | undefined;
                this.some(item => {
                    return item.some(path => {
                        if (svg.href.baseVal === `#${path.name}`) {
                            parentPath = path;
                            return true;
                        }
                        return false;
                    });
                });
                if (parentPath) {
                    const use = new SvgPath(svg, parentPath.d);
                    if (use) {
                        let found = false;
                        if (svg.transform.baseVal.numberOfItems === 0 && svg.x.baseVal.value === 0 && svg.y.baseVal.value === 0 && svg.width.baseVal.value === 0 && svg.height.baseVal.value === 0) {
                            this.some(groupItem => {
                                if (svg.parentElement instanceof SVGGraphicsElement && svg.parentElement === groupItem.element) {
                                    groupItem.append(use);
                                    found = true;
                                    return true;
                                }
                                return false;
                            });
                        }
                        if (!found) {
                            const group = new SvgGroup(svg);
                            group.x = svg.x.baseVal.value;
                            group.y = svg.y.baseVal.value;
                            group.width = svg.width.baseVal.value;
                            group.height = svg.height.baseVal.value;
                            group.append(use);
                            this.append(group);
                        }
                    }
                }
            }
        });
        const sorted = new Set<SvgGroup>();
        for (const svg of Array.from(element.children)) {
            const nested = new Set(Array.from(svg.querySelectorAll('*')));
            for (const group of this.children) {
                if (group.element && (group.element === svg || nested.has(group.element))) {
                    sorted.delete(group);
                    sorted.add(group);
                    break;
                }
                for (const path of group) {
                    if (path.element && (path.element === svg || nested.has(path.element))) {
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