declare global {
    namespace androme.lib.base {
        interface Layout<T extends Node> {
            parent: T;
            node: T;
            containerType: number;
            alignmentType: number;
            itemCount: number;
            rowCount: number;
            columnCount: number;
            items: T[];
            floated: Set<string>;
            cleared: Map<T, string>;
            linearX: boolean;
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
            constructor(node: T, parent: T, containerType?: number, alignmentType?: number, itemCount?: number, items?: T[]);
        }
    }
}

export {};