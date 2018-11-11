declare global {
    namespace androme.lib.base {
        export interface Extension<T extends Node> {
            application: Application<T>;
            tagNames: string[];
            documentRoot: boolean;
            eventOnly: boolean;
            readonly framework: number;
            readonly name: string;
            readonly options: ExternalData;
            readonly dependencies: ExtensionDependency[];
            readonly subscribers: Set<T>;
            readonly subscribersChild: Set<T>;
            readonly loaded: boolean;
            is(node: T): boolean;
            require(value: string, init?: boolean): void;
            included(element: HTMLElement): boolean;
            beforeInit(element: HTMLElement, internal?: boolean): void;
            init(element: HTMLElement): boolean;
            afterInit(element: HTMLElement, internal?: boolean): void;
            condition(node: T, parent?: T): boolean;
            processNode(node: T, parent: T, mapX?: LayoutMapX<T>, mapY?: LayoutMapY<T>): ExtensionResult<T>;
            processChild(node: T, parent: T, mapX?: LayoutMapX<T>, mapY?: LayoutMapY<T>): ExtensionResult<T>;
            postRenderElement(node: T): void;
            postRenderDocument(node: T): void;
            postProcedure(node: T): void;
            beforeRenderDocument(): void;
            afterRenderElement(): void;
            afterConstraints(): void;
            afterResources(): void;
            afterRenderDocument(): void;
            afterProcedure(): void;
            afterFinalize(): void;
        }

        export class Extension<T extends Node> implements Extension<T> {
            constructor(name: string, framework: number, tagNames?: string[], options?: ExternalData);
        }
    }
}

export {};