declare global {
    namespace androme.lib.base {
        export interface SvgBase {
            name: string;
            width?: number;
            height?: number;
            readonly element: SVGGraphicsElement;
            build(): void;
        }

        export interface Svg extends Container<SvgGroup>, SvgBase {
            readonly defs: SvgDefs<SvgImage, SvgPath>;
            readonly width: number;
            readonly height: number;
            readonly viewBoxWidth: number;
            readonly viewBoxHeight: number;
            readonly opacity: number;
            setViewBox(width: number, height: number): void;
            setOpacity(value: string | number): void;
            setDimensions(width: number, height: number): void;
        }

        export class Svg implements Svg {
            constructor(element: SVGSVGElement);
        }
    }
}

export {};