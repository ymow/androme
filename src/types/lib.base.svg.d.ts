declare global {
    namespace androme.lib.base {
        export interface SvgBase {
            name: string;
            width?: number;
            height?: number;
            animate: SvgAnimate[];
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

        export class SvgBuild {
            public static setName(element: SVGGraphicsElement): string;
            public static applyTransforms(transform: SVGTransformList, points: Point[], origin?: Point): Point[];
            public static toPointList(points: SVGPointList): Point[];
            public static toFractionList(value: string, delimiter?: string): number[];
            public static toCoordinateList(value: string): number[];
            public static toPathCommandList(value: string): SvgPathCommand[];
            public static toClipPathList(element: SVGClipPathElement): SvgPath[];
            public static toColorStopList(element: SVGGradientElement): ColorStop[];
            public static toAnimateList(element: SVGGraphicsElement): SvgAnimate[];
            public static fromCoordinateList(coordinates: number[]): Point[];
            public static fromPathCommandList(commands: SvgPathCommand[]): string;
        }
    }
}

export {};