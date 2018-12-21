import SvgAnimate from './svganimate';
import SvgAnimateTransform from './svganimatetransform';
import SvgBuild from './svgbuild';
import SvgPath from './svgpath';

import { isVisible } from '../lib/svg';

export default class SvgElement implements androme.lib.base.SvgElement {
    public static toAnimateList(element: SVGGraphicsElement) {
        const result: SvgAnimate[] = [];
        for (let i = 0; i < element.children.length; i++) {
            const item = element.children[i];
            if (item instanceof SVGAnimateTransformElement) {
                result.push(new SvgAnimateTransform(item, element));
            }
            else if (item instanceof SVGAnimateElement) {
                result.push(new SvgAnimate(item, element));
            }
        }
        return result;
    }

    public path: SvgPath | undefined;

    public readonly name: string;
    public readonly animate: SvgAnimate[];
    public readonly visible: boolean;

    constructor(public readonly element: SVGGraphicsElement) {
        this.name = SvgBuild.setName(element);
        this.animate = this.animatable ? SvgElement.toAnimateList(element) : [];
        this.visible = isVisible(element);
        if (this.drawable) {
            const path = new SvgPath(element);
            if (path.d && path.d !== 'none') {
                this.path = path;
            }
        }
    }

    get transform() {
        return this.element.transform.baseVal;
    }

    get drawable() {
        return true;
    }

    get animatable() {
        return true;
    }

    get transformable() {
        return this.transform.numberOfItems > 0;
    }
}