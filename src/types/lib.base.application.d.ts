declare global {
    namespace androme.lib.base {
        export interface Application<T extends Node> {
            framework: number;
            controllerHandler: Controller<T>;
            resourceHandler: Resource<T>;
            nodeConstructor: Constructor<T>;
            userSettings: UserSettings;
            initialized: boolean;
            closed: boolean;
            appName: string;
            readonly builtInExtensions: ObjectMap<Extension<T>>;
            readonly session: AppSession<T, NodeList<T>>;
            readonly parseElements: Set<Element>;
            readonly processing: AppProcessing<T, NodeList<T>>;
            readonly extensions: Set<Extension<T>>;
            readonly viewData: FileAsset[];
            readonly sessionData: SessionData<NodeList<T>>;
            readonly nextId: number;
            readonly size: number;
            registerController(handler: Controller<T>): void;
            registerResource(handler: Resource<T>): void;
            reset(): void;
            finalize(): void;
            saveAllToDisk(): void;
            parseDocument(...elements: Undefined<string | Element>[]): FunctionMap<void>;
            renderNode(layout: Layout<T>): string;
            renderLayout(layout: Layout<T>): string;
            addLayoutFile(filename: string, content: string, pathname?: string, documentRoot?: boolean): void;
            addIncludeFile(filename: string, content: string): void;
            addRenderTemplate(node: T, parent: T, output: string, group: boolean): void;
            addRenderQueue(id: string, template: string): void;
            addImagePreload(element: HTMLImageElement): void;
            saveRenderPosition(parent: T, required: boolean): void;
            includeExtension(ext: Extension<T>): boolean;
            excludeExtension(ext: Extension<T>): boolean;
            retrieveExtension(name: string): Extension<T> | null;
            getExtensionOptionValue(name: string, attr: string): any;
            getExtensionOptionValueAsObject(name: string, attr: string): {} | null;
            getExtensionOptionValueAsString(name: string, attr: string): string;
            getExtensionOptionValueAsNumber(name: string, attr: string): number;
            getExtensionOptionValueAsBoolean(name: string, attr: string): boolean;
            toString(): string;
        }

        export class Application<T extends Node> implements Application<T> {
            constructor(framework: number, controllerConstructor: Constructor<Controller<T>>, resourceConstructor: Constructor<Resource<T>>, nodeConstructor: Constructor<T>);
        }
    }
}

export {};