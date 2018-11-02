import SvgElement from './svgelement';

export default class SvgImage extends SvgElement {
    public readonly imageAsset: ImageAsset = {
        width: 0,
        height: 0
    };

    constructor(
        public element: SVGImageElement,
        public uri: string)
    {
        super(element);
    }
}