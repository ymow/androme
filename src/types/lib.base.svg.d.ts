declare global {
    namespace androme.lib.base {
        export class Svg {
            public element: SVGSVGElement;
            public name: string;
            public readonly defs: SvgDefs<SvgImage, SvgPath>;
            public readonly children: SvgGroup[];
            public readonly width: number;
            public readonly height: number;
            public readonly viewBoxWidth: number;
            public readonly viewBoxHeight: number;
            public readonly opacity: number;
            public readonly length: number;
            constructor(element: SVGSVGElement);
            public setDimensions(width: number, height: number): void;
            public setViewBox(width: number, height: number): void;
            public setOpacity(value: string | number): void;
            public append(value: SvgGroup): void;
            public replace(value: SvgGroup[]): void;
        }
        export abstract class SvgElement {
            public element: SVGGraphicsElement;
            public name: string;
            public x?: number;
            public y?: number;
            public width?: number;
            public height?: number;
            public readonly transform: SvgTransformAttributes;
            constructor(element: SVGGraphicsElement);
        }
        export class SvgGroup extends SvgElement {
            public readonly children: SvgPath[];
            public readonly length: number;
            public append(value: SvgPath);
            public replace(value: SvgPath[]): void;
        }
        export class SvgImage extends SvgElement {
            public element: SVGImageElement;
            public uri: string;
            public readonly imageAsset: ImageAsset;
            constructor(element: SVGImageElement, uri: string);
        }
        export class SvgPath {
            public element: SVGGraphicsElement;
            public name: string;
            public d: string;
            public color: string;
            public fillRule: string;
            public fill: string;
            public fillOpacity: number;
            public stroke: string;
            public strokeWidth: string;
            public strokeOpacity: number;
            public strokeLinecap: string;
            public strokeLinejoin: string;
            public strokeMiterlimit: string;
            public clipPath: string;
            public clipRule: string;
            constructor(element: SVGGraphicsElement, d: string);
        }
    }
}

export {};