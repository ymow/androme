declare global {
    namespace androme.lib.base {
        export interface Extension<T extends Node> {
            application: Application<T>;
            tagNames: string[];
            options: ExternalData;
            documentRoot: boolean;
            readonly framework: number;
            readonly name: string;
            readonly dependencies: ExtensionDependency[];
            readonly subscribers: Set<T>;
            readonly subscribersChild: Set<T>;
            readonly node: T | undefined;
            readonly parent: T | undefined;
            readonly element: Element | undefined;
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
            afterRender(): void;
            beforeInsert(): void;
            afterInsert(): void;
            finalize(): void;
        }

        export class Extension<T extends Node> implements Extension<T> {
            constructor(name: string, framework: number, tagNames?: string[], options?: ExternalData);
        }

        namespace extensions {
            export class Accessibility<T extends Node> extends Extension<T> {}
            export class Button<T extends Node> extends Extension<T> {}
            export class Custom<T extends Node> extends Extension<T> {}
            export class External<T extends Node> extends Extension<T> {}
            export class Grid<T extends Node> extends Extension<T> {}
            export class List<T extends Node> extends Extension<T> {}
            export class Nav<T extends Node> extends Extension<T> {}
            export class Origin<T extends Node> extends Extension<T> {}
            export class Percent<T extends Node> extends Extension<T> {}
            export class Sprite<T extends Node> extends Extension<T> {}
            export class Table<T extends Node> extends Extension<T> {}
        }
    }
}

export {};