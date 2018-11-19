import { NODE_STANDARD } from './enumeration';

export const ELEMENT_BLOCK = [
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

export const ELEMENT_INLINE = [
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

export const ELEMENT_MAP = {
    PLAINTEXT: NODE_STANDARD.TEXT,
    HR: NODE_STANDARD.LINE,
    SVG: NODE_STANDARD.SVG,
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

export const EXT_NAME = {
    ACCESSIBILITY: 'androme.accessibility',
    CSS_GRID: 'androme.css-grid',
    EXTERNAL: 'androme.external',
    GRID: 'androme.grid',
    LIST: 'androme.list',
    ORIGIN: 'androme.origin',
    PERCENT: 'androme.percent',
    SPRITE: 'androme.sprite',
    TABLE: 'androme.table'
};

export const REGEX_PATTERN = {
    CSS_URL: /url\("?(.*?)"?\)/,
    URI: /^[A-Za-z]+:\/\//,
    UNIT: /^(?:\s*(-?[\d.]+)(px|em|ch|pc|pt|vw|vh|vmin|vmax|mm|cm|in))+$/
};