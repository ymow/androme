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
            readonly parseElements: Set<Element>;
            readonly processing: AppProcessing<T, NodeList<T>>;
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
            renderNode(data: LayoutData<T>): string;
            addLayoutFile(filename: string, content: string, pathname?: string, documentRoot?: boolean): void;
            addIncludeFile(filename: string, content: string): void;
            addRenderTemplate(node: T, parent: T, output: string, group: boolean);
            addRenderQueue(id: string, templates: string[]): void;
            addPreloadImage(element: HTMLImageElement): void;
            preserveRenderPosition(node: T): void;
            getExtension(name: string): Extension<T> | null;
            getExtensionOptionValue(name: string, attr: string): any;
            getExtensionOptionValueAsObject(name: string, attr: string): {} | null;
            getExtensionOptionValueAsString(name: string, attr: string): string;
            getExtensionOptionValueAsNumber(name: string, attr: string): number;
            getExtensionOptionValueAsBoolean(name: string, attr: string): boolean;
            toString(): string;
        }

        export class Application<T extends Node> implements Application<T> {
            public static createLayoutData<T extends Node>(node: T, parent: T, containerType?: number, alignmentType?: number, itemCount?: number, items?: T[]): LayoutData<T>;
            constructor(framework: number);
        }
    }
}

export {};