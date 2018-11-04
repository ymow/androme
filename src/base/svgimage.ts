import SvgElement from './svgelement';

export default class SvgImage extends SvgElement implements androme.lib.base.SvgImage {
    public uri = '';

    constructor(
        element?: SVGImageElement,
        uri?: string)
    {
        super(element);
        if (uri) {
            this.uri = uri;
        }
    }

    public setElement(element: SVGImageElement) {
        if (element instanceof SVGImageElement) {
            this._element = element;
        }
    }
}