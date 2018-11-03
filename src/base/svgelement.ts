import Svg from './svg';

export default abstract class SvgElement {
    public element: SVGGraphicsElement;
    public name: string;
    public x: number;
    public y: number;
    public width: number;
    public height: number;
    public transform: SvgTransformAttributes;

    protected constructor(element?: SVGGraphicsElement) {
        if (element) {
            this.element = element;
            this.transform = Svg.createTransform(element);
        }
    }
}