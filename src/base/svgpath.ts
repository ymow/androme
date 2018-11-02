import { convertInt, isString } from '../lib/util';
import { cssAttribute, cssInherit } from '../lib/dom';
import { parseRGBA } from '../lib/color';

export default class SvgPath implements androme.lib.base.SvgPath {
    public name: string;
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

    constructor(public element: SVGGraphicsElement, public d: string) {
        this.init();
    }

    private init() {
        const element = this.element;
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
    }
}