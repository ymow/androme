declare global {
    namespace androme.lib.base {
        interface SvgAnimate {
            readonly element: SVGAnimateElement;
            readonly parentElement: SVGGraphicsElement;
            attributeName: string;
            from: string;
            to: string;
            by: string;
            values: string[];
            keyTimes: number[];
            repeatDur: number | undefined;
            repeatCount: number | undefined;
            calcMode: string;
            readonly duration: number;
            readonly begin: number;
            readonly end: number;
            readonly repeatDuration: number;
        }

        export class SvgAnimate implements SvgAnimate {
            public static toFractionList(value: string, delimiter?: string): number[];
            public static convertClockTime(value: string): [number, number];
            constructor(element: SVGAnimateElement, parentElement: SVGGraphicsElement);
        }

        interface SvgAnimateTransform extends SvgAnimate {
            type: number;
            additive: boolean;
            accumulate: boolean;
            freeze: boolean;
        }

        export class SvgAnimateTransform implements SvgAnimateTransform {
            public static toRotateList(values: string[]): (null[] | number[])[] | undefined;
            public static toScaleList(values: string[]): (null[] | number[])[] | undefined;
            public static toTranslateList(values: string[]): (null[] | number[])[] | undefined;
            constructor(element: SVGAnimateTransformElement, parentElement: SVGGraphicsElement);
        }

        interface SvgAnimateMotion extends SvgAnimate {
            path: string;
            keyPoints: number[];
            rotate: number;
            rotateAuto: boolean;
            rotateAutoReverse: boolean;
        }

        export class SvgAnimateMotion implements SvgAnimateMotion {
            constructor(element: SVGAnimateMotionElement, parentElement: SVGGraphicsElement);
        }
    }
}

export {};