interface Inheritable {
    inherit: boolean;
}

interface CssGridDataAttribute {
    count: number;
    gap: number;
    unit: string[];
    unitMin: string[];
    auto: string[];
    autoFit: boolean;
    autoFill: boolean;
    name: ObjectMap<number[]>;
}

interface CssGridData<T> {
    children: Set<T>;
    row: CssGridDataAttribute;
    column: CssGridDataAttribute;
    rowData: T[][][];
    templateAreas: ObjectMap<CssGridCellData>;
    alignItems: string;
    justifyItems: string;
}

interface CssGridCellData {
    rowStart: number;
    rowSpan: number;
    columnStart: number;
    columnSpan: number;
}

interface GridData {
    columnEnd: number[];
    columnCount: number;
    padding: BoxRect;
}

interface GridCellData extends Inheritable {
    rowSpan: number;
    columnSpan: number;
    index: number;
    cellFirst: boolean;
    cellLast: boolean;
    rowEnd: boolean;
    rowStart: boolean;
}

interface ListData {
    ordinal: string;
    imageSrc: string;
    imagePosition: string;
}