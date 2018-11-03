import Container from './container';
import SvgPath from './svgpath';

import { createTransform, isVisible } from '../lib/svg';

export default (Base: Constructor<Container<SvgPath>>) => {
    return class SvgElement extends Base implements androme.lib.base.SvgElement {
        public name = '';
        public x = 0;
        public y = 0;
        public width = 0;
        public height = 0;
        public visibility = true;
        public transform: SvgTransformAttributes | undefined;

        private _element: SVGGraphicsElement | undefined;

        constructor(element?: SVGGraphicsElement) {
            super();
            if (element) {
                this.setElement(element);
                this.build();
                if (this._element) {
                    this.visibility = isVisible(element);
                }
            }
        }

        public setElement(element: SVGGraphicsElement) {
            if (element instanceof SVGGraphicsElement) {
                this._element = element;
            }
        }

        public build() {
            const element = this._element;
            if (element) {
                this.transform = createTransform(element);
            }
        }

        get element() {
            return this._element;
        }
    };
};