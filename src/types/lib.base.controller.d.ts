declare global {
    namespace androme.lib.base {
        export interface Controller<T extends Node> extends AppCurrent<T> {
            application: Application<T>;
            settings: Settings;
            cache: NodeList<T>;
            readonly localSettings: ControllerSettings;
            readonly delegateNodeInit: SelfWrapped<T, void>;
            setConstraints(): void;
            createNodeGroup(node: T, parent: T, children: T[]): T;
            renderNode(data: LayoutData<T>);
            renderNodeGroup(data: LayoutData<T>);
            renderNodeStatic(controlName: string, depth: number, options?: ExternalData, width?: string, height?: string, node?: T, children?: boolean): string;
            finalize(viewData: ViewData<NodeList<T>>): void;
            reset(): void;
            replaceRenderQueue(output: string): string;
            prependBefore(id: number, output: string, index?: number): void;
            appendAfter(id: number, output: string, index?: number): void;
            hasAppendProcessing(id: number): boolean;
        }

        export class Controller<T extends Node> implements Controller<T> {
            public static getContainerType(tagName: string): number;
            public static partitionRows<T extends Node>(list: T[], parent?: T): T[][];
            public static partitionAboveBottom<T extends Node>(list: T[], node: T, maxBottom?: number): T[];
        }
    }
}

export {};