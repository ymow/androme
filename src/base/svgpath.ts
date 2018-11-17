import { parseRGBA } from '../lib/color';
import { cssAttribute, cssInherit } from '../lib/dom';
import { isSvgVisible } from '../lib/svg';
import { convertInt, isString } from '../lib/util';

export default class SvgPath implements androme.lib.base.SvgPath {
    public static getLine(x1: number, y1: number, x2 = 0, y2 = 0) {
        return x1 !== 0 || y1 !== 0 || x2 !== 0 || y2 !== 0 ? `M${x1},${y1} L${x2},${y2}` : '';
    }
    public static getRect(width: number, height: number, x = 0, y = 0) {
        return width > 0 && height > 0 ? `M${x},${y} H${x + width} V${y + height} H${x} Z` : '';
    }

    public static getPolyline(points: Point[] | DOMPoint[] | SVGPointList) {
        const data: Point[] = [];
        if (points instanceof SVGPointList) {
            for (let j = 0; j < points.numberOfItems; j++) {
                const pt = points.getItem(j);
                data.push(pt);
            }
        }
        else {
            data.push(...points);
        }
        return data.length > 0 ? `M${data.map(item => `${item.x},${item.y}`).join(' ')}` : '';
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

    public name: string;
    public visibility = true;
    public d: string;
    public color: string;
    public fillRule: string;
    public fill: string;
    public fillOpacity: number;
    public stroke: string;
    public strokeWidth: string;
    public strokeOpacity: number;
    public strokeLinecap: string;
    public strokeLinejoin: string;
    public strokeMiterlimit: string;
    public clipPath: string;
    public clipRule: string;

    private _element: SVGGraphicsElement | undefined;

    constructor(
        element: SVGGraphicsElement,
        d?: string)
    {
        if (element) {
            this.setElement(element);
            this.build();
        }
        if (d) {
            this.d = d;
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
            switch (element.tagName) {
                case 'path': {
                    this.d = cssAttribute(element, 'd');
                    break;
                }
                case 'line': {
                    const item = <SVGLineElement> element;
                    this.d = SvgPath.getLine(item.x1.baseVal.value, item.y1.baseVal.value, item.x2.baseVal.value , item.y2.baseVal.value);
                    break;
                }
                case 'rect': {
                    const item = <SVGRectElement> element;
                    this.d = SvgPath.getRect(item.width.baseVal.value, item.height.baseVal.value, item.x.baseVal.value, item.y.baseVal.value);
                    break;
                }
                case 'polyline':
                case 'polygon': {
                    const item = <SVGPolygonElement> element;
                    this.d = element.tagName === 'polygon' ? SvgPath.getPolygon(item.points) : SvgPath.getPolyline(item.points);
                    break;
                }
                case 'circle': {
                    const item = <SVGCircleElement> element;
                    this.d = SvgPath.getCircle(item.cx.baseVal.value , item.cy.baseVal.value, item.r.baseVal.value);
                    break;
                }
                case 'ellipse': {
                    const item = <SVGEllipseElement> element;
                    this.d = SvgPath.getEllipse(item.cx.baseVal.value, item.cy.baseVal.value, item.rx.baseVal.value, item.ry.baseVal.value);
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
            let clipPath = '';
            const href = pattern.exec(cssAttribute(element, 'clip-path'));
            if (href) {
                clipPath = href[1];
            }
            const fillOpacity = parseFloat(cssAttribute(element, 'fill-opacity'));
            const strokeOpacity = parseFloat(cssAttribute(element, 'stroke-opacity'));
            this.name = element.id;
            this.color = color ? color.valueRGB : '';
            this.fillRule = cssAttribute(element, 'fill-rule');
            this.fill = values.fill;
            this.stroke = values.stroke;
            this.strokeWidth = convertInt(cssAttribute(element, 'stroke-width')).toString();
            this.fillOpacity = !isNaN(fillOpacity) && fillOpacity < 1 ? fillOpacity : 1;
            this.strokeOpacity = !isNaN(strokeOpacity) && strokeOpacity < 1 ? strokeOpacity : 1;
            this.strokeLinecap = cssAttribute(element, 'stroke-linecap');
            this.strokeLinejoin = cssAttribute(element, 'stroke-linejoin');
            this.strokeMiterlimit = cssAttribute(element, 'stroke-miterlimit');
            this.clipPath = clipPath;
            this.clipRule = cssAttribute(element, 'clip-rule');
            this.visibility = isSvgVisible(element);
        }
    }

    get element() {
        return this._element;
    }
}