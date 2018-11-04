declare global {
    namespace androme.lib.base {
        export interface NodeList<T extends Node> extends Container<T> {
            delegateAppend?: (node: T) => void;
            readonly visible: T[];
            readonly elements: T[];
            readonly nextId: number;
            readonly linearX: boolean;
            readonly linearY: boolean;
            append(node: T, delegate?: boolean): this;
            reset(): void;
            partition(predicate: (value: T) => boolean): NodeList<T>[];
        }

        export class NodeList<T extends Node> implements NodeList<T> {
            public static outerRegion<T>(list: T[], dimension?: string): ObjectMap<T>;
            public static floated<T>(list: T[]): Set<string>;
            public static cleared<T>(list: T[]): Map<T, string>;
            public static textBaseline<T>(list: T[]): T[];
            public static linearX<T>(list: T[], traverse?: boolean): boolean;
            public static linearY<T>(list: T[]): boolean;
            public static sortByAlignment<T>(list: T[], alignmentType?: number, parent?: T): boolean;
            public static siblingIndex(): number;
            constructor(children?: T[]);
        }
    }
}

export {};