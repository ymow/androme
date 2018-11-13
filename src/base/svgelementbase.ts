import Container from './container';
import SvgPath from './svgpath';

import { createTransform, createTransformOrigin, isSvgVisible } from '../lib/svg';

export default (Base: Constructor<Container<SvgPath>>) => {
    return class SvgElement extends Base implements androme.lib.base.SvgElement {
        public name = '';
        public visibility = true;
        public x: number | undefined;
        public y: number | undefined;
        public width: number | undefined;
        public height: number | undefined;
        public transform: SvgTransformAttributes | undefined;

        protected _element: SVGGraphicsElement | undefined;

        constructor(element?: SVGGraphicsElement) {
            super();
            if (element) {
                this.setElement(element);
                this.build();
                if (this._element) {
                    this.visibility = isSvgVisible(element);
                }
            }
        }

        public setElement(element: SVGGraphicsElement) {
            if (element instanceof SVGGraphicsElement) {
                this._element = element;
            }
        }

        public setTransformOrigin(dpi: number, fontSize: number) {
            const element = this._element;
            if (element && this.transform && this.transform.length > 0) {
                this.transform.origin = createTransformOrigin(element, dpi, fontSize);
            }
        }

        public build() {
            const element = this._element;
            if (element) {
                this.name = element.id;
                this.transform = createTransform(element);
            }
        }

        get element() {
            return this._element;
        }
    };
};