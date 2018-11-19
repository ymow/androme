declare global {
    namespace androme.lib.base {
        export interface Controller<T extends Node> extends AppCurrent<T> {
            application: Application<T>;
            settings: Settings;
            cache: NodeList<T>;
            readonly localSettings: ControllerSettings;
            readonly delegateNodeInit: SelfWrapped<T, void>;
            createGroup(parent: T, node: T, children: T[]): T;
            renderGroup(node: T, parent: T, nodeType: number, options?: ExternalData): string;
            renderNode(node: T, parent: T, nodeType: number, options?: ExternalData): string;
            renderNodeStatic(controlName: string, depth: number, options?: ExternalData, width?: string, height?: string, node?: T, children?: boolean): string;
            setConstraints(): void;
            finalize(viewData: ViewData<NodeList<T>>): void;
            reset(): void;
            replaceRenderQueue(output: string): string;
            prependBefore(id: number, output: string, index?: number): void;
            appendAfter(id: number, output: string, index?: number): void;
            hasAppendProcessing(id: number): boolean;
        }

        export class Controller<T extends Node> implements Controller<T> {
            public static partitionRows<T extends Node>(list: T[], parent?: T): T[][];
            public static partitionAboveBottomBottom<T extends Node>(list: T[], node: T, maxBottom?: number): T[];
            public static clearedAll<T extends Node>(parent: T): Map<T, string> | undefined;
        }
    }
}

export {};