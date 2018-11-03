import Container from './container';
import SvgGroup from './svggroup';
import SvgPath from './svgpath';
import SvgImage from './svgimage';

import { cssAttribute, getStyle, parseBackgroundPosition } from '../lib/dom';

export default class Svg extends Container<SvgGroup> implements androme.lib.base.Svg {
    public static isVisible(element: SVGGraphicsElement) {
        return cssAttribute(element, 'display') !== 'none' && !['hidden', 'collpase'].includes(cssAttribute(element, 'visibility'));
    }

    public static createSvgPath(element: SVGGraphicsElement) {
        function buildSvgPath(path: SVGGraphicsElement, d: string) {
            if (Svg.isVisible(path)) {
                return new SvgPath(path, d);
            }
            return undefined;
        }
        switch (element.tagName) {
            case 'path': {
                const subitem = <SVGPathElement> element;
                return buildSvgPath(subitem, cssAttribute(subitem, 'd'));
            }
            case 'line': {
                const subitem = <SVGLineElement> element;
                if (subitem.x1.baseVal.value !== 0 || subitem.y1.baseVal.value !== 0 || subitem.x2.baseVal.value !== 0 || subitem.y2.baseVal.value !== 0) {
                    const path = buildSvgPath(subitem, `M${subitem.x1.baseVal.value},${subitem.y1.baseVal.value} L${subitem.x2.baseVal.value},${subitem.y2.baseVal.value}`);
                    if (path && path.stroke) {
                        path.fill = '';
                        return path;
                    }
                }
                break;
            }
            case 'rect': {
                const subitem = <SVGRectElement> element;
                if (subitem.width.baseVal.value > 0 && subitem.height.baseVal.value > 0) {
                    const x = subitem.x.baseVal.value;
                    const y = subitem.y.baseVal.value;
                    return buildSvgPath(subitem, `M${x},${y} H${x + subitem.width.baseVal.value} V${y + subitem.height.baseVal.value} H${x} Z`);
                }
                break;
            }
            case 'polyline':
            case 'polygon': {
                const subitem = <SVGPolygonElement> element;
                if (subitem.points.numberOfItems > 0) {
                    const d: string[] = [];
                    for (let j = 0; j < subitem.points.numberOfItems; j++) {
                        const point = subitem.points.getItem(j);
                        d.push(`${point.x},${point.y}`);
                    }
                    return buildSvgPath(subitem, `M${d.join(' ') + (element.tagName === 'polygon' ? ' Z' : '')}`);
                }
                break;
            }
            case 'circle': {
                const subitem = <SVGCircleElement> element;
                const r = subitem.r.baseVal.value;
                if (r > 0) {
                    return buildSvgPath(subitem, `M${subitem.cx.baseVal.value},${subitem.cy.baseVal.value} m-${r},0 a${r},${r} 0 1,0 ${r * 2},0 a${r},${r} 0 1,0 -${r * 2},0`);
                }
                break;
            }
            case 'ellipse': {
                const subitem = <SVGEllipseElement> element;
                const rx = subitem.rx.baseVal.value;
                const ry = subitem.ry.baseVal.value;
                if (rx > 0 && ry > 0) {
                    return buildSvgPath(subitem, `M${subitem.cx.baseVal.value - rx},${subitem.cy.baseVal.value} a${rx},${ry} 0 1,0 ${rx * 2},0 a${rx},${ry} 0 1,0 -${rx * 2},0`);
                }
                break;
            }
        }
        return undefined;
    }

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