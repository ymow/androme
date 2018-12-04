declare global {
    namespace android.lib.base {
        export interface File<T extends View> extends androme.lib.base.File<T> {
            layoutAllToXml(data: SessionData<androme.lib.base.NodeList<T>>, saveToDisk?: boolean): {};
            resourceAllToXml(saveToDisk?: boolean): {};
            resourceStringToXml(saveToDisk?: boolean): string;
            resourceStringArrayToXml(saveToDisk?: boolean): string;
            resourceFontToXml(saveToDisk?: boolean): string;
            resourceColorToXml(saveToDisk?: boolean): string;
            resourceStyleToXml(saveToDisk?: boolean): string;
            resourceDimenToXml(saveToDisk?: boolean): string;
            resourceDrawableToXml(saveToDisk?: boolean): string;
        }

        export class File<T extends View> implements File<T> {}
    }
}

export {};