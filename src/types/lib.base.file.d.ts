declare global {
    namespace androme.lib.base {
        export interface File<T extends Node> {
            settings: Settings;
            appName: string;
            stored: ResourceMap;
            readonly queue: FileAsset[];
            saveAllToDisk(data: ViewData<NodeList<T>>): void;
            layoutAllToXml(data: ViewData<NodeList<T>>, saveToDisk?: boolean): StringMap;
            resourceAllToXml(saveToDisk?: boolean): StringMap;
            resourceStringToXml(saveToDisk?: boolean): string;
            resourceStringArrayToXml(saveToDisk?: boolean): string;
            resourceFontToXml(saveToDisk?: boolean): string;
            resourceColorToXml(saveToDisk?: boolean): string;
            resourceStyleToXml(saveToDisk?: boolean): string;
            resourceDimenToXml(saveToDisk?: boolean): string;
            resourceDrawableToXml(saveToDisk?: boolean): string;
            addFile(pathname: string, filename: string, content: string, uri: string): void;
            reset(): void;
            saveToDisk(files: FileAsset[]): void;
        }

        export class File<T extends Node> implements File<T> {
            public static downloadToDisk(data: Blob, filename: string, mime?: string): void;
        }
    }
}

export {};