export interface InitialData<T> {
    readonly styleMap: StringMap;
    readonly depth: number;
    readonly children: T[];
    readonly bounds: BoxDimensions;
    readonly linear?: BoxDimensions;
    readonly box?: BoxDimensions;
}

export interface StyleVisible {
    hasBackground: boolean;
    hasBorder: boolean;
    hasBackgroundImage: boolean;
    hasBackgroundColor: boolean;
}