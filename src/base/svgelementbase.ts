import Svg from './svg';
import Container from './container';
import SvgPath from './svgpath';

export default (Base: Constructor<Container<SvgPath>>) => {
    return class SvgElement extends Base implements androme.lib.base.SvgElement {
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
    };
};