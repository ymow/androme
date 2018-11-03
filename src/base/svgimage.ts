import SvgElement from './svgelement';

export default class SvgImage extends SvgElement {
    public element: SVGImageElement;
    public readonly imageAsset: ImageAsset = {
        width: 0,
        height: 0
    };

    constructor(
        element: SVGImageElement | undefined,
        public uri: string)
    {
        super(element);
    }
}