import Svg from './svg';

export default abstract class SvgElement {
    public element: SVGGraphicsElement | undefined;
    public name = '';
    public x = 0;
    public y = 0;
    public width = 0;
    public height = 0;
    public transform: SvgTransformAttributes | undefined;

    protected constructor(element?: SVGGraphicsElement) {
        if (element) {
            this.element = element;
            this.transform = Svg.createTransform(element);
        }
    }
}