declare global {
    namespace android.lib.base {
        export interface File<T extends View> extends androme.lib.base.File<T> {
            layoutAllToXml(data: SessionData<androme.lib.base.NodeList<T>>, saveToDisk?: boolean);
            resourceAllToXml(saveToDisk?: boolean);
            resourceStringToXml(saveToDisk?: boolean);
            resourceStringArrayToXml(saveToDisk?: boolean);
            resourceFontToXml(saveToDisk?: boolean);
            resourceColorToXml(saveToDisk?: boolean);
            resourceStyleToXml(saveToDisk?: boolean);
            resourceDimenToXml(saveToDisk?: boolean);
            resourceDrawableToXml(saveToDisk?: boolean);
        }
    }
}

export {};