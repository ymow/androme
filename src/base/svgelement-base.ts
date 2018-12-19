import Container from './container';
import SvgBuild from './svgbuild';
import SvgPath from './svgpath';

import { isVisible } from '../lib/svg';

export default (Base: Constructor<Container<SvgPath>>) => {
    return class SvgElement extends Base implements androme.lib.base.SvgElement {
        public name = '';
        public viewable = true;
        public x: number | undefined;
        public y: number | undefined;
        public width: number | undefined;
        public height: number | undefined;
        public visibility = true;
        public animate: SvgAnimate[] = [];

        constructor(public readonly element: SVGGraphicsElement) {
            super();
            this.name = SvgBuild.setName(element);
            this.visibility = isVisible(element);
        }

        public build() {}
    };
};