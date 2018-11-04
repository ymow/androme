declare global {
    namespace androme.lib.base {
        export interface SvgElement extends SvgBase {
            x?: number;
            y?: number;
            visibility: boolean;
            transform?: SvgTransformAttributes;
        }

        export class SvgElement implements SvgElement {}

        export interface SvgGroup extends SvgElement, Container<SvgPath> {}

        export class SvgGroup implements SvgGroup {}

        export interface SvgImage extends SvgElement {
            uri: string;
        }

        export class SvgImage implements SvgImage {}
    }
}

export {};