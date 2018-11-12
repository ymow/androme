interface LayoutMapX<T> {
    [key: number]: ObjectIndex<T[]>;
    length: number;
}

type LayoutMapY<T> = Map<number, Map<number, T>>;

interface Settings {
    builtInExtensions: string[];
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
    includes: boolean;
    baseTemplate: string;
    inline: {
        always: string[];
        tagName: string[];
    };
    layout: {
        pathName: string;
        fileExtension: string;
    };
    unsupported: {
        tagName: Set<string>
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