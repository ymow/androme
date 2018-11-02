import SvgElement from './svgelement';
import SvgPath from './svgpath';

export default class SvgGroup extends SvgElement {
    public readonly children: SvgPath[] = [];

    constructor(element: SVGGraphicsElement) {
        super(element);
    }

    public append(value: SvgPath) {
        this.children.push(value);
    }

    public replace(value: SvgPath[]) {
        this.children.length = 0;
        this.children.push(...value);
    }

    get length() {
        return this.children.length;
    }
}