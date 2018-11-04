declare global {
    namespace androme.lib.base {
        export interface Application<T extends Node> {
            settings: Settings;
            viewController: Controller<T>;
            resourceHandler: Resource<T>;
            nodeObject: NodeConstructor<T>;
            builtInExtensions: ObjectMap<Extension<T>>;
            renderQueue: ObjectMap<string[]>;
            loading: boolean;
            appName: string;
            nodeProcessing: T | undefined;
            layoutProcessing: FileAsset;
            closed: boolean;
            readonly framework: number;
            readonly cacheImage: Map<string, ImageAsset>;
            readonly cacheSession: NodeList<T>;
            readonly cacheProcessing: NodeList<T>;
            readonly viewElements: Set<Element>;
            readonly extensions: Extension<T>[];
            readonly layouts: FileAsset[];
            readonly viewData: ViewData<NodeList<T>>;
            readonly size: number;
            registerController(controller: Controller<T>): void;
            registerResource(resource: Resource<T>): void;
            registerExtension(ext: Extension<T>): boolean;
            finalize(): void;
            saveAllToDisk(): void;
            reset(): void;
            parseDocument(...elements: Null<string | Element>[]): FunctionMap<void>;
            setConstraints(): void;
            setResources(): void;
            createCache(rootElement: HTMLElement): boolean;
            createDocument(): void;
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
            preserveRenderPosition(node: T): void;
            getExtension(name: string): Extension<T> | undefined;
            insertNode(element: Element, parent?: T): T | undefined;
            toString(): string;
        }

        export class Application<T extends Node> implements Application<T> {
            constructor(framework: number);
        }
    }
}

export {};