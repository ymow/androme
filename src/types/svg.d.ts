interface SvgDefs<T, U> {
    image: T[];
    clipPath: Map<string, U[]>;
    gradient: Map<string, Gradient>;
}

interface SvgTransformData {
    operations: number[];
    translateX: number;
    translateY: number;
    scaleX: number;
    scaleY: number;
    skewX: number;
    skewY: number;
    rotateAngle: number;
    rotateOriginX?: number;
    rotateOriginY?: number;
    matrixSkewX?: DOMMatrix;
    matrixSkewY?: DOMMatrix;
    matrixRotate?: DOMMatrix;
    origin?: Point;
}

interface SvgLinearGradient extends Gradient {
    x1: number;
    y1: number;
    x2: number;
    y2: number;
    x1AsString: string;
    y1AsString: string;
    x2AsString: string;
    y2AsString: string;
}

interface SvgRadialGradient extends Gradient {
    cx: number;
    cy: number;
    r: number;
    cxAsString: string;
    cyAsString: string;
    rAsString: string;
    fx: number;
    fy: number;
    fxAsString: string;
    fyAsString: string;
}

interface SvgPathCommand {
    command: string;
    relative: boolean;
    coordinates: number[];
    points: Point[];
    radiusX?: number;
    radiusY?: number;
    xAxisRotation?: number;
    largeArcFlag?: number;
    sweepFlag?: number;
}

interface SvgAnimate {
    attributeName: string;
    from: string;
    to: string;
    by: string;
    values: string[];
    pathValues?: string[];
    keyTimes: number[];
    duration: number;
    durationMS: number;
    repeatCount: number;
    calcMode: string;
    additive: boolean;
    accumulate: boolean;
    freeze: boolean;
}

interface SvgAnimateTransform extends SvgAnimate {
    type?: number;
    path?: string;
    keyPoints?: number[];
    rotate?: string;
}