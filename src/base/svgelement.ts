import { getStyle, parseBackgroundPosition } from '../lib/dom';

export default abstract class SvgElement implements androme.lib.base.SvgElement {
    public name: string;
    public x?: number;
    public y?: number;
    public width?: number;
    public height?: number;
    public readonly transform: SvgTransformAttributes = {
        translateX: 0,
        translateY: 0,
        scaleX: 1,
        scaleY: 1,
        rotateAngle: 0,
        rotateX: 0,
        rotateY: 0,
        skewX: 0,
        skewY: 0
    };

    constructor(public element: SVGGraphicsElement) {
        this.init();
    }

    private init() {
        const element = this.element;
        const transform = this.transform;
        for (let i = 0; i < element.transform.baseVal.numberOfItems; i++) {
            const item = element.transform.baseVal.getItem(i);
            switch (item.type) {
                case SVGTransform.SVG_TRANSFORM_TRANSLATE:
                    transform.translateX += item.matrix.e;
                    transform.translateY += item.matrix.f;
                    break;
                case SVGTransform.SVG_TRANSFORM_SCALE:
                    transform.scaleX *= item.matrix.a;
                    transform.scaleY *= item.matrix.d;
                    break;
                case SVGTransform.SVG_TRANSFORM_ROTATE:
                    transform.rotateAngle += item.angle;
                    if (item.matrix.e > 0) {
                        transform.rotateX = Math.round((item.matrix.e - item.matrix.f) / 2);
                        transform.rotateY = item.matrix.e - transform.rotateX;
                    }
                    break;
                case SVGTransform.SVG_TRANSFORM_SKEWX:
                    transform.skewX += item.angle;
                    break;
                case SVGTransform.SVG_TRANSFORM_SKEWY:
                    transform.skewY += item.angle;
                    break;
            }
        }
        const style = getStyle(element);
        if (style.transformOrigin && style.transformOrigin !== '0px 0px' && style.transformOrigin !== 'left top') {
            transform.origin = parseBackgroundPosition(style.transformOrigin, element.getBoundingClientRect(), style.fontSize || '');
        }
    }
}