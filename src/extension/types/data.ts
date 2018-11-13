interface Inheritable {
    inherit: boolean;
}

export interface CssGridDataAttribute {
    count: number;
    gap: number;
    unit: string[];
    auto: string[];
    autoFit: boolean;
    autoFill: boolean;
    name: ObjectMap<number[]>;
}

export interface CssGridData<T> {
    children: Set<T>;
    row: CssGridDataAttribute;
    column: CssGridDataAttribute;
    rowData: T[][][];
    templateAreas: ObjectMap<CssGridCellData>;
}

export interface CssGridCellData {
    rowStart: number;
    rowSpan: number;
    columnStart: number;
    columnSpan: number;
}

export type GridData = {
    columnEnd: number[];
    columnCount: number;
    padding: BoxRect;
};

export interface GridCellData extends Inheritable {
    rowSpan: number;
    columnSpan: number;
    index: number;
    cellFirst: boolean;
    cellLast: boolean;
    rowEnd: boolean;
    rowStart: boolean;
}

export type ListData = {
    ordinal: string;
    imageSrc: string;
    imagePosition: string;
};