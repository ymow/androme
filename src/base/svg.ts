import { USER_AGENT } from '../lib/enumeration';

import Container from './container';

import SvgAnimate from './svganimate';
import SvgBuild from './svgbuild';
import SvgElement from './svgelement';
import SvgGroup from './svggroup';
import SvgGroupViewBox from './svggroupviewbox';
import SvgImage from './svgimage';
import SvgPath from './svgpath';
import SvgUse from './svguse';

import { cssAttribute, getElementAsNode, isUserAgent } from '../lib/dom';
import { isVisible } from '../lib/svg';

export default class Svg extends Container<SvgGroup> implements androme.lib.base.Svg {
    public name: string;
    public animate: SvgAnimate[];
    public visible: boolean;

    public readonly animatable = true;
    public readonly transformable = false;

    public readonly defs: SvgDefs = {
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
        this.name = SvgBuild.setName(element);
        this.animate = SvgElement.toAnimateList(element);
        this.visible = isVisible(element);
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

    private build() {
        const element = this.element;
        const width = element.viewBox.baseVal.width;
        const height = element.viewBox.baseVal.height;
        this.setViewBox(width, height);
        this.setOpacity(cssAttribute(element, 'opacity'));
        this.setDimensions(element.width.baseVal.value, element.height.baseVal.value);
        if (isUserAgent(USER_AGENT.FIREFOX)) {
            const node = getElementAsNode<androme.lib.base.Node>(element);
            if (node && node.bounds.width > this.width && node.bounds.height > this.height) {
                this.setDimensions(node.bounds.width, node.bounds.height);
            }
        }
        element.querySelectorAll('clipPath, linearGradient, radialGradient').forEach((svg: SVGElement) => {
            if (svg.id) {
                switch (svg.tagName) {
                    case 'clipPath': {
                        const clipPath = SvgPath.toClipPathList(<SVGClipPathElement> svg);
                        if (clipPath.length) {
                            this.defs.clipPath.set(`${svg.id}`, clipPath);
                        }
                        break;
                    }
                    case 'linearGradient': {
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
                            colorStop: SvgBuild.createColorStops(svgElement)
                        });
                        break;
                    }
                    case 'radialGradient': {
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
                            colorStop: SvgBuild.createColorStops(svgElement)
                        });
                        break;
                    }
                }
            }
        });
        [element, ...Array.from(element.children).filter(item => item.tagName === 'svg' || item.tagName === 'g')].forEach((svg: SVGGraphicsElement, index) => {
            const group = index > 0 && svg.tagName === 'svg' ? new SvgGroupViewBox(<SVGSVGElement> svg) : new SvgGroup(svg);
            for (let i = 0; i < svg.children.length; i++) {
                const item = <SVGGraphicsElement> svg.children[i];
                let shape: SvgElement | undefined;
                switch (item.tagName) {
                    case 'path':
                    case 'circle':
                    case 'ellipse':
                    case 'line':
                    case 'rect':
                    case 'polygon':
                    case 'polyline':
                        shape = new SvgElement(item);
                        break;
                    case 'image':
                        shape = new SvgImage(<SVGImageElement> item);
                        break;
                }
                if (shape) {
                    group.append(shape);
                }
            }
            this.append(group);
        });
        element.querySelectorAll('use').forEach((use: SVGUseElement) => {
            if (isVisible(use)) {
                let parentPath: SvgPath | undefined;
                this.some(group => {
                    return group.some(svg => {
                        if (svg.path && use.href.baseVal === `#${svg.name}`) {
                            parentPath = svg.path;
                            return true;
                        }
                        return false;
                    });
                });
                if (parentPath) {
                    const usePath = new SvgUse(use, parentPath.d);
                    let found = false;
                    if (use.transform.baseVal.numberOfItems === 0 && use.x.baseVal.value === 0 && use.y.baseVal.value === 0 && use.width.baseVal.value === 0 && use.height.baseVal.value === 0) {
                        found = this.some(group => {
                            if (use.parentElement instanceof SVGGraphicsElement && use.parentElement === group.element) {
                                group.append(usePath);
                                return true;
                            }
                            return false;
                        });
                    }
                    if (!found) {
                        const group = new SvgGroupViewBox(use);
                        group.append(usePath);
                        this.append(group);
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

    get transform() {
        return this.element.transform;
    }
}