import Container from './container';
import SvgPath from './svgpath';

import { isSvgVisible } from '../lib/svg';

export default (Base: Constructor<Container<SvgPath>>) => {
    return class SvgElement extends Base implements androme.lib.base.SvgElement {
        public name = '';
        public visibility = true;
        public x = 0;
        public y = 0;
        public width: number | undefined;
        public height: number | undefined;

        constructor(public readonly element: SVGGraphicsElement) {
            super();
            this.name = element.id;
            this.visibility = isSvgVisible(element);
        }

        public build() {}
    };
};