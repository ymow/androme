import { USER_AGENT } from '../lib/enumeration';

import Container from './container';

import SvgAnimation from './svganimation';
import SvgBuild from './svgbuild';
import SvgElement from './svgelement';
import SvgGroup from './svggroup';
import SvgGroupViewBox from './svggroupviewbox';
import SvgImage from './svgimage';
import SvgUse from './svguse';

import { cssAttribute, getElementAsNode, isUserAgent } from '../lib/dom';
import { isSvgImage, isSvgShape, isVisible } from '../lib/svg';

export default class Svg extends Container<SvgGroup> implements androme.lib.base.Svg {
    public name: string;
    public animate: SvgAnimation[];
    public visible: boolean;

    public readonly animatable = true;
    public readonly transformable = false;

    public readonly defs: SvgDefs = {
        clipPath: new Map<string, SvgGroup>(),
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
        this.init();
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

    private init() {
        const element = this.element;
        this.setViewBox(element.viewBox.baseVal.width, element.viewBox.baseVal.height);
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
                if (svg instanceof SVGClipPathElement) {
                    const group = new SvgGroup(svg);
                    for (const item of Array.from(svg.children)) {
                        if (isSvgShape(item)) {
                            const shape = new SvgElement(item);
                            if (shape.path) {
                                group.append(shape);
                            }
                        }
                    }
                    if (group.length) {
                        this.defs.clipPath.set(svg.id, group);
                    }
                }
                else if (svg instanceof SVGLinearGradientElement) {
                    this.defs.gradient.set(`@${svg.id}`, <SvgLinearGradient> {
                        type: 'linear',
                        x1: svg.x1.baseVal.value,
                        x2: svg.x2.baseVal.value,
                        y1: svg.y1.baseVal.value,
                        y2: svg.y2.baseVal.value,
                        x1AsString: svg.x1.baseVal.valueAsString,
                        x2AsString: svg.x2.baseVal.valueAsString,
                        y1AsString: svg.y1.baseVal.valueAsString,
                        y2AsString: svg.y2.baseVal.valueAsString,
                        colorStops: SvgBuild.createColorStops(svg)
                    });
                }
                else if (svg instanceof SVGRadialGradientElement) {
                    this.defs.gradient.set(`@${svg.id}`, <SvgRadialGradient> {
                        type: 'radial',
                        cx: svg.cx.baseVal.value,
                        cy: svg.cy.baseVal.value,
                        r: svg.r.baseVal.value,
                        cxAsString: svg.cx.baseVal.valueAsString,
                        cyAsString: svg.cy.baseVal.valueAsString,
                        rAsString: svg.r.baseVal.valueAsString,
                        fx: svg.fx.baseVal.value,
                        fy: svg.fy.baseVal.value,
                        fxAsString: svg.fx.baseVal.valueAsString,
                        fyAsString: svg.fy.baseVal.valueAsString,
                        colorStops: SvgBuild.createColorStops(svg)
                    });
                }
            }
        });
        const useMap = new Map<string, string>();
        let currentGroup: SvgGroup | undefined;
        function appendShape(item: Element) {
            let shape: SvgElement | undefined;
            if (isSvgShape(item)) {
                shape = new SvgElement(item);
                if (item.id && shape.path) {
                    useMap.set(`#${item.id}`, shape.path.d);
                }
            }
            else if (isSvgImage(item)) {
                shape = new SvgImage(item);
            }
            if (currentGroup && shape) {
                currentGroup.append(shape);
            }
        }
        for (let i = 0; i < element.children.length; i++) {
            const item = element.children[i];
            if (item instanceof SVGSVGElement) {
                currentGroup = new SvgGroupViewBox(item);
                this.append(currentGroup);
            }
            else if (item instanceof SVGGElement) {
                currentGroup = new SvgGroup(item);
                this.append(currentGroup);
            }
            else if (item instanceof SVGUseElement) {
                currentGroup = new SvgUse(item);
                this.append(currentGroup);
            }
            else {
                if (currentGroup === undefined) {
                    currentGroup = new SvgGroup(element);
                    this.append(currentGroup);
                }
                appendShape(item);
                continue;
            }
            for (let j = 0; j < item.children.length; j++) {
                appendShape(item.children[j]);
            }
            currentGroup = undefined;
        }
        this.each(item => {
            if (item instanceof SvgUse) {
                const path = useMap.get(item.element.href.baseVal);
                if (path) {
                    item.setPath(path);
                }
            }
        });
        this.retain(this.filter(item => item.length > 0 || item instanceof SvgUse && item.path !== undefined));
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
        return this.element.transform.baseVal;
    }
}