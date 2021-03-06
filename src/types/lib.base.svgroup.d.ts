declare global {
    namespace androme.lib.base {
        export interface SvgGroup extends SvgBase, SvgBaseFeature, Container<SvgElement> {}

        export class SvgGroup implements SvgGroup {
            constructor(element: SVGGraphicsElement);
        }

        export interface SvgGroupViewBox extends SvgViewBox, SvgGroup {}

        export class SvgGroupViewBox implements SvgGroupViewBox {
            constructor(element: SVGSVGElement | SVGUseElement);
        }

        export interface SvgUse extends SvgGroupViewBox {
            path: SvgPath | undefined;
            setPath(value: string): void;
        }

        export class SvgUse implements SvgUse {
            constructor(element: SVGUseElement, d: string);
        }
    }
}

export {};