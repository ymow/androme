declare global {
    namespace androme.lib.base {
        export interface NodeList<T extends Node> extends Container<T> {
            delegateAppend?: (node: T) => void;
            readonly visible: T[];
            readonly elements: T[];
            readonly nextId: number;
            append(node: T, delegate?: boolean): this;
            reset(): void;
        }

        export class NodeList<T extends Node> implements NodeList<T> {
            public static actualParent<T>(list: T[]): T | null;
            public static floated<T>(list: T[]): Set<string>;
            public static cleared<T>(list: T[], parent?: boolean): Map<T, string>;
            public static floatedAll<T>(parent: T): Set<string>;
            public static clearedAll<T>(parent: T): Map<T, string>;
            public static textBaseline<T>(list: T[]): T[];
            public static linearX<T>(list: T[]): boolean;
            public static linearY<T>(list: T[]): boolean;
            public static partitionRows<T>(list: T[], parent?: T): T[][];
            public static nextAboveBottom<T extends Node>(list: T[], node: T, maxBottom?: number): T[];
            public static sortByAlignment<T>(list: T[], alignmentType: number): void;
            public static siblingIndex(): number;
            constructor(children?: T[]);
        }
    }
}

export {};