export interface InitialData<T> {
    readonly styleMap: StringMap;
    readonly depth: number;
    readonly children: T[];
    readonly bounds: RectDimensions;
    readonly linear?: RectDimensions;
    readonly box?: RectDimensions;
}

export interface CachedValue<T> {
    pageflow?: boolean;
    siblingflow?: boolean;
    inlineflow?: boolean;
    baseline?: boolean;
    multiLine?: boolean;
    inlineText?: boolean;
    supSubscript?: boolean;
    positionStatic?: boolean;
    alignOrigin?: boolean;
    inline?: boolean;
    inlineStatic?: boolean;
    inlineVertical?: boolean;
    block?: boolean;
    blockStatic?: boolean;
    blockDimension?: boolean;
    floating?: boolean;
    rightAligned?: boolean;
    bottomAligned?: boolean;
    preserveWhiteSpace?: boolean;
    overflow?: number;
    lineHeight?: number;
    dir?: string;
    tagName?: string;
    textContent?: string;
    float?: string;
    actualChildren?: T[];
    flexbox?: Flexbox;
    autoMargin?: AutoMargin;
    visibleStyle?: VisibleStyle;
}

type AutoMargin = {
    enabled: boolean;
    left: boolean;
    right: boolean;
    horizontal: boolean;
    vertical: boolean;
};

type VisibleStyle = {
    border: boolean;
    background: boolean;
    backgroundImage: boolean;
    backgroundColor: boolean;
    backgroundRepeat: boolean;
    backgroundRepeatX: boolean;
    backgroundRepeatY: boolean;
};