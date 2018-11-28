export interface UserSettingsAndroid extends UserSettings {
    targetAPI: number;
    supportRTL: boolean;
    ellipsisOnTextOverflow: boolean;
    autoSizePaddingAndBorderWidth: boolean;
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
    current: ObjectMap<{ stringId: string; horizontal: boolean; }>;
    horizontal: boolean;
    vertical: boolean;
    minWidth?: boolean;
    minHeight?: boolean;
    guideline?: ObjectMapNested<ObjectMapNested<number>>;
    guidelineHorizontal?: string;
    guidelineVertical?: string;
}

export interface ViewAttribute {
    android: StringMap;
    app: StringMap;
}