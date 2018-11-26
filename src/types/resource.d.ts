interface ResourceAssetMap {
    ids: Map<string, string[]>;
    images: Map<string, ImageAsset>;
}

interface ResourceStoredMap {
    strings: Map<string, string>;
    arrays: Map<string, string[]>;
    fonts: Map<string, ObjectMap<boolean>>;
    colors: Map<string, string>;
    styles: Map<string, {}>;
    dimens: Map<string, string>;
    drawables: Map<string, string>;
    images: Map<string, StringMap>;
}

interface Asset {
    uri?: string;
}

interface FileAsset extends Asset {
    pathname: string;
    filename: string;
    content: string;
}

interface ImageAsset extends Asset {
    width: number;
    height: number;
    position?: Point;
}