declare global {
    namespace androme.lib.base {
        export interface Svg extends Container<SvgGroup<SvgPath>> {
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
        export interface SvgElement {
            element: SVGGraphicsElement;
            name: string;
            x: number;
            y: number;
            width: number;
            height: number;
            transform: SvgTransformAttributes;
        }
        export interface SvgGroup<T> extends Container<T>, SvgElement {}
        export interface SvgImage extends SvgElement {
            element: SVGImageElement;
            uri: string;
            readonly imageAsset: ImageAsset;
        }
        export interface SvgPath {
            element: SVGGraphicsElement;
            name: string;
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
        }
    }
}

export {};