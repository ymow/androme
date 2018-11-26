export interface UserSettingsAndroid extends UserSettings {
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
}

export interface Constraint {
    horizontal: boolean;
    vertical: boolean;
    current: ObjectMap<{ stringId: string; horizontal: boolean; }>;
    marginHorizontal?: string;
    marginVertical?: string;
    minWidth?: boolean;
    minHeight?: boolean;
    guidelineHorizontal?: string;
    guidelineVertical?: string;
    guideline?: ObjectMapNested<ObjectMapNested<number>>;
}

export interface ViewAttribute {
    android: StringMap;
    app: StringMap;
}