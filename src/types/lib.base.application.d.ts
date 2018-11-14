declare global {
    namespace androme.lib.base {
        export interface Application<T extends Node> {
            settings: Settings;
            viewController: Controller<T>;
            resourceHandler: Resource<T>;
            nodeObject: Constructor<T>;
            builtInExtensions: ObjectMap<Extension<T>>;
            renderQueue: ObjectMap<string[]>;
            nodeProcessing: T | undefined;
            loading: boolean;
            closed: boolean;
            appName: string;
            layoutProcessing: FileAsset;
            readonly framework: number;
            readonly cacheImage: Map<string, ImageAsset>;
            readonly cacheSession: NodeList<T>;
            readonly cacheProcessing: NodeList<T>;
            readonly depthMapProcessing: Map<string, Map<number, string>>;
            readonly viewElements: Set<Element>;
            readonly extensions: Set<Extension<T>>;
            readonly layouts: FileAsset[];
            readonly viewData: ViewData<NodeList<T>>;
            readonly size: number;
            registerController(controller: Controller<T>): void;
            registerResource(resource: Resource<T>): void;
            installExtension(ext: Extension<T>): boolean;
            removeExtension(ext: Extension<T>): boolean;
            finalize(): void;
            saveAllToDisk(): void;
            reset(): void;
            parseDocument(...elements: Undefined<string | Element>[]): FunctionMap<void>;
            writeFrameLayout(node: T, parent: T, children?: boolean): string;
            writeLinearLayout(node: T, parent: T, horizontal: boolean): string;
            writeGridLayout(node: T, parent: T, columnCount: number, rowCount?: number): string;
            writeRelativeLayout(node: T, parent: T): string;
            writeConstraintLayout(node: T, parent: T): string;
            writeNode(node: T, parent: T, nodeName: number | string): string;
            writeFrameLayoutHorizontal(group: T, parent: T, nodes: T[], cleared: Map<T, string>): string;
            writeFrameLayoutVertical(group: T | undefined, parent: T, nodes: T[], cleared: Map<T, string>): string;
            addLayoutFile(pathname: string, filename: string, content: string, documentRoot?: boolean): void;
            addIncludeFile(filename: string, content: string): void;
            addRenderQueue(id: string, views: string[]): void;
            addPreloadImage(element: HTMLImageElement): void;
            preserveRenderPosition(node: T): void;
            getExtension(name: string): Extension<T> | null;
            getExtensionOptionsValue(name: string, attr: string): any;
            getExtensionOptionsValueAsObject(name: string, attr: string): object | null;
            getExtensionOptionsValueAsString(name: string, attr: string): string;
            getExtensionOptionsValueAsNumber(name: string, attr: string): number;
            getExtensionOptionsValueAsBoolean(name: string, attr: string): boolean;
            toString(): string;
        }

        export class Application<T extends Node> implements Application<T> {
            constructor(framework: number);
        }
    }
}

export {};