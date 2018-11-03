import Container from './container';
import Svg from './svg';

export default class SvgGroup<T> extends Container<T> implements androme.lib.base.SvgElement {
    public element: SVGGraphicsElement;
    public name: string;
    public x: number;
    public y: number;
    public width: number;
    public height: number;
    public transform;

    constructor(element?: SVGGraphicsElement) {
        super();
        if (element) {
            this.element = element;
            this.transform = Svg.createTransform(element);
        }
    }
}