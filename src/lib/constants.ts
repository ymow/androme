import { NODE_STANDARD } from '../base/lib/constants';

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
    ZERO = 64,
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