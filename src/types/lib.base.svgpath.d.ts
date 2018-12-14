declare global {
    namespace androme.lib.base {
        export interface SvgPath extends SvgBase {
            d: string;
            color: string;
            fillRule: string;
            fill: string;
            fillOpacity: number;
            stroke: string;
            strokeWidth: string;
            strokeOpacity: number;
            strokeLinecap: string;
            strokeLinejoin: string;
            strokeMiterlimit: string;
            clipPath: string;
            clipRule: string;
            visibility: boolean;
        }

        export class SvgPath implements SvgPath {
            public static applyTransforms(transform: SvgTransformAttributes, points: Point[]): Point[];
            public static getLine(x1: number, y1: number, x2?: number, y2?: number): string;
            public static getRect(width: number, height: number, x?: number, y?: number): string;
            public static getPolyline(points: Point[] | DOMPoint[] | SVGPointList): string;
            public static getPolygon(points: Point[] | DOMPoint[] | SVGPointList): string;
            public static getCircle(cx: number, cy: number, r: number): string;
            public static getEllipse(cx: number, cy: number, rx: number, ry: number): string;
            public static toPoints(points: SVGPointList): DOMPoint[];
        }
    }
}

export {};