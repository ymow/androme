import Container from './container';
import SvgGroup from './svggroup';
import SvgPath from './svgpath';
import SvgImage from './svgimage';

import { getStyle, parseBackgroundPosition } from '../lib/dom';

export default class Svg extends Container<SvgGroup<SvgPath>> implements androme.lib.base.Svg {
    public static createTransform(element: SVGGraphicsElement) {
        const data: SvgTransformAttributes = {
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
        for (let i = 0; i < element.transform.baseVal.numberOfItems; i++) {
            const item = element.transform.baseVal.getItem(i);
            switch (item.type) {
                case SVGTransform.SVG_TRANSFORM_TRANSLATE:
                    data.translateX += item.matrix.e;
                    data.translateY += item.matrix.f;
                    break;
                case SVGTransform.SVG_TRANSFORM_SCALE:
                    data.scaleX *= item.matrix.a;
                    data.scaleY *= item.matrix.d;
                    break;
                case SVGTransform.SVG_TRANSFORM_ROTATE:
                    data.rotateAngle += item.angle;
                    if (item.matrix.e > 0) {
                        data.rotateX = Math.round((item.matrix.e - item.matrix.f) / 2);
                        data.rotateY = item.matrix.e - data.rotateX;
                    }
                    break;
                case SVGTransform.SVG_TRANSFORM_SKEWX:
                    data.skewX += item.angle;
                    break;
                case SVGTransform.SVG_TRANSFORM_SKEWY:
                    data.skewY += item.angle;
                    break;
            }
        }
        const style = getStyle(element);
        if (style.transformOrigin && style.transformOrigin !== '0px 0px' && style.transformOrigin !== 'left top') {
            data.origin = parseBackgroundPosition(style.transformOrigin, element.getBoundingClientRect(), style.fontSize || '');
        }
        return data;
    }

    public name: string;
    public readonly defs: SvgDefs<SvgImage, SvgPath> = {
        image: [],
        clipPath: new Map<string, SvgPath[]>(),
        gradient: new Map<string, Gradient>()
    };

    private _width = 0;
    private _height = 0;
    private _viewBoxWidth = 0;
    private _viewBoxHeight = 0;
    private _opacity = 1;

    constructor(public element: SVGSVGElement) {
        super();
    }

    public setDimensions(width: number, height: number) {
        this._width = width;
        this._height = height;
    }

    public setViewBox(width: number, height: number) {
        this._viewBoxWidth = width;
        this._viewBoxHeight = height;
    }

    public setOpacity(value: string | number) {
        value = parseFloat(value.toString());
        this._opacity = !isNaN(value) && value < 1 ? value : 1;
    }

    get width() {
        return this._width;
    }
    get height() {
        return this._height;
    }

    get viewBoxWidth() {
        return this._viewBoxWidth;
    }
    get viewBoxHeight() {
        return this._viewBoxHeight;
    }

    get opacity() {
        return this._opacity;
    }
}