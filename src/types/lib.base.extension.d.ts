declare global {
    namespace androme.lib.base {
        export interface Extension<T extends Node> {
            application: Application<T>;
            tagNames: string[];
            options: ExternalData;
            documentRoot: boolean;
            eventOnly: boolean;
            readonly framework: number;
            readonly name: string;
            readonly dependencies: ExtensionDependency[];
            readonly subscribers: Set<T>;
            readonly subscribersChild: Set<T>;
            readonly node: T | undefined;
            readonly parent: T | undefined;
            readonly element: Element | undefined;
            readonly loaded: boolean;
            setTarget(node?: T, parent?: T, element?: Element): void;
            getData(): StringMap;
            is(node: T): boolean;
            require(value: string, init?: boolean): void;
            included(element?: Element): boolean;
            beforeInit(init?: boolean): void;
            init(element: HTMLElement): boolean;
            afterInit(init?: boolean): void;
            condition(): boolean;
            processNode(mapX?: LayoutMapX<T>, mapY?: LayoutMapY<T>): ExtensionResult;
            processChild(mapX?: LayoutMapX<T>, mapY?: LayoutMapY<T>): ExtensionResult;
            postRender(node: T): void;
            postProcedure(node: T): void;
            afterRender(): void;
            afterConstraints(): void;
            afterResources(): void;
            afterProcedure(): void;
            afterFinalize(): void;
        }

        export class Extension<T extends Node> implements Extension<T> {
            constructor(name: string, framework: number, tagNames?: string[], options?: ExternalData);
        }
    }
}

export {};