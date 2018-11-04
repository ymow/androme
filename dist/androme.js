/* androme 2.2.0
   https://github.com/anpham6/androme */

(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
    typeof define === 'function' && define.amd ? define(['exports'], factory) :
    (factory((global.androme = {})));
}(this, (function (exports) { 'use strict';

    var USER_AGENT;
    (function (USER_AGENT) {
        USER_AGENT[USER_AGENT["NONE"] = 0] = "NONE";
        USER_AGENT[USER_AGENT["CHROME"] = 2] = "CHROME";
        USER_AGENT[USER_AGENT["SAFARI"] = 4] = "SAFARI";
        USER_AGENT[USER_AGENT["EDGE"] = 8] = "EDGE";
        USER_AGENT[USER_AGENT["FIREFOX"] = 16] = "FIREFOX";
    })(USER_AGENT || (USER_AGENT = {}));
    var APP_FRAMEWORK;
    (function (APP_FRAMEWORK) {
        APP_FRAMEWORK[APP_FRAMEWORK["UNIVERSAL"] = 0] = "UNIVERSAL";
        APP_FRAMEWORK[APP_FRAMEWORK["ANDROID"] = 2] = "ANDROID";
    })(APP_FRAMEWORK || (APP_FRAMEWORK = {}));
    var APP_SECTION;
    (function (APP_SECTION) {
        APP_SECTION[APP_SECTION["NONE"] = 0] = "NONE";
        APP_SECTION[APP_SECTION["INCLUDE"] = 2] = "INCLUDE";
        APP_SECTION[APP_SECTION["DOM_TRAVERSE"] = 4] = "DOM_TRAVERSE";
        APP_SECTION[APP_SECTION["EXTENSION"] = 8] = "EXTENSION";
        APP_SECTION[APP_SECTION["RENDER"] = 16] = "RENDER";
        APP_SECTION[APP_SECTION["ALL"] = 30] = "ALL";
    })(APP_SECTION || (APP_SECTION = {}));
    var NODE_ALIGNMENT;
    (function (NODE_ALIGNMENT) {
        NODE_ALIGNMENT[NODE_ALIGNMENT["NONE"] = 0] = "NONE";
        NODE_ALIGNMENT[NODE_ALIGNMENT["EXCLUDE"] = 2] = "EXCLUDE";
        NODE_ALIGNMENT[NODE_ALIGNMENT["EXTENDABLE"] = 4] = "EXTENDABLE";
        NODE_ALIGNMENT[NODE_ALIGNMENT["HORIZONTAL"] = 8] = "HORIZONTAL";
        NODE_ALIGNMENT[NODE_ALIGNMENT["VERTICAL"] = 16] = "VERTICAL";
        NODE_ALIGNMENT[NODE_ALIGNMENT["ABSOLUTE"] = 32] = "ABSOLUTE";
        NODE_ALIGNMENT[NODE_ALIGNMENT["FLOAT"] = 64] = "FLOAT";
        NODE_ALIGNMENT[NODE_ALIGNMENT["SEGMENTED"] = 128] = "SEGMENTED";
        NODE_ALIGNMENT[NODE_ALIGNMENT["PERCENT"] = 256] = "PERCENT";
        NODE_ALIGNMENT[NODE_ALIGNMENT["TOP"] = 512] = "TOP";
        NODE_ALIGNMENT[NODE_ALIGNMENT["RIGHT"] = 1024] = "RIGHT";
        NODE_ALIGNMENT[NODE_ALIGNMENT["BOTTOM"] = 2048] = "BOTTOM";
        NODE_ALIGNMENT[NODE_ALIGNMENT["LEFT"] = 4096] = "LEFT";
        NODE_ALIGNMENT[NODE_ALIGNMENT["SINGLE"] = 8192] = "SINGLE";
        NODE_ALIGNMENT[NODE_ALIGNMENT["MULTILINE"] = 16384] = "MULTILINE";
        NODE_ALIGNMENT[NODE_ALIGNMENT["SPACE"] = 32768] = "SPACE";
    })(NODE_ALIGNMENT || (NODE_ALIGNMENT = {}));
    var NODE_RESOURCE;
    (function (NODE_RESOURCE) {
        NODE_RESOURCE[NODE_RESOURCE["NONE"] = 0] = "NONE";
        NODE_RESOURCE[NODE_RESOURCE["BOX_STYLE"] = 2] = "BOX_STYLE";
        NODE_RESOURCE[NODE_RESOURCE["BOX_SPACING"] = 4] = "BOX_SPACING";
        NODE_RESOURCE[NODE_RESOURCE["FONT_STYLE"] = 8] = "FONT_STYLE";
        NODE_RESOURCE[NODE_RESOURCE["VALUE_STRING"] = 16] = "VALUE_STRING";
        NODE_RESOURCE[NODE_RESOURCE["OPTION_ARRAY"] = 32] = "OPTION_ARRAY";
        NODE_RESOURCE[NODE_RESOURCE["IMAGE_SOURCE"] = 64] = "IMAGE_SOURCE";
        NODE_RESOURCE[NODE_RESOURCE["ASSET"] = 120] = "ASSET";
        NODE_RESOURCE[NODE_RESOURCE["ALL"] = 126] = "ALL";
    })(NODE_RESOURCE || (NODE_RESOURCE = {}));
    var NODE_PROCEDURE;
    (function (NODE_PROCEDURE) {
        NODE_PROCEDURE[NODE_PROCEDURE["NONE"] = 0] = "NONE";
        NODE_PROCEDURE[NODE_PROCEDURE["LAYOUT"] = 2] = "LAYOUT";
        NODE_PROCEDURE[NODE_PROCEDURE["ALIGNMENT"] = 4] = "ALIGNMENT";
        NODE_PROCEDURE[NODE_PROCEDURE["AUTOFIT"] = 8] = "AUTOFIT";
        NODE_PROCEDURE[NODE_PROCEDURE["OPTIMIZATION"] = 16] = "OPTIMIZATION";
        NODE_PROCEDURE[NODE_PROCEDURE["CUSTOMIZATION"] = 32] = "CUSTOMIZATION";
        NODE_PROCEDURE[NODE_PROCEDURE["ACCESSIBILITY"] = 64] = "ACCESSIBILITY";
        NODE_PROCEDURE[NODE_PROCEDURE["LOCALIZATION"] = 128] = "LOCALIZATION";
        NODE_PROCEDURE[NODE_PROCEDURE["ALL"] = 254] = "ALL";
    })(NODE_PROCEDURE || (NODE_PROCEDURE = {}));
    var NODE_STANDARD;
    (function (NODE_STANDARD) {
        NODE_STANDARD[NODE_STANDARD["NONE"] = 0] = "NONE";
        NODE_STANDARD[NODE_STANDARD["CHECKBOX"] = 1] = "CHECKBOX";
        NODE_STANDARD[NODE_STANDARD["RADIO"] = 2] = "RADIO";
        NODE_STANDARD[NODE_STANDARD["EDIT"] = 3] = "EDIT";
        NODE_STANDARD[NODE_STANDARD["SELECT"] = 4] = "SELECT";
        NODE_STANDARD[NODE_STANDARD["RANGE"] = 5] = "RANGE";
        NODE_STANDARD[NODE_STANDARD["SVG"] = 6] = "SVG";
        NODE_STANDARD[NODE_STANDARD["TEXT"] = 7] = "TEXT";
        NODE_STANDARD[NODE_STANDARD["IMAGE"] = 8] = "IMAGE";
        NODE_STANDARD[NODE_STANDARD["BUTTON"] = 9] = "BUTTON";
        NODE_STANDARD[NODE_STANDARD["INLINE"] = 10] = "INLINE";
        NODE_STANDARD[NODE_STANDARD["LINE"] = 11] = "LINE";
        NODE_STANDARD[NODE_STANDARD["SPACE"] = 12] = "SPACE";
        NODE_STANDARD[NODE_STANDARD["BLOCK"] = 13] = "BLOCK";
        NODE_STANDARD[NODE_STANDARD["WEB_VIEW"] = 14] = "WEB_VIEW";
        NODE_STANDARD[NODE_STANDARD["FRAME"] = 15] = "FRAME";
        NODE_STANDARD[NODE_STANDARD["LINEAR"] = 16] = "LINEAR";
        NODE_STANDARD[NODE_STANDARD["RADIO_GROUP"] = 17] = "RADIO_GROUP";
        NODE_STANDARD[NODE_STANDARD["GRID"] = 18] = "GRID";
        NODE_STANDARD[NODE_STANDARD["RELATIVE"] = 19] = "RELATIVE";
        NODE_STANDARD[NODE_STANDARD["CONSTRAINT"] = 20] = "CONSTRAINT";
        NODE_STANDARD[NODE_STANDARD["SCROLL_HORIZONTAL"] = 21] = "SCROLL_HORIZONTAL";
        NODE_STANDARD[NODE_STANDARD["SCROLL_VERTICAL"] = 22] = "SCROLL_VERTICAL";
    })(NODE_STANDARD || (NODE_STANDARD = {}));
    var BOX_STANDARD;
    (function (BOX_STANDARD) {
        BOX_STANDARD[BOX_STANDARD["MARGIN_TOP"] = 2] = "MARGIN_TOP";
        BOX_STANDARD[BOX_STANDARD["MARGIN_RIGHT"] = 4] = "MARGIN_RIGHT";
        BOX_STANDARD[BOX_STANDARD["MARGIN_BOTTOM"] = 8] = "MARGIN_BOTTOM";
        BOX_STANDARD[BOX_STANDARD["MARGIN_LEFT"] = 16] = "MARGIN_LEFT";
        BOX_STANDARD[BOX_STANDARD["PADDING_TOP"] = 32] = "PADDING_TOP";
        BOX_STANDARD[BOX_STANDARD["PADDING_RIGHT"] = 64] = "PADDING_RIGHT";
        BOX_STANDARD[BOX_STANDARD["PADDING_BOTTOM"] = 128] = "PADDING_BOTTOM";
        BOX_STANDARD[BOX_STANDARD["PADDING_LEFT"] = 256] = "PADDING_LEFT";
        BOX_STANDARD[BOX_STANDARD["MARGIN"] = 30] = "MARGIN";
        BOX_STANDARD[BOX_STANDARD["MARGIN_VERTICAL"] = 10] = "MARGIN_VERTICAL";
        BOX_STANDARD[BOX_STANDARD["MARGIN_HORIZONTAL"] = 20] = "MARGIN_HORIZONTAL";
        BOX_STANDARD[BOX_STANDARD["PADDING"] = 480] = "PADDING";
        BOX_STANDARD[BOX_STANDARD["PADDING_VERTICAL"] = 160] = "PADDING_VERTICAL";
        BOX_STANDARD[BOX_STANDARD["PADDING_HORIZONTAL"] = 320] = "PADDING_HORIZONTAL";
    })(BOX_STANDARD || (BOX_STANDARD = {}));
    var CSS_STANDARD;
    (function (CSS_STANDARD) {
        CSS_STANDARD[CSS_STANDARD["NONE"] = 0] = "NONE";
        CSS_STANDARD[CSS_STANDARD["UNIT"] = 2] = "UNIT";
        CSS_STANDARD[CSS_STANDARD["AUTO"] = 4] = "AUTO";
        CSS_STANDARD[CSS_STANDARD["LEFT"] = 8] = "LEFT";
        CSS_STANDARD[CSS_STANDARD["BASELINE"] = 16] = "BASELINE";
        CSS_STANDARD[CSS_STANDARD["PERCENT"] = 32] = "PERCENT";
        CSS_STANDARD[CSS_STANDARD["ZERO"] = 64] = "ZERO";
    })(CSS_STANDARD || (CSS_STANDARD = {}));

    var enumeration = /*#__PURE__*/Object.freeze({
        get USER_AGENT () { return USER_AGENT; },
        get APP_FRAMEWORK () { return APP_FRAMEWORK; },
        get APP_SECTION () { return APP_SECTION; },
        get NODE_ALIGNMENT () { return NODE_ALIGNMENT; },
        get NODE_RESOURCE () { return NODE_RESOURCE; },
        get NODE_PROCEDURE () { return NODE_PROCEDURE; },
        get NODE_STANDARD () { return NODE_STANDARD; },
        get BOX_STANDARD () { return BOX_STANDARD; },
        get CSS_STANDARD () { return CSS_STANDARD; }
    });

    const MAP_ELEMENT = {
        INPUT: NODE_STANDARD.NONE,
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
    const BLOCK_ELEMENT = [
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
    const INLINE_ELEMENT = [
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
    const EXT_NAME = {
        ACCESSIBILITY: 'androme.accessibility',
        CUSTOM: 'androme.custom',
        EXTERNAL: 'androme.external',
        GRID: 'androme.grid',
        LIST: 'androme.list',
        ORIGIN: 'androme.origin',
        PERCENT: 'androme.percent',
        SPRITE: 'androme.sprite',
        TABLE: 'androme.table'
    };
    const DOM_REGEX = {
        CSS_URL: /url\("?(.*?)"?\)/,
        URI: /^[A-Za-z]+:\/\//
    };

    var constant = /*#__PURE__*/Object.freeze({
        MAP_ELEMENT: MAP_ELEMENT,
        BLOCK_ELEMENT: BLOCK_ELEMENT,
        INLINE_ELEMENT: INLINE_ELEMENT,
        EXT_NAME: EXT_NAME,
        DOM_REGEX: DOM_REGEX
    });

    class Container {
        constructor() {
            this._children = [];
        }
        [Symbol.iterator]() {
            const list = this._children;
            let i = 0;
            return {
                next() {
                    if (i < list.length) {
                        return { done: false, value: list[i++] };
                    }
                    else {
                        return { done: true, value: undefined };
                    }
                }
            };
        }
        item(index, value) {
            if (index != null && value != null) {
                if (index >= 0 && index < this._children.length) {
                    this._children[index] = value;
                    return value;
                }
            }
            else {
                if (index == null) {
                    return this._children[this._children.length - 1];
                }
                return this._children[index];
            }
            return undefined;
        }
        append(value) {
            this._children.push(value);
        }
        remove(value) {
            for (let i = 0; i < this.list.length; i++) {
                if (value === this.list[i]) {
                    return this.list.splice(i, 1);
                }
            }
            return [];
        }
        replace(value) {
            this._children = value;
        }
        duplicate() {
            return this._children.slice();
        }
        clear() {
            this._children.length = 0;
            return this;
        }
        each(predicate) {
            this._children.forEach(predicate);
            return this;
        }
        contains(value) {
            return this._children.includes(value);
        }
        find(predicate, value) {
            if (typeof predicate === 'string') {
                return this._children.find(item => item[predicate] === value);
            }
            return this._children.find(predicate);
        }
        filter(predicate) {
            return this._children.filter(predicate);
        }
        map(predicate) {
            return this._children.map(predicate);
        }
        sort(predicate) {
            this._children.sort(predicate);
            return this;
        }
        every(predicate) {
            return this.length > 0 && this._children.every(predicate);
        }
        some(predicate) {
            return this.length > 0 && this._children.some(predicate);
        }
        get list() {
            return this._children;
        }
        get length() {
            return this._children.length;
        }
    }

    const ALPHABET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const NUMERALS = [
        '', 'C', 'CC', 'CCC', 'CD', 'D', 'DC', 'DCC', 'DCCC', 'CM',
        '', 'X', 'XX', 'XXX', 'XL', 'L', 'LX', 'LXX', 'LXXX', 'XC',
        '', 'I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX'
    ];
    function sort(list, asc = 0, ...attrs) {
        return list.sort((a, b) => {
            for (const attr of attrs) {
                const result = compareObject(a, b, attr);
                if (result && result[0] !== result[1]) {
                    if (asc === 0) {
                        return result[0] > result[1] ? 1 : -1;
                    }
                    else {
                        return result[0] < result[1] ? 1 : -1;
                    }
                }
            }
            return 0;
        });
    }
    function compareObject(obj1, obj2, attr) {
        const namespaces = attr.split('.');
        let current1 = obj1;
        let current2 = obj2;
        for (const name of namespaces) {
            if (current1[name] != null && current2[name] != null) {
                current1 = current1[name];
                current2 = current2[name];
            }
            else if (current1[name] == null && current2[name] == null) {
                return false;
            }
            else if (current1[name] != null) {
                return [1, 0];
            }
            else {
                return [0, 1];
            }
        }
        if (!isNaN(parseInt(current1)) || !isNaN(parseInt(current2))) {
            return [convertInt(current1), convertInt(current2)];
        }
        else {
            return [current1, current2];
        }
    }
    function formatString(value, ...params) {
        for (let i = 0; i < params.length; i++) {
            value = value.replace(`{${i}}`, params[i]);
        }
        return value;
    }
    function convertUnderscore(value) {
        value = value.charAt(0).toLowerCase() + value.substring(1);
        const result = value.match(/([a-z][A-Z])/g);
        if (result) {
            result.forEach(match => value = value.replace(match, `${match[0]}_${match[1].toLowerCase()}`));
        }
        return value;
    }
    function convertCamelCase(value, char = '-') {
        value = value.replace(new RegExp(`^${char}+`), '');
        const result = value.match(new RegExp(`(${char}[a-z])`, 'g'));
        if (result) {
            result.forEach(match => value = value.replace(match, match[1].toUpperCase()));
        }
        return value;
    }
    function convertWord(value) {
        return value ? value.replace(/[^\w]/g, '_').trim() : '';
    }
    function capitalize(value, upper = true) {
        return value ? value.charAt(0)[upper ? 'toUpperCase' : 'toLowerCase']() + value.substring(1)[upper ? 'toLowerCase' : 'toString']() : '';
    }
    function convertInt(value) {
        return (value && parseInt(value)) || 0;
    }
    function convertFloat(value) {
        return (value && parseFloat(value)) || 0;
    }
    function convertPercent(value, precision = 0) {
        return value <= 1 ? `${Math.min(precision === 0 ? Math.round(value * 100) : parseFloat((value * 100).toFixed(precision)), 100)}%` : `${value}%`;
    }
    function convertPX(value, fontSize) {
        if (hasValue(value)) {
            if (isNumber(value)) {
                return `${Math.round(value)}px`;
            }
            let result = parseFloat(value);
            if (!isNaN(result)) {
                const match = value.match(/(pt|em)/);
                if (match) {
                    switch (match[0]) {
                        case 'pt':
                            result *= 4 / 3;
                            break;
                        case 'em':
                            result *= parseInt(convertPX(fontSize)) || 16;
                            break;
                    }
                }
                return `${result}px`;
            }
        }
        return '0px';
    }
    function convertAlpha(value) {
        let result = '';
        while (value >= ALPHABET.length) {
            const base = Math.floor(value / ALPHABET.length);
            if (base > 1 && base <= ALPHABET.length) {
                result += ALPHABET.charAt(base - 1);
                value -= base * ALPHABET.length;
            }
            else if (base > ALPHABET.length) {
                result += convertAlpha(base * ALPHABET.length);
                value -= base * ALPHABET.length;
            }
            const index = value % ALPHABET.length;
            result += ALPHABET.charAt(index);
            value -= index + ALPHABET.length;
        }
        result = ALPHABET.charAt(value) + result;
        return result;
    }
    function convertRoman(value) {
        const digits = value.toString().split('');
        let result = '';
        let i = 3;
        while (i--) {
            result = (NUMERALS[parseInt(digits.pop() || '') + (i * 10)] || '') + result;
        }
        return 'M'.repeat(parseInt(digits.join(''))) + result;
    }
    function convertEnum(value, base, derived) {
        for (const key of Object.keys(base)) {
            const index = base[key];
            if (value === index) {
                return derived[key];
            }
        }
        return '';
    }
    function formatPX(value) {
        value = parseFloat(value);
        return `${!isNaN(value) ? Math.round(value) : 0}px`;
    }
    function hasBit(value, type) {
        return (value & type) === type;
    }
    function isNumber(value) {
        return /^-?\d+(\.\d+)?$/.test(value.toString().trim());
    }
    function isString(value) {
        return typeof value === 'string' && value !== '';
    }
    function isArray(value) {
        return Array.isArray(value) && value.length > 0;
    }
    function isUnit(value) {
        return isString(value) ? /^-?[\d.]+(px|pt|em)$/.test(value.trim()) : false;
    }
    function isPercent(value) {
        return /^\d+(\.\d+)?%$/.test(value);
    }
    function includes(source, value, delimiter = ',') {
        return source ? source.split(delimiter).map(segment => segment.trim()).includes(value) : false;
    }
    function optional(obj, value, type) {
        let valid = false;
        let result = null;
        if (typeof obj === 'object') {
            result = obj;
            const attrs = value.split('.');
            let i = 0;
            do {
                result = result[attrs[i]] != null ? result[attrs[i]] : undefined;
            } while (result != null &&
                ++i < attrs.length &&
                typeof result !== 'string' &&
                typeof result !== 'number' &&
                typeof result !== 'boolean');
            valid = result != null && i === attrs.length;
        }
        switch (type) {
            case 'object':
                return valid ? result : undefined;
            case 'number':
                return valid && !isNaN(parseInt(result)) ? parseInt(result) : 0;
            case 'boolean':
                return valid && result === true;
            default:
                return valid ? result.toString() : '';
        }
    }
    function resolvePath(value) {
        if (!DOM_REGEX.URI.test(value)) {
            let pathname = location.pathname.split('/');
            pathname.pop();
            if (value.charAt(0) === '/') {
                value = location.origin + value;
            }
            else {
                if (value.startsWith('../')) {
                    const parts = [];
                    let levels = 0;
                    value.split('/').forEach(dir => {
                        if (dir === '..') {
                            levels++;
                        }
                        else {
                            parts.push(dir);
                        }
                    });
                    pathname = pathname.slice(0, Math.max(pathname.length - levels, 0));
                    pathname.push(...parts);
                    value = location.origin + pathname.join('/');
                }
                else {
                    value = `${location.origin + pathname.join('/')}/${value}`;
                }
            }
        }
        return value;
    }
    function trimNull(value) {
        return value ? value.trim() : '';
    }
    function trimString(value, char) {
        return value ? trimStart(trimEnd(value, char), char) : '';
    }
    function trimStart(value, char) {
        return value ? value.replace(new RegExp(`^${char}+`, 'g'), '') : '';
    }
    function trimEnd(value, char) {
        return value ? value.replace(new RegExp(`${char}+$`, 'g'), '') : '';
    }
    function repeat(many, value = '\t') {
        return value.repeat(many);
    }
    function indexOf(value, ...terms) {
        for (const term of terms) {
            const index = value.indexOf(term);
            if (index !== -1) {
                return index;
            }
        }
        return -1;
    }
    function lastIndexOf(value, char = '/') {
        return value.substring(value.lastIndexOf(char) + 1);
    }
    function hasSameValue(obj1, obj2, ...attrs) {
        for (const attr of attrs) {
            const result = compareObject(obj1, obj2, attr);
            if (!result || result[0] !== result[1]) {
                return false;
            }
        }
        return true;
    }
    function searchObject(obj, value) {
        const result = [];
        if (typeof value === 'object') {
            for (const term in value) {
                const attr = value[term];
                if (hasValue(obj[attr])) {
                    result.push([attr, obj[attr]]);
                }
            }
        }
        else {
            let filter = (a) => (a === value);
            if (/^\*.+\*$/.test(value)) {
                filter = (a) => (a.indexOf(value.replace(/\*/g, '')) !== -1);
            }
            else if (/^\*/.test(value)) {
                filter = (a) => (a.endsWith(value.replace(/\*/, '')));
            }
            else if (/\*$/.test(value)) {
                filter = (a) => (a.startsWith(value.replace(/\*/, '')));
            }
            for (const i in obj) {
                if (filter(i)) {
                    result.push([i, obj[i]]);
                }
            }
        }
        return result;
    }
    function hasValue(value) {
        return typeof value !== 'undefined' && value !== null && value.toString().trim() !== '';
    }
    function withinRange(a, b, offset = 0) {
        return b >= (a - offset) && b <= (a + offset);
    }
    function withinFraction(lower, upper) {
        return (lower === upper ||
            Math.floor(lower) === Math.floor(upper) ||
            Math.ceil(lower) === Math.ceil(upper) ||
            Math.ceil(lower) === Math.floor(upper) ||
            Math.floor(lower) === Math.ceil(upper));
    }
    function overwriteDefault(options, namespace, attr, value) {
        if (namespace !== '') {
            if (options[namespace] == null) {
                options[namespace] = {};
            }
            if (options[namespace][attr] == null) {
                options[namespace][attr] = value;
            }
        }
        else {
            if (options[attr] == null) {
                options[attr] = value;
            }
        }
    }
    function partition(list, predicate) {
        const valid = [];
        const invalid = [];
        for (const node of list) {
            if (predicate(node)) {
                valid.push(node);
            }
            else {
                invalid.push(node);
            }
        }
        return [valid, invalid];
    }
    function sortAsc(list, ...attrs) {
        return sort(list, 0, ...attrs);
    }
    function sortDesc(list, ...attrs) {
        return sort(list, 1, ...attrs);
    }

    var util = /*#__PURE__*/Object.freeze({
        formatString: formatString,
        convertUnderscore: convertUnderscore,
        convertCamelCase: convertCamelCase,
        convertWord: convertWord,
        capitalize: capitalize,
        convertInt: convertInt,
        convertFloat: convertFloat,
        convertPercent: convertPercent,
        convertPX: convertPX,
        convertAlpha: convertAlpha,
        convertRoman: convertRoman,
        convertEnum: convertEnum,
        formatPX: formatPX,
        hasBit: hasBit,
        isNumber: isNumber,
        isString: isString,
        isArray: isArray,
        isUnit: isUnit,
        isPercent: isPercent,
        includes: includes,
        optional: optional,
        resolvePath: resolvePath,
        trimNull: trimNull,
        trimString: trimString,
        trimStart: trimStart,
        trimEnd: trimEnd,
        repeat: repeat,
        indexOf: indexOf,
        lastIndexOf: lastIndexOf,
        hasSameValue: hasSameValue,
        searchObject: searchObject,
        hasValue: hasValue,
        withinRange: withinRange,
        withinFraction: withinFraction,
        overwriteDefault: overwriteDefault,
        partition: partition,
        sortAsc: sortAsc,
        sortDesc: sortDesc
    });

    function isUserAgent(value) {
        let client = USER_AGENT.CHROME;
        if (navigator.userAgent.indexOf('Edge') !== -1) {
            client = USER_AGENT.EDGE;
        }
        else if (navigator.userAgent.indexOf('Firefox') !== -1) {
            client = USER_AGENT.FIREFOX;
        }
        else if (navigator.userAgent.indexOf('Chrome') === -1 && navigator.userAgent.indexOf('Safari') !== -1) {
            client = USER_AGENT.SAFARI;
        }
        return hasBit(value, client);
    }
    function newBoxRect() {
        return {
            top: 0,
            left: 0,
            right: 0,
            bottom: 0
        };
    }
    function newClientRect() {
        return Object.assign({ width: 0, height: 0 }, newBoxRect());
    }
    function newBoxModel() {
        return {
            marginTop: 0,
            marginRight: 0,
            marginBottom: 0,
            marginLeft: 0,
            paddingTop: 0,
            paddingRight: 0,
            paddingBottom: 0,
            paddingLeft: 0
        };
    }
    function convertClientUnit(value, dimension, fontSize, percent = false) {
        if (percent) {
            return isPercent(value) ? convertInt(value) / 100 : (parseFloat(convertPX(value, fontSize)) / dimension);
        }
        else {
            return isPercent(value) ? Math.round(dimension * (convertInt(value) / 100)) : parseInt(convertPX(value, fontSize));
        }
    }
    function getRangeClientRect(element) {
        const range = document.createRange();
        range.selectNodeContents(element);
        const domRect = Array.from(range.getClientRects()).filter(item => !(Math.round(item.width) === 0 && withinFraction(item.left, item.right)));
        let result = newClientRect();
        let multiLine = false;
        if (domRect.length > 0) {
            result = assignBounds(domRect[0]);
            const top = new Set([result.top]);
            const bottom = new Set([result.bottom]);
            for (let i = 1; i < domRect.length; i++) {
                const rect = domRect[i];
                top.add(rect.top);
                bottom.add(rect.bottom);
                result.width += rect.width;
                result.right = Math.max(rect.right, result.right);
                result.height = Math.max(rect.height, result.height);
            }
            if (top.size > 1 && bottom.size > 1) {
                result.top = Math.min.apply(null, Array.from(top));
                result.bottom = Math.max.apply(null, Array.from(bottom));
                if (domRect[domRect.length - 1].top >= domRect[0].bottom &&
                    element.textContent &&
                    (element.textContent.trim() !== '' || /^\s*\n/.test(element.textContent))) {
                    multiLine = true;
                }
            }
        }
        return [result, multiLine];
    }
    function assignBounds(bounds) {
        return {
            top: bounds.top,
            right: bounds.right,
            bottom: bounds.bottom,
            left: bounds.left,
            width: bounds.width,
            height: bounds.height
        };
    }
    function getStyle(element, cache = true) {
        if (element) {
            if (cache) {
                const node = getNodeFromElement(element);
                const style = getElementCache(element, 'style');
                if (style) {
                    return style;
                }
                else if (node) {
                    if (node.style) {
                        return node.style;
                    }
                    else if (node.plainText) {
                        return node.styleMap;
                    }
                }
            }
            if (element.nodeName && element.nodeName.charAt(0) !== '#') {
                const style = getComputedStyle(element);
                setElementCache(element, 'style', style);
                return style;
            }
        }
        return {};
    }
    function getBoxSpacing(element, complete = false, merge = false) {
        const result = {};
        const node = getNodeFromElement(element);
        const style = getStyle(element);
        ['Top', 'Left', 'Right', 'Bottom'].forEach(direction => {
            let total = 0;
            ['padding', 'margin'].forEach(region => {
                const attr = region + direction;
                const value = convertInt((node || style)[attr]);
                if (complete || value !== 0) {
                    result[attr] = value;
                }
                total += value;
            });
            if (merge) {
                result[`padding${direction}`] = total;
                if (complete) {
                    result[`margin${direction}`] = 0;
                }
                else {
                    delete result[`margin${direction}`];
                }
            }
        });
        return result;
    }
    function cssResolveUrl(value) {
        const match = value.match(DOM_REGEX.CSS_URL);
        if (match) {
            return resolvePath(match[1]);
        }
        return '';
    }
    function cssInherit(element, attr, exclude, tagNames) {
        let result = '';
        let current = element.parentElement;
        while (current && (tagNames == null || !tagNames.includes(current.tagName))) {
            result = getStyle(current)[attr] || '';
            if (result === 'inherit' || (exclude && exclude.some(value => result.indexOf(value) !== -1))) {
                result = '';
            }
            if (current === document.body || result) {
                break;
            }
            current = current.parentElement;
        }
        return result;
    }
    function cssParent(element, attr, ...styles) {
        if (element.nodeName.charAt(0) !== '#') {
            if (styles.includes(getStyle(element)[attr])) {
                return true;
            }
        }
        if (element.parentElement) {
            return styles.includes(getStyle(element.parentElement)[attr]);
        }
        return false;
    }
    function cssFromParent(element, attr) {
        if (isStyleElement(element) && element.parentElement) {
            const node = getNodeFromElement(element);
            const style = getStyle(element);
            return (style &&
                style[attr] === getStyle(element.parentElement)[attr] && (!node ||
                !node.styleMap[attr]));
        }
        return false;
    }
    function cssAttribute(element, attr) {
        return element.getAttribute(attr) || getStyle(element)[convertCamelCase(attr)] || '';
    }
    function getBackgroundPosition(value, dimension, fontSize, leftPerspective = false, percent = false) {
        const result = {
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            horizontal: 'left',
            vertical: 'top',
            originalX: '',
            originalY: ''
        };
        const orientation = value.split(' ');
        if (orientation.length === 4) {
            orientation.forEach((position, index) => {
                switch (index) {
                    case 0:
                        result.horizontal = position;
                        break;
                    case 2:
                        result.vertical = position;
                        break;
                    case 1:
                    case 3:
                        const clientXY = convertClientUnit(position, index === 1 ? dimension.width : dimension.height, fontSize, percent);
                        if (index === 1) {
                            if (leftPerspective) {
                                if (result.horizontal === 'right') {
                                    if (isPercent(position)) {
                                        result.originalX = `${100 - parseInt(position)}%`;
                                    }
                                    else {
                                        result.originalX = formatPX(dimension.width - parseInt(convertPX(position, fontSize)));
                                    }
                                    result.right = clientXY;
                                    result.left = percent ? 1 - clientXY : dimension.width - clientXY;
                                }
                                else {
                                    result.left = clientXY;
                                    result.originalX = position;
                                }
                            }
                            else {
                                if (result.horizontal !== 'center') {
                                    result[result.horizontal] = clientXY;
                                }
                            }
                        }
                        else {
                            if (leftPerspective) {
                                if (result.vertical === 'bottom') {
                                    if (isPercent(position)) {
                                        result.originalY = `${100 - parseInt(position)}%`;
                                    }
                                    else {
                                        result.originalY = formatPX(dimension.height - parseInt(convertPX(position, fontSize)));
                                    }
                                    result.bottom = clientXY;
                                    result.top = percent ? 1 - clientXY : dimension.height - clientXY;
                                }
                                else {
                                    result.top = clientXY;
                                    result.originalY = position;
                                }
                            }
                            else {
                                if (result.vertical !== 'center') {
                                    result[result.vertical] = clientXY;
                                }
                            }
                        }
                        break;
                }
            });
        }
        else if (orientation.length === 2) {
            orientation.forEach((position, index) => {
                const offsetParent = index === 0 ? dimension.width : dimension.height;
                const direction = index === 0 ? 'left' : 'top';
                const original = index === 0 ? 'originalX' : 'originalY';
                const clientXY = convertClientUnit(position, offsetParent, fontSize, percent);
                if (isPercent(position)) {
                    result[direction] = clientXY;
                    result[original] = position;
                }
                else {
                    if (/^[a-z]+$/.test(position)) {
                        result[index === 0 ? 'horizontal' : 'vertical'] = position;
                        if (leftPerspective) {
                            switch (position) {
                                case 'left':
                                case 'top':
                                    result[original] = '0%';
                                    break;
                                case 'right':
                                case 'bottom':
                                    result[direction] = percent ? 1 : offsetParent;
                                    result[original] = '100%';
                                    break;
                                case 'center':
                                    result[direction] = percent ? 0.5 : Math.round(offsetParent / 2);
                                    result[original] = '50%';
                                    break;
                            }
                        }
                    }
                    else {
                        result[direction] = clientXY;
                        result[original] = position;
                    }
                }
            });
        }
        return result;
    }
    function getFirstElementChild(elements) {
        if (elements.length > 0) {
            const parentElement = elements[0].parentElement;
            if (parentElement) {
                for (let i = 0; i < parentElement.childNodes.length; i++) {
                    const element = parentElement.childNodes[i];
                    if (elements.includes(element)) {
                        return element;
                    }
                }
            }
        }
        return undefined;
    }
    function getLastElementChild(elements) {
        if (elements.length > 0) {
            const parentElement = elements[0].parentElement;
            if (parentElement) {
                for (let i = parentElement.childNodes.length - 1; i >= 0; i--) {
                    const element = parentElement.childNodes[i];
                    if (elements.includes(element)) {
                        return element;
                    }
                }
            }
        }
        return undefined;
    }
    function hasFreeFormText(element, maxDepth = 0, whiteSpace = true) {
        let depth = -1;
        function findFreeForm(elements) {
            if (depth++ === maxDepth) {
                return false;
            }
            return elements.some((item) => {
                if (item.nodeName === '#text') {
                    if (isPlainText(item, whiteSpace) || (cssParent(item, 'whiteSpace', 'pre', 'pre-wrap') && item.textContent && item.textContent !== '')) {
                        return true;
                    }
                }
                else if (item instanceof HTMLElement &&
                    item.childNodes.length > 0 &&
                    findFreeForm(Array.from(item.childNodes))) {
                    return true;
                }
                return false;
            });
        }
        if (element.nodeName === '#text') {
            maxDepth = 0;
            return findFreeForm([element]);
        }
        else {
            return findFreeForm(Array.from(element.childNodes));
        }
    }
    function isPlainText(element, whiteSpace = false) {
        if (element && element.nodeName === '#text' && element.textContent) {
            if (whiteSpace) {
                const value = element.textContent;
                let valid = false;
                for (let i = 0; i < value.length; i++) {
                    switch (value.charCodeAt(i)) {
                        case 9:
                        case 10:
                        case 13:
                        case 32:
                            continue;
                        default:
                            valid = true;
                            break;
                    }
                }
                return valid && value !== '';
            }
            else {
                return element.textContent.trim() !== '';
            }
        }
        return false;
    }
    function hasLineBreak(element) {
        if (element) {
            const node = getNodeFromElement(element);
            const fromParent = element.nodeName === '#text';
            const whiteSpace = node ? node.css('whiteSpace') : (getStyle(element).whiteSpace || '');
            return ((element instanceof HTMLElement && element.children.length > 0 && Array.from(element.children).some(item => item.tagName === 'BR')) ||
                (/\n/.test(element.textContent || '') && (['pre', 'pre-wrap'].includes(whiteSpace) ||
                    (fromParent && cssParent(element, 'whiteSpace', 'pre', 'pre-wrap')))));
        }
        return false;
    }
    function isLineBreak(element, excluded = true) {
        const node = getNodeFromElement(element);
        if (node) {
            return (node.tagName === 'BR' ||
                (excluded && node.block && (node.excluded ||
                    node.textContent.trim() === '')));
        }
        return false;
    }
    function getElementsBetweenSiblings(firstElement, secondElement, cacheNode = false, whiteSpace = false) {
        if (!firstElement || firstElement.parentElement === secondElement.parentElement) {
            const parentElement = secondElement.parentElement;
            if (parentElement) {
                const elements = Array.from(parentElement.childNodes);
                const firstIndex = firstElement ? elements.findIndex(element => element === firstElement) : 0;
                const secondIndex = elements.findIndex(element => element === secondElement);
                if (firstIndex !== -1 && secondIndex !== -1 && firstIndex !== secondIndex) {
                    let result = elements.slice(Math.min(firstIndex, secondIndex) + 1, Math.max(firstIndex, secondIndex));
                    if (!whiteSpace) {
                        result = result.filter(element => {
                            if (element.nodeName.charAt(0) === '#') {
                                return isPlainText(element);
                            }
                            return true;
                        });
                    }
                    else {
                        result = result.filter(element => element.nodeName !== '#comment');
                    }
                    if (cacheNode) {
                        result = result.filter(element => getNodeFromElement(element));
                    }
                    return result;
                }
            }
        }
        return [];
    }
    function isStyleElement(element) {
        return element instanceof HTMLElement || element instanceof SVGSVGElement;
    }
    function isElementVisible(element, hideOffScreen) {
        if (!getElementCache(element, 'inlineSupport') && !(element.parentElement instanceof SVGSVGElement)) {
            if (isStyleElement(element)) {
                if (typeof element.getBoundingClientRect === 'function') {
                    const bounds = element.getBoundingClientRect();
                    if (bounds.width !== 0 && bounds.height !== 0) {
                        return !(hideOffScreen && bounds.left < 0 && bounds.top < 0 && Math.abs(bounds.left) >= bounds.width && Math.abs(bounds.top) >= bounds.height);
                    }
                    else if (hasValue(element.dataset.ext) || getStyle(element).clear !== 'none') {
                        return true;
                    }
                    else {
                        let current = element.parentElement;
                        let valid = true;
                        while (current) {
                            if (getStyle(current).display === 'none') {
                                valid = false;
                                break;
                            }
                            current = current.parentElement;
                        }
                        if (valid) {
                            if (element.children.length > 0) {
                                return Array.from(element.children).some((item) => {
                                    const style = getStyle(item);
                                    const float = style.cssFloat;
                                    const position = style.position;
                                    return ((position !== 'static' && position !== 'initial') ||
                                        float === 'left' ||
                                        float === 'right');
                                });
                            }
                        }
                    }
                }
                return false;
            }
            else {
                return isPlainText(element);
            }
        }
        return false;
    }
    function getNestedExtension(element, name) {
        if (isStyleElement(element)) {
            return Array.from(element.children).find((item) => includes(item.dataset.ext, name));
        }
        return undefined;
    }
    function setElementCache(element, attr, data) {
        if (element) {
            element[`__${attr}`] = data;
        }
    }
    function getElementCache(element, attr) {
        return element ? element[`__${attr}`] : undefined;
    }
    function deleteElementCache(element, ...attrs) {
        if (element) {
            for (const attr of attrs) {
                delete element[`__${attr}`];
            }
        }
    }
    function getNodeFromElement(element) {
        return element ? getElementCache(element, 'node') : undefined;
    }

    var dom = /*#__PURE__*/Object.freeze({
        isUserAgent: isUserAgent,
        newBoxRect: newBoxRect,
        newClientRect: newClientRect,
        newBoxModel: newBoxModel,
        convertClientUnit: convertClientUnit,
        getRangeClientRect: getRangeClientRect,
        assignBounds: assignBounds,
        getStyle: getStyle,
        getBoxSpacing: getBoxSpacing,
        cssResolveUrl: cssResolveUrl,
        cssInherit: cssInherit,
        cssParent: cssParent,
        cssFromParent: cssFromParent,
        cssAttribute: cssAttribute,
        getBackgroundPosition: getBackgroundPosition,
        getFirstElementChild: getFirstElementChild,
        getLastElementChild: getLastElementChild,
        hasFreeFormText: hasFreeFormText,
        isPlainText: isPlainText,
        hasLineBreak: hasLineBreak,
        isLineBreak: isLineBreak,
        getElementsBetweenSiblings: getElementsBetweenSiblings,
        isStyleElement: isStyleElement,
        isElementVisible: isElementVisible,
        getNestedExtension: getNestedExtension,
        setElementCache: setElementCache,
        getElementCache: getElementCache,
        deleteElementCache: deleteElementCache,
        getNodeFromElement: getNodeFromElement
    });

    class Node extends Container {
        constructor(id, element) {
            super();
            this.id = id;
            this.styleMap = {};
            this.nodeType = 0;
            this.alignmentType = 0;
            this.depth = -1;
            this.siblingIndex = Number.MAX_VALUE;
            this.renderIndex = Number.MAX_VALUE;
            this.renderPosition = -1;
            this.excludeSection = 0;
            this.excludeProcedure = 0;
            this.excludeResource = 0;
            this.documentRoot = false;
            this.auto = true;
            this.visible = true;
            this.excluded = false;
            this.rendered = false;
            this.renderExtension = new Set();
            this._data = {};
            this._initialized = false;
            this.initial = {
                depth: -1,
                children: [],
                styleMap: {},
                bounds: newClientRect()
            };
            if (element) {
                this._element = element;
                this.init();
            }
        }
        static getNodeFromElement(element) {
            return getNodeFromElement(element);
        }
        init() {
            if (!this._initialized) {
                if (this.styleElement) {
                    const element = this._element;
                    const styleMap = getElementCache(element, 'styleMap') || {};
                    Array.from(element.style).forEach(value => styleMap[convertCamelCase(value)] = element.style[value]);
                    this.style = getElementCache(element, 'style') || getComputedStyle(element);
                    this.styleMap = Object.assign({}, styleMap);
                    Object.assign(this.initial.styleMap, styleMap);
                }
                if (this.id !== 0) {
                    setElementCache(this._element, 'node', this);
                }
                this._initialized = true;
            }
        }
        is(...views) {
            return views.some(value => this.nodeType === value);
        }
        of(nodeType, ...alignmentType) {
            return this.nodeType === nodeType && alignmentType.some(value => this.hasAlign(value));
        }
        attr(obj, attr, value = '', overwrite = true) {
            const name = `_${obj || '_'}`;
            if (hasValue(value)) {
                if (this[name] == null) {
                    this._namespaces.add(obj);
                    this[name] = {};
                }
                if (!overwrite && this[name][attr] != null) {
                    return '';
                }
                this[name][attr] = value.toString();
            }
            return this[name][attr] || '';
        }
        namespace(obj) {
            const name = `_${obj || '_'}`;
            return this[name] || {};
        }
        delete(obj, ...attrs) {
            const name = `_${obj || '_'}`;
            if (this[name]) {
                for (const attr of attrs) {
                    if (attr.indexOf('*') !== -1) {
                        for (const [key] of searchObject(this[name], attr)) {
                            delete this[name][key];
                        }
                    }
                    else {
                        delete this[name][attr];
                    }
                }
            }
        }
        apply(options) {
            if (typeof options === 'object') {
                for (const obj in options) {
                    const attrs = options[obj];
                    if (typeof attrs === 'object') {
                        for (const attr in attrs) {
                            this.attr(obj, attr, attrs[attr]);
                        }
                        delete options[obj];
                    }
                }
            }
        }
        each(predicate, rendered = false) {
            (rendered ? this.renderChildren : this.list).forEach(predicate);
            return this;
        }
        render(parent) {
            this.renderParent = parent;
            this.renderDepth = this.documentRoot || this === parent || hasValue(parent.dataset.target) ? 0 : parent.renderDepth + 1;
            this.rendered = true;
        }
        hide() {
            this.rendered = true;
            this.visible = false;
        }
        data(obj, attr, value, overwrite = true) {
            if (hasValue(value)) {
                if (this._data[obj] == null) {
                    this._data[obj] = {};
                }
                if (overwrite || this._data[obj][attr] == null) {
                    this._data[obj][attr] = value;
                }
            }
            return this._data[obj] != null ? this._data[obj][attr] : undefined;
        }
        ascend(generated = false, levels = -1) {
            const result = [];
            const attr = generated ? 'parent' : 'documentParent';
            let current = this[attr];
            let i = -1;
            while (current && current.id !== 0 && !result.includes(current)) {
                result.push(current);
                if (++i === levels) {
                    break;
                }
                current = current[attr];
            }
            return result;
        }
        cascade() {
            function cascade(node) {
                const current = [...node.list];
                for (const item of node) {
                    current.push(...cascade(item));
                }
                return current;
            }
            return cascade(this);
        }
        inherit(node, ...props) {
            if (this._initialized) {
                function copyMap(source, destination) {
                    for (const attr in source) {
                        if (source[attr] == null) {
                            destination[attr] = source[attr];
                        }
                    }
                }
                for (const type of props) {
                    switch (type) {
                        case 'initial':
                            Object.assign(this.initial, node.initial);
                            break;
                        case 'base':
                            this.style = node.style;
                            this.documentParent = node.documentParent;
                        case 'dimensions':
                            this.bounds = assignBounds(node.bounds);
                            this.linear = assignBounds(node.linear);
                            this.box = assignBounds(node.box);
                            break;
                        case 'data':
                            for (const obj in this._data) {
                                for (const name in this._data[obj]) {
                                    const source = this._data[obj][name];
                                    if (typeof source === 'object' && source.inherit === true) {
                                        const destination = node.data(obj, name);
                                        if (destination) {
                                            for (const attr in source) {
                                                switch (typeof source[attr]) {
                                                    case 'number':
                                                        destination[attr] += source[attr];
                                                        break;
                                                    case 'boolean':
                                                        if (source[attr] === true) {
                                                            destination[attr] = true;
                                                        }
                                                        break;
                                                    default:
                                                        destination[attr] = source[attr];
                                                        break;
                                                }
                                            }
                                        }
                                        else {
                                            node.data(obj, name, source);
                                        }
                                        delete this._data[obj][name];
                                    }
                                }
                            }
                            break;
                        case 'alignment':
                            ['position', 'display', 'verticalAlign', 'cssFloat', 'clear'].forEach(value => {
                                this.styleMap[value] = node.css(value);
                                this.initial.styleMap[value] = node.cssInitial(value);
                            });
                            if (node.css('marginLeft') === 'auto') {
                                this.styleMap.marginLeft = 'auto';
                                this.initial.styleMap.marginLeft = 'auto';
                            }
                            if (node.css('marginRight') === 'auto') {
                                this.styleMap.marginRight = 'auto';
                                this.initial.styleMap.marginRight = 'auto';
                            }
                            break;
                        case 'style':
                            const style = { whiteSpace: node.css('whiteSpace') };
                            for (const attr in node.style) {
                                if (attr.startsWith('font') || attr.startsWith('color')) {
                                    const key = convertCamelCase(attr);
                                    style[key] = node.style[key];
                                }
                            }
                            this.css(style);
                            break;
                        case 'styleMap':
                            copyMap(node.styleMap, this.styleMap);
                            break;
                    }
                }
            }
        }
        alignedVertically(previous, cleared = new Map(), firstNode = false) {
            if (previous && this.documentParent.baseElement === previous.documentParent.baseElement) {
                const widthParent = this.documentParent.has('width', CSS_STANDARD.UNIT) ? this.documentParent.toInt('width') : this.documentParent.box.width;
                return (this.lineBreak ||
                    previous.lineBreak ||
                    previous.blockStatic ||
                    (previous.bounds && previous.bounds.width > widthParent && (!previous.textElement || previous.css('whiteSpace') === 'nowrap')) ||
                    (previous.float === 'left' && this.autoMarginRight) ||
                    (previous.float === 'right' && this.autoMarginLeft) ||
                    (!previous.floating && ((!this.inlineElement && !this.floating) || this.blockStatic)) ||
                    (previous.plainText && previous.multiLine && (this.parent && !this.parent.is(NODE_STANDARD.RELATIVE))) ||
                    (this.blockStatic && (!previous.inlineElement || (cleared.has(previous) && previous.floating))) ||
                    (!firstNode && cleared.has(this)) ||
                    (!firstNode && this.floating && previous.floating && this.linear.top >= previous.linear.bottom));
            }
            return false;
        }
        intersect(rect, dimension = 'linear') {
            const bounds = this[dimension] || this.linear;
            const top = rect.top > bounds.top && rect.top < bounds.bottom;
            const right = Math.floor(rect.right) > Math.ceil(bounds.left) && rect.right < bounds.right;
            const bottom = Math.floor(rect.bottom) > Math.ceil(bounds.top) && rect.bottom < bounds.bottom;
            const left = rect.left > bounds.left && rect.left < bounds.right;
            return (top && (left || right)) || (bottom && (left || right));
        }
        intersectX(rect, dimension = 'linear') {
            const bounds = this[dimension] || this.linear;
            return ((rect.top >= bounds.top && rect.top < bounds.bottom) ||
                (rect.bottom > bounds.top && rect.bottom <= bounds.bottom) ||
                (bounds.top >= rect.top && this[dimension].bottom <= rect.bottom) ||
                (rect.top >= bounds.top && rect.bottom <= bounds.bottom));
        }
        intersectY(rect, dimension = 'linear') {
            const bounds = this[dimension] || this.linear;
            return ((rect.left >= bounds.left && rect.left < bounds.right) ||
                (rect.right > bounds.left && rect.right <= bounds.right) ||
                (bounds.left >= rect.left && bounds.right <= rect.right) ||
                (rect.left >= bounds.left && rect.right <= bounds.right));
        }
        withinX(rect, dimension = 'linear') {
            const bounds = this[dimension] || this.linear;
            return bounds.top >= rect.top && bounds.bottom <= rect.bottom;
        }
        withinY(rect, dimension = 'linear') {
            const bounds = this[dimension] || this.linear;
            return bounds.left >= rect.left && bounds.right <= rect.right;
        }
        outsideX(rect, dimension = 'linear') {
            const bounds = this[dimension] || this.linear;
            return bounds.right < rect.left || bounds.left > rect.right;
        }
        outsideY(rect, dimension = 'linear') {
            const bounds = this[dimension] || this.linear;
            return bounds.bottom < rect.top || bounds.top > rect.bottom;
        }
        css(attr, value = '') {
            if (typeof attr === 'object') {
                Object.assign(this.styleMap, attr);
                return '';
            }
            else {
                if (arguments.length === 2) {
                    this.styleMap[attr] = hasValue(value) ? value : '';
                }
                return this.styleMap[attr] || (this.style && this.style[attr]) || '';
            }
        }
        cssInitial(attr, complete = false) {
            return this.initial.styleMap[attr] || (complete ? this.css(attr) : '');
        }
        cssParent(attr, startChild = false, ignoreHidden = false) {
            let result = '';
            if (this.baseElement) {
                let current = startChild ? this : Node.getNodeFromElement(this.baseElement.parentElement);
                while (current) {
                    result = current.initial.styleMap[attr] || '';
                    if (result || current.documentBody) {
                        if (ignoreHidden && !current.visible) {
                            result = '';
                        }
                        break;
                    }
                    current = Node.getNodeFromElement(current.baseElement.parentElement);
                }
            }
            return result;
        }
        has(attr, checkType = 0, options) {
            const value = (options && options.map === 'initial' ? this.initial.styleMap : this.styleMap)[attr];
            if (hasValue(value)) {
                switch (value) {
                    case '0px':
                        if (hasBit(checkType, CSS_STANDARD.ZERO)) {
                            return true;
                        }
                    case 'left':
                        if (hasBit(checkType, CSS_STANDARD.LEFT)) {
                            return true;
                        }
                    case 'baseline':
                        if (hasBit(checkType, CSS_STANDARD.BASELINE)) {
                            return true;
                        }
                    case 'auto':
                        if (hasBit(checkType, CSS_STANDARD.AUTO)) {
                            return true;
                        }
                    case 'none':
                    case 'initial':
                    case 'normal':
                    case 'transparent':
                    case 'rgba(0, 0, 0, 0)':
                        return false;
                    default:
                        if (options) {
                            if (options.not != null) {
                                if (Array.isArray(options.not)) {
                                    for (const exclude of options.not) {
                                        if (value === exclude) {
                                            return false;
                                        }
                                    }
                                }
                                else {
                                    if (value === options.not) {
                                        return false;
                                    }
                                }
                            }
                        }
                        let result = checkType === 0;
                        if (hasBit(checkType, CSS_STANDARD.UNIT) && isUnit(value)) {
                            result = true;
                        }
                        if (hasBit(checkType, CSS_STANDARD.PERCENT) && isPercent(value)) {
                            result = true;
                        }
                        if (hasBit(checkType, CSS_STANDARD.AUTO)) {
                            result = false;
                        }
                        return result;
                }
            }
            return false;
        }
        isSet(obj, attr) {
            return this[obj] && this[obj][attr] != null ? hasValue(this[obj][attr]) : false;
        }
        hasBit(attr, value) {
            if (this[attr] != null) {
                return hasBit(this[attr], value);
            }
            return false;
        }
        toInt(attr, defaultValue = 0, options) {
            const value = (options && options.map === 'initial' ? this.initial.styleMap : this.styleMap)[attr];
            return parseInt(value) || defaultValue;
        }
        hasAlign(value) {
            return hasBit(this.alignmentType, value);
        }
        setExclusions() {
            if (this.styleElement) {
                [['excludeSection', APP_SECTION], ['excludeProcedure', NODE_PROCEDURE], ['excludeResource', NODE_RESOURCE]].forEach((item) => {
                    let exclude = this.dataset[item[0]] || '';
                    if (this._element.parentElement) {
                        exclude += '|' + trimNull(this._element.parentElement.dataset[`${item[0]}Child`]);
                    }
                    exclude.split('|').map(value => value.toUpperCase().trim()).forEach(value => {
                        if (item[1][value] != null) {
                            this[item[0]] |= item[1][value];
                        }
                    });
                });
            }
        }
        setBounds(calibrate = false) {
            if (this._element) {
                if (!calibrate) {
                    if (this.styleElement) {
                        this.bounds = assignBounds(this._element.getBoundingClientRect());
                    }
                    else {
                        const bounds = getRangeClientRect(this._element);
                        if (bounds[0]) {
                            this.bounds = bounds[0];
                        }
                    }
                }
            }
            if (this.bounds) {
                if (this.initial.bounds.width === 0 && this.initial.bounds.height === 0) {
                    Object.assign(this.initial.bounds, assignBounds(this.bounds));
                }
                this.linear = {
                    top: this.bounds.top - (this.marginTop > 0 ? this.marginTop : 0),
                    right: this.bounds.right + this.marginRight,
                    bottom: this.bounds.bottom + this.marginBottom,
                    left: this.bounds.left - (this.marginLeft > 0 ? this.marginLeft : 0),
                    width: 0,
                    height: 0
                };
                this.box = {
                    top: this.bounds.top + (this.paddingTop + this.borderTopWidth),
                    right: this.bounds.right - (this.paddingRight + this.borderRightWidth),
                    bottom: this.bounds.bottom - (this.paddingBottom + this.borderBottomWidth),
                    left: this.bounds.left + (this.paddingLeft + this.borderLeftWidth),
                    width: 0,
                    height: 0
                };
                this.setDimensions();
            }
        }
        setDimensions(region = ['linear', 'box']) {
            for (const dimension of region) {
                const bounds = this[dimension];
                bounds.width = this.bounds.width;
                if (!this.plainText) {
                    switch (dimension) {
                        case 'linear':
                            bounds.width += (this.marginLeft > 0 ? this.marginLeft : 0) + this.marginRight;
                            break;
                        case 'box':
                            bounds.width -= this.paddingLeft + this.borderLeftWidth + this.paddingRight + this.borderRightWidth;
                            break;
                    }
                }
                bounds.height = bounds.bottom - bounds.top;
                if (this.initial[dimension] == null) {
                    this.initial[dimension] = assignBounds(bounds);
                }
            }
        }
        setMultiLine() {
            if (this._element) {
                this._multiLine = false;
                switch (this._element.tagName) {
                    case 'IMG':
                    case 'INPUT':
                    case 'BUTTON':
                    case 'TEXTAREA':
                    case 'HR':
                    case 'IFRAME':
                        return;
                    default:
                        if (this.textElement) {
                            const [bounds, multiLine] = getRangeClientRect(this._element);
                            if (this.plainText) {
                                if (bounds) {
                                    this.bounds = bounds;
                                    this.setBounds(true);
                                }
                                else {
                                    this.hide();
                                }
                                this.multiLine = multiLine;
                            }
                            else {
                                if (!this.hasWidth && (this.blockStatic || this.display === 'table-cell' || hasLineBreak(this._element))) {
                                    this.multiLine = multiLine;
                                }
                            }
                        }
                        break;
                }
            }
            else {
                this._multiLine = false;
            }
        }
        getParentElementAsNode(negative = false) {
            if (this._element) {
                let parent = Node.getNodeFromElement(this._element.parentElement);
                if (!this.pageflow) {
                    let found = false;
                    let previous;
                    let relativeParent;
                    let outside = false;
                    while (parent && parent.id !== 0) {
                        if (!relativeParent && this.position === 'absolute') {
                            if (!['static', 'initial'].includes(parent.position)) {
                                const top = convertInt(this.top);
                                const left = convertInt(this.left);
                                if ((top >= 0 && left >= 0) ||
                                    !negative ||
                                    (negative && Math.abs(top) <= parent.marginTop && Math.abs(left) <= parent.marginLeft) ||
                                    this.imageElement) {
                                    if (negative &&
                                        !parent.documentRoot &&
                                        top !== 0 &&
                                        left !== 0 &&
                                        this.bottom == null &&
                                        this.right == null &&
                                        (this.outsideX(parent.linear) || this.outsideY(parent.linear))) {
                                        outside = true;
                                    }
                                    else {
                                        found = true;
                                        break;
                                    }
                                }
                                relativeParent = parent;
                            }
                        }
                        else {
                            if ((this.withinX(parent.box) && this.withinY(parent.box)) ||
                                (previous && ((this.linear.top >= parent.linear.top && this.linear.top < previous.linear.top) ||
                                    (this.linear.right <= parent.linear.right && this.linear.right > previous.linear.right) ||
                                    (this.linear.bottom <= parent.linear.bottom && this.linear.bottom > previous.linear.bottom) ||
                                    (this.linear.left >= parent.linear.left && this.linear.left < previous.linear.left)))) {
                                found = true;
                                break;
                            }
                        }
                        previous = parent;
                        parent = Node.getNodeFromElement(parent.element.parentElement);
                    }
                    if (!found && !outside) {
                        parent = relativeParent;
                    }
                }
                return parent;
            }
            return undefined;
        }
        replaceNode(node, withNode, append = true) {
            for (let i = 0; i < this.length; i++) {
                if (node === this.item(i)) {
                    this.item(i, withNode);
                    withNode.parent = this;
                    return true;
                }
            }
            if (append) {
                withNode.parent = this;
                return true;
            }
            return false;
        }
        appendRendered(node) {
            if (this.renderChildren.indexOf(node) === -1) {
                node.renderIndex = this.renderChildren.length;
                this.renderChildren.push(node);
            }
        }
        resetBox(region, node, negative = false) {
            const attrs = [];
            if (hasBit(region, BOX_STANDARD.MARGIN)) {
                attrs.push('marginTop', 'marginRight', 'marginBottom', 'marginLeft');
            }
            if (hasBit(region, BOX_STANDARD.PADDING)) {
                attrs.push('paddingTop', 'paddingRight', 'paddingBottom', 'paddingLeft');
            }
            for (const attr of attrs) {
                this._boxReset[attr] = 1;
                if (node) {
                    node.modifyBox(attr, this[attr], negative);
                }
            }
        }
        removeElement() {
            if (this._element) {
                if (this._nodeName == null) {
                    this._nodeName = this.nodeName;
                }
                if (this._tagName == null) {
                    this._tagName = this.tagName;
                }
                this._baseElement = this._element;
                this._element = undefined;
            }
        }
        previousSibling(pageflow = false, lineBreak = true, excluded = true) {
            let element;
            if (this._element) {
                element = this._element.previousSibling;
            }
            else if (this.initial.children.length > 0) {
                const list = this.initial.children.filter(node => pageflow ? node.pageflow : node.siblingflow);
                element = list.length > 0 ? list[0].element.previousSibling : undefined;
            }
            while (element) {
                const node = Node.getNodeFromElement(element);
                if (node &&
                    !(node.lineBreak && !lineBreak) &&
                    !(node.excluded && !excluded) && ((pageflow && node.pageflow) ||
                    (!pageflow && node.siblingflow))) {
                    return node;
                }
                element = element.previousSibling;
            }
            return undefined;
        }
        nextSibling(pageflow = false, lineBreak = true, excluded = true) {
            let element;
            if (this._element) {
                element = this._element.nextSibling;
            }
            else if (this.initial.children.length > 0) {
                const list = this.initial.children.filter(node => pageflow ? node.pageflow : node.siblingflow);
                element = list.length > 0 ? list[0].element.nextSibling : undefined;
            }
            while (element) {
                const node = Node.getNodeFromElement(element);
                if (node &&
                    !(node.lineBreak && !lineBreak) &&
                    !(node.excluded && !excluded) &&
                    (pageflow && node.pageflow || !pageflow && node.siblingflow)) {
                    return node;
                }
                element = element.nextSibling;
            }
            return undefined;
        }
        actualLeft(dimension = 'linear') {
            return this.companion && !this.companion.visible && this.companion[dimension] ? Math.min(this[dimension].left, this.companion[dimension].left) : this[dimension].left;
        }
        actualRight(dimension = 'linear') {
            return this.companion && !this.companion.visible && this.companion[dimension] ? Math.max(this[dimension].right, this.companion[dimension].right) : this[dimension].right;
        }
        boxAttribute(region, direction) {
            const attr = region + direction;
            if (this.styleElement) {
                const value = this.css(attr);
                if (isPercent(value)) {
                    return this.style[attr] && this.style[attr] !== value ? convertInt(this.style[attr]) : this.documentParent.box[(direction === 'Left' || direction === 'Right' ? 'width' : 'height')] * (convertInt(value) / 100);
                }
                else {
                    return convertInt(value);
                }
            }
            else {
                return convertInt(this.css(attr));
            }
        }
        getOverflow() {
            if (this._overflow == null) {
                this._overflow = 0;
                if (this.styleElement) {
                    const [overflow, overflowX, overflowY] = [this.css('overflow'), this.css('overflowX'), this.css('overflowY')];
                    if (this.toInt('width') > 0 && (overflow === 'scroll' ||
                        overflowX === 'scroll' ||
                        (overflowX === 'auto' && this._element.clientWidth !== this._element.scrollWidth))) {
                        this._overflow |= NODE_ALIGNMENT.HORIZONTAL;
                    }
                    if (this.toInt('height') > 0 && (overflow === 'scroll' ||
                        overflowY === 'scroll' ||
                        (overflowY === 'auto' && this._element.clientHeight !== this._element.scrollHeight))) {
                        this._overflow |= NODE_ALIGNMENT.VERTICAL;
                    }
                }
            }
            return this._overflow;
        }
        set parent(value) {
            if (value !== this._parent) {
                if (this._parent) {
                    this._parent.remove(this);
                }
                this._parent = value;
            }
            if (value) {
                if (!value.contains(this)) {
                    value.append(this);
                    if (!value.styleElement && this.siblingIndex !== -1) {
                        value.siblingIndex = Math.min(this.siblingIndex, value.siblingIndex);
                    }
                }
                if (this.initial.depth === -1) {
                    this.initial.depth = value.depth + 1;
                }
                this.depth = value.depth + 1;
            }
            else {
                this.depth = -1;
            }
        }
        get parent() {
            return this._parent;
        }
        set nodeName(value) {
            this._nodeName = value;
        }
        get nodeName() {
            return (this._nodeName ||
                (this.styleElement ? (this.tagName === 'INPUT' ? this._element.type : this.tagName).toUpperCase() : ''));
        }
        set element(value) {
            this._element = value;
        }
        get element() {
            return this._element || { dataset: {}, style: {} };
        }
        set baseElement(value) {
            this._baseElement = value;
        }
        get baseElement() {
            return this._baseElement || this.element;
        }
        get tagName() {
            return (this._tagName || (this._element && this._element.tagName) || '').toUpperCase();
        }
        get htmlElement() {
            return this._element instanceof HTMLElement;
        }
        get domElement() {
            return this.styleElement || this.plainText;
        }
        get styleElement() {
            return this._element instanceof HTMLElement || this.svgElement;
        }
        get documentBody() {
            return this._element === document.body;
        }
        set renderAs(value) {
            if (!this.rendered && !value.rendered) {
                this._renderAs = value;
            }
        }
        get renderAs() {
            return this._renderAs;
        }
        set renderDepth(value) {
            this._renderDepth = value;
        }
        get renderDepth() {
            if (this._renderDepth == null) {
                if (this.documentRoot) {
                    this._renderDepth = 0;
                }
                else {
                    if (this.parent) {
                        this._renderDepth = this.parent.renderDepth + 1;
                    }
                }
            }
            return this._renderDepth || 0;
        }
        get dataset() {
            return this._element instanceof HTMLElement ? this._element.dataset : {};
        }
        get extension() {
            return this.dataset.ext ? this.dataset.ext.split(',')[0].trim() : '';
        }
        get flex() {
            const style = this.style;
            if (style) {
                return {
                    enabled: (style.display.indexOf('flex') !== -1),
                    direction: style.flexDirection,
                    basis: style.flexBasis,
                    grow: convertInt(style.flexGrow),
                    shrink: convertInt(style.flexShrink),
                    wrap: style.flexWrap,
                    alignSelf: (!this.has('alignSelf') && this.documentParent.has('alignItems') ? this.documentParent.css('alignItems') : style.alignSelf),
                    justifyContent: style.justifyContent,
                    order: convertInt(style.order)
                };
            }
            return { enabled: false };
        }
        get viewWidth() {
            return this.inlineStatic || this.has('width', CSS_STANDARD.PERCENT) ? 0 : this.toInt('width') || this.toInt('minWidth');
        }
        get viewHeight() {
            return this.inlineStatic || this.has('height', CSS_STANDARD.PERCENT) ? 0 : this.toInt('height') || this.toInt('minHeight');
        }
        get hasWidth() {
            return this.inlineStatic ? false : this.has('width', CSS_STANDARD.UNIT | CSS_STANDARD.PERCENT, { map: 'initial', not: ['0px', '0%'] }) || this.toInt('minWidth') > 0;
        }
        get hasHeight() {
            return this.inlineStatic ? false : this.has('height', CSS_STANDARD.UNIT | CSS_STANDARD.PERCENT, { map: 'initial', not: ['0px', '0%'] }) || this.toInt('minHeight') > 0;
        }
        get lineHeight() {
            if (this.rendered) {
                if (this._lineHeight == null) {
                    this._lineHeight = 0;
                    if (this.length === 0 && !this.renderParent.linearHorizontal) {
                        const lineHeight = this.toInt('lineHeight');
                        if (this.inlineElement) {
                            this._lineHeight = lineHeight || this.documentParent.toInt('lineHeight');
                        }
                        else {
                            this._lineHeight = lineHeight;
                        }
                    }
                }
                return this._lineHeight;
            }
            return 0;
        }
        get display() {
            return this.css('display');
        }
        get position() {
            return this.css('position');
        }
        get top() {
            const value = this.styleMap.top;
            return !value || value === 'auto' ? null : convertInt(value);
        }
        get right() {
            const value = this.styleMap.right;
            return !value || value === 'auto' ? null : convertInt(value);
        }
        get bottom() {
            const value = this.styleMap.bottom;
            return !value || value === 'auto' ? null : convertInt(value);
        }
        get left() {
            const value = this.styleMap.left;
            return !value || value === 'auto' ? null : convertInt(value);
        }
        get marginTop() {
            return this.inlineStatic ? 0 : this.boxAttribute('margin', 'Top');
        }
        get marginRight() {
            return this.boxAttribute('margin', 'Right');
        }
        get marginBottom() {
            return this.inlineStatic ? 0 : this.boxAttribute('margin', 'Bottom');
        }
        get marginLeft() {
            return this.boxAttribute('margin', 'Left');
        }
        get borderTopWidth() {
            return this.css('borderTopStyle') !== 'none' ? convertInt(this.css('borderTopWidth')) : 0;
        }
        get borderRightWidth() {
            return this.css('borderRightStyle') !== 'none' ? convertInt(this.css('borderRightWidth')) : 0;
        }
        get borderBottomWidth() {
            return this.css('borderBottomStyle') !== 'none' ? convertInt(this.css('borderBottomWidth')) : 0;
        }
        get borderLeftWidth() {
            return this.css('borderLeftStyle') !== 'none' ? convertInt(this.css('borderLeftWidth')) : 0;
        }
        get paddingTop() {
            return this.boxAttribute('padding', 'Top');
        }
        get paddingRight() {
            return this.boxAttribute('padding', 'Right');
        }
        get paddingBottom() {
            return this.boxAttribute('padding', 'Bottom');
        }
        get paddingLeft() {
            return this.boxAttribute('padding', 'Left');
        }
        set pageflow(value) {
            this._pageflow = value;
        }
        get pageflow() {
            if (this._pageflow == null) {
                const value = this.position;
                return value === 'static' || value === 'initial' || value === 'relative' || this.alignOrigin;
            }
            return this._pageflow;
        }
        get siblingflow() {
            const value = this.position;
            return !(value === 'absolute' || value === 'fixed');
        }
        get inline() {
            const value = this.display;
            return value === 'inline' || (value === 'initial' && INLINE_ELEMENT.includes(this.tagName));
        }
        get inlineElement() {
            const position = this.position;
            const display = this.display;
            return this.inline || display.indexOf('inline') !== -1 || display === 'table-cell' || this.floating || ((position === 'absolute' || position === 'fixed') && this.alignOrigin);
        }
        get inlineStatic() {
            return this.inline && !this.floating && !this.imageElement;
        }
        get inlineText() {
            if (this._inlineText == null) {
                switch (this.tagName) {
                    case 'INPUT':
                    case 'BUTTON':
                    case 'IMG':
                    case 'SELECT':
                    case 'TEXTAREA':
                        this._inlineText = false;
                        break;
                    default:
                        this._inlineText = (this.htmlElement &&
                            hasFreeFormText(this._element) &&
                            (this.initial.children.length === 0 || this.initial.children.every(node => !!getElementCache(node.element, 'inlineSupport'))) &&
                            (this._element.childNodes.length === 0 || !Array.from(this._element.childNodes).some((element) => {
                                const node = Node.getNodeFromElement(element);
                                return !!node && !node.lineBreak && (!node.excluded || !node.visible);
                            })));
                        break;
                }
            }
            return this._inlineText;
        }
        get plainText() {
            return this._nodeName === 'PLAINTEXT';
        }
        get imageElement() {
            return this.tagName === 'IMG';
        }
        get svgElement() {
            return this.tagName === 'SVG';
        }
        get imageOrSvgElement() {
            return this.imageElement || this.svgElement;
        }
        get lineBreak() {
            return this.tagName === 'BR';
        }
        get textElement() {
            return this.plainText || this.inlineText;
        }
        get block() {
            const value = this.display;
            return value === 'block' || value === 'list-item' || (value === 'initial' && BLOCK_ELEMENT.includes(this.tagName));
        }
        get blockStatic() {
            return this.block && this.siblingflow && (!this.floating || this.cssInitial('width') === '100%');
        }
        get alignOrigin() {
            return this.top == null && this.right == null && this.bottom == null && this.left == null;
        }
        get alignNegative() {
            return this.toInt('top') < 0 || this.toInt('left') < 0;
        }
        get autoMargin() {
            return this.blockStatic && (this.initial.styleMap.marginLeft === 'auto' || this.initial.styleMap.marginRight === 'auto');
        }
        get autoMarginLeft() {
            return this.blockStatic && this.initial.styleMap.marginLeft === 'auto' && this.initial.styleMap.marginRight !== 'auto';
        }
        get autoMarginRight() {
            return this.blockStatic && this.initial.styleMap.marginLeft !== 'auto' && this.initial.styleMap.marginRight === 'auto';
        }
        get autoMarginHorizontal() {
            return this.blockStatic && this.initial.styleMap.marginLeft === 'auto' && this.initial.styleMap.marginRight === 'auto';
        }
        get autoMarginVertical() {
            return this.blockStatic && this.initial.styleMap.marginTop === 'auto' && this.initial.styleMap.marginBottom === 'auto';
        }
        get floating() {
            const value = this.css('cssFloat');
            return this.position !== 'absolute' ? (value === 'left' || value === 'right') : false;
        }
        get float() {
            return this.floating ? this.css('cssFloat') : 'none';
        }
        get textContent() {
            if (this._element) {
                if (this._element instanceof HTMLElement) {
                    return this._element.innerText || this._element.innerHTML;
                }
                else if (this._element.nodeName === '#text') {
                    return this._element.textContent || '';
                }
            }
            return '';
        }
        get overflowX() {
            return hasBit(this.getOverflow(), NODE_ALIGNMENT.HORIZONTAL);
        }
        get overflowY() {
            return hasBit(this.getOverflow(), NODE_ALIGNMENT.VERTICAL);
        }
        get baseline() {
            const value = this.css('verticalAlign');
            return (value === 'baseline' || value === 'initial' || value === 'unset') && this.siblingflow;
        }
        get baselineInside() {
            return this.nodes.length > 0 ? this.nodes.every(node => node.baseline) : this.baseline;
        }
        set multiLine(value) {
            this._multiLine = value;
        }
        get multiLine() {
            if (this._multiLine == null) {
                this.setMultiLine();
            }
            return this._multiLine;
        }
        get preserveWhiteSpace() {
            const value = this.css('whiteSpace');
            return value === 'pre' || value === 'pre-wrap';
        }
        get actualHeight() {
            return this.plainText ? this.bounds.bottom - this.bounds.top : this.bounds.height;
        }
        get singleChild() {
            return this.rendered ? this.renderParent.length === 1 : this.parent.length === 1;
        }
        get dir() {
            switch (this.css('direction')) {
                case 'unset':
                case 'inherit':
                    let parent = this.documentParent;
                    do {
                        const value = parent.dir;
                        if (value !== '') {
                            return value;
                        }
                        parent = parent.documentParent;
                    } while (parent.id !== 0);
                    return '';
                case 'rtl':
                    return 'rtl';
                default:
                    return 'ltr';
            }
        }
        get nodes() {
            return this.rendered ? this.renderChildren : this.list;
        }
        get previousElementSibling() {
            let element = this.baseElement.previousSibling;
            while (element) {
                if (isPlainText(element) || isStyleElement(element) || element.tagName === 'BR') {
                    return element;
                }
                element = element.previousSibling;
            }
            return undefined;
        }
        get nextElementSibling() {
            let element = this.baseElement.nextSibling;
            while (element) {
                if (isPlainText(element) || isStyleElement(element) || element.tagName === 'BR') {
                    return element;
                }
                element = element.nextSibling;
            }
            return undefined;
        }
        get center() {
            return {
                x: this.bounds.left + Math.floor(this.bounds.width / 2),
                y: this.bounds.top + Math.floor(this.actualHeight / 2)
            };
        }
    }

    function getDocumentParent(nodes) {
        for (const node of nodes) {
            if (!node.companion && node.domElement) {
                return node.documentParent;
            }
        }
        return nodes[0].documentParent;
    }
    class NodeList extends Container {
        constructor(children) {
            super();
            this._currentId = 0;
            if (Array.isArray(children)) {
                this.replace(children);
            }
        }
        static outerRegion(list, dimension = 'linear') {
            let top = [];
            let right = [];
            let bottom = [];
            let left = [];
            const nodes = list.slice();
            list.forEach(node => node.companion && nodes.push(node.companion));
            for (let i = 0; i < nodes.length; i++) {
                const node = nodes[i];
                if (i === 0) {
                    top.push(node);
                    right.push(node);
                    bottom.push(node);
                    left.push(node);
                }
                else {
                    if (top[0][dimension].top === node[dimension].top) {
                        top.push(node);
                    }
                    else if (node[dimension].top < top[0][dimension].top) {
                        top = [node];
                    }
                    if (right[0][dimension].right === node[dimension].right) {
                        right.push(node);
                    }
                    else if (node[dimension].right > right[0][dimension].right) {
                        right = [node];
                    }
                    if (bottom[0][dimension].bottom === node[dimension].bottom) {
                        bottom.push(node);
                    }
                    else if (node[dimension].bottom > bottom[0][dimension].bottom) {
                        bottom = [node];
                    }
                    if (left[0][dimension].left === node[dimension].left) {
                        left.push(node);
                    }
                    else if (node[dimension].left < left[0][dimension].left) {
                        left = [node];
                    }
                }
            }
            return { top, right, bottom, left };
        }
        static floated(list) {
            return new Set(list.map(node => node.float).filter(value => value !== 'none'));
        }
        static cleared(list) {
            const result = new Map();
            const floated = new Set();
            for (const node of list) {
                if (node.siblingflow) {
                    const clear = node.css('clear');
                    if (floated.size > 0) {
                        if (clear === 'both') {
                            result.set(node, floated.size === 2 ? 'both' : floated.values().next().value);
                            floated.clear();
                        }
                        else if (floated.has(clear)) {
                            floated.delete(clear);
                            result.set(node, clear);
                        }
                    }
                    if (node.floating) {
                        floated.add(node.float);
                    }
                }
            }
            return result;
        }
        static textBaseline(list) {
            let baseline = [];
            if (!list.some(node => (node.textElement || node.imageElement) && node.baseline)) {
                baseline = list.filter(node => node.baseline).sort((a, b) => {
                    let nodeTypeA = a.nodeType;
                    let nodeTypeB = b.nodeType;
                    if (a.layoutHorizontal) {
                        nodeTypeA = Math.min.apply(null, a.map(item => item.nodeType > 0 ? item.nodeType : NODE_STANDARD.INLINE));
                    }
                    if (b.layoutHorizontal) {
                        nodeTypeB = Math.min.apply(null, b.map(item => item.nodeType > 0 ? item.nodeType : NODE_STANDARD.INLINE));
                    }
                    return nodeTypeA === nodeTypeB ? (a.id < b.id ? -1 : 1) : (nodeTypeA < nodeTypeB ? -1 : 1);
                });
            }
            else {
                const lineHeight = Math.max.apply(null, list.map(node => node.lineHeight));
                const boundsHeight = Math.max.apply(null, list.map(node => node.bounds.height));
                if (lineHeight > boundsHeight) {
                    const result = list.filter(node => node.lineHeight === lineHeight);
                    return (result.length === list.length ? result.filter(node => node.htmlElement) : result).filter(node => node.baseline);
                }
                baseline = list.filter(node => node.baselineInside).sort((a, b) => {
                    let heightA = a.bounds.height;
                    let heightB = b.bounds.height;
                    if (isUserAgent(USER_AGENT.EDGE)) {
                        if (a.textElement) {
                            heightA = Math.max(Math.floor(heightA), a.lineHeight);
                        }
                        if (b.textElement) {
                            heightB = Math.max(Math.floor(heightB), b.lineHeight);
                        }
                    }
                    if (!a.imageElement || !b.imageElement) {
                        const fontSizeA = convertInt(a.css('fontSize'));
                        const fontSizeB = convertInt(b.css('fontSize'));
                        if (a.multiLine || b.multiLine) {
                            if (a.lineHeight > 0 && b.lineHeight > 0) {
                                return a.lineHeight >= b.lineHeight ? -1 : 1;
                            }
                            else if (fontSizeA === fontSizeB) {
                                return a.htmlElement || !b.htmlElement ? -1 : 1;
                            }
                        }
                        if (a.nodeType !== b.nodeType && (a.nodeType < NODE_STANDARD.TEXT || b.nodeType < NODE_STANDARD.TEXT)) {
                            if (a.textElement || a.imageElement) {
                                return -1;
                            }
                            else if (b.textElement || b.imageElement) {
                                return 1;
                            }
                            return a.nodeType < b.nodeType ? -1 : 1;
                        }
                        else if ((a.lineHeight > heightB && b.lineHeight === 0) || b.imageElement) {
                            return -1;
                        }
                        else if ((b.lineHeight > heightA && a.lineHeight === 0) || a.imageElement) {
                            return 1;
                        }
                        else {
                            if (fontSizeA === fontSizeB && heightA === heightB) {
                                if (a.htmlElement && !b.htmlElement) {
                                    return -1;
                                }
                                else if (!a.htmlElement && b.htmlElement) {
                                    return 1;
                                }
                                else {
                                    return a.siblingIndex <= b.siblingIndex ? -1 : 1;
                                }
                            }
                            else if (fontSizeA !== fontSizeB && fontSizeA !== 0 && fontSizeB !== 0) {
                                return fontSizeA > fontSizeB ? -1 : 1;
                            }
                        }
                    }
                    return heightA >= heightB ? -1 : 1;
                });
            }
            let fontFamily;
            let fontSize;
            let fontWeight;
            return baseline.filter((node, index) => {
                if (index === 0) {
                    fontFamily = node.css('fontFamily');
                    fontSize = node.css('fontSize');
                    fontWeight = node.css('fontWeight');
                    return true;
                }
                else {
                    return (node.css('fontFamily') === fontFamily &&
                        node.css('fontSize') === fontSize &&
                        node.css('fontWeight') === fontWeight &&
                        node.nodeName === baseline[0].nodeName && ((node.lineHeight > 0 && node.lineHeight === baseline[0].lineHeight) ||
                        node.bounds.height === baseline[0].bounds.height));
                }
            });
        }
        static linearX(list, traverse = true) {
            const nodes = list.filter(node => node.pageflow);
            switch (nodes.length) {
                case 0:
                    return false;
                case 1:
                    return true;
                default:
                    const parent = getDocumentParent(nodes);
                    let horizontal = false;
                    if (traverse) {
                        if (nodes.every(node => node.documentParent === parent || (node.companion && node.companion.documentParent === parent))) {
                            const result = NodeList.clearedSiblings(parent);
                            horizontal = nodes.slice().sort(NodeList.siblingIndex).every((node, index) => {
                                if (index > 0) {
                                    if (node.companion && node.companion.documentParent === parent) {
                                        node = node.companion;
                                    }
                                    return !node.alignedVertically(node.previousSibling(), result);
                                }
                                return true;
                            });
                        }
                    }
                    if (horizontal || !traverse) {
                        return nodes.every(node => !nodes.some(sibling => sibling !== node && node.linear.top >= sibling.linear.bottom && node.intersectY(sibling.linear)));
                    }
                    return false;
            }
        }
        static linearY(list) {
            const nodes = list.filter(node => node.pageflow);
            switch (nodes.length) {
                case 0:
                    return false;
                case 1:
                    return true;
                default:
                    const parent = getDocumentParent(nodes);
                    if (nodes.every(node => node.documentParent === parent || (node.companion && node.companion.documentParent === parent))) {
                        const result = NodeList.clearedSiblings(parent);
                        return nodes.slice().sort(NodeList.siblingIndex).every((node, index) => {
                            if (index > 0 && !node.lineBreak) {
                                if (node.companion && node.companion.documentParent === parent) {
                                    node = node.companion;
                                }
                                return node.alignedVertically(node.previousSibling(), result);
                            }
                            return true;
                        });
                    }
                    return false;
            }
        }
        static sortByAlignment(list, alignmentType = NODE_ALIGNMENT.NONE, parent) {
            let sorted = false;
            if (parent && alignmentType === NODE_ALIGNMENT.NONE) {
                if (parent.linearHorizontal) {
                    alignmentType |= NODE_ALIGNMENT.HORIZONTAL;
                }
                else if (parent.is(NODE_STANDARD.CONSTRAINT) && list.some(node => !node.pageflow)) {
                    alignmentType |= NODE_ALIGNMENT.ABSOLUTE;
                }
            }
            if (hasBit(alignmentType, NODE_ALIGNMENT.HORIZONTAL)) {
                if (list.some(node => node.floating)) {
                    list.sort((a, b) => {
                        if (a.floating && !b.floating) {
                            return a.float === 'left' ? -1 : 1;
                        }
                        else if (!a.floating && b.floating) {
                            return b.float === 'left' ? 1 : -1;
                        }
                        else if (a.floating && b.floating) {
                            if (a.float !== b.float) {
                                return a.float === 'left' ? -1 : 1;
                            }
                        }
                        return a.linear.left <= b.linear.left ? -1 : 1;
                    });
                    sorted = true;
                }
            }
            if (hasBit(alignmentType, NODE_ALIGNMENT.ABSOLUTE)) {
                if (list.some(node => node.toInt('zIndex') !== 0)) {
                    list.sort((a, b) => {
                        const indexA = convertInt(a.css('zIndex'));
                        const indexB = convertInt(b.css('zIndex'));
                        if (indexA === 0 && indexB === 0) {
                            return a.siblingIndex <= b.siblingIndex ? -1 : 1;
                        }
                        else {
                            return indexA <= indexB ? -1 : 1;
                        }
                    });
                    sorted = true;
                }
            }
            return sorted;
        }
        static siblingIndex(a, b) {
            return a.siblingIndex <= b.siblingIndex ? -1 : 1;
        }
        static clearedSiblings(parent) {
            return this.cleared(Array.from(parent.baseElement.children).map(element => Node.getNodeFromElement(element)).filter(node => node));
        }
        append(node, delegate = true) {
            super.append(node);
            if (delegate && this.delegateAppend) {
                this.delegateAppend.call(this, node);
            }
            return this;
        }
        reset() {
            this._currentId = 0;
            this.clear();
            return this;
        }
        partition(predicate) {
            const [valid, invalid] = partition(this.list, predicate);
            return [new NodeList(valid), new NodeList(invalid)];
        }
        get visible() {
            return this.list.filter(node => node.visible);
        }
        get elements() {
            return this.list.filter(node => node.visible && node.styleElement);
        }
        get nextId() {
            return ++this._currentId;
        }
        get linearX() {
            return NodeList.linearX(this.list);
        }
        get linearY() {
            return NodeList.linearY(this.list);
        }
    }

    class NodeGroup extends Node {
        init() {
            super.init();
            if (this.length > 0) {
                for (const item of this) {
                    this.siblingIndex = Math.min(this.siblingIndex, item.siblingIndex);
                    item.parent = this;
                }
                this.parent.sort(NodeList.siblingIndex);
                this.initial.children.push(...this.duplicate());
            }
            this.setBounds();
            this.css('direction', this.documentParent.dir);
        }
        setBounds(calibrate = false) {
            if (!calibrate) {
                if (this.length > 0) {
                    const nodes = NodeList.outerRegion(this.list);
                    this.bounds = {
                        top: nodes.top[0].linear.top,
                        right: nodes.right[0].linear.right,
                        bottom: nodes.bottom[0].linear.bottom,
                        left: nodes.left[0].linear.left,
                        width: 0,
                        height: 0
                    };
                }
                else {
                    this.bounds = newClientRect();
                }
                this.bounds.width = this.bounds.right - this.bounds.left;
                this.bounds.height = this.bounds.bottom - this.bounds.top;
            }
            this.linear = assignBounds(this.bounds);
            this.box = assignBounds(this.bounds);
            this.setDimensions();
        }
        previousSibling(pageflow = false, lineBreak = true, excluded = true) {
            const node = this.item(0);
            return node ? node.previousSibling(pageflow, lineBreak, excluded) : undefined;
        }
        nextSibling(pageflow = false, lineBreak = true, excluded = true) {
            const node = this.item(0);
            return node ? node.nextSibling(pageflow, lineBreak, excluded) : undefined;
        }
        get inline() {
            return this.every(node => node.inline);
        }
        get pageflow() {
            return this.every(node => node.pageflow);
        }
        get siblingflow() {
            return this.every(node => node.siblingflow);
        }
        get inlineElement() {
            return this.hasAlign(NODE_ALIGNMENT.SEGMENTED);
        }
        get inlineStatic() {
            return this.every(node => node.inlineStatic);
        }
        get blockStatic() {
            return this.every(node => node.blockStatic);
        }
        get floating() {
            return this.hasAlign(NODE_ALIGNMENT.FLOAT);
        }
        get float() {
            if (this.floating) {
                return this.hasAlign(NODE_ALIGNMENT.RIGHT) ? 'right' : 'left';
            }
            return 'none';
        }
        get baseline() {
            return this.every(node => node.baseline);
        }
        get multiLine() {
            return this.some(node => node.multiLine);
        }
        get display() {
            return this.css('display') || (this.every(node => node.blockStatic) || this.of(NODE_STANDARD.CONSTRAINT, NODE_ALIGNMENT.PERCENT) ? 'block' : this.every(node => node.inline) ? 'inline' : 'inline-block');
        }
        get baseElement() {
            function cascade(nodes) {
                for (const node of nodes) {
                    if (node.domElement) {
                        return node.element;
                    }
                    else if (node.length > 0) {
                        const element = cascade(node.nodes);
                        if (element) {
                            return element;
                        }
                    }
                }
                return undefined;
            }
            return cascade(this.nodes) || super.baseElement;
        }
    }

    const X11_CSS3 = {
        'Pink': { 'hex': '#FFC0CB' },
        'LightPink': { 'hex': '#FFB6C1' },
        'HotPink': { 'hex': '#FF69B4' },
        'DeepPink': { 'hex': '#FF1493' },
        'PaleVioletRed': { 'hex': '#DB7093' },
        'MediumVioletRed': { 'hex': '#C71585' },
        'LightSalmon': { 'hex': '#FFA07A' },
        'Salmon': { 'hex': '#FA8072' },
        'DarkSalmon': { 'hex': '#E9967A' },
        'LightCoral': { 'hex': '#F08080' },
        'IndianRed': { 'hex': '#CD5C5C' },
        'Crimson': { 'hex': '#DC143C' },
        'Firebrick': { 'hex': '#B22222' },
        'DarkRed': { 'hex': '#8B0000' },
        'Red': { 'hex': '#FF0000' },
        'OrangeRed': { 'hex': '#FF4500' },
        'Tomato': { 'hex': '#FF6347' },
        'Coral': { 'hex': '#FF7F50' },
        'Orange': { 'hex': '#FFA500' },
        'DarkOrange': { 'hex': '#FF8C00' },
        'Yellow': { 'hex': '#FFFF00' },
        'LightYellow': { 'hex': '#FFFFE0' },
        'LemonChiffon': { 'hex': '#FFFACD' },
        'LightGoldenrodYellow': { 'hex': '#FAFAD2' },
        'PapayaWhip': { 'hex': '#FFEFD5' },
        'Moccasin': { 'hex': '#FFE4B5' },
        'PeachPuff': { 'hex': '#FFDAB9' },
        'PaleGoldenrod': { 'hex': '#EEE8AA' },
        'Khaki': { 'hex': '#F0E68C' },
        'DarkKhaki': { 'hex': '#BDB76B' },
        'Gold': { 'hex': '#FFD700' },
        'Cornsilk': { 'hex': '#FFF8DC' },
        'BlanchedAlmond': { 'hex': '#FFEBCD' },
        'Bisque': { 'hex': '#FFE4C4' },
        'NavajoWhite': { 'hex': '#FFDEAD' },
        'Wheat': { 'hex': '#F5DEB3' },
        'Burlywood': { 'hex': '#DEB887' },
        'Tan': { 'hex': '#D2B48C' },
        'RosyBrown': { 'hex': '#BC8F8F' },
        'SandyBrown': { 'hex': '#F4A460' },
        'Goldenrod': { 'hex': '#DAA520' },
        'DarkGoldenrod': { 'hex': '#B8860B' },
        'Peru': { 'hex': '#CD853F' },
        'Chocolate': { 'hex': '#D2691E' },
        'SaddleBrown': { 'hex': '#8B4513' },
        'Sienna': { 'hex': '#A0522D' },
        'Brown': { 'hex': '#A52A2A' },
        'Maroon': { 'hex': '#800000' },
        'DarkOliveGreen': { 'hex': '#556B2F' },
        'Olive': { 'hex': '#808000' },
        'OliveDrab': { 'hex': '#6B8E23' },
        'YellowGreen': { 'hex': '#9ACD32' },
        'LimeGreen': { 'hex': '#32CD32' },
        'Lime': { 'hex': '#00FF00' },
        'LawnGreen': { 'hex': '#7CFC00' },
        'Chartreuse': { 'hex': '#7FFF00' },
        'GreenYellow': { 'hex': '#ADFF2F' },
        'SpringGreen': { 'hex': '#00FF7F' },
        'MediumSpringGreen': { 'hex': '#00FA9A' },
        'LightGreen': { 'hex': '#90EE90' },
        'PaleGreen': { 'hex': '#98FB98' },
        'DarkSeaGreen': { 'hex': '#8FBC8F' },
        'MediumAquamarine': { 'hex': '#66CDAA' },
        'MediumSeaGreen': { 'hex': '#3CB371' },
        'SeaGreen': { 'hex': '#2E8B57' },
        'ForestGreen': { 'hex': '#228B22' },
        'Green': { 'hex': '#008000' },
        'DarkGreen': { 'hex': '#006400' },
        'Aqua': { 'hex': '#00FFFF' },
        'Cyan': { 'hex': '#00FFFF' },
        'LightCyan': { 'hex': '#E0FFFF' },
        'PaleTurquoise': { 'hex': '#AFEEEE' },
        'Aquamarine': { 'hex': '#7FFFD4' },
        'Turquoise': { 'hex': '#40E0D0' },
        'DarkTurquoise': { 'hex': '#00CED1' },
        'MediumTurquoise': { 'hex': '#48D1CC' },
        'LightSeaGreen': { 'hex': '#20B2AA' },
        'CadetBlue': { 'hex': '#5F9EA0' },
        'DarkCyan': { 'hex': '#008B8B' },
        'Teal': { 'hex': '#008080' },
        'LightSteelBlue': { 'hex': '#B0C4DE' },
        'PowderBlue': { 'hex': '#B0E0E6' },
        'LightBlue': { 'hex': '#ADD8E6' },
        'SkyBlue': { 'hex': '#87CEEB' },
        'LightSkyBlue': { 'hex': '#87CEFA' },
        'DeepSkyBlue': { 'hex': '#00BFFF' },
        'DodgerBlue': { 'hex': '#1E90FF' },
        'Cornflower': { 'hex': '#6495ED' },
        'SteelBlue': { 'hex': '#4682B4' },
        'RoyalBlue': { 'hex': '#4169E1' },
        'Blue': { 'hex': '#0000FF' },
        'MediumBlue': { 'hex': '#0000CD' },
        'DarkBlue': { 'hex': '#00008B' },
        'Navy': { 'hex': '#000080' },
        'MidnightBlue': { 'hex': '#191970' },
        'Lavender': { 'hex': '#E6E6FA' },
        'Thistle': { 'hex': '#D8BFD8' },
        'Plum': { 'hex': '#DDA0DD' },
        'Violet': { 'hex': '#EE82EE' },
        'Orchid': { 'hex': '#DA70D6' },
        'Fuchsia': { 'hex': '#FF00FF' },
        'Magenta': { 'hex': '#FF00FF' },
        'MediumOrchid': { 'hex': '#BA55D3' },
        'MediumPurple': { 'hex': '#9370DB' },
        'BlueViolet': { 'hex': '#8A2BE2' },
        'DarkViolet': { 'hex': '#9400D3' },
        'DarkOrchid': { 'hex': '#9932CC' },
        'DarkMagenta': { 'hex': '#8B008B' },
        'Purple': { 'hex': '#800080' },
        'RebeccaPurple': { 'hex': '#663399' },
        'Indigo': { 'hex': '#4B0082' },
        'DarkSlateBlue': { 'hex': '#483D8B' },
        'SlateBlue': { 'hex': '#6A5ACD' },
        'MediumSlateBlue': { 'hex': '#7B68EE' },
        'White': { 'hex': '#FFFFFF' },
        'Snow': { 'hex': '#FFFAFA' },
        'Honeydew': { 'hex': '#F0FFF0' },
        'MintCream': { 'hex': '#F5FFFA' },
        'Azure': { 'hex': '#F0FFFF' },
        'AliceBlue': { 'hex': '#F0F8FF' },
        'GhostWhite': { 'hex': '#F8F8FF' },
        'WhiteSmoke': { 'hex': '#F5F5F5' },
        'Seashell': { 'hex': '#FFF5EE' },
        'Beige': { 'hex': '#F5F5DC' },
        'OldLace': { 'hex': '#FDF5E6' },
        'FloralWhite': { 'hex': '#FFFAF0' },
        'Ivory': { 'hex': '#FFFFF0' },
        'AntiqueWhite': { 'hex': '#FAEBD7' },
        'Linen': { 'hex': '#FAF0E6' },
        'LavenderBlush': { 'hex': '#FFF0F5' },
        'MistyRose': { 'hex': '#FFE4E1' },
        'Gainsboro': { 'hex': '#DCDCDC' },
        'LightGray': { 'hex': '#D3D3D3' },
        'Silver': { 'hex': '#C0C0C0' },
        'DarkGray': { 'hex': '#A9A9A9' },
        'Gray': { 'hex': '#808080' },
        'DimGray': { 'hex': '#696969' },
        'LightSlateGray': { 'hex': '#778899' },
        'SlateGray': { 'hex': '#708090' },
        'DarkSlateGray': { 'hex': '#2F4F4F' },
        'Black': { 'hex': '#000000' }
    };
    const HSL_SORTED = [];
    for (const name in X11_CSS3) {
        const x11 = X11_CSS3[name];
        x11.name = name;
        const rgba = convertRGBA(x11.hex);
        if (rgba) {
            x11.rgba = rgba;
            x11.hsl = convertHSL(x11.rgba);
            HSL_SORTED.push(x11);
        }
    }
    HSL_SORTED.sort(sortHSL);
    function convertHSL({ r = 0, g = 0, b = 0 }) {
        r = r / 255;
        g = g / 255;
        b = b / 255;
        const min = Math.min(r, g, b);
        const max = Math.max(r, g, b);
        let h = (max + min) / 2;
        let s = h;
        const l = h;
        if (max === min) {
            h = 0;
            s = 0;
        }
        else {
            const d = max - min;
            s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
            switch (max) {
                case r:
                    h = (g - b) / d + (g < b ? 6 : 0);
                    break;
                case g:
                    h = (b - r) / d + 2;
                    break;
                case b:
                    h = (r - g) / d + 4;
                    break;
            }
            h /= 6;
        }
        return {
            h: h * 360,
            s: s * 100,
            l: l * 100
        };
    }
    function sortHSL(a, b) {
        if (a.hsl && b.hsl) {
            let [c, d] = [a.hsl.h, b.hsl.h];
            if (c === d) {
                [c, d] = [a.hsl.s, b.hsl.s];
                if (c === d) {
                    [c, d] = [a.hsl.l, b.hsl.l];
                }
            }
            return c >= d ? 1 : -1;
        }
        return 0;
    }
    function formatRGBA(rgba) {
        return `rgb${rgba.a < 1 ? 'a' : ''}(${rgba.r}, ${rgba.g}, ${rgba.b}${rgba.a < 1 ? `, ${rgba.a.toFixed(2)}` : ''})`;
    }
    function convertAlpha$1(value) {
        return parseFloat(value) < 1 ? convertHex('255', parseFloat(value)) : 'FF';
    }
    function getColorByName(value) {
        for (const color in X11_CSS3) {
            if (color.toLowerCase() === value.trim().toLowerCase()) {
                return X11_CSS3[color];
            }
        }
        return undefined;
    }
    function getColorByShade(value) {
        const result = HSL_SORTED.slice();
        let index = result.findIndex(item => item.hex === value);
        if (index !== -1) {
            return result[index];
        }
        else {
            const rgb = convertRGBA(value);
            if (rgb) {
                const hsl = convertHSL(rgb);
                if (hsl) {
                    result.push({
                        name: '',
                        hsl,
                        rgba: { r: -1, g: -1, b: -1, a: 1 },
                        hex: ''
                    });
                    result.sort(sortHSL);
                    index = result.findIndex(item => item.name === '');
                    return result[Math.min(index + 1, result.length - 1)];
                }
            }
            return undefined;
        }
    }
    function convertHex(value, opacity = 1) {
        const hex = '0123456789ABCDEF';
        let rgb = parseInt(value) * opacity;
        if (isNaN(rgb)) {
            return '00';
        }
        rgb = Math.max(0, Math.min(rgb, 255));
        return hex.charAt((rgb - (rgb % 16)) / 16) + hex.charAt(rgb % 16);
    }
    function convertRGBA(value) {
        value = value.replace(/#/g, '').trim();
        if (/[A-Za-z\d]{3,}/.test(value)) {
            let a = 1;
            switch (value.length) {
                case 4:
                    a = parseInt(value.charAt(3).repeat(2), 16);
                case 3:
                    value = value.charAt(0).repeat(2) + value.charAt(1).repeat(2) + value.charAt(2).repeat(2);
                    break;
                case 5:
                    value += value.charAt(4);
                    break;
                default:
                    value = value.substring(0, 6);
                    if (value.length >= 8) {
                        a = parseInt(value.substring(6, 8), 16);
                    }
                    break;
            }
            if (value.length === 6) {
                return {
                    r: parseInt(value.substring(0, 2), 16),
                    g: parseInt(value.substring(2, 4), 16),
                    b: parseInt(value.substring(4), 16),
                    a
                };
            }
        }
        return undefined;
    }
    function parseRGBA(value, opacity = '1') {
        if (value && value !== 'initial' && value !== 'transparent') {
            if (opacity === '') {
                opacity = '1';
            }
            if (value.charAt(0) === '#') {
                const rgba = convertRGBA(value);
                if (rgba) {
                    value = formatRGBA(rgba);
                }
            }
            else if (!value.startsWith('rgb')) {
                const color = getColorByName(value);
                if (color && color.rgba) {
                    color.rgba.a = parseFloat(opacity);
                    value = formatRGBA(color.rgba);
                }
            }
            const match = value.match(/rgba?\((\d+), (\d+), (\d+),?\s*([\d.]+)?\)/);
            if (match && match.length >= 4 && (match[4] == null || parseFloat(match[4]) > 0)) {
                if (match[4] == null) {
                    match[4] = parseFloat(opacity).toFixed(2);
                }
                const valueHex = convertHex(match[1]) + convertHex(match[2]) + convertHex(match[3]);
                const valueA = convertAlpha$1(match[4]);
                const valueRGBA = `#${valueHex + valueA}`;
                const alpha = parseFloat(match[4]);
                return {
                    valueRGB: `#${valueHex}`,
                    valueRGBA,
                    valueARGB: `#${valueA + valueHex}`,
                    alpha,
                    rgba: convertRGBA(valueRGBA),
                    opaque: alpha < 1,
                    visible: alpha > 0
                };
            }
        }
        return undefined;
    }
    function reduceRGBA(value, percent) {
        const rgba = convertRGBA(value);
        if (rgba) {
            const base = percent < 0 ? 0 : 255;
            percent = Math.abs(percent);
            rgba.r = Math.round((base - rgba.r) * percent) + rgba.r;
            rgba.g = Math.round((base - rgba.g) * percent) + rgba.g;
            rgba.b = Math.round((base - rgba.b) * percent) + rgba.b;
            return parseRGBA(formatRGBA(rgba));
        }
        return undefined;
    }

    var color = /*#__PURE__*/Object.freeze({
        getColorByName: getColorByName,
        getColorByShade: getColorByShade,
        convertHex: convertHex,
        convertRGBA: convertRGBA,
        parseRGBA: parseRGBA,
        reduceRGBA: reduceRGBA
    });

    function createColorStop(element) {
        const result = [];
        for (const stop of Array.from(element.getElementsByTagName('stop'))) {
            const color = parseRGBA(cssAttribute(stop, 'stop-color'), cssAttribute(stop, 'stop-opacity'));
            if (color && color.visible) {
                result.push({
                    color: color.valueRGBA,
                    offset: cssAttribute(stop, 'offset'),
                    opacity: color.alpha
                });
            }
        }
        return result;
    }
    function createTransform(element) {
        const data = {
            translateX: 0,
            translateY: 0,
            scaleX: 1,
            scaleY: 1,
            rotateAngle: 0,
            rotateX: 0,
            rotateY: 0,
            skewX: 0,
            skewY: 0
        };
        for (let i = 0; i < element.transform.baseVal.numberOfItems; i++) {
            const item = element.transform.baseVal.getItem(i);
            switch (item.type) {
                case SVGTransform.SVG_TRANSFORM_TRANSLATE:
                    data.translateX += item.matrix.e;
                    data.translateY += item.matrix.f;
                    break;
                case SVGTransform.SVG_TRANSFORM_SCALE:
                    data.scaleX *= item.matrix.a;
                    data.scaleY *= item.matrix.d;
                    break;
                case SVGTransform.SVG_TRANSFORM_ROTATE:
                    data.rotateAngle += item.angle;
                    if (item.matrix.e > 0) {
                        data.rotateX = Math.round((item.matrix.e - item.matrix.f) / 2);
                        data.rotateY = item.matrix.e - data.rotateX;
                    }
                    break;
                case SVGTransform.SVG_TRANSFORM_SKEWX:
                    data.skewX += item.angle;
                    break;
                case SVGTransform.SVG_TRANSFORM_SKEWY:
                    data.skewY += item.angle;
                    break;
            }
        }
        const style = getStyle(element);
        if (style.transformOrigin) {
            switch (style.transformOrigin) {
                case '0px 0px':
                case '0% 0%':
                case 'left top':
                    break;
                default:
                    data.origin = getBackgroundPosition(style.transformOrigin, element.getBoundingClientRect(), style.fontSize, true);
                    break;
            }
        }
        return data;
    }
    function isSvgVisible(element) {
        return cssAttribute(element, 'display') !== 'none' && !['hidden', 'collpase'].includes(cssAttribute(element, 'visibility'));
    }

    var svg = /*#__PURE__*/Object.freeze({
        createColorStop: createColorStop,
        createTransform: createTransform,
        isSvgVisible: isSvgVisible
    });

    var SvgElementBase = (Base) => {
        return class SvgElement extends Base {
            constructor(element) {
                super();
                this.name = '';
                this.visibility = true;
                if (element) {
                    this.setElement(element);
                    this.build();
                    if (this._element) {
                        this.visibility = isSvgVisible(element);
                    }
                }
            }
            setElement(element) {
                if (element instanceof SVGGraphicsElement) {
                    this._element = element;
                }
            }
            build() {
                const element = this._element;
                if (element) {
                    this.name = element.id;
                    this.transform = createTransform(element);
                }
            }
            get element() {
                return this._element;
            }
        };
    };

    class Container$SvgPath extends Container {
    }

    class SvgGroup extends SvgElementBase(Container$SvgPath) {
    }

    class SvgPath {
        constructor(element, d) {
            this.visibility = true;
            if (element) {
                this.setElement(element);
                this.build();
            }
            if (d) {
                this.d = d;
            }
        }
        setElement(element) {
            if (element instanceof SVGGraphicsElement) {
                this._element = element;
            }
        }
        build() {
            const element = this._element;
            if (element) {
                switch (element.tagName) {
                    case 'path': {
                        this.d = cssAttribute(element, 'd');
                        break;
                    }
                    case 'line': {
                        const item = element;
                        if (item.x1.baseVal.value !== 0 || item.y1.baseVal.value !== 0 || item.x2.baseVal.value !== 0 || item.y2.baseVal.value !== 0) {
                            this.d = `M${item.x1.baseVal.value},${item.y1.baseVal.value} L${item.x2.baseVal.value},${item.y2.baseVal.value}`;
                        }
                        break;
                    }
                    case 'rect': {
                        const item = element;
                        if (item.width.baseVal.value > 0 && item.height.baseVal.value > 0) {
                            const x = item.x.baseVal.value;
                            const y = item.y.baseVal.value;
                            this.d = `M${x},${y} H${x + item.width.baseVal.value} V${y + item.height.baseVal.value} H${x} Z`;
                        }
                        break;
                    }
                    case 'polyline':
                    case 'polygon': {
                        const item = element;
                        if (item.points.numberOfItems > 0) {
                            const data = [];
                            for (let j = 0; j < item.points.numberOfItems; j++) {
                                const pt = item.points.getItem(j);
                                data.push(`${pt.x},${pt.y}`);
                            }
                            this.d = `M${data.join(' ') + (element.tagName === 'polygon' ? ' Z' : '')}`;
                        }
                        break;
                    }
                    case 'circle': {
                        const item = element;
                        const r = item.r.baseVal.value;
                        if (r > 0) {
                            this.d = `M${item.cx.baseVal.value},${item.cy.baseVal.value} m-${r},0 a${r},${r} 0 1,0 ${r * 2},0 a${r},${r} 0 1,0 -${r * 2},0`;
                        }
                        break;
                    }
                    case 'ellipse': {
                        const item = element;
                        const rx = item.rx.baseVal.value;
                        const ry = item.ry.baseVal.value;
                        if (rx > 0 && ry > 0) {
                            this.d = `M${item.cx.baseVal.value - rx},${item.cy.baseVal.value} a${rx},${ry} 0 1,0 ${rx * 2},0 a${rx},${ry} 0 1,0 -${rx * 2},0`;
                        }
                        break;
                    }
                }
                const values = {
                    fill: cssAttribute(element, 'fill'),
                    stroke: cssAttribute(element, 'stroke')
                };
                const color = parseRGBA(cssAttribute(element, 'color')) || parseRGBA(cssInherit(element, 'color'));
                const pattern = /url\(#(.*?)\)/;
                for (const attr in values) {
                    const match = pattern.exec(values[attr]);
                    if (match) {
                        values[attr] = `@${match[1]}`;
                    }
                    else if (isString(values[attr])) {
                        switch (values[attr].toLowerCase()) {
                            case 'none':
                            case 'transparent':
                                values[attr] = '';
                                break;
                            case 'currentcolor':
                                values[attr] = color ? color.valueRGB : '';
                                break;
                            default:
                                const rgba = parseRGBA(values[attr]);
                                if (rgba) {
                                    values[attr] = rgba.valueRGB;
                                }
                                break;
                        }
                    }
                }
                let clipPath = '';
                const href = pattern.exec(cssAttribute(element, 'clip-path'));
                if (href) {
                    clipPath = href[1];
                }
                const fillOpacity = parseFloat(cssAttribute(element, 'fill-opacity'));
                const strokeOpacity = parseFloat(cssAttribute(element, 'stroke-opacity'));
                this.name = element.id;
                this.color = color ? color.valueRGB : '';
                this.fillRule = cssAttribute(element, 'fill-rule');
                this.fill = values.fill;
                this.stroke = values.stroke;
                this.strokeWidth = convertInt(cssAttribute(element, 'stroke-width')).toString();
                this.fillOpacity = !isNaN(fillOpacity) && fillOpacity < 1 ? fillOpacity : 1;
                this.strokeOpacity = !isNaN(strokeOpacity) && strokeOpacity < 1 ? strokeOpacity : 1;
                this.strokeLinecap = cssAttribute(element, 'stroke-linecap');
                this.strokeLinejoin = cssAttribute(element, 'stroke-linejoin');
                this.strokeMiterlimit = cssAttribute(element, 'stroke-miterlimit');
                this.clipPath = clipPath;
                this.clipRule = cssAttribute(element, 'clip-rule');
                this.visibility = isSvgVisible(element);
            }
        }
        get element() {
            return this._element;
        }
    }

    class SvgElement extends SvgElementBase(Object) {
    }

    class SvgImage extends SvgElement {
        constructor(element, uri) {
            super(element);
            this.uri = '';
            if (uri) {
                this.uri = uri;
            }
        }
        setElement(element) {
            if (element instanceof SVGImageElement) {
                this._element = element;
            }
        }
    }

    class Svg extends Container {
        constructor(element) {
            super();
            this.defs = {
                image: [],
                clipPath: new Map(),
                gradient: new Map()
            };
            this._width = 0;
            this._height = 0;
            this._viewBoxWidth = 0;
            this._viewBoxHeight = 0;
            this._opacity = 1;
            if (element) {
                this.setElement(element);
                this.build();
            }
        }
        static createClipPath(element) {
            const result = [];
            if (element.id) {
                for (const item of Array.from(element.children)) {
                    const path = new SvgPath(item);
                    if (path) {
                        result.push(path);
                    }
                }
            }
            return result;
        }
        setElement(element) {
            if (element instanceof SVGSVGElement) {
                this._element = element;
            }
        }
        setDimensions(width, height) {
            this._width = width;
            this._height = height;
        }
        setViewBox(width, height) {
            this._viewBoxWidth = width;
            this._viewBoxHeight = height;
        }
        setOpacity(value) {
            value = parseFloat(value.toString());
            this._opacity = !isNaN(value) && value < 1 ? value : 1;
        }
        build() {
            const element = this._element;
            if (element) {
                this.name = element.id;
                this.defs.image = [];
                this.setDimensions(element.width.baseVal.value, element.height.baseVal.value);
                this.setViewBox(element.viewBox.baseVal.width, element.viewBox.baseVal.height);
                this.setOpacity(cssAttribute(element, 'opacity'));
                element.querySelectorAll('clipPath, linearGradient, radialGradient, image').forEach((item) => {
                    switch (item.tagName) {
                        case 'clipPath': {
                            const clipPath = Svg.createClipPath(item);
                            if (clipPath.length > 0) {
                                this.defs.clipPath.set(`${item.id}`, clipPath);
                            }
                            break;
                        }
                        case 'linearGradient': {
                            const gradient = item;
                            this.defs.gradient.set(`@${gradient.id}`, {
                                type: 'linear',
                                x1: gradient.x1.baseVal.value,
                                x2: gradient.x2.baseVal.value,
                                y1: gradient.y1.baseVal.value,
                                y2: gradient.y2.baseVal.value,
                                x1AsString: gradient.x1.baseVal.valueAsString,
                                x2AsString: gradient.x2.baseVal.valueAsString,
                                y1AsString: gradient.y1.baseVal.valueAsString,
                                y2AsString: gradient.y2.baseVal.valueAsString,
                                colorStop: createColorStop(gradient)
                            });
                            break;
                        }
                        case 'radialGradient': {
                            const gradient = item;
                            this.defs.gradient.set(`@${gradient.id}`, {
                                type: 'radial',
                                cx: gradient.cx.baseVal.value,
                                cy: gradient.cy.baseVal.value,
                                r: gradient.r.baseVal.value,
                                cxAsString: gradient.cx.baseVal.valueAsString,
                                cyAsString: gradient.cy.baseVal.valueAsString,
                                rAsString: gradient.r.baseVal.valueAsString,
                                fx: gradient.fx.baseVal.value,
                                fy: gradient.fy.baseVal.value,
                                fxAsString: gradient.fx.baseVal.valueAsString,
                                fyAsString: gradient.fy.baseVal.valueAsString,
                                colorStop: createColorStop(gradient)
                            });
                            break;
                        }
                        case 'image': {
                            const image = item;
                            const svgImage = new SvgImage(image, resolvePath(image.href.baseVal));
                            svgImage.width = image.width.baseVal.value;
                            svgImage.height = image.height.baseVal.value;
                            svgImage.x = image.x.baseVal.value;
                            svgImage.y = image.y.baseVal.value;
                            this.defs.image.push(svgImage);
                            break;
                        }
                    }
                });
                const baseTags = new Set(['svg', 'g']);
                [element, ...Array.from(element.children).filter(item => baseTags.has(item.tagName))].forEach((item, index) => {
                    const group = new SvgGroup(item);
                    if (index > 0 && item.tagName === 'svg') {
                        const svg = item;
                        group.x = svg.x.baseVal.value;
                        group.y = svg.y.baseVal.value;
                        group.width = svg.width.baseVal.value;
                        group.height = svg.height.baseVal.value;
                    }
                    for (let i = 0; i < item.children.length; i++) {
                        const subitem = item.children[i];
                        switch (subitem.tagName) {
                            case 'g':
                            case 'use':
                            case 'image':
                            case 'clipPath':
                            case 'linearGradient':
                            case 'radialGradient':
                                break;
                            default:
                                const path = new SvgPath(item.children[i]);
                                if (path.d && path.d !== 'none') {
                                    group.append(path);
                                }
                                break;
                        }
                    }
                    this.append(group);
                });
                element.querySelectorAll('use').forEach((item) => {
                    if (cssAttribute(item, 'display') !== 'none') {
                        let pathParent;
                        this.some(parent => {
                            return parent.some(path => {
                                if (item.href.baseVal === `#${path.name}`) {
                                    pathParent = path;
                                    return true;
                                }
                                return false;
                            });
                        });
                        if (pathParent) {
                            const use = new SvgPath(item, pathParent.d);
                            if (use) {
                                let found = false;
                                if (item.transform.baseVal.numberOfItems === 0 && item.x.baseVal.value === 0 && item.y.baseVal.value === 0 && item.width.baseVal.value === 0 && item.height.baseVal.value === 0) {
                                    this.some(groupItem => {
                                        if (item.parentElement instanceof SVGGraphicsElement && item.parentElement === groupItem.element) {
                                            groupItem.append(use);
                                            found = true;
                                            return true;
                                        }
                                        return false;
                                    });
                                }
                                if (!found) {
                                    const group = new SvgGroup(item);
                                    group.x = item.x.baseVal.value;
                                    group.y = item.y.baseVal.value;
                                    group.width = item.width.baseVal.value;
                                    group.height = item.height.baseVal.value;
                                    group.append(use);
                                    this.append(group);
                                }
                            }
                        }
                    }
                });
                const sorted = new Set();
                for (const item of Array.from(element.children)) {
                    const nested = new Set(Array.from(item.querySelectorAll('*')));
                    for (const group of this.list) {
                        if (group.element && (group.element === item || nested.has(group.element))) {
                            sorted.delete(group);
                            sorted.add(group);
                            break;
                        }
                        for (const path of group) {
                            if (path.element && (path.element === item || nested.has(path.element))) {
                                sorted.delete(group);
                                sorted.add(group);
                                break;
                            }
                        }
                    }
                }
                this.replace([...this.filter(item => item.length > 0 && !sorted.has(item)), ...sorted]);
            }
        }
        get element() {
            return this._element;
        }
        get width() {
            return this._width;
        }
        get height() {
            return this._height;
        }
        get viewBoxWidth() {
            return this._viewBoxWidth;
        }
        get viewBoxHeight() {
            return this._viewBoxHeight;
        }
        get opacity() {
            return this._opacity;
        }
    }

    function formatPlaceholder(id, symbol = ':') {
        return `{${symbol + id.toString()}}`;
    }
    function removePlaceholderAll(value) {
        return value.replace(/{[<:@>]\d+(:\d+)?}/g, '').trim();
    }
    function replacePlaceholder(value, id, content, before = false) {
        const placeholder = typeof id === 'number' ? formatPlaceholder(id) : id;
        return value.replace(placeholder, (before ? placeholder : '') + content + (before ? '' : placeholder));
    }
    function replaceIndent(value, depth) {
        if (depth >= 0) {
            let indent = -1;
            return value.split('\n').map(line => {
                const match = /^({.*?})(\t*)(<.*)/.exec(line);
                if (match) {
                    if (indent === -1) {
                        indent = match[2].length;
                    }
                    return match[1] + repeat(depth + (match[2].length - indent)) + match[3];
                }
                return line;
            })
                .join('\n');
        }
        return value;
    }
    function replaceTab(value, spaces = 4, preserve = false) {
        if (spaces > 0) {
            if (preserve) {
                value = value.split('\n').map(line => {
                    const match = line.match(/^(\t+)(.*)$/);
                    if (match) {
                        return ' '.repeat(spaces * match[1].length) + match[2];
                    }
                    return line;
                })
                    .join('\n');
            }
            else {
                value = value.replace(/\t/g, ' '.repeat(spaces));
            }
        }
        return value;
    }
    function replaceEntity(value) {
        return (value.replace(/&#(\d+);/g, (match, capture) => String.fromCharCode(parseInt(capture)))
            .replace(/\u00A0/g, '&#160;')
            .replace(/\u2002/g, '&#8194;')
            .replace(/\u2003/g, '&#8195;')
            .replace(/\u2009/g, '&#8201;')
            .replace(/\u200C/g, '&#8204;')
            .replace(/\u200D/g, '&#8205;')
            .replace(/\u200E/g, '&#8206;')
            .replace(/\u200F/g, '&#8207;'));
    }
    function replaceCharacter(value) {
        return (value.replace(/&nbsp;/g, '&#160;')
            .replace(/&(?!#?[A-Za-z0-9]{2,};)/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/'/g, '&apos;')
            .replace(/"/g, '&quot;'));
    }
    function parseTemplate(value) {
        const result = { '__root': value };
        let pattern = null;
        let match = false;
        let characters = value.length;
        let section = '';
        do {
            if (match) {
                const segment = match[0].replace(new RegExp(`^${match[1]}\\n`), '').replace(new RegExp(`${match[1]}$`), '');
                for (const index in result) {
                    result[index] = result[index].replace(new RegExp(match[0], 'g'), `{%${match[2]}}`);
                }
                result[match[2]] = segment;
                characters -= match[0].length;
                section = match[2];
            }
            if (match == null || characters === 0) {
                if (section) {
                    value = result[section];
                    if (!value) {
                        break;
                    }
                    characters = value.length;
                    section = '';
                    match = null;
                }
                else {
                    break;
                }
            }
            if (!match) {
                pattern = /(!(\w+))\n[\w\W]*\n*\1/g;
            }
            if (pattern) {
                match = pattern.exec(value);
            }
            else {
                break;
            }
        } while (true);
        return result;
    }
    function createTemplate(value, data, index) {
        let output = index != null ? value[index] : value['__root'].trim();
        for (const attr in data) {
            let result = '';
            if (isArray(data[attr])) {
                for (let i = 0; i < data[attr].length; i++) {
                    result += createTemplate(value, data[attr][i], attr.toString());
                }
                result = trimEnd(result, '\\n');
            }
            else {
                result = data[attr];
            }
            let hash = '';
            if (isString(result)) {
                if (isArray(data[attr])) {
                    hash = '%';
                }
                else {
                    hash = '[&~]';
                }
                output = output.replace(new RegExp(`{${hash + attr}}`, 'g'), result);
            }
            if (result === false || (Array.isArray(result) && result.length === 0) || (hash && hash !== '%')) {
                output = output.replace(new RegExp(`{%${attr}}\\n*`, 'g'), '');
            }
            if (hash === '' && new RegExp(`{&${attr}}`).test(output)) {
                output = '';
            }
        }
        if (index == null) {
            output = output.replace(/\n{%\w+}\n/g, '\n');
        }
        return output.replace(/\s+([\w:]+="[^"]*)?{~\w+}"?/g, '');
    }
    function getTemplateSection(data, ...levels) {
        let current = data;
        for (const level of levels) {
            const [index, array = '0'] = level.split('-');
            if (current[index] && current[index][parseInt(array)]) {
                current = current[index][parseInt(array)];
            }
            else {
                return {};
            }
        }
        return current;
    }

    var xml = /*#__PURE__*/Object.freeze({
        formatPlaceholder: formatPlaceholder,
        removePlaceholderAll: removePlaceholderAll,
        replacePlaceholder: replacePlaceholder,
        replaceIndent: replaceIndent,
        replaceTab: replaceTab,
        replaceEntity: replaceEntity,
        replaceCharacter: replaceCharacter,
        parseTemplate: parseTemplate,
        createTemplate: createTemplate,
        getTemplateSection: getTemplateSection
    });

    function prioritizeExtensions(extensions, element) {
        let result = [];
        let current = element;
        while (current) {
            result = [
                ...result,
                ...trimNull(current.dataset.ext)
                    .split(',')
                    .map(value => value.trim())
            ];
            current = current.parentElement;
        }
        result = result.filter(value => value);
        if (result.length > 0) {
            const tagged = [];
            const untagged = [];
            for (const item of extensions) {
                const index = result.indexOf(item.name);
                if (index !== -1) {
                    tagged[index] = item;
                }
                else {
                    untagged.push(item);
                }
            }
            return [...tagged.filter(item => item), ...untagged];
        }
        else {
            return extensions;
        }
    }
    class Application {
        constructor(framework) {
            this.framework = framework;
            this.renderQueue = {};
            this.loading = false;
            this.closed = false;
            this.cacheImage = new Map();
            this.cacheSession = new NodeList();
            this.cacheProcessing = new NodeList();
            this.viewElements = new Set();
            this.extensions = [];
            this._cacheRoot = new Set();
            this._renderPosition = {};
            this._currentIndex = -1;
            this._views = [];
            this._includes = [];
        }
        static isFrameHorizontal(nodes, cleared, lineBreak = false) {
            const floated = NodeList.floated(nodes);
            const margin = nodes.filter(node => node.autoMargin);
            const br = lineBreak ? getElementsBetweenSiblings(nodes[0].baseElement, nodes[nodes.length - 1].baseElement).filter(element => element.tagName === 'BR').length : 0;
            return (br === 0 && (floated.has('right') ||
                cleared.size > 0 ||
                margin.length > 0 ||
                !NodeList.linearX(nodes)));
        }
        static isRelativeHorizontal(nodes, cleared = new Map()) {
            const visible = nodes.filter(node => node.visible);
            const floated = NodeList.floated(nodes);
            const [floating, pageflow] = new NodeList(nodes).partition(node => node.floating);
            const flowIndex = pageflow.length > 0 ? Math.min.apply(null, pageflow.map(node => node.siblingIndex)) : Number.MAX_VALUE;
            const floatIndex = floating.length > 0 ? Math.max.apply(null, floating.map(node => node.siblingIndex)) : -1;
            const linearX = NodeList.linearX(nodes);
            if (visible.some(node => node.autoMarginHorizontal)) {
                return false;
            }
            if (floated.size === 1 && floating.length === nodes.length) {
                return !(linearX && cleared.size === 0);
            }
            return (cleared.size === 0 &&
                !floated.has('right') &&
                (pageflow.length === 0 || floating.length === 0 || floatIndex < flowIndex) &&
                visible.every(node => {
                    const verticalAlign = node.css('verticalAlign');
                    return (node.toInt('top') >= 0 && (['baseline', 'initial', 'unset', 'top', 'middle', 'sub', 'super'].includes(verticalAlign) ||
                        (isUnit(verticalAlign) && parseInt(verticalAlign) >= 0)));
                }) && (visible.some(node => ((node.textElement || node.imageElement || node.svgElement) && node.baseline) || (node.plainText && node.multiLine)) ||
                (!linearX && nodes.every(node => node.pageflow && node.inlineElement))));
        }
        registerController(controller) {
            controller.application = this;
            controller.cache = this.cacheProcessing;
            this.viewController = controller;
        }
        registerResource(resource) {
            resource.application = this;
            resource.cache = this.cacheProcessing;
            this.resourceHandler = resource;
        }
        registerExtension(ext) {
            const found = this.getExtension(ext.name);
            if (found) {
                if (Array.isArray(ext.tagNames)) {
                    found.tagNames = ext.tagNames;
                }
                Object.assign(found.options, ext.options);
                return true;
            }
            else {
                if ((ext.framework === 0 || hasBit(ext.framework, this.framework)) && ext.dependencies.every(item => !!this.getExtension(item.name))) {
                    ext.application = this;
                    this.extensions.push(ext);
                    return true;
                }
            }
            return false;
        }
        finalize() {
            const visible = this.cacheSession.visible.filter(node => node.rendered && !node.hasAlign(NODE_ALIGNMENT.SPACE));
            for (const node of visible) {
                if (!node.hasBit('excludeProcedure', NODE_PROCEDURE.LAYOUT)) {
                    node.setLayout();
                }
                if (!node.hasBit('excludeProcedure', NODE_PROCEDURE.ALIGNMENT)) {
                    node.setAlignment();
                }
            }
            for (const node of visible) {
                if (!node.hasBit('excludeProcedure', NODE_PROCEDURE.OPTIMIZATION)) {
                    node.applyOptimizations();
                }
                if (!node.hasBit('excludeProcedure', NODE_PROCEDURE.CUSTOMIZATION)) {
                    node.applyCustomizations();
                }
            }
            this.viewController.setBoxSpacing(this.viewData);
            this.processRenderQueue();
            this.viewController.finalize(this.viewData, this.resourceHandler.finalize(this.viewData));
            for (const ext of this.extensions) {
                for (const node of ext.subscribers) {
                    ext.setTarget(node);
                    ext.finalize();
                }
            }
            this.closed = true;
        }
        saveAllToDisk() {
            this.resourceHandler.file.saveAllToDisk(this.viewData);
        }
        reset() {
            this.cacheSession.each(node => node.element instanceof Element && deleteElementCache(node.element, 'node', 'style', 'styleMap', 'inlineSupport', 'boxSpacing', 'boxStyle', 'fontStyle', 'imageSource', 'optionArray', 'valueString'));
            for (const element of this._cacheRoot) {
                delete element.dataset.iteration;
                delete element.dataset.layoutName;
            }
            this.appName = '';
            this.renderQueue = {};
            this.cacheImage.clear();
            this.cacheSession.reset();
            this.cacheProcessing.reset();
            this.viewController.reset();
            this.resourceHandler.reset();
            this._cacheRoot.clear();
            this._views.length = 0;
            this._includes.length = 0;
            this._renderPosition = {};
            this._currentIndex = -1;
            for (const ext of this.extensions) {
                ext.subscribers.clear();
                ext.subscribersChild.clear();
            }
            this.closed = false;
        }
        setConstraints() {
            this.viewController.setConstraints();
        }
        setResources() {
            this.resourceHandler.setBoxStyle();
            this.resourceHandler.setFontStyle();
            this.resourceHandler.setBoxSpacing();
            this.resourceHandler.setValueString();
            this.resourceHandler.setOptionArray();
            this.resourceHandler.setImageSource();
        }
        setImageCache(element) {
            if (element && hasValue(element.src)) {
                this.cacheImage.set(element.src, {
                    width: element.naturalWidth,
                    height: element.naturalHeight,
                    uri: element.src
                });
            }
        }
        parseDocument(...elements) {
            let __THEN;
            this.viewElements.clear();
            this.loading = false;
            this.setStyleMap();
            if (this.appName === '' && elements.length === 0) {
                elements.push(document.body);
            }
            for (const item of elements) {
                const element = typeof item === 'string' ? document.getElementById(item) : item;
                if (element && isStyleElement(element)) {
                    this.viewElements.add(element);
                }
            }
            const rootElement = this.viewElements.values().next().value;
            const parseResume = () => {
                this.loading = false;
                if (this.settings.preloadImages) {
                    Array.from(rootElement.getElementsByClassName('androme.preload')).forEach(element => rootElement.removeChild(element));
                }
                for (const [uri, image] of this.cacheImage.entries()) {
                    this.resourceHandler.imageAssets.set(uri, image);
                }
                for (const element of this.viewElements) {
                    if (this.appName === '') {
                        if (element.id === '') {
                            element.id = 'untitled';
                        }
                        this.appName = element.id;
                    }
                    let filename = trimNull(element.dataset.filename).replace(new RegExp(`\.${this.viewController.localSettings.layout.fileExtension}$`), '');
                    if (filename === '') {
                        if (element.id === '') {
                            element.id = `document_${this.size}`;
                        }
                        filename = element.id;
                    }
                    const iteration = convertInt(element.dataset.iteration) + 1;
                    element.dataset.iteration = iteration.toString();
                    element.dataset.layoutName = convertWord(iteration > 1 ? `${filename}_${iteration}` : filename);
                    if (this.createCache(element)) {
                        this.createDocument();
                        this.setConstraints();
                        this.setResources();
                        this._cacheRoot.add(element);
                    }
                }
                if (typeof __THEN === 'function') {
                    __THEN.call(this);
                }
            };
            if (this.settings.preloadImages) {
                Array.from(rootElement.querySelectorAll('image')).forEach((item) => {
                    const uri = resolvePath(item.href.baseVal);
                    this.cacheImage.set(uri, {
                        width: item.width.baseVal.value,
                        height: item.height.baseVal.value,
                        uri
                    });
                });
                for (const image of this.cacheImage.values()) {
                    if (image.width === 0 && image.height === 0 && image.uri) {
                        const imageElement = document.createElement('IMG');
                        imageElement.src = image.uri;
                        if (imageElement.complete && imageElement.naturalWidth > 0 && imageElement.naturalHeight > 0) {
                            image.width = imageElement.naturalWidth;
                            image.height = imageElement.naturalHeight;
                        }
                        else {
                            imageElement.className = 'androme.preload';
                            imageElement.style.display = 'none';
                            rootElement.appendChild(imageElement);
                        }
                    }
                }
            }
            const images = Array.from(this.viewElements).map(element => {
                const incomplete = [];
                Array.from(element.querySelectorAll('IMG')).forEach((item) => {
                    if (item.complete) {
                        this.setImageCache(item);
                    }
                    else {
                        incomplete.push(item);
                    }
                });
                return incomplete;
            })
                .reduce((a, b) => a.concat(b), []);
            if (images.length === 0) {
                parseResume();
            }
            else {
                this.loading = true;
                const queue = images.map(image => {
                    return new Promise((resolve, reject) => {
                        image.onload = resolve;
                        image.onerror = reject;
                    });
                });
                Promise.all(queue).then((result) => {
                    if (Array.isArray(result)) {
                        for (const item of result) {
                            try {
                                this.setImageCache(item.srcElement);
                            }
                            catch (_a) {
                            }
                        }
                    }
                    parseResume();
                })
                    .catch((error) => {
                    const message = error.srcElement ? error.srcElement.src : '';
                    if (!hasValue(message) || confirm(`FAIL: ${message}`)) {
                        parseResume();
                    }
                });
            }
            return {
                then: (resolve) => {
                    if (this.loading) {
                        __THEN = resolve;
                    }
                    else {
                        resolve();
                    }
                }
            };
        }
        createCache(rootElement) {
            let nodeTotal = 0;
            if (rootElement === document.body) {
                Array.from(document.body.childNodes).some((item) => isElementVisible(item, this.settings.hideOffScreenElements) && ++nodeTotal > 1);
            }
            const elements = rootElement !== document.body ? rootElement.querySelectorAll('*') : document.querySelectorAll(nodeTotal > 1 ? 'body, body *' : 'body *');
            this.nodeProcessing = undefined;
            this.cacheProcessing.delegateAppend = undefined;
            this.cacheProcessing.clear();
            for (const ext of this.extensions) {
                ext.setTarget(undefined, undefined, rootElement);
                ext.beforeInit();
            }
            const rootNode = this.insertNode(rootElement);
            if (rootNode) {
                rootNode.parent = new this.nodeObject(0, (rootElement === document.body ? rootElement : rootElement.parentElement) || document.body, this.viewController.delegateNodeInit);
                rootNode.documentRoot = true;
                this.nodeProcessing = rootNode;
            }
            else {
                return false;
            }
            const localSettings = this.viewController.localSettings;
            const inlineAlways = localSettings.inline.always;
            const inlineSupport = this.settings.renderInlineText ? [] : localSettings.inline.tagName;
            function inlineElement(element) {
                const styleMap = getElementCache(element, 'styleMap');
                return ((!styleMap || Object.keys(styleMap).length === 0) &&
                    element.children.length === 0 &&
                    inlineSupport.includes(element.tagName));
            }
            for (const element of Array.from(elements)) {
                if (!this.viewElements.has(element)) {
                    prioritizeExtensions(this.extensions, element).some(item => item.init(element));
                    if (!this.viewElements.has(element) && !localSettings.unsupported.tagName.includes(element.tagName)) {
                        if (inlineAlways.includes(element.tagName) || (inlineElement(element) &&
                            element.parentElement &&
                            Array.from(element.parentElement.children).every(item => inlineElement(item)))) {
                            setElementCache(element, 'inlineSupport', true);
                        }
                        let valid = true;
                        let current = element.parentElement;
                        while (current) {
                            if (current === rootElement) {
                                break;
                            }
                            else if (current !== rootElement && this.viewElements.has(current)) {
                                valid = false;
                                break;
                            }
                            current = current.parentElement;
                        }
                        if (valid) {
                            let styleMap = getElementCache(element, 'styleMap');
                            if (!styleMap) {
                                styleMap = {};
                                setElementCache(element, 'styleMap', styleMap);
                            }
                            switch (element.tagName) {
                                case 'SELECT':
                                    if (styleMap.verticalAlign == null && element.size > 1) {
                                        styleMap.verticalAlign = 'text-bottom';
                                    }
                                    break;
                            }
                            this.insertNode(element);
                        }
                    }
                }
            }
            if (this.cacheProcessing.length > 0) {
                for (const node of this.cacheProcessing) {
                    const nodes = [];
                    let valid = false;
                    Array.from(node.element.childNodes).forEach((element) => {
                        if (element.nodeName === '#text') {
                            if (node.tagName !== 'SELECT') {
                                nodes.push(element);
                            }
                        }
                        else if (element.tagName !== 'BR') {
                            const elementNode = Node.getNodeFromElement(element);
                            if (!inlineSupport.includes(element.tagName) || (elementNode && !elementNode.excluded)) {
                                valid = true;
                            }
                        }
                    });
                    if (valid) {
                        nodes.forEach(element => this.insertNode(element, node));
                    }
                }
                const preAlignment = {};
                const direction = [];
                for (const node of this.cacheProcessing) {
                    if (node.styleElement) {
                        const element = node.element;
                        const textAlign = node.css('textAlign');
                        preAlignment[node.id] = {};
                        const attrs = preAlignment[node.id];
                        ['right', 'end', element.tagName !== 'BUTTON' && element.type !== 'button' ? 'center' : ''].some(value => {
                            if (value === textAlign) {
                                attrs.textAlign = value;
                                element.style.textAlign = 'left';
                                return true;
                            }
                            return false;
                        });
                        if (node.marginLeft < 0) {
                            attrs.marginLeft = node.css('marginLeft');
                            element.style.marginLeft = '0px';
                        }
                        if (node.marginTop < 0) {
                            attrs.marginTop = node.css('marginTop');
                            element.style.marginTop = '0px';
                        }
                        if (node.position === 'relative') {
                            ['top', 'right', 'bottom', 'left'].forEach(value => {
                                if (node.has(value)) {
                                    attrs[value] = node.styleMap[value];
                                    element.style[value] = 'auto';
                                }
                            });
                        }
                        if (node.overflowX || node.overflowY) {
                            if (node.has('width')) {
                                attrs.width = node.styleMap.width;
                                element.style.width = 'auto';
                            }
                            if (node.has('height')) {
                                attrs.height = node.styleMap.height;
                                element.style.height = 'auto';
                            }
                            attrs.overflow = node.style.overflow || '';
                            element.style.overflow = 'visible';
                        }
                        if (element.dir === 'rtl') {
                            element.dir = 'ltr';
                            direction.push(element);
                        }
                        node.setBounds();
                    }
                    node.setMultiLine();
                }
                for (const node of this.cacheProcessing) {
                    if (node.styleElement) {
                        const element = node.element;
                        const attrs = preAlignment[node.id];
                        if (attrs) {
                            for (const attr in attrs) {
                                element.style[attr] = attrs[attr];
                            }
                            if (direction.includes(element)) {
                                element.dir = 'rtl';
                            }
                        }
                    }
                    if (node.length === 1) {
                        const firstNode = node.item(0);
                        if (!firstNode.pageflow &&
                            firstNode.toInt('top') === 0 &&
                            firstNode.toInt('right') === 0 &&
                            firstNode.toInt('bottom') === 0 &&
                            firstNode.toInt('left') === 0) {
                            firstNode.pageflow = true;
                        }
                    }
                }
                for (const node of this.cacheProcessing) {
                    if (!node.documentRoot) {
                        let parent = node.getParentElementAsNode(this.settings.supportNegativeLeftTop);
                        if (!parent && !node.pageflow) {
                            parent = this.nodeProcessing;
                        }
                        if (parent) {
                            node.parent = parent;
                            node.documentParent = parent;
                        }
                        else {
                            node.hide();
                        }
                    }
                }
                for (const node of this.cacheProcessing.elements) {
                    if (node.htmlElement) {
                        let i = 0;
                        Array.from(node.element.childNodes).forEach((element) => {
                            const item = Node.getNodeFromElement(element);
                            if (item && !item.excluded && item.pageflow) {
                                item.siblingIndex = i++;
                            }
                        });
                        node.sort(NodeList.siblingIndex);
                        node.initial.children.push(...node.duplicate());
                    }
                }
                sortAsc(this.cacheProcessing.list, 'depth', 'id');
                for (const ext of this.extensions) {
                    ext.setTarget(rootNode);
                    ext.afterInit();
                }
                return true;
            }
            return false;
        }
        createDocument() {
            const localSettings = this.viewController.localSettings;
            const mapX = [];
            const mapY = new Map();
            let baseTemplate = localSettings.baseTemplate;
            let empty = true;
            function setMapY(depth, id, node) {
                if (!mapY.has(depth)) {
                    mapY.set(depth, new Map());
                }
                const mapIndex = mapY.get(depth);
                if (mapIndex) {
                    mapIndex.set(id, node);
                }
            }
            function deleteMapY(id) {
                for (const mapNode of mapY.values()) {
                    for (const node of mapNode.values()) {
                        if (node.id === id) {
                            mapNode.delete(node.id);
                            return;
                        }
                    }
                }
            }
            setMapY(-1, 0, this.nodeProcessing.parent);
            let maxDepth = 0;
            for (const node of this.cacheProcessing.visible) {
                const x = Math.floor(node.linear.left);
                if (mapX[node.depth] == null) {
                    mapX[node.depth] = {};
                }
                if (mapX[node.depth][x] == null) {
                    mapX[node.depth][x] = [];
                }
                mapX[node.depth][x].push(node);
                setMapY(node.depth, node.id, node);
                maxDepth = Math.max(node.depth, maxDepth);
            }
            for (let i = 0; i < maxDepth; i++) {
                mapY.set((i * -1) - 2, new Map());
            }
            this.cacheProcessing.delegateAppend = (node) => {
                deleteMapY(node.id);
                setMapY((node.initial.depth * -1) - 2, node.id, node);
                node.cascade().forEach((item) => {
                    deleteMapY(item.id);
                    setMapY((item.initial.depth * -1) - 2, item.id, item);
                });
            };
            for (const depth of mapY.values()) {
                function insertNodeTemplate(data, node, parentId, value, current) {
                    const key = parentId + (current === '' && node.renderPosition !== -1 ? `:${node.renderPosition}` : '');
                    if (!data.has(key)) {
                        data.set(key, new Map());
                    }
                    const template = data.get(key);
                    if (template) {
                        template.set(node.id, value);
                    }
                }
                const partial = new Map();
                const external = new Map();
                const renderNode = (node, parent, output, current = '', group = false) => {
                    if (output !== '') {
                        if (group) {
                            node.each((item) => {
                                [partial, external].some(data => {
                                    for (const views of partial.values()) {
                                        let template = views.get(item.id);
                                        if (template) {
                                            const indent = node.renderDepth + 1;
                                            if (item.renderDepth !== indent) {
                                                template = replaceIndent(template, indent);
                                                item.renderDepth = indent;
                                            }
                                            insertNodeTemplate(data, item, node.id.toString(), template, current);
                                            views.delete(item.id);
                                            return true;
                                        }
                                    }
                                    return false;
                                });
                            });
                        }
                        if (current !== '') {
                            insertNodeTemplate(external, node, current, output, current);
                        }
                        else {
                            if (!this.viewElements.has(node.element)) {
                                if (node.dataset.target) {
                                    const target = document.getElementById(node.dataset.target);
                                    if (target && target !== parent.element) {
                                        this.addRenderQueue(node.dataset.target, [output]);
                                        node.auto = false;
                                        return;
                                    }
                                }
                                else if (parent.dataset.target) {
                                    const target = document.getElementById(parent.dataset.target);
                                    if (target) {
                                        this.addRenderQueue(parent.nodeId, [output]);
                                        node.dataset.target = parent.nodeId;
                                        return;
                                    }
                                }
                            }
                            insertNodeTemplate(partial, node, parent.id.toString(), output, current);
                        }
                    }
                };
                for (const parent of depth.values()) {
                    if (parent.length === 0 || parent.every(node => node.rendered)) {
                        continue;
                    }
                    const axisY = [];
                    const below = [];
                    const middle = [];
                    const above = [];
                    parent.each((node) => {
                        if (node.documentRoot) {
                            axisY.push(node);
                        }
                        else if (node.pageflow || node.alignOrigin) {
                            middle.push(node);
                        }
                        else {
                            if (node.toInt('zIndex') >= 0 || node.parent.element !== node.element.parentElement) {
                                above.push(node);
                            }
                            else {
                                below.push(node);
                            }
                        }
                    });
                    NodeList.sortByAlignment(middle, NODE_ALIGNMENT.NONE, parent);
                    axisY.push(...sortAsc(below, 'style.zIndex', 'id'));
                    axisY.push(...middle);
                    axisY.push(...sortAsc(above, 'style.zIndex', 'id'));
                    const documentParent = parent.filter(item => item.siblingflow).map(item => item.documentParent);
                    const cleared = NodeList.cleared(new Set(documentParent).size === 1
                        ? Array.from(documentParent[0].baseElement.children).map((element) => Node.getNodeFromElement(element)).filter(item => item)
                        : axisY);
                    const includes$$1 = [];
                    let current = '';
                    let k = -1;
                    function getCurrent() {
                        return includes$$1.length > 0 ? includes$$1[includes$$1.length - 1] : '';
                    }
                    while (++k < axisY.length) {
                        let nodeY = axisY[k];
                        if (!nodeY.visible || nodeY.rendered || (!nodeY.documentRoot && this.viewElements.has(nodeY.element))) {
                            continue;
                        }
                        let parentY = nodeY.parent;
                        let currentY = '';
                        if (localSettings.includes) {
                            if (!nodeY.hasBit('excludeSection', APP_SECTION.INCLUDE)) {
                                const filename = trimNull(nodeY.dataset.include);
                                if (filename !== '' && includes$$1.indexOf(filename) === -1) {
                                    renderNode(nodeY, parentY, this.viewController.renderInclude(nodeY, parentY, filename), getCurrent());
                                    includes$$1.push(filename);
                                }
                                current = getCurrent();
                                if (current !== '') {
                                    const cloneParent = parentY.clone();
                                    cloneParent.renderDepth = this.viewController.baseRenderDepth(current);
                                    nodeY.parent = cloneParent;
                                    parentY = cloneParent;
                                }
                                currentY = current;
                            }
                            else {
                                currentY = '';
                            }
                        }
                        if (nodeY.renderAs) {
                            parentY.remove(nodeY);
                            nodeY.hide();
                            nodeY = nodeY.renderAs;
                        }
                        if (!nodeY.hasBit('excludeSection', APP_SECTION.DOM_TRAVERSE) && axisY.length > 1 && k < axisY.length - 1) {
                            const linearVertical = parentY.linearVertical;
                            if (nodeY.pageflow &&
                                current === '' &&
                                !parentY.flex.enabled &&
                                !parentY.has('columnCount') &&
                                !parentY.is(NODE_STANDARD.GRID) &&
                                (nodeY.hasAlign(NODE_ALIGNMENT.EXTENDABLE) || (nodeY.alignmentType === NODE_ALIGNMENT.NONE && parentY.alignmentType === NODE_ALIGNMENT.NONE))) {
                                const horizontal = [];
                                const vertical = [];
                                const floatedOpen = new Set(['left', 'right']);
                                let verticalExtended = false;
                                let l = k;
                                let m = 0;
                                if (nodeY.hasAlign(NODE_ALIGNMENT.EXTENDABLE)) {
                                    horizontal.push(nodeY);
                                    l++;
                                    m++;
                                }
                                mainloop: {
                                    for (; l < axisY.length; l++, m++) {
                                        const adjacent = axisY[l];
                                        if (adjacent.pageflow) {
                                            const float = cleared.get(adjacent);
                                            if (float) {
                                                if (float === 'both') {
                                                    floatedOpen.clear();
                                                }
                                                else {
                                                    floatedOpen.delete(float);
                                                }
                                            }
                                            if (adjacent.floating) {
                                                floatedOpen.add(adjacent.float);
                                            }
                                            const previousSibling = adjacent.previousSibling();
                                            const nextSibling = adjacent.nextSibling(true);
                                            if (m === 0 && nextSibling) {
                                                if (adjacent.blockStatic || nextSibling.alignedVertically(adjacent, cleared, true)) {
                                                    vertical.push(adjacent);
                                                }
                                                else {
                                                    horizontal.push(adjacent);
                                                }
                                            }
                                            else if (previousSibling) {
                                                const floated = NodeList.floated([...horizontal, ...vertical]);
                                                const pending = [...horizontal, ...vertical, adjacent];
                                                const clearedPartial = NodeList.cleared(pending);
                                                const clearedPrevious = new Map();
                                                if (clearedPartial.has(previousSibling) || (previousSibling.lineBreak && cleared.has(previousSibling))) {
                                                    clearedPrevious.set(previousSibling, previousSibling.css('clear'));
                                                }
                                                const verticalAlign = adjacent.alignedVertically(previousSibling, clearedPrevious);
                                                if (verticalAlign || clearedPartial.has(adjacent) || (this.settings.floatOverlapDisabled && previousSibling.floating && adjacent.blockStatic && floatedOpen.size === 2)) {
                                                    if (horizontal.length > 0) {
                                                        if (!this.settings.floatOverlapDisabled) {
                                                            if (floatedOpen.size > 0 &&
                                                                !pending.map(node => clearedPartial.get(node)).includes('both') &&
                                                                (floated.size === 0 || adjacent.bounds.top < Math.max.apply(null, horizontal.filter(node => node.floating).map(node => node.bounds.bottom)))) {
                                                                if (clearedPartial.has(adjacent)) {
                                                                    if (floatedOpen.size < 2 && floated.size === 2 && !adjacent.floating) {
                                                                        adjacent.alignmentType |= NODE_ALIGNMENT.EXTENDABLE;
                                                                        verticalExtended = true;
                                                                        horizontal.push(adjacent);
                                                                        continue;
                                                                    }
                                                                    break mainloop;
                                                                }
                                                                else if (!verticalAlign) {
                                                                    horizontal.push(adjacent);
                                                                    continue;
                                                                }
                                                                if (floated.size === 1 && (!adjacent.floating || floatedOpen.has(adjacent.float))) {
                                                                    horizontal.push(adjacent);
                                                                    continue;
                                                                }
                                                            }
                                                        }
                                                        break mainloop;
                                                    }
                                                    if (linearVertical && vertical.length > 0) {
                                                        const previousAbove = vertical[vertical.length - 1];
                                                        if (previousAbove.linearVertical) {
                                                            adjacent.parent = previousAbove;
                                                            continue;
                                                        }
                                                    }
                                                    vertical.push(adjacent);
                                                }
                                                else {
                                                    if (vertical.length > 0 || verticalExtended) {
                                                        break mainloop;
                                                    }
                                                    horizontal.push(adjacent);
                                                }
                                            }
                                            else {
                                                break mainloop;
                                            }
                                        }
                                    }
                                }
                                let group;
                                let groupOutput = '';
                                if (horizontal.length > 1) {
                                    const clearedPartial = NodeList.cleared(horizontal);
                                    if (Application.isFrameHorizontal(horizontal, clearedPartial)) {
                                        group = this.viewController.createGroup(parentY, nodeY, horizontal);
                                        groupOutput = this.writeFrameLayoutHorizontal(group, parentY, horizontal, clearedPartial);
                                    }
                                    else {
                                        if (horizontal.length === axisY.length) {
                                            parentY.alignmentType |= NODE_ALIGNMENT.HORIZONTAL;
                                        }
                                        else {
                                            const floated = NodeList.floated(horizontal);
                                            if (floated.size === 1 &&
                                                horizontal.some(node => node.has('width', CSS_STANDARD.PERCENT)) &&
                                                horizontal.every(node => node.has('width', CSS_STANDARD.UNIT | CSS_STANDARD.PERCENT))) {
                                                group = this.viewController.createGroup(parentY, nodeY, horizontal);
                                                groupOutput = this.writeConstraintLayout(group, parentY);
                                                group.alignmentType |= NODE_ALIGNMENT.PERCENT;
                                            }
                                            else if (Application.isRelativeHorizontal(horizontal, clearedPartial)) {
                                                group = this.viewController.createGroup(parentY, nodeY, horizontal);
                                                groupOutput = this.writeRelativeLayout(group, parentY);
                                                group.alignmentType |= NODE_ALIGNMENT.HORIZONTAL;
                                            }
                                            else {
                                                group = this.viewController.createGroup(parentY, nodeY, horizontal);
                                                groupOutput = this.writeLinearLayout(group, parentY, true);
                                                if (floated.size > 0) {
                                                    group.alignmentType |= NODE_ALIGNMENT.FLOAT;
                                                    group.alignmentType |= horizontal.every(node => node.float === 'right' || node.autoMarginLeft) ? NODE_ALIGNMENT.RIGHT : NODE_ALIGNMENT.LEFT;
                                                }
                                                else {
                                                    group.alignmentType |= NODE_ALIGNMENT.HORIZONTAL;
                                                }
                                            }
                                        }
                                    }
                                }
                                else if (vertical.length > 1) {
                                    const floated = NodeList.floated(vertical);
                                    const clearedPartial = NodeList.cleared(vertical);
                                    if (floated.size > 0 &&
                                        clearedPartial.size > 0 &&
                                        !(floated.size === 1 && vertical.slice(1, vertical.length - 1).every(node => clearedPartial.has(node)))) {
                                        if (parentY.linearVertical && !hasValue(nodeY.dataset.ext)) {
                                            group = nodeY;
                                            groupOutput = this.writeFrameLayoutVertical(undefined, parentY, vertical, clearedPartial);
                                        }
                                        else {
                                            group = this.viewController.createGroup(parentY, nodeY, vertical);
                                            groupOutput = this.writeFrameLayoutVertical(group, parentY, vertical, clearedPartial);
                                        }
                                    }
                                    else {
                                        if (vertical.length === axisY.length) {
                                            parentY.alignmentType |= NODE_ALIGNMENT.VERTICAL;
                                        }
                                        else if (!linearVertical) {
                                            group = this.viewController.createGroup(parentY, nodeY, vertical);
                                            groupOutput = this.writeLinearLayout(group, parentY, false);
                                            group.alignmentType |= NODE_ALIGNMENT.VERTICAL;
                                        }
                                    }
                                    if (vertical.length !== axisY.length) {
                                        const lastNode = vertical[vertical.length - 1];
                                        if (!lastNode.blockStatic && lastNode !== axisY[axisY.length - 1]) {
                                            lastNode.alignmentType |= NODE_ALIGNMENT.EXTENDABLE;
                                        }
                                    }
                                }
                                if (group) {
                                    renderNode(group, parentY, groupOutput, '', true);
                                    parentY = nodeY.parent;
                                }
                                if (nodeY.hasAlign(NODE_ALIGNMENT.EXTENDABLE)) {
                                    nodeY.alignmentType ^= NODE_ALIGNMENT.EXTENDABLE;
                                }
                            }
                        }
                        if (!nodeY.hasBit('excludeSection', APP_SECTION.EXTENSION) && !nodeY.rendered) {
                            let next = false;
                            for (const ext of [...parentY.renderExtension, ...this.extensions.filter(item => item.subscribersChild.has(nodeY))]) {
                                ext.setTarget(nodeY, parentY);
                                const result = ext.processChild();
                                if (result.output !== '') {
                                    renderNode(nodeY, parentY, result.output, currentY);
                                }
                                if (result.renderAs && result.renderOutput) {
                                    renderNode(result.renderAs, parentY, result.renderOutput, currentY);
                                }
                                if (result.parent) {
                                    parentY = result.parent;
                                }
                                next = !!result.next;
                                if (result.complete || result.next) {
                                    break;
                                }
                            }
                            if (next) {
                                continue;
                            }
                            if (nodeY.styleElement) {
                                const processed = [];
                                prioritizeExtensions(this.extensions, nodeY.element).some(item => {
                                    if (item.is(nodeY)) {
                                        item.setTarget(nodeY, parentY);
                                        if (item.condition()) {
                                            const result = item.processNode(mapX, mapY);
                                            if (result.output !== '') {
                                                renderNode(nodeY, parentY, result.output, currentY);
                                            }
                                            if (result.renderAs && result.renderOutput) {
                                                renderNode(result.renderAs, parentY, result.renderOutput, currentY);
                                            }
                                            if (result.parent) {
                                                parentY = result.parent;
                                            }
                                            if (result.output !== '' || result.include) {
                                                processed.push(item);
                                            }
                                            next = !!result.next;
                                            if (result.complete || result.next) {
                                                return true;
                                            }
                                        }
                                    }
                                    return false;
                                });
                                processed.forEach(item => item.subscribers.add(nodeY) && nodeY.renderExtension.add(item));
                                if (next) {
                                    continue;
                                }
                            }
                        }
                        if (!nodeY.hasBit('excludeSection', APP_SECTION.RENDER) && !nodeY.rendered) {
                            let output = '';
                            if (nodeY.controlName === '') {
                                const borderVisible = nodeY.borderTopWidth > 0 || nodeY.borderBottomWidth > 0 || nodeY.borderRightWidth > 0 || nodeY.borderLeftWidth > 0;
                                const backgroundImage = DOM_REGEX.CSS_URL.test(nodeY.css('backgroundImage')) || DOM_REGEX.CSS_URL.test(nodeY.css('background'));
                                const backgroundColor = nodeY.has('backgroundColor');
                                const backgroundVisible = borderVisible || backgroundImage || backgroundColor;
                                if (nodeY.length === 0) {
                                    const freeFormText = hasFreeFormText(nodeY.element, this.settings.renderInlineText ? 0 : 1);
                                    if (freeFormText || (borderVisible && nodeY.textContent.length > 0)) {
                                        output = this.writeNode(nodeY, parentY, NODE_STANDARD.TEXT);
                                    }
                                    else if (backgroundImage &&
                                        nodeY.css('backgroundRepeat') === 'no-repeat' &&
                                        (!nodeY.inlineText || nodeY.toInt('textIndent') + nodeY.bounds.width < 0)) {
                                        nodeY.alignmentType |= NODE_ALIGNMENT.SINGLE;
                                        nodeY.excludeResource |= NODE_RESOURCE.FONT_STYLE | NODE_RESOURCE.VALUE_STRING;
                                        output = this.writeNode(nodeY, parentY, NODE_STANDARD.IMAGE);
                                    }
                                    else if (nodeY.block &&
                                        (backgroundColor || backgroundImage) &&
                                        (borderVisible || nodeY.paddingTop + nodeY.paddingRight + nodeY.paddingRight + nodeY.paddingLeft > 0)) {
                                        output = this.writeNode(nodeY, parentY, NODE_STANDARD.LINE);
                                    }
                                    else if (!nodeY.documentRoot) {
                                        if (this.settings.collapseUnattributedElements &&
                                            nodeY.bounds.height === 0 &&
                                            !hasValue(nodeY.element.id) &&
                                            !hasValue(nodeY.dataset.ext) &&
                                            !backgroundVisible) {
                                            parentY.remove(nodeY);
                                            nodeY.hide();
                                        }
                                        else if (backgroundVisible) {
                                            output = this.writeNode(nodeY, parentY, NODE_STANDARD.TEXT);
                                        }
                                        else {
                                            output = this.writeFrameLayout(nodeY, parentY);
                                        }
                                    }
                                }
                                else {
                                    if (nodeY.flex.enabled || nodeY.some(node => !node.pageflow) || nodeY.has('columnCount')) {
                                        output = this.writeConstraintLayout(nodeY, parentY);
                                    }
                                    else {
                                        if (nodeY.length === 1) {
                                            const targeted = nodeY.filter(node => {
                                                if (node.dataset.target) {
                                                    const element = document.getElementById(node.dataset.target);
                                                    return element != null && hasValue(element.dataset.ext) && element !== parentY.element;
                                                }
                                                return false;
                                            });
                                            if ((this.settings.collapseUnattributedElements &&
                                                !nodeY.documentRoot &&
                                                !hasValue(nodeY.element.id) &&
                                                !hasValue(nodeY.dataset.ext) &&
                                                !hasValue(nodeY.dataset.target) &&
                                                nodeY.toInt('width') === 0 &&
                                                nodeY.toInt('height') === 0 &&
                                                !backgroundVisible &&
                                                !nodeY.has('textAlign') && !nodeY.has('verticalAlign') &&
                                                nodeY.float !== 'right' && !nodeY.autoMargin && nodeY.alignOrigin &&
                                                !this.viewController.hasAppendProcessing(nodeY.id)) ||
                                                (nodeY.documentRoot && targeted.length === 1)) {
                                                const child = nodeY.item(0);
                                                child.documentRoot = nodeY.documentRoot;
                                                child.siblingIndex = nodeY.siblingIndex;
                                                if (parentY.id !== 0) {
                                                    child.parent = parentY;
                                                }
                                                if (targeted.length === 0) {
                                                    nodeY.resetBox(BOX_STANDARD.MARGIN, child, true);
                                                    child.modifyBox(BOX_STANDARD.MARGIN_TOP, nodeY.paddingTop);
                                                    child.modifyBox(BOX_STANDARD.MARGIN_RIGHT, nodeY.paddingRight);
                                                    child.modifyBox(BOX_STANDARD.MARGIN_BOTTOM, nodeY.paddingBottom);
                                                    child.modifyBox(BOX_STANDARD.MARGIN_LEFT, nodeY.paddingLeft);
                                                }
                                                nodeY.hide();
                                                axisY[k] = child;
                                                k--;
                                                continue;
                                            }
                                            else {
                                                output = this.writeFrameLayout(nodeY, parentY);
                                            }
                                        }
                                        else {
                                            const children = nodeY.list;
                                            const [linearX, linearY] = [NodeList.linearX(children), NodeList.linearY(children)];
                                            const clearedInside = NodeList.cleared(children);
                                            const relativeWrap = children.every(node => node.pageflow && node.inlineElement);
                                            if (!parentY.flex.enabled && children.every(node => node.pageflow)) {
                                                const floated = NodeList.floated(children);
                                                if (linearX && clearedInside.size === 0) {
                                                    if (floated.size === 0 && children.every(node => node.toInt('verticalAlign') === 0)) {
                                                        if (children.some(node => ['text-top', 'text-bottom'].includes(node.css('verticalAlign')))) {
                                                            output = this.writeConstraintLayout(nodeY, parentY);
                                                            nodeY.alignmentType |= NODE_ALIGNMENT.HORIZONTAL;
                                                        }
                                                        else if (Application.isRelativeHorizontal(children)) {
                                                            output = this.writeRelativeLayout(nodeY, parentY);
                                                            nodeY.alignmentType |= NODE_ALIGNMENT.HORIZONTAL;
                                                        }
                                                    }
                                                    if (output === '') {
                                                        if (floated.size === 0 || !floated.has('right')) {
                                                            if (Application.isRelativeHorizontal(children)) {
                                                                output = this.writeRelativeLayout(nodeY, parentY);
                                                                nodeY.alignmentType |= NODE_ALIGNMENT.HORIZONTAL;
                                                            }
                                                            else {
                                                                output = this.writeLinearLayout(nodeY, parentY, true);
                                                                nodeY.alignmentType |= NODE_ALIGNMENT.HORIZONTAL;
                                                            }
                                                        }
                                                    }
                                                }
                                                else {
                                                    if (linearY || (!relativeWrap && children.some(node => node.alignedVertically(node.previousSibling(), clearedInside)))) {
                                                        output = this.writeLinearLayout(nodeY, parentY, false);
                                                        if (linearY && !nodeY.documentRoot) {
                                                            nodeY.alignmentType |= NODE_ALIGNMENT.VERTICAL;
                                                        }
                                                    }
                                                }
                                            }
                                            if (output === '') {
                                                if (relativeWrap) {
                                                    if (Application.isFrameHorizontal(children, clearedInside, true)) {
                                                        output = this.writeFrameLayoutHorizontal(nodeY, parentY, children, clearedInside);
                                                    }
                                                    else {
                                                        output = this.writeRelativeLayout(nodeY, parentY);
                                                        if (getElementsBetweenSiblings(children[0].baseElement, children[children.length - 1].baseElement)
                                                            .filter(element => isLineBreak(element)).length === 0) {
                                                            nodeY.alignmentType |= NODE_ALIGNMENT.HORIZONTAL;
                                                        }
                                                    }
                                                }
                                                else {
                                                    output = this.writeConstraintLayout(nodeY, parentY);
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                            else {
                                output = this.writeNode(nodeY, parentY, nodeY.controlName);
                            }
                            renderNode(nodeY, parentY, output, currentY);
                        }
                        if (localSettings.includes && !nodeY.hasBit('excludeSection', APP_SECTION.INCLUDE) && nodeY.dataset.includeEnd === 'true') {
                            includes$$1.pop();
                        }
                    }
                }
                for (const [key, templates] of partial.entries()) {
                    const content = [];
                    const [parentId, position] = key.split(':');
                    const views = Array.from(templates.values());
                    if (views.length > 0) {
                        if (this._renderPosition[parentId]) {
                            const parsed = [];
                            this._renderPosition[parentId].forEach(value => {
                                const result = views.find(view => view.indexOf(formatPlaceholder(value, '@')) !== -1);
                                if (result) {
                                    parsed.push(result);
                                }
                            });
                            if (parsed.length === views.length) {
                                content.push(...parsed);
                            }
                        }
                        if (content.length === 0) {
                            content.push(...views);
                        }
                        const id = parentId + (position ? `:${position}` : '');
                        const placeholder = formatPlaceholder(id);
                        if (baseTemplate.indexOf(placeholder) !== -1) {
                            baseTemplate = replacePlaceholder(baseTemplate, placeholder, content.join(''));
                            empty = false;
                        }
                        else {
                            this.addRenderQueue(id, views);
                        }
                    }
                }
                if (localSettings.includes) {
                    for (const [filename, templates] of external.entries()) {
                        const content = Array.from(templates.values());
                        if (content.length > 0) {
                            const output = this.viewController.renderMerge(filename, content);
                            this.addIncludeFile(filename, output);
                        }
                    }
                }
            }
            const root = this.nodeProcessing;
            if (root) {
                if (root.dataset.layoutName && (!hasValue(root.dataset.target) || root.renderExtension.size === 0)) {
                    this.addLayoutFile(trimString(trimNull(root.dataset.pathname), '/'), root.dataset.layoutName, !empty ? baseTemplate : '', root.renderExtension.size > 0 && Array.from(root.renderExtension).some(item => item.documentRoot));
                }
                if (!empty) {
                    for (const ext of this.extensions) {
                        ext.setTarget(root);
                        ext.afterRender();
                    }
                }
                else if (root.renderExtension.size === 0) {
                    root.hide();
                }
                this.cacheProcessing.sort((a, b) => {
                    if (!a.visible) {
                        return 1;
                    }
                    else if (!b.visible) {
                        return -1;
                    }
                    else if (a.renderDepth !== b.renderDepth) {
                        return a.renderDepth < b.renderDepth ? -1 : 1;
                    }
                    else {
                        if (!a.domElement) {
                            const nodeA = Node.getNodeFromElement(a.baseElement);
                            if (nodeA) {
                                a = nodeA;
                            }
                            else {
                                return 1;
                            }
                        }
                        if (!b.domElement) {
                            const nodeB = Node.getNodeFromElement(a.baseElement);
                            if (nodeB) {
                                b = nodeB;
                            }
                            else {
                                return -1;
                            }
                        }
                        if (a.documentParent !== b.documentParent) {
                            return a.documentParent.id < b.documentParent.id ? -1 : 1;
                        }
                        else {
                            return a.renderIndex < b.renderIndex ? -1 : 1;
                        }
                    }
                });
                this.cacheSession.list.push(...this.cacheProcessing.list);
            }
        }
        writeFrameLayout(node, parent, children = false) {
            if (!children && node.length === 0) {
                return this.viewController.renderNode(node, parent, NODE_STANDARD.FRAME);
            }
            else {
                return this.viewController.renderGroup(node, parent, NODE_STANDARD.FRAME);
            }
        }
        writeLinearLayout(node, parent, horizontal) {
            return this.viewController.renderGroup(node, parent, NODE_STANDARD.LINEAR, { horizontal });
        }
        writeGridLayout(node, parent, columnCount, rowCount = 0) {
            return this.viewController.renderGroup(node, parent, NODE_STANDARD.GRID, { columnCount, rowCount });
        }
        writeRelativeLayout(node, parent) {
            return this.viewController.renderGroup(node, parent, NODE_STANDARD.RELATIVE);
        }
        writeConstraintLayout(node, parent) {
            return this.viewController.renderGroup(node, parent, NODE_STANDARD.CONSTRAINT);
        }
        writeNode(node, parent, nodeName) {
            return this.viewController.renderNode(node, parent, nodeName);
        }
        writeFrameLayoutHorizontal(group, parent, nodes, cleared) {
            let output = '';
            let layers = [];
            if (cleared.size === 0 && nodes.every(node => !node.autoMargin)) {
                const inline = [];
                const left = [];
                const right = [];
                for (const node of nodes) {
                    if (node.floating) {
                        if (node.float === 'right') {
                            right.push(node);
                        }
                        else {
                            left.push(node);
                        }
                    }
                    else {
                        inline.push(node);
                    }
                }
                if (inline.length === nodes.length || left.length === nodes.length || right.length === nodes.length) {
                    group.alignmentType |= inline.length > 0 ? NODE_ALIGNMENT.HORIZONTAL : NODE_ALIGNMENT.FLOAT;
                    if (right.length > 0) {
                        group.alignmentType |= NODE_ALIGNMENT.RIGHT;
                    }
                    if (Application.isRelativeHorizontal(nodes, cleared)) {
                        output = this.writeRelativeLayout(group, parent);
                        return output;
                    }
                    else {
                        output = this.writeLinearLayout(group, parent, true);
                        return output;
                    }
                }
                else if (left.length === 0 || right.length === 0) {
                    const subgroup = right.length === 0 ? [...left, ...inline] : [...inline, ...right];
                    if (NodeList.linearY(subgroup)) {
                        output = this.writeLinearLayout(group, parent, false);
                        group.alignmentType |= NODE_ALIGNMENT.VERTICAL;
                        return output;
                    }
                    else {
                        if (Application.isRelativeHorizontal(subgroup, cleared)) {
                            output = this.writeRelativeLayout(group, parent);
                            group.alignmentType |= NODE_ALIGNMENT.HORIZONTAL;
                            if (right.length > 0) {
                                group.alignmentType |= NODE_ALIGNMENT.RIGHT;
                            }
                            return output;
                        }
                        else if (right.length === 0) {
                            if (!this.settings.floatOverlapDisabled) {
                                output = this.writeLinearLayout(group, parent, true);
                                layers = [left, inline];
                                group.alignmentType |= NODE_ALIGNMENT.FLOAT;
                            }
                        }
                    }
                }
            }
            const inlineAbove = [];
            const inlineBelow = [];
            const leftAbove = [];
            const rightAbove = [];
            const leftBelow = [];
            const rightBelow = [];
            let leftSub = [];
            let rightSub = [];
            if (layers.length === 0) {
                let current = '';
                let pendingFloat = 0;
                for (let i = 0; i < nodes.length; i++) {
                    const node = nodes[i];
                    if (cleared.has(node)) {
                        const clear = cleared.get(node);
                        if (hasBit(pendingFloat, clear === 'right' ? 4 : 2) || (pendingFloat !== 0 && clear === 'both')) {
                            switch (clear) {
                                case 'left':
                                    pendingFloat ^= 2;
                                    current = 'left';
                                    break;
                                case 'right':
                                    pendingFloat ^= 4;
                                    current = 'right';
                                    break;
                                case 'both':
                                    switch (pendingFloat) {
                                        case 2:
                                            current = 'left';
                                            break;
                                        case 4:
                                            current = 'right';
                                            break;
                                        default:
                                            current = 'both';
                                            break;
                                    }
                                    pendingFloat = 0;
                                    break;
                            }
                        }
                    }
                    if (current === '') {
                        if (node.floating) {
                            if (node.float === 'right') {
                                rightAbove.push(node);
                                if (node.floating) {
                                    pendingFloat |= 4;
                                }
                            }
                            else {
                                leftAbove.push(node);
                                if (node.floating) {
                                    pendingFloat |= 2;
                                }
                            }
                        }
                        else if (node.autoMargin) {
                            if (node.autoMarginLeft) {
                                if (rightAbove.length > 0) {
                                    rightBelow.push(node);
                                }
                                else {
                                    rightAbove.push(node);
                                }
                            }
                            else if (node.autoMarginRight) {
                                if (leftAbove.length > 0) {
                                    leftBelow.push(node);
                                }
                                else {
                                    leftAbove.push(node);
                                }
                            }
                            else {
                                if (inlineAbove.length > 0) {
                                    if (leftAbove.length === 0) {
                                        leftAbove.push(node);
                                    }
                                    else {
                                        rightAbove.push(node);
                                    }
                                }
                                else {
                                    inlineAbove.push(node);
                                }
                            }
                        }
                        else {
                            inlineAbove.push(node);
                        }
                    }
                    else {
                        if (node.floating) {
                            if (node.float === 'right') {
                                if (rightBelow.length === 0) {
                                    pendingFloat |= 4;
                                }
                                if (!this.settings.floatOverlapDisabled && current !== 'right' && rightAbove.length > 0) {
                                    rightAbove.push(node);
                                }
                                else {
                                    rightBelow.push(node);
                                }
                            }
                            else {
                                if (leftBelow.length === 0) {
                                    pendingFloat |= 2;
                                }
                                if (!this.settings.floatOverlapDisabled && current !== 'left' && leftAbove.length > 0) {
                                    leftAbove.push(node);
                                }
                                else {
                                    leftBelow.push(node);
                                }
                            }
                        }
                        else if (node.autoMargin) {
                            if (node.autoMarginLeft && rightBelow.length > 0) {
                                rightBelow.push(node);
                            }
                            else if (node.autoMarginRight && leftBelow.length > 0) {
                                leftBelow.push(node);
                            }
                            else {
                                inlineBelow.push(node);
                            }
                        }
                        else {
                            switch (current) {
                                case 'left':
                                    leftBelow.push(node);
                                    break;
                                case 'right':
                                    rightBelow.push(node);
                                    break;
                                default:
                                    inlineBelow.push(node);
                                    break;
                            }
                        }
                    }
                }
                if (leftAbove.length > 0 && leftBelow.length > 0) {
                    leftSub = [leftAbove, leftBelow];
                    if (leftBelow.length > 1) {
                        leftBelow[0].alignmentType |= NODE_ALIGNMENT.EXTENDABLE;
                    }
                }
                else if (leftAbove.length > 0) {
                    leftSub = leftAbove;
                }
                else if (leftBelow.length > 0) {
                    leftSub = leftBelow;
                }
                if (rightAbove.length > 0 && rightBelow.length > 0) {
                    rightSub = [rightAbove, rightBelow];
                    if (rightBelow.length > 1) {
                        rightBelow[0].alignmentType |= NODE_ALIGNMENT.EXTENDABLE;
                    }
                }
                else if (rightAbove.length > 0) {
                    rightSub = rightAbove;
                }
                else if (rightBelow.length > 0) {
                    rightSub = rightBelow;
                }
                if (this.settings.floatOverlapDisabled) {
                    if (parent.linearVertical) {
                        output = formatPlaceholder(group.id);
                        group.render(parent);
                        group.renderDepth--;
                    }
                    else {
                        output = this.writeLinearLayout(group, parent, false);
                    }
                    layers.push(inlineAbove, [leftAbove, rightAbove], inlineBelow);
                }
                else {
                    if (inlineAbove.length === 0 &&
                        (leftSub.length === 0 || rightSub.length === 0)) {
                        output = this.writeLinearLayout(group, parent, false);
                        if (rightSub.length > 0) {
                            group.alignmentType |= NODE_ALIGNMENT.RIGHT;
                        }
                    }
                    else {
                        output = this.writeFrameLayout(group, parent, true);
                    }
                    if (inlineAbove.length > 0) {
                        if (rightBelow.length > 0) {
                            leftSub = [inlineAbove, leftAbove];
                            layers.push(leftSub, rightSub);
                        }
                        else if (leftBelow.length > 0) {
                            rightSub = [inlineAbove, rightAbove];
                            layers.push(rightSub, leftSub);
                        }
                        else {
                            layers.push(inlineAbove, leftSub, rightSub);
                        }
                        if (inlineAbove.length > 1) {
                            inlineAbove[0].alignmentType |= NODE_ALIGNMENT.EXTENDABLE;
                        }
                    }
                    else {
                        if ((leftSub === leftBelow && rightSub === rightAbove) || (leftSub === leftAbove && rightSub === rightBelow)) {
                            if (leftBelow.length === 0) {
                                layers.push([leftAbove, rightBelow]);
                            }
                            else {
                                layers.push([rightAbove, leftBelow]);
                            }
                        }
                        else {
                            layers.push(leftSub, rightSub);
                        }
                    }
                    layers = layers.filter(item => item && item.length > 0);
                }
                group.alignmentType |= NODE_ALIGNMENT.FLOAT;
            }
            if (layers.length > 0) {
                let floatgroup;
                layers.forEach((item, index) => {
                    if (Array.isArray(item[0])) {
                        const grouping = [];
                        item.forEach(list => grouping.push(...list));
                        grouping.sort(NodeList.siblingIndex);
                        if (this.settings.floatOverlapDisabled) {
                            floatgroup = this.viewController.createGroup(group, grouping[0], grouping);
                            output = replacePlaceholder(output, group.id, this.writeFrameLayout(floatgroup, group, true));
                        }
                        else {
                            if (group.linearVertical) {
                                floatgroup = group;
                            }
                            else {
                                floatgroup = this.viewController.createGroup(group, grouping[0], grouping);
                                output = replacePlaceholder(output, group.id, this.writeLinearLayout(floatgroup, group, false));
                                if (item.some(list => list === rightSub || list === rightAbove)) {
                                    floatgroup.alignmentType |= NODE_ALIGNMENT.RIGHT;
                                }
                            }
                        }
                        floatgroup.alignmentType |= NODE_ALIGNMENT.FLOAT;
                    }
                    else {
                        floatgroup = undefined;
                    }
                    (Array.isArray(item[0]) ? item : [item]).forEach(section => {
                        let basegroup = group;
                        if (floatgroup && [inlineAbove, leftAbove, leftBelow, rightAbove, rightBelow].includes(section)) {
                            basegroup = floatgroup;
                        }
                        if (section.length > 1) {
                            let groupOutput = '';
                            const subgroup = this.viewController.createGroup(basegroup, section[0], section);
                            const floatLeft = section.some(node => node.float === 'left');
                            const floatRight = section.some(node => node.float === 'right');
                            if (Application.isRelativeHorizontal(section, NodeList.cleared(section))) {
                                groupOutput = this.writeRelativeLayout(subgroup, basegroup);
                                subgroup.alignmentType |= NODE_ALIGNMENT.HORIZONTAL;
                            }
                            else {
                                groupOutput = this.writeLinearLayout(subgroup, basegroup, NodeList.linearX(section));
                                if (floatRight && subgroup.some(node => node.marginLeft < 0)) {
                                    const sorted = [];
                                    let marginRight = 0;
                                    subgroup.duplicate().forEach((node) => {
                                        let prepend = false;
                                        if (marginRight < 0) {
                                            if (Math.abs(marginRight) > node.bounds.width) {
                                                marginRight += node.bounds.width;
                                                node.modifyBox(BOX_STANDARD.MARGIN_RIGHT, node.bounds.width * -1, true);
                                                prepend = true;
                                            }
                                            else {
                                                if (Math.abs(marginRight) >= node.marginRight) {
                                                    node.modifyBox(BOX_STANDARD.MARGIN_RIGHT, Math.ceil(Math.abs(marginRight) - node.marginRight));
                                                    node.modifyBox(BOX_STANDARD.MARGIN_RIGHT, null);
                                                }
                                                else {
                                                    node.modifyBox(BOX_STANDARD.MARGIN_RIGHT, marginRight, true);
                                                }
                                            }
                                        }
                                        if (node.marginLeft < 0) {
                                            marginRight += Math.max(node.marginLeft, node.bounds.width * -1);
                                            node.modifyBox(BOX_STANDARD.MARGIN_LEFT, null);
                                        }
                                        if (prepend) {
                                            sorted.splice(sorted.length - 1, 0, node);
                                        }
                                        else {
                                            sorted.push(node);
                                        }
                                    });
                                    subgroup.replace(sorted.reverse());
                                    this.preserveRenderPosition(subgroup);
                                }
                            }
                            subgroup.alignmentType |= NODE_ALIGNMENT.SEGMENTED;
                            if (floatLeft || floatRight) {
                                subgroup.alignmentType |= NODE_ALIGNMENT.FLOAT;
                                if (floatRight) {
                                    subgroup.alignmentType |= NODE_ALIGNMENT.RIGHT;
                                }
                            }
                            output = replacePlaceholder(output, basegroup.id, groupOutput);
                            basegroup.appendRendered(subgroup);
                        }
                        else if (section.length > 0) {
                            const single = section[0];
                            single.alignmentType |= NODE_ALIGNMENT.SINGLE;
                            if (single.float === 'right') {
                                single.alignmentType |= NODE_ALIGNMENT.RIGHT;
                            }
                            single.renderPosition = index;
                            output = replacePlaceholder(output, basegroup.id, `{:${basegroup.id}:${index}}`);
                            basegroup.appendRendered(single);
                        }
                    });
                });
            }
            return output;
        }
        writeFrameLayoutVertical(group, parent, nodes, cleared) {
            let output = '';
            if (group) {
                output = this.writeLinearLayout(group, parent, false);
                group.alignmentType |= NODE_ALIGNMENT.VERTICAL;
            }
            else {
                group = parent;
                output = formatPlaceholder(group.id);
            }
            const rowsCurrent = [];
            const rowsFloated = [];
            const current = [];
            const floated = [];
            let leadingMargin = 0;
            let clearReset = false;
            let linearVertical = true;
            nodes.some(node => {
                if (!node.floating) {
                    leadingMargin += node.linear.height;
                    return true;
                }
                return false;
            });
            for (const node of nodes) {
                if (cleared.has(node)) {
                    if (!node.floating) {
                        node.modifyBox(BOX_STANDARD.MARGIN_TOP, null);
                        rowsCurrent.push(current.slice());
                        current.length = 0;
                        rowsFloated.push(floated.slice());
                        floated.length = 0;
                    }
                    else {
                        clearReset = true;
                    }
                }
                if (node.floating) {
                    floated.push(node);
                }
                else {
                    if (clearReset && !cleared.has(node)) {
                        linearVertical = false;
                    }
                    current.push(node);
                }
            }
            if (floated.length > 0) {
                rowsFloated.push(floated);
            }
            if (current.length > 0) {
                rowsCurrent.push(current);
            }
            if (!linearVertical) {
                let content = '';
                for (let i = 0; i < Math.max(rowsFloated.length, rowsCurrent.length); i++) {
                    const floating = rowsFloated[i] || [];
                    const pageflow = rowsCurrent[i] || [];
                    if (pageflow.length > 0 || floating.length > 0) {
                        const baseNode = floating[0] || pageflow[0];
                        const basegroup = this.viewController.createGroup(group, baseNode, []);
                        const children = [];
                        let subgroup;
                        if (floating.length > 1) {
                            subgroup = this.viewController.createGroup(basegroup, floating[0], floating);
                            basegroup.alignmentType |= NODE_ALIGNMENT.FLOAT;
                        }
                        else if (floating.length > 0) {
                            subgroup = floating[0];
                            subgroup.parent = basegroup;
                            basegroup.alignmentType |= NODE_ALIGNMENT.FLOAT;
                        }
                        if (subgroup) {
                            children.push(subgroup);
                            if (i === 0 && leadingMargin > 0) {
                                subgroup.modifyBox(BOX_STANDARD.MARGIN_TOP, leadingMargin);
                            }
                            subgroup = undefined;
                        }
                        if (pageflow.length > 1) {
                            subgroup = this.viewController.createGroup(basegroup, pageflow[0], pageflow);
                        }
                        else if (pageflow.length > 0) {
                            subgroup = pageflow[0];
                            subgroup.parent = basegroup;
                        }
                        if (subgroup) {
                            children.push(subgroup);
                        }
                        basegroup.init();
                        content += this.writeFrameLayout(basegroup, group, true);
                        basegroup.alignmentType |= NODE_ALIGNMENT.VERTICAL;
                        children.forEach((node, index) => {
                            if (nodes.includes(node)) {
                                content = replacePlaceholder(content, basegroup.id, `{:${basegroup.id}:${index}}`);
                            }
                            else {
                                content = replacePlaceholder(content, basegroup.id, this.writeLinearLayout(node, basegroup, false));
                                node.alignmentType |= NODE_ALIGNMENT.SEGMENTED;
                            }
                        });
                    }
                }
                output = replacePlaceholder(output, group.id, content);
            }
            return output;
        }
        processRenderQueue() {
            for (const ext of this.extensions) {
                for (const node of ext.subscribers) {
                    ext.setTarget(node);
                    ext.beforeInsert();
                }
            }
            const template = {};
            for (const id in this.renderQueue) {
                const [nodeId] = id.split(':');
                let replaceId = nodeId;
                if (!isNumber(replaceId)) {
                    const target = Node.getNodeFromElement(document.getElementById(replaceId));
                    if (target) {
                        replaceId = target.id.toString();
                    }
                }
                let output = this.renderQueue[id].join('\n');
                if (replaceId !== nodeId) {
                    const target = this.cacheSession.find('id', parseInt(replaceId));
                    if (target) {
                        const depth = target.renderDepth + 1;
                        output = replaceIndent(output, depth);
                        const pattern = /{@(\d+)}/g;
                        let match = null;
                        let i = 0;
                        while ((match = pattern.exec(output)) != null) {
                            const node = this.cacheSession.find('id', parseInt(match[1]));
                            if (node) {
                                if (i++ === 0) {
                                    node.renderDepth = depth;
                                }
                                else {
                                    node.renderDepth = node.parent.renderDepth + 1;
                                }
                            }
                        }
                    }
                }
                template[replaceId] = output;
            }
            for (const inner in template) {
                for (const outer in template) {
                    if (inner !== outer) {
                        template[inner] = template[inner].replace(formatPlaceholder(outer), template[outer]);
                        template[outer] = template[outer].replace(formatPlaceholder(inner), template[inner]);
                    }
                }
            }
            for (const value of this.layouts) {
                for (const id in template) {
                    value.content = value.content.replace(formatPlaceholder(id), template[id]);
                }
                value.content = this.viewController.replaceRenderQueue(value.content);
            }
            for (const ext of this.extensions) {
                for (const node of ext.subscribers) {
                    ext.setTarget(node);
                    ext.afterInsert();
                }
            }
        }
        addLayoutFile(pathname, filename, content, documentRoot = false) {
            pathname = pathname || this.viewController.localSettings.layout.pathName;
            const layout = {
                pathname,
                filename,
                content
            };
            if (documentRoot && this._views.length > 0 && this._views[0].content === '') {
                this._views[0] = layout;
                this._currentIndex = 0;
            }
            else {
                this.layoutProcessing = layout;
            }
        }
        addIncludeFile(filename, content) {
            this._includes.push({
                pathname: this.viewController.localSettings.layout.pathName,
                filename,
                content
            });
        }
        addRenderQueue(id, views) {
            if (this.renderQueue[id] == null) {
                this.renderQueue[id] = [];
            }
            this.renderQueue[id].push(...views);
        }
        preserveRenderPosition(node) {
            this._renderPosition[node.id.toString()] = node.map(item => item.id);
        }
        insertNode(element, parent) {
            let node;
            if (element.nodeName.charAt(0) === '#') {
                if (element.nodeName === '#text') {
                    if (isPlainText(element, true) || cssParent(element, 'whiteSpace', 'pre', 'pre-wrap')) {
                        node = new this.nodeObject(this.cacheProcessing.nextId, element, this.viewController.delegateNodeInit);
                        node.nodeName = 'PLAINTEXT';
                        if (parent) {
                            node.parent = parent;
                            node.inherit(parent, 'style');
                        }
                        else {
                            node.css('whiteSpace', getStyle(element.parentElement).whiteSpace || 'normal');
                        }
                        node.css({
                            position: 'static',
                            display: 'inline',
                            clear: 'none',
                            cssFloat: 'none',
                            verticalAlign: 'baseline'
                        });
                    }
                }
            }
            else if (isStyleElement(element)) {
                const elementNode = new this.nodeObject(this.cacheProcessing.nextId, element, this.viewController.delegateNodeInit);
                if (isElementVisible(element, this.settings.hideOffScreenElements)) {
                    node = elementNode;
                    node.setExclusions();
                }
                else {
                    elementNode.excluded = true;
                    elementNode.visible = false;
                }
            }
            if (node) {
                this.cacheProcessing.append(node);
            }
            return node;
        }
        getExtension(name) {
            return this.extensions.find(item => item.name === name);
        }
        toString() {
            return this._views.length > 0 ? this._views[0].content : '';
        }
        setStyleMap() {
            let warning = false;
            const clientFirefox = isUserAgent(USER_AGENT.FIREFOX);
            for (let i = 0; i < document.styleSheets.length; i++) {
                const styleSheet = document.styleSheets[i];
                if (styleSheet.cssRules) {
                    for (let j = 0; j < styleSheet.cssRules.length; j++) {
                        try {
                            const rule = styleSheet.cssRules[j];
                            const attrs = new Set();
                            Array.from(rule.style).forEach(value => attrs.add(convertCamelCase(value)));
                            Array.from(document.querySelectorAll(rule.selectorText)).forEach((element) => {
                                Array.from(element.style).forEach(value => attrs.add(convertCamelCase(value)));
                                const style = getStyle(element);
                                const styleMap = {};
                                for (const attr of attrs) {
                                    const value = rule.style[attr];
                                    if (element.style[attr]) {
                                        styleMap[attr] = element.style[attr];
                                    }
                                    else if (style[attr] === value) {
                                        styleMap[attr] = style[attr];
                                    }
                                    else if (value) {
                                        switch (attr) {
                                            case 'fontSize':
                                                styleMap[attr] = style[attr] || value;
                                                break;
                                            case 'width':
                                            case 'height':
                                            case 'lineHeight':
                                            case 'verticalAlign':
                                            case 'textIndent':
                                            case 'columnGap':
                                            case 'top':
                                            case 'right':
                                            case 'bottom':
                                            case 'left':
                                            case 'marginTop':
                                            case 'marginRight':
                                            case 'marginBottom':
                                            case 'marginLeft':
                                            case 'paddingTop':
                                            case 'paddingRight':
                                            case 'paddingBottom':
                                            case 'paddingLeft':
                                                styleMap[attr] = /^[A-Za-z\-]+$/.test(value) || isPercent(value) ? value : convertPX(value, style.fontSize);
                                                break;
                                            default:
                                                if (styleMap[attr] == null) {
                                                    styleMap[attr] = value;
                                                }
                                                break;
                                        }
                                    }
                                }
                                if (this.settings.preloadImages && hasValue(styleMap.backgroundImage) && styleMap.backgroundImage !== 'initial') {
                                    styleMap.backgroundImage.split(',')
                                        .map((value) => value.trim())
                                        .forEach(value => {
                                        const uri = cssResolveUrl(value);
                                        if (uri !== '' && !this.cacheImage.has(uri)) {
                                            this.cacheImage.set(uri, { width: 0, height: 0, uri });
                                        }
                                    });
                                }
                                if (clientFirefox && styleMap.display == null) {
                                    switch (element.tagName) {
                                        case 'INPUT':
                                        case 'TEXTAREA':
                                        case 'SELECT':
                                        case 'BUTTON':
                                            styleMap.display = 'inline-block';
                                            break;
                                    }
                                }
                                const data = getElementCache(element, 'styleMap');
                                if (data) {
                                    Object.assign(data, styleMap);
                                }
                                else {
                                    setElementCache(element, 'style', style);
                                    setElementCache(element, 'styleMap', styleMap);
                                }
                            });
                        }
                        catch (error) {
                            if (!warning) {
                                alert('External CSS files cannot be parsed with Chrome 64+ when loading HTML pages directly from your hard drive [file://]. ' +
                                    'Either use a local web server [http://], embed your CSS into a &lt;style&gt; element, or use a different browser. ' +
                                    'See the README for more detailed instructions.\n\n' +
                                    `${styleSheet.href}\n\n${error}`);
                                warning = true;
                            }
                        }
                    }
                }
            }
        }
        set appName(value) {
            if (this.resourceHandler) {
                this.resourceHandler.file.appName = value;
            }
        }
        get appName() {
            return this.resourceHandler ? this.resourceHandler.file.appName : '';
        }
        set settings(value) {
            if (typeof value !== 'object') {
                value = {};
            }
            this._settings = value;
            if (this.viewController) {
                this.viewController.settings = value;
            }
            if (this.resourceHandler) {
                this.resourceHandler.settings = value;
            }
        }
        get settings() {
            return this._settings;
        }
        set layoutProcessing(value) {
            this._currentIndex = this._views.length;
            this._views.push(value);
        }
        get layoutProcessing() {
            return this._views[this._currentIndex];
        }
        get layouts() {
            return [...this._views, ...this._includes];
        }
        get viewData() {
            return {
                cache: this.cacheSession,
                views: this._views,
                includes: this._includes
            };
        }
        get size() {
            return this._views.length + this._includes.length;
        }
    }

    class Controller {
        constructor() {
            this._before = {};
            this._after = {};
        }
        reset() {
            this._before = {};
            this._after = {};
        }
        replaceRenderQueue(output) {
            for (const id in this._before) {
                output = output.replace(`{<${id}}`, this._before[id].join(''));
            }
            for (const id in this._after) {
                output = output.replace(`{>${id}}`, this._after[id].join(''));
            }
            return output;
        }
        prependBefore(id, output, index = -1) {
            if (this._before[id] == null) {
                this._before[id] = [];
            }
            if (index !== -1 && index < this._before[id].length) {
                this._before[id].splice(index, 0, output);
            }
            else {
                this._before[id].push(output);
            }
        }
        appendAfter(id, output, index = -1) {
            if (this._after[id] == null) {
                this._after[id] = [];
            }
            if (index !== -1 && index < this._after[id].length) {
                this._after[id].splice(index, 0, output);
            }
            else {
                this._after[id].push(output);
            }
        }
        hasAppendProcessing(id) {
            return this._before[id] != null || this._after[id] != null;
        }
    }

    class Resource {
        constructor(file) {
            this.file = file;
            this.imageAssets = new Map();
            this.file.stored = Resource.STORED;
        }
        static insertStoredAsset(asset, name, value) {
            const stored = Resource.STORED[asset];
            if (stored) {
                let storedName = '';
                for (const [storedKey, storedValue] of stored.entries()) {
                    if (JSON.stringify(value) === JSON.stringify(storedValue)) {
                        storedName = storedKey;
                        break;
                    }
                }
                if (storedName === '') {
                    if (isNumber(name)) {
                        name = `__${name}`;
                    }
                    if (hasValue(value)) {
                        let i = 0;
                        do {
                            storedName = name;
                            if (i > 0) {
                                storedName += `_${i}`;
                            }
                            if (!stored.has(storedName)) {
                                stored.set(storedName, value);
                            }
                            i++;
                        } while (stored.has(storedName) && stored.get(storedName) !== value);
                    }
                }
                return storedName;
            }
            return '';
        }
        static isBorderVisible(border) {
            return border != null && !(border.style === 'none' || convertPX(border.width) === '0px' || border.color === '' || (border.color.length === 9 && border.color.endsWith('00')));
        }
        static hasDrawableBackground(object) {
            return (object != null && (this.isBorderVisible(object.borderTop) ||
                this.isBorderVisible(object.borderRight) ||
                this.isBorderVisible(object.borderBottom) ||
                this.isBorderVisible(object.borderLeft) ||
                object.borderRadius.length > 0 ||
                (Array.isArray(object.backgroundImage) && object.backgroundImage.length > 0)));
        }
        addFile(pathname, filename, content = '', uri = '') {
            this.file.addFile(pathname, filename, content, uri);
        }
        reset() {
            for (const name in Resource.STORED) {
                Resource.STORED[name] = new Map();
            }
            this.file.reset();
        }
        setBoxStyle() {
            for (const node of this.cache.elements) {
                if (this.checkPermissions(node, NODE_RESOURCE.BOX_STYLE, 'boxStyle')) {
                    const boxStyle = {
                        background: null,
                        borderTop: null,
                        borderRight: null,
                        borderBottom: null,
                        borderLeft: null,
                        borderRadius: null,
                        backgroundColor: null,
                        backgroundSize: null,
                        backgroundImage: null,
                        backgroundRepeat: null,
                        backgroundPositionX: null,
                        backgroundPositionY: null
                    };
                    for (const attr in boxStyle) {
                        const value = node.css(attr);
                        switch (attr) {
                            case 'borderTop':
                            case 'borderRight':
                            case 'borderBottom':
                            case 'borderLeft': {
                                let cssColor = node.css(`${attr}Color`);
                                switch (cssColor.toLowerCase()) {
                                    case 'initial':
                                        cssColor = '#000000';
                                        break;
                                    case 'inherit':
                                    case 'currentcolor':
                                        cssColor = cssInherit(node.element, `${attr}Color`);
                                        break;
                                }
                                let width = node.css(`${attr}Width`) || '1px';
                                const style = node.css(`${attr}Style`) || 'none';
                                if (style === 'inset' && width === '0px') {
                                    width = '1px';
                                }
                                const color = parseRGBA(cssColor, node.css('opacity'));
                                boxStyle[attr] = {
                                    width,
                                    style,
                                    color: style !== 'none' && color ? color.valueRGBA : ''
                                };
                                break;
                            }
                            case 'borderRadius': {
                                const [top, right, bottom, left] = [
                                    node.css('borderTopLeftRadius'),
                                    node.css('borderTopRightRadius'),
                                    node.css('borderBottomLeftRadius'),
                                    node.css('borderBottomRightRadius')
                                ];
                                if (top === right && right === bottom && bottom === left) {
                                    boxStyle.borderRadius = convertInt(top) === 0 ? [] : [top];
                                }
                                else {
                                    boxStyle.borderRadius = [top, right, bottom, left];
                                }
                                break;
                            }
                            case 'backgroundColor': {
                                if (!node.has('backgroundColor') && (value === node.cssParent('backgroundColor', false, true) || node.documentParent.visible && cssFromParent(node.element, 'backgroundColor'))) {
                                    boxStyle.backgroundColor = '';
                                }
                                else {
                                    const color = parseRGBA(value, node.css('opacity'));
                                    boxStyle.backgroundColor = color ? color.valueRGBA : '';
                                }
                                break;
                            }
                            case 'backgroundSize': {
                                let result = [];
                                if (value !== 'auto' && value !== 'auto auto' && value !== 'initial' && value !== '0px') {
                                    const match = value.match(/^(?:([\d.]+(?:px|pt|em|%)|auto)\s*)+$/);
                                    const fontSize = node.css('fontSize');
                                    if (match) {
                                        if (match[1] === 'auto' || match[2] === 'auto') {
                                            result = [match[1] === 'auto' ? '' : convertPX(match[1], fontSize), match[2] === 'auto' ? '' : convertPX(match[2], fontSize)];
                                        }
                                        else if (isPercent(match[1]) && match[3] == null) {
                                            result = [match[1], match[2]];
                                        }
                                        else if (match[2] == null || (match[1] === match[2] && match[1] === match[3] && match[1] === match[4])) {
                                            result = [convertPX(match[1], fontSize)];
                                        }
                                        else if (match[3] == null || (match[1] === match[3] && match[2] === match[4])) {
                                            result = [convertPX(match[1], fontSize), convertPX(match[2], fontSize)];
                                        }
                                        else {
                                            result = [convertPX(match[1], fontSize), convertPX(match[2], fontSize), convertPX(match[3], fontSize), convertPX(match[4], fontSize)];
                                        }
                                    }
                                }
                                boxStyle.backgroundSize = result;
                                break;
                            }
                            case 'background':
                            case 'backgroundImage': {
                                if (value !== 'none' && !node.hasBit('excludeResource', NODE_RESOURCE.IMAGE_SOURCE)) {
                                    function colorStop(parse) {
                                        return `${parse ? '' : '(?:'},?\\s*(${parse ? '' : '?:'}rgba?\\(\\d+, \\d+, \\d+(?:, [\\d.]+)?\\)|[a-z]+)\\s*(${parse ? '' : '?:'}\\d+%)?${parse ? '' : ')'}`;
                                    }
                                    const gradients = [];
                                    let pattern = new RegExp(`([a-z\-]+)-gradient\\(([\\w\\s%]+)?(${colorStop(false)}+)\\)`, 'g');
                                    let match = null;
                                    while ((match = pattern.exec(value)) != null) {
                                        let gradient;
                                        if (match[1] === 'linear') {
                                            gradient = {
                                                type: 'linear',
                                                x1: 0,
                                                y1: 0,
                                                x2: 0,
                                                y2: 0,
                                                angle: (() => {
                                                    switch (match[2]) {
                                                        case 'to top':
                                                            return 0;
                                                        case 'to right top':
                                                            return 45;
                                                        case 'to right':
                                                            return 90;
                                                        case 'to right bottom':
                                                            return 135;
                                                        case 'to bottom':
                                                            return 180;
                                                        case 'to left bottom':
                                                            return 225;
                                                        case 'to left':
                                                            return 270;
                                                        case 'to left top':
                                                            return 315;
                                                        default:
                                                            return convertInt(match[2]);
                                                    }
                                                })(),
                                                colorStop: []
                                            };
                                        }
                                        else {
                                            gradient = {
                                                type: 'radial',
                                                cx: 0,
                                                cy: 0,
                                                r: 0,
                                                shapePosition: (() => {
                                                    const result = ['ellipse', 'center'];
                                                    if (match[2]) {
                                                        const shape = match[2].split('at').map(item => item.trim());
                                                        switch (shape[0]) {
                                                            case 'ellipse':
                                                            case 'circle':
                                                            case 'closest-side':
                                                            case 'closest-corner':
                                                            case 'farthest-side':
                                                            case 'farthest-corner':
                                                                result[0] = shape[0];
                                                                break;
                                                            default:
                                                                result[1] = shape[0];
                                                                break;
                                                        }
                                                        if (shape[1]) {
                                                            result[1] = shape[1];
                                                        }
                                                    }
                                                    return result;
                                                })(),
                                                colorStop: []
                                            };
                                        }
                                        const stopMatch = match[3].trim().split(new RegExp(colorStop(true), 'g'));
                                        const opacity = node.css('opacity');
                                        for (let i = 0; i < stopMatch.length; i += 3) {
                                            const rgba = stopMatch[i + 1];
                                            if (isString(rgba)) {
                                                const color = parseRGBA(stopMatch[i + 1], rgba.startsWith('rgba') ? undefined : opacity);
                                                if (color && color.visible) {
                                                    gradient.colorStop.push({
                                                        color: color.valueRGBA,
                                                        offset: stopMatch[i + 2],
                                                        opacity: color.alpha
                                                    });
                                                }
                                            }
                                        }
                                        if (gradient.colorStop.length > 1) {
                                            gradients.push(gradient);
                                        }
                                    }
                                    if (gradients.length > 0) {
                                        boxStyle.backgroundGradient = gradients.reverse();
                                    }
                                    else {
                                        const images = [];
                                        pattern = new RegExp(DOM_REGEX.CSS_URL, 'g');
                                        match = null;
                                        while ((match = pattern.exec(value)) != null) {
                                            if (match) {
                                                images.push(match[0]);
                                            }
                                        }
                                        boxStyle.backgroundImage = images;
                                    }
                                }
                                break;
                            }
                            case 'backgroundRepeat':
                            case 'backgroundPositionX':
                            case 'backgroundPositionY': {
                                boxStyle[attr] = value;
                                break;
                            }
                        }
                    }
                    const borderTop = JSON.stringify(boxStyle.borderTop);
                    if (borderTop === JSON.stringify(boxStyle.borderRight) &&
                        borderTop === JSON.stringify(boxStyle.borderBottom) &&
                        borderTop === JSON.stringify(boxStyle.borderLeft)) {
                        boxStyle.border = boxStyle.borderTop;
                    }
                    setElementCache(node.element, 'boxStyle', boxStyle);
                }
            }
        }
        setFontStyle() {
            for (const node of this.cache) {
                if (this.checkPermissions(node, NODE_RESOURCE.FONT_STYLE, 'fontStyle')) {
                    const backgroundImage = Resource.hasDrawableBackground(getElementCache(node.element, 'boxStyle'));
                    if (!(node.renderChildren.length > 0 || node.imageElement || node.tagName === 'HR' || (node.inlineText && !backgroundImage && !node.preserveWhiteSpace && node.element.innerHTML.trim() === ''))) {
                        const opacity = node.css('opacity');
                        const color = parseRGBA(node.css('color'), opacity);
                        let backgroundColor;
                        if (!(backgroundImage ||
                            (node.cssParent('backgroundColor', false, true) === node.css('backgroundColor') && (node.plainText || node.style.backgroundColor !== node.styleMap.backgroundColor)) ||
                            (!node.has('backgroundColor') && node.documentParent.visible && cssFromParent(node.element, 'backgroundColor')))) {
                            backgroundColor = parseRGBA(node.css('backgroundColor'), opacity);
                        }
                        let fontFamily = node.css('fontFamily');
                        let fontSize = node.css('fontSize');
                        let fontWeight = node.css('fontWeight');
                        if (isUserAgent(USER_AGENT.EDGE) && !node.has('fontFamily')) {
                            switch (node.tagName) {
                                case 'TT':
                                case 'CODE':
                                case 'KBD':
                                case 'SAMP':
                                    fontFamily = 'monospace';
                                    break;
                            }
                        }
                        if (convertInt(fontSize) === 0) {
                            switch (fontSize) {
                                case 'xx-small':
                                    fontSize = '8px';
                                    break;
                                case 'x-small':
                                    fontSize = '10px';
                                    break;
                                case 'small':
                                    fontSize = '13px';
                                    break;
                                case 'medium':
                                    fontSize = '16px';
                                    break;
                                case 'large':
                                    fontSize = '18px';
                                    break;
                                case 'x-large':
                                    fontSize = '24px';
                                    break;
                                case 'xx-large':
                                    fontSize = '32px';
                                    break;
                            }
                        }
                        if (!isNumber(fontWeight)) {
                            switch (fontWeight) {
                                case 'lighter':
                                    fontWeight = '200';
                                    break;
                                case 'bold':
                                    fontWeight = '700';
                                    break;
                                case 'bolder':
                                    fontWeight = '900';
                                    break;
                                default:
                                    fontWeight = '400';
                                    break;
                            }
                        }
                        const result = {
                            fontFamily,
                            fontStyle: node.css('fontStyle'),
                            fontSize,
                            fontWeight,
                            color: color ? color.valueRGBA : '',
                            backgroundColor: backgroundColor ? backgroundColor.valueRGBA : ''
                        };
                        setElementCache(node.element, 'fontStyle', result);
                    }
                }
            }
        }
        setBoxSpacing() {
            for (const node of this.cache.elements) {
                if (this.checkPermissions(node, NODE_RESOURCE.BOX_SPACING, 'boxSpacing')) {
                    const boxSpacing = getBoxSpacing(node.element);
                    const result = {};
                    for (const attr in boxSpacing) {
                        if (node.inlineStatic && (attr === 'marginTop' || attr === 'marginBottom')) {
                            result[attr] = '0px';
                        }
                        else {
                            result[attr] = convertPX(boxSpacing[attr], node.css('fontSize'));
                        }
                    }
                    setElementCache(node.element, 'boxSpacing', result);
                }
            }
        }
        setValueString() {
            function replaceWhiteSpace(node, value) {
                if (node.multiLine && !node.renderParent.linearVertical) {
                    value = value.replace(/^\s*\n/, '');
                }
                switch (node.css('whiteSpace')) {
                    case 'nowrap':
                        value = value.replace(/\n/g, ' ');
                        break;
                    case 'pre':
                    case 'pre-wrap':
                        if (!node.renderParent.linearVertical) {
                            value = value.replace(/^\n/, '');
                        }
                        value = value.replace(/\n/g, '\\n');
                        value = value.replace(/\s/g, '&#160;');
                        break;
                    case 'pre-line':
                        value = value.replace(/\n/g, '\\n');
                        value = value.replace(/\s+/g, ' ');
                        break;
                    default:
                        if (isLineBreak(node.element.previousSibling)) {
                            value = value.replace(/^\s+/, '');
                        }
                        if (isLineBreak(node.element.nextSibling)) {
                            value = value.replace(/\s+$/, '');
                        }
                        return [value, false];
                }
                return [value, true];
            }
            for (const node of this.cache.visible) {
                const element = node.element;
                if (this.checkPermissions(node, NODE_RESOURCE.VALUE_STRING, 'valueString')) {
                    let name = '';
                    let value = '';
                    let inlineTrim = false;
                    let performTrim = true;
                    if (element instanceof HTMLInputElement) {
                        switch (element.type) {
                            case 'text':
                            case 'number':
                            case 'email':
                            case 'search':
                            case 'submit':
                            case 'reset':
                            case 'button':
                                value = element.value.trim();
                                break;
                            default:
                                if (node.companion && !node.companion.visible) {
                                    value = node.companion.textContent.trim();
                                }
                                break;
                        }
                    }
                    else if (element instanceof HTMLTextAreaElement) {
                        value = element.value.trim();
                    }
                    else if (element instanceof HTMLElement) {
                        if (element.tagName === 'BUTTON') {
                            value = element.innerText;
                        }
                        else if (node.inlineText) {
                            name = node.textContent.trim();
                            value = replaceEntity(element.children.length > 0 || element.tagName === 'CODE' ? element.innerHTML : node.textContent);
                            [value, inlineTrim] = replaceWhiteSpace(node, value);
                            value = value.replace(/\s*<br\s*\/?>\s*/g, '\\n');
                            value = value.replace(/\s+(class|style)=".*?"/g, '');
                        }
                        else if (element.innerText.trim() === '' && Resource.hasDrawableBackground(getElementCache(element, 'boxStyle'))) {
                            value = replaceEntity(element.innerText);
                            performTrim = false;
                        }
                    }
                    else if (node.plainText) {
                        name = node.textContent.trim();
                        value = replaceEntity(node.textContent);
                        value = value.replace(/&[A-Za-z]+;/g, match => match.replace('&', '&amp;'));
                        [value, inlineTrim] = replaceWhiteSpace(node, value);
                    }
                    if (value !== '') {
                        if (performTrim) {
                            const previousSibling = node.previousSibling();
                            const nextSibling = node.nextSibling();
                            let previousSpaceEnd = false;
                            if (!previousSibling || previousSibling.multiLine || previousSibling.lineBreak) {
                                value = value.replace(/^\s+/, '');
                            }
                            else {
                                previousSpaceEnd = /\s+$/.test(previousSibling.element.innerText || previousSibling.element.textContent || '');
                            }
                            if (inlineTrim) {
                                const original = value;
                                value = value.trim();
                                if (previousSibling &&
                                    !previousSibling.block &&
                                    !previousSibling.lineBreak &&
                                    !previousSpaceEnd && /^\s+/.test(original)) {
                                    value = '&#160;' + value;
                                }
                                if (nextSibling && !nextSibling.lineBreak && /\s+$/.test(original)) {
                                    value = value + '&#160;';
                                }
                            }
                            else {
                                if (!/^\s+$/.test(value)) {
                                    value = value.replace(/^\s+/, (previousSibling && (previousSibling.block ||
                                        previousSibling.lineBreak ||
                                        (previousSibling.element instanceof HTMLElement && previousSibling.element.innerText.length > 1 && previousSpaceEnd) ||
                                        (node.multiLine && hasLineBreak(element))) ? '' : '&#160;'));
                                    value = value.replace(/\s+$/, node.css('display') === 'table-cell' || (nextSibling && nextSibling.lineBreak) ? '' : '&#160;');
                                }
                                else if (value.length > 0) {
                                    value = '&#160;' + value.substring(1);
                                }
                            }
                        }
                        if (value !== '') {
                            if (node.renderParent.layoutVertical && node.inlineText) {
                                const textIndent = node.toInt('textIndent');
                                if (textIndent > 0) {
                                    value = '&#160;'.repeat(Math.ceil(textIndent / 6)) + value;
                                }
                            }
                            setElementCache(element, 'valueString', { name, value });
                        }
                    }
                }
            }
        }
        setOptionArray() {
            for (const node of this.cache) {
                if (node.tagName === 'SELECT' && node.visible && this.checkPermissions(node, NODE_RESOURCE.OPTION_ARRAY, 'optionArray')) {
                    const element = node.element;
                    const stringArray = [];
                    let numberArray = [];
                    let i = -1;
                    while (++i < element.children.length) {
                        const item = element.children[i];
                        const value = item.text.trim();
                        if (value !== '') {
                            if (numberArray && stringArray.length === 0 && isNumber(value)) {
                                numberArray.push(value);
                            }
                            else {
                                if (numberArray && numberArray.length > 0) {
                                    i = -1;
                                    numberArray = undefined;
                                    continue;
                                }
                                if (value !== '') {
                                    stringArray.push(replaceEntity(value));
                                }
                            }
                        }
                    }
                    setElementCache(element, 'optionArray', {
                        stringArray: stringArray.length > 0 ? stringArray : undefined,
                        numberArray: numberArray && numberArray.length > 0 ? numberArray : undefined
                    });
                }
            }
        }
        setImageSource() {
            for (const node of this.cache.visible) {
                if (this.checkPermissions(node, NODE_RESOURCE.IMAGE_SOURCE, 'imageSource')) {
                    if (node.svgElement) {
                        const element = node.element;
                        if (element.children.length > 0) {
                            const result = new Svg(element);
                            result.defs.image.forEach(item => {
                                const dimensions = this.imageAssets.get(item.uri);
                                if (dimensions) {
                                    if (item.width === 0) {
                                        item.width = dimensions.width;
                                    }
                                    if (item.height === 0) {
                                        item.height = dimensions.height;
                                    }
                                }
                            });
                            if (result.length > 0 || result.defs.image.length > 0) {
                                setElementCache(element, 'imageSource', result);
                            }
                        }
                    }
                }
            }
        }
        checkPermissions(node, resourceFlag, storedName) {
            return !node.hasBit('excludeResource', resourceFlag) && (!getElementCache(node.element, storedName) || this.settings.alwaysReevaluateResources);
        }
    }
    Resource.STORED = {
        strings: new Map(),
        arrays: new Map(),
        fonts: new Map(),
        colors: new Map(),
        styles: new Map(),
        dimens: new Map(),
        drawables: new Map(),
        images: new Map()
    };

    class File {
        constructor() {
            this.appName = '';
            this.queue = [];
        }
        static downloadToDisk(data, filename, mime = '') {
            const blob = new Blob([data], { type: mime || 'application/octet-stream' });
            if (typeof window.navigator.msSaveBlob !== 'undefined') {
                window.navigator.msSaveBlob(blob, filename);
                return;
            }
            const url = window.URL.createObjectURL(blob);
            const element = document.createElement('a');
            element.style.display = 'none';
            element.href = url;
            element.setAttribute('download', filename);
            if (typeof element.download === 'undefined') {
                element.setAttribute('target', '_blank');
            }
            document.body.appendChild(element);
            element.click();
            document.body.removeChild(element);
            setTimeout(() => window.URL.revokeObjectURL(url), 1);
        }
        addFile(pathname, filename, content, uri) {
            if (content !== '' || uri !== '') {
                const index = this.queue.findIndex(item => item.pathname === pathname && item.filename === filename);
                if (index !== -1) {
                    this.queue[index].content = content || '';
                    this.queue[index].uri = uri || '';
                }
                else {
                    this.queue.push({
                        pathname,
                        filename,
                        content,
                        uri
                    });
                }
            }
        }
        reset() {
            this.queue.length = 0;
        }
        saveToDisk(files) {
            if (!location.protocol.startsWith('http')) {
                alert('SERVER (required): See README for instructions');
                return;
            }
            if (files.length > 0) {
                files.push(...this.queue);
                fetch(`/api/savetodisk` +
                    `?directory=${encodeURIComponent(trimString(this.settings.outputDirectory, '/'))}` +
                    `&appname=${encodeURIComponent(this.appName.trim())}` +
                    `&filetype=${this.settings.outputArchiveFileType.toLowerCase()}` +
                    `&processingtime=${this.settings.outputMaxProcessingTime.toString().trim()}`, {
                    method: 'POST',
                    body: JSON.stringify(files),
                    headers: new Headers({ 'Accept': 'application/json, text/plain, */*', 'Content-Type': 'application/json' })
                })
                    .then((response) => response.json())
                    .then((result) => {
                    if (result) {
                        if (result.zipname) {
                            fetch(`/api/downloadtobrowser?filename=${encodeURIComponent(result.zipname)}`)
                                .then((response2) => response2.blob())
                                .then((result2) => File.downloadToDisk(result2, lastIndexOf(result.zipname)));
                        }
                        else if (result.system) {
                            alert(`${result.application}\n\n${result.system}`);
                        }
                    }
                })
                    .catch(err => alert(`ERROR: ${err}`));
            }
        }
    }

    class Extension {
        constructor(name, framework, tagNames, options) {
            this.name = name;
            this.framework = framework;
            this.options = {};
            this.tagNames = [];
            this.documentRoot = false;
            this.dependencies = [];
            this.subscribers = new Set();
            this.subscribersChild = new Set();
            if (Array.isArray(tagNames)) {
                this.tagNames = tagNames.map(value => value.trim().toUpperCase());
            }
            if (options) {
                Object.assign(this.options, options);
            }
        }
        setTarget(node, parent, element) {
            this._node = node;
            this._parent = parent;
            this._element = element || (node && node.element);
        }
        is(node) {
            return this.tagNames.length === 0 || this.tagNames.includes(node.tagName);
        }
        require(value, preload = false) {
            this.dependencies.push({
                name: value,
                preload
            });
        }
        included(element) {
            if (!element) {
                element = this.element;
            }
            return element ? includes(element.dataset.ext, this.name) : false;
        }
        beforeInit(internal = false) {
            if (!internal && this.included()) {
                this.dependencies.filter(item => item.preload).forEach(item => {
                    const ext = this.application.getExtension(item.name);
                    if (ext) {
                        ext.setTarget(this.node, this.parent, this.element);
                        ext.beforeInit(true);
                    }
                });
            }
        }
        init(element) {
            return false;
        }
        afterInit(init = false) {
            if (!init && this.included()) {
                this.dependencies.filter(item => item.preload).forEach(item => {
                    const ext = this.application.getExtension(item.name);
                    if (ext) {
                        ext.setTarget(this.node, this.parent, this.element);
                        ext.afterInit(true);
                    }
                });
            }
        }
        condition() {
            const node = this.node;
            if (node && isStyleElement(node.element)) {
                const ext = node.dataset.ext;
                if (!ext) {
                    return this.tagNames.length > 0;
                }
                else {
                    return this.included();
                }
            }
            return false;
        }
        processNode(mapX, mapY) {
            return { output: '', complete: false };
        }
        processChild(mapX, mapY) {
            return { output: '', complete: false };
        }
        afterRender() {
            return;
        }
        beforeInsert() {
            return;
        }
        afterInsert() {
            return;
        }
        finalize() {
            return;
        }
        getData() {
            const result = {};
            if (this.node && this.node.styleElement) {
                const element = this.node.element;
                const prefix = convertCamelCase(this.name, '\\.');
                for (const attr in element.dataset) {
                    if (attr.length > prefix.length && attr.startsWith(prefix)) {
                        result[capitalize(attr.substring(prefix.length), false)] = element.dataset[attr];
                    }
                }
            }
            return result;
        }
        get node() {
            return this._node;
        }
        get parent() {
            return this._parent;
        }
        get element() {
            return this._element;
        }
    }

    class Accessibility extends Extension {
        afterInit() {
            for (const node of Array.from(this.application.cacheProcessing.elements)) {
                if (!node.hasBit('excludeProcedure', NODE_PROCEDURE.ACCESSIBILITY)) {
                    const element = node.element;
                    if (element instanceof HTMLInputElement) {
                        switch (element.type) {
                            case 'radio':
                            case 'checkbox':
                                [node.nextElementSibling, node.previousElementSibling].some((sibling) => {
                                    if (sibling) {
                                        const label = Node.getNodeFromElement(sibling);
                                        const labelParent = sibling.parentElement && sibling.parentElement.tagName === 'LABEL' ? Node.getNodeFromElement(sibling.parentElement) : undefined;
                                        if (label && label.visible && label.pageflow) {
                                            if (hasValue(sibling.htmlFor) && sibling.htmlFor === element.id) {
                                                node.companion = label;
                                            }
                                            else if (label.textElement && labelParent) {
                                                node.companion = label;
                                                labelParent.renderAs = node;
                                            }
                                            if (node.companion) {
                                                if (this.options && !this.options.showLabel) {
                                                    label.hide();
                                                }
                                                return true;
                                            }
                                        }
                                    }
                                    return false;
                                });
                                break;
                        }
                    }
                }
            }
        }
    }

    class Button extends Extension {
        is(node) {
            return (super.is(node) && (node.tagName !== 'INPUT' ||
                ['button', 'file', 'image', 'reset', 'search', 'submit'].includes(node.element.type)));
        }
        condition() {
            return this.included();
        }
    }

    class Custom extends Extension {
        constructor(name, framework, tagNames, options) {
            super(name, framework, tagNames, options);
            this.require(EXT_NAME.EXTERNAL, true);
        }
        processNode() {
            const node = this.node;
            const parent = this.parent;
            const data = this.getData();
            let output = '';
            if (data.tag) {
                if (node.length > 0) {
                    output = this.application.viewController.renderGroup(node, parent, data.tag);
                }
                else {
                    output = this.application.viewController.renderNode(node, parent, data.tag);
                }
                node.nodeType = node.blockStatic ? NODE_STANDARD.BLOCK : NODE_STANDARD.INLINE;
            }
            if (data.tagChild) {
                for (const item of node) {
                    if (item.styleElement) {
                        item.dataset.ext = this.name;
                        item.dataset.andromeCustomTag = data.tagChild;
                    }
                }
            }
            return { output, complete: false };
        }
    }

    class External extends Extension {
        beforeInit(init = false) {
            if (this.element && (init || this.included())) {
                if (!getElementCache(this.element, 'andromeExternalDisplay')) {
                    const display = [];
                    let current = this.element;
                    while (current) {
                        display.push(getStyle(current).display);
                        current.style.display = 'block';
                        current = current.parentElement;
                    }
                    setElementCache(this.element, 'andromeExternalDisplay', display);
                }
            }
        }
        init(element) {
            if (this.included(element)) {
                this.application.viewElements.add(element);
            }
            return false;
        }
        afterInit(init = false) {
            if (this.element && (init || this.included())) {
                const data = getElementCache(this.element, 'andromeExternalDisplay');
                if (data) {
                    const display = data;
                    let current = this.element;
                    let i = 0;
                    while (current) {
                        current.style.display = display[i];
                        current = current.parentElement;
                        i++;
                    }
                    deleteElementCache(this.element, 'andromeExternalDisplay');
                }
            }
        }
        is() {
            return false;
        }
        condition() {
            return false;
        }
    }

    class Grid extends Extension {
        condition() {
            const node = this.node;
            return (this.included() ||
                (node.length > 1 && ((node.display === 'table' && node.every(item => item.display === 'table-row' && item.every(child => child.display === 'table-cell'))) ||
                    (node.every(item => item.pageflow && !item.has('backgroundColor') && !item.has('backgroundImage') && (item.borderTopWidth + item.borderRightWidth + item.borderBottomWidth + item.borderLeftWidth === 0) && (!item.inlineElement || item.blockStatic)) && (node.css('listStyle') === 'none' ||
                        node.every(item => item.display === 'list-item' && item.css('listStyleType') === 'none') ||
                        (!hasValue(node.dataset.ext) && !node.flex.enabled && node.length > 1 && node.some(item => item.length > 1) && !node.some(item => item.display === 'list-item' || item.textElement)))))));
        }
        processNode(mapX) {
            const node = this.node;
            const parent = this.parent;
            const columnBalance = !!this.options.columnBalance;
            let output = '';
            let columns = [];
            const mainData = {
                padding: newBoxRect(),
                columnEnd: [],
                columnCount: 0
            };
            if (columnBalance) {
                const dimensions = [];
                node.each((item, index) => {
                    dimensions[index] = [];
                    item.each(subitem => dimensions[index].push(subitem.bounds.width));
                    columns.push(item.duplicate());
                });
                const base = columns[dimensions.findIndex(item => {
                    const column = dimensions.reduce((a, b) => {
                        if (a.length === b.length) {
                            const sumA = a.reduce((c, d) => c + d, 0);
                            const sumB = b.reduce((c, d) => c + d, 0);
                            return sumA < sumB ? a : b;
                        }
                        else {
                            return a.length < b.length ? a : b;
                        }
                    });
                    return item === column;
                })];
                if (base && base.length > 1) {
                    let maxIndex = -1;
                    let assigned = [];
                    let every = false;
                    for (let l = 0; l < base.length; l++) {
                        const bounds = base[l].bounds;
                        const found = [];
                        if (l < base.length - 1) {
                            for (let m = 0; m < columns.length; m++) {
                                if (columns[m] === base) {
                                    found.push(l);
                                }
                                else {
                                    const result = columns[m].findIndex((item, index) => index >= l && Math.floor(item.bounds.width) === Math.floor(bounds.width) && index < columns[m].length - 1);
                                    if (result !== -1) {
                                        found.push(result);
                                    }
                                    else {
                                        found.length = 0;
                                        break;
                                    }
                                }
                            }
                        }
                        else {
                            for (let m = 0; m < columns.length; m++) {
                                if (columns[m].length > base.length) {
                                    const removed = columns[m].splice(assigned[m] + (every ? 2 : 1), columns[m].length - base.length);
                                    columns[m][assigned[m] + (every ? 1 : 0)].data(EXT_NAME.GRID, 'siblings', [...removed]);
                                }
                            }
                        }
                        if (found.length === columns.length) {
                            const minIndex = found.reduce((a, b) => Math.min(a, b));
                            maxIndex = found.reduce((a, b) => Math.max(a, b));
                            if (maxIndex > minIndex) {
                                for (let m = 0; m < columns.length; m++) {
                                    if (found[m] > minIndex) {
                                        const removed = columns[m].splice(minIndex, found[m] - minIndex);
                                        columns[m][assigned[m] + (every ? 1 : 0)].data(EXT_NAME.GRID, 'siblings', [...removed]);
                                    }
                                }
                            }
                            assigned = found;
                            every = true;
                        }
                        else {
                            assigned = new Array(columns.length).fill(l);
                            every = false;
                        }
                    }
                }
                else {
                    columns.length = 0;
                }
            }
            else {
                function getRowIndex(current) {
                    return columns[0].findIndex(item => withinFraction(item.linear.top, current.linear.top) || (current.linear.top >= item.linear.top && current.linear.bottom <= item.linear.bottom));
                }
                const nextMapX = mapX[node.depth + 2];
                const nextCoordsX = nextMapX ? Object.keys(nextMapX) : [];
                const columnEnd = [];
                if (nextCoordsX.length > 1) {
                    const columnRight = [];
                    for (let l = 0; l < nextCoordsX.length; l++) {
                        const nextAxisX = sortAsc(nextMapX[parseInt(nextCoordsX[l])].filter(item => item.documentParent.documentParent.id === node.id), 'linear.top');
                        if (l === 0 && nextAxisX.length === 0) {
                            return { output: '', complete: false };
                        }
                        columnRight[l] = l === 0 ? 0 : columnRight[l - 1];
                        for (let m = 0; m < nextAxisX.length; m++) {
                            const nextX = nextAxisX[m];
                            let [left, right] = [nextX.linear.left, nextX.linear.right];
                            let index = l;
                            if (index > 0 && isStyleElement(nextX.element) && nextX.float === 'right') {
                                nextX.element.style.cssFloat = 'left';
                                const bounds = nextX.element.getBoundingClientRect();
                                if (bounds.left - nextX.marginLeft !== left) {
                                    [left, right] = [bounds.left - nextX.marginLeft, bounds.right + nextX.marginRight];
                                    for (let n = 1; n < columnRight.length; n++) {
                                        index = n;
                                        if (left > columnRight[n - 1]) {
                                            break;
                                        }
                                    }
                                }
                                nextX.element.style.cssFloat = 'right';
                            }
                            if (index === 0 || left >= columnRight[index - 1]) {
                                if (columns[index] == null) {
                                    columns[index] = [];
                                }
                                if (index === 0 || columns[0].length === nextAxisX.length) {
                                    columns[index][m] = nextX;
                                }
                                else {
                                    const row = getRowIndex(nextX);
                                    if (row !== -1) {
                                        columns[index][row] = nextX;
                                    }
                                }
                            }
                            else {
                                const current = columns.length - 1;
                                if (columns[current]) {
                                    const minLeft = columns[current].reduce((a, b) => Math.min(a, b.linear.left), Number.MAX_VALUE);
                                    const maxRight = columns[current].reduce((a, b) => Math.max(a, b.linear.right), 0);
                                    if (left > minLeft && right > maxRight) {
                                        const filtered = columns.filter(item => item);
                                        const rowIndex = getRowIndex(nextX);
                                        if (rowIndex !== -1 && filtered[filtered.length - 1][rowIndex] == null) {
                                            columns[current].length = 0;
                                        }
                                    }
                                }
                            }
                            columnRight[l] = Math.max(nextX.linear.right, columnRight[l]);
                        }
                    }
                    for (let l = 0, m = -1; l < columnRight.length; l++) {
                        if (m === -1 && columns[l] == null) {
                            m = l - 1;
                        }
                        else if (columns[l] == null) {
                            if (m !== -1 && l === columnRight.length - 1) {
                                columnRight[m] = columnRight[l];
                            }
                        }
                        else if (m !== -1) {
                            columnRight[m] = columnRight[l - 1];
                            m = -1;
                        }
                    }
                    for (let l = 0; l < columns.length; l++) {
                        if (columns[l] && columns[l].length > 0) {
                            columnEnd.push(columnRight[l]);
                        }
                    }
                    columns = columns.filter(item => item && item.length > 0);
                    const columnLength = columns.reduce((a, b) => Math.max(a, b.length), 0);
                    for (let l = 0; l < columnLength; l++) {
                        for (let m = 0; m < columns.length; m++) {
                            if (columns[m][l] == null) {
                                columns[m][l] = { spacer: 1 };
                            }
                        }
                    }
                }
                if (columnEnd.length > 0) {
                    mainData.columnEnd = columnEnd;
                    mainData.columnEnd[mainData.columnEnd.length - 1] = node.box.right;
                }
            }
            if (columns.length > 1 && columns[0].length === node.length) {
                mainData.columnCount = columnBalance ? columns[0].length : columns.length;
                output = this.application.writeGridLayout(node, parent, mainData.columnCount);
                node.duplicate().forEach(item => node.remove(item) && item.hide());
                for (let l = 0, count = 0; l < columns.length; l++) {
                    let spacer = 0;
                    for (let m = 0, start = 0; m < columns[l].length; m++) {
                        const item = columns[l][m];
                        if (!item.spacer) {
                            item.parent = node;
                            const data = {
                                inherit: true,
                                rowSpan: 0,
                                columnSpan: 0,
                                index: -1,
                                cellFirst: false,
                                cellLast: false,
                                rowEnd: false,
                                rowStart: false
                            };
                            if (columnBalance) {
                                data.rowStart = m === 0;
                                data.rowEnd = m === columns[l].length - 1;
                                data.cellFirst = l === 0 && m === 0;
                                data.cellLast = l === columns.length - 1 && data.rowEnd;
                                data.index = m;
                            }
                            else {
                                let rowSpan = 1;
                                let columnSpan = 1 + spacer;
                                for (let n = l + 1; n < columns.length; n++) {
                                    if (columns[n][m].spacer === 1) {
                                        columnSpan++;
                                        columns[n][m].spacer = 2;
                                    }
                                    else {
                                        break;
                                    }
                                }
                                if (columnSpan === 1) {
                                    for (let n = m + 1; n < columns[l].length; n++) {
                                        if (columns[l][n].spacer === 1) {
                                            rowSpan++;
                                            columns[l][n].spacer = 2;
                                        }
                                        else {
                                            break;
                                        }
                                    }
                                }
                                data.rowSpan = rowSpan;
                                data.columnSpan = columnSpan;
                                data.rowStart = start++ === 0;
                                data.rowEnd = columnSpan + l === columns.length;
                                data.cellFirst = count++ === 0;
                                data.cellLast = data.rowEnd && m === columns[l].length - 1;
                                data.index = l;
                                spacer = 0;
                            }
                            item.data(EXT_NAME.GRID, 'cellData', data);
                        }
                        else if (item.spacer === 1) {
                            spacer++;
                        }
                    }
                }
                sortAsc(node.list, 'documentParent.siblingIndex', 'siblingIndex');
                if (node.display === 'table') {
                    if (node.css('borderCollapse') === 'collapse') {
                        node.modifyBox(BOX_STANDARD.PADDING_TOP, null);
                        node.modifyBox(BOX_STANDARD.PADDING_RIGHT, null);
                        node.modifyBox(BOX_STANDARD.PADDING_BOTTOM, null);
                        node.modifyBox(BOX_STANDARD.PADDING_LEFT, null);
                    }
                }
                node.data(EXT_NAME.GRID, 'mainData', mainData);
                node.render(parent);
            }
            return { output, complete: true };
        }
        processChild() {
            const node = this.node;
            const parent = this.parent;
            const mainData = parent.data(EXT_NAME.GRID, 'mainData');
            const cellData = node.data(EXT_NAME.GRID, 'cellData');
            let output = '';
            if (mainData && cellData) {
                let siblings;
                if (this.options.columnBalance) {
                    siblings = node.data(EXT_NAME.GRID, 'siblings');
                }
                else {
                    const columnEnd = mainData.columnEnd[Math.min(cellData.index + (cellData.columnSpan - 1), mainData.columnEnd.length - 1)];
                    siblings = Array.from(node.documentParent.element.children).map(element => {
                        const item = Node.getNodeFromElement(element);
                        return (item &&
                            item.visible &&
                            !item.excluded &&
                            !item.rendered &&
                            item.linear.left >= node.linear.right &&
                            item.linear.right <= columnEnd ? item : undefined);
                    })
                        .filter(item => item);
                }
                if (siblings && siblings.length > 0) {
                    siblings.unshift(node);
                    const group = this.application.viewController.createGroup(parent, node, siblings);
                    const linearX = NodeList.linearX(siblings);
                    if (linearX && Application.isRelativeHorizontal(siblings)) {
                        output = this.application.writeRelativeLayout(group, parent);
                        group.alignmentType |= NODE_ALIGNMENT.HORIZONTAL;
                    }
                    else {
                        if (linearX || NodeList.linearY(siblings)) {
                            output = this.application.writeLinearLayout(group, parent, linearX);
                        }
                        else {
                            output = this.application.writeConstraintLayout(group, parent);
                        }
                        group.alignmentType |= NODE_ALIGNMENT.SEGMENTED;
                    }
                    node.alignmentType |= NODE_ALIGNMENT.EXCLUDE;
                    return { output, parent: group, complete: true };
                }
            }
            return { output, complete: true };
        }
    }

    function hasSingleImage(node) {
        return node.css('backgroundImage') !== 'none' && node.css('backgroundRepeat') === 'no-repeat';
    }
    class List extends Extension {
        condition() {
            const node = this.node;
            return (super.condition() &&
                node.length > 0 && (node.every(item => item.blockStatic) ||
                node.every(item => item.inlineElement) ||
                (node.every(item => item.floating) && NodeList.floated(node.list).size === 1) ||
                node.every((item, index) => !item.floating && (index === 0 || index === node.length - 1 || item.blockStatic || (item.inlineElement && node.item(index - 1).blockStatic && node.item(index + 1).blockStatic)))) && (node.some((item) => item.display === 'list-item' && (item.css('listStyleType') !== 'none' || hasSingleImage(item))) ||
                node.every((item) => item.tagName !== 'LI' && item.styleMap.listStyleType === 'none' && hasSingleImage(item))));
        }
        processNode() {
            const node = this.node;
            const parent = this.parent;
            let output = '';
            if (NodeList.linearY(node.list)) {
                output = this.application.writeGridLayout(node, parent, node.some(item => item.css('listStylePosition') === 'inside') ? 3 : 2);
            }
            else {
                output = this.application.writeLinearLayout(node, parent, true);
            }
            let i = 0;
            for (const item of node) {
                const mainData = {
                    ordinal: '',
                    imageSrc: '',
                    imagePosition: ''
                };
                if (item.display === 'list-item' || item.has('listStyleType') || hasSingleImage(item)) {
                    let src = item.css('listStyleImage');
                    if (src && src !== 'none') {
                        mainData.imageSrc = src;
                    }
                    else {
                        switch (item.css('listStyleType')) {
                            case 'disc':
                                mainData.ordinal = '●';
                                break;
                            case 'square':
                                mainData.ordinal = '■';
                                break;
                            case 'decimal':
                                mainData.ordinal = `${(i + 1).toString()}.`;
                                break;
                            case 'decimal-leading-zero':
                                mainData.ordinal = `${(i < 9 ? '0' : '') + (i + 1).toString()}.`;
                                break;
                            case 'lower-alpha':
                            case 'lower-latin':
                                mainData.ordinal = `${convertAlpha(i).toLowerCase()}.`;
                                break;
                            case 'upper-alpha':
                            case 'upper-latin':
                                mainData.ordinal = `${convertAlpha(i)}.`;
                                break;
                            case 'lower-roman':
                                mainData.ordinal = `${convertRoman(i + 1).toLowerCase()}.`;
                                break;
                            case 'upper-roman':
                                mainData.ordinal = `${convertRoman(i + 1)}.`;
                                break;
                            case 'none':
                                src = '';
                                let position = '';
                                const repeat$$1 = item.css('backgroundRepeat');
                                if (repeat$$1 === 'no-repeat') {
                                    src = item.css('backgroundImage');
                                    position = item.css('backgroundPosition');
                                }
                                if (src && src !== 'none') {
                                    mainData.imageSrc = src;
                                    mainData.imagePosition = position;
                                    item.excludeResource |= NODE_RESOURCE.IMAGE_SOURCE;
                                }
                                break;
                            default:
                                mainData.ordinal = '○';
                                break;
                        }
                    }
                    i++;
                }
                item.data(EXT_NAME.LIST, 'mainData', mainData);
            }
            return { output, complete: true };
        }
        afterRender() {
            for (const node of this.subscribers) {
                node.modifyBox(BOX_STANDARD.MARGIN_LEFT, null);
                node.modifyBox(BOX_STANDARD.PADDING_LEFT, null);
            }
        }
    }

    class Nav extends Extension {
        constructor(name, framework, tagNames, options) {
            super(name, framework, tagNames, options);
            this.require(EXT_NAME.EXTERNAL, true);
        }
        init(element) {
            if (this.included(element)) {
                let valid = false;
                if (element.children.length > 0) {
                    const tagName = element.children[0].tagName;
                    valid = Array.from(element.children).every(item => item.tagName === tagName);
                    let current = element.parentElement;
                    while (current) {
                        if (current.tagName === 'NAV' && this.application.viewElements.has(current)) {
                            valid = false;
                            break;
                        }
                        current = current.parentElement;
                    }
                }
                if (valid) {
                    Array.from(element.querySelectorAll('NAV')).forEach((item) => {
                        if (getStyle(element).display === 'none') {
                            setElementCache(item, 'andromeExternalDisplay', 'none');
                            item.style.display = 'block';
                        }
                    });
                    this.application.viewElements.add(element);
                }
            }
            return false;
        }
        afterRender() {
            const node = this.node;
            if (this.included(node.element)) {
                Array.from(node.element.querySelectorAll('NAV')).forEach((item) => {
                    const display = getElementCache(item, 'andromeExternalDisplay');
                    if (display) {
                        item.style.display = display;
                        deleteElementCache(item, 'andromeExternalDisplay');
                    }
                });
            }
        }
    }

    class Origin extends Extension {
        afterInit() {
            function modifyMarginLeft(node, offset, parent = false) {
                node.bounds.left -= offset;
                node.bounds.width += Math.max(node.marginLeft < 0 ? node.marginLeft + offset : offset, 0);
                node.css('marginLeft', formatPX(node.marginLeft + (offset * (parent ? -1 : 1))));
                node.setBounds(true);
            }
            for (const node of Array.from(this.application.cacheProcessing.elements)) {
                const outside = node.some(current => {
                    if (current.pageflow) {
                        return (current.float !== 'right' &&
                            current.marginLeft < 0 &&
                            node.marginLeft >= Math.abs(current.marginLeft) &&
                            (Math.abs(current.marginLeft) >= current.bounds.width || node.documentRoot));
                    }
                    else {
                        const left = current.toInt('left');
                        const right = current.toInt('right');
                        return (left < 0 && node.marginLeft >= Math.abs(left)) || (right < 0 && Math.abs(right) >= current.bounds.width);
                    }
                });
                if (outside) {
                    const marginLeft = [];
                    const marginRight = [];
                    for (const current of node) {
                        let leftType = 0;
                        if (current.pageflow) {
                            const left = current.marginLeft;
                            if (left < 0 && node.marginLeft >= Math.abs(left)) {
                                leftType = 1;
                            }
                        }
                        else {
                            const left = convertInt(current.left) + current.marginLeft;
                            const right = convertInt(current.right);
                            if (left < 0) {
                                if (node.marginLeft >= Math.abs(left)) {
                                    leftType = 2;
                                }
                            }
                            else if (right < 0) {
                                if (Math.abs(right) >= current.bounds.width) {
                                    marginRight.push(current);
                                }
                            }
                        }
                        marginLeft.push(leftType);
                    }
                    if (marginRight.length > 0) {
                        const [sectionLeft, sectionRight] = partition(node.list, (item) => !marginRight.includes(item));
                        if (sectionLeft.length > 0 && sectionRight.length > 0) {
                            if (node.style.marginLeft && node.autoMarginLeft) {
                                node.css('marginLeft', node.style.marginLeft);
                            }
                            node.modifyBox(BOX_STANDARD.MARGIN_RIGHT, null);
                            const widthLeft = node.has('width', CSS_STANDARD.UNIT) ? node.toInt('width') : Math.max.apply(null, sectionRight.map(item => item.bounds.width));
                            const widthRight = Math.max.apply(null, sectionRight.map(item => Math.abs(item.toInt('right'))));
                            sectionLeft.forEach(item => item.pageflow && !item.hasWidth && item.css(item.textElement ? 'maxWidth' : 'width', formatPX(widthLeft)));
                            node.css('width', formatPX(widthLeft + widthRight));
                        }
                    }
                    const marginLeftType = Math.max.apply(null, marginLeft);
                    if (marginLeftType > 0) {
                        node.each((current, index) => {
                            if (marginLeft[index] === 2) {
                                const left = current.toInt('left') + node.marginLeft;
                                current.css('left', formatPX(Math.max(left, 0)));
                                if (left < 0) {
                                    current.css('marginLeft', formatPX(current.marginLeft + left));
                                    modifyMarginLeft(current, left);
                                }
                            }
                            else if (marginLeftType === 2 || (current.pageflow && !current.plainText && marginLeft.includes(1))) {
                                modifyMarginLeft(current, node.marginLeft);
                            }
                        });
                        if (node.has('width', CSS_STANDARD.UNIT)) {
                            node.css('width', formatPX(node.toInt('width') + node.marginLeft));
                        }
                        modifyMarginLeft(node, node.marginLeft, true);
                    }
                }
            }
        }
    }

    class Percent extends Extension {
        condition() {
            const node = this.node;
            const parent = this.parent;
            return this.included() || (node.alignmentType === NODE_ALIGNMENT.NONE &&
                node.pageflow &&
                node.has('width', CSS_STANDARD.PERCENT, { not: '100%' }) &&
                (parent.linearVertical || (parent.is(NODE_STANDARD.FRAME) && node.singleChild)) &&
                !node.imageElement);
        }
        processNode() {
            const node = this.node;
            const parent = this.parent;
            const controller = this.application.viewController;
            const group = controller.createGroup(parent, node, [node]);
            const renderOutput = this.application.writeGridLayout(group, parent, 2, 1);
            group.alignmentType |= NODE_ALIGNMENT.PERCENT;
            controller[node.float === 'right' || node.autoMarginLeft ? 'prependBefore' : 'appendAfter'](node.id, controller.renderColumnSpace(group.renderDepth + 1, `${100 - node.toInt('width')}%`));
            return { output: '', parent: group, renderAs: group, renderOutput, complete: true };
        }
    }

    class Sprite extends Extension {
        condition() {
            const node = this.node;
            let valid = false;
            if (node.hasWidth && node.hasHeight && node.length === 0 && !node.inlineText) {
                let url = node.css('backgroundImage');
                if (!url || url === 'none') {
                    url = '';
                    const match = DOM_REGEX.CSS_URL.exec(node.css('background'));
                    if (match) {
                        url = match[0];
                    }
                }
                if (url !== '') {
                    url = cssResolveUrl(url);
                    const image = this.application.cacheImage.get(url);
                    if (image) {
                        const fontSize = node.css('fontSize');
                        const width = convertClientUnit(node.has('width') ? node.css('width') : node.css('minWidth'), node.bounds.width, fontSize);
                        const height = convertClientUnit(node.has('height') ? node.css('width') : node.css('minHeight'), node.bounds.height, fontSize);
                        const position = getBackgroundPosition(`${node.css('backgroundPositionX')} ${node.css('backgroundPositionY')}`, node.bounds, fontSize);
                        if (width > 0 && position.left <= 0 && image.width > width &&
                            height > 0 && position.top <= 0 && image.height > height) {
                            image.position = { x: position.left, y: position.top };
                            node.data(EXT_NAME.SPRITE, 'image', image);
                            valid = true;
                        }
                    }
                }
            }
            return valid && (!hasValue(node.dataset.ext) || this.included(node.element));
        }
    }

    class Table extends Extension {
        processNode() {
            function setAutoWidth(td) {
                td.data(EXT_NAME.TABLE, 'percent', `${Math.round((td.bounds.width / node.bounds.width) * 100)}%`);
                td.data(EXT_NAME.TABLE, 'expand', true);
            }
            function setBoundsWidth(td) {
                td.css('width', formatPX(td.bounds.width));
            }
            const node = this.node;
            const parent = this.parent;
            const table = [];
            const thead = node.filter(item => item.tagName === 'THEAD');
            const tbody = node.filter(item => item.tagName === 'TBODY');
            const tfoot = node.filter(item => item.tagName === 'TFOOT');
            const colgroup = Array.from(node.element.children).find(element => element.tagName === 'COLGROUP');
            const tableWidth = node.css('width');
            if (thead.length > 0) {
                thead[0].cascade()
                    .filter(item => item.tagName === 'TH' || item.tagName === 'TD')
                    .forEach(item => item.inherit(thead[0], 'styleMap'));
                table.push(...thead[0].list);
                thead.forEach(item => item.hide());
            }
            if (tbody.length > 0) {
                tbody.forEach(item => {
                    table.push(...item.list);
                    item.hide();
                });
            }
            if (tfoot.length > 0) {
                tfoot[0].cascade()
                    .filter(item => item.tagName === 'TH' || item.tagName === 'TD')
                    .forEach(item => item.inherit(tfoot[0], 'styleMap'));
                table.push(...tfoot[0].list);
                tfoot.forEach(item => item.hide());
            }
            const layoutFixed = node.css('tableLayout') === 'fixed';
            const borderCollapse = node.css('borderCollapse') === 'collapse';
            const [horizontal, vertical] = borderCollapse ? [0, 0] : node.css('borderSpacing').split(' ').map(value => parseInt(value));
            if (horizontal > 0) {
                node.modifyBox(BOX_STANDARD.PADDING_LEFT, horizontal);
                node.modifyBox(BOX_STANDARD.PADDING_RIGHT, horizontal);
            }
            else {
                node.modifyBox(BOX_STANDARD.PADDING_LEFT, null);
                node.modifyBox(BOX_STANDARD.PADDING_RIGHT, null);
            }
            if (vertical > 0) {
                node.modifyBox(BOX_STANDARD.PADDING_TOP, vertical);
                node.modifyBox(BOX_STANDARD.PADDING_BOTTOM, vertical);
            }
            else {
                node.modifyBox(BOX_STANDARD.PADDING_TOP, null);
                node.modifyBox(BOX_STANDARD.PADDING_BOTTOM, null);
            }
            const spacingWidth = formatPX(horizontal > 1 ? Math.round(horizontal / 2) : horizontal);
            const spacingHeight = formatPX(vertical > 1 ? Math.round(vertical / 2) : vertical);
            const mapWidth = [];
            const mapBounds = [];
            const rowWidth = [];
            let columnIndex = new Array(table.length).fill(0);
            let multiLine = false;
            for (let i = 0; i < table.length; i++) {
                const tr = table[i];
                rowWidth[i] = horizontal;
                for (let j = 0; j < tr.length; j++) {
                    const td = tr.item(j);
                    const element = td.element;
                    for (let k = 0; k < element.rowSpan - 1; k++) {
                        const l = (i + 1) + k;
                        if (columnIndex[l] != null) {
                            columnIndex[l] += element.colSpan;
                        }
                    }
                    if (!td.has('background') && !td.has('backgroundColor')) {
                        const item = td.element;
                        if (colgroup) {
                            const style = getStyle(colgroup.children[columnIndex[i]]);
                            if (style.background) {
                                item.style.background = style.background;
                            }
                            else if (style.backgroundColor) {
                                item.style.backgroundColor = style.backgroundColor;
                            }
                        }
                        else {
                            let value = cssInherit(item, 'background', ['rgba(0, 0, 0, 0)', 'transparent'], ['TABLE']);
                            if (value !== '') {
                                item.style.background = value;
                            }
                            else {
                                value = cssInherit(item, 'backgroundColor', ['rgba(0, 0, 0, 0)', 'transparent'], ['TABLE']);
                                if (value !== '') {
                                    item.style.backgroundColor = value;
                                }
                            }
                        }
                    }
                    const columnWidth = td.styleMap.width;
                    const m = columnIndex[i];
                    if (i === 0 || mapWidth[m] == null || !layoutFixed) {
                        if (!columnWidth || columnWidth === 'auto') {
                            if (mapWidth[m] == null) {
                                mapWidth[m] = columnWidth || '0px';
                                mapBounds[m] = 0;
                            }
                        }
                        else {
                            const percentColumnWidth = isPercent(columnWidth);
                            const unitMapWidth = isUnit(mapWidth[m]);
                            if (mapWidth[m] == null ||
                                td.bounds.width < mapBounds[m] ||
                                (td.bounds.width === mapBounds[m] && ((mapWidth[m] === 'auto' && (percentColumnWidth || unitMapWidth)) ||
                                    (percentColumnWidth && unitMapWidth) ||
                                    (percentColumnWidth && isPercent(mapWidth[m]) && convertFloat(columnWidth) > convertFloat(mapWidth[m])) ||
                                    (unitMapWidth && isUnit(columnWidth) && convertInt(columnWidth) > convertInt(mapWidth[m]))))) {
                                mapWidth[m] = columnWidth;
                            }
                            if (element.colSpan === 1) {
                                mapBounds[m] = td.bounds.width;
                            }
                        }
                    }
                    td.css({
                        marginTop: i === 0 ? '0px' : spacingHeight,
                        marginRight: j < tr.length - 1 ? spacingWidth : '0px',
                        marginBottom: i + element.rowSpan - 1 >= table.length - 1 ? '0px' : spacingHeight,
                        marginLeft: columnIndex[i] === 0 ? '0px' : spacingWidth
                    });
                    if (!multiLine) {
                        multiLine = td.multiLine;
                    }
                    if (td.length > 0 || td.inlineText) {
                        rowWidth[i] += td.bounds.width + horizontal;
                    }
                    columnIndex[i] += element.colSpan;
                }
            }
            const columnCount = Math.max.apply(null, columnIndex);
            let rowCount = table.length;
            if (mapWidth.every(value => isPercent(value)) && mapWidth.reduce((a, b) => a + parseFloat(b), 0) > 1) {
                let percentTotal = 100;
                mapWidth.forEach((value, index) => {
                    const percent = parseFloat(value);
                    if (percentTotal <= 0) {
                        mapWidth[index] = '0px';
                    }
                    else if (percentTotal - percent < 0) {
                        mapWidth[index] = `${percentTotal}%`;
                    }
                    percentTotal -= percent;
                });
            }
            else if (mapWidth.every(value => isUnit(value))) {
                const pxWidth = mapWidth.reduce((a, b) => a + parseInt(b), 0);
                if ((isPercent(tableWidth) && tableWidth !== '100%') || pxWidth < node.viewWidth) {
                    mapWidth.filter(value => value !== '0px').forEach((value, index) => mapWidth[index] = `${(parseInt(value) / pxWidth) * 100}%`);
                }
                else if (tableWidth === 'auto') {
                    mapWidth.filter(value => value !== '0px').forEach((value, index) => mapWidth[index] = mapBounds[index] == null ? 'undefined' : `${(mapBounds[index] / node.bounds.width) * 100}%`);
                }
                else if (pxWidth > node.viewWidth) {
                    node.css('width', 'auto');
                    if (!layoutFixed) {
                        node.cascade().forEach(item => item.css('width', 'auto'));
                    }
                }
            }
            const mapPercent = mapWidth.reduce((a, b) => a + (isPercent(b) ? parseFloat(b) : 0), 0);
            const typeWidth = (() => {
                if (mapWidth.some(value => isPercent(value)) || mapWidth.every(value => isUnit(value) && value !== '0px')) {
                    return 3;
                }
                if (mapWidth.every(value => value === mapWidth[0])) {
                    if (multiLine) {
                        return node.some(td => td.has('height')) ? 2 : 3;
                    }
                    if (mapWidth[0] === 'auto') {
                        return node.has('width') ? 3 : 0;
                    }
                    if (node.hasWidth) {
                        return 2;
                    }
                }
                if (mapWidth.every(value => value === 'auto' || (isUnit(value) && value !== '0px'))) {
                    return 1;
                }
                return 0;
            })();
            if (multiLine || (typeWidth === 2 && !node.hasWidth)) {
                node.data(EXT_NAME.TABLE, 'expand', true);
            }
            const caption = node.find(item => item.tagName === 'CAPTION');
            node.clear();
            if (caption) {
                if (!caption.has('textAlign', CSS_STANDARD.LEFT)) {
                    caption.css('textAlign', 'center');
                }
                if (!caption.hasWidth) {
                    if (caption.textElement) {
                        if (!caption.has('maxWidth')) {
                            caption.css('maxWidth', formatPX(caption.bounds.width));
                        }
                    }
                    else {
                        if (caption.bounds.width > Math.max.apply(null, rowWidth)) {
                            setBoundsWidth(caption);
                        }
                    }
                }
                rowCount++;
                caption.data(EXT_NAME.TABLE, 'colSpan', columnCount);
                caption.parent = node;
            }
            columnIndex = new Array(table.length).fill(0);
            let borderInside = 0;
            for (let i = 0; i < table.length; i++) {
                const tr = table[i];
                const children = tr.duplicate();
                for (let j = 0; j < children.length; j++) {
                    const td = children[j];
                    const element = td.element;
                    for (let k = 0; k < element.rowSpan - 1; k++) {
                        const l = (i + 1) + k;
                        if (columnIndex[l] != null) {
                            columnIndex[l] += element.colSpan;
                        }
                    }
                    if (element.rowSpan > 1) {
                        td.data(EXT_NAME.TABLE, 'rowSpan', element.rowSpan);
                    }
                    if (element.colSpan > 1) {
                        td.data(EXT_NAME.TABLE, 'colSpan', element.colSpan);
                    }
                    if (!td.has('verticalAlign')) {
                        td.css('verticalAlign', 'middle');
                    }
                    if (i === 0) {
                        if (td.has('borderTopStyle') && convertInt(td.css('borderTopWidth')) > 0) {
                            borderInside |= 2;
                        }
                    }
                    if (j === 0) {
                        if (td.has('borderLeftStyle') && convertInt(td.css('borderLeftWidth')) > 0) {
                            borderInside |= 4;
                        }
                    }
                    if (j === children.length - 1) {
                        if (td.has('borderRightStyle') && convertInt(td.css('borderRightWidth')) > 0) {
                            borderInside |= 8;
                        }
                    }
                    if (i === table.length - 1) {
                        if (td.has('borderBottomStyle') && convertInt(td.css('borderBottomWidth')) > 0) {
                            borderInside |= 16;
                        }
                    }
                    const columnWidth = mapWidth[columnIndex[i]];
                    if (columnWidth !== 'undefined') {
                        switch (typeWidth) {
                            case 3:
                                if (columnWidth === 'auto') {
                                    if (mapPercent >= 1) {
                                        setBoundsWidth(td);
                                        td.data(EXT_NAME.TABLE, 'exceed', true);
                                        td.data(EXT_NAME.TABLE, 'downsized', true);
                                    }
                                    else {
                                        setAutoWidth(td);
                                    }
                                }
                                else if (isPercent(columnWidth)) {
                                    td.data(EXT_NAME.TABLE, 'percent', columnWidth);
                                    td.data(EXT_NAME.TABLE, 'expand', true);
                                }
                                else if (isUnit(columnWidth) && parseInt(columnWidth) > 0) {
                                    if (td.bounds.width >= parseInt(columnWidth)) {
                                        setBoundsWidth(td);
                                        td.data(EXT_NAME.TABLE, 'expand', false);
                                        td.data(EXT_NAME.TABLE, 'downsized', false);
                                    }
                                    else {
                                        if (layoutFixed) {
                                            setAutoWidth(td);
                                            td.data(EXT_NAME.TABLE, 'downsized', true);
                                        }
                                        else {
                                            setBoundsWidth(td);
                                            td.data(EXT_NAME.TABLE, 'expand', false);
                                        }
                                    }
                                }
                                else {
                                    if (!td.has('width') || td.has('width', CSS_STANDARD.PERCENT)) {
                                        setBoundsWidth(td);
                                    }
                                    td.data(EXT_NAME.TABLE, 'expand', false);
                                }
                                break;
                            case 2:
                                td.css('width', '0px');
                                break;
                            case 1:
                                if (columnWidth === 'auto') {
                                    td.css('width', '0px');
                                }
                                else {
                                    if (layoutFixed) {
                                        td.data(EXT_NAME.TABLE, 'downsized', true);
                                    }
                                    else {
                                        setBoundsWidth(td);
                                    }
                                    td.data(EXT_NAME.TABLE, 'expand', false);
                                }
                                break;
                        }
                    }
                    columnIndex[i] += element.colSpan;
                    td.parent = node;
                }
                if (columnIndex[i] < columnCount) {
                    const td = children[children.length - 1];
                    td.data(EXT_NAME.TABLE, 'spaceSpan', columnCount - columnIndex[i]);
                }
                tr.hide();
            }
            if (borderCollapse && borderInside !== 0) {
                node.css({
                    borderTopWidth: hasBit(borderInside, 2) ? '0px' : '',
                    borderRightWidth: hasBit(borderInside, 8) ? '0px' : '',
                    borderBottomWidth: hasBit(borderInside, 16) ? '0px' : '',
                    borderLeftWidth: hasBit(borderInside, 4) ? '0px' : ''
                });
            }
            const output = this.application.writeGridLayout(node, parent, columnCount, rowCount);
            return { output, complete: true };
        }
    }

    let main;
    let framework;
    exports.settings = {};
    exports.system = {};
    const extensionsAsync = new Set();
    const optionsAsync = new Map();
    function setFramework(module, cached = false) {
        if (framework !== module) {
            const appBase = cached ? module.cached() : module.create();
            if (main || Object.keys(exports.settings).length === 0) {
                exports.settings = appBase.settings;
            }
            else {
                exports.settings = Object.assign(appBase.settings, exports.settings);
            }
            main = appBase.application;
            main.settings = exports.settings;
            if (Array.isArray(exports.settings.builtInExtensions)) {
                const register = new Set();
                for (let namespace of exports.settings.builtInExtensions) {
                    namespace = namespace.trim();
                    if (main.builtInExtensions[namespace]) {
                        register.add(main.builtInExtensions[namespace]);
                    }
                    else {
                        for (const ext in main.builtInExtensions) {
                            if (ext.startsWith(`${namespace}.`)) {
                                register.add(main.builtInExtensions[ext]);
                            }
                        }
                    }
                }
                register.forEach(item => main.registerExtension(item));
            }
            framework = module;
            exports.system = module.system;
        }
        reset();
    }
    function parseDocument(...elements) {
        if (main && !main.closed) {
            if (exports.settings.handleExtensionsAsync) {
                extensionsAsync.forEach(item => main.registerExtension(item));
                for (const [name, options] of optionsAsync.entries()) {
                    configureExtension(name, options);
                }
                extensionsAsync.clear();
                optionsAsync.clear();
            }
            return main.parseDocument(...elements);
        }
        return {
            then: (callbackfn) => {
                if (!main) {
                    alert('ERROR: Framework not installed.');
                }
                else if (main.closed) {
                    if (confirm('ERROR: Document is closed. Reset and rerun?')) {
                        main.reset();
                        parseDocument.apply(null, arguments).then(callbackfn);
                    }
                }
            }
        };
    }
    function registerExtension(ext) {
        if (main && ext instanceof Extension) {
            return main.registerExtension(ext);
        }
        return false;
    }
    function registerExtensionAsync(ext) {
        if (registerExtension(ext)) {
            return true;
        }
        else if (ext instanceof Extension) {
            extensionsAsync.add(ext);
            if (exports.settings.handleExtensionsAsync) {
                return true;
            }
        }
        return false;
    }
    function configureExtension(module, options) {
        if (typeof options === 'object') {
            if (module instanceof Extension) {
                Object.assign(module.options, options);
                return true;
            }
            else if (isString(module)) {
                if (main) {
                    const ext = main.getExtension(module) || Array.from(extensionsAsync).find(item => item.name === module);
                    if (ext) {
                        Object.assign(ext.options, options);
                        return true;
                    }
                    else {
                        optionsAsync.set(module, options);
                        if (exports.settings.handleExtensionsAsync) {
                            return true;
                        }
                    }
                }
            }
        }
        return false;
    }
    function getExtension(name) {
        return main && main.getExtension(name);
    }
    function ext(module, options) {
        if (module instanceof Extension) {
            return registerExtension(module);
        }
        else if (isString(module)) {
            if (typeof options === 'object') {
                return configureExtension(module, options);
            }
            else {
                return getExtension(module);
            }
        }
    }
    function ready() {
        return main && !main.loading && !main.closed;
    }
    function close() {
        if (main && !main.loading && main.size > 0) {
            main.finalize();
        }
    }
    function reset() {
        if (main) {
            main.reset();
        }
    }
    function saveAllToDisk() {
        if (main && !main.loading && main.size > 0) {
            if (!main.closed) {
                main.finalize();
            }
            main.saveAllToDisk();
        }
    }
    function toString() {
        return main ? main.toString() : '';
    }
    const lib = {
        base: {
            Node,
            NodeList,
            NodeGroup,
            Svg,
            SvgElement,
            SvgGroup,
            SvgImage,
            SvgPath,
            Application,
            Controller,
            Resource,
            File,
            Extension,
            extensions: {
                Accessibility,
                Button,
                Custom,
                External,
                Grid,
                List,
                Nav,
                Origin,
                Percent,
                Sprite,
                Table
            }
        },
        enumeration,
        constant,
        util,
        dom,
        xml,
        svg,
        color
    };

    exports.setFramework = setFramework;
    exports.parseDocument = parseDocument;
    exports.registerExtension = registerExtension;
    exports.registerExtensionAsync = registerExtensionAsync;
    exports.configureExtension = configureExtension;
    exports.getExtension = getExtension;
    exports.ext = ext;
    exports.ready = ready;
    exports.close = close;
    exports.reset = reset;
    exports.saveAllToDisk = saveAllToDisk;
    exports.toString = toString;
    exports.lib = lib;

    Object.defineProperty(exports, '__esModule', { value: true });

})));
