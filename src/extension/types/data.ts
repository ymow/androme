interface Inheritable {
    inherit: boolean;
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

interface CssGridCellData {
    rowStart: number;
    rowSpan: number;
    columnStart: number;
    columnSpan: number;
}

interface FlexboxData<T> {
    wrap: boolean;
    wrapReverse: boolean;
    directionReverse: boolean;
    justifyContent: string;
    rowCount: number;
    rowDirection: boolean;
    columnDirection: boolean;
    columnCount: number;
    children: T[];
}

interface GridData extends BoxPadding {
    columnEnd: number[];
    columnCount: number;
}

interface GridCellData<T> extends Inheritable {
    siblings?: T[];
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