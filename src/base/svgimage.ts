import SvgElement from './svgelement';

export default class SvgImage extends SvgElement implements androme.lib.base.SvgImage {
    public width: number;
    public height: number;
    public uri = '';

    constructor(
        public readonly element: SVGImageElement,
        uri?: string)
    {
        super(element);
        this.width = element.width.baseVal.value;
        this.height = element.height.baseVal.value;
        if (uri) {
            this.uri = uri;
        }
        this.animate = SvgElement.toAnimateList(element);
    }
}