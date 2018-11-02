type ExternalData = ObjectMap<any>;
type TemplateData = ObjectMap<any>;
type TemplateItemData = ArrayObject<ObjectMap<any[]>>;

interface Asset {
    uri?: string;
}

interface FileAsset extends Asset {
    pathname: string;
    filename: string;
    content: string;
}

interface ImageAsset extends Asset {
    width: number;
    height: number;
    position?: Point;
}

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

interface Gradient {
    type: string;
    colorStop: ColorStop[];
}

interface LinearGradient extends Gradient {
    angle?: number;
    x1: number;
    y1: number;
    x2: number;
    y2: number;
    x1AsString?: string;
    y1AsString?: string;
    x2AsString?: string;
    y2AsString?: string;
}

interface RadialGradient extends Gradient {
    shapePosition?: string[];
    cx: number;
    cy: number;
    r: number;
    cxAsString?: string;
    cyAsString?: string;
    rAsString?: string;
    fx?: number;
    fy?: number;
    fxAsString?: string;
    fyAsString?: string;
}

interface BoxRect {
    top: number;
    right: number;
    bottom: number;
    left: number;
}

interface BoxDimensions extends BoxRect {
    width: number;
    height: number;
}

interface BoxPosition extends BoxRect {
    horizontal: string;
    vertical: string;
    originalX: string;
    originalY: string;
}

interface BoxModel {
    marginTop: number;
    marginRight: number;
    marginBottom: number;
    marginLeft: number;
    paddingTop: number;
    paddingRight: number;
    paddingBottom: number;
    paddingLeft: number;
    borderTopWidth?: number;
    borderRightWidth?: number;
    borderBottomWidth?: number;
    borderLeftWidth?: number;
}

interface Flexbox {
    enabled: boolean;
    direction: string;
    basis: string;
    grow: number;
    shrink: number;
    wrap: string;
    alignSelf: string;
    justifyContent: string;
    order: number;
}

interface RGBA {
    r: number;
    g: number;
    b: number;
    a: number;
}

interface Color {
    name: string;
    hex: string;
    rgba?: RGBA;
    hsl?: {
        h: number;
        s: number;
        l: number;
    };
}

interface ColorStop {
    color: string | ColorHexAlpha;
    offset: string;
    opacity: number;
}

interface ColorHexAlpha {
    valueRGB: string;
    valueRGBA: string;
    valueARGB: string;
    rgba: RGBA;
    alpha: number;
    opaque: boolean;
    visible: boolean;
}

interface BorderAttribute {
    width: string;
    style: string;
    color: string | ColorHexAlpha;
}

interface FontAttribute {
    fontFamily: string;
    fontStyle: string;
    fontSize: string;
    fontWeight: string;
    color: string | ColorHexAlpha;
    backgroundColor: string | ColorHexAlpha;
}

interface BoxStyle {
    border?: BorderAttribute;
    borderTop: BorderAttribute;
    borderRight: BorderAttribute;
    borderBottom: BorderAttribute;
    borderLeft: BorderAttribute;
    borderRadius: string[];
    backgroundColor: string | ColorHexAlpha;
    background?: string;
    backgroundImage?: string[];
    backgroundGradient?: Gradient[];
    backgroundSize: string[];
    backgroundRepeat: string;
    backgroundPositionX: string;
    backgroundPositionY: string;
}

interface ResourceMap {
    strings: Map<string, string>;
    arrays: Map<string, string[]>;
    fonts: Map<string, ObjectMap<boolean>>;
    colors: Map<string, string>;
    styles: Map<string, {}>;
    dimens: Map<string, string>;
    drawables: Map<string, string>;
    images: Map<string, StringMap>;
}