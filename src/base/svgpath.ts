import { parseRGBA } from '../lib/color';
import { cssAttribute, cssInherit } from '../lib/dom';
import { applyMatrixX, applyMatrixY, getRadiusY, getTransformOrigin, isSvgVisible } from '../lib/svg';
import { convertInt, isString } from '../lib/util';

export default class SvgPath implements androme.lib.base.SvgPath {
    public static applyTransforms(transform: SVGTransformList, points: Point[], origin?: Point) {
        for (let i = transform.numberOfItems - 1; i >= 0; i--) {
            const item = transform.getItem(i);
            let x1 = 0;
            let y1 = 0;
            let x2 = 0;
            let y2 = 0;
            let x3 = 0;
            let y3 = 0;
            if (origin) {
                switch (item.type) {
                    case SVGTransform.SVG_TRANSFORM_SCALE:
                        x1 += origin.x;
                        y2 += origin.y;
                        break;
                    case SVGTransform.SVG_TRANSFORM_SKEWX:
                        y1 -= origin.y;
                        break;
                    case SVGTransform.SVG_TRANSFORM_SKEWY:
                        x2 -= origin.x;
                        break;
                    case SVGTransform.SVG_TRANSFORM_ROTATE:
                        x2 -= origin.x;
                        y1 -= origin.y;
                        x3 = origin.x + getRadiusY(item.angle, origin.x);
                        y3 = origin.y + getRadiusY(item.angle, origin.y);
                        break;
                }
            }
            points.forEach(pt => {
                const x = pt.x;
                const y = pt.y;
                pt.x = applyMatrixX(item.matrix, x + x1, y + y1) + x3;
                pt.y = applyMatrixY(item.matrix, x + x2, y + y2) + y3;
            });
        }
        return points;
    }

    public static getLine(x1: number, y1: number, x2 = 0, y2 = 0) {
        return x1 !== 0 || y1 !== 0 || x2 !== 0 || y2 !== 0 ? `M${x1},${y1} L${x2},${y2}` : '';
    }

    public static getRect(width: number, height: number, x = 0, y = 0) {
        return width > 0 && height > 0 ? `M${x},${y} H${x + width} V${y + height} H${x} Z` : '';
    }

    public static getPolyline(points: Point[] | DOMPoint[] | SVGPointList) {
        points = points instanceof SVGPointList ? this.toPoints(points) : points;
        return points.length ? `M${points.map(item => `${item.x},${item.y}`).join(' ')}` : '';
    }

    public static getPolygon(points: Point[] | DOMPoint[] | SVGPointList) {
        const value = this.getPolyline(points);
        return value !== '' ? value + ' Z' : '';
    }

    public static getCircle(cx: number, cy: number, r: number) {
        return r > 0 ? `M${cx},${cy} m-${r},0 a${r},${r} 0 1,0 ${r * 2},0 a${r},${r} 0 1,0 -${r * 2},0` : '';
    }

    public static getEllipse(cx: number, cy: number, rx: number, ry: number) {
        return rx > 0 && ry > 0 ? `M${cx - rx},${cy} a${rx},${ry} 0 1,0 ${rx * 2},0 a${rx},${ry} 0 1,0 -${rx * 2},0` : '';
    }

    public static toPoints(points: SVGPointList) {
        const result: Point[] = [];
        for (let j = 0; j < points.numberOfItems; j++) {
            const pt = points.getItem(j);
            result.push({ x: pt.x, y: pt.y });
        }
        return result;
    }

    public name = '';
    public visibility = true;
    public opacity = 1;
    public d = '';
    public color = '';
    public fillRule = '';
    public fill = '';
    public fillOpacity = '1';
    public stroke = '';
    public strokeWidth = '';
    public strokeOpacity = '1';
    public strokeLinecap = '';
    public strokeLinejoin = '';
    public strokeMiterlimit = '';
    public clipPath = '';
    public clipRule = '';

    constructor(
        public readonly element: SVGGraphicsElement,
        d?: string)
    {
        this.name = element.id;
        this.build();
        if (d) {
            this.d = d;
        }
    }

    public build() {
        const element = this.element;
        const transform = element.transform.baseVal;
        switch (element.tagName) {
            case 'path': {
                this.d = cssAttribute(element, 'd');
                break;
            }
            case 'circle': {
                const item = <SVGCircleElement> element;
                this.d = SvgPath.getCircle(item.cx.baseVal.value, item.cy.baseVal.value, item.r.baseVal.value);
                break;
            }
            case 'ellipse': {
                const item = <SVGEllipseElement> element;
                this.d = SvgPath.getEllipse(item.cx.baseVal.value, item.cy.baseVal.value, item.rx.baseVal.value, item.ry.baseVal.value);
                break;
            }
            case 'line': {
                const item = <SVGLineElement> element;
                const x1 = item.x1.baseVal.value;
                const y1 = item.y1.baseVal.value;
                const x2 = item.x2.baseVal.value;
                const y2 = item.y2.baseVal.value;
                if (transform.numberOfItems) {
                    const points: Point[] = [
                        { x: x1, y: y1 },
                        { x: x2, y: y2 }
                    ];
                    this.d = SvgPath.getPolyline(SvgPath.applyTransforms(transform, points, getTransformOrigin(element)));
                }
                else {
                    this.d = SvgPath.getLine(x1, y1, x2, y2);
                }
                break;
            }
            case 'rect': {
                const item = <SVGRectElement> element;
                const x = item.x.baseVal.value;
                const y = item.y.baseVal.value;
                const width = item.width.baseVal.value;
                const height = item.height.baseVal.value;
                if (transform.numberOfItems) {
                    const points: Point[] = [
                        { x, y },
                        { x: x + width, y },
                        { x: x + width, y: y + height },
                        { x, y: y + height }
                    ];
                    this.d = SvgPath.getPolygon(SvgPath.applyTransforms(transform, points, getTransformOrigin(element)));
                }
                else {
                    this.d = SvgPath.getRect(width, height, x, y);
                }
                break;
            }
            case 'polyline':
            case 'polygon': {
                const item = <SVGPolygonElement> element;
                const points = SvgPath.applyTransforms(transform, SvgPath.toPoints(item.points), getTransformOrigin(element));
                this.d = element.tagName === 'polygon' ? SvgPath.getPolygon(points) : SvgPath.getPolyline(points);
                break;
            }
        }
        const values = {
            fill: cssAttribute(element, 'fill'),
            stroke: cssAttribute(element, 'stroke')
        };
        const color = parseRGBA(cssAttribute(element, 'color')) || parseRGBA(cssInherit(element, 'color'));
        const pattern = /url\("?#(.*?)"?\)/;
        for (const attr in values) {
            const match = pattern.exec(values[attr]);
            if (match) {
                values[attr] = `@${match[1]}`;
            }
            else if (isString(values[attr])) {
                switch (values[attr].toLowerCase()) {
                    case 'none':
                    case 'transparent':
                        values[attr] = '';
                        break;
                    case 'currentcolor':
                        values[attr] = color ? color.valueRGB : '';
                        break;
                    default:
                        const rgba = parseRGBA(values[attr]);
                        if (rgba) {
                            values[attr] = rgba.valueRGB;
                        }
                        break;
                }
            }
        }
        const href = pattern.exec(cssAttribute(element, 'clip-path'));
        if (href) {
            this.clipPath = href[1];
        }
        const opacity = parseFloat(cssAttribute(element, 'opacity'));
        if (!isNaN(opacity) && opacity < 1) {
            this.opacity = opacity;
        }
        const fillOpacity = parseFloat(cssAttribute(element, 'fill-opacity')) * this.opacity;
        if (!isNaN(fillOpacity) && fillOpacity < 1) {
            this.fillOpacity = fillOpacity.toString();
        }
        const strokeOpacity = parseFloat(cssAttribute(element, 'stroke-opacity')) * this.opacity;
        if (!isNaN(strokeOpacity) && strokeOpacity < 1) {
            this.strokeOpacity = strokeOpacity.toString();
        }
        if (color) {
            this.color = color.valueRGB;
        }
        this.fillRule = cssAttribute(element, 'fill-rule');
        this.fill = values.fill;
        this.stroke = values.stroke;
        this.strokeWidth = convertInt(cssAttribute(element, 'stroke-width')).toString();
        this.strokeLinecap = cssAttribute(element, 'stroke-linecap');
        this.strokeLinejoin = cssAttribute(element, 'stroke-linejoin');
        this.strokeMiterlimit = cssAttribute(element, 'stroke-miterlimit');
        this.clipRule = cssAttribute(element, 'clip-rule');
        this.visibility = isSvgVisible(element);
    }
}