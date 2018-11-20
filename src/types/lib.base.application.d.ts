declare global {
    namespace androme.lib.base {
        export interface Application<T extends Node> {
            settings: Settings;
            viewController: Controller<T>;
            resourceHandler: Resource<T>;
            nodeObject: Constructor<T>;
            loading: boolean;
            closed: boolean;
            appName: string;
            readonly framework: number;
            readonly builtInExtensions: ObjectMap<Extension<T>>;
            readonly session: AppSession<NodeList<T>>;
            readonly processing: AppProcessing<T, NodeList<T>>;
            readonly extensions: Set<Extension<T>>;
            readonly parseElements: Set<Element>;
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
            addLayoutFile(filename: string, content: string, pathname?: string, documentRoot?: boolean): void;
            addIncludeFile(filename: string, content: string): void;
            addRenderTemplate(node: T, parent: T, output: string, group: boolean);
            addRenderQueue(id: string, templates: string[]): void;
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
            public static isConstraintFloat<T extends Node>(nodes: T[], floated: Set<string>, linearX?: boolean): boolean;
            public static isFrameHorizontal<T extends Node>(nodes: T[], floated: Set<string>, cleared: Map<T, string>, lineBreak?: boolean): boolean;
            public static isRelativeHorizontal<T extends Node>(nodes: T[], cleared?: Map<T, string>): boolean;
            constructor(framework: number);
        }
    }
}

export {};