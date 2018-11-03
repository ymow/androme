declare global {
    namespace androme.lib.base {
        export interface SvgBase {
            readonly element: SVGGraphicsElement | undefined;
            setElement(element: SVGGraphicsElement): void;
            build(): void;
        }
        export interface Svg extends Container<SvgGroup>, SvgBase {
            name: string;
            readonly defs: SvgDefs<SvgImage, SvgPath>;
            readonly width: number;
            readonly height: number;
            readonly viewBoxWidth: number;
            readonly viewBoxHeight: number;
            readonly opacity: number;
            setDimensions(width: number, height: number): void;
            setViewBox(width: number, height: number): void;
            setOpacity(value: string | number): void;
        }
        export class Svg implements Svg {}
    }
}

export {};