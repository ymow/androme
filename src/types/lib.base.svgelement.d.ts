declare global {
    namespace androme.lib.base {
        export interface SvgElement extends SvgBase {
            viewable: boolean;
            x?: number;
            y?: number;
            visibility: boolean;
        }

        export interface SvgGroup extends SvgElement, Container<SvgPath> {}

        export class SvgGroup implements SvgGroup {}

        export interface SvgImage extends SvgElement {
            width: number;
            height: number;
            uri: string;
        }

        export class SvgImage implements SvgImage {}
    }
}

export {};