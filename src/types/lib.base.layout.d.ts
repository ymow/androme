declare global {
    namespace androme.lib.base {
        interface Layout<T extends Node> extends Container<T> {
            parent: T;
            node: T;
            containerType: number;
            alignmentType: number;
            renderType: number;
            itemCount: number;
            rowCount: number;
            columnCount: number;
            floated: Set<string>;
            cleared: Map<T, string>;
            linearX: boolean;
            readonly visible: T[];
            init(): void;
            initParent(): void;
            setType(containerType: number, alignmentType?: number): void;
            getFloated(parent?: boolean): Set<string>;
            getCleared(parent?: boolean): Map<T, string>;
            getLinearX(): boolean;
            add(value: number): number;
            delete(value: number): number;
        }

        export class Layout<T extends Node> implements Layout<T> {
            constructor(node: T, parent: T, containerType?: number, alignmentType?: number, itemCount?: number, children?: T[]);
        }
    }
}

export {};