export interface UserSettingsAndroid extends UserSettings {
    targetAPI: number;
    resolutionDPI: number;
    supportRTL: boolean;
    ellipsisOnTextOverflow: boolean;
    collapseUnattributedElements: boolean;
    customizationsOverwritePrivilege: boolean;
    convertPixels: string;
    showAttributes: boolean;
}

export interface LocalSettings {
    targetAPI: number;
    supportRTL: boolean;
    constraintPercentAccuracy?: number;
    customizationsOverwritePrivilege?: boolean;
}

export interface Constraint {
    current: ObjectMap<{ documentId: string; horizontal: boolean; }>;
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

export type CustomizationResult = (result: {}, api?: number, node?: android.lib.base.View) => boolean;