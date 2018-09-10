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

export enum NODE_ALIGNMENT {
    NONE = 0,
    SINGLE = 2,
    HORIZONTAL = 4,
    VERTICAL = 8,
    ABSOLUTE = 16,
    FLOAT = 32,
    INLINE_WRAP = 64,
    SEGMENTED = 128,
    PERCENT = 256,
    TOP = 512,
    RIGHT = 1024,
    BOTTOM = 2048,
    LEFT = 4096
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

export const MAP_ELEMENT = {
    INPUT: NODE_STANDARD.NONE,
    PLAINTEXT: NODE_STANDARD.TEXT,
    HR: NODE_STANDARD.LINE,
    IMG: NODE_STANDARD.IMAGE,
    SELECT: NODE_STANDARD.SELECT,
    RANGE: NODE_STANDARD.RANGE,
    TEXT: NODE_STANDARD.EDIT,
    PASSWORD: NODE_STANDARD.EDIT,
    NUMBER: NODE_STANDARD.EDIT,
    EMAIL: NODE_STANDARD.EDIT,
    SEARCH: NODE_STANDARD.EDIT,
    URL: NODE_STANDARD.EDIT,
    CHECKBOX: NODE_STANDARD.CHECKBOX,
    RADIO: NODE_STANDARD.RADIO,
    BUTTON: NODE_STANDARD.BUTTON,
    SUBMIT: NODE_STANDARD.BUTTON,
    RESET: NODE_STANDARD.BUTTON,
    TEXTAREA: NODE_STANDARD.EDIT,
    IFRAME: NODE_STANDARD.WEB_VIEW
};

export const BLOCK_ELEMENT = [
    'ADDRESS',
    'ARTICLE',
    'ASIDE',
    'BLOCKQUOTE',
    'CANVAS',
    'DD',
    'DIV',
    'DL',
    'DT',
    'FIELDSET',
    'FIGCAPTION',
    'FIGURE',
    'FOOTER',
    'FORM',
    'H1',
    'H2',
    'H3',
    'H4',
    'H5',
    'H6',
    'HEADER',
    'LI',
    'MAIN',
    'NAV',
    'OL',
    'OUTPUT',
    'P',
    'PRE',
    'SECTION',
    'TFOOT',
    'TH',
    'THEAD',
    'TR',
    'UL',
    'VIDEO'
];

export const INLINE_ELEMENT = [
    'A',
    'ABBR',
    'ACRONYM',
    'B',
    'BDO',
    'BIG',
    'BR',
    'BUTTON',
    'CITE',
    'CODE',
    'DFN',
    'EM',
    'I',
    'IFRAME',
    'IMG',
    'INPUT',
    'KBD',
    'LABEL',
    'MAP',
    'OBJECT',
    'Q',
    'S',
    'SAMP',
    'SCRIPT',
    'SELECT',
    'SMALL',
    'SPAN',
    'STRIKE',
    'STRONG',
    'SUB',
    'SUP',
    'TEXTAREA',
    'TIME',
    'TT',
    'U',
    'VAR',
    'PLAINTEXT'
];

export const enum OVERFLOW_ELEMENT {
    NONE = 0,
    HORIZONTAL = 2,
    VERTICAL = 4
}