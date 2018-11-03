declare global {
    namespace androme.lib.base {
        export interface Svg extends Container<SvgGroup> {
            element: SVGSVGElement;
            name: string;
            readonly defs: SvgDefs<SvgImage, SvgPath>;
            readonly width: number;
            readonly height: number;
            readonly viewBoxWidth: number;
            readonly viewBoxHeight: number;
            readonly opacity: number;
            readonly length: number;
            setDimensions(width: number, height: number): void;
            setViewBox(width: number, height: number): void;
            setOpacity(value: string | number): void;
        }
        export class Svg implements Svg {
            public static isVisible(element: SVGGraphicsElement): boolean;
            public static createSvgPath(element: SVGGraphicsElement): SvgPath;
        }
    }
}

export {};