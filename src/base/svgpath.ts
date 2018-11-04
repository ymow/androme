import { convertInt, isString } from '../lib/util';
import { cssAttribute, cssInherit } from '../lib/dom';
import { isSvgVisible } from '../lib/svg';
import { parseRGBA } from '../lib/color';

export default class SvgPath implements androme.lib.base.SvgPath {
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

    constructor(element: SVGGraphicsElement, d?: string) {
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
                    if (item.x1.baseVal.value !== 0 || item.y1.baseVal.value !== 0 || item.x2.baseVal.value !== 0 || item.y2.baseVal.value !== 0) {
                        this.d = `M${item.x1.baseVal.value},${item.y1.baseVal.value} L${item.x2.baseVal.value},${item.y2.baseVal.value}`;
                    }
                    break;
                }
                case 'rect': {
                    const item = <SVGRectElement> element;
                    if (item.width.baseVal.value > 0 && item.height.baseVal.value > 0) {
                        const x = item.x.baseVal.value;
                        const y = item.y.baseVal.value;
                        this.d = `M${x},${y} H${x + item.width.baseVal.value} V${y + item.height.baseVal.value} H${x} Z`;
                    }
                    break;
                }
                case 'polyline':
                case 'polygon': {
                    const item = <SVGPolygonElement> element;
                    if (item.points.numberOfItems > 0) {
                        const data: string[] = [];
                        for (let j = 0; j < item.points.numberOfItems; j++) {
                            const pt = item.points.getItem(j);
                            data.push(`${pt.x},${pt.y}`);
                        }
                        this.d = `M${data.join(' ') + (element.tagName === 'polygon' ? ' Z' : '')}`;
                    }
                    break;
                }
                case 'circle': {
                    const item = <SVGCircleElement> element;
                    const r = item.r.baseVal.value;
                    if (r > 0) {
                        this.d = `M${item.cx.baseVal.value},${item.cy.baseVal.value} m-${r},0 a${r},${r} 0 1,0 ${r * 2},0 a${r},${r} 0 1,0 -${r * 2},0`;
                    }
                    break;
                }
                case 'ellipse': {
                    const item = <SVGEllipseElement> element;
                    const rx = item.rx.baseVal.value;
                    const ry = item.ry.baseVal.value;
                    if (rx > 0 && ry > 0) {
                        this.d = `M${item.cx.baseVal.value - rx},${item.cy.baseVal.value} a${rx},${ry} 0 1,0 ${rx * 2},0 a${rx},${ry} 0 1,0 -${rx * 2},0`;
                    }
                    break;
                }
            }
            const values = {
                fill: cssAttribute(element, 'fill'),
                stroke: cssAttribute(element, 'stroke')
            };
            const color = parseRGBA(cssAttribute(element, 'color')) || parseRGBA(cssInherit(element, 'color'));
            const pattern = /url\(#(.*?)\)/;
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