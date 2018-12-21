import { REGEX_PATTERN } from '../lib/constant';

import SvgBuild from './svgbuild';

import { parseRGBA } from '../lib/color';
import { cssAttribute } from '../lib/dom';
import { getTransformOrigin } from '../lib/svg';

export default class SvgPath implements androme.lib.base.SvgPath {
    public static getLine(x1: number, y1: number, x2 = 0, y2 = 0) {
        return x1 !== 0 || y1 !== 0 || x2 !== 0 || y2 !== 0 ? `M${x1},${y1} L${x2},${y2}` : '';
    }

    public static getRect(width: number, height: number, x = 0, y = 0) {
        return width > 0 && height > 0 ? `M${x},${y} h${width} v${height} h${-width} Z` : '';
    }

    public static getPolyline(points: Point[] | DOMPoint[] | SVGPointList) {
        points = points instanceof SVGPointList ? SvgBuild.toPointList(points) : points;
        return points.length ? `M${points.map(item => `${item.x},${item.y}`).join(' ')}` : '';
    }

    public static getPolygon(points: Point[] | DOMPoint[] | SVGPointList) {
        const value = this.getPolyline(points);
        return value !== '' ? value + ' Z' : '';
    }

    public static getCircle(cx: number, cy: number, r: number) {
        return r > 0 ? this.getEllipse(cx, cy, r, r) : '';
    }

    public static getEllipse(cx: number, cy: number, rx: number, ry: number) {
        return rx > 0 && ry > 0 ? `M${cx - rx},${cy} a${rx},${ry},0,1,0,${rx * 2},0 a${rx},${ry},0,1,0,-${rx * 2},0` : '';
    }

    public transformed = false;
    public opacity = 1;
    public color = '';
    public fillRule = '';
    public fill = '';
    public fillOpacity = '';
    public stroke = '';
    public strokeWidth = '';
    public strokeOpacity = '';
    public strokeLinecap = '';
    public strokeLinejoin = '';
    public strokeMiterlimit = '';
    public clipPath = '';
    public clipRule = '';

    constructor(
        public readonly element: SVGGraphicsElement,
        public d = '')
    {
        this.init();
    }

    public setColor(attr: string) {
        let value = cssAttribute(this.element, attr);
        const match = REGEX_PATTERN.LINK_HREF.exec(value);
        if (match) {
            value = `@${match[1]}`;
        }
        else if (value !== '') {
            switch (value.toLowerCase()) {
                case 'none':
                case 'transparent':
                case 'rgba(0, 0, 0, 0)':
                    value = '';
                    break;
                case 'currentcolor': {
                    const color = parseRGBA(cssAttribute(this.element, 'color', true));
                    value = color ? color.valueRGB : '#000000';
                    break;
                }
                default: {
                    const color = parseRGBA(value);
                    if (color) {
                        value = color.valueRGB;
                    }
                    break;
                }
            }
        }
        else {
            if (attr === 'fill' && !(this.element.parentElement instanceof SVGGElement)) {
                value = '#000000';
            }
        }
        this[attr] = value;
    }

    public setOpacity(attr: string) {
        const opacity = cssAttribute(this.element, `${attr}-opacity`);
        this[`${attr}Opacity`] = opacity ? (parseFloat(opacity) * this.opacity).toString() : this.opacity.toString();
    }

    private init() {
        const element = this.element;
        if (this.d === '') {
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
                        this.d = SvgPath.getPolyline(SvgBuild.applyTransforms(transform, points, getTransformOrigin(element)));
                        this.transformed = true;
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
                        this.d = SvgPath.getPolygon(SvgBuild.applyTransforms(transform, points, getTransformOrigin(element)));
                        this.transformed = true;
                    }
                    else {
                        this.d = SvgPath.getRect(width, height, x, y);
                    }
                    break;
                }
                case 'polyline':
                case 'polygon': {
                    const item = <SVGPolygonElement> element;
                    let points = SvgBuild.toPointList(item.points);
                    if (transform.numberOfItems) {
                        points = SvgBuild.applyTransforms(transform, points, getTransformOrigin(element));
                        this.transformed = true;
                    }
                    this.d = element.tagName === 'polygon' ? SvgPath.getPolygon(points) : SvgPath.getPolyline(points);
                    break;
                }
            }
        }
        const href = REGEX_PATTERN.LINK_HREF.exec(cssAttribute(element, 'clip-path'));
        if (href) {
            this.clipPath = href[1];
            this.clipRule = cssAttribute(element, 'clip-rule', true);
        }
        const opacity = cssAttribute(element, 'opacity');
        if (opacity) {
            this.opacity = Math.min(parseFloat(opacity), 1);
        }
        this.setColor('fill');
        if (this.fill) {
            this.setOpacity('fill');
            this.fillRule = cssAttribute(element, 'fill-rule', true);
        }
        this.setColor('stroke');
        if (this.stroke) {
            this.setOpacity('stroke');
            this.strokeWidth = cssAttribute(element, 'stroke-width') || '1';
            this.strokeLinecap = cssAttribute(element, 'stroke-linecap', true);
            this.strokeLinejoin = cssAttribute(element, 'stroke-linejoin', true);
            this.strokeMiterlimit = cssAttribute(element, 'stroke-miterlimit', true);
        }
    }
}