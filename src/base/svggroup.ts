import Container from './container';
import SvgAnimate from './svganimate';
import SvgBuild from './svgbuild';
import SvgElement from './svgelement';

import { isVisible } from '../lib/svg';

export default class SvgGroup extends Container<SvgElement> implements androme.lib.base.SvgGroup {
    public readonly name: string;
    public readonly animate: SvgAnimate[];
    public visible = true;

    constructor(public readonly element: SVGGraphicsElement) {
        super();
        this.name = SvgBuild.setName(element);
        this.animate = this.animatable ? SvgElement.toAnimateList(element) : [];
        this.visible = isVisible(element);
    }

    get transform() {
        return this.element.transform.baseVal;
    }

    get animatable() {
        return this.element instanceof SVGGElement;
    }

    get transformable() {
        return this.element instanceof SVGGElement && this.transform.numberOfItems > 0;
    }
}