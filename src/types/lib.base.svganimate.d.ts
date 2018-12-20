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
            pathValues?: string[];
            keyTimes: number[];
            begin: number;
            beginMS: number;
            end: number;
            endMS: number;
            duration: number;
            durationMS: number;
            repeatDuration: number | undefined;
            repeatDurationMS: number | undefined;
            repeatCount: number | undefined;
            calcMode: string;
            additive: boolean;
            accumulate: boolean;
            freeze: boolean;
            build(): void;
        }

        export class SvgAnimate implements SvgAnimate {
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