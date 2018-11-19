interface LayoutMapX<T> {
    [key: number]: ObjectIndex<T[]>;
    length: number;
}

type LayoutMapY<T> = Map<number, Map<number, T>>;

interface Settings {
    builtInExtensions: string[];
    resolutionDPI: number;
    renderInlineText: boolean;
    preloadImages: boolean;
    autoSizePaddingAndBorderWidth: boolean;
    alwaysReevaluateResources: boolean;
    whitespaceHorizontalOffset: number;
    whitespaceVerticalOffset: number;
    supportNegativeLeftTop: boolean;
    floatOverlapDisabled: boolean;
    hideOffScreenElements: boolean;
    collapseUnattributedElements: boolean;
    customizationsOverwritePrivilege: boolean;
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
    inline: {
        always: string[];
        tagName: Set<string>
    };
    unsupported: {
        tagName: Set<string>
    };
    constraint: {
        alignParentBottomOffset: number;
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
    settings: Settings;
}

interface AppCurrent<T extends androme.lib.base.Node> {
    application: androme.lib.base.Application<T>;
    settings: Settings;
    cache: androme.lib.base.NodeList<T>;
}

interface AppSession<T> {
    cache: T;
    image: Map<string, ImageAsset>;
    renderQueue: Map<string, string[]>;
}

interface AppProcessing<T, U> {
    cache: U;
    depthMap: Map<string, Map<number, string>>;
    node: T | null;
    layout: FileAsset | null;
}

interface ExtensionDependency {
    name: string;
    preload: boolean;
}

interface ExtensionResult<T> {
    output: string;
    complete?: boolean;
    next?: boolean;
    parent?: androme.lib.base.Node;
    renderAs?: androme.lib.base.Node;
    renderOutput?: string;
    include?: boolean;
}

interface ViewData<T> {
    cache: T;
    views: FileAsset[];
    includes: FileAsset[];
}