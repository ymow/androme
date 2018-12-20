import Container$SvgPath from './container-svgpath';
import SvgElement$Base from './svgelement-base';

import SvgBuild from './svgbuild';

export default class SvgGroup extends SvgElement$Base(Container$SvgPath) implements androme.lib.base.SvgGroup {
    constructor(public readonly element: SVGGraphicsElement) {
        super(element);
        if (element instanceof SVGGElement) {
            this.animate = SvgBuild.createAnimations(element);
        }
    }
}