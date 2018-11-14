declare global {
    namespace androme.lib.base {
        export interface Extension<T extends Node> {
            application: Application<T>;
            tagNames: string[];
            documentRoot: boolean;
            eventOnly: boolean;
            preloaded: boolean;
            readonly framework: number;
            readonly name: string;
            readonly options: ExternalData;
            readonly dependencies: ExtensionDependency[];
            readonly subscribers: Set<T>;
            readonly subscribersChild: Set<T>;
            readonly installed: boolean;
            is(node: T): boolean;
            require(name: string, preload?: boolean): void;
            included(element: HTMLElement): boolean;
            beforeInit(element: HTMLElement, internal?: boolean): void;
            init(element: HTMLElement): boolean;
            afterInit(element: HTMLElement, internal?: boolean): void;
            condition(node: T, parent?: T): boolean;
            processNode(node: T, parent: T, mapX?: LayoutMapX<T>, mapY?: LayoutMapY<T>): ExtensionResult<T>;
            processChild(node: T, parent: T, mapX?: LayoutMapX<T>, mapY?: LayoutMapY<T>): ExtensionResult<T>;
            postBaseLayout(node: T): void;
            postParseDocument(node: T): void;
            postProcedure(node: T): void;
            beforeParseDocument(): void;
            afterDepthLevel(): void;
            afterBaseLayout(): void;
            afterConstraints(): void;
            afterResources(): void;
            afterParseDocument(): void;
            afterProcedure(): void;
            afterFinalize(): void;
        }

        export class Extension<T extends Node> implements Extension<T> {
            constructor(name: string, framework: number, tagNames?: string[], options?: ExternalData);
        }
    }
}

export {};