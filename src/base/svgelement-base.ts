import Container from './container';
import SvgPath from './svgpath';

import { isSvgVisible } from '../lib/svg';

export default (Base: Constructor<Container<SvgPath>>) => {
    return class SvgElement extends Base implements androme.lib.base.SvgElement {
        public name = '';
        public viewable = true;
        public x: number | undefined;
        public y: number | undefined;
        public width: number | undefined;
        public height: number | undefined;
        public visibility = true;

        constructor(public readonly element: SVGGraphicsElement) {
            super();
            this.name = element.id;
            this.visibility = isSvgVisible(element);
        }

        public build() {}
    };
};