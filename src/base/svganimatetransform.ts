import SvgAnimate from './svganimate';
import SvgBuild from './svgbuild';

import { isNumber } from '../lib/util';

export default class SvgAnimateTransform extends SvgAnimate implements androme.lib.base.SvgAnimate {
    public type = 0;
    public path = '';
    public keyPoints: number[] = [];
    public rotate = '';

    constructor(element: SVGAnimateElement, parentElement: SVGGraphicsElement) {
        super(element, parentElement);
    }

    public build() {
        super.build();
        const element = this.element;
        const type = element.attributes.getNamedItem('type');
        if (type) {
            switch (type.value) {
                case 'translate':
                    this.type = SVGTransform.SVG_TRANSFORM_TRANSLATE;
                    break;
                case 'scale':
                    this.type = SVGTransform.SVG_TRANSFORM_SCALE;
                    break;
                case 'rotate':
                    this.type = SVGTransform.SVG_TRANSFORM_ROTATE;
                    break;
                case 'skewX':
                    this.type = SVGTransform.SVG_TRANSFORM_SKEWX;
                    break;
                case 'skewY':
                    this.type = SVGTransform.SVG_TRANSFORM_SKEWY;
                    break;
            }
        }
        const path = element.attributes.getNamedItem('path');
        if (path) {
            this.path = path.value.trim();
        }
        const rotate = element.attributes.getNamedItem('rotate');
        if (rotate && (rotate.value === 'auto' || rotate.value === 'auto-reverse' || isNumber(rotate.value))) {
            this.rotate = rotate.value.trim();
        }
        if (this.keyTimes.length) {
            const keyPoints = element.attributes.getNamedItem('keyPoints');
            if (keyPoints) {
                const points = SvgBuild.toFractionList(keyPoints.value);
                if (points.length === this.keyTimes.length) {
                    this.keyPoints = points;
                }
            }
        }
    }
}