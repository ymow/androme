interface SvgDefs<T, U> {
    image: T[];
    clipPath: Map<string, U[]>;
    gradient: Map<string, Gradient>;
}

interface SvgTransformAttributes {
    translateX: number;
    translateY: number;
    scaleX: number;
    scaleY: number;
    skewX: number;
    skewY: number;
    rotateAngle: number;
    rotateX: number;
    rotateY: number;
    origin?: BoxPosition;
}