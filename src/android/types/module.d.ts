export interface SettingsAndroid extends Settings {
    targetAPI: number;
    supportRTL: boolean;
    ellipsisOnTextOverflow: boolean;
    autoSizePaddingAndBorderWidth: boolean;
    whitespaceHorizontalOffset: number;
    whitespaceVerticalOffset: number;
    customizationsOverwritePrivilege: boolean;
    convertPixels: string;
    showAttributes: boolean;
}

export interface LocalSettings extends EnvironmentSettings {
    targetAPI: number;
    supportRTL: boolean;
    constraintPercentAccuracy?: number;
    customizationsOverwritePrivilege?: boolean;
    autoSizePaddingAndBorderWidth?: boolean;
    ellipsisOnTextOverflow?: boolean;
}

export interface Constraint {
    horizontal: boolean;
    vertical: boolean;
    current: ObjectMap<ConstraintPosition>;
    marginHorizontal?: string;
    marginVertical?: string;
    minWidth?: boolean;
    minHeight?: boolean;
    guidelineHorizontal?: string;
    guidelineVertical?: string;
    guideline?: ObjectMapNested<ObjectMapNested<number>>;
}

type ConstraintPosition = {
    stringId: string;
    horizontal: boolean;
};

export interface ViewAttribute {
    android: StringMap;
    app: StringMap;
}

export interface BackgroundImage {
    src: string;
    top: string;
    right: string;
    bottom: string;
    left: string;
    gravity: string;
    tileMode: string;
    tileModeX: string;
    tileModeY: string;
    width: string;
    height: string;
}

export interface BackgroundGradient {
    type: string;
    startColor: string;
    endColor: string;
    centerColor: string;
    colorStop: ColorStop[];
    angle?: string;
    startX?: string;
    startY?: string;
    endX?: string;
    endY?: string;
    centerX?: string;
    centerY?: string;
    gradientRadius?: string;
    tileMode?: string;
}