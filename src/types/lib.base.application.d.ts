declare global {
    namespace androme.lib.base {
        export interface Application<T extends Node> {
            viewController: Controller<T>;
            resourceHandler: Resource<T>;
            nodeObject: Constructor<T>;
            userSettings: UserSettings;
            loading: boolean;
            closed: boolean;
            appName: string;
            readonly framework: number;
            readonly builtInExtensions: ObjectMap<Extension<T>>;
            readonly session: AppSession<NodeList<T>>;
            readonly parseElements: Set<Element>;
            readonly processing: AppProcessing<T, NodeList<T>>;
            readonly extensions: Set<Extension<T>>;
            readonly viewData: FileAsset[];
            readonly sessionData: SessionData<NodeList<T>>;
            readonly size: number;
            registerController(controller: Controller<T>): void;
            registerResource(resource: Resource<T>): void;
            installExtension(ext: Extension<T>): boolean;
            removeExtension(ext: Extension<T>): boolean;
            finalize(): void;
            saveAllToDisk(): void;
            reset(): void;
            parseDocument(...elements: Undefined<string | Element>[]): FunctionMap<void>;
            renderNode(data: Layout<T>): string;
            addLayoutFile(filename: string, content: string, pathname?: string, documentRoot?: boolean): void;
            addIncludeFile(filename: string, content: string): void;
            addRenderTemplate(node: T, parent: T, output: string, group: boolean);
            addRenderQueue(id: string, templates: string[]): void;
            addPreloadImage(element: HTMLImageElement): void;
            setRenderPosition(parent: T, node?: T): void;
            getExtension(name: string): Extension<T> | null;
            getExtensionOptionValue(name: string, attr: string): any;
            getExtensionOptionValueAsObject(name: string, attr: string): {} | null;
            getExtensionOptionValueAsString(name: string, attr: string): string;
            getExtensionOptionValueAsNumber(name: string, attr: string): number;
            getExtensionOptionValueAsBoolean(name: string, attr: string): boolean;
            toString(): string;
        }

        export class Application<T extends Node> implements Application<T> {
            constructor(framework: number);
        }
    }
}

export {};