interface SvgDefs<T, U> {
    image: T[];
    clipPath: Map<string, U[]>;
    gradient: Map<string, Gradient>;
}

interface SvgTransformAttributes {
    length: number;
    translateX: number;
    translateY: number;
    scaleX: number;
    scaleY: number;
    skewX: number;
    skewY: number;
    rotateAngle: number;
    rotateX?: number;
    rotateY?: number;
    origin?: RectPosition;
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