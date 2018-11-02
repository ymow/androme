import SvgGroup from './svggroup';
import SvgImage from './svgimage';
import SvgPath from './svgpath';

export default class Svg implements androme.lib.base.Svg {
    public name: string;
    public readonly defs: SvgDefs<SvgImage, SvgPath> = {
        image: [],
        clipPath: new Map<string, SvgPath[]>(),
        gradient: new Map<string, Gradient>()
    };
    public readonly children: SvgGroup[] = [];

    private _width = 0;
    private _height = 0;
    private _viewBoxWidth = 0;
    private _viewBoxHeight = 0;
    private _opacity = 1;

    constructor(public element: SVGSVGElement) {
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

    public append(value: SvgGroup) {
        this.children.push(value);
    }

    public replace(value: SvgGroup[]) {
        this.children.length = 0;
        this.children.push(...value);
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

    get length() {
        return this.children.length;
    }
}