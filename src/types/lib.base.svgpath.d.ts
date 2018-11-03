declare global {
    namespace androme.lib.base {
        export interface SvgPath extends SvgBase {
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
            visibility: boolean;
        }
        export class SvgPath implements SvgPath {}
    }
}

export {};