import Container from './container';
import Svg from './svg';

export default class SvgGroup<T> extends Container<T> implements androme.lib.base.SvgElement {
    public element: SVGGraphicsElement | undefined;
    public name = '';
    public x = 0;
    public y = 0;
    public width = 0;
    public height = 0;
    public transform: SvgTransformAttributes | undefined;

    constructor(element?: SVGGraphicsElement) {
        super();
        if (element) {
            this.element = element;
            this.transform = Svg.createTransform(element);
        }
    }
}