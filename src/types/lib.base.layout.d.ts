declare global {
    namespace androme.lib.base {
        interface Layout<T extends Node> {
            node: T;
            parent: T;
            containerType: number;
            alignmentType: number;
            itemCount: number;
            rowCount: number;
            columnCount: number;
            items: T[] | undefined;
            setType(containerType: number, alignmentType?: number): void;
            add(value: number): number;
            delete(value: number): number;
        }

        export class Layout<T extends Node> implements Layout<T> {
            constructor(node: T, parent: T, containerType?: number, alignmentType?: number, itemCount?: number, items?: T[]);
        }
    }
}

export {};