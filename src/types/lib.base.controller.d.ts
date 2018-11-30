declare global {
    namespace androme.lib.base {
        export interface Controller<T extends Node> extends AppCurrent<T> {
            application: Application<T>;
            cache: NodeList<T>;
            userSettings: UserSettings;
            readonly localSettings: ControllerSettings;
            readonly delegateNodeInit: SelfWrapped<T, void>;
            finalize(data: SessionData<NodeList<T>>): void;
            reset(): void;
            checkConstraintFloat(data: Layout<T>): boolean;
            checkConstraintHorizontal(data: Layout<T>): boolean;
            checkFrameHorizontal(data: Layout<T>): boolean;
            checkRelativeHorizontal(data: Layout<T>): boolean;
            setConstraints(): void;
            renderNode(data: Layout<T>);
            renderNodeGroup(data: Layout<T>);
            renderNodeStatic(controlName: string, depth: number, options?: ExternalData, width?: string, height?: string, node?: T, children?: boolean): string;
            createNodeGroup(node: T, children: T[], parent?: T, replaceWith?: T): T;
            replaceRenderQueue(output: string): string;
            prependBefore(id: number, output: string, index?: number): void;
            appendAfter(id: number, output: string, index?: number): void;
            hasAppendProcessing(id: number): boolean;
        }

        export class Controller<T extends Node> implements Controller<T> {
            public static getContainerType(tagName: string): number;
        }
    }
}

export {};