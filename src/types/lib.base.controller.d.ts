declare global {
    namespace androme.lib.base {
        export interface Controller<T extends Node> extends AppCurrent<T> {
            application: Application<T>;
            settings: Settings;
            cache: NodeList<T>;
            readonly localSettings: ControllerSettings;
            readonly delegateNodeInit: SelfWrapped<T, void>;
            finalize(viewData: ViewData<NodeList<T>>): void;
            reset(): void;
            checkConstraintFloat(parent: T, nodes: T[], floated?: Set<string>, cleared?: Map<T, string>, linearX?: boolean): boolean;
            checkConstraintHorizontal(parent: T, nodes: T[], floated?: Set<string>, cleared?: Map<T, string>, linearX?: boolean): boolean;
            checkFrameHorizontal(parent: T, nodes: T[], floated?: Set<string>, cleared?: Map<T, string>, linearX?: boolean): boolean;
            checkRelativeHorizontal(parent: T, nodes: T[], floated?: Set<string>, cleared?: Map<T, string>, linearX?: boolean): boolean;
            setConstraints(): void;
            renderNode(data: Layout<T>);
            renderNodeGroup(data: Layout<T>);
            renderNodeStatic(controlName: string, depth: number, options?: ExternalData, width?: string, height?: string, node?: T, children?: boolean): string;
            createNodeGroup(node: T, parent: T, children: T[]): T;
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