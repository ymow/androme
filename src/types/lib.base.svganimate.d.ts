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
            additive: boolean;
            accumulate: boolean;
            freeze: boolean;
            readonly duration: number;
            readonly begin: number;
            readonly end: number;
            readonly repeatDuration: number;
            build(): void;
        }

        export class SvgAnimate implements SvgAnimate {
            public static toFractionList(value: string, delimiter?: string): number[];
            public static convertClockTime(value: string): [number, number];
            constructor(element: SVGAnimateElement, parentElement: SVGGraphicsElement);
        }

        interface SvgAnimateTransform extends SvgAnimate {
            type: number;
            path: string;
            keyPoints: number[];
            rotate: string;
        }

        export class SvgAnimateTransform implements SvgAnimateTransform {
            constructor(element: SVGAnimateElement, parentElement: SVGGraphicsElement);
        }
    }
}

export {};