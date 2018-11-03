declare global {
    namespace androme.lib.base {
        export interface Resource<T extends Node> extends AppCurrent<T> {
            settings: Settings;
            cache: NodeList<T>;
            application: Application<T>;
            imageAssets: Map<string, ImageAsset>;
            file: File<T>;
            setImageSource(): void;
            finalize(viewData: ViewData<NodeList<T>>): FunctionVoid[];
            addFile(pathname: string, filename: string, content?: string, uri?: string): void;
            reset(): void;
            setBoxSpacing(): void;
            setBoxStyle(): void;
            setFontStyle(): void;
            setValueString(): void;
            setOptionArray(): void;
        }
        export class Resource<T extends Node> implements Resource<T> {
            public static STORED: ResourceMap;
            public static getSvgTransform(element: SVGGraphicsElement): SvgTransformAttributes;
            public static insertStoredAsset(asset: string, name: string, value: any): string;
            public static isBorderVisible(border?: BorderAttribute): boolean;
            public static hasDrawableBackground(object?: BoxStyle): boolean;
            constructor(file: File<T>);
        }
    }
}

export {};