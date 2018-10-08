export enum APP_FRAMEWORK {
    UNIVERSAL = 0,
    ANDROID = 2
}

export enum APP_SECTION {
    NONE = 0,
    INCLUDE = 2,
    DOM_TRAVERSE = 4,
    EXTENSION = 8,
    RENDER = 16,
    ALL = 30
}

export enum NODE_ALIGNMENT {
    NONE = 0,
    EXTENDABLE = 2,
    HORIZONTAL = 4,
    VERTICAL = 8,
    ABSOLUTE = 16,
    FLOAT = 32,
    SEGMENTED = 64,
    PERCENT = 128,
    TOP = 256,
    RIGHT = 512,
    BOTTOM = 1024,
    LEFT = 2048,
    SINGLE = 4096,
    MULTILINE = 8192,
    SPACE = 16384
}

export enum NODE_RESOURCE {
    NONE = 0,
    BOX_STYLE = 2,
    BOX_SPACING = 4,
    FONT_STYLE = 8,
    VALUE_STRING = 16,
    OPTION_ARRAY = 32,
    IMAGE_SOURCE = 64,
    ASSET = 8 | 16 | 32 | 64,
    ALL = 126
}

export enum NODE_PROCEDURE {
    NONE = 0,
    LAYOUT = 2,
    ALIGNMENT = 4,
    AUTOFIT = 8,
    OPTIMIZATION = 16,
    CUSTOMIZATION = 32,
    ACCESSIBILITY = 64,
    ALL = 126
}

export enum NODE_STANDARD {
    NONE = 0,
    CHECKBOX,
    RADIO,
    EDIT,
    SELECT,
    RANGE,
    TEXT,
    IMAGE,
    BUTTON,
    INLINE,
    LINE,
    SPACE,
    BLOCK,
    WEB_VIEW,
    FRAME,
    LINEAR,
    RADIO_GROUP,
    GRID,
    RELATIVE,
    CONSTRAINT,
    SCROLL_HORIZONTAL,
    SCROLL_VERTICAL
}
export enum BOX_STANDARD {
    MARGIN_TOP = 2,
    MARGIN_RIGHT = 4,
    MARGIN_BOTTOM = 8,
    MARGIN_LEFT = 16,
    PADDING_TOP = 32,
    PADDING_RIGHT = 64,
    PADDING_BOTTOM = 128,
    PADDING_LEFT = 256,
    MARGIN = 2 | 4 | 8 | 16,
    MARGIN_VERTICAL = 2 | 8,
    MARGIN_HORIZONTAL = 4 | 16,
    PADDING = 32 | 64 | 128 | 256,
    PADDING_VERTICAL = 32 | 128,
    PADDING_HORIZONTAL = 64 | 256
}

export enum CSS_STANDARD {
    NONE = 0,
    UNIT = 2,
    AUTO = 4,
    LEFT = 8,
    BASELINE = 16,
    PERCENT = 32,
    ZERO = 64
}