import SvgElement from './svgelement';
import SvgPath from './svgpath';

export default class SvgUse extends SvgElement implements androme.lib.base.SvgUse {
    constructor(
        public readonly element: SVGUseElement,
        d: string)
    {
        super(element);
        this.path = new SvgPath(element, d);
    }

    get drawable() {
        return false;
    }

    get animatable() {
        return false;
    }

    get transformable() {
        return false;
    }
}