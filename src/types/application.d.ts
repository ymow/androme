interface UserSettings {
    builtInExtensions: string[];
    preloadImages: boolean;
    supportNegativeLeftTop: boolean;
    floatOverlapDisabled: boolean;
    insertSpaces: number;
    handleExtensionsAsync: boolean;
    autoCloseOnWrite: boolean;
    outputDirectory: string;
    outputMainFileName: string;
    outputArchiveFileType: string;
    outputMaxProcessingTime: number;
}

interface ControllerSettings {
    baseTemplate: string;
    layout: {
        pathName: string;
        fileExtension: string;
    };
    unsupported: {
        excluded: Set<string>,
        tagName: Set<string>
    };
    relative: {
        boxWidthWordWrapPercent: number;
        superscriptFontScale: number;
        subscriptFontScale: number;
    };
    constraint: {
        withinParentBottomOffset: number;
        percentAccuracy: number;
    };
}

interface AppFramework<T extends androme.lib.base.Node> {
    lib: object;
    system: FunctionMap<any>;
    create(): AppBase<T>;
    cached(): AppBase<T>;
}

interface AppBase<T extends androme.lib.base.Node> {
    application: androme.lib.base.Application<T>;
    framework: number;
    userSettings: UserSettings;
}

interface AppHandler<T extends androme.lib.base.Node> {
    application: androme.lib.base.Application<T>;
    cache: androme.lib.base.NodeList<T>;
    readonly userSettings: UserSettings;
}

interface AppSession<T extends androme.lib.base.Node, U> {
    cache: U;
    image: Map<string, ImageAsset>;
    renderQueue: Map<string, string[]>;
    excluded: androme.lib.base.NodeList<T>;
}

interface AppProcessing<T extends androme.lib.base.Node, U> {
    cache: U;
    depthMap: Map<number, Map<string, string>>;
    node: T | null;
    layout: FileAsset | null;
    excluded: androme.lib.base.NodeList<T>;
}

interface SessionData<T> {
    cache: T;
    views: FileAsset[];
    includes: FileAsset[];
}

interface ExtensionDependency {
    name: string;
    preload: boolean;
}

interface ExtensionResult<T extends androme.lib.base.Node> {
    output: string;
    complete?: boolean;
    next?: boolean;
    parent?: T;
    renderAs?: T;
    outputAs?: string;
    include?: boolean;
}

interface LayoutType {
    containerType: number;
    alignmentType: number;
    renderType: number;
}

interface LayoutResult<T extends androme.lib.base.Node> {
    layout: androme.lib.base.Layout<T>;
    next?: boolean;
    renderAs?: T;
}

interface InitialData<T> {
    iteration: number;
    styleMap: StringMap;
    children: T[];
    bounds?: RectDimension;
    linear?: RectDimension;
    box?: RectDimension;
    documentParent?: T;
}