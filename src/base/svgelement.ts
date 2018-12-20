import SvgElement$Base from './svgelement-base';

import SvgAnimate from './svganimate';
import SvgAnimateTransform from './svganimatetransform';

export default abstract class SvgElement extends SvgElement$Base(Object as Constructor<any>) implements androme.lib.base.SvgElement {
    public static toAnimateList(element: SVGGraphicsElement) {
        const result: SvgAnimate[] = [];
        for (let i = 0; i < element.children.length; i++) {
            const item = element.children[i];
            if (item instanceof SVGAnimateTransformElement) {
                result.push(new SvgAnimateTransform(item, element));
            }
            else if (item instanceof SVGAnimateElement) {
                result.push(new SvgAnimate(item, element));
            }
        }
        return result;
    }
}