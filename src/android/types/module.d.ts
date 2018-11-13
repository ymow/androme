export interface SettingsAndroid extends Settings {
    targetAPI: number;
    supportRTL: boolean;
    ellipsisOnTextOverflow: boolean;
    constraintChainDisabled: boolean;
    constraintChainPackedHorizontalOffset: number;
    constraintChainPackedVerticalOffset: number;
    constraintCirclePositionAbsolute: boolean;
    constraintPercentAccuracy: number;
    showAttributes: boolean;
    convertPixels: string;
}

export interface EnvironmentSettings {
    resolutionDPI: number;
    targetAPI: number;
    supportRTL: boolean;
}

export interface LocalSettings extends EnvironmentSettings {
    constraintPercentAccuracy?: number;
    customizationsOverwritePrivilege?: boolean;
    autoSizePaddingAndBorderWidth?: boolean;
    ellipsisOnTextOverflow?: boolean;
}

export interface Constraint {
    horizontal: boolean;
    vertical: boolean;
    current: {
        adjacent: string;
        orientation: string;
        overwrite: boolean;
    };
    layoutWidth: boolean;
    layoutHeight: boolean;
    layoutHorizontal: boolean;
    layoutVertical: boolean;
    marginHorizontal: string;
    marginVertical: string;
    guideline: ObjectMapNested<ObjectMapNested<number>>;
}

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