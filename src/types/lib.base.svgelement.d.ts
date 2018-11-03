declare global {
    namespace androme.lib.base {
        export interface SvgElement extends SvgBase {
            name: string;
            x: number;
            y: number;
            width: number;
            height: number;
            visibility: boolean;
            transform: SvgTransformAttributes | undefined;
        }
        export interface SvgGroup extends SvgElement, Container<SvgPath> {}
        export interface SvgImage extends SvgElement {
            element: SVGImageElement;
            uri: string;
            readonly imageAsset: ImageAsset;
        }
        export class SvgElement implements SvgElement {}
        export class SvgGroup implements SvgGroup {}
        export class SvgImage implements SvgImage {}
    }
}

export {};