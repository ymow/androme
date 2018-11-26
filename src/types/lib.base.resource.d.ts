declare global {
    namespace androme.lib.base {
        export interface Resource<T extends Node> extends AppCurrent<T> {
            application: Application<T>;
            cache: NodeList<T>;
            fileHandler: File<T>;
            userSettings: UserSettings;
            finalize(data: SessionData<NodeList<T>>): void;
            reset(): void;
            setBoxSpacing(): void;
            setBoxStyle(): void;
            setFontStyle(): void;
            setValueString(): void;
            setImageSource(): void;
            setOptionArray(): void;
        }

        export class Resource<T extends Node> implements Resource<T> {
            public static KEY_NAME: string;
            public static ASSETS: ResourceAssetMap;
            public static STORED: ResourceStoredMap;
            public static generateId(section: string, name: string, start: number): string;
            public static getStoredName(asset: string, value: any): string;
            public static insertStoredAsset(asset: string, name: string, value: any): string;
            public static isBorderVisible(border: BorderAttribute | undefined): boolean;
            public static isBackgroundVisible<T extends Node>(node: T): boolean;
            public static hasDrawableBackground(object: BoxStyle | undefined): boolean;
            constructor(fileHandler: File<T>);
        }
    }
}

export {};