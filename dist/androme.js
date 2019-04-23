/* androme 2.4.1
   https://github.com/anpham6/androme */

(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
    typeof define === 'function' && define.amd ? define(['exports'], factory) :
    (global = global || self, factory(global.androme = {}));
}(this, function (exports) { 'use strict';

    var APP_SECTION;
    (function (APP_SECTION) {
        APP_SECTION[APP_SECTION["NONE"] = 0] = "NONE";
        APP_SECTION[APP_SECTION["DOM_TRAVERSE"] = 2] = "DOM_TRAVERSE";
        APP_SECTION[APP_SECTION["EXTENSION"] = 4] = "EXTENSION";
        APP_SECTION[APP_SECTION["RENDER"] = 8] = "RENDER";
        APP_SECTION[APP_SECTION["ALL"] = 14] = "ALL";
    })(APP_SECTION || (APP_SECTION = {}));
    var NODE_RESOURCE;
    (function (NODE_RESOURCE) {
        NODE_RESOURCE[NODE_RESOURCE["NONE"] = 0] = "NONE";
        NODE_RESOURCE[NODE_RESOURCE["BOX_STYLE"] = 2] = "BOX_STYLE";
        NODE_RESOURCE[NODE_RESOURCE["BOX_SPACING"] = 4] = "BOX_SPACING";
        NODE_RESOURCE[NODE_RESOURCE["FONT_STYLE"] = 8] = "FONT_STYLE";
        NODE_RESOURCE[NODE_RESOURCE["VALUE_STRING"] = 16] = "VALUE_STRING";
        NODE_RESOURCE[NODE_RESOURCE["IMAGE_SOURCE"] = 32] = "IMAGE_SOURCE";
        NODE_RESOURCE[NODE_RESOURCE["ASSET"] = 56] = "ASSET";
        NODE_RESOURCE[NODE_RESOURCE["ALL"] = 126] = "ALL";
    })(NODE_RESOURCE || (NODE_RESOURCE = {}));
    var NODE_PROCEDURE;
    (function (NODE_PROCEDURE) {
        NODE_PROCEDURE[NODE_PROCEDURE["NONE"] = 0] = "NONE";
        NODE_PROCEDURE[NODE_PROCEDURE["CONSTRAINT"] = 2] = "CONSTRAINT";
        NODE_PROCEDURE[NODE_PROCEDURE["LAYOUT"] = 4] = "LAYOUT";
        NODE_PROCEDURE[NODE_PROCEDURE["ALIGNMENT"] = 8] = "ALIGNMENT";
        NODE_PROCEDURE[NODE_PROCEDURE["AUTOFIT"] = 16] = "AUTOFIT";
        NODE_PROCEDURE[NODE_PROCEDURE["OPTIMIZATION"] = 32] = "OPTIMIZATION";
        NODE_PROCEDURE[NODE_PROCEDURE["CUSTOMIZATION"] = 64] = "CUSTOMIZATION";
        NODE_PROCEDURE[NODE_PROCEDURE["ACCESSIBILITY"] = 128] = "ACCESSIBILITY";
        NODE_PROCEDURE[NODE_PROCEDURE["LOCALIZATION"] = 256] = "LOCALIZATION";
        NODE_PROCEDURE[NODE_PROCEDURE["POSITIONAL"] = 46] = "POSITIONAL";
        NODE_PROCEDURE[NODE_PROCEDURE["NONPOSITIONAL"] = 464] = "NONPOSITIONAL";
        NODE_PROCEDURE[NODE_PROCEDURE["ALL"] = 510] = "ALL";
    })(NODE_PROCEDURE || (NODE_PROCEDURE = {}));

    var enumeration = /*#__PURE__*/Object.freeze({
        get APP_SECTION () { return APP_SECTION; },
        get NODE_RESOURCE () { return NODE_RESOURCE; },
        get NODE_PROCEDURE () { return NODE_PROCEDURE; }
    });

    const CSS_SPACING = new Map([
        [2 /* MARGIN_TOP */, 'marginTop'],
        [4 /* MARGIN_RIGHT */, 'marginRight'],
        [8 /* MARGIN_BOTTOM */, 'marginBottom'],
        [16 /* MARGIN_LEFT */, 'marginLeft'],
        [32 /* PADDING_TOP */, 'paddingTop'],
        [64 /* PADDING_RIGHT */, 'paddingRight'],
        [128 /* PADDING_BOTTOM */, 'paddingBottom'],
        [256 /* PADDING_LEFT */, 'paddingLeft']
    ]);
    const ELEMENT_BLOCK = [
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
    const ELEMENT_INLINE = [
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
        CSS_GRID: 'androme.css-grid',
        EXTERNAL: 'androme.external',
        FLEXBOX: 'androme.flexbox',
        GRID: 'androme.grid',
        LIST: 'androme.list',
        RELATIVE: 'androme.relative',
        SPRITE: 'androme.sprite',
        SUBSTITUTE: 'androme.substitute',
        TABLE: 'androme.table',
        VERTICAL_ALIGN: 'androme.verticalalign',
        WHITESPACE: 'androme.whitespace'
    };
    const REGEX_PATTERN = {
        CSS_URL: /url\("?(.*?)"?\)/,
        LINK_HREF: /url\("?#(.*?)"?\)/,
        URI: /^[A-Za-z]+:\/\//,
        UNIT: /^(?:\s*(-?[\d.]+)(px|em|ch|pc|pt|vw|vh|vmin|vmax|mm|cm|in))+$/
    };

    var constant = /*#__PURE__*/Object.freeze({
        CSS_SPACING: CSS_SPACING,
        ELEMENT_BLOCK: ELEMENT_BLOCK,
        ELEMENT_INLINE: ELEMENT_INLINE,
        EXT_NAME: EXT_NAME,
        REGEX_PATTERN: REGEX_PATTERN
    });

    const ALPHABET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const NUMERALS = [
        '', 'C', 'CC', 'CCC', 'CD', 'D', 'DC', 'DCC', 'DCCC', 'CM',
        '', 'X', 'XX', 'XXX', 'XL', 'L', 'LX', 'LXX', 'LXXX', 'XC',
        '', 'I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX'
    ];
    function sort(list, asc, ...attrs) {
        return list.sort((a, b) => {
            for (const attr of attrs) {
                const result = compareObject(a, b, attr, true);
                if (result && result[0] !== result[1]) {
                    if (asc === 1) {
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
    function compareObject(obj1, obj2, attr, numeric) {
        const namespaces = attr.split('.');
        let current1 = obj1;
        let current2 = obj2;
        for (const name of namespaces) {
            if (current1[name] !== undefined && current2[name] !== undefined) {
                current1 = current1[name];
                current2 = current2[name];
            }
            else if (current1[name] === undefined && current2[name] === undefined) {
                return false;
            }
            else if (current1[name] !== undefined) {
                return [1, 0];
            }
            else {
                return [0, 1];
            }
        }
        if (numeric) {
            const value1 = parseInt(current1);
            const value2 = parseInt(current2);
            if (!isNaN(value1) && !isNaN(value2)) {
                return [value1, value2];
            }
            else if (!isNaN(value1)) {
                return [1, 0];
            }
            else if (!isNaN(value2)) {
                return [0, 1];
            }
        }
        return [current1, current2];
    }
    function formatString(value, ...params) {
        for (let i = 0; i < params.length; i++) {
            value = value.replace(`{${i}}`, params[i]);
        }
        return value;
    }
    function capitalize(value, upper = true) {
        if (value !== '') {
            if (upper) {
                return value.charAt(0).toUpperCase() + value.substring(1).toLowerCase();
            }
            else {
                return value.charAt(0).toLowerCase() + value.substring(1);
            }
        }
        return value;
    }
    function convertUnderscore(value) {
        value = value.charAt(0).toLowerCase() + value.substring(1);
        const matchArray = value.match(/([a-z][A-Z])/g);
        if (matchArray) {
            matchArray.forEach(match => value = value.replace(match, `${match[0]}_${match[1].toLowerCase()}`));
        }
        return value;
    }
    function convertCamelCase(value, char = '-') {
        const matchArray = value.replace(new RegExp(`^${char}+`), '').match(new RegExp(`(${char}[a-z])`, 'g'));
        if (matchArray) {
            matchArray.forEach(match => value = value.replace(match, match[1].toUpperCase()));
        }
        return value;
    }
    function convertWord(value) {
        return value ? value.replace(/[^\w]/g, '_').trim() : '';
    }
    function convertAngle(value, unit = 'deg') {
        let angle = parseFloat(value);
        switch (unit) {
            case 'rad':
                angle *= 180 / Math.PI;
                break;
            case 'grad':
                angle /= 400;
            case 'turn':
                angle *= 360;
                break;
        }
        return angle;
    }
    function convertInt(value) {
        return (value && parseInt(value)) || 0;
    }
    function convertFloat(value) {
        return (value && parseFloat(value)) || 0;
    }
    function convertPX(value, fontSize) {
        if (value) {
            if (isNumber(value)) {
                return `${Math.round(value)}px`;
            }
            else {
                value = value.trim();
                if (value.endsWith('px') || value.endsWith('%') || value === 'auto') {
                    return value;
                }
            }
            const match = value.match(REGEX_PATTERN.UNIT);
            if (match) {
                let result = parseFloat(match[1]);
                switch (match[2]) {
                    case 'em':
                    case 'ch':
                        result *= fontSize || 16;
                        break;
                    case 'pc':
                        result *= 12;
                    case 'pt':
                        result *= 4 / 3;
                        break;
                    case 'vw':
                        result *= window.innerWidth / 100;
                        break;
                    case 'vh':
                        result *= window.innerHeight / 100;
                        break;
                    case 'vmin':
                        result *= Math.min(window.innerWidth, window.innerHeight) / 100;
                        break;
                    case 'vmax':
                        result *= Math.max(window.innerWidth, window.innerHeight) / 100;
                        break;
                    case 'mm':
                        result /= 10;
                    case 'cm':
                        result /= 2.54;
                    case 'in':
                        result *= window.devicePixelRatio * 96;
                        break;
                }
                return `${result}px`;
            }
        }
        return '0px';
    }
    function convertPercent(value, precision = 0) {
        return value < 1 ? `${precision === 0 ? Math.round(value * 100) : parseFloat((value * 100).toFixed(precision))}%` : `100%`;
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
    function formatPercent(value) {
        value = parseFloat(value);
        if (!isNaN(value)) {
            return value < 1 ? convertPercent(value) : `${Math.round(value)}%`;
        }
        return '0%';
    }
    function hasBit(value, type) {
        return (value & type) === type;
    }
    function isNumber(value) {
        return typeof value === 'number' || /^-?\d+(\.\d+)?$/.test(value.trim());
    }
    function isString(value) {
        return typeof value === 'string' && value !== '';
    }
    function isArray(value) {
        return Array.isArray(value) && value.length > 0;
    }
    function isUnit(value) {
        return REGEX_PATTERN.UNIT.test(value);
    }
    function isPercent(value) {
        return /^\d+(\.\d+)?%$/.test(value);
    }
    function includes(source, value, delimiter = ',') {
        return source ? source.split(delimiter).map(segment => segment.trim()).includes(value) : false;
    }
    function optional(obj, value, type) {
        let valid = false;
        let result;
        if (obj && typeof obj === 'object') {
            result = obj;
            const attrs = value.split('.');
            let i = 0;
            do {
                result = result[attrs[i]];
            } while (result !== null &&
                result !== undefined &&
                ++i < attrs.length &&
                typeof result !== 'string' &&
                typeof result !== 'number' &&
                typeof result !== 'boolean');
            valid = result !== undefined && result !== null && i === attrs.length;
        }
        switch (type) {
            case 'object':
                return valid ? result : null;
            case 'number':
                return valid && !isNaN(parseInt(result)) ? parseInt(result) : 0;
            case 'boolean':
                return valid && result === true;
            default:
                return valid ? result.toString() : '';
        }
    }
    function optionalAsObject(obj, value) {
        return optional(obj, value, 'object');
    }
    function optionalAsString(obj, value) {
        return optional(obj, value, 'string');
    }
    function optionalAsNumber(obj, value) {
        return optional(obj, value, 'number');
    }
    function optionalAsBoolean(obj, value) {
        return optional(obj, value, 'boolean');
    }
    function resolvePath(value) {
        if (!REGEX_PATTERN.URI.test(value)) {
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
    function minArray(list) {
        if (list.length) {
            return Math.min.apply(null, list);
        }
        return Number.MAX_VALUE;
    }
    function maxArray(list) {
        if (list.length) {
            return Math.max.apply(null, list);
        }
        return Number.MAX_VALUE * -1;
    }
    function hasSameValue(obj1, obj2, ...attrs) {
        for (const attr of attrs) {
            const value = compareObject(obj1, obj2, attr, false);
            if (!value || value[0] !== value[1]) {
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
            let filter = (a) => a === value;
            if (/^\*.+\*$/.test(value)) {
                filter = (a) => a.indexOf(value.replace(/\*/g, '')) !== -1;
            }
            else if (/^\*/.test(value)) {
                filter = (a) => a.endsWith(value.replace(/\*/, ''));
            }
            else if (/\*$/.test(value)) {
                filter = (a) => a.startsWith(value.replace(/\*/, ''));
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
    function assignWhenNull(destination, source) {
        for (const attr in source) {
            if (!hasValue(destination[attr])) {
                destination[attr] = source[attr];
            }
        }
    }
    function defaultWhenNull(options, ...attrs) {
        let current = options;
        for (let i = 0; i < attrs.length - 1; i++) {
            const value = attrs[i];
            if (i === attrs.length - 2) {
                if (!hasValue(current[value])) {
                    current[value] = attrs[i + 1];
                }
            }
            else if (isString(value)) {
                if (typeof current[value] === 'object') {
                    current = current[value];
                }
                else if (current[value] === undefined) {
                    current[value] = {};
                    current = current[value];
                }
                else {
                    break;
                }
            }
            else {
                break;
            }
        }
    }
    function filterArray(list, predicate) {
        const result = [];
        for (let i = 0; i < list.length; i++) {
            if (predicate(list[i], i, list)) {
                result.push(list[i]);
            }
        }
        return result;
    }
    function partition(list, predicate) {
        const valid = [];
        const invalid = [];
        for (let i = 0; i < list.length; i++) {
            const item = list[i];
            if (predicate(item, i, list)) {
                valid.push(item);
            }
            else {
                invalid.push(item);
            }
        }
        return [valid, invalid];
    }
    function flatArray(list) {
        let current = list;
        while (current.some(item => Array.isArray(item))) {
            current = [].concat.apply([], current.filter(item => item));
        }
        return current;
    }
    function flatMap(list, predicate) {
        return list.map((item, index) => predicate(item, index, list)).filter((item) => hasValue(item));
    }
    function sortAsc(list, ...attrs) {
        return sort(list, 1, ...attrs);
    }
    function sortDesc(list, ...attrs) {
        return sort(list, 2, ...attrs);
    }

    var util = /*#__PURE__*/Object.freeze({
        formatString: formatString,
        capitalize: capitalize,
        convertUnderscore: convertUnderscore,
        convertCamelCase: convertCamelCase,
        convertWord: convertWord,
        convertAngle: convertAngle,
        convertInt: convertInt,
        convertFloat: convertFloat,
        convertPX: convertPX,
        convertPercent: convertPercent,
        convertAlpha: convertAlpha,
        convertRoman: convertRoman,
        convertEnum: convertEnum,
        formatPX: formatPX,
        formatPercent: formatPercent,
        hasBit: hasBit,
        isNumber: isNumber,
        isString: isString,
        isArray: isArray,
        isUnit: isUnit,
        isPercent: isPercent,
        includes: includes,
        optional: optional,
        optionalAsObject: optionalAsObject,
        optionalAsString: optionalAsString,
        optionalAsNumber: optionalAsNumber,
        optionalAsBoolean: optionalAsBoolean,
        resolvePath: resolvePath,
        trimNull: trimNull,
        trimString: trimString,
        trimStart: trimStart,
        trimEnd: trimEnd,
        repeat: repeat,
        indexOf: indexOf,
        lastIndexOf: lastIndexOf,
        minArray: minArray,
        maxArray: maxArray,
        hasSameValue: hasSameValue,
        searchObject: searchObject,
        hasValue: hasValue,
        withinRange: withinRange,
        withinFraction: withinFraction,
        assignWhenNull: assignWhenNull,
        defaultWhenNull: defaultWhenNull,
        filterArray: filterArray,
        partition: partition,
        flatArray: flatArray,
        flatMap: flatMap,
        sortAsc: sortAsc,
        sortDesc: sortDesc
    });

    class Container {
        constructor(children) {
            this._children = [];
            if (Array.isArray(children)) {
                this.retain(children);
            }
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
            if (index !== undefined && value !== undefined) {
                if (index >= 0 && index < this._children.length) {
                    this._children[index] = value;
                    return value;
                }
            }
            else {
                if (index === undefined) {
                    return this._children[this._children.length - 1];
                }
                return this._children[index];
            }
            return undefined;
        }
        append(item) {
            this._children.push(item);
            return this;
        }
        remove(item) {
            for (let i = 0; i < this._children.length; i++) {
                if (item === this._children[i]) {
                    return this._children.splice(i, 1);
                }
            }
            return [];
        }
        contains(item) {
            return this._children.includes(item);
        }
        retain(list) {
            this._children = list;
            return this;
        }
        duplicate() {
            return this._children.slice(0);
        }
        clear() {
            this._children.length = 0;
            return this;
        }
        each(predicate) {
            this._children.forEach(predicate);
            return this;
        }
        find(predicate, value) {
            if (typeof predicate === 'string') {
                return this._children.find(item => item[predicate] === value);
            }
            else {
                return this._children.find(predicate);
            }
        }
        filter(predicate) {
            return this._children.filter(predicate);
        }
        map(predicate) {
            return this._children.map(predicate);
        }
        flatMap(predicate) {
            return this._children.map(predicate).filter(item => item);
        }
        partition(predicate) {
            return partition(this._children, predicate);
        }
        sort(predicate) {
            this._children.sort(predicate);
            return this;
        }
        every(predicate) {
            return this.length > 0 && this._children.every(predicate);
        }
        some(predicate) {
            return this._children.some(predicate);
        }
        get children() {
            return this._children;
        }
        get length() {
            return this._children.length;
        }
    }

    function isUserAgent(value) {
        let client = 2 /* CHROME */;
        if (navigator.userAgent.indexOf('Edge') !== -1) {
            client = 8 /* EDGE */;
        }
        else if (navigator.userAgent.indexOf('Firefox') !== -1) {
            client = 16 /* FIREFOX */;
        }
        else if (navigator.userAgent.indexOf('Chrome') === -1 && navigator.userAgent.indexOf('Safari') !== -1) {
            client = 4 /* SAFARI */;
        }
        return hasBit(value, client);
    }
    function checkStyleAttribute(element, attr, value, style, fontSize) {
        if (style === undefined) {
            style = getStyle(element);
        }
        if (value === 'inherit') {
            value = cssInheritStyle(element.parentElement, attr);
        }
        if (value !== 'initial') {
            if (value !== style[attr]) {
                switch (attr) {
                    case 'backgroundColor':
                    case 'borderTopColor':
                    case 'borderRightColor':
                    case 'borderBottomColor':
                    case 'borderLeftColor':
                    case 'color':
                    case 'fontSize':
                    case 'fontWeight':
                        return style[attr] || value;
                    case 'width':
                    case 'height':
                    case 'minWidth':
                    case 'maxWidth':
                    case 'minHeight':
                    case 'maxHeight':
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
                        return /^[A-Za-z\-]+$/.test(value) || isPercent(value) ? value : convertPX(value, fontSize);
                }
            }
            return value;
        }
        return '';
    }
    function getDataSet(element, prefix) {
        const result = {};
        if (hasComputedStyle(element) || element instanceof SVGElement) {
            prefix = convertCamelCase(prefix, '\\.');
            for (const attr in element.dataset) {
                if (attr.length > prefix.length && attr.startsWith(prefix)) {
                    result[capitalize(attr.substring(prefix.length), false)] = element.dataset[attr];
                }
            }
        }
        return result;
    }
    function newBoxRect() {
        return {
            top: 0,
            left: 0,
            right: 0,
            bottom: 0
        };
    }
    function newRectDimension() {
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
    function createElement(parent, block = false) {
        const element = document.createElement(block ? 'div' : 'span');
        const style = element.style;
        style.position = 'static';
        style.margin = '0px';
        style.padding = '0px';
        style.border = 'none';
        style.cssFloat = 'none';
        style.clear = 'none';
        style.display = 'none';
        element.className = '__css.placeholder';
        if (parent instanceof HTMLElement) {
            parent.appendChild(element);
        }
        return element;
    }
    function removeElementsByClassName(className) {
        Array.from(document.getElementsByClassName(className)).forEach(element => element.parentElement && element.parentElement.removeChild(element));
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
        let bounds = newRectDimension();
        let multiLine = 0;
        if (domRect.length) {
            bounds = assignBounds(domRect[0]);
            const top = new Set([bounds.top]);
            const bottom = new Set([bounds.bottom]);
            for (let i = 1; i < domRect.length; i++) {
                const rect = domRect[i];
                top.add(rect.top);
                bottom.add(rect.bottom);
                bounds.width += rect.width;
                bounds.right = Math.max(rect.right, bounds.right);
                bounds.height = Math.max(rect.height, bounds.height);
            }
            if (top.size > 1 && bottom.size > 1) {
                bounds.top = minArray(Array.from(top));
                bounds.bottom = maxArray(Array.from(bottom));
                if (domRect[domRect.length - 1].top >= domRect[0].bottom && element.textContent && (element.textContent.trim() !== '' || /^\s*\n/.test(element.textContent))) {
                    multiLine = domRect.length - 1;
                }
            }
        }
        return Object.assign(bounds, { multiLine });
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
                const style = getElementCache(element, 'style');
                if (style) {
                    return style;
                }
                else {
                    const node = getElementAsNode(element);
                    if (node) {
                        if (node.style) {
                            return node.style;
                        }
                        else if (node.plainText) {
                            return node.unsafe('styleMap');
                        }
                    }
                }
            }
            if (element.nodeName.charAt(0) !== '#') {
                const style = getComputedStyle(element);
                setElementCache(element, 'style', style);
                return style;
            }
            return {};
        }
        return { display: 'none' };
    }
    function getBoxSpacing(element) {
        const result = {};
        const node = getElementAsNode(element) || getStyle(element);
        for (const attr of CSS_SPACING.values()) {
            result[attr] = convertInt(node[attr]);
        }
        return result;
    }
    function cssResolveUrl(value) {
        const match = value.match(REGEX_PATTERN.CSS_URL);
        if (match) {
            return resolvePath(match[1]);
        }
        return '';
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
        if (element.parentElement && hasComputedStyle(element)) {
            const node = getElementAsNode(element);
            const style = getStyle(element);
            if (node && style) {
                return style[attr] === getStyle(element.parentElement)[attr] && !node.cssInitial(attr);
            }
        }
        return false;
    }
    function cssInline(element, attr) {
        let value = '';
        if (typeof element['style'] === 'object') {
            value = element['style'][attr];
        }
        if (!value) {
            const styleMap = getElementCache(element, 'styleMap');
            if (styleMap) {
                value = styleMap[attr];
            }
        }
        return value || '';
    }
    function cssAttribute(element, attr, computed = false) {
        const node = getElementAsNode(element);
        const name = convertCamelCase(attr);
        return node && node.cssInitial(name) || cssInline(element, name) || getNamedItem(element, attr) || computed && getStyle(element)[name] || '';
    }
    function cssInheritAttribute(element, attr) {
        let current = element;
        let value = '';
        while (current) {
            value = cssAttribute(current, attr);
            if (value !== '' && value !== 'inherit') {
                break;
            }
            current = current.parentElement;
        }
        return value;
    }
    function cssInheritStyle(element, attr, exclude, tagNames) {
        let result = '';
        if (element) {
            let current = element.parentElement;
            while (current && (tagNames === undefined || !tagNames.includes(current.tagName))) {
                result = getStyle(current)[attr];
                if (result === 'inherit' || exclude && exclude.some(value => result.indexOf(value) !== -1)) {
                    result = '';
                }
                if (current === document.body || result) {
                    break;
                }
                current = current.parentElement;
            }
        }
        return result || '';
    }
    function getNamedItem(element, attr) {
        if (element) {
            const item = element.attributes.getNamedItem(attr);
            if (item) {
                return item.value.trim();
            }
        }
        return '';
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
        const orientation = value === 'center' ? ['center', 'center'] : value.split(' ');
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
                                        result.originalX = formatPercent(100 - parseInt(position));
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
                                        result.originalY = formatPercent(100 - parseInt(position));
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
    function getFirstChildElement(element, lineBreak = false) {
        if (element instanceof HTMLElement) {
            for (let i = 0; i < element.childNodes.length; i++) {
                const node = getElementAsNode(element.childNodes[i]);
                if (node && (!node.excluded || (lineBreak && node.lineBreak))) {
                    return node.element;
                }
            }
        }
        return null;
    }
    function getLastChildElement(element, lineBreak = false) {
        if (element instanceof HTMLElement) {
            for (let i = element.childNodes.length - 1; i >= 0; i--) {
                const node = getElementAsNode(element.childNodes[i]);
                if (node && (!node.excluded || (lineBreak && node.lineBreak))) {
                    return node.element;
                }
            }
        }
        return null;
    }
    function hasFreeFormText(element, whiteSpace = true) {
        function findFreeForm(elements) {
            return elements.some((child) => {
                if (child.nodeName === '#text') {
                    if (isPlainText(child, whiteSpace) || cssParent(child, 'whiteSpace', 'pre', 'pre-wrap') && child.textContent && child.textContent !== '') {
                        return true;
                    }
                }
                else if (child instanceof HTMLElement && withinViewportOrigin(child) && child.childNodes.length && findFreeForm(Array.from(child.childNodes))) {
                    return true;
                }
                return false;
            });
        }
        if (element.nodeName === '#text') {
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
    function hasLineBreak(element, lineBreak = false, trimString = false) {
        if (element) {
            let value = element.textContent || '';
            if (trimString) {
                value = value.trim();
            }
            if (element instanceof HTMLElement && element.children.length && Array.from(element.children).some(item => item.tagName === 'BR')) {
                return true;
            }
            else if (!lineBreak && /\n/.test(value)) {
                const node = getElementAsNode(element);
                const whiteSpace = node ? node.css('whiteSpace') : (getStyle(element).whiteSpace || '');
                return ['pre', 'pre-wrap'].includes(whiteSpace) || element.nodeName === '#text' && cssParent(element, 'whiteSpace', 'pre', 'pre-wrap');
            }
        }
        return false;
    }
    function isLineBreak(element, excluded = true) {
        const node = getElementAsNode(element);
        if (node) {
            return node.tagName === 'BR' || excluded && node.excluded && node.blockStatic;
        }
        return false;
    }
    function getElementsBetween(elementStart, elementEnd, whiteSpace = false, asNode = false) {
        if (!elementStart || elementStart.parentElement === elementEnd.parentElement) {
            const parent = elementEnd.parentElement;
            if (parent) {
                const elements = Array.from(parent.childNodes);
                const indexStart = elementStart ? elements.findIndex(element => element === elementStart) : 0;
                const indexEnd = elements.findIndex(element => element === elementEnd);
                if (indexStart !== -1 && indexEnd !== -1 && indexStart !== indexEnd) {
                    let result = elements.slice(Math.min(indexStart, indexEnd) + 1, Math.max(indexStart, indexEnd));
                    if (whiteSpace) {
                        result = result.filter(element => element.nodeName !== '#comment');
                    }
                    else {
                        result = result.filter(element => {
                            if (element.nodeName.charAt(0) === '#') {
                                return isPlainText(element);
                            }
                            return true;
                        });
                    }
                    if (asNode) {
                        result = result.filter(element => getElementAsNode(element));
                    }
                    return result;
                }
            }
        }
        return [];
    }
    function getPreviousElementSibling(element) {
        element = element.previousSibling;
        while (element) {
            const node = getElementAsNode(element);
            if (node && (!node.excluded || node.lineBreak)) {
                return node.element;
            }
            element = element.previousSibling;
        }
        return null;
    }
    function getNextElementSibling(element) {
        element = element.nextSibling;
        while (element) {
            const node = getElementAsNode(element);
            if (node && (!node.excluded || node.lineBreak)) {
                return node.element;
            }
            element = element.nextSibling;
        }
        return null;
    }
    function hasComputedStyle(element) {
        return element instanceof HTMLElement || element instanceof SVGSVGElement;
    }
    function withinViewportOrigin(element) {
        const bounds = element.getBoundingClientRect();
        if (bounds.width !== 0 && bounds.height !== 0) {
            return !(bounds.left < 0 && bounds.top < 0 && Math.abs(bounds.left) >= bounds.width && Math.abs(bounds.top) >= bounds.height);
        }
        return false;
    }
    function setElementCache(element, attr, data) {
        element[`__${attr}`] = data;
    }
    function getElementCache(element, attr) {
        return element[`__${attr}`] || undefined;
    }
    function deleteElementCache(element, ...attrs) {
        for (const attr of attrs) {
            delete element[`__${attr}`];
        }
    }
    function getElementAsNode(element) {
        return isString(element.className) && element.className.startsWith('androme') ? undefined : getElementCache(element, 'node');
    }

    var dom = /*#__PURE__*/Object.freeze({
        isUserAgent: isUserAgent,
        checkStyleAttribute: checkStyleAttribute,
        getDataSet: getDataSet,
        newBoxRect: newBoxRect,
        newRectDimension: newRectDimension,
        newBoxModel: newBoxModel,
        createElement: createElement,
        removeElementsByClassName: removeElementsByClassName,
        convertClientUnit: convertClientUnit,
        getRangeClientRect: getRangeClientRect,
        assignBounds: assignBounds,
        getStyle: getStyle,
        getBoxSpacing: getBoxSpacing,
        cssResolveUrl: cssResolveUrl,
        cssParent: cssParent,
        cssFromParent: cssFromParent,
        cssInline: cssInline,
        cssAttribute: cssAttribute,
        cssInheritAttribute: cssInheritAttribute,
        cssInheritStyle: cssInheritStyle,
        getNamedItem: getNamedItem,
        getBackgroundPosition: getBackgroundPosition,
        getFirstChildElement: getFirstChildElement,
        getLastChildElement: getLastChildElement,
        hasFreeFormText: hasFreeFormText,
        isPlainText: isPlainText,
        hasLineBreak: hasLineBreak,
        isLineBreak: isLineBreak,
        getElementsBetween: getElementsBetween,
        getPreviousElementSibling: getPreviousElementSibling,
        getNextElementSibling: getNextElementSibling,
        hasComputedStyle: hasComputedStyle,
        withinViewportOrigin: withinViewportOrigin,
        setElementCache: setElementCache,
        getElementCache: getElementCache,
        deleteElementCache: deleteElementCache,
        getElementAsNode: getElementAsNode
    });

    class NodeList extends Container {
        constructor(children) {
            super(children);
            this._currentId = 0;
        }
        static actualParent(list) {
            for (const node of list) {
                if (node.naturalElement && node.actualParent) {
                    return node.actualParent;
                }
            }
            return undefined;
        }
        static baseline(list, text = false) {
            let baseline = list.filter(item => {
                if (item.baseline || isUnit(item.verticalAlign) && item.verticalAlign !== '0px') {
                    const position = item.cssInitial('position');
                    return position !== 'absolute' && position !== 'fixed';
                }
                return false;
            });
            if (baseline.length) {
                list = baseline;
            }
            baseline = list.filter(item => item.textElement || item.verticalAlign !== 'text-top' && item.verticalAlign !== 'text-bottom');
            if (baseline.length) {
                list = baseline;
            }
            if (text) {
                list = list.filter(item => item.baseElement && !item.imageElement);
            }
            const lineHeight = maxArray(list.map(node => node.lineHeight));
            const boundsHeight = maxArray(list.map(node => node.bounds.height));
            return list.filter(item => lineHeight > boundsHeight ? item.lineHeight === lineHeight : item.bounds.height === boundsHeight).sort((a, b) => {
                if (a.groupParent || a.length > 0 || (!a.baseline && b.baseline)) {
                    return 1;
                }
                else if (b.groupParent || b.length > 0 || (a.baseline && !b.baseline)) {
                    return -1;
                }
                if (!a.imageElement || !b.imageElement) {
                    if (a.multiLine || b.multiLine) {
                        if (a.lineHeight && b.lineHeight) {
                            return a.lineHeight <= b.lineHeight ? 1 : -1;
                        }
                        else if (a.fontSize === b.fontSize) {
                            return a.htmlElement || !b.htmlElement ? -1 : 1;
                        }
                    }
                    if (a.containerType !== b.containerType) {
                        if (a.textElement || a.imageElement) {
                            return -1;
                        }
                        else if (b.textElement || b.imageElement) {
                            return 1;
                        }
                        return a.containerType < b.containerType ? -1 : 1;
                    }
                    else if (b.imageElement) {
                        return -1;
                    }
                    else if (a.imageElement) {
                        return 1;
                    }
                    else {
                        if (a.fontSize === b.fontSize) {
                            if (a.htmlElement && !b.htmlElement) {
                                return -1;
                            }
                            else if (!a.htmlElement && b.htmlElement) {
                                return 1;
                            }
                            else {
                                return a.siblingIndex >= b.siblingIndex ? 1 : -1;
                            }
                        }
                        else if (a.fontSize !== b.fontSize && a.fontSize > 0 && b.fontSize > 0) {
                            return a.fontSize > b.fontSize ? -1 : 1;
                        }
                    }
                }
                return 0;
            });
        }
        static floated(list) {
            return new Set(list.map(node => node.float).filter(value => value !== 'none'));
        }
        static cleared(list, parent = true) {
            if (parent && list.length > 1) {
                list.slice(0).sort(this.siblingIndex);
                const actualParent = this.actualParent(list);
                if (actualParent) {
                    const nodes = [];
                    const listEnd = list[list.length - 1];
                    let valid = false;
                    for (let i = 0; i < actualParent.element.childNodes.length; i++) {
                        const node = getElementAsNode(actualParent.element.childNodes[i]);
                        if (node) {
                            if (node === list[0]) {
                                valid = true;
                            }
                            if (valid) {
                                nodes.push(node);
                            }
                            if (node === listEnd) {
                                break;
                            }
                        }
                    }
                    if (nodes.length >= list.length) {
                        list = nodes;
                    }
                }
            }
            const result = new Map();
            const floated = new Set();
            const previous = {
                left: null,
                right: null
            };
            for (const node of list) {
                if (node.pageFlow) {
                    const clear = node.css('clear');
                    if (floated.size) {
                        const previousFloat = clear === 'both' ? [previous.left, previous.right]
                            : clear === 'left' ? [previous.left, null]
                                : clear === 'right' ? [null, previous.right] : [];
                        previousFloat.forEach(item => {
                            if (item && !node.floating && node.linear.top > item.linear.bottom && floated.has(item.float)) {
                                floated.delete(item.float);
                                previous[item.float] = null;
                            }
                        });
                        if (clear === 'both') {
                            result.set(node, floated.size === 2 ? 'both' : floated.values().next().value);
                            floated.clear();
                            previous.left = null;
                            previous.right = null;
                        }
                        else if (floated.has(clear)) {
                            result.set(node, clear);
                            floated.delete(clear);
                            previous[clear] = null;
                        }
                    }
                    if (node.floating) {
                        floated.add(node.float);
                        previous[node.float] = node;
                    }
                }
            }
            return result;
        }
        static floatedAll(parent) {
            return this.floated(parent.actualChildren.filter(item => item.pageFlow));
        }
        static clearedAll(parent) {
            return this.cleared(parent.actualChildren.filter(item => item.pageFlow), false);
        }
        static linearX(list) {
            const nodes = list.filter(node => node.pageFlow).sort(NodeList.siblingIndex);
            switch (nodes.length) {
                case 0:
                    return false;
                case 1:
                    return true;
                default:
                    const parent = this.actualParent(nodes);
                    if (parent) {
                        const cleared = this.clearedAll(parent);
                        for (let i = 1; i < nodes.length; i++) {
                            if (nodes[i].alignedVertically(nodes[i].previousSiblings(), undefined, cleared)) {
                                return false;
                            }
                        }
                        let boxLeft = Number.MAX_VALUE;
                        let boxRight = -Number.MAX_VALUE;
                        let floatLeft = -Number.MAX_VALUE;
                        let floatRight = Number.MAX_VALUE;
                        for (const node of nodes) {
                            boxLeft = Math.min(boxLeft, node.linear.left);
                            boxRight = Math.max(boxRight, node.linear.right);
                            if (node.floating) {
                                if (node.float === 'left') {
                                    floatLeft = Math.max(floatLeft, node.linear.right);
                                }
                                else {
                                    floatRight = Math.min(floatRight, node.linear.left);
                                }
                            }
                        }
                        for (let i = 0, j = 0, k = 0, l = 0, m = 0; i < nodes.length; i++) {
                            const item = nodes[i];
                            if (Math.floor(item.linear.left) <= boxLeft) {
                                j++;
                            }
                            if (Math.ceil(item.linear.right) >= boxRight) {
                                k++;
                            }
                            if (!item.floating) {
                                if (item.linear.left === floatLeft) {
                                    l++;
                                }
                                if (item.linear.right === floatRight) {
                                    m++;
                                }
                            }
                            if (i === 0) {
                                continue;
                            }
                            if (j === 2 || k === 2 || l === 2 || m === 2) {
                                return false;
                            }
                            const previous = nodes[i - 1];
                            if (previous.floating && item.linear.top >= previous.linear.bottom || withinFraction(item.linear.left, previous.linear.left)) {
                                return false;
                            }
                        }
                        return true;
                    }
                    return false;
            }
        }
        static linearY(list) {
            const nodes = list.filter(node => node.pageFlow).sort(NodeList.siblingIndex);
            switch (nodes.length) {
                case 0:
                    return false;
                case 1:
                    return true;
                default:
                    const parent = this.actualParent(nodes);
                    if (parent) {
                        const cleared = this.clearedAll(parent);
                        for (let i = 1; i < nodes.length; i++) {
                            if (!nodes[i].alignedVertically(nodes[i].previousSiblings(), nodes, cleared)) {
                                return false;
                            }
                        }
                        return true;
                    }
                    return false;
            }
        }
        static partitionRows(list) {
            const [children, cleared] = (() => {
                const parent = this.actualParent(list);
                if (parent) {
                    return [parent.actualChildren, this.clearedAll(parent)];
                }
                else {
                    return [list, this.cleared(list)];
                }
            })();
            const result = [];
            let row = [];
            for (let i = 0; i < children.length; i++) {
                const node = children[i];
                const previousSiblings = node.previousSiblings();
                if (i === 0 || previousSiblings.length === 0) {
                    if (list.includes(node)) {
                        row.push(node);
                    }
                }
                else {
                    if (node.alignedVertically(previousSiblings, row, cleared)) {
                        if (row.length) {
                            result.push(row);
                        }
                        if (list.includes(node)) {
                            row = [node];
                        }
                        else {
                            row = [];
                        }
                    }
                    else {
                        if (list.includes(node)) {
                            row.push(node);
                        }
                    }
                }
                if (i === children.length - 1 && row.length) {
                    result.push(row);
                }
            }
            return result;
        }
        static siblingIndex(a, b) {
            return a.siblingIndex >= b.siblingIndex ? 1 : -1;
        }
        append(node, delegate = true) {
            super.append(node);
            if (delegate && this.afterAppend) {
                this.afterAppend.call(this, node);
            }
            return this;
        }
        reset() {
            this._currentId = 0;
            this.clear();
            return this;
        }
        get visible() {
            return this.children.filter(node => node.visible);
        }
        get elements() {
            return this.children.filter(node => node.visible && node.styleElement);
        }
        get nextId() {
            return ++this._currentId;
        }
    }

    class Layout extends Container {
        constructor(parent, node, containerType = 0, alignmentType = 0, itemCount = 0, children) {
            super(children);
            this.parent = parent;
            this.node = node;
            this.containerType = containerType;
            this.alignmentType = alignmentType;
            this.itemCount = itemCount;
            this.rowCount = 0;
            this.columnCount = 0;
            this.renderType = 0;
            this.renderPosition = false;
        }
        init() {
            this.floated = this.getFloated();
            this.cleared = this.getCleared();
            this.linearX = this.isLinearX();
        }
        initParent() {
            this.floated = this.getFloated(true);
            this.cleared = this.getCleared(true);
            this.linearX = this.isLinearX();
        }
        setType(containerType, ...alignmentType) {
            this.containerType = containerType;
            for (const value of alignmentType) {
                this.add(value);
            }
        }
        add(value) {
            this.alignmentType |= value;
            return this.alignmentType;
        }
        retain(list) {
            super.retain(list);
            this.itemCount = list.length;
            return this;
        }
        delete(value) {
            if (hasBit(this.alignmentType, value)) {
                this.alignmentType ^= value;
            }
            return this.alignmentType;
        }
        getFloated(parent = false) {
            return parent ? NodeList.floatedAll(this.parent) : NodeList.floated(this.children);
        }
        getCleared(parent = false) {
            return parent ? NodeList.clearedAll(this.parent) : NodeList.cleared(this.children);
        }
        isLinearX() {
            return NodeList.linearX(this.children);
        }
        isLinearY() {
            return NodeList.linearY(this.children);
        }
        set floated(value) {
            if (value.size) {
                this.add(64 /* FLOAT */);
            }
            else {
                this.delete(64 /* FLOAT */);
            }
            if (this.every(item => item.float === 'right')) {
                this.add(512 /* RIGHT */);
            }
            else {
                this.delete(512 /* RIGHT */);
            }
            this._floated = value;
        }
        get floated() {
            return this._floated || this.getFloated();
        }
        set cleared(value) {
            this._cleared = value;
        }
        get cleared() {
            return this._cleared || this.getCleared();
        }
        get visible() {
            return this.children.filter(node => node.visible);
        }
        set linearX(value) {
            this._linearX = value;
        }
        get linearX() {
            return this._linearX || this.isLinearX();
        }
        set linearY(value) {
            this._linearY = value;
        }
        get linearY() {
            return this._linearY || this.isLinearY();
        }
    }

    const HEX_CHAR = '0123456789ABCDEF';
    const X11_CSS3 = {
        'Pink': { value: '#FFC0CB' },
        'LightPink': { value: '#FFB6C1' },
        'HotPink': { value: '#FF69B4' },
        'DeepPink': { value: '#FF1493' },
        'PaleVioletRed': { value: '#DB7093' },
        'MediumVioletRed': { value: '#C71585' },
        'LightSalmon': { value: '#FFA07A' },
        'Salmon': { value: '#FA8072' },
        'DarkSalmon': { value: '#E9967A' },
        'LightCoral': { value: '#F08080' },
        'IndianRed': { value: '#CD5C5C' },
        'Crimson': { value: '#DC143C' },
        'Firebrick': { value: '#B22222' },
        'DarkRed': { value: '#8B0000' },
        'Red': { value: '#FF0000' },
        'OrangeRed': { value: '#FF4500' },
        'Tomato': { value: '#FF6347' },
        'Coral': { value: '#FF7F50' },
        'Orange': { value: '#FFA500' },
        'DarkOrange': { value: '#FF8C00' },
        'Yellow': { value: '#FFFF00' },
        'LightYellow': { value: '#FFFFE0' },
        'LemonChiffon': { value: '#FFFACD' },
        'LightGoldenrodYellow': { value: '#FAFAD2' },
        'PapayaWhip': { value: '#FFEFD5' },
        'Moccasin': { value: '#FFE4B5' },
        'PeachPuff': { value: '#FFDAB9' },
        'PaleGoldenrod': { value: '#EEE8AA' },
        'Khaki': { value: '#F0E68C' },
        'DarkKhaki': { value: '#BDB76B' },
        'Gold': { value: '#FFD700' },
        'Cornsilk': { value: '#FFF8DC' },
        'BlanchedAlmond': { value: '#FFEBCD' },
        'Bisque': { value: '#FFE4C4' },
        'NavajoWhite': { value: '#FFDEAD' },
        'Wheat': { value: '#F5DEB3' },
        'Burlywood': { value: '#DEB887' },
        'Tan': { value: '#D2B48C' },
        'RosyBrown': { value: '#BC8F8F' },
        'SandyBrown': { value: '#F4A460' },
        'Goldenrod': { value: '#DAA520' },
        'DarkGoldenrod': { value: '#B8860B' },
        'Peru': { value: '#CD853F' },
        'Chocolate': { value: '#D2691E' },
        'SaddleBrown': { value: '#8B4513' },
        'Sienna': { value: '#A0522D' },
        'Brown': { value: '#A52A2A' },
        'Maroon': { value: '#800000' },
        'DarkOliveGreen': { value: '#556B2F' },
        'Olive': { value: '#808000' },
        'OliveDrab': { value: '#6B8E23' },
        'YellowGreen': { value: '#9ACD32' },
        'LimeGreen': { value: '#32CD32' },
        'Lime': { value: '#00FF00' },
        'LawnGreen': { value: '#7CFC00' },
        'Chartreuse': { value: '#7FFF00' },
        'GreenYellow': { value: '#ADFF2F' },
        'SpringGreen': { value: '#00FF7F' },
        'MediumSpringGreen': { value: '#00FA9A' },
        'LightGreen': { value: '#90EE90' },
        'PaleGreen': { value: '#98FB98' },
        'DarkSeaGreen': { value: '#8FBC8F' },
        'MediumAquamarine': { value: '#66CDAA' },
        'MediumSeaGreen': { value: '#3CB371' },
        'SeaGreen': { value: '#2E8B57' },
        'ForestGreen': { value: '#228B22' },
        'Green': { value: '#008000' },
        'DarkGreen': { value: '#006400' },
        'Aqua': { value: '#00FFFF' },
        'Cyan': { value: '#00FFFF' },
        'LightCyan': { value: '#E0FFFF' },
        'PaleTurquoise': { value: '#AFEEEE' },
        'Aquamarine': { value: '#7FFFD4' },
        'Turquoise': { value: '#40E0D0' },
        'DarkTurquoise': { value: '#00CED1' },
        'MediumTurquoise': { value: '#48D1CC' },
        'LightSeaGreen': { value: '#20B2AA' },
        'CadetBlue': { value: '#5F9EA0' },
        'DarkCyan': { value: '#008B8B' },
        'Teal': { value: '#008080' },
        'LightSteelBlue': { value: '#B0C4DE' },
        'PowderBlue': { value: '#B0E0E6' },
        'LightBlue': { value: '#ADD8E6' },
        'SkyBlue': { value: '#87CEEB' },
        'LightSkyBlue': { value: '#87CEFA' },
        'DeepSkyBlue': { value: '#00BFFF' },
        'DodgerBlue': { value: '#1E90FF' },
        'Cornflower': { value: '#6495ED' },
        'SteelBlue': { value: '#4682B4' },
        'RoyalBlue': { value: '#4169E1' },
        'Blue': { value: '#0000FF' },
        'MediumBlue': { value: '#0000CD' },
        'DarkBlue': { value: '#00008B' },
        'Navy': { value: '#000080' },
        'MidnightBlue': { value: '#191970' },
        'Lavender': { value: '#E6E6FA' },
        'Thistle': { value: '#D8BFD8' },
        'Plum': { value: '#DDA0DD' },
        'Violet': { value: '#EE82EE' },
        'Orchid': { value: '#DA70D6' },
        'Fuchsia': { value: '#FF00FF' },
        'Magenta': { value: '#FF00FF' },
        'MediumOrchid': { value: '#BA55D3' },
        'MediumPurple': { value: '#9370DB' },
        'BlueViolet': { value: '#8A2BE2' },
        'DarkViolet': { value: '#9400D3' },
        'DarkOrchid': { value: '#9932CC' },
        'DarkMagenta': { value: '#8B008B' },
        'Purple': { value: '#800080' },
        'RebeccaPurple': { value: '#663399' },
        'Indigo': { value: '#4B0082' },
        'DarkSlateBlue': { value: '#483D8B' },
        'SlateBlue': { value: '#6A5ACD' },
        'MediumSlateBlue': { value: '#7B68EE' },
        'White': { value: '#FFFFFF' },
        'Snow': { value: '#FFFAFA' },
        'Honeydew': { value: '#F0FFF0' },
        'MintCream': { value: '#F5FFFA' },
        'Azure': { value: '#F0FFFF' },
        'AliceBlue': { value: '#F0F8FF' },
        'GhostWhite': { value: '#F8F8FF' },
        'WhiteSmoke': { value: '#F5F5F5' },
        'Seashell': { value: '#FFF5EE' },
        'Beige': { value: '#F5F5DC' },
        'OldLace': { value: '#FDF5E6' },
        'FloralWhite': { value: '#FFFAF0' },
        'Ivory': { value: '#FFFFF0' },
        'AntiqueWhite': { value: '#FAEBD7' },
        'Linen': { value: '#FAF0E6' },
        'LavenderBlush': { value: '#FFF0F5' },
        'MistyRose': { value: '#FFE4E1' },
        'Gainsboro': { value: '#DCDCDC' },
        'LightGray': { value: '#D3D3D3' },
        'Silver': { value: '#C0C0C0' },
        'DarkGray': { value: '#A9A9A9' },
        'Gray': { value: '#808080' },
        'DimGray': { value: '#696969' },
        'LightSlateGray': { value: '#778899' },
        'SlateGray': { value: '#708090' },
        'DarkSlateGray': { value: '#2F4F4F' },
        'LightGrey': { value: '#D3D3D3' },
        'DarkGrey': { value: '#A9A9A9' },
        'Grey': { value: '#808080' },
        'DimGrey': { value: '#696969' },
        'LightSlateGrey': { value: '#778899' },
        'SlateGrey': { value: '#708090' },
        'DarkSlateGrey': { value: '#2F4F4F' },
        'Black': { value: '#000000' }
    };
    const REGEXP_HEX = /[A-Za-z\d]{3,}/;
    const REGEXP_RGBA = /rgba?\((\d+), (\d+), (\d+)(?:, ([\d.]+))?\)/;
    const HSL_SORTED = [];
    for (const name in X11_CSS3) {
        const x11 = X11_CSS3[name];
        x11.name = name;
        const rgba = convertRGBA(x11.value);
        if (rgba) {
            x11.rgba = rgba;
            x11.hsl = convertHSL(x11.rgba);
            HSL_SORTED.push(x11);
        }
    }
    HSL_SORTED.sort(sortHSL);
    function convertHSL({ r = 0, g = 0, b = 0 }) {
        r /= 255;
        g /= 255;
        b /= 255;
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
            let c = a.hsl.h;
            let d = b.hsl.h;
            if (c === d) {
                c = a.hsl.s;
                d = b.hsl.s;
                if (c === d) {
                    c = a.hsl.l;
                    d = b.hsl.l;
                }
            }
            return c >= d ? 1 : -1;
        }
        return 0;
    }
    function convertAlpha$1(value) {
        return value < 1 ? convertHex(255 * value) : 'FF';
    }
    function parseOpacity(value) {
        const opacity = parseFloat(value);
        return opacity < 1 ? opacity : 1;
    }
    function findColorName(value) {
        for (const color in X11_CSS3) {
            if (color.toLowerCase() === value.trim().toLowerCase()) {
                return X11_CSS3[color];
            }
        }
        return undefined;
    }
    function findColorShade(value) {
        let index = HSL_SORTED.findIndex(item => item.value === value);
        if (index !== -1) {
            return HSL_SORTED[index];
        }
        else {
            const rgb = convertRGBA(value);
            if (rgb) {
                const hsl = convertHSL(rgb);
                if (hsl) {
                    const result = HSL_SORTED.slice(0);
                    result.push({
                        name: '',
                        value: '',
                        hsl,
                        rgba: { r: -1, g: -1, b: -1, a: 1 },
                    });
                    result.sort(sortHSL);
                    index = result.findIndex(item => item.name === '');
                    return result[Math.min(index + 1, result.length - 1)];
                }
            }
            return undefined;
        }
    }
    function parseColor(value, opacity = '1', transparency = false) {
        if (value && (value !== 'transparent' || transparency)) {
            if (opacity.trim() === '') {
                opacity = '1';
            }
            let rgba;
            if (value.charAt(0) === '#') {
                rgba = convertRGBA(value);
            }
            else if (value === 'initial') {
                rgba = { r: 0, g: 0, b: 0, a: 1 };
            }
            else if (value === 'transparent') {
                rgba = { r: 0, g: 0, b: 0, a: 0 };
            }
            else if (value.startsWith('rgb')) {
                const match = value.match(REGEXP_RGBA);
                if (match) {
                    const a = match[4] ? parseFloat(match[4]) : parseOpacity(opacity);
                    rgba = {
                        r: parseInt(match[1]),
                        g: parseInt(match[2]),
                        b: parseInt(match[3]),
                        a
                    };
                }
            }
            else {
                const color = findColorName(value);
                if (color && color.rgba) {
                    rgba = color.rgba;
                    rgba.a = parseFloat(opacity);
                }
            }
            if (rgba && (rgba.a > 0 || transparency)) {
                const valueHex = convertHex(rgba.r) + convertHex(rgba.g) + convertHex(rgba.b);
                const valueAlpha = convertAlpha$1(rgba.a);
                const alpha = rgba.a;
                return {
                    valueAsRGB: `#${valueHex}`,
                    valueAsRGBA: `#${valueHex + valueAlpha}`,
                    valueAsARGB: `#${valueAlpha + valueHex}`,
                    alpha,
                    rgba,
                    opaque: alpha < 1,
                    visible: alpha > 0
                };
            }
        }
        return undefined;
    }
    function reduceColor(value, percent) {
        const rgba = convertRGBA(value);
        if (rgba) {
            const base = percent < 0 ? 0 : 255;
            percent = Math.abs(percent);
            rgba.r = Math.round((base - rgba.r) * percent) + rgba.r;
            rgba.g = Math.round((base - rgba.g) * percent) + rgba.g;
            rgba.b = Math.round((base - rgba.b) * percent) + rgba.b;
            return parseColor(formatRGBA(rgba));
        }
        return undefined;
    }
    function convertHex(...values) {
        let output = '';
        for (const value of values) {
            let rgb = typeof value === 'string' ? parseInt(value) : value;
            if (isNaN(rgb)) {
                output += '00';
            }
            else {
                rgb = Math.max(0, Math.min(rgb, 255));
                output += HEX_CHAR.charAt((rgb - (rgb % 16)) / 16) + HEX_CHAR.charAt(rgb % 16);
            }
        }
        return output;
    }
    function convertRGBA(value) {
        value = value.replace(/#/g, '').trim();
        if (REGEXP_HEX.test(value)) {
            let a = 255;
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
                    if (value.length >= 8) {
                        a = parseInt(value.substring(6, 8), 16);
                    }
                    value = value.substring(0, 6);
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
    function formatRGBA(rgba) {
        return `rgb${rgba.a < 255 ? 'a' : ''}(${rgba.r}, ${rgba.g}, ${rgba.b}${rgba.a < 255 ? `, ${(rgba.a / 255).toPrecision(2)}` : ''})`;
    }

    var color = /*#__PURE__*/Object.freeze({
        findColorName: findColorName,
        findColorShade: findColorShade,
        parseColor: parseColor,
        reduceColor: reduceColor,
        convertHex: convertHex,
        convertRGBA: convertRGBA,
        formatRGBA: formatRGBA
    });

    function formatPlaceholder(id, symbol = ':') {
        return `{${symbol + id.toString()}}`;
    }
    function replacePlaceholder(value, id, content, before = false) {
        const placeholder = typeof id === 'number' ? formatPlaceholder(id) : id;
        return value.replace(placeholder, (before ? placeholder : '') + content + (before ? '' : placeholder));
    }
    function replaceIndent(value, depth, pattern) {
        if (depth >= 0) {
            let indent = -1;
            return value.split('\n').map(line => {
                const match = pattern.exec(line);
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
        let pattern;
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
            if (match === null || characters === 0) {
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
        let output = index === undefined ? value['__root'].trim() : value[index];
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
            if (result === false ||
                Array.isArray(result) && result.length === 0 ||
                hash && hash !== '%') {
                output = output.replace(new RegExp(`{%${attr}}\\n*`, 'g'), '');
            }
            if (hash === '' && new RegExp(`{&${attr}}`).test(output)) {
                output = '';
            }
        }
        if (index === undefined) {
            output = output.replace(/\n{%\w+}\n/g, '\n');
        }
        return output.replace(/\s*([\w:]+="[^"]*)?{~\w+}"?/g, '');
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
        replacePlaceholder: replacePlaceholder,
        replaceIndent: replaceIndent,
        replaceTab: replaceTab,
        replaceEntity: replaceEntity,
        replaceCharacter: replaceCharacter,
        parseTemplate: parseTemplate,
        createTemplate: createTemplate,
        getTemplateSection: getTemplateSection
    });

    const REGEXP_DECIMAL = '(-?[\\d.]+)';
    const REGEXP_COLORSTOP = `(?:\\s*(rgba?\\(\\d+, \\d+, \\d+(?:, [\\d.]+)?\\)|#[a-zA-Z\\d]{3,}|[a-z]+)\\s*(\\d+%|${REGEXP_DECIMAL})?,?\\s*)`;
    const REGEXP_POSITION = /(.+?)?\s*at (.+?)$/;
    const REGEXP_DEGREE = REGEXP_DECIMAL + '(deg|rad|turn|grad)';
    function replaceExcluded(element, attr) {
        let result = element[attr];
        Array.from(element.children).forEach((item) => {
            const child = getElementAsNode(item);
            if (child && (child.excluded || hasValue(child.dataset.target)) && child[attr] && child[attr].trim() !== '') {
                result = result.replace(child[attr], '');
            }
        });
        return result;
    }
    function getColorStops(value, opacity, conic = false) {
        const result = [];
        const pattern = new RegExp(REGEXP_COLORSTOP, 'g');
        let match;
        while ((match = pattern.exec(value)) !== null) {
            const color = parseColor(match[1], opacity);
            if (color && color.visible) {
                const item = {
                    color: color.valueAsRGBA,
                    opacity: color.alpha,
                    offset: ''
                };
                if (conic) {
                    if (match[3] && match[4]) {
                        item.offset = convertAngle(match[3], match[4]).toString();
                    }
                }
                else {
                    if (match[2]) {
                        item.offset = match[2];
                    }
                }
                result.push(item);
            }
        }
        const lastStop = result[result.length - 1];
        if (lastStop.offset === '') {
            lastStop.offset = conic ? '360' : '100%';
        }
        let previousIncrement = 0;
        for (let i = 0; i < result.length; i++) {
            const item = result[i];
            if (item.offset === '') {
                if (i === 0) {
                    item.offset = '0';
                }
                else {
                    for (let j = i + 1, k = 2; j < result.length - 1; j++, k++) {
                        if (result[j].offset !== '') {
                            item.offset = ((previousIncrement + parseInt(result[j].offset)) / k).toString();
                            break;
                        }
                    }
                    if (item.offset === '') {
                        item.offset = (previousIncrement + parseInt(lastStop.offset) / (result.length - 1)).toString();
                    }
                }
                if (!conic) {
                    item.offset += '%';
                }
            }
            previousIncrement = parseInt(item.offset);
        }
        if (conic && previousIncrement < 360 || !conic && previousIncrement < 100) {
            const colorFill = Object.assign({}, result[result.length - 1]);
            colorFill.offset = conic ? '360' : '100%';
            result.push(colorFill);
        }
        return result;
    }
    function parseAngle(value) {
        if (value) {
            const match = new RegExp(REGEXP_DEGREE).exec(value.trim());
            if (match) {
                return convertAngle(match[1], match[2]);
            }
        }
        return 0;
    }
    function replaceWhiteSpace(node, value) {
        const renderParent = node.renderParent;
        if (node.multiLine && renderParent && !renderParent.layoutVertical) {
            value = value.replace(/^\s*\n/, '');
        }
        switch (node.css('whiteSpace')) {
            case 'nowrap':
                value = value.replace(/\n/g, ' ');
                break;
            case 'pre':
            case 'pre-wrap':
                if (renderParent && !renderParent.layoutVertical) {
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
                const element = node.baseElement;
                if (element) {
                    if (element.previousSibling && isLineBreak(element.previousSibling)) {
                        value = value.replace(/^\s+/, '');
                    }
                    if (element.nextSibling && isLineBreak(element.nextSibling)) {
                        value = value.replace(/\s+$/, '');
                    }
                }
                return [value, false];
        }
        return [value, true];
    }
    class Resource {
        constructor(application, cache) {
            this.application = application;
            this.cache = cache;
        }
        static generateId(section, name, start) {
            const prefix = name;
            let i = start;
            if (start === 1) {
                name += `_${i.toString()}`;
            }
            const previous = this.ASSETS.ids.get(section) || [];
            do {
                if (!previous.includes(name)) {
                    previous.push(name);
                    break;
                }
                else {
                    name = `${prefix}_${(++i).toString()}`;
                }
            } while (true);
            this.ASSETS.ids.set(section, previous);
            return name;
        }
        static getStoredName(asset, value) {
            for (const [name, stored] of Resource.STORED[asset].entries()) {
                if (JSON.stringify(value) === JSON.stringify(stored)) {
                    return name;
                }
            }
            return '';
        }
        static insertStoredAsset(asset, name, value) {
            const stored = Resource.STORED[asset];
            if (stored) {
                let result = this.getStoredName(asset, value);
                if (result === '') {
                    if (isNumber(name) || /^\d/.test(name)) {
                        name = `__${name}`;
                    }
                    if (hasValue(value)) {
                        let i = 0;
                        do {
                            result = name;
                            if (i > 0) {
                                result += `_${i}`;
                            }
                            if (!stored.has(result)) {
                                stored.set(result, value);
                            }
                            i++;
                        } while (stored.has(result) && stored.get(result) !== value);
                    }
                }
                return result;
            }
            return '';
        }
        static isBorderVisible(border) {
            return !!border && !(border.style === 'none' ||
                border.width === '0px' ||
                border.color === '' ||
                border.color.length === 9 && border.color.endsWith('00'));
        }
        static hasDrawableBackground(object) {
            return (!!object && (this.isBorderVisible(object.borderTop) ||
                this.isBorderVisible(object.borderRight) ||
                this.isBorderVisible(object.borderBottom) ||
                this.isBorderVisible(object.borderLeft) ||
                !!object.backgroundImage ||
                !!object.borderRadius ||
                !!object.backgroundGradient));
        }
        finalize(data) { }
        reset() {
            for (const name in Resource.ASSETS) {
                Resource.ASSETS[name] = new Map();
            }
            for (const name in Resource.STORED) {
                Resource.STORED[name] = new Map();
            }
            if (this.fileHandler) {
                this.fileHandler.reset();
            }
        }
        setBoxStyle() {
            for (const node of this.cache.elements) {
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
                                    cssColor = cssInheritStyle(node.element, `${attr}Color`);
                                    break;
                            }
                            let width = node.css(`${attr}Width`) || '1px';
                            const style = node.css(`${attr}Style`) || 'none';
                            if (style === 'inset' && width === '0px') {
                                width = '1px';
                            }
                            const color = parseColor(cssColor, node.css('opacity'));
                            boxStyle[attr] = {
                                width,
                                style,
                                color: style !== 'none' && color ? color.valueAsRGBA : ''
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
                                boxStyle.borderRadius = convertInt(top) === 0 ? undefined : [top];
                            }
                            else {
                                boxStyle.borderRadius = [top, right, bottom, left];
                            }
                            break;
                        }
                        case 'backgroundColor': {
                            if (!node.has('backgroundColor') && (value === node.cssAscend('backgroundColor', false, true) || node.documentParent.visible && cssFromParent(node.element, 'backgroundColor'))) {
                                boxStyle.backgroundColor = '';
                            }
                            else {
                                const color = parseColor(value, node.css('opacity'));
                                boxStyle.backgroundColor = color ? color.valueAsRGBA : '';
                            }
                            break;
                        }
                        case 'background':
                        case 'backgroundImage': {
                            if (value !== 'none' && !node.hasBit('excludeResource', NODE_RESOURCE.IMAGE_SOURCE)) {
                                const gradients = [];
                                const opacity = node.css('opacity');
                                let pattern = new RegExp(`(linear|radial|conic)-gradient\\(((?:to [a-z ]+|(?:from )?-?[\\d.]+(?:deg|rad|turn|grad)|circle|ellipse|closest-side|closest-corner|farthest-side|farthest-corner)?(?:\\s*at [\\w %]+)?),?\\s*(${REGEXP_COLORSTOP}+)\\)`, 'g');
                                let match;
                                while ((match = pattern.exec(value)) !== null) {
                                    let gradient;
                                    switch (match[1]) {
                                        case 'linear': {
                                            if (match[2] === undefined) {
                                                match[2] = 'to bottom';
                                            }
                                            gradient = {
                                                type: 'linear',
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
                                                            return parseAngle(match[2]);
                                                    }
                                                })(),
                                                colorStops: getColorStops(match[3], opacity)
                                            };
                                            break;
                                        }
                                        case 'radial': {
                                            gradient = {
                                                type: 'radial',
                                                position: (() => {
                                                    const result = ['center', 'ellipse'];
                                                    if (match[2]) {
                                                        const position = REGEXP_POSITION.exec(match[2]);
                                                        if (position) {
                                                            if (position[1]) {
                                                                switch (position[1]) {
                                                                    case 'ellipse':
                                                                    case 'circle':
                                                                    case 'closest-side':
                                                                    case 'closest-corner':
                                                                    case 'farthest-side':
                                                                    case 'farthest-corner':
                                                                        result[1] = position[1];
                                                                        break;
                                                                }
                                                            }
                                                            if (position[2]) {
                                                                result[0] = position[2];
                                                            }
                                                        }
                                                    }
                                                    return result;
                                                })(),
                                                colorStops: getColorStops(match[3], opacity)
                                            };
                                            break;
                                        }
                                        case 'conic': {
                                            gradient = {
                                                type: 'conic',
                                                angle: parseAngle(match[2]),
                                                position: (() => {
                                                    if (match[2]) {
                                                        const position = REGEXP_POSITION.exec(match[2]);
                                                        if (position) {
                                                            return [position[2]];
                                                        }
                                                    }
                                                    return ['center'];
                                                })(),
                                                colorStops: getColorStops(match[3], opacity, true)
                                            };
                                            break;
                                        }
                                    }
                                    if (gradient.colorStops.length > 1) {
                                        gradients.push(gradient);
                                    }
                                }
                                if (gradients.length) {
                                    boxStyle.backgroundGradient = gradients;
                                }
                                else {
                                    const images = [];
                                    pattern = new RegExp(REGEX_PATTERN.CSS_URL, 'g');
                                    while ((match = pattern.exec(value)) !== null) {
                                        images.push(match[0]);
                                    }
                                    if (images.length) {
                                        boxStyle.backgroundImage = images;
                                    }
                                }
                            }
                            break;
                        }
                        case 'backgroundSize':
                        case 'backgroundRepeat':
                        case 'backgroundPositionX':
                        case 'backgroundPositionY': {
                            boxStyle[attr] = value;
                            break;
                        }
                    }
                }
                const borderTop = JSON.stringify(boxStyle.borderTop);
                if (borderTop === JSON.stringify(boxStyle.borderRight) && borderTop === JSON.stringify(boxStyle.borderBottom) && borderTop === JSON.stringify(boxStyle.borderLeft)) {
                    boxStyle.border = boxStyle.borderTop;
                }
                node.data(Resource.KEY_NAME, 'boxStyle', boxStyle);
            }
        }
        setFontStyle() {
            for (const node of this.cache) {
                const backgroundImage = Resource.hasDrawableBackground(node.data(Resource.KEY_NAME, 'boxStyle'));
                if (!(node.renderChildren.length ||
                    node.baseElement === undefined ||
                    node.imageElement ||
                    node.svgElement ||
                    node.tagName === 'HR' ||
                    node.inlineText && !backgroundImage && !node.preserveWhiteSpace && node.element.innerHTML.trim() === '')) {
                    const opacity = node.css('opacity');
                    const color = parseColor(node.css('color'), opacity);
                    let backgroundColor;
                    if (backgroundImage ||
                        node.cssAscend('backgroundColor', false, true) === node.css('backgroundColor') && (node.plainText || node.style.backgroundColor !== node.cssInitial('backgroundColor')) ||
                        !node.has('backgroundColor') && node.documentParent.visible && cssFromParent(node.element, 'backgroundColor')) {
                        backgroundColor = undefined;
                    }
                    else {
                        backgroundColor = parseColor(node.css('backgroundColor'), opacity);
                    }
                    let fontFamily = node.css('fontFamily');
                    let fontSize = node.css('fontSize');
                    let fontWeight = node.css('fontWeight');
                    if (isUserAgent(8 /* EDGE */) && !node.has('fontFamily')) {
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
                        color: color ? color.valueAsRGBA : '',
                        backgroundColor: backgroundColor ? backgroundColor.valueAsRGBA : ''
                    };
                    node.data(Resource.KEY_NAME, 'fontStyle', result);
                }
            }
        }
        setValueString() {
            for (const node of this.cache.visible) {
                const element = node.baseElement;
                if (element) {
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
                            if (element.tagName === 'CODE') {
                                value = replaceEntity(replaceExcluded(element, 'innerHTML'));
                            }
                            else if (hasLineBreak(element, true)) {
                                value = replaceEntity(replaceExcluded(element, 'innerHTML'));
                                value = value.replace(/\s*<br[^>]*>\s*/g, '\\n');
                                value = value.replace(/(<([^>]+)>)/ig, '');
                            }
                            else {
                                value = replaceEntity(replaceExcluded(element, 'textContent'));
                            }
                            [value, inlineTrim] = replaceWhiteSpace(node, value);
                        }
                        else if (element.innerText.trim() === '' && Resource.hasDrawableBackground(node.data(Resource.KEY_NAME, 'boxStyle'))) {
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
                            const previousSibling = node.previousSiblings().pop();
                            const nextSibling = node.nextSiblings().shift();
                            let previousSpaceEnd = false;
                            if (previousSibling === undefined || previousSibling.multiLine || previousSibling.lineBreak || previousSibling.plainText && /\s+$/.test(previousSibling.textContent)) {
                                value = value.replace(/^\s+/, '');
                            }
                            else if (previousSibling.baseElement) {
                                previousSpaceEnd = /\s+$/.test(previousSibling.baseElement.innerText || previousSibling.textContent);
                            }
                            if (inlineTrim) {
                                const original = value;
                                value = value.trim();
                                if (previousSibling && !previousSibling.block && !previousSibling.lineBreak && !previousSpaceEnd && /^\s+/.test(original)) {
                                    value = '&#160;' + value;
                                }
                                if (nextSibling && !nextSibling.lineBreak && /\s+$/.test(original)) {
                                    value = value + '&#160;';
                                }
                            }
                            else {
                                if (!/^\s+$/.test(value)) {
                                    value = value.replace(/^\s+/, previousSibling && (previousSibling.block ||
                                        previousSibling.lineBreak ||
                                        previousSpaceEnd && previousSibling.htmlElement && previousSibling.textContent.length > 1 ||
                                        node.multiLine && hasLineBreak(element)) ? '' : '&#160;');
                                    value = value.replace(/\s+$/, node.display === 'table-cell' || nextSibling && nextSibling.lineBreak || node.blockStatic ? '' : '&#160;');
                                }
                                else if (value.length) {
                                    value = '&#160;' + value.substring(1);
                                }
                            }
                        }
                        if (value !== '') {
                            node.data(Resource.KEY_NAME, 'valueString', { name, value });
                        }
                    }
                }
            }
        }
        get stored() {
            return Resource.STORED;
        }
    }
    Resource.KEY_NAME = 'androme.resource';
    Resource.ASSETS = {
        ids: new Map(),
        images: new Map()
    };
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

    function prioritizeExtensions(documentRoot, element, extensions) {
        const tagged = [];
        let current = element;
        do {
            if (current.dataset.use) {
                for (const value of current.dataset.use.split(',')) {
                    tagged.push(value.trim());
                }
            }
            current = current !== documentRoot ? current.parentElement : null;
        } while (current);
        if (tagged.length) {
            const result = [];
            const untagged = [];
            for (const ext of extensions) {
                const index = tagged.indexOf(ext.name);
                if (index !== -1) {
                    result[index] = ext;
                }
                else {
                    untagged.push(ext);
                }
            }
            return [...result.filter(item => item), ...untagged];
        }
        else {
            return extensions;
        }
    }
    function checkPositionStatic(node, parent) {
        const previousSiblings = node.previousSiblings();
        const nextSiblings = node.nextSiblings();
        if (node.positionAuto &&
            (previousSiblings.length === 0 || !previousSiblings.some(item => item.multiLine > 0 || item.excluded && !item.blockStatic)) &&
            (nextSiblings.length === 0 || nextSiblings.every(item => item.blockStatic || item.lineBreak || item.excluded) || node.element === getLastChildElement(parent.element))) {
            node.cssApply({
                'position': 'static',
                'display': 'inline-block',
                'verticalAlign': 'top'
            }, true);
            return true;
        }
        return false;
    }
    function compareRange(operation, value, range) {
        switch (operation) {
            case '<=':
                return value <= range;
            case '<':
                return value < range;
            case '>=':
                return value >= range;
            case '>':
                return value > range;
            default:
                return value === range;
        }
    }
    class Application {
        constructor(framework, controllerConstructor, resourceConstructor, extensionManagerHandler, nodeConstructor) {
            this.framework = framework;
            this.nodeConstructor = nodeConstructor;
            this.initialized = false;
            this.closed = false;
            this.builtInExtensions = {};
            this.extensions = new Set();
            this.parseElements = new Set();
            this.session = {
                cache: new NodeList(),
                image: new Map(),
                renderQueue: new Map(),
                excluded: new NodeList(),
            };
            this.processing = {
                cache: new NodeList(),
                depthMap: new Map(),
                node: null,
                layout: null,
                excluded: new NodeList()
            };
            this._renderPosition = new Map();
            this._views = [];
            this._includes = [];
            this.controllerHandler = new controllerConstructor(this, this.processing.cache);
            this.resourceHandler = new resourceConstructor(this, this.processing.cache);
            this.extensionManager = new extensionManagerHandler(this, this.processing.cache);
        }
        registerController(handler) {
            handler.application = this;
            handler.cache = this.processing.cache;
            this.controllerHandler = handler;
        }
        registerResource(handler) {
            handler.application = this;
            handler.cache = this.processing.cache;
            this.resourceHandler = handler;
        }
        finalize() {
            const rendered = this.rendered;
            for (const node of rendered) {
                if (!node.hasBit('excludeProcedure', NODE_PROCEDURE.LAYOUT)) {
                    node.setLayout();
                }
                if (!node.hasBit('excludeProcedure', NODE_PROCEDURE.ALIGNMENT)) {
                    node.setAlignment();
                }
            }
            for (const node of rendered) {
                if (!node.hasBit('excludeProcedure', NODE_PROCEDURE.OPTIMIZATION)) {
                    node.applyOptimizations();
                }
                if (!node.hasBit('excludeProcedure', NODE_PROCEDURE.CUSTOMIZATION)) {
                    node.applyCustomizations();
                }
            }
            for (const ext of this.extensions) {
                for (const node of ext.subscribers) {
                    ext.postProcedure(node);
                }
            }
            for (const node of this.rendered) {
                if (!node.hasBit('excludeResource', NODE_RESOURCE.BOX_SPACING)) {
                    node.setBoxSpacing();
                }
            }
            for (const ext of this.extensions) {
                ext.afterProcedure();
            }
            this.processRenderQueue();
            this.resourceHandler.finalize(this.sessionData);
            this.controllerHandler.finalize(this.sessionData);
            for (const ext of this.extensions) {
                ext.afterFinalize();
            }
            removeElementsByClassName('__css.placeholder');
            this.closed = true;
        }
        saveAllToDisk() {
            if (this.resourceHandler.fileHandler) {
                this.resourceHandler.fileHandler.saveAllToDisk(this.sessionData);
            }
        }
        reset() {
            this.session.cache.each(node => node.baseElement && deleteElementCache(node.baseElement, 'node', 'style', 'styleMap'));
            for (const element of this.parseElements) {
                delete element.dataset.iteration;
                delete element.dataset.layoutName;
            }
            this.appName = '';
            this.session.renderQueue.clear();
            this.session.image.clear();
            this.session.cache.reset();
            this.session.excluded.reset();
            this.processing.cache.reset();
            this.controllerHandler.reset();
            this.resourceHandler.reset();
            this._views.length = 0;
            this._includes.length = 0;
            this._renderPosition.clear();
            for (const ext of this.extensions) {
                ext.subscribers.clear();
                ext.subscribersChild.clear();
            }
            this.closed = false;
        }
        parseDocument(...elements) {
            let __THEN;
            this.parseElements.clear();
            this.initialized = false;
            this.setStyleMap();
            if (this.appName === '' && elements.length === 0) {
                elements.push(document.body);
            }
            for (const value of elements) {
                const element = typeof value === 'string' ? document.getElementById(value) : value;
                if (hasComputedStyle(element)) {
                    this.parseElements.add(element);
                }
            }
            const documentRoot = this.parseElements.values().next().value;
            const parseResume = () => {
                this.initialized = false;
                if (this.userSettings.preloadImages) {
                    removeElementsByClassName('__css.preload');
                }
                for (const [uri, image] of this.session.image.entries()) {
                    Resource.ASSETS.images.set(uri, image);
                }
                for (const ext of this.extensions) {
                    ext.beforeParseDocument();
                }
                for (const element of this.parseElements) {
                    if (this.appName === '') {
                        this.appName = element.id || 'untitled';
                    }
                    let filename = trimNull(element.dataset.filename).replace(new RegExp(`\.${this.controllerHandler.localSettings.layout.fileExtension}$`), '');
                    if (filename === '') {
                        filename = element.id || `document_${this.size}`;
                    }
                    const iteration = parseInt(element.dataset.iteration || '0') + 1;
                    element.dataset.iteration = iteration.toString();
                    element.dataset.layoutName = convertWord(iteration > 1 ? `${filename}_${iteration}` : filename);
                    if (this.createCache(element)) {
                        this.setBaseLayout();
                        this.setConstraints();
                        this.setResources();
                    }
                }
                for (const ext of this.extensions) {
                    for (const node of ext.subscribers) {
                        ext.postParseDocument(node);
                    }
                }
                for (const ext of this.extensions) {
                    ext.afterParseDocument();
                }
                if (typeof __THEN === 'function') {
                    __THEN.call(this);
                }
            };
            if (this.userSettings.preloadImages) {
                Array.from(this.parseElements).forEach(element => {
                    element.querySelectorAll('svg image').forEach((image) => {
                        const uri = resolvePath(image.href.baseVal);
                        this.session.image.set(uri, {
                            width: image.width.baseVal.value,
                            height: image.height.baseVal.value,
                            uri
                        });
                    });
                });
                for (const image of this.session.image.values()) {
                    if (image.width === 0 && image.height === 0 && image.uri) {
                        const imageElement = document.createElement('img');
                        imageElement.src = image.uri;
                        if (imageElement.complete && imageElement.naturalWidth > 0 && imageElement.naturalHeight > 0) {
                            image.width = imageElement.naturalWidth;
                            image.height = imageElement.naturalHeight;
                        }
                        else {
                            imageElement.className = '__css.preload';
                            imageElement.style.display = 'none';
                            documentRoot.appendChild(imageElement);
                        }
                    }
                }
            }
            const images = [];
            for (const element of this.parseElements) {
                Array.from(element.querySelectorAll('IMG')).forEach((image) => {
                    if (!(image instanceof SVGImageElement)) {
                        if (image.complete) {
                            this.addImagePreload(image);
                        }
                        else {
                            images.push(image);
                        }
                    }
                });
            }
            if (images.length === 0) {
                parseResume();
            }
            else {
                this.initialized = true;
                Promise.all(images.map(image => {
                    return new Promise((resolve, reject) => {
                        image.onload = resolve;
                        image.onerror = reject;
                    });
                }))
                    .then((result) => {
                    if (Array.isArray(result)) {
                        for (const item of result) {
                            try {
                                this.addImagePreload(item.target);
                            }
                            catch (_a) {
                            }
                        }
                    }
                    parseResume();
                })
                    .catch((error) => {
                    const message = error.target ? error.target.src : '';
                    if (!hasValue(message) || confirm(`FAIL: ${message}`)) {
                        parseResume();
                    }
                });
            }
            return {
                then: (resolve) => {
                    if (this.initialized) {
                        __THEN = resolve;
                    }
                    else {
                        resolve();
                    }
                }
            };
        }
        renderNode(layout) {
            if (layout.itemCount === 0) {
                return this.controllerHandler.renderNode(layout);
            }
            else {
                this.saveRenderPosition(layout.node, layout.renderPosition);
                return this.controllerHandler.renderNodeGroup(layout);
            }
        }
        renderLayout(layout) {
            let output = '';
            const floating = hasBit(layout.renderType, 64 /* FLOAT */);
            if (floating && hasBit(layout.renderType, 8 /* HORIZONTAL */)) {
                output = this.processFloatHorizontal(layout);
            }
            else if (floating && hasBit(layout.renderType, 16 /* VERTICAL */)) {
                output = this.processFloatVertical(layout);
            }
            else if (layout.containerType !== 0) {
                output = this.renderNode(layout);
            }
            return output;
        }
        addLayoutFile(filename, content, pathname, documentRoot = false) {
            pathname = pathname || this.controllerHandler.localSettings.layout.pathName;
            const layout = {
                pathname,
                filename,
                content
            };
            if (documentRoot && this._views.length && this._views[0].content === '') {
                this._views[0] = layout;
            }
            else {
                this._views.push(layout);
            }
            this.processing.layout = layout;
        }
        addIncludeFile(filename, content) {
            this._includes.push({
                filename,
                content,
                pathname: this.controllerHandler.localSettings.layout.pathName
            });
        }
        addRenderTemplate(parent, node, output, group = false) {
            if (output !== '') {
                if (group) {
                    node.renderChildren.some((item) => {
                        for (const templates of this.processing.depthMap.values()) {
                            const key = item.renderPositionId;
                            const view = templates.get(key);
                            if (view) {
                                const indent = node.renderDepth + 1;
                                if (item.renderDepth !== indent) {
                                    templates.set(key, this.controllerHandler.replaceIndent(view, indent, this.processing.cache.children));
                                }
                                return true;
                            }
                        }
                        return false;
                    });
                }
                if (!this.parseElements.has(node.element)) {
                    if (node.dataset.target) {
                        const target = document.getElementById(node.dataset.target);
                        if (target && target !== parent.element) {
                            this.addRenderQueue(node.dataset.target, output);
                            node.positioned = true;
                            return;
                        }
                    }
                    else if (parent.dataset.target) {
                        const target = document.getElementById(parent.dataset.target);
                        if (target) {
                            this.addRenderQueue(parent.controlId, output);
                            node.dataset.target = parent.controlId;
                            return;
                        }
                    }
                }
                if (!this.processing.depthMap.has(parent.id)) {
                    this.processing.depthMap.set(parent.id, new Map());
                }
                const template = this.processing.depthMap.get(parent.id);
                if (template) {
                    template.set(node.renderPositionId, output);
                }
            }
        }
        addRenderQueue(id, template) {
            const items = this.session.renderQueue.get(id) || [];
            items.push(template);
            this.session.renderQueue.set(id, items);
        }
        addImagePreload(element) {
            if (element && element.complete && hasValue(element.src)) {
                this.session.image.set(element.src, {
                    width: element.naturalWidth,
                    height: element.naturalHeight,
                    uri: element.src
                });
            }
        }
        saveRenderPosition(parent, required) {
            let children;
            if (parent.groupParent) {
                const baseParent = parent.parent;
                if (baseParent) {
                    const id = baseParent.id;
                    const mapParent = this._renderPosition.get(id);
                    let revised;
                    if (mapParent) {
                        const previous = mapParent.children.filter(item => !parent.contains(item));
                        if (parent.siblingIndex < previous.length) {
                            previous.splice(parent.siblingIndex, 0, parent);
                            for (let i = parent.siblingIndex + 1; i < previous.length; i++) {
                                previous[i].siblingIndex = i;
                            }
                            revised = previous;
                        }
                        else {
                            parent.siblingIndex = previous.length;
                            previous.push(parent);
                        }
                        this._renderPosition.set(id, { parent: baseParent, children: previous });
                    }
                    else {
                        revised = baseParent.children;
                    }
                    if (revised) {
                        for (let i = parent.siblingIndex + 1; i < revised.length; i++) {
                            if (revised[i]) {
                                revised[i].siblingIndex = i;
                            }
                        }
                    }
                }
            }
            if (required) {
                const renderMap = this._renderPosition.get(parent.id);
                if (renderMap) {
                    children = renderMap.children.filter(item => !parent.contains(item));
                    children.push(...parent.children);
                }
                else {
                    children = parent.duplicate();
                }
                this._renderPosition.set(parent.id, { parent, children });
            }
        }
        createNode(element) {
            return new this.nodeConstructor(this.nextId, element, this.controllerHandler.afterInsertNode);
        }
        toString() {
            return this._views.length ? this._views[0].content : '';
        }
        createCache(documentRoot) {
            const elements = (() => {
                if (documentRoot === document.body) {
                    let i = 0;
                    return document.querySelectorAll(Array.from(document.body.childNodes).some((item) => this.conditionElement(item) && ++i > 1) ? 'body, body *' : 'body *');
                }
                else {
                    return documentRoot.querySelectorAll('*');
                }
            })();
            this.processing.cache.afterAppend = undefined;
            this.processing.cache.clear();
            this.processing.excluded.clear();
            this.processing.node = null;
            for (const ext of this.extensions) {
                ext.beforeInit(documentRoot);
            }
            const rootNode = this.insertNode(documentRoot);
            if (rootNode) {
                rootNode.parent = new this.nodeConstructor(0, documentRoot.parentElement || document.body, this.controllerHandler.afterInsertNode);
                rootNode.documentRoot = true;
                rootNode.documentParent = rootNode.parent;
                this.processing.node = rootNode;
            }
            else {
                return false;
            }
            const localSettings = this.controllerHandler.localSettings;
            for (const element of Array.from(elements)) {
                if (!this.parseElements.has(element)) {
                    prioritizeExtensions(documentRoot, element, Array.from(this.extensions)).some(item => item.init(element));
                    if (!this.parseElements.has(element) && !(localSettings.unsupported.tagName.has(element.tagName) ||
                        element instanceof HTMLInputElement && localSettings.unsupported.tagName.has(`${element.tagName}:${element.type}`))) {
                        let valid = true;
                        let current = element.parentElement;
                        while (current && current !== documentRoot) {
                            if (this.parseElements.has(current)) {
                                valid = false;
                                break;
                            }
                            current = current.parentElement;
                        }
                        if (valid) {
                            this.insertNode(element);
                        }
                    }
                }
            }
            if (this.processing.cache.length) {
                for (const node of this.processing.cache) {
                    if (node.element.tagName !== 'SELECT') {
                        const plainText = [];
                        let valid = false;
                        Array.from(node.element.childNodes).forEach((element) => {
                            if (element.nodeName === '#text') {
                                plainText.push(element);
                            }
                            else if (element.tagName !== 'BR') {
                                const item = getElementAsNode(element);
                                if (item && !item.excluded) {
                                    valid = true;
                                }
                            }
                        });
                        if (valid) {
                            plainText.forEach(element => this.insertNode(element, node));
                        }
                    }
                }
                const preAlignment = {};
                const direction = new Set();
                for (const node of this.processing.cache) {
                    if (node.styleElement) {
                        const element = node.element;
                        const reset = {};
                        if (element.tagName !== 'BUTTON' && element.type !== 'button') {
                            const value = node.css('textAlign');
                            switch (value) {
                                case 'center':
                                case 'right':
                                case 'end':
                                    reset.textAlign = value;
                                    element.style.textAlign = 'left';
                                    break;
                            }
                        }
                        if (node.positionRelative && !node.positionStatic) {
                            ['top', 'right', 'bottom', 'left'].forEach(attr => {
                                if (node.has(attr)) {
                                    reset[attr] = node.css(attr);
                                    element.style[attr] = 'auto';
                                }
                            });
                        }
                        if (element.dir === 'rtl') {
                            element.dir = 'ltr';
                            direction.add(element);
                        }
                        preAlignment[node.id] = reset;
                    }
                }
                rootNode.parent.setBounds();
                for (const node of this.processing.cache) {
                    node.setBounds();
                }
                for (const node of this.processing.excluded) {
                    if (!node.lineBreak) {
                        node.setBounds();
                    }
                }
                for (const node of this.processing.cache) {
                    if (node.styleElement) {
                        const reset = preAlignment[node.id];
                        if (reset) {
                            const element = node.element;
                            for (const attr in reset) {
                                element.style[attr] = reset[attr];
                            }
                            if (direction.has(element)) {
                                element.dir = 'rtl';
                            }
                        }
                    }
                }
                for (const node of this.processing.cache) {
                    if (!node.documentRoot) {
                        let parent = node.actualParent;
                        switch (node.position) {
                            case 'fixed': {
                                if (!node.positionAuto) {
                                    parent = rootNode;
                                    break;
                                }
                            }
                            case 'absolute': {
                                if (parent && checkPositionStatic(node, parent)) {
                                    break;
                                }
                                else if (this.userSettings.supportNegativeLeftTop) {
                                    const absoluteParent = node.absoluteParent;
                                    let documentParent;
                                    let outside = false;
                                    while (parent && (parent !== rootNode || parent.id !== 0)) {
                                        if (documentParent === undefined) {
                                            if (absoluteParent === parent) {
                                                documentParent = parent;
                                                if (parent.css('overflow') === 'hidden') {
                                                    break;
                                                }
                                                else {
                                                    if ((!node.has('right') || node.right < 0) && (!node.has('bottom') || node.bottom < 0) && (node.left < 0 && node.outsideX(parent.box) ||
                                                        !node.has('left') && node.right < 0 && node.outsideX(parent.box) ||
                                                        node.top < 0 && node.outsideY(parent.box) ||
                                                        !node.has('top') && node.bottom < 0 && node.outsideX(parent.box))) {
                                                        outside = true;
                                                    }
                                                    else {
                                                        break;
                                                    }
                                                }
                                            }
                                        }
                                        else if (outside) {
                                            if (parent.documentRoot || parent.css('overflow') === 'hidden' || node.withinX(parent.box) && node.withinY(parent.box)) {
                                                documentParent = parent;
                                                break;
                                            }
                                        }
                                        parent = parent.actualParent;
                                    }
                                    if (documentParent) {
                                        parent = documentParent;
                                    }
                                    break;
                                }
                                else {
                                    parent = node.absoluteParent;
                                }
                            }
                        }
                        if (!node.pageFlow && (parent === undefined || parent.id === 0)) {
                            parent = rootNode;
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
                for (const node of this.processing.cache) {
                    if (node.htmlElement && node.length) {
                        let i = 0;
                        Array.from(node.element.childNodes).forEach((element) => {
                            const item = getElementAsNode(element);
                            if (item && !item.excluded && (item.pageFlow || item.documentParent === node)) {
                                item.siblingIndex = i++;
                            }
                        });
                        const layers = [];
                        node.each((item) => {
                            if (item.siblingIndex === Number.MAX_VALUE) {
                                for (const adjacent of node.children) {
                                    if (adjacent.actualChildren.includes(item) || item.ascend().some(child => adjacent.cascade().includes(child))) {
                                        let index = -1;
                                        if (item.zIndex >= 0 || adjacent !== item.actualParent) {
                                            index = adjacent.siblingIndex + 1;
                                        }
                                        else {
                                            index = adjacent.siblingIndex - 1;
                                        }
                                        if (layers[index] === undefined) {
                                            layers[index] = [];
                                        }
                                        layers[index].push(item);
                                        break;
                                    }
                                }
                            }
                        });
                        for (let j = 0; j < layers.length; j++) {
                            const order = layers[j];
                            if (order) {
                                order.sort((a, b) => {
                                    if (a.zIndex === b.zIndex) {
                                        return a.id < b.id ? -1 : 1;
                                    }
                                    return a.zIndex < b.zIndex ? -1 : 1;
                                });
                                node.each((item) => {
                                    if (item.siblingIndex !== Number.MAX_VALUE && item.siblingIndex >= j) {
                                        item.siblingIndex += order.length;
                                    }
                                });
                                for (let k = 0; k < order.length; k++) {
                                    order[k].siblingIndex = j + k;
                                }
                            }
                        }
                        node.sort(NodeList.siblingIndex);
                    }
                    node.saveAsInitial();
                }
                sortAsc(this.processing.cache.children, 'depth', 'id');
                for (const ext of this.extensions) {
                    ext.afterInit(documentRoot);
                }
                return true;
            }
            return false;
        }
        setBaseLayout() {
            const settings = this.userSettings;
            const localSettings = this.controllerHandler.localSettings;
            const documentRoot = this.processing.node;
            const extensions = Array.from(this.extensions).filter(item => !item.eventOnly);
            const mapY = new Map();
            let baseTemplate = localSettings.baseTemplate;
            let empty = true;
            function setMapY(depth, id, node) {
                const index = mapY.get(depth) || new Map();
                index.set(id, node);
                mapY.set(depth, index);
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
            setMapY(-1, 0, documentRoot.parent);
            let maxDepth = 0;
            for (const node of this.processing.cache.visible) {
                setMapY(node.depth, node.id, node);
                maxDepth = Math.max(node.depth, maxDepth);
            }
            for (let i = 0; i < maxDepth; i++) {
                mapY.set((i * -1) - 2, new Map());
            }
            this.processing.cache.afterAppend = (node) => {
                deleteMapY(node.id);
                setMapY((node.depth * -1) - 2, node.id, node);
                node.cascade().forEach((item) => {
                    deleteMapY(item.id);
                    setMapY((item.depth * -1) - 2, item.id, item);
                });
            };
            for (const depth of mapY.values()) {
                this.processing.depthMap.clear();
                for (const parent of depth.values()) {
                    if (parent.length === 0 || parent.every(node => node.rendered)) {
                        continue;
                    }
                    const axisY = parent.duplicate();
                    const hasFloat = axisY.some(node => node.floating);
                    const cleared = hasFloat ? NodeList.clearedAll(parent) : new Map();
                    const extensionsParent = parent.renderExtension.size ? Array.from(parent.renderExtension) : [];
                    const extensionsChild = extensions.filter(item => item.subscribersChild.size);
                    let k = -1;
                    while (++k < axisY.length) {
                        let nodeY = axisY[k];
                        if (nodeY.rendered || !nodeY.visible) {
                            continue;
                        }
                        else if (nodeY.htmlElement) {
                            const element = nodeY.element;
                            if (this.parseElements.has(element) && !nodeY.documentRoot && !nodeY.documentBody) {
                                continue;
                            }
                            else if (nodeY.length === 0 && element.children.length && Array.from(element.children).every(item => this.parseElements.has(item))) {
                                nodeY.inlineText = false;
                            }
                        }
                        let parentY = nodeY.parent;
                        let unknownParent = parentY.hasAlign(2 /* UNKNOWN */);
                        const extendable = nodeY.hasAlign(8192 /* EXTENDABLE */);
                        if (nodeY.pageFlow &&
                            axisY.length > 1 &&
                            k < axisY.length - 1 &&
                            !parentY.hasAlign(4 /* AUTO_LAYOUT */) &&
                            (parentY.alignmentType === 0 || unknownParent || extendable) &&
                            !nodeY.hasBit('excludeSection', APP_SECTION.DOM_TRAVERSE)) {
                            const horizontal = [];
                            const vertical = [];
                            const floatSegment = new Set();
                            let verticalExtended = false;
                            function checkHorizontal(node) {
                                if (vertical.length || verticalExtended) {
                                    return false;
                                }
                                horizontal.push(node);
                                return true;
                            }
                            function checkVertical(node) {
                                if (parentY.layoutVertical && vertical.length) {
                                    const previousAbove = vertical[vertical.length - 1];
                                    if (previousAbove.layoutVertical) {
                                        node.parent = previousAbove;
                                        return true;
                                    }
                                }
                                vertical.push(node);
                                return true;
                            }
                            let l = k;
                            let m = 0;
                            if (extendable && parentY.layoutVertical) {
                                horizontal.push(nodeY);
                                l++;
                                m++;
                            }
                            domNested: {
                                for (; l < axisY.length; l++, m++) {
                                    const item = axisY[l];
                                    if (item.pageFlow) {
                                        if (hasFloat) {
                                            const float = cleared.get(item);
                                            if (float) {
                                                if (float === 'both') {
                                                    floatSegment.clear();
                                                }
                                                else {
                                                    floatSegment.delete(float);
                                                }
                                            }
                                            if (item.floating) {
                                                floatSegment.add(item.float);
                                            }
                                        }
                                        const previousSiblings = item.previousSiblings();
                                        const previous = previousSiblings[previousSiblings.length - 1];
                                        const next = item.nextSiblings().shift();
                                        if (m === 0 && next) {
                                            if (item.blockStatic || next.alignedVertically([item], [item], cleared)) {
                                                vertical.push(item);
                                            }
                                            else {
                                                horizontal.push(item);
                                            }
                                        }
                                        else if (previous) {
                                            if (hasFloat) {
                                                const startNewRow = item.alignedVertically(previousSiblings, [...horizontal, ...vertical, item], cleared, false);
                                                if (startNewRow || settings.floatOverlapDisabled && previous.floating && item.blockStatic && floatSegment.size === 2) {
                                                    if (horizontal.length) {
                                                        if (!settings.floatOverlapDisabled &&
                                                            floatSegment.size &&
                                                            !previous.autoMargin.horizontal &&
                                                            !previousSiblings.some(node => node.lineBreak && !cleared.has(node)) &&
                                                            cleared.get(item) !== 'both') {
                                                            const floatBottom = maxArray(horizontal.filter(node => node.floating).map(node => node.linear.bottom));
                                                            if (!item.floating || item.linear.top < floatBottom) {
                                                                const floated = NodeList.floated(horizontal);
                                                                if (cleared.has(item)) {
                                                                    if (!item.floating && floatSegment.size < 2 && floated.size === 2) {
                                                                        item.alignmentType |= 8192 /* EXTENDABLE */;
                                                                        verticalExtended = true;
                                                                        horizontal.push(item);
                                                                        continue;
                                                                    }
                                                                    break domNested;
                                                                }
                                                                else if (!startNewRow || floated.size === 1 && (!item.floating || floatSegment.has(item.float))) {
                                                                    horizontal.push(item);
                                                                    if (item.linear.bottom > floatBottom) {
                                                                        break domNested;
                                                                    }
                                                                    else {
                                                                        continue;
                                                                    }
                                                                }
                                                            }
                                                        }
                                                        break domNested;
                                                    }
                                                    checkVertical(item);
                                                }
                                                else {
                                                    if (!checkHorizontal(item)) {
                                                        break domNested;
                                                    }
                                                }
                                            }
                                            else {
                                                if (item.alignedVertically(previousSiblings)) {
                                                    checkVertical(item);
                                                }
                                                else {
                                                    if (!checkHorizontal(item)) {
                                                        break domNested;
                                                    }
                                                }
                                            }
                                        }
                                        else {
                                            break domNested;
                                        }
                                    }
                                }
                            }
                            let result;
                            let segmentEnd;
                            if (horizontal.length > 1) {
                                const layout = new Layout(parentY, nodeY, 0, 0, horizontal.length, horizontal);
                                layout.init();
                                result = this.controllerHandler.processTraverseHorizontal(layout, axisY);
                                segmentEnd = horizontal[horizontal.length - 1];
                            }
                            else if (vertical.length > 1) {
                                const layout = new Layout(parentY, nodeY, 0, 0, vertical.length, vertical);
                                layout.init();
                                result = this.controllerHandler.processTraverseVertical(layout, axisY);
                                segmentEnd = vertical[vertical.length - 1];
                                if (!segmentEnd.blockStatic && segmentEnd !== axisY[axisY.length - 1]) {
                                    segmentEnd.alignmentType |= 8192 /* EXTENDABLE */;
                                }
                            }
                            if (unknownParent && segmentEnd === axisY[axisY.length - 1]) {
                                parentY.alignmentType ^= 2 /* UNKNOWN */;
                                unknownParent = false;
                            }
                            if (result) {
                                const layout = result.layout;
                                const output = this.renderLayout(layout);
                                if (output !== '') {
                                    this.addRenderTemplate(parentY, layout.node, output, true);
                                    parentY = nodeY.parent;
                                }
                            }
                        }
                        if (unknownParent && k === axisY.length - 1) {
                            parentY.alignmentType ^= 2 /* UNKNOWN */;
                        }
                        if (extendable) {
                            nodeY.alignmentType ^= 8192 /* EXTENDABLE */;
                        }
                        if (nodeY.renderAs && parentY.appendTry(nodeY, nodeY.renderAs, false)) {
                            nodeY.hide();
                            nodeY = nodeY.renderAs;
                            if (nodeY.positioned) {
                                parentY = nodeY.parent;
                            }
                        }
                        if (!nodeY.rendered && !nodeY.hasBit('excludeSection', APP_SECTION.EXTENSION)) {
                            let next = false;
                            if (extensionsParent.length || extensionsChild.length) {
                                const combined = extensionsParent.slice(0);
                                if (extensionsChild.length) {
                                    combined.push(...extensionsChild.filter(item => item.subscribersChild.has(nodeY)));
                                }
                                for (const ext of combined) {
                                    const result = ext.processChild(nodeY, parentY);
                                    if (result.output) {
                                        this.addRenderTemplate(parentY, nodeY, result.output);
                                    }
                                    if (result.renderAs && result.outputAs) {
                                        this.addRenderTemplate(parentY, result.renderAs, result.outputAs);
                                    }
                                    if (result.parent) {
                                        parentY = result.parent;
                                    }
                                    next = result.next === true;
                                    if (result.complete || result.next) {
                                        break;
                                    }
                                }
                            }
                            if (next) {
                                continue;
                            }
                            if (nodeY.styleElement) {
                                prioritizeExtensions(documentRoot.element, nodeY.element, extensions).some(item => {
                                    if (item.is(nodeY) && item.condition(nodeY, parentY)) {
                                        const result = item.processNode(nodeY, parentY);
                                        if (result.output) {
                                            this.addRenderTemplate(parentY, nodeY, result.output);
                                        }
                                        if (result.renderAs && result.outputAs) {
                                            this.addRenderTemplate(parentY, result.renderAs, result.outputAs);
                                        }
                                        if (result.parent) {
                                            parentY = result.parent;
                                        }
                                        if (result.output || result.include === true) {
                                            item.subscribers.add(nodeY);
                                            nodeY.renderExtension.add(item);
                                        }
                                        next = result.next === true;
                                        if (result.complete || result.next) {
                                            return true;
                                        }
                                    }
                                    return false;
                                });
                                if (next) {
                                    continue;
                                }
                            }
                        }
                        if (!nodeY.rendered && !nodeY.hasBit('excludeSection', APP_SECTION.RENDER)) {
                            let layout = new Layout(parentY, nodeY, nodeY.containerType, nodeY.alignmentType, nodeY.length, nodeY.children);
                            if (layout.containerType === 0) {
                                let result;
                                if (nodeY.length) {
                                    result = this.controllerHandler.processUnknownParent(layout);
                                }
                                else {
                                    result = this.controllerHandler.processUnknownChild(layout);
                                }
                                if (result.next === true) {
                                    continue;
                                }
                                else if (result.renderAs) {
                                    axisY[k] = result.renderAs;
                                    k--;
                                    continue;
                                }
                                else {
                                    layout = result.layout;
                                }
                            }
                            const output = this.renderLayout(layout);
                            if (output !== '') {
                                this.addRenderTemplate(parentY, nodeY, output);
                            }
                        }
                    }
                }
                for (const [id, templates] of this.processing.depthMap.entries()) {
                    const renderPosition = this._renderPosition.get(id);
                    let children;
                    if (renderPosition) {
                        children = this.controllerHandler.sortRenderPosition(renderPosition.parent, renderPosition.children);
                    }
                    else if (id !== 0) {
                        const parent = this.processing.cache.find('id', id);
                        children = parent ? this.controllerHandler.sortRenderPosition(parent, parent.children) : [];
                    }
                    if (children && children.length) {
                        const sorted = new Map();
                        children.forEach(node => {
                            const key = node.renderPositionId;
                            const result = templates.get(key) || (node.companion ? templates.get(node.companion.renderPositionId) : null);
                            if (result) {
                                sorted.set(key, result);
                            }
                        });
                        if (sorted.size === templates.size) {
                            this.processing.depthMap.set(id, sorted);
                        }
                    }
                }
                for (const ext of this.extensions) {
                    ext.afterDepthLevel();
                }
                for (const [id, templates] of this.processing.depthMap.entries()) {
                    for (const [key, view] of templates.entries()) {
                        const placeholder = formatPlaceholder(key.indexOf('^') !== -1 ? key : id);
                        if (baseTemplate.indexOf(placeholder) !== -1) {
                            baseTemplate = replacePlaceholder(baseTemplate, placeholder, view);
                            empty = false;
                        }
                        else {
                            this.addRenderQueue(key.indexOf('^') !== -1 ? `${id}|${key}` : id.toString(), view);
                        }
                    }
                }
            }
            if (documentRoot.dataset.layoutName && (!hasValue(documentRoot.dataset.target) || documentRoot.renderExtension.size === 0)) {
                this.addLayoutFile(documentRoot.dataset.layoutName, !empty ? baseTemplate : '', trimString(trimNull(documentRoot.dataset.pathname), '/'), documentRoot.renderExtension.size > 0 && Array.from(documentRoot.renderExtension).some(item => item.documentRoot));
            }
            if (empty && documentRoot.renderExtension.size === 0) {
                documentRoot.hide();
            }
            this.processing.cache.sort((a, b) => {
                if (!a.visible || !a.rendered) {
                    return 1;
                }
                else if (a.renderDepth !== b.renderDepth) {
                    return a.renderDepth < b.renderDepth ? -1 : 1;
                }
                else if (a.renderParent !== b.renderParent) {
                    return a.documentParent.id < b.documentParent.id ? -1 : 1;
                }
                else {
                    return a.siblingIndex < b.siblingIndex ? -1 : 1;
                }
            });
            this.session.cache.children.push(...this.processing.cache);
            this.session.excluded.children.push(...this.processing.excluded);
            for (const ext of this.extensions) {
                for (const node of ext.subscribers) {
                    ext.postBaseLayout(node);
                }
            }
            for (const ext of this.extensions) {
                ext.afterBaseLayout();
            }
        }
        setConstraints() {
            this.controllerHandler.setConstraints();
            for (const ext of this.extensions) {
                for (const node of ext.subscribers) {
                    ext.postConstraints(node);
                }
            }
            for (const ext of this.extensions) {
                ext.afterConstraints();
            }
        }
        setResources() {
            this.resourceHandler.setBoxStyle();
            this.resourceHandler.setFontStyle();
            this.resourceHandler.setValueString();
            for (const ext of this.extensions) {
                ext.afterResources();
            }
        }
        processRenderQueue() {
            const template = {};
            for (const [id, templates] of this.session.renderQueue.entries()) {
                const [parentId, positionId] = id.split('|');
                let replaceId = parentId;
                if (!isNumber(replaceId)) {
                    const element = document.getElementById(replaceId);
                    if (element) {
                        const target = getElementAsNode(element);
                        if (target) {
                            replaceId = target.id.toString();
                        }
                    }
                }
                let output = templates.join('\n');
                if (replaceId !== parentId) {
                    const target = this.session.cache.find('id', parseInt(replaceId));
                    if (target) {
                        output = this.controllerHandler.replaceIndent(output, target.renderDepth + 1, this.session.cache.children);
                    }
                }
                template[positionId || replaceId] = output;
            }
            for (const view of this.viewData) {
                for (const id in template) {
                    view.content = view.content.replace(formatPlaceholder(id), template[id]);
                }
                view.content = this.controllerHandler.replaceRenderQueue(view.content);
            }
        }
        processFloatHorizontal(data) {
            const settings = this.userSettings;
            let layerIndex = [];
            let output = '';
            if (data.cleared.size === 0 && !data.some(node => node.autoMargin.horizontal)) {
                const inline = [];
                const left = [];
                const right = [];
                for (const node of data) {
                    if (node.float === 'right') {
                        right.push(node);
                    }
                    else if (node.float === 'left') {
                        left.push(node);
                    }
                    else {
                        inline.push(node);
                    }
                }
                const layout = new Layout(data.parent, data.node, 0, 0, data.itemCount, data.children);
                layout.init();
                if (inline.length === layout.itemCount || left.length === layout.itemCount || right.length === layout.itemCount) {
                    this.controllerHandler.processLayoutHorizontal(layout);
                    return this.renderNode(layout);
                }
                else if ((left.length === 0 || right.length === 0) && (this.userSettings.floatOverlapDisabled || !inline.some(item => item.blockStatic))) {
                    const subgroup = [];
                    if (right.length === 0) {
                        subgroup.push(...left, ...inline);
                        const horizontal = this.controllerHandler.containerTypeHorizontal;
                        layout.setType(horizontal.containerType, horizontal.alignmentType);
                        layerIndex = [left, inline];
                    }
                    else {
                        subgroup.push(...inline, ...right);
                        const vertical = this.controllerHandler.containerTypeVerticalMargin;
                        layout.setType(vertical.containerType, vertical.alignmentType);
                        layerIndex = [inline, right];
                    }
                    layout.retain(subgroup);
                    output = this.renderNode(layout);
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
            if (layerIndex.length === 0) {
                let current = '';
                let pendingFloat = 0;
                for (let i = 0; i < data.length; i++) {
                    const node = data.item(i);
                    if (data.cleared.has(node)) {
                        const clear = data.cleared.get(node);
                        if (hasBit(pendingFloat, clear === 'right' ? 4 : 2) || pendingFloat !== 0 && clear === 'both') {
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
                        if (node.float === 'right') {
                            rightAbove.push(node);
                            if (node.floating) {
                                pendingFloat |= 4;
                            }
                        }
                        else if (node.float === 'left') {
                            leftAbove.push(node);
                            if (node.floating) {
                                pendingFloat |= 2;
                            }
                        }
                        else if (node.autoMargin.horizontal) {
                            if (node.autoMargin.left) {
                                if (rightAbove.length) {
                                    rightBelow.push(node);
                                }
                                else {
                                    rightAbove.push(node);
                                }
                            }
                            else if (node.autoMargin.right) {
                                if (leftAbove.length) {
                                    leftBelow.push(node);
                                }
                                else {
                                    leftAbove.push(node);
                                }
                            }
                            else {
                                if (inlineAbove.length) {
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
                        if (node.float === 'right') {
                            if (rightBelow.length === 0) {
                                pendingFloat |= 4;
                            }
                            if (!settings.floatOverlapDisabled && current !== 'right' && rightAbove.length) {
                                rightAbove.push(node);
                            }
                            else {
                                rightBelow.push(node);
                            }
                        }
                        else if (node.float === 'left') {
                            if (leftBelow.length === 0) {
                                pendingFloat |= 2;
                            }
                            if (!settings.floatOverlapDisabled && current !== 'left' && leftAbove.length) {
                                leftAbove.push(node);
                            }
                            else {
                                leftBelow.push(node);
                            }
                        }
                        else if (node.autoMargin.horizontal) {
                            if (node.autoMargin.left && rightBelow.length) {
                                rightBelow.push(node);
                            }
                            else if (node.autoMargin.right && leftBelow.length) {
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
                if (leftAbove.length && leftBelow.length) {
                    leftSub = [leftAbove, leftBelow];
                }
                else if (leftAbove.length) {
                    leftSub = leftAbove;
                }
                else if (leftBelow.length) {
                    leftSub = leftBelow;
                }
                if (rightAbove.length && rightBelow.length) {
                    rightSub = [rightAbove, rightBelow];
                }
                else if (rightAbove.length) {
                    rightSub = rightAbove;
                }
                else if (rightBelow.length) {
                    rightSub = rightBelow;
                }
                const layout = new Layout(data.parent, data.node, 0, rightAbove.length + rightBelow.length === data.length ? 512 /* RIGHT */ : 0);
                if (settings.floatOverlapDisabled) {
                    if (data.node.groupParent && data.parent.layoutVertical) {
                        data.node.alignmentType |= layout.alignmentType;
                        output = formatPlaceholder(data.node.id);
                        data.node.render(data.parent);
                        data.node.renderDepth--;
                    }
                    else {
                        const vertical = this.controllerHandler.containerTypeVertical;
                        layout.setType(vertical.containerType, vertical.alignmentType);
                        output = this.renderNode(layout);
                    }
                    if (inlineAbove.length) {
                        layerIndex.push(inlineAbove);
                    }
                    if (leftAbove.length || rightAbove.length) {
                        layerIndex.push([leftAbove, rightAbove]);
                    }
                    if (leftBelow.length || rightBelow.length) {
                        layerIndex.push([leftBelow, rightBelow]);
                    }
                    if (inlineBelow.length) {
                        layerIndex.push(inlineBelow);
                    }
                    layout.itemCount = layerIndex.length;
                }
                else {
                    if (inlineAbove.length) {
                        if (rightBelow.length) {
                            leftSub = [inlineAbove, leftAbove];
                            layerIndex.push(leftSub, rightSub);
                        }
                        else if (leftBelow.length) {
                            rightSub = [inlineAbove, rightAbove];
                            layerIndex.push(rightSub, leftSub);
                        }
                        else {
                            layerIndex.push(inlineAbove, leftSub, rightSub);
                        }
                    }
                    else {
                        if (leftSub === leftBelow && rightSub === rightAbove || leftSub === leftAbove && rightSub === rightBelow) {
                            if (leftBelow.length === 0) {
                                layerIndex.push([leftAbove, rightBelow]);
                            }
                            else {
                                layerIndex.push([rightAbove, leftBelow]);
                            }
                        }
                        else {
                            layerIndex.push(leftSub, rightSub);
                        }
                    }
                    layerIndex = layerIndex.filter(item => item.length > 0);
                    layout.itemCount = layerIndex.length;
                    const vertical = inlineAbove.length === 0 && (leftSub.length === 0 || rightSub.length === 0) ? this.controllerHandler.containerTypeVertical : this.controllerHandler.containerTypeVerticalMargin;
                    layout.setType(vertical.containerType, vertical.alignmentType);
                    output = this.renderNode(layout);
                }
            }
            if (layerIndex.length) {
                const floating = [inlineAbove, leftAbove, leftBelow, rightAbove, rightBelow];
                let floatgroup;
                layerIndex.forEach((item, index) => {
                    if (Array.isArray(item[0])) {
                        const grouping = [];
                        item.forEach(segment => grouping.push(...segment));
                        grouping.sort(NodeList.siblingIndex);
                        floatgroup = this.controllerHandler.createNodeGroup(grouping[0], grouping, data.node);
                        const layout = new Layout(data.node, floatgroup, 0, (item.some(segment => segment === rightSub || segment === rightAbove) ? 512 /* RIGHT */ : 0), item.length);
                        let vertical;
                        if (settings.floatOverlapDisabled) {
                            vertical = this.controllerHandler.containerTypeVerticalMargin;
                        }
                        else {
                            if (data.node.layoutVertical) {
                                floatgroup = data.node;
                            }
                            else {
                                vertical = this.controllerHandler.containerTypeVertical;
                            }
                        }
                        if (vertical) {
                            layout.setType(vertical.containerType, vertical.alignmentType);
                            output = replacePlaceholder(output, data.node.id, this.renderNode(layout));
                        }
                    }
                    else {
                        floatgroup = undefined;
                    }
                    (Array.isArray(item[0]) ? item : [item]).forEach(segment => {
                        let basegroup = data.node;
                        if (floatgroup && floating.includes(segment)) {
                            basegroup = floatgroup;
                        }
                        let target;
                        if (segment.length > 1) {
                            target = this.controllerHandler.createNodeGroup(segment[0], segment, basegroup);
                            const layout = new Layout(basegroup, target, 0, 128 /* SEGMENTED */, segment.length, segment);
                            if (layout.linearY) {
                                const vertical = this.controllerHandler.containerTypeVertical;
                                layout.setType(vertical.containerType, vertical.alignmentType);
                            }
                            else {
                                layout.init();
                                this.controllerHandler.processLayoutHorizontal(layout);
                            }
                            output = replacePlaceholder(output, basegroup.id, this.renderNode(layout));
                        }
                        else if (segment.length) {
                            target = segment[0];
                            target.alignmentType |= 2048 /* SINGLE */;
                            target.renderPosition = index;
                            output = replacePlaceholder(output, basegroup.id, formatPlaceholder(target.renderPositionId));
                        }
                        if (!settings.floatOverlapDisabled && target && segment === inlineAbove && segment.some(subitem => subitem.blockStatic && !subitem.hasWidth)) {
                            const vertical = this.controllerHandler.containerTypeVertical;
                            const targeted = target.of(vertical.containerType, vertical.alignmentType) ? target.children : [target];
                            if (leftAbove.length) {
                                const marginRight = maxArray(leftAbove.map(subitem => subitem.linear.right));
                                const boundsLeft = minArray(segment.map(subitem => subitem.bounds.left));
                                targeted.forEach(subitem => subitem.modifyBox(256 /* PADDING_LEFT */, marginRight - boundsLeft));
                            }
                            if (rightAbove.length) {
                                const marginLeft = minArray(rightAbove.map(subitem => subitem.linear.left));
                                const boundsRight = maxArray(segment.map(subitem => subitem.bounds.right));
                                targeted.forEach(subitem => subitem.modifyBox(64 /* PADDING_RIGHT */, boundsRight - marginLeft));
                            }
                        }
                    });
                });
            }
            return output;
        }
        processFloatVertical(data) {
            const controller = this.controllerHandler;
            const vertical = controller.containerTypeVertical;
            const group = data.node;
            const layoutGroup = new Layout(data.parent, group, vertical.containerType, vertical.alignmentType, data.length);
            let output = this.renderNode(layoutGroup);
            const staticRows = [];
            const floatedRows = [];
            const current = [];
            const floated = [];
            let clearReset = false;
            let blockArea = false;
            let layoutVertical = true;
            for (const node of data) {
                if (node.blockStatic && floated.length === 0) {
                    current.push(node);
                    blockArea = true;
                }
                else {
                    if (data.cleared.has(node)) {
                        if (!node.floating) {
                            node.modifyBox(2 /* MARGIN_TOP */, null);
                            staticRows.push(current.slice(0));
                            current.length = 0;
                            floatedRows.push(floated.slice(0));
                            floated.length = 0;
                        }
                        else {
                            clearReset = true;
                        }
                    }
                    if (node.floating) {
                        if (blockArea) {
                            staticRows.push(current.slice(0));
                            floatedRows.push(null);
                            current.length = 0;
                            floated.length = 0;
                            blockArea = false;
                        }
                        floated.push(node);
                    }
                    else {
                        if (clearReset && !data.cleared.has(node)) {
                            layoutVertical = false;
                        }
                        current.push(node);
                    }
                }
            }
            if (floated.length) {
                floatedRows.push(floated);
            }
            if (current.length) {
                staticRows.push(current);
            }
            if (!layoutVertical) {
                let xml = '';
                for (let i = 0; i < Math.max(floatedRows.length, staticRows.length); i++) {
                    const pageFlow = staticRows[i] || [];
                    if (floatedRows[i] === null && pageFlow.length) {
                        if (pageFlow.length > 1) {
                            const layoutType = controller.containerTypeVertical;
                            layoutType.alignmentType |= 128 /* SEGMENTED */;
                            const layout = new Layout(group, controller.createNodeGroup(pageFlow[0], pageFlow, group), layoutType.containerType, layoutType.alignmentType, pageFlow.length, pageFlow);
                            xml += this.renderNode(layout);
                        }
                        else {
                            const single = pageFlow[0];
                            single.alignmentType |= 2048 /* SINGLE */;
                            single.renderPosition = i;
                            output = replacePlaceholder(output, group.id, formatPlaceholder(single.renderPositionId));
                        }
                    }
                    else {
                        const floating = floatedRows[i] || [];
                        if (pageFlow.length || floating.length) {
                            const basegroup = controller.createNodeGroup(floating[0] || pageFlow[0], [], group);
                            const verticalMargin = controller.containerTypeVerticalMargin;
                            const layout = new Layout(group, basegroup, verticalMargin.containerType, verticalMargin.alignmentType);
                            const children = [];
                            let subgroup;
                            if (floating.length) {
                                if (floating.length > 1) {
                                    subgroup = controller.createNodeGroup(floating[0], floating, basegroup);
                                    layout.add(64 /* FLOAT */);
                                    if (pageFlow.length === 0 && floating.every(item => item.float === 'right')) {
                                        layout.add(512 /* RIGHT */);
                                    }
                                }
                                else {
                                    subgroup = floating[0];
                                    subgroup.parent = basegroup;
                                }
                            }
                            if (subgroup) {
                                children.push(subgroup);
                                subgroup = undefined;
                            }
                            if (pageFlow.length) {
                                if (pageFlow.length > 1) {
                                    subgroup = controller.createNodeGroup(pageFlow[0], pageFlow, basegroup);
                                }
                                else {
                                    subgroup = pageFlow[0];
                                    subgroup.parent = basegroup;
                                }
                            }
                            if (subgroup) {
                                children.push(subgroup);
                            }
                            basegroup.init();
                            layout.itemCount = children.length;
                            xml += this.renderNode(layout);
                            children.forEach(node => {
                                if (data.contains(node) || node.length === 0) {
                                    xml = replacePlaceholder(xml, basegroup.id, formatPlaceholder(node.id));
                                }
                                else {
                                    const layoutSegment = new Layout(basegroup, node, vertical.containerType, vertical.alignmentType | 128 /* SEGMENTED */, node.length, node.children);
                                    xml = replacePlaceholder(xml, basegroup.id, this.renderNode(layoutSegment));
                                }
                            });
                        }
                    }
                }
                output = replacePlaceholder(output, group.id, xml);
            }
            return output;
        }
        insertNode(element, parent) {
            let node = null;
            if (hasComputedStyle(element)) {
                const nodeConstructor = this.createNode(element);
                if (!this.controllerHandler.localSettings.unsupported.excluded.has(element.tagName) && this.conditionElement(element)) {
                    node = nodeConstructor;
                    node.setExclusions();
                }
                else {
                    nodeConstructor.visible = false;
                    nodeConstructor.excluded = true;
                    this.processing.excluded.append(nodeConstructor);
                }
            }
            else if (element.nodeName.charAt(0) === '#' && element.nodeName === '#text') {
                if (isPlainText(element, true) || cssParent(element, 'whiteSpace', 'pre', 'pre-wrap')) {
                    node = this.createNode(element);
                    if (parent) {
                        node.inherit(parent, 'textStyle');
                    }
                    else {
                        node.css('whiteSpace', getStyle(element.parentElement).whiteSpace || 'normal');
                    }
                    node.cssApply({
                        position: 'static',
                        display: 'inline',
                        verticalAlign: 'baseline',
                        cssFloat: 'none',
                        clear: 'none',
                    });
                }
            }
            if (node) {
                this.processing.cache.append(node);
            }
            return node;
        }
        conditionElement(element) {
            if (element.parentElement instanceof SVGSVGElement) {
                return false;
            }
            else if (hasComputedStyle(element)) {
                if (hasValue(element.dataset.use)) {
                    return true;
                }
                else if (withinViewportOrigin(element)) {
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
                    if (valid && element.children.length) {
                        return Array.from(element.children).some((item) => {
                            const style = getStyle(item);
                            const float = style.cssFloat;
                            const position = style.position;
                            return position === 'absolute' || position === 'fixed' || float === 'left' || float === 'right';
                        });
                    }
                }
                return false;
            }
            else {
                return isPlainText(element);
            }
        }
        setStyleMap() {
            violation: {
                for (let i = 0; i < document.styleSheets.length; i++) {
                    const item = document.styleSheets[i];
                    if (item.cssRules) {
                        for (let j = 0; j < item.cssRules.length; j++) {
                            const rule = item.cssRules[j];
                            try {
                                switch (rule.type) {
                                    case CSSRule.STYLE_RULE:
                                        this.applyStyleRule(rule);
                                        break;
                                    case CSSRule.MEDIA_RULE:
                                        const patternA = /(?:(not|only)?\s*(?:all|screen) and )?((?:\([^)]+\)(?: and )?)+),?\s*/g;
                                        let matchA;
                                        let statement = false;
                                        while (!statement && ((matchA = patternA.exec(rule.conditionText)) !== null)) {
                                            const negate = matchA[1] === 'not';
                                            const patternB = /\(([a-z\-]+)\s*(:|<?=?|=?>?)?\s*([\w.%]+)?\)(?: and )?/g;
                                            let matchB;
                                            let valid = false;
                                            while (!statement && (matchB = patternB.exec(matchA[2])) !== null) {
                                                const attr = matchB[1];
                                                let operation;
                                                if (matchB[1].startsWith('min')) {
                                                    operation = '>=';
                                                }
                                                else if (matchB[1].startsWith('max')) {
                                                    operation = '<=';
                                                }
                                                else {
                                                    operation = matchA[2];
                                                }
                                                const value = matchB[3];
                                                switch (attr) {
                                                    case 'aspect-ratio':
                                                    case 'min-aspect-ratio':
                                                    case 'max-aspect-ratio':
                                                        const [width, height] = value.split('/').map(ratio => parseInt(ratio));
                                                        valid = compareRange(operation, window.innerWidth / window.innerHeight, width / height);
                                                        break;
                                                    case 'width':
                                                    case 'min-width':
                                                    case 'max-width':
                                                    case 'height':
                                                    case 'min-height':
                                                    case 'max-height':
                                                        valid = compareRange(operation, attr.indexOf('width') !== -1 ? window.innerWidth : window.innerHeight, parseFloat(convertPX(value, convertInt(getStyle(document.body).fontSize || '16'))));
                                                        break;
                                                    case 'orientation':
                                                        valid = value === 'portrait' && window.innerWidth <= window.innerHeight || value === 'landscape' && window.innerWidth > window.innerHeight;
                                                        break;
                                                    case 'resolution':
                                                    case 'min-resolution':
                                                    case 'max-resolution':
                                                        let resolution = parseFloat(value);
                                                        if (value.endsWith('dpcm')) {
                                                            resolution *= 2.54;
                                                        }
                                                        else if (value.endsWith('dppx') || value.endsWith('x')) {
                                                            resolution *= 96;
                                                        }
                                                        valid = compareRange(operation, window.devicePixelRatio * 96, resolution);
                                                        break;
                                                    case 'grid':
                                                        valid = value === '0';
                                                        break;
                                                    case 'color':
                                                        valid = value === undefined || convertInt(value) > 0;
                                                        break;
                                                    case 'min-color':
                                                        valid = convertInt(value) <= screen.colorDepth / 3;
                                                        break;
                                                    case 'max-color':
                                                        valid = convertInt(value) >= screen.colorDepth / 3;
                                                        break;
                                                    case 'color-index':
                                                    case 'min-color-index':
                                                    case 'monochrome':
                                                    case 'min-monochrome':
                                                        valid = value === '0';
                                                        break;
                                                    case 'max-color-index':
                                                    case 'max-monochrome':
                                                        valid = convertInt(value) >= 0;
                                                        break;
                                                    default:
                                                        valid = false;
                                                        break;
                                                }
                                                if (!valid) {
                                                    break;
                                                }
                                            }
                                            if (!negate && valid || negate && !valid) {
                                                statement = true;
                                            }
                                        }
                                        if (statement) {
                                            const items = rule.cssRules;
                                            for (let k = 0; k < items.length; k++) {
                                                this.applyStyleRule(items[k]);
                                            }
                                        }
                                        break;
                                }
                            }
                            catch (error) {
                                alert('External CSS files cannot be parsed with some browsers when loading HTML pages directly from your hard drive. ' +
                                    'Either use a local web server, embed your CSS into a <style> element, or you can also try a different browser. ' +
                                    'See the README for more detailed instructions.\n\n' +
                                    `${item.href}\n\n${error}`);
                                break violation;
                            }
                        }
                    }
                }
            }
        }
        applyStyleRule(item) {
            const clientFirefox = isUserAgent(16 /* FIREFOX */);
            const fromRule = [];
            for (const attr of Array.from(item.style)) {
                fromRule.push(convertCamelCase(attr));
            }
            document.querySelectorAll(item.selectorText).forEach((element) => {
                const style = getStyle(element);
                const fontSize = parseInt(convertPX(style.fontSize || '16px', 0));
                const styleMap = {};
                for (const attr of fromRule) {
                    const value = checkStyleAttribute(element, attr, item.style[attr], style, fontSize);
                    if (value !== '') {
                        styleMap[attr] = value;
                    }
                }
                for (let attr of Array.from(element.style)) {
                    attr = convertCamelCase(attr);
                    const value = checkStyleAttribute(element, attr, element.style[attr], style, fontSize);
                    if (value !== '') {
                        styleMap[attr] = value;
                    }
                }
                if (this.userSettings.preloadImages && hasValue(styleMap.backgroundImage) && styleMap.backgroundImage !== 'initial') {
                    for (const value of styleMap.backgroundImage.split(',')) {
                        const uri = cssResolveUrl(value.trim());
                        if (uri !== '' && !this.session.image.has(uri)) {
                            this.session.image.set(uri, { width: 0, height: 0, uri });
                        }
                    }
                }
                if (clientFirefox && styleMap.display === undefined) {
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
        set appName(value) {
            if (this.resourceHandler.fileHandler) {
                this.resourceHandler.fileHandler.appName = value;
            }
        }
        get appName() {
            return this.resourceHandler.fileHandler ? this.resourceHandler.fileHandler.appName : '';
        }
        set userSettings(value) {
            this._userSettings = value;
        }
        get userSettings() {
            return this._userSettings || {};
        }
        get viewData() {
            return [...this._views, ...this._includes];
        }
        get sessionData() {
            return {
                cache: this.session.cache,
                views: this._views,
                includes: this._includes
            };
        }
        get rendered() {
            return this.session.cache.filter(node => node.visible && node.rendered);
        }
        get nextId() {
            return this.processing.cache.nextId;
        }
        get size() {
            return this._views.length + this._includes.length;
        }
    }

    class Controller {
        constructor(application, cache) {
            this.application = application;
            this.cache = cache;
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
            if (this._before[id] === undefined) {
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
            if (this._after[id] === undefined) {
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
            return this._before[id] !== undefined || this._after[id] !== undefined;
        }
        getEnclosingTag(controlName, id, depth, xml = '') {
            const indent = repeat(Math.max(0, depth));
            let output = `{<${id}}`;
            if (xml !== '') {
                output += indent + `<${controlName}${depth === 0 ? '{#0}' : ''}{@${id}}>\n` +
                    xml +
                    indent + `</${controlName}>\n`;
            }
            else {
                output += indent + `<${controlName}${depth === 0 ? '{#0}' : ''}{@${id}} />\n`;
            }
            output += `{>${id}}`;
            return output;
        }
        removePlaceholders(value) {
            return value.replace(/{[<:@#>]\d+(\^\d+)?}/g, '').trim();
        }
        replaceIndent(value, depth, cache) {
            value = replaceIndent(value, depth, /^({.*?})(\t*)(<.*)/);
            if (cache) {
                const pattern = /{@(\d+)}/g;
                let match;
                let i = 0;
                while ((match = pattern.exec(value)) !== null) {
                    const id = parseInt(match[1]);
                    const node = cache.find(item => item.id === id);
                    if (node) {
                        if (i++ === 0) {
                            node.renderDepth = depth;
                        }
                        else if (node.renderParent) {
                            node.renderDepth = node.renderParent.renderDepth + 1;
                        }
                    }
                }
            }
            return value;
        }
    }

    class Extension {
        constructor(name, framework, tagNames, options) {
            this.name = name;
            this.framework = framework;
            this.tagNames = [];
            this.documentRoot = false;
            this.eventOnly = false;
            this.preloaded = false;
            this.options = {};
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
        static findNestedByName(element, name) {
            if (hasComputedStyle(element)) {
                return Array.from(element.children).find((item) => includes(item.dataset.use, name)) || null;
            }
            return null;
        }
        is(node) {
            return node.styleElement ? this.tagNames.length === 0 || this.tagNames.includes(node.element.tagName) : false;
        }
        require(name, preload = false) {
            this.dependencies.push({
                name,
                preload
            });
        }
        included(element) {
            return includes(element.dataset.use, this.name);
        }
        beforeInit(element, recursive = false) {
            if (!recursive && this.included(element)) {
                this.dependencies.filter(item => item.preload).forEach(item => {
                    const ext = this.application.extensionManager.retrieve(item.name);
                    if (ext && !ext.preloaded) {
                        ext.beforeInit(element, true);
                        ext.preloaded = true;
                    }
                });
            }
        }
        init(element) {
            return false;
        }
        afterInit(element, recursive = false) {
            if (!recursive && this.included(element)) {
                this.dependencies.filter(item => item.preload).forEach(item => {
                    const ext = this.application.extensionManager.retrieve(item.name);
                    if (ext && ext.preloaded) {
                        ext.afterInit(element, true);
                        ext.preloaded = false;
                    }
                });
            }
        }
        condition(node, parent) {
            if (hasComputedStyle(node.element)) {
                const ext = node.dataset.use;
                if (!ext) {
                    return this.tagNames.length > 0;
                }
                else {
                    return this.included(node.element);
                }
            }
            return false;
        }
        processNode(node, parent) {
            return { output: '', complete: false };
        }
        processChild(node, parent) {
            return { output: '', complete: false };
        }
        postBaseLayout(node) { }
        postConstraints(node) { }
        postParseDocument(node) { }
        postProcedure(node) { }
        beforeParseDocument() { }
        afterDepthLevel() { }
        afterBaseLayout() { }
        afterConstraints() { }
        afterResources() { }
        afterParseDocument() { }
        afterProcedure() { }
        afterFinalize() { }
        set application(value) {
            this._application = value;
        }
        get application() {
            return this._application || {};
        }
        get installed() {
            return this.application.extensions ? this.application.extensions.has(this) : false;
        }
    }

    class ExtensionManager {
        constructor(application) {
            this.application = application;
        }
        include(ext) {
            const found = this.retrieve(ext.name);
            if (found) {
                if (Array.isArray(ext.tagNames)) {
                    found.tagNames = ext.tagNames;
                }
                Object.assign(found.options, ext.options);
                return true;
            }
            else {
                if ((ext.framework === 0 || hasBit(ext.framework, this.application.framework)) && ext.dependencies.every(item => !!this.retrieve(item.name))) {
                    ext.application = this.application;
                    this.application.extensions.add(ext);
                    return true;
                }
            }
            return false;
        }
        exclude(ext) {
            return this.application.extensions.delete(ext);
        }
        retrieve(name) {
            return Array.from(this.application.extensions).find(item => item.name === name) || null;
        }
        optionValue(name, attr) {
            const ext = this.retrieve(name);
            if (ext && typeof ext.options === 'object') {
                return ext.options[attr];
            }
            return undefined;
        }
        optionValueAsObject(name, attr) {
            const value = this.optionValue(name, attr);
            if (typeof value === 'object') {
                return value;
            }
            return null;
        }
        optionValueAsString(name, attr) {
            const value = this.optionValue(name, attr);
            return typeof value === 'string' ? value : '';
        }
        optionValueAsNumber(name, attr) {
            const value = this.optionValue(name, attr);
            return typeof value === 'number' ? value : 0;
        }
        optionValueAsBoolean(name, attr) {
            const value = this.optionValue(name, attr);
            return typeof value === 'boolean' ? value : false;
        }
    }

    class File {
        constructor(resource) {
            this.resource = resource;
            this.appName = '';
            this.assets = [];
            resource.fileHandler = this;
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
        addAsset(pathname, filename, content = '', uri = '') {
            if (content !== '' || uri !== '') {
                const index = this.assets.findIndex(item => item.pathname === pathname && item.filename === filename);
                if (index !== -1) {
                    this.assets[index].content = content || '';
                    this.assets[index].uri = uri || '';
                }
                else {
                    this.assets.push({
                        pathname,
                        filename,
                        content,
                        uri
                    });
                }
            }
        }
        reset() {
            this.assets.length = 0;
        }
        saveToDisk(files) {
            const settings = this.userSettings;
            if (!location.protocol.startsWith('http')) {
                alert('SERVER (required): See README for instructions');
                return;
            }
            if (files.length) {
                files.push(...this.assets);
                fetch(`/api/savetodisk` +
                    `?directory=${encodeURIComponent(trimString(settings.outputDirectory, '/'))}` +
                    `&appname=${encodeURIComponent(this.appName.trim())}` +
                    `&filetype=${settings.outputArchiveFileType.toLowerCase()}` +
                    `&processingtime=${settings.outputMaxProcessingTime.toString().trim()}`, {
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
        get stored() {
            return this.resource.stored;
        }
    }

    class Node extends Container {
        constructor(id, element) {
            super();
            this.id = id;
            this.alignmentType = 0;
            this.depth = -1;
            this.siblingIndex = Number.MAX_VALUE;
            this.renderPosition = -1;
            this.documentRoot = false;
            this.visible = true;
            this.excluded = false;
            this.rendered = false;
            this.baselineActive = false;
            this.positioned = false;
            this.renderExtension = new Set();
            this.controlId = '';
            this._cached = {};
            this._styleMap = {};
            this._initial = {
                iteration: -1,
                children: [],
                styleMap: {}
            };
            this._renderDepth = -1;
            this._data = {};
            this._excludeSection = 0;
            this._excludeProcedure = 0;
            this._excludeResource = 0;
            this._element = null;
            if (element) {
                this._element = element;
                this.init();
            }
            else {
                this.style = {};
            }
        }
        init() {
            const element = this._element;
            if (element) {
                setElementCache(element, 'node', this);
                this.style = getElementCache(element, 'style') || getStyle(element, false);
            }
            if (this.styleElement) {
                const styleMap = getElementCache(element, 'styleMap') || {};
                const fontSize = convertInt(this.style.fontSize);
                for (let attr of Array.from(element.style)) {
                    attr = convertCamelCase(attr);
                    const value = checkStyleAttribute(element, attr, element.style[attr], this.style, fontSize);
                    if (value !== '') {
                        styleMap[attr] = value;
                    }
                }
                this._styleMap = Object.assign({}, styleMap);
            }
        }
        saveAsInitial() {
            if (this._initial.iteration === -1) {
                this._initial.children = this.duplicate();
                this._initial.styleMap = Object.assign({}, this._styleMap);
                this._initial.documentParent = this._documentParent;
            }
            if (this._bounds) {
                this._initial.bounds = assignBounds(this._bounds);
                this._initial.linear = assignBounds(this.linear);
                this._initial.box = assignBounds(this.box);
            }
            this._initial.iteration++;
        }
        is(...containers) {
            return containers.some(value => this.containerType === value);
        }
        of(containerType, ...alignmentType) {
            return this.containerType === containerType && alignmentType.some(value => this.hasAlign(value));
        }
        unsafe(obj) {
            const name = `_${obj}`;
            return this[name] || undefined;
        }
        attr(obj, attr, value = '', overwrite = true) {
            const name = `__${obj}`;
            if (hasValue(value)) {
                if (this[name] === undefined) {
                    this._namespaces.add(obj);
                    this[name] = {};
                }
                if (!overwrite && this[name][attr] !== undefined) {
                    return '';
                }
                this[name][attr] = value.toString();
            }
            return this[name][attr] || '';
        }
        namespace(obj) {
            const name = `__${obj}`;
            return this[name] || {};
        }
        delete(obj, ...attrs) {
            const name = `__${obj}`;
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
            for (const obj in options) {
                const namespace = options[obj];
                if (typeof namespace === 'object') {
                    for (const attr in namespace) {
                        this.attr(obj, attr, namespace[attr]);
                    }
                    delete options[obj];
                }
            }
        }
        render(parent) {
            this.renderParent = parent;
            this.renderDepth = this.documentRoot || this === parent || hasValue(parent.dataset.target) ? 0 : parent.renderDepth + 1;
            this.rendered = true;
        }
        renderEach(predicate) {
            for (let i = 0; i < this.renderChildren.length; i++) {
                if (this.renderChildren[i].visible) {
                    predicate(this.renderChildren[i], i, this.renderChildren);
                }
            }
            return this;
        }
        renderFilter(predicate) {
            return filterArray(this.renderChildren, predicate);
        }
        hide(invisible) {
            this.rendered = true;
            this.visible = false;
        }
        data(obj, attr, value, overwrite = true) {
            if (hasValue(value)) {
                if (this._data[obj] === undefined) {
                    this._data[obj] = {};
                }
                if (typeof this._data[obj] === 'object') {
                    if (overwrite || this._data[obj][attr] === undefined) {
                        this._data[obj][attr] = value;
                    }
                }
            }
            else if (value === null) {
                delete this._data[obj];
            }
            return this._data[obj] === undefined || this._data[obj][attr] === undefined ? undefined : this._data[obj][attr];
        }
        unsetCache(...attrs) {
            if (attrs.length) {
                for (const attr of attrs) {
                    switch (attr) {
                        case 'position':
                            this._cached = {};
                            return;
                        case 'width':
                        case 'minWidth':
                            this._cached.hasWidth = undefined;
                            break;
                        case 'height':
                        case 'minHeight':
                            this._cached.hasHeight = undefined;
                            break;
                        case 'verticalAlign':
                            this._cached.baseline = undefined;
                            break;
                        case 'display':
                            this._cached.inline = undefined;
                            this._cached.inlineVertical = undefined;
                            this._cached.inlineFlow = undefined;
                            this._cached.block = undefined;
                            this._cached.blockDimension = undefined;
                            this._cached.blockStatic = undefined;
                            this._cached.autoMargin = undefined;
                            break;
                        case 'pageFlow':
                            this._cached.positionAuto = undefined;
                            this._cached.blockStatic = undefined;
                            this._cached.baseline = undefined;
                            this._cached.floating = undefined;
                            this._cached.autoMargin = undefined;
                            this._cached.rightAligned = undefined;
                            this._cached.bottomAligned = undefined;
                            break;
                        default:
                            if (attr.startsWith('margin')) {
                                this._cached.autoMargin = undefined;
                            }
                            break;
                    }
                    this._cached[attr] = undefined;
                }
            }
            else {
                this._cached = {};
            }
        }
        ascend(generated = false, levels = -1) {
            const result = [];
            const attr = generated ? (this.renderParent ? 'renderParent' : 'parent') : 'actualParent';
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
        cascade(element = false) {
            function cascade(node) {
                const current = [];
                for (const item of node.children) {
                    if (!element || item.baseElement) {
                        current.push(item);
                    }
                    if (item.length) {
                        current.push(...cascade(item));
                    }
                }
                return current;
            }
            return cascade(this);
        }
        inherit(node, ...props) {
            const initial = node.unsafe('initial');
            for (const type of props) {
                switch (type) {
                    case 'initial':
                        Object.assign(this._initial, initial);
                        break;
                    case 'base':
                        this._documentParent = node.documentParent;
                        this._bounds = assignBounds(node.bounds);
                        this._linear = assignBounds(node.linear);
                        this._box = assignBounds(node.box);
                        const actualParent = node.actualParent;
                        if (actualParent) {
                            this.dir = actualParent.dir;
                        }
                        break;
                    case 'alignment':
                        ['position', 'top', 'right', 'bottom', 'left', 'display', 'verticalAlign', 'cssFloat', 'clear', 'zIndex'].forEach(attr => {
                            this._styleMap[attr] = node.css(attr);
                            this._initial.styleMap[attr] = initial.styleMap[attr];
                        });
                        ['marginTop', 'marginRight', 'marginBottom', 'marginLeft'].forEach(attr => {
                            if (node.cssInitial(attr) === 'auto') {
                                this._initial.styleMap[attr] = 'auto';
                            }
                            if (node.cssInitial(attr, true) === 'auto') {
                                this._styleMap[attr] = 'auto';
                            }
                        });
                        break;
                    case 'styleMap':
                        assignWhenNull(this._styleMap, node.unsafe('styleMap'));
                        break;
                    case 'textStyle':
                        const style = { whiteSpace: node.css('whiteSpace') };
                        for (const attr in node.style) {
                            if (attr.startsWith('font') || attr.startsWith('color')) {
                                const key = convertCamelCase(attr);
                                style[key] = node.style[key];
                            }
                        }
                        this.cssApply(style);
                        break;
                }
            }
        }
        alignedVertically(previousSiblings, siblings, cleared, checkFloat = true) {
            if (this.lineBreak) {
                return true;
            }
            if (this.pageFlow && previousSiblings.length) {
                if (isArray(siblings) && this !== siblings[0]) {
                    if (cleared && cleared.has(this)) {
                        return true;
                    }
                    if (checkFloat) {
                        const previous = siblings[siblings.length - 1];
                        if (this.floating && (this.linear.top >= previous.linear.bottom || this.float === 'left' && siblings.filter(node => node.siblingIndex < this.siblingIndex && withinFraction(this.linear.left, node.linear.left)).length > 0 || this.float === 'right' && siblings.filter(node => node.siblingIndex < this.siblingIndex && withinFraction(this.linear.right, node.linear.right)).length > 0)) {
                            return true;
                        }
                    }
                }
                const actualParent = this.actualParent;
                for (const previous of previousSiblings) {
                    const vertical = (previous.blockStatic ||
                        this.blockStatic && (!previous.inlineFlow ||
                            !!cleared && cleared.has(previous)) ||
                        !!cleared && cleared.get(previous) === 'both' && (!isArray(siblings) || siblings[0] !== previous) ||
                        !previous.floating && (this.blockStatic ||
                            !this.floating && !this.inlineFlow) ||
                        actualParent && previous.bounds.width > (actualParent.has('width', 2 /* UNIT */) ? actualParent.width : actualParent.box.width) && (!previous.textElement ||
                            previous.textElement && previous.css('whiteSpace') === 'nowrap') ||
                        previous.lineBreak ||
                        previous.autoMargin.leftRight ||
                        previous.float === 'left' && this.autoMargin.right ||
                        previous.float === 'right' && this.autoMargin.left);
                    if (vertical) {
                        return true;
                    }
                }
            }
            return false;
        }
        intersectX(rect, dimension = 'linear') {
            const self = this[dimension];
            return (rect.top >= self.top && rect.top < self.bottom ||
                rect.bottom > self.top && rect.bottom <= self.bottom ||
                self.top >= rect.top && self.bottom <= rect.bottom ||
                rect.top >= self.top && rect.bottom <= self.bottom);
        }
        intersectY(rect, dimension = 'linear') {
            const self = this[dimension];
            return (rect.left >= self.left && rect.left < self.right ||
                rect.right > self.left && rect.right <= self.right ||
                self.left >= rect.left && self.right <= rect.right ||
                rect.left >= self.left && rect.right <= self.right);
        }
        withinX(rect, dimension = 'linear') {
            const self = this[dimension];
            return Math.ceil(self.top) >= Math.floor(rect.top) && Math.floor(self.bottom) <= Math.ceil(rect.bottom);
        }
        withinY(rect, dimension = 'linear') {
            const self = this[dimension];
            return Math.ceil(self.left) >= Math.floor(rect.left) && Math.floor(self.right) <= Math.ceil(rect.right);
        }
        outsideX(rect, dimension = 'linear') {
            const self = this[dimension];
            return Math.ceil(self.left) < Math.floor(rect.left) || Math.ceil(self.left) >= Math.floor(rect.right);
        }
        outsideY(rect, dimension = 'linear') {
            const self = this[dimension];
            return Math.ceil(self.top) < Math.floor(rect.top) || Math.ceil(self.top) >= Math.floor(rect.bottom);
        }
        css(attr, value = '', cache = false) {
            if (arguments.length >= 2) {
                this._styleMap[attr] = value;
                if (cache) {
                    this.unsetCache(attr);
                }
            }
            return this._styleMap[attr] || this.style && this.style[attr] || '';
        }
        cssApply(values, cache = false) {
            Object.assign(this._styleMap, values);
            if (cache) {
                for (const name in values) {
                    this.unsetCache(name);
                }
            }
            return this;
        }
        cssInitial(attr, modified = false, computed = false) {
            if (this._initial.iteration === -1 && !modified) {
                computed = true;
            }
            let value = modified ? this._styleMap[attr] : this._initial.styleMap[attr];
            if (computed && !hasValue(value)) {
                value = this.style[attr];
            }
            return value || '';
        }
        cssAscend(attr, startChild = false, visible = false) {
            let result = '';
            let current = startChild ? this : this.actualParent;
            while (current) {
                result = current.cssInitial(attr);
                if (result !== '') {
                    if (visible && !current.visible) {
                        result = '';
                    }
                    else {
                        break;
                    }
                }
                if (current.documentBody) {
                    break;
                }
                current = current.actualParent;
            }
            return result;
        }
        cssSort(attr, desc = false, duplicate = false) {
            const children = (duplicate ? this.duplicate() : this.children);
            children.sort((a, b) => {
                const valueA = a.toInt(attr);
                const valueB = b.toInt(attr);
                if (valueA === valueB) {
                    return 0;
                }
                if (desc) {
                    return valueA > valueB ? -1 : 1;
                }
                else {
                    return valueA < valueB ? -1 : 1;
                }
            });
            return children;
        }
        cssPX(attr, value, negative = false, cache = false) {
            const current = this._styleMap[attr];
            if (current && isUnit(current)) {
                value += parseFloat(convertPX(current, this.fontSize));
                if (!negative) {
                    value = Math.max(0, value);
                }
                const result = formatPX(value);
                this.css(attr, result);
                if (cache) {
                    this.unsetCache(attr);
                }
                return result;
            }
            return '';
        }
        cssTry(attr, value) {
            if (this.styleElement) {
                const element = this._element;
                const current = this.css(attr);
                element.style[attr] = value;
                if (element.style[attr] === value) {
                    setElementCache(element, attr, current);
                    return true;
                }
            }
            return false;
        }
        cssFinally(attr) {
            if (this.styleElement) {
                const element = this._element;
                const value = getElementCache(element, attr);
                if (value) {
                    element.style[attr] = value;
                    deleteElementCache(element, attr);
                    return true;
                }
            }
            return false;
        }
        toInt(attr, initial = false, defaultValue = 0) {
            const value = (initial ? this._initial.styleMap : this._styleMap)[attr];
            return parseInt(value) || defaultValue;
        }
        convertPX(value, horizontal = true, parent = true) {
            return this.convertPercent(value, horizontal, parent) || convertPX(value, this.fontSize);
        }
        convertPercent(value, horizontal, parent = true) {
            if (isPercent(value)) {
                const node = (parent ? this.absoluteParent : null) || this;
                const attr = horizontal ? 'width' : 'height';
                let dimension;
                if (node.has(attr, 2 /* UNIT */)) {
                    dimension = node.toInt(attr);
                }
                else {
                    dimension = node[parent ? 'box' : 'bounds'][attr];
                }
                const percent = parseFloat(value) >= 1 ? parseInt(value) / 100 : parseFloat(value);
                return `${Math.round(percent * dimension)}px`;
            }
            return '';
        }
        has(attr, checkType = 0, options) {
            const value = (options && options.map === 'initial' ? this._initial.styleMap : this._styleMap)[attr];
            if (hasValue(value)) {
                switch (value) {
                    case '0px':
                        if (hasBit(checkType, 64 /* ZERO */)) {
                            return true;
                        }
                        else {
                            switch (attr) {
                                case 'top':
                                case 'right':
                                case 'bottom':
                                case 'left':
                                    return true;
                            }
                        }
                    case 'left':
                        if (hasBit(checkType, 8 /* LEFT */)) {
                            return true;
                        }
                    case 'baseline':
                        if (hasBit(checkType, 16 /* BASELINE */)) {
                            return true;
                        }
                    case 'auto':
                        if (hasBit(checkType, 4 /* AUTO */)) {
                            return true;
                        }
                    case 'none':
                    case 'initial':
                    case 'unset':
                    case 'normal':
                    case 'transparent':
                    case 'rgba(0, 0, 0, 0)':
                        return false;
                    default:
                        if (options) {
                            if (options.not) {
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
                        if (hasBit(checkType, 2 /* UNIT */) && isUnit(value)) {
                            result = true;
                        }
                        if (hasBit(checkType, 32 /* PERCENT */) && isPercent(value)) {
                            result = true;
                        }
                        if (hasBit(checkType, 4 /* AUTO */)) {
                            result = false;
                        }
                        return result;
                }
            }
            return false;
        }
        hasBit(attr, value) {
            if (this[attr] !== undefined) {
                return hasBit(this[attr], value);
            }
            return false;
        }
        hasAlign(value) {
            return hasBit(this.alignmentType, value);
        }
        exclude({ section = 0, procedure = 0, resource = 0 }) {
            if (section > 0 && !hasBit(this._excludeSection, section)) {
                this._excludeSection |= section;
            }
            if (procedure > 0 && !hasBit(this._excludeProcedure, procedure)) {
                this._excludeProcedure |= procedure;
            }
            if (resource > 0 && !hasBit(this._excludeResource, resource)) {
                this._excludeResource |= resource;
            }
        }
        setExclusions() {
            if (this.styleElement) {
                const applyExclusions = (attr, enumeration) => {
                    const actualParent = this.actualParent;
                    const exclude = [trimNull(this.dataset[`exclude${attr}`]), actualParent ? trimNull(actualParent.dataset[`exclude${attr}Child`]) : ''].filter(value => value).join('|');
                    let result = 0;
                    exclude.split('|').map(value => value.toUpperCase().trim()).forEach(value => {
                        if (enumeration[value] !== undefined) {
                            result |= enumeration[value];
                        }
                    });
                    if (result > 0) {
                        this.exclude({ [attr.toLowerCase()]: result });
                    }
                };
                applyExclusions('Section', APP_SECTION);
                applyExclusions('Procedure', NODE_PROCEDURE);
                applyExclusions('Resource', NODE_RESOURCE);
            }
        }
        setBounds(calibrate = false) {
            const element = this._element;
            if (element && !calibrate) {
                if (this.styleElement) {
                    this._bounds = assignBounds(element.getBoundingClientRect());
                    if (this.documentBody) {
                        if (this.marginTop > 0) {
                            const firstChild = this.firstChild;
                            if (firstChild && !firstChild.lineBreak && firstChild.blockStatic && firstChild.marginTop >= this.marginTop) {
                                this.css('marginTop', '0px', true);
                            }
                        }
                        this._bounds.top = this.marginTop;
                    }
                }
                else if (this.plainText) {
                    const bounds = getRangeClientRect(element);
                    this._bounds = assignBounds(bounds);
                }
            }
        }
        appendTry(node, withNode, append = true) {
            for (let i = 0; i < this.length; i++) {
                if (node === this.item(i)) {
                    withNode.siblingIndex = node.siblingIndex;
                    this.item(i, withNode);
                    withNode.parent = this;
                    return true;
                }
            }
            if (append) {
                let index = -1;
                this.each(item => {
                    if (item.siblingIndex !== Number.MAX_VALUE) {
                        index = Math.max(item.siblingIndex, index);
                    }
                });
                withNode.siblingIndex = index + 1;
                withNode.parent = this;
                return true;
            }
            return false;
        }
        modifyBox(region, offset, negative = true) {
            if (offset !== 0) {
                const attr = CSS_SPACING.get(region);
                if (attr) {
                    if (offset === null) {
                        this._boxReset[attr] = 1;
                    }
                    else {
                        this._boxAdjustment[attr] += offset;
                        if (!negative && this._boxAdjustment[attr] < 0) {
                            this._boxAdjustment[attr] = 0;
                        }
                    }
                }
            }
        }
        valueBox(region) {
            const attr = CSS_SPACING.get(region);
            if (attr) {
                return [this._boxReset[attr], this._boxAdjustment[attr]];
            }
            return [0, 0];
        }
        resetBox(region, node, fromParent = false) {
            const keys = Array.from(CSS_SPACING.keys());
            const applyReset = (start, end, margin) => {
                let i = 0;
                for (const attr of Array.from(CSS_SPACING.values()).slice(start, end)) {
                    this._boxReset[attr] = 1;
                    if (node) {
                        const name = CSS_SPACING.get(margin ? keys[i] : keys[i + 4]);
                        if (name) {
                            node.modifyBox(fromParent ? keys[i] : keys[i + 4], this[name]);
                        }
                    }
                    i++;
                }
            };
            if (hasBit(region, 30 /* MARGIN */)) {
                applyReset(0, 4, true);
            }
            if (hasBit(region, 480 /* PADDING */)) {
                applyReset(4, 8, false);
            }
        }
        inheritBox(region, node) {
            const keys = Array.from(CSS_SPACING.keys());
            const applyReset = (start, end, margin) => {
                let i = margin ? 0 : 4;
                for (const attr of Array.from(CSS_SPACING.values()).slice(start, end)) {
                    const value = this._boxAdjustment[attr];
                    if (value > 0) {
                        node.modifyBox(keys[i], this._boxAdjustment[attr], false);
                        this._boxAdjustment[attr] = 0;
                    }
                    i++;
                }
            };
            if (hasBit(region, 30 /* MARGIN */)) {
                applyReset(0, 4, true);
            }
            if (hasBit(region, 480 /* PADDING */)) {
                applyReset(4, 8, false);
            }
        }
        previousSiblings(lineBreak = true, excluded = true, height = false) {
            let element = null;
            const result = [];
            if (this._element) {
                element = this._element.previousSibling;
            }
            else if (this._initial.children.length) {
                const children = this._initial.children.filter(node => node.pageFlow);
                element = children.length && children[0].element ? children[0].element.previousSibling : null;
            }
            while (element) {
                const node = getElementAsNode(element);
                if (node) {
                    if (lineBreak && node.lineBreak || excluded && node.excluded) {
                        result.push(node);
                    }
                    else if (!node.excluded && node.pageFlow) {
                        result.push(node);
                        if (!height || node.visible && !node.floating) {
                            break;
                        }
                    }
                }
                element = element.previousSibling;
            }
            return result;
        }
        nextSiblings(lineBreak = true, excluded = true, visible = false) {
            let element = null;
            const result = [];
            if (this._element) {
                element = this._element.nextSibling;
            }
            else if (this._initial.children.length) {
                const children = this._initial.children.filter(node => node.pageFlow);
                if (children.length) {
                    const lastChild = children[children.length - 1];
                    element = lastChild.element ? lastChild.element.nextSibling : null;
                }
            }
            while (element) {
                const node = getElementAsNode(element);
                if (node) {
                    if (lineBreak && node.lineBreak || excluded && node.excluded) {
                        result.push(node);
                    }
                    else if (!node.excluded && node.pageFlow) {
                        result.push(node);
                        if (!visible || node.visible && !node.floating) {
                            break;
                        }
                    }
                }
                element = element.nextSibling;
            }
            return result;
        }
        actualRight(dimension = 'linear') {
            const node = this.companion && !this.companion.visible && this.companion[dimension].right > this[dimension].right ? this.companion : this;
            return node[dimension].right;
        }
        setDimensions(dimension) {
            const bounds = this.unsafe(dimension);
            if (bounds) {
                bounds.width = this.bounds.width;
                bounds.height = bounds.bottom - bounds.top;
                if (this.styleElement) {
                    switch (dimension) {
                        case 'linear':
                            bounds.width += (this.marginLeft > 0 ? this.marginLeft : 0) + this.marginRight;
                            break;
                        case 'box':
                            bounds.width -= this.contentBoxWidth;
                            break;
                    }
                }
                if (this._initial[dimension] === undefined) {
                    this._initial[dimension] = assignBounds(bounds);
                }
            }
        }
        convertPosition(attr) {
            let result = 0;
            if (!this.positionStatic) {
                const value = this.cssInitial(attr);
                if (isUnit(value) || isPercent(value)) {
                    result = convertInt(this.convertUnit(attr, value, attr === 'left' || attr === 'right'));
                }
            }
            return result;
        }
        convertBox(region, direction) {
            const attr = region + direction;
            return convertInt(this.convertUnit(attr, this.css(attr), direction === 'Left' || direction === 'Right'));
        }
        convertUnit(attr, value, horizontal, parent = true) {
            if (isPercent(value)) {
                return isUnit(this.style[attr]) ? this.style[attr] : this.convertPercent(value, horizontal, parent);
            }
            return value;
        }
        set parent(value) {
            if (value) {
                if (value !== this._parent) {
                    if (this._parent) {
                        this._parent.remove(this);
                    }
                    this._parent = value;
                }
                if (!value.contains(this)) {
                    value.append(this);
                }
                if (this.depth === -1) {
                    this.depth = value.depth + 1;
                }
            }
        }
        get parent() {
            return this._parent;
        }
        set tagName(value) {
            this._cached.tagName = value.toUpperCase();
        }
        get tagName() {
            if (this._cached.tagName === undefined) {
                const element = this._element;
                let value = '';
                if (element) {
                    if (this.styleElement) {
                        value = (element.tagName === 'INPUT' ? element.type : element.tagName).toUpperCase();
                    }
                    else if (element.nodeName === '#text') {
                        value = 'PLAINTEXT';
                    }
                }
                this._cached.tagName = value;
            }
            return this._cached.tagName;
        }
        get element() {
            if (this._element) {
                return this._element;
            }
            else {
                const element = createElement(null, this.block);
                setElementCache(element, 'node', this);
                return element;
            }
        }
        get baseElement() {
            return this._element;
        }
        get htmlElement() {
            return this._element instanceof HTMLElement && (this.display !== 'none' || this._element.innerHTML !== '');
        }
        get svgElement() {
            return this._element instanceof SVGSVGElement;
        }
        get styleElement() {
            return hasComputedStyle(this._element);
        }
        get naturalElement() {
            return this.styleElement && (this.display !== 'none' || this.element.innerHTML !== '') || this.plainText;
        }
        get imageElement() {
            return this.tagName === 'IMG';
        }
        get flexElement() {
            return this.display === 'flex' || this.display === 'inline-flex';
        }
        get gridElement() {
            return this.display === 'grid';
        }
        get textElement() {
            return this.plainText || this.inlineText;
        }
        get tableElement() {
            return this.tagName === 'TABLE' || this.display === 'table';
        }
        get groupParent() {
            return false;
        }
        get plainText() {
            return this.tagName === 'PLAINTEXT';
        }
        get lineBreak() {
            return this.tagName === 'BR';
        }
        get documentBody() {
            return this._element === document.body;
        }
        get bounds() {
            return this._bounds || newRectDimension();
        }
        get linear() {
            if (this._linear === undefined && this._bounds) {
                if (this._element) {
                    const bounds = this._bounds;
                    this._linear = {
                        top: bounds.top - (this.marginTop > 0 ? this.marginTop : 0),
                        right: bounds.right + this.marginRight,
                        bottom: bounds.bottom + this.marginBottom,
                        left: bounds.left - (this.marginLeft > 0 ? this.marginLeft : 0),
                        width: 0,
                        height: 0
                    };
                }
                else {
                    this._linear = assignBounds(this._bounds);
                }
                this.setDimensions('linear');
            }
            return this._linear || newRectDimension();
        }
        get box() {
            if (this._box === undefined && this._bounds) {
                if (this._element) {
                    const bounds = this._bounds;
                    this._box = {
                        top: bounds.top + (this.paddingTop + this.borderTopWidth),
                        right: bounds.right - (this.paddingRight + this.borderRightWidth),
                        bottom: bounds.bottom - (this.paddingBottom + this.borderBottomWidth),
                        left: bounds.left + (this.paddingLeft + this.borderLeftWidth),
                        width: 0,
                        height: 0
                    };
                }
                else {
                    this._box = assignBounds(this._bounds);
                }
                this.setDimensions('box');
            }
            return this._box || newRectDimension();
        }
        set renderAs(value) {
            if (!this.rendered && value && !value.rendered) {
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
            return this._renderDepth !== -1 ? this._renderDepth : 0;
        }
        get dataset() {
            return this._element instanceof HTMLElement ? this._element.dataset : {};
        }
        get excludeSection() {
            return this._excludeSection;
        }
        get excludeProcedure() {
            return this._excludeProcedure;
        }
        get excludeResource() {
            return this._excludeResource;
        }
        get extensions() {
            return this.dataset.use ? this.dataset.use.split(',').map(value => value.trim()).filter(value => value) : [];
        }
        get flexbox() {
            if (this._cached.flexbox === undefined) {
                const actualParent = this.actualParent;
                this._cached.flexbox = {
                    order: convertInt(this.css('order')),
                    wrap: this.css('flexWrap'),
                    direction: this.css('flexDirection'),
                    alignSelf: !this.has('alignSelf') && actualParent && actualParent.has('alignItems') ? actualParent.css('alignItems') : this.css('alignSelf'),
                    justifyContent: this.css('justifyContent'),
                    basis: this.css('flexBasis'),
                    grow: convertInt(this.css('flexGrow')),
                    shrink: convertInt(this.css('flexShrink'))
                };
            }
            return this._cached.flexbox;
        }
        get width() {
            if (this._cached.width === undefined) {
                let width = 0;
                for (const value of [this._styleMap.width, this._styleMap.minWidth]) {
                    if (isUnit(value) || isPercent(value)) {
                        width = convertInt(this.convertPX(value));
                        if (width > 0) {
                            break;
                        }
                    }
                }
                this._cached.width = width;
            }
            return this._cached.width;
        }
        get height() {
            if (this._cached.height === undefined) {
                let height = 0;
                for (const value of [this._styleMap.height, this._styleMap.minHeight]) {
                    if (isUnit(value) || this.hasHeight && isPercent(value)) {
                        height = convertInt(this.convertPX(value, true));
                        if (height > 0) {
                            break;
                        }
                    }
                }
                this._cached.height = height;
            }
            return this._cached.height;
        }
        get hasWidth() {
            if (this._cached.hasWidth === undefined) {
                const value = this.cssInitial('width', true);
                this._cached.hasWidth = (() => {
                    if (this.inlineStatic) {
                        return false;
                    }
                    else if (isPercent(value)) {
                        return value !== '0%';
                    }
                    else if (isUnit(value) && value !== '0px' || this.toInt('minWidth') > 0) {
                        return true;
                    }
                    return false;
                })();
            }
            return this._cached.hasWidth;
        }
        get hasHeight() {
            if (this._cached.hasHeight === undefined) {
                const value = this.cssInitial('height', true);
                this._cached.hasHeight = (() => {
                    if (this.inlineStatic) {
                        return false;
                    }
                    else if (isPercent(value)) {
                        const actualParent = this.actualParent;
                        if (actualParent && actualParent.hasHeight) {
                            return value !== '0%';
                        }
                    }
                    else if (isUnit(value) && value !== '0px' || this.toInt('minHeight') > 0) {
                        return true;
                    }
                    return false;
                })();
            }
            return this._cached.hasHeight;
        }
        get lineHeight() {
            if (this._cached.lineHeight === undefined) {
                if (this.length === 0 || this.textElement) {
                    this._cached.lineHeight = this.toInt('lineHeight');
                }
                else {
                    const lineHeight = convertInt(this.cssAscend('lineHeight', true));
                    this._cached.lineHeight = lineHeight > this.bounds.height || this.some(node => node.plainText) ? lineHeight : 0;
                }
            }
            return this._cached.lineHeight;
        }
        get display() {
            return this.css('display');
        }
        get position() {
            return this.css('position');
        }
        get positionStatic() {
            if (this._cached.positionStatic === undefined) {
                this._cached.positionStatic = (() => {
                    switch (this.position) {
                        case 'fixed':
                        case 'absolute':
                            return false;
                        case 'sticky':
                        case 'relative':
                            return this.toInt('top') === 0 && this.toInt('right') === 0 && this.toInt('bottom') === 0 && this.toInt('left') === 0;
                        case 'inherit':
                            const position = this._element ? cssInheritAttribute(this._element.parentElement, 'position') : '';
                            return position !== '' && !(position === 'absolute' || position === 'fixed');
                        default:
                            return true;
                    }
                })();
            }
            return this._cached.positionStatic;
        }
        get positionRelative() {
            const position = this.position;
            return position === 'relative' || position === 'sticky';
        }
        get positionAuto() {
            if (this._cached.positionAuto === undefined) {
                const styleMap = this._initial.iteration === -1 ? this._styleMap : this._initial.styleMap;
                this._cached.positionAuto = (!this.pageFlow &&
                    (styleMap.top === 'auto' || !styleMap.top) &&
                    (styleMap.right === 'auto' || !styleMap.right) &&
                    (styleMap.bottom === 'auto' || !styleMap.bottom) &&
                    (styleMap.left === 'auto' || !styleMap.left));
            }
            return this._cached.positionAuto;
        }
        get top() {
            if (this._cached.top === undefined) {
                this._cached.top = this.convertPosition('top');
            }
            return this._cached.top;
        }
        get right() {
            if (this._cached.right === undefined) {
                this._cached.right = this.convertPosition('right');
            }
            return this._cached.right;
        }
        get bottom() {
            if (this._cached.bottom === undefined) {
                this._cached.bottom = this.convertPosition('bottom');
            }
            return this._cached.bottom;
        }
        get left() {
            if (this._cached.left === undefined) {
                this._cached.left = this.convertPosition('left');
            }
            return this._cached.left;
        }
        get marginTop() {
            if (this._cached.marginTop === undefined) {
                this._cached.marginTop = this.inlineStatic && !this.baselineActive ? 0 : this.convertBox('margin', 'Top');
            }
            return this._cached.marginTop;
        }
        get marginRight() {
            if (this._cached.marginRight === undefined) {
                this._cached.marginRight = this.convertBox('margin', 'Right');
            }
            return this._cached.marginRight;
        }
        get marginBottom() {
            if (this._cached.marginBottom === undefined) {
                this._cached.marginBottom = this.inlineStatic && !this.baselineActive ? 0 : this.convertBox('margin', 'Bottom');
            }
            return this._cached.marginBottom;
        }
        get marginLeft() {
            if (this._cached.marginLeft === undefined) {
                this._cached.marginLeft = this.convertBox('margin', 'Left');
            }
            return this._cached.marginLeft;
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
            if (this._cached.paddingTop === undefined) {
                this._cached.paddingTop = this.convertBox('padding', 'Top');
            }
            return this._cached.paddingTop;
        }
        get paddingRight() {
            if (this._cached.paddingRight === undefined) {
                this._cached.paddingRight = this.convertBox('padding', 'Right');
            }
            return this._cached.paddingRight;
        }
        get paddingBottom() {
            if (this._cached.paddingBottom === undefined) {
                this._cached.paddingBottom = this.convertBox('padding', 'Bottom');
            }
            return this._cached.paddingBottom;
        }
        get paddingLeft() {
            if (this._cached.paddingLeft === undefined) {
                this._cached.paddingLeft = this.convertBox('padding', 'Left');
            }
            return this._cached.paddingLeft;
        }
        get contentBoxWidth() {
            return this.tableElement && this.css('borderCollapse') === 'collapse' ? 0 : this.borderLeftWidth + this.paddingLeft + this.paddingRight + this.borderRightWidth;
        }
        get contentBoxHeight() {
            return this.tableElement && this.css('borderCollapse') === 'collapse' ? 0 : this.borderTopWidth + this.paddingTop + this.paddingBottom + this.borderBottomWidth;
        }
        get inline() {
            if (this._cached.inline === undefined) {
                const value = this.display;
                this._cached.inline = value === 'inline' || (value === 'initial' || value === 'unset') && ELEMENT_INLINE.includes(this.tagName);
            }
            return this._cached.inline;
        }
        get inlineStatic() {
            if (this._cached.inlineStatic === undefined) {
                this._cached.inlineStatic = this.inline && !this.floating && !this.imageElement;
            }
            return this._cached.inlineStatic;
        }
        get inlineVertical() {
            if (this._cached.inlineVertical === undefined) {
                const display = this.display;
                this._cached.inlineVertical = (display.startsWith('inline') || display === 'table-cell') && !this.floating && !this.plainText;
            }
            return this._cached.inlineVertical;
        }
        set inlineText(value) {
            this._cached.inlineText = value;
        }
        get inlineText() {
            if (this._cached.inlineText === undefined) {
                let value = false;
                const element = this._element;
                if (element && this.htmlElement && !this.svgElement) {
                    switch (element.tagName) {
                        case 'INPUT':
                        case 'BUTTON':
                        case 'IMG':
                        case 'SELECT':
                        case 'TEXTAREA':
                            break;
                        default:
                            if (hasFreeFormText(element)) {
                                value = Array.from(element.children).every(item => {
                                    const node = getElementAsNode(item);
                                    return node === undefined || node.excluded || hasValue(node.dataset.target);
                                });
                            }
                            break;
                    }
                }
                this._cached.inlineText = value;
            }
            return this._cached.inlineText;
        }
        get block() {
            if (this._cached.block === undefined) {
                const value = this.display;
                this._cached.block = value === 'block' || value === 'list-item' || value === 'initial' && ELEMENT_BLOCK.includes(this.tagName);
            }
            return this._cached.block;
        }
        get blockStatic() {
            if (this._cached.blockStatic === undefined) {
                this._cached.blockStatic = this.block && this.pageFlow && (!this.floating || this.cssInitial('width') === '100%');
            }
            return this._cached.blockStatic;
        }
        get blockDimension() {
            if (this._cached.blockDimension === undefined) {
                const display = this.display;
                this._cached.blockDimension = this.block || display === 'inline-block' || display === 'table-cell';
            }
            return this._cached.blockDimension;
        }
        get pageFlow() {
            if (this._cached.pageFlow === undefined) {
                this._cached.pageFlow = this.positionStatic || this.positionRelative;
            }
            return this._cached.pageFlow;
        }
        get inlineFlow() {
            if (this._cached.inlineFlow === undefined) {
                const display = this.display;
                this._cached.inlineFlow = this.inline || display.startsWith('inline') || display === 'table-cell' || this.imageElement || this.floating;
            }
            return this._cached.inlineFlow;
        }
        get rightAligned() {
            if (this._cached.rightAligned === undefined) {
                this._cached.rightAligned = (this.float === 'right' ||
                    this.autoMargin.left ||
                    this.inlineVertical && this.cssAscend('textAlign', true) === 'right' ||
                    !this.pageFlow && this.has('right'));
            }
            return this._cached.rightAligned || this.hasAlign(512 /* RIGHT */);
        }
        get bottomAligned() {
            if (this._cached.bottomAligned === undefined) {
                this._cached.bottomAligned = !this.pageFlow && this.has('bottom') && this.bottom >= 0;
            }
            return this._cached.bottomAligned;
        }
        get autoMargin() {
            if (this._cached.autoMargin === undefined) {
                if (!this.pageFlow || this.blockStatic || this.display === 'table') {
                    const styleMap = this._initial.iteration === -1 ? this._styleMap : this._initial.styleMap;
                    const left = styleMap.marginLeft === 'auto' && (this.pageFlow || this.has('right'));
                    const right = styleMap.marginRight === 'auto' && (this.pageFlow || this.has('left'));
                    const top = styleMap.marginTop === 'auto' && (this.pageFlow || this.has('bottom'));
                    const bottom = styleMap.marginBottom === 'auto' && (this.pageFlow || this.has('top'));
                    this._cached.autoMargin = {
                        horizontal: left || right,
                        left: left && !right,
                        right: !left && right,
                        leftRight: left && right,
                        vertical: top || bottom,
                        top: top && !bottom,
                        bottom: !top && bottom,
                        topBottom: top && bottom
                    };
                }
                else {
                    this._cached.autoMargin = {
                        horizontal: false,
                        left: false,
                        right: false,
                        leftRight: false,
                        top: false,
                        bottom: false,
                        vertical: false,
                        topBottom: false
                    };
                }
            }
            return this._cached.autoMargin;
        }
        get floating() {
            if (this._cached.floating === undefined) {
                if (this.pageFlow) {
                    const value = this.css('cssFloat');
                    this._cached.floating = value === 'left' || value === 'right';
                }
                else {
                    this._cached.floating = false;
                }
            }
            return this._cached.floating;
        }
        get float() {
            if (this._cached.float === undefined) {
                this._cached.float = this.floating ? this.css('cssFloat') : 'none';
            }
            return this._cached.float;
        }
        get zIndex() {
            return this.toInt('zIndex');
        }
        get textContent() {
            if (this._cached.textContent === undefined) {
                const element = this._element;
                let value = '';
                if (element) {
                    if (element instanceof HTMLElement) {
                        value = element.textContent || element.innerText;
                    }
                    else if (this.plainText) {
                        value = element.textContent || '';
                    }
                }
                this._cached.textContent = value;
            }
            return this._cached.textContent;
        }
        set overflow(value) {
            if (value === 0 || value === 16 /* VERTICAL */ || value === 8 /* HORIZONTAL */ || value === (8 /* HORIZONTAL */ | 16 /* VERTICAL */)) {
                this._cached.overflow = value;
            }
        }
        get overflow() {
            if (this._cached.overflow === undefined) {
                const [overflow, overflowX, overflowY] = [this.css('overflow'), this.css('overflowX'), this.css('overflowY')];
                const element = this._element;
                let value = 0;
                if (this.hasWidth && (overflow === 'scroll' ||
                    overflowX === 'scroll' ||
                    overflowX === 'auto' && element && element.clientWidth !== element.scrollWidth)) {
                    value |= 8 /* HORIZONTAL */;
                }
                if (this.hasHeight && (overflow === 'scroll' ||
                    overflowY === 'scroll' ||
                    overflowY === 'auto' && element && element.clientHeight !== element.scrollHeight)) {
                    value |= 16 /* VERTICAL */;
                }
                this._cached.overflow = value;
            }
            return this._cached.overflow;
        }
        get overflowX() {
            return hasBit(this.overflow, 8 /* HORIZONTAL */);
        }
        get overflowY() {
            return hasBit(this.overflow, 16 /* VERTICAL */);
        }
        get baseline() {
            if (this._cached.baseline === undefined) {
                const value = this.verticalAlign;
                const initialValue = this.cssInitial('verticalAlign');
                this._cached.baseline = this.pageFlow && !this.floating && (value === 'baseline' || value === 'initial' || isUnit(initialValue) && parseInt(initialValue) === 0);
            }
            return this._cached.baseline;
        }
        get verticalAlign() {
            return this.css('verticalAlign');
        }
        set multiLine(value) {
            this._cached.multiLine = value;
        }
        get multiLine() {
            if (this._cached.multiLine === undefined) {
                this._cached.multiLine = this.plainText || this.inlineFlow && this.inlineText ? getRangeClientRect(this._element).multiLine : 0;
            }
            return this._cached.multiLine;
        }
        get visibleStyle() {
            if (this._cached.visibleStyle === undefined) {
                const borderWidth = this.borderTopWidth > 0 || this.borderRightWidth > 0 || this.borderBottomWidth > 0 || this.borderLeftWidth > 0;
                const backgroundImage = REGEX_PATTERN.CSS_URL.test(this.css('backgroundImage')) || REGEX_PATTERN.CSS_URL.test(this.css('background'));
                const backgroundColor = this.has('backgroundColor');
                const backgroundRepeat = this.css('backgroundRepeat');
                const paddingHorizontal = this.paddingLeft + this.paddingRight > 0;
                const paddingVertical = this.paddingTop + this.paddingBottom > 0;
                this._cached.visibleStyle = {
                    padding: paddingHorizontal || paddingVertical,
                    paddingHorizontal,
                    paddingVertical,
                    background: borderWidth || backgroundImage || backgroundColor,
                    borderWidth,
                    backgroundImage,
                    backgroundColor,
                    backgroundRepeat: backgroundRepeat !== 'no-repeat',
                    backgroundRepeatX: backgroundRepeat === 'repeat' || backgroundRepeat === 'repeat-x' || backgroundRepeat.startsWith('repeat '),
                    backgroundRepeatY: backgroundRepeat === 'repeat' || backgroundRepeat === 'repeat-y' || backgroundRepeat.endsWith(' repeat')
                };
            }
            return this._cached.visibleStyle;
        }
        get preserveWhiteSpace() {
            if (this._cached.preserveWhiteSpace === undefined) {
                const value = this.css('whiteSpace');
                this._cached.preserveWhiteSpace = value === 'pre' || value === 'pre-wrap';
            }
            return this._cached.preserveWhiteSpace;
        }
        get layoutHorizontal() {
            return this.hasAlign(8 /* HORIZONTAL */);
        }
        get layoutVertical() {
            return this.hasAlign(16 /* VERTICAL */);
        }
        set controlName(value) {
            if (!this.rendered || this._controlName === undefined) {
                this._controlName = value;
            }
        }
        get controlName() {
            return this._controlName || '';
        }
        set documentParent(value) {
            this._documentParent = value;
        }
        get documentParent() {
            return this._documentParent || this.actualParent || this.parent || this;
        }
        get absoluteParent() {
            let current = this.actualParent;
            if (!this.pageFlow) {
                while (current && current.id !== 0) {
                    const position = current.cssInitial('position', false, true);
                    if (current.documentBody || position !== 'static' && position !== 'initial' && position !== 'unset') {
                        return current;
                    }
                    current = current.actualParent;
                }
            }
            return current;
        }
        set renderParent(value) {
            if (value) {
                if (value !== this && value.renderChildren.indexOf(this) === -1) {
                    value.renderChildren.push(this);
                }
                this._renderParent = value;
            }
        }
        get renderParent() {
            return this._renderParent;
        }
        set renderPositionId(value) {
            this._renderPositionId = value;
        }
        get renderPositionId() {
            return this._renderPositionId || this.id + (this.renderPosition !== -1 ? `^${this.renderPosition}` : '');
        }
        get actualParent() {
            return this.baseElement && this.baseElement.parentElement ? getElementAsNode(this.baseElement.parentElement) : undefined;
        }
        get actualChildren() {
            if (this._cached.actualChildren === undefined) {
                if (this.htmlElement) {
                    const actualChildren = [];
                    this._element.childNodes.forEach((element) => {
                        const node = getElementAsNode(element);
                        if (node) {
                            actualChildren.push(node);
                        }
                    });
                    this._cached.actualChildren = actualChildren;
                }
                else if (this.groupParent) {
                    this._cached.actualChildren = this._initial.children.slice(0);
                }
                else {
                    this._cached.actualChildren = [];
                }
            }
            return this._cached.actualChildren;
        }
        get actualHeight() {
            return this.plainText ? this.bounds.bottom - this.bounds.top : this.bounds.height;
        }
        get firstChild() {
            const element = this._element;
            if (element) {
                for (let i = 0; i < element.childNodes.length; i++) {
                    const node = getElementAsNode(element.childNodes[i]);
                    if (node) {
                        return node;
                    }
                }
            }
            return undefined;
        }
        get lastChild() {
            const element = this._element;
            if (element) {
                for (let i = element.childNodes.length - 1; i >= 0; i--) {
                    const node = getElementAsNode(element.childNodes[i]);
                    if (node) {
                        return node;
                    }
                }
            }
            return undefined;
        }
        get singleChild() {
            if (this.renderParent) {
                return this.renderParent.length === 1;
            }
            else if (this.parent && this.parent.id !== 0) {
                return this.parent.length === 1;
            }
            return false;
        }
        set dir(value) {
            this._cached.dir = value;
        }
        get dir() {
            if (this._cached.dir === undefined) {
                let value = this.naturalElement && this.styleElement ? this._element.dir : '';
                switch (value) {
                    case 'ltr':
                    case 'rtl':
                        break;
                    default:
                        let parent = this.actualParent;
                        while (parent) {
                            value = parent.dir;
                            if (value) {
                                this._cached.dir = value;
                                break;
                            }
                            parent = parent.actualParent;
                        }
                        break;
                }
                this._cached.dir = value || document.body.dir;
            }
            return this._cached.dir;
        }
        get nodes() {
            return this.rendered ? this.renderChildren : this.children;
        }
        get center() {
            return {
                x: this.bounds.left + Math.floor(this.bounds.width / 2),
                y: this.bounds.top + Math.floor(this.actualHeight / 2)
            };
        }
    }

    class NodeGroup extends Node {
        init() {
            if (this.length) {
                let siblingIndex = Number.MAX_VALUE;
                for (const item of this.children) {
                    siblingIndex = Math.min(siblingIndex, item.siblingIndex);
                    item.parent = this;
                }
                if (this.siblingIndex === Number.MAX_VALUE) {
                    this.siblingIndex = siblingIndex;
                }
                if (this.parent) {
                    this.parent.sort(NodeList.siblingIndex);
                }
                this.setBounds();
                const actualParent = this.actualParent;
                if (actualParent) {
                    this.dir = actualParent.dir;
                }
                this.saveAsInitial();
            }
        }
        setBounds(calibrate = false) {
            if (!calibrate) {
                if (this.length) {
                    const bounds = this.outerRegion;
                    this._bounds = Object.assign({ width: bounds.right - bounds.left, height: bounds.bottom - bounds.top }, bounds);
                }
            }
        }
        previousSiblings(lineBreak = true, excluded = true, height = false) {
            const node = this.item(0);
            return node ? node.previousSiblings(lineBreak, excluded, height) : [];
        }
        nextSiblings(lineBreak = true, excluded = true, height = false) {
            const node = this.item();
            return node ? node.nextSiblings(lineBreak, excluded, height) : [];
        }
        get actualParent() {
            return NodeList.actualParent(this._initial.children);
        }
        get firstChild() {
            const actualParent = NodeList.actualParent(this.nodes);
            if (actualParent) {
                const element = actualParent.element;
                for (let i = 0; i < actualParent.element.childNodes.length; i++) {
                    const node = getElementAsNode(element.childNodes[i]);
                    if (node && this.nodes.includes(node)) {
                        return node;
                    }
                }
            }
            if (this._initial.children.length) {
                return this._initial.children[0];
            }
            return undefined;
        }
        get lastChild() {
            const actualParent = NodeList.actualParent(this.nodes);
            if (actualParent) {
                const element = actualParent.element;
                for (let i = actualParent.element.childNodes.length - 1; i >= 0; i--) {
                    const node = getElementAsNode(element.childNodes[i]);
                    if (node && this.nodes.includes(node)) {
                        return node;
                    }
                }
            }
            if (this._initial.children.length) {
                return this._initial.children[this._initial.children.length - 1];
            }
            return undefined;
        }
        get inline() {
            return this.every(node => node.inline);
        }
        get pageFlow() {
            return this.every(node => node.pageFlow);
        }
        get inlineFlow() {
            return this.inlineStatic || this.hasAlign(128 /* SEGMENTED */);
        }
        get inlineStatic() {
            return this.every(node => node.inlineStatic);
        }
        get inlineVertical() {
            return this.every(node => node.inlineVertical);
        }
        get block() {
            return this.some(node => node.block);
        }
        get blockStatic() {
            return this.some(node => node.blockStatic);
        }
        get blockDimension() {
            return this.some(node => node.blockDimension);
        }
        get floating() {
            return this.every(node => node.floating);
        }
        get float() {
            if (this.floating) {
                return this.hasAlign(512 /* RIGHT */) ? 'right' : 'left';
            }
            return 'none';
        }
        get baseline() {
            const value = this.cssInitial('verticalAlign', true);
            return value !== '' ? value === 'baseline' : this.every(node => node.baseline);
        }
        get multiLine() {
            return this.children.reduce((a, b) => a + b.multiLine, 0);
        }
        get display() {
            return (this.css('display') ||
                this.some(node => node.block) ? 'block' : (this.some(node => node.blockDimension) ? 'inline-block' : 'inline'));
        }
        get element() {
            const children = this.cascade(true);
            return children.length ? children[0].element : super.element;
        }
        get groupParent() {
            return true;
        }
        get outerRegion() {
            const nodes = this.children.slice(0);
            let top = nodes[0];
            let right = top;
            let bottom = top;
            let left = top;
            this.each(node => node.companion && !node.companion.visible && nodes.push(node.companion));
            for (let i = 1; i < nodes.length; i++) {
                const node = nodes[i];
                if (node.linear.top < top.linear.top) {
                    top = node;
                }
                if (node.linear.right > right.linear.right) {
                    right = node;
                }
                if (node.linear.bottom > bottom.linear.bottom) {
                    bottom = node;
                }
                if (node.linear.left < left.linear.left) {
                    left = node;
                }
            }
            return {
                top: top.linear.top,
                right: right.linear.right,
                bottom: bottom.linear.bottom,
                left: left.linear.left
            };
        }
    }

    function isSvgShape(element) {
        switch (element.tagName) {
            case 'path':
            case 'circle':
            case 'ellipse':
            case 'line':
            case 'rect':
            case 'polygon':
            case 'polyline':
                return true;
        }
        return false;
    }
    function isSvgImage(element) {
        return element.tagName === 'image';
    }
    function createTransformData(element) {
        const data = {
            operations: [],
            translateX: 0,
            translateY: 0,
            scaleX: 1,
            scaleY: 1,
            rotateAngle: 0,
            skewX: 0,
            skewY: 0,
            origin: getTransformOrigin(element)
        };
        for (let i = 0; i < element.transform.baseVal.numberOfItems; i++) {
            const item = element.transform.baseVal.getItem(i);
            if (!data.operations.includes(item.type)) {
                switch (item.type) {
                    case SVGTransform.SVG_TRANSFORM_TRANSLATE:
                        if (item.matrix.e !== 0 || item.matrix.f !== 0) {
                            data.translateX = item.matrix.e;
                            data.translateY = item.matrix.f;
                            data.operations.push(item.type);
                        }
                        break;
                    case SVGTransform.SVG_TRANSFORM_SCALE:
                        if (item.matrix.a !== 1 || item.matrix.d !== 1) {
                            data.scaleX = item.matrix.a;
                            data.scaleY = item.matrix.d;
                            data.operations.push(item.type);
                        }
                        break;
                    case SVGTransform.SVG_TRANSFORM_ROTATE:
                        if (item.angle !== 0) {
                            data.rotateAngle = item.angle;
                            const namedItem = element.attributes.getNamedItem('transform');
                            if (namedItem && namedItem.nodeValue) {
                                const match = /rotate\((\d+), (\d+), (\d+)\)/.exec(namedItem.nodeValue);
                                if (match) {
                                    data.rotateOriginX = parseInt(match[2]);
                                    data.rotateOriginY = parseInt(match[3]);
                                }
                            }
                            data.matrixRotate = item.matrix;
                            data.operations.push(item.type);
                        }
                        break;
                    case SVGTransform.SVG_TRANSFORM_SKEWX:
                        if (item.angle !== 0) {
                            data.skewX += item.angle;
                            data.matrixSkewX = item.matrix;
                            data.operations.push(item.type);
                        }
                        break;
                    case SVGTransform.SVG_TRANSFORM_SKEWY:
                        if (item.angle !== 0) {
                            data.skewY += item.angle;
                            data.matrixSkewY = item.matrix;
                            data.operations.push(item.type);
                        }
                        break;
                }
            }
        }
        return data;
    }
    function getTransformOrigin(element) {
        const value = cssAttribute(element, 'transform-origin');
        if (value !== '') {
            const parent = element.parentElement;
            let width;
            let height;
            if (parent instanceof SVGSVGElement) {
                width = parent.viewBox.baseVal.width;
                height = parent.viewBox.baseVal.height;
            }
            else if (parent instanceof SVGGElement && parent.viewportElement instanceof SVGSVGElement) {
                width = parent.viewportElement.viewBox.baseVal.width;
                height = parent.viewportElement.viewBox.baseVal.height;
            }
            else {
                return undefined;
            }
            let positions = value.split(' ');
            if (positions.length === 1) {
                positions.push('center');
            }
            positions = positions.slice(0, 2);
            const origin = { x: null, y: null };
            if (positions.includes('left')) {
                origin.x = 0;
            }
            else if (positions.includes('right')) {
                origin.x = width;
            }
            if (positions.includes('top')) {
                origin.y = 0;
            }
            else if (positions.includes('bottom')) {
                origin.y = height;
            }
            ['x', 'y'].forEach(attr => {
                if (origin[attr] === null) {
                    for (let i = 0; i < positions.length; i++) {
                        let position = positions[i];
                        if (position !== '') {
                            if (position === 'center') {
                                position = '50%';
                            }
                            if (isUnit(position)) {
                                origin[attr] = parseInt(position.endsWith('px') ? position : convertPX(position, convertInt(getStyle(element).fontSize || '16')));
                            }
                            else if (isPercent(position)) {
                                origin[attr] = (attr === 'x' ? width : height) * (parseInt(position) / 100);
                            }
                            if (origin[attr] !== null) {
                                positions[i] = '';
                                break;
                            }
                        }
                    }
                }
            });
            if (origin.x || origin.y) {
                origin.x = origin.x || 0;
                origin.y = origin.y || 0;
                return origin;
            }
        }
        return undefined;
    }
    function applyMatrixX(matrix, x, y) {
        return matrix.a * x + matrix.c * y + matrix.e;
    }
    function applyMatrixY(matrix, x, y) {
        return matrix.b * x + matrix.d * y + matrix.f;
    }
    function getRadiusX(angle, radius) {
        return radius * Math.sin(angle * Math.PI / 180);
    }
    function getRadiusY(angle, radius) {
        return radius * Math.cos(angle * Math.PI / 180) * -1;
    }
    function isVisible(element) {
        const value = cssAttribute(element, 'visibility', true);
        return value !== 'hidden' && value !== 'collapse' && cssAttribute(element, 'display', true) !== 'none';
    }

    var svg = /*#__PURE__*/Object.freeze({
        isSvgShape: isSvgShape,
        isSvgImage: isSvgImage,
        createTransformData: createTransformData,
        getTransformOrigin: getTransformOrigin,
        applyMatrixX: applyMatrixX,
        applyMatrixY: applyMatrixY,
        getRadiusX: getRadiusX,
        getRadiusY: getRadiusY,
        isVisible: isVisible
    });

    const NAME_GRAPHICS = {};
    class SvgBuild {
        static setName(element) {
            let result = '';
            let tagName;
            if (element.id) {
                if (NAME_GRAPHICS[element.id] === undefined) {
                    result = element.id;
                }
                tagName = element.id;
            }
            else {
                tagName = element.tagName;
            }
            if (NAME_GRAPHICS[tagName] === undefined) {
                NAME_GRAPHICS[tagName] = 0;
            }
            return result !== '' ? result : `${tagName}_${++NAME_GRAPHICS[tagName]}`;
        }
        static applyTransforms(transform, points, origin) {
            const result = [];
            for (const pt of points) {
                result.push({ x: pt.x, y: pt.y });
            }
            for (let i = transform.numberOfItems - 1; i >= 0; i--) {
                const item = transform.getItem(i);
                let x1 = 0;
                let y1 = 0;
                let x2 = 0;
                let y2 = 0;
                let x3 = 0;
                let y3 = 0;
                if (origin) {
                    switch (item.type) {
                        case SVGTransform.SVG_TRANSFORM_SCALE:
                            x1 += origin.x;
                            y2 += origin.y;
                            break;
                        case SVGTransform.SVG_TRANSFORM_SKEWX:
                            y1 -= origin.y;
                            break;
                        case SVGTransform.SVG_TRANSFORM_SKEWY:
                            x2 -= origin.x;
                            break;
                        case SVGTransform.SVG_TRANSFORM_ROTATE:
                            x2 -= origin.x;
                            y1 -= origin.y;
                            x3 = origin.x + getRadiusY(item.angle, origin.x);
                            y3 = origin.y + getRadiusY(item.angle, origin.y);
                            break;
                    }
                }
                for (const pt of result) {
                    const x = pt.x;
                    const y = pt.y;
                    pt.x = applyMatrixX(item.matrix, x + x1, y + y1) + x3;
                    pt.y = applyMatrixY(item.matrix, x + x2, y + y2) + y3;
                }
            }
            return result;
        }
        static toPointList(points) {
            const result = [];
            for (let j = 0; j < points.numberOfItems; j++) {
                const pt = points.getItem(j);
                result.push({ x: pt.x, y: pt.y });
            }
            return result;
        }
        static toCoordinateList(value) {
            const result = [];
            const pattern = /-?[\d.]+/g;
            let digit;
            while ((digit = pattern.exec(value)) !== null) {
                const digitValue = parseFloat(digit[0]);
                if (!isNaN(digitValue)) {
                    result.push(digitValue);
                }
            }
            return result;
        }
        static toPathCommandList(value) {
            const result = [];
            const patternCommand = /([A-Za-z])([^A-Za-z]+)?/g;
            let command;
            value = value.trim();
            while ((command = patternCommand.exec(value)) !== null) {
                if (result.length === 0 && command[1].toUpperCase() !== 'M') {
                    break;
                }
                command[2] = (command[2] || '').trim();
                const coordinates = this.toCoordinateList(command[2]);
                const previous = result[result.length - 1];
                const previousCommand = previous ? previous.command.toUpperCase() : '';
                const previousPoint = previous ? previous.points[previous.points.length - 1] : undefined;
                let radiusX;
                let radiusY;
                let xAxisRotation;
                let largeArcFlag;
                let sweepFlag;
                switch (command[1].toUpperCase()) {
                    case 'M':
                    case 'L':
                        if (coordinates.length >= 2) {
                            coordinates.length = 2;
                            break;
                        }
                        else {
                            continue;
                        }
                    case 'H':
                        if (previousPoint && coordinates.length) {
                            coordinates[1] = command[1] === 'h' ? 0 : previousPoint.y;
                            coordinates.length = 2;
                            break;
                        }
                        else {
                            continue;
                        }
                    case 'V':
                        if (previousPoint && coordinates.length) {
                            const y = coordinates[0];
                            coordinates[0] = command[1] === 'v' ? 0 : previousPoint.x;
                            coordinates[1] = y;
                            coordinates.length = 2;
                            break;
                        }
                        else {
                            continue;
                        }
                    case 'Z':
                        if (result.length) {
                            coordinates.push(...result[0].coordinates);
                            command[1] = 'Z';
                            break;
                        }
                        else {
                            continue;
                        }
                    case 'C':
                        if (coordinates.length >= 6) {
                            coordinates.length = 6;
                            break;
                        }
                        else {
                            continue;
                        }
                    case 'S':
                        if (coordinates.length >= 4 && (previousCommand === 'C' || previousCommand === 'S')) {
                            coordinates.length = 4;
                            break;
                        }
                        else {
                            continue;
                        }
                    case 'Q':
                        if (coordinates.length >= 4) {
                            coordinates.length = 4;
                            break;
                        }
                        else {
                            continue;
                        }
                    case 'T':
                        if (coordinates.length >= 2 && (previousCommand === 'Q' || previousCommand === 'T')) {
                            coordinates.length = 2;
                            break;
                        }
                        else {
                            continue;
                        }
                    case 'A':
                        if (coordinates.length >= 7) {
                            [radiusX, radiusY, xAxisRotation, largeArcFlag, sweepFlag] = coordinates.splice(0, 5);
                            coordinates.length = 2;
                            break;
                        }
                        else {
                            continue;
                        }
                    default:
                        continue;
                }
                if (coordinates.length > 1) {
                    const points = [];
                    const relative = /[a-z]/.test(command[1]);
                    for (let i = 0; i < coordinates.length; i += 2) {
                        let x = coordinates[i];
                        let y = coordinates[i + 1];
                        if (relative && previousPoint) {
                            x += previousPoint.x;
                            y += previousPoint.y;
                        }
                        points.push({ x, y });
                    }
                    result.push({
                        command: command[1],
                        relative,
                        coordinates,
                        points,
                        radiusX,
                        radiusY,
                        xAxisRotation,
                        largeArcFlag,
                        sweepFlag
                    });
                }
            }
            return result;
        }
        static createColorStops(element) {
            const result = [];
            for (const stop of Array.from(element.getElementsByTagName('stop'))) {
                const color = parseColor(cssAttribute(stop, 'stop-color'), cssAttribute(stop, 'stop-opacity'));
                if (color && color.visible) {
                    result.push({
                        color: color.valueAsRGBA,
                        offset: cssAttribute(stop, 'offset'),
                        opacity: color.alpha
                    });
                }
            }
            return result;
        }
        static fromCoordinateList(values) {
            const result = [];
            for (let i = 0; i < values.length; i += 2) {
                result.push({ x: values[i], y: values[i + 1] });
            }
            return result.length % 2 === 0 ? result : [];
        }
        static fromPathCommandList(commands) {
            let result = '';
            for (const item of commands) {
                result += (result !== '' ? ' ' : '') + item.command;
                switch (item.command.toUpperCase()) {
                    case 'M':
                    case 'L':
                    case 'C':
                    case 'S':
                    case 'Q':
                    case 'T':
                        result += item.coordinates.join(',');
                        break;
                    case 'H':
                        result += item.coordinates[0];
                        break;
                    case 'V':
                        result += item.coordinates[1];
                        break;
                    case 'A':
                        result += `${item.radiusX},${item.radiusY},${item.xAxisRotation},${item.largeArcFlag},${item.sweepFlag},${item.coordinates.join(',')}`;
                        break;
                }
            }
            return result;
        }
    }

    class SvgAnimation {
        constructor(element, parentElement) {
            this.element = element;
            this.parentElement = parentElement;
            this.attributeName = '';
            this.attributeType = '';
            this.to = '';
            this._begin = 0;
            this._beginMS = 0;
            this._duration = 0;
            this._durationMS = 0;
            this.init();
        }
        static convertClockTime(value) {
            let s = 0;
            let ms = 0;
            if (/\d+ms$/.test(value)) {
                ms = parseInt(value);
            }
            else if (/\d+s$/.test(value)) {
                s = parseInt(value);
            }
            else if (/\d+min$/.test(value)) {
                s = parseInt(value) * 60;
            }
            else if (/\d+(.\d+)?h$/.test(value)) {
                s = parseFloat(value) * 60 * 60;
            }
            else {
                const match = /^(?:(\d?\d):)?(?:(\d?\d):)?(\d?\d)\.?(\d?\d?\d)?$/.exec(value);
                if (match) {
                    if (match[1]) {
                        s += parseInt(match[1]) * 60 * 60;
                    }
                    if (match[2]) {
                        s += parseInt(match[2]) * 60;
                    }
                    if (match[3]) {
                        s += parseInt(match[3]);
                    }
                    if (match[4]) {
                        ms = parseInt(match[4]) * (match[4].length < 3 ? Math.pow(10, 3 - match[4].length) : 1);
                    }
                }
            }
            return [s, ms];
        }
        init() {
            const element = this.element;
            const attributeName = element.attributes.getNamedItem('attributeName');
            if (attributeName) {
                this.attributeName = attributeName.value.trim();
            }
            const attributeType = element.attributes.getNamedItem('attributeType');
            if (attributeType) {
                this.attributeType = attributeType.value.trim();
            }
            const to = element.attributes.getNamedItem('to');
            if (to) {
                this.to = to.value.trim();
            }
            const begin = element.attributes.getNamedItem('begin');
            const dur = element.attributes.getNamedItem('dur');
            if (begin) {
                if (begin.value === 'indefinite') {
                    this._begin = -1;
                }
                else {
                    [this._begin, this._beginMS] = SvgAnimation.convertClockTime(begin.value);
                }
            }
            if (dur) {
                if (dur.value === 'indefinite') {
                    this._duration = -1;
                }
                else {
                    [this._duration, this._durationMS] = SvgAnimation.convertClockTime(dur.value);
                }
            }
        }
        get duration() {
            return this._duration !== -1 ? this._duration * 1000 + this._durationMS : this._duration;
        }
        get begin() {
            return this._begin !== -1 ? this._begin * 1000 + this._beginMS : this._begin;
        }
    }

    class SvgAnimate extends SvgAnimation {
        constructor(element, parentElement) {
            super(element, parentElement);
            this.element = element;
            this.parentElement = parentElement;
            this.from = '';
            this.by = '';
            this.values = [];
            this.keyTimes = [];
            this.calcMode = '';
            this.additive = false;
            this.accumulate = false;
            this.freeze = false;
            this._end = 0;
            this._endMS = 0;
            this._repeatDurationMS = 0;
            const attributeName = element.attributes.getNamedItem('attributeName');
            if (attributeName) {
                this.attributeName = attributeName.value.trim();
            }
            const attributeType = element.attributes.getNamedItem('attributeType');
            if (attributeType) {
                this.attributeType = attributeType.value.trim();
            }
            const values = element.attributes.getNamedItem('values');
            if (values) {
                this.values.push(...flatMap(values.value.split(';'), value => value.trim()));
                if (this.values.length > 1) {
                    this.from = this.values[0];
                    this.to = this.values[this.values.length - 1];
                    const keyTimes = element.attributes.getNamedItem('keyTimes');
                    if (keyTimes) {
                        const times = SvgAnimate.toFractionList(keyTimes.value);
                        if (times.length === this.values.length) {
                            this.keyTimes.push(...times);
                        }
                    }
                }
            }
            else {
                if (this.to) {
                    this.values.push(this.from, this.to);
                    this.keyTimes.push(0, 1);
                    const by = element.attributes.getNamedItem('by');
                    if (by) {
                        this.by = by.value.trim();
                    }
                }
            }
            const end = element.attributes.getNamedItem('end');
            const repeatDur = element.attributes.getNamedItem('repeatDur');
            const repeatCount = element.attributes.getNamedItem('repeatCount');
            if (end) {
                if (end.value === 'indefinite') {
                    this._end = -1;
                }
                else {
                    [this._end, this._endMS] = SvgAnimate.convertClockTime(end.value);
                }
            }
            if (repeatDur) {
                if (repeatDur.value === 'indefinite') {
                    this.repeatDur = -1;
                }
                else {
                    [this.repeatDur, this._repeatDurationMS] = SvgAnimate.convertClockTime(repeatDur.value);
                }
            }
            if (repeatCount) {
                if (repeatCount.value === 'indefinite') {
                    this.repeatCount = -1;
                }
                else {
                    const value = parseInt(repeatCount.value);
                    if (!isNaN(value)) {
                        this.repeatCount = value;
                    }
                }
            }
            const calcMode = element.attributes.getNamedItem('calcMode');
            if (calcMode) {
                switch (calcMode.value) {
                    case 'discrete':
                    case 'linear':
                    case 'paced':
                    case 'spline':
                        this.calcMode = calcMode.value;
                        break;
                }
            }
            const additive = element.attributes.getNamedItem('additive');
            if (additive) {
                this.additive = additive.value === 'sum';
            }
            const accumulate = element.attributes.getNamedItem('accumulate');
            if (accumulate) {
                this.accumulate = accumulate.value === 'sum';
            }
            const fill = element.attributes.getNamedItem('fill');
            if (fill) {
                this.freeze = fill.value === 'freeze';
            }
        }
        static toFractionList(value, delimiter = ';') {
            let previousFraction = -1;
            const result = flatMap(value.split(delimiter), segment => {
                const fraction = parseFloat(segment);
                if (!isNaN(fraction) && fraction <= 1 && (previousFraction === -1 || fraction > previousFraction)) {
                    previousFraction = fraction;
                    return fraction;
                }
                return -1;
            });
            return result.length > 1 && result.some(percent => percent !== -1) && result[0] === 0 ? result : [];
        }
        get end() {
            return this._end !== -1 ? this._end * 1000 + this._endMS : this._end;
        }
        get repeatDuration() {
            return this.repeatDur !== undefined && this.repeatDur !== -1 ? this.repeatDur * 1000 + this._repeatDurationMS : 0;
        }
    }

    class SvgAnimateMotion extends SvgAnimate {
        constructor(element, parentElement) {
            super(element, parentElement);
            this.path = '';
            this.keyPoints = [];
            this.rotate = 0;
            this.rotateAuto = false;
            this.rotateAutoReverse = false;
            const path = element.attributes.getNamedItem('path');
            if (path) {
                this.path = path.value.trim();
            }
            const rotate = element.attributes.getNamedItem('rotate');
            if (rotate) {
                switch (rotate.value) {
                    case 'auto':
                        this.rotateAuto = true;
                        break;
                    case 'auto-reverse':
                        this.rotateAutoReverse = true;
                        break;
                    default:
                        this.rotate = convertInt(rotate.value);
                        break;
                }
            }
            if (this.keyTimes.length) {
                const keyPoints = element.attributes.getNamedItem('keyPoints');
                if (keyPoints) {
                    const points = SvgAnimate.toFractionList(keyPoints.value);
                    if (points.length === this.keyTimes.length) {
                        this.keyPoints = points;
                    }
                }
            }
        }
    }

    class SvgAnimateTransform extends SvgAnimate {
        constructor(element, parentElement) {
            super(element, parentElement);
            this.type = 0;
            const type = element.attributes.getNamedItem('type');
            if (type) {
                switch (type.value) {
                    case 'translate':
                        this.type = SVGTransform.SVG_TRANSFORM_TRANSLATE;
                        break;
                    case 'scale':
                        this.type = SVGTransform.SVG_TRANSFORM_SCALE;
                        break;
                    case 'rotate':
                        this.type = SVGTransform.SVG_TRANSFORM_ROTATE;
                        break;
                    case 'skewX':
                        this.type = SVGTransform.SVG_TRANSFORM_SKEWX;
                        break;
                    case 'skewY':
                        this.type = SVGTransform.SVG_TRANSFORM_SKEWY;
                        break;
                }
            }
        }
        static toRotateList(values) {
            const result = values.map(value => {
                if (value === '') {
                    return [null, null, null];
                }
                else {
                    const segment = SvgBuild.toCoordinateList(value);
                    if (segment.length === 1 || segment.length === 3) {
                        return segment;
                    }
                    return [];
                }
            });
            return result.some(item => item.length === 0) ? undefined : result;
        }
        static toScaleList(values) {
            const result = values.map(value => {
                if (value === '') {
                    return [null, null];
                }
                else {
                    const segment = SvgBuild.toCoordinateList(value);
                    if (segment.length === 1) {
                        return [segment[0], segment[0]];
                    }
                    else if (segment.length === 2) {
                        return segment;
                    }
                    return [];
                }
            });
            return result.some(item => item.length === 0) ? undefined : result;
        }
        static toTranslateList(values) {
            const result = values.map(value => {
                if (value === '') {
                    return [null, null];
                }
                else {
                    const segment = SvgBuild.toCoordinateList(value);
                    if (segment.length === 1 || segment.length === 2) {
                        return segment;
                    }
                    return [];
                }
            });
            return result.some(item => item.length === 0) ? undefined : result;
        }
    }

    class SvgPath {
        constructor(element, d = '') {
            this.element = element;
            this.d = d;
            this.transformed = false;
            this.opacity = 1;
            this.color = '';
            this.fillRule = '';
            this.fill = '';
            this.fillOpacity = '';
            this.stroke = '';
            this.strokeWidth = '';
            this.strokeOpacity = '';
            this.strokeLinecap = '';
            this.strokeLinejoin = '';
            this.strokeMiterlimit = '';
            this.clipPath = '';
            this.clipRule = '';
            this.init();
        }
        static getLine(x1, y1, x2 = 0, y2 = 0) {
            return x1 !== 0 || y1 !== 0 || x2 !== 0 || y2 !== 0 ? `M${x1},${y1} L${x2},${y2}` : '';
        }
        static getRect(width, height, x = 0, y = 0) {
            return width > 0 && height > 0 ? `M${x},${y} h${width} v${height} h${-width} Z` : '';
        }
        static getPolyline(points) {
            points = points instanceof SVGPointList ? SvgBuild.toPointList(points) : points;
            return points.length ? `M${points.map(item => `${item.x},${item.y}`).join(' ')}` : '';
        }
        static getPolygon(points) {
            const value = this.getPolyline(points);
            return value !== '' ? value + ' Z' : '';
        }
        static getCircle(cx, cy, r) {
            return r > 0 ? this.getEllipse(cx, cy, r, r) : '';
        }
        static getEllipse(cx, cy, rx, ry) {
            return rx > 0 && ry > 0 ? `M${cx - rx},${cy} a${rx},${ry},0,1,0,${rx * 2},0 a${rx},${ry},0,1,0,-${rx * 2},0` : '';
        }
        setColor(attr) {
            let value = cssAttribute(this.element, attr);
            const match = REGEX_PATTERN.LINK_HREF.exec(value);
            if (match) {
                value = `@${match[1]}`;
            }
            else if (value !== '') {
                switch (value.toLowerCase()) {
                    case 'none':
                    case 'transparent':
                    case 'rgba(0, 0, 0, 0)':
                        value = '';
                        break;
                    case 'currentcolor': {
                        const color = parseColor(cssAttribute(this.element, 'color', true));
                        value = color ? color.valueAsRGB : '#000000';
                        break;
                    }
                    default: {
                        const color = parseColor(value);
                        if (color) {
                            value = color.valueAsRGB;
                        }
                        break;
                    }
                }
            }
            else {
                if (attr === 'fill' && !(this.element.parentElement instanceof SVGGElement)) {
                    value = '#000000';
                }
            }
            this[attr] = value;
        }
        setOpacity(attr) {
            const opacity = cssAttribute(this.element, `${attr}-opacity`);
            this[`${attr}Opacity`] = opacity ? (parseFloat(opacity) * this.opacity).toString() : this.opacity.toString();
        }
        init() {
            const element = this.element;
            if (this.d === '') {
                const transform = element.transform.baseVal;
                switch (element.tagName) {
                    case 'path': {
                        this.d = cssAttribute(element, 'd');
                        break;
                    }
                    case 'circle': {
                        const item = element;
                        this.d = SvgPath.getCircle(item.cx.baseVal.value, item.cy.baseVal.value, item.r.baseVal.value);
                        break;
                    }
                    case 'ellipse': {
                        const item = element;
                        this.d = SvgPath.getEllipse(item.cx.baseVal.value, item.cy.baseVal.value, item.rx.baseVal.value, item.ry.baseVal.value);
                        break;
                    }
                    case 'line': {
                        const item = element;
                        const x1 = item.x1.baseVal.value;
                        const y1 = item.y1.baseVal.value;
                        const x2 = item.x2.baseVal.value;
                        const y2 = item.y2.baseVal.value;
                        if (transform.numberOfItems) {
                            const points = [
                                { x: x1, y: y1 },
                                { x: x2, y: y2 }
                            ];
                            this.d = SvgPath.getPolyline(SvgBuild.applyTransforms(transform, points, getTransformOrigin(element)));
                            this.transformed = true;
                        }
                        else {
                            this.d = SvgPath.getLine(x1, y1, x2, y2);
                        }
                        break;
                    }
                    case 'rect': {
                        const item = element;
                        const x = item.x.baseVal.value;
                        const y = item.y.baseVal.value;
                        const width = item.width.baseVal.value;
                        const height = item.height.baseVal.value;
                        if (transform.numberOfItems) {
                            const points = [
                                { x, y },
                                { x: x + width, y },
                                { x: x + width, y: y + height },
                                { x, y: y + height }
                            ];
                            this.d = SvgPath.getPolygon(SvgBuild.applyTransforms(transform, points, getTransformOrigin(element)));
                            this.transformed = true;
                        }
                        else {
                            this.d = SvgPath.getRect(width, height, x, y);
                        }
                        break;
                    }
                    case 'polyline':
                    case 'polygon': {
                        const item = element;
                        let points = SvgBuild.toPointList(item.points);
                        if (transform.numberOfItems) {
                            points = SvgBuild.applyTransforms(transform, points, getTransformOrigin(element));
                            this.transformed = true;
                        }
                        this.d = element.tagName === 'polygon' ? SvgPath.getPolygon(points) : SvgPath.getPolyline(points);
                        break;
                    }
                }
            }
            const href = REGEX_PATTERN.LINK_HREF.exec(cssAttribute(element, 'clip-path'));
            if (href) {
                this.clipPath = href[1];
                this.clipRule = cssAttribute(element, 'clip-rule', true);
            }
            const opacity = cssAttribute(element, 'opacity');
            if (opacity) {
                this.opacity = Math.min(parseFloat(opacity), 1);
            }
            this.setColor('fill');
            if (this.fill) {
                this.setOpacity('fill');
                this.fillRule = cssAttribute(element, 'fill-rule', true);
            }
            this.setColor('stroke');
            if (this.stroke) {
                this.setOpacity('stroke');
                this.strokeWidth = cssAttribute(element, 'stroke-width') || '1';
                this.strokeLinecap = cssAttribute(element, 'stroke-linecap', true);
                this.strokeLinejoin = cssAttribute(element, 'stroke-linejoin', true);
                this.strokeMiterlimit = cssAttribute(element, 'stroke-miterlimit', true);
            }
        }
    }

    class SvgElement {
        constructor(element) {
            this.element = element;
            this.name = SvgBuild.setName(element);
            this.animate = this.animatable ? SvgElement.toAnimateList(element) : [];
            this.visible = isVisible(element);
            if (this.drawable) {
                const path = new SvgPath(element);
                if (path.d && path.d !== 'none') {
                    this.path = path;
                }
            }
        }
        static toAnimateList(element) {
            const result = [];
            for (let i = 0; i < element.children.length; i++) {
                const item = element.children[i];
                if (item instanceof SVGAnimateTransformElement) {
                    result.push(new SvgAnimateTransform(item, element));
                }
                else if (item instanceof SVGAnimateMotionElement) {
                    result.push(new SvgAnimateMotion(item, element));
                }
                else if (item instanceof SVGAnimateElement) {
                    result.push(new SvgAnimate(item, element));
                }
                else if (item instanceof SVGAnimationElement) {
                    result.push(new SvgAnimation(item, element));
                }
            }
            return result;
        }
        get transform() {
            return this.element.transform.baseVal;
        }
        get drawable() {
            return true;
        }
        get animatable() {
            return true;
        }
        get transformable() {
            return this.transform.numberOfItems > 0;
        }
    }

    class SvgGroup extends Container {
        constructor(element) {
            super();
            this.element = element;
            this.visible = true;
            this.name = SvgBuild.setName(element);
            this.animate = this.animatable ? SvgElement.toAnimateList(element) : [];
            this.visible = isVisible(element);
        }
        get transform() {
            return this.element.transform.baseVal;
        }
        get animatable() {
            return this.element instanceof SVGGElement;
        }
        get transformable() {
            return this.element instanceof SVGGElement && this.element.transform.baseVal.numberOfItems > 0;
        }
    }

    class SvgGroupViewBox extends SvgGroup {
        constructor(element) {
            super(element);
            this.element = element;
            this.x = element.x.baseVal.value;
            this.y = element.y.baseVal.value;
            this.width = element.width.baseVal.value;
            this.height = element.height.baseVal.value;
        }
        get animatable() {
            return true;
        }
        get transformable() {
            return this.transform.numberOfItems > 0;
        }
    }

    class SvgImage extends SvgElement {
        constructor(element) {
            super(element);
            this.element = element;
            this.uri = '';
            this.x = element.x.baseVal.value;
            this.y = element.y.baseVal.value;
            this.width = element.width.baseVal.value;
            this.height = element.height.baseVal.value;
            this.uri = resolvePath(element.href.baseVal);
        }
        setExternal() {
            const transform = this.element.transform.baseVal;
            if (transform.numberOfItems) {
                let x = this.x;
                let y = this.y;
                for (let i = transform.numberOfItems - 1; i >= 0; i--) {
                    const item = transform.getItem(i);
                    const matrix = item.matrix;
                    switch (item.type) {
                        case SVGTransform.SVG_TRANSFORM_TRANSLATE:
                            x += matrix.e;
                            y += matrix.f;
                            break;
                        case SVGTransform.SVG_TRANSFORM_SCALE:
                            x *= matrix.a;
                            y *= matrix.d;
                            this.width *= matrix.a;
                            this.height *= matrix.d;
                            break;
                        case SVGTransform.SVG_TRANSFORM_ROTATE:
                            x = applyMatrixX(matrix, x, x);
                            y = applyMatrixY(matrix, y, y);
                            if (matrix.a < 0) {
                                x += matrix.a * this.width;
                            }
                            if (matrix.c < 0) {
                                x += matrix.c * this.width;
                            }
                            if (matrix.b < 0) {
                                y += matrix.b * this.height;
                            }
                            if (matrix.d < 0) {
                                y += matrix.d * this.height;
                            }
                            break;
                    }
                }
                this.x = x;
                this.y = y;
            }
        }
        get drawable() {
            return false;
        }
    }

    class SvgUse extends SvgGroupViewBox {
        constructor(element, d) {
            super(element);
            this.element = element;
            if (d) {
                this.setPath(d);
            }
        }
        setPath(value) {
            this.path = new SvgPath(this.element, value);
        }
    }

    class Svg extends Container {
        constructor(element) {
            super();
            this.element = element;
            this.animatable = true;
            this.transformable = false;
            this.defs = {
                clipPath: new Map(),
                gradient: new Map()
            };
            this._width = 0;
            this._height = 0;
            this._viewBoxWidth = 0;
            this._viewBoxHeight = 0;
            this._opacity = 1;
            this.name = SvgBuild.setName(element);
            this.animate = SvgElement.toAnimateList(element);
            this.visible = isVisible(element);
            this.init();
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
        init() {
            const element = this.element;
            this.setViewBox(element.viewBox.baseVal.width, element.viewBox.baseVal.height);
            this.setOpacity(cssAttribute(element, 'opacity'));
            this.setDimensions(element.width.baseVal.value, element.height.baseVal.value);
            if (isUserAgent(16 /* FIREFOX */)) {
                const node = getElementAsNode(element);
                if (node && node.bounds.width > this.width && node.bounds.height > this.height) {
                    this.setDimensions(node.bounds.width, node.bounds.height);
                }
            }
            element.querySelectorAll('clipPath, linearGradient, radialGradient').forEach((svg) => {
                if (svg.id) {
                    if (svg instanceof SVGClipPathElement) {
                        const group = new SvgGroup(svg);
                        for (const item of Array.from(svg.children)) {
                            if (isSvgShape(item)) {
                                const shape = new SvgElement(item);
                                if (shape.path) {
                                    group.append(shape);
                                }
                            }
                        }
                        if (group.length) {
                            this.defs.clipPath.set(svg.id, group);
                        }
                    }
                    else if (svg instanceof SVGLinearGradientElement) {
                        this.defs.gradient.set(`@${svg.id}`, {
                            type: 'linear',
                            x1: svg.x1.baseVal.value,
                            x2: svg.x2.baseVal.value,
                            y1: svg.y1.baseVal.value,
                            y2: svg.y2.baseVal.value,
                            x1AsString: svg.x1.baseVal.valueAsString,
                            x2AsString: svg.x2.baseVal.valueAsString,
                            y1AsString: svg.y1.baseVal.valueAsString,
                            y2AsString: svg.y2.baseVal.valueAsString,
                            colorStops: SvgBuild.createColorStops(svg)
                        });
                    }
                    else if (svg instanceof SVGRadialGradientElement) {
                        this.defs.gradient.set(`@${svg.id}`, {
                            type: 'radial',
                            cx: svg.cx.baseVal.value,
                            cy: svg.cy.baseVal.value,
                            r: svg.r.baseVal.value,
                            cxAsString: svg.cx.baseVal.valueAsString,
                            cyAsString: svg.cy.baseVal.valueAsString,
                            rAsString: svg.r.baseVal.valueAsString,
                            fx: svg.fx.baseVal.value,
                            fy: svg.fy.baseVal.value,
                            fxAsString: svg.fx.baseVal.valueAsString,
                            fyAsString: svg.fy.baseVal.valueAsString,
                            colorStops: SvgBuild.createColorStops(svg)
                        });
                    }
                }
            });
            const useMap = new Map();
            let currentGroup;
            function appendShape(item) {
                let shape;
                if (isSvgShape(item)) {
                    shape = new SvgElement(item);
                    if (item.id && shape.path) {
                        useMap.set(`#${item.id}`, shape.path.d);
                    }
                }
                else if (isSvgImage(item)) {
                    shape = new SvgImage(item);
                }
                if (currentGroup && shape) {
                    currentGroup.append(shape);
                }
            }
            for (let i = 0; i < element.children.length; i++) {
                const item = element.children[i];
                if (item instanceof SVGSVGElement) {
                    currentGroup = new SvgGroupViewBox(item);
                    this.append(currentGroup);
                }
                else if (item instanceof SVGGElement) {
                    currentGroup = new SvgGroup(item);
                    this.append(currentGroup);
                }
                else if (item instanceof SVGUseElement) {
                    currentGroup = new SvgUse(item);
                    this.append(currentGroup);
                }
                else {
                    if (currentGroup === undefined) {
                        currentGroup = new SvgGroup(element);
                        this.append(currentGroup);
                    }
                    appendShape(item);
                    continue;
                }
                for (let j = 0; j < item.children.length; j++) {
                    appendShape(item.children[j]);
                }
                currentGroup = undefined;
            }
            this.each(item => {
                if (item instanceof SvgUse) {
                    const path = useMap.get(item.element.href.baseVal);
                    if (path) {
                        item.setPath(path);
                    }
                }
            });
            this.retain(this.filter(item => item.length > 0 || item instanceof SvgUse && item.path !== undefined));
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
        get transform() {
            return this.element.transform.baseVal;
        }
    }

    class Accessibility extends Extension {
        afterInit() {
            for (const node of this.application.processing.cache.elements) {
                const element = node.baseElement;
                if (element instanceof HTMLInputElement && !node.hasBit('excludeProcedure', NODE_PROCEDURE.ACCESSIBILITY)) {
                    switch (element.type) {
                        case 'radio':
                        case 'checkbox':
                            [getPreviousElementSibling(element), getNextElementSibling(element)].some((sibling) => {
                                if (sibling) {
                                    const label = getElementAsNode(sibling);
                                    const labelParent = sibling.parentElement && sibling.parentElement.tagName === 'LABEL' ? getElementAsNode(sibling.parentElement) : null;
                                    if (label && label.visible && label.pageFlow) {
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

    const REGEX_PARTIAL = {
        UNIT: '[\\d.]+[a-z%]+|auto|max-content|min-content',
        MINMAX: 'minmax\\((.*?), (.*?)\\)',
        FIT_CONTENT: 'fit-content\\(([\\d.]+[a-z%]+)\\)',
        REPEAT: 'repeat\\((auto-fit|auto-fill|[0-9]+), ((?:minmax|fit-content)\\(.*?\\)|.*?)\\)',
        NAMED: '\\[([\\w\\-\\s]+)\\]'
    };
    const PATTERN_GRID = {
        UNIT: new RegExp(`^(${REGEX_PARTIAL.UNIT})$`),
        NAMED: new RegExp(`\\s*(${REGEX_PARTIAL.NAMED}|${REGEX_PARTIAL.REPEAT}|${REGEX_PARTIAL.MINMAX}|${REGEX_PARTIAL.FIT_CONTENT}|${REGEX_PARTIAL.UNIT})\\s*`, 'g')
    };
    class CssGrid extends Extension {
        static createDataAttribute() {
            return {
                children: new Set(),
                rowData: [],
                templateAreas: {},
                row: CssGrid.createDataRowAttribute(),
                column: CssGrid.createDataRowAttribute(),
                emptyRows: [],
                alignItems: '',
                alignContent: '',
                justifyItems: '',
                justifyContent: ''
            };
        }
        static createDataRowAttribute() {
            return {
                count: 0,
                gap: 0,
                unit: [],
                unitMin: [],
                repeat: [],
                auto: [],
                autoFill: false,
                autoFit: false,
                name: {},
                normal: true
            };
        }
        condition(node) {
            return node.gridElement && node.length > 0;
        }
        processNode(node) {
            const mainData = Object.assign(CssGrid.createDataAttribute(), {
                alignItems: node.css('alignItems'),
                alignContent: node.css('alignContent'),
                justifyItems: node.css('justifyItems'),
                justifyContent: node.css('justifyContent')
            });
            const gridAutoFlow = node.css('gridAutoFlow');
            const horizontal = gridAutoFlow.indexOf('row') !== -1;
            const dense = gridAutoFlow.indexOf('dense') !== -1;
            const rowData = [];
            const cellsPerRow = [];
            const gridPosition = [];
            let rowInvalid = {};
            mainData.row.gap = parseInt(node.convertPX(node.css('rowGap'), false, false));
            mainData.column.gap = parseInt(node.convertPX(node.css('columnGap'), true, false));
            function setDataRows(item, placement) {
                if (placement.every(value => value > 0)) {
                    for (let i = placement[horizontal ? 0 : 1] - 1; i < placement[horizontal ? 2 : 3] - 1; i++) {
                        if (rowData[i] === undefined) {
                            rowData[i] = [];
                        }
                        for (let j = placement[horizontal ? 1 : 0] - 1; j < placement[horizontal ? 3 : 2] - 1; j++) {
                            if (cellsPerRow[i] === undefined) {
                                cellsPerRow[i] = 0;
                            }
                            if (rowData[i][j] === undefined) {
                                rowData[i][j] = [];
                                cellsPerRow[i]++;
                            }
                            rowData[i][j].push(item);
                        }
                    }
                    return true;
                }
                return false;
            }
            function convertUnit(value) {
                return isUnit(value) ? node.convertPX(value) : value;
            }
            [node.cssInitial('gridTemplateRows', true), node.cssInitial('gridTemplateColumns', true), node.css('gridAutoRows'), node.css('gridAutoColumns')].forEach((value, index) => {
                if (value && value !== 'none' && value !== 'auto') {
                    let i = 1;
                    let match;
                    while ((match = PATTERN_GRID.NAMED.exec(value)) !== null) {
                        if (index < 2) {
                            const data = mainData[index === 0 ? 'row' : 'column'];
                            if (match[1].charAt(0) === '[') {
                                if (data.name[match[2]] === undefined) {
                                    data.name[match[2]] = [];
                                }
                                data.name[match[2]].push(i);
                            }
                            else if (match[1].startsWith('minmax')) {
                                data.unit.push(convertUnit(match[6]));
                                data.unitMin.push(convertUnit(match[5]));
                                data.repeat.push(false);
                                i++;
                            }
                            else if (match[1].startsWith('repeat')) {
                                let iterations = 1;
                                switch (match[3]) {
                                    case 'auto-fit':
                                        data.autoFit = true;
                                        break;
                                    case 'auto-fill':
                                        data.autoFill = true;
                                        break;
                                    default:
                                        iterations = convertInt(match[3]);
                                        break;
                                }
                                if (match[4].startsWith('minmax')) {
                                    const minmax = new RegExp(REGEX_PARTIAL.MINMAX, 'g');
                                    let matchMM;
                                    while ((matchMM = minmax.exec(match[4])) !== null) {
                                        data.unit.push(convertUnit(matchMM[2]));
                                        data.unitMin.push(convertUnit(matchMM[1]));
                                        data.repeat.push(true);
                                        i++;
                                    }
                                }
                                else if (match[4].charAt(0) === '[') {
                                    const unitName = match[4].split(' ');
                                    if (unitName.length === 2) {
                                        const attr = unitName[0].substring(1, unitName[0].length - 1);
                                        if (data.name[attr] === undefined) {
                                            data.name[attr] = [];
                                        }
                                        for (let j = 0; j < iterations; j++) {
                                            data.name[attr].push(i);
                                            data.unit.push(unitName[1]);
                                            data.unitMin.push('');
                                            data.repeat.push(true);
                                            i++;
                                        }
                                    }
                                }
                                else {
                                    match[4].split(' ').forEach(unit => {
                                        if (PATTERN_GRID.UNIT.test(unit)) {
                                            for (let j = 0; j < iterations; j++) {
                                                data.unit.push(unit);
                                                data.unitMin.push('');
                                                data.repeat.push(true);
                                                i++;
                                            }
                                        }
                                    });
                                }
                            }
                            else if (PATTERN_GRID.UNIT.test(match[1])) {
                                data.unit.push(convertUnit(match[1]));
                                data.unitMin.push('');
                                data.repeat.push(false);
                                i++;
                            }
                        }
                        else {
                            mainData[index === 2 ? 'row' : 'column'].auto.push(node.convertPX(match[1]));
                        }
                    }
                }
            });
            node.cssSort('order');
            if (!node.has('gridTemplateAreas') && node.every(item => item.css('gridRowStart') === 'auto' && item.css('gridColumnStart') === 'auto')) {
                const direction = horizontal ? ['top', 'bottom'] : ['left', 'right'];
                let row = 0;
                let column = 0;
                let previous;
                let columnMax = 0;
                node.each((item, index) => {
                    if (previous === undefined || item.linear[direction[0]] >= previous.linear[direction[1]] || column > 0 && column === columnMax) {
                        columnMax = Math.max(column, columnMax);
                        row++;
                        column = 1;
                    }
                    const rowEnd = item.css('gridRowEnd');
                    const columnEnd = item.css('gridColumnEnd');
                    let rowSpan = 1;
                    let columnSpan = 1;
                    if (rowEnd.startsWith('span')) {
                        rowSpan = parseInt(rowEnd.split(' ')[1]);
                    }
                    else if (isNumber(rowEnd)) {
                        rowSpan = parseInt(rowEnd) - row;
                    }
                    if (columnEnd.startsWith('span')) {
                        columnSpan = parseInt(columnEnd.split(' ')[1]);
                    }
                    else if (isNumber(columnEnd)) {
                        columnSpan = parseInt(columnEnd) - column;
                    }
                    if (column === 1 && columnMax > 0) {
                        const startIndex = horizontal ? [2, 1, 3] : [3, 0, 2];
                        let valid = false;
                        do {
                            const available = new Array(columnMax - 1).fill(1);
                            for (const position of gridPosition) {
                                const placement = position.placement;
                                if (placement[startIndex[0]] > row) {
                                    for (let i = placement[startIndex[1]]; i < placement[startIndex[2]]; i++) {
                                        available[i - 1] = 0;
                                    }
                                }
                            }
                            for (let i = 0, j = 0, k = 0; i < available.length; i++) {
                                if (available[i]) {
                                    if (j === 0) {
                                        k = i;
                                    }
                                    if (++j === columnSpan) {
                                        column = k + 1;
                                        valid = true;
                                        break;
                                    }
                                }
                                else {
                                    j = 0;
                                }
                            }
                            if (!valid) {
                                mainData.emptyRows[row - 1] = available;
                                row++;
                            }
                        } while (!valid);
                    }
                    gridPosition[index] = {
                        placement: horizontal ? [row, column, row + rowSpan, column + columnSpan] : [column, row, column + columnSpan, row + rowSpan],
                        rowSpan,
                        columnSpan
                    };
                    column += columnSpan;
                    previous = item;
                });
            }
            else {
                node.css('gridTemplateAreas').split(/"[\s\n]+"/).map(value => trimString(value.trim(), '"')).forEach((value, i) => {
                    value.split(' ').forEach((area, j) => {
                        if (area !== '.') {
                            if (mainData.templateAreas[area] === undefined) {
                                mainData.templateAreas[area] = {
                                    rowStart: i,
                                    rowSpan: 1,
                                    columnStart: j,
                                    columnSpan: 1
                                };
                            }
                            else {
                                mainData.templateAreas[area].rowSpan = (i - mainData.templateAreas[area].rowStart) + 1;
                                mainData.templateAreas[area].columnSpan++;
                            }
                        }
                    });
                });
                node.each((item, index) => {
                    const positions = [
                        item.css('gridRowStart'),
                        item.css('gridColumnStart'),
                        item.css('gridRowEnd'),
                        item.css('gridColumnEnd')
                    ];
                    const placement = [];
                    let rowSpan = 1;
                    let columnSpan = 1;
                    for (let i = 0; i < positions.length; i++) {
                        const value = positions[i];
                        let template = mainData.templateAreas[value];
                        if (template === undefined) {
                            const match = /^([\w\-]+)-(start|end)$/.exec(value);
                            if (match) {
                                template = mainData.templateAreas[match[1]];
                                if (template) {
                                    if (match[2] === 'start') {
                                        switch (i) {
                                            case 0:
                                            case 2:
                                                placement[i] = template.rowStart + 1;
                                                break;
                                            case 1:
                                            case 3:
                                                placement[i] = template.columnStart + 1;
                                                break;
                                        }
                                    }
                                    else {
                                        switch (i) {
                                            case 0:
                                            case 2:
                                                placement[i] = template.rowStart + template.rowSpan + 1;
                                                break;
                                            case 1:
                                            case 3:
                                                placement[i] = template.columnStart + template.columnSpan + 1;
                                                break;
                                        }
                                    }
                                }
                            }
                        }
                        else {
                            switch (i) {
                                case 0:
                                    placement[i] = template.rowStart + 1;
                                    break;
                                case 1:
                                    placement[i] = template.columnStart + 1;
                                    break;
                                case 2:
                                    placement[i] = template.rowStart + template.rowSpan + 1;
                                    break;
                                case 3:
                                    placement[i] = template.columnStart + template.columnSpan + 1;
                                    break;
                            }
                        }
                    }
                    if (placement.filter(value => value).length < 4) {
                        function setPlacement(value, position) {
                            if (isNumber(value)) {
                                placement[position] = parseInt(value);
                                return true;
                            }
                            else if (value.startsWith('span')) {
                                const span = parseInt(value.split(' ')[1]);
                                if (!placement[position - 2]) {
                                    if (position % 2 === 0) {
                                        rowSpan = span;
                                    }
                                    else {
                                        columnSpan = span;
                                    }
                                }
                                else {
                                    placement[position] = placement[position - 2] + span;
                                }
                                return true;
                            }
                            return false;
                        }
                        for (let i = 0; i < positions.length; i++) {
                            const value = positions[i];
                            if (value !== 'auto' && !placement[i] && !setPlacement(value, i)) {
                                const data = mainData[i % 2 === 0 ? 'row' : 'column'];
                                const alias = value.split(' ');
                                if (alias.length === 1) {
                                    alias[1] = alias[0];
                                    alias[0] = '1';
                                }
                                const nameIndex = parseInt(alias[0]);
                                if (data.name[alias[1]]) {
                                    const nameLength = data.name[alias[1]].length;
                                    if (nameIndex <= nameLength) {
                                        placement[i] = data.name[alias[1]][nameIndex - 1] + (alias[1] === positions[i - 2] ? 1 : 0);
                                    }
                                    else if (data.autoFill && nameIndex > nameLength) {
                                        placement[i] = nameIndex + (alias[1] === positions[i - 2] ? 1 : 0);
                                    }
                                }
                            }
                            if (!placement[i]) {
                                setPlacement(value, i);
                            }
                        }
                    }
                    gridPosition[index] = {
                        placement,
                        rowSpan,
                        columnSpan
                    };
                });
            }
            {
                const data = mainData[horizontal ? 'column' : 'row'];
                data.count = Math.max(data.unit.length, 1);
                for (let i = 0; i < gridPosition.length; i++) {
                    const item = gridPosition[i];
                    if (item) {
                        data.count = maxArray([
                            data.count,
                            horizontal ? item.columnSpan : item.rowSpan,
                            item.placement[horizontal ? 1 : 0] || 0,
                            (item.placement[horizontal ? 3 : 2] || 0) - 1
                        ]);
                    }
                }
                if (data.autoFill || data.autoFit) {
                    if (data.unit.length === 0) {
                        data.unit.push('auto');
                        data.unitMin.push('');
                        data.repeat.push(true);
                    }
                    function repeatUnit(dimension) {
                        const unitPX = [];
                        const unitRepeat = [];
                        for (let i = 0; i < dimension.length; i++) {
                            if (data.repeat[i]) {
                                unitRepeat.push(dimension[i]);
                            }
                            else {
                                unitPX.push(dimension[i]);
                            }
                        }
                        const repeatTotal = data.count - unitPX.length;
                        const result = [];
                        for (let i = 0; i < data.count; i++) {
                            if (data.repeat[i]) {
                                for (let j = 0, k = 0; j < repeatTotal; i++, j++, k++) {
                                    if (k === unitRepeat.length) {
                                        k = 0;
                                    }
                                    result[i] = unitRepeat[k];
                                }
                                break;
                            }
                            else if (unitPX.length) {
                                result[i] = unitPX.shift();
                            }
                        }
                        return result;
                    }
                    data.unit = repeatUnit(data.unit);
                    data.unitMin = repeatUnit(data.unitMin);
                }
            }
            node.each((item, index) => {
                const position = gridPosition[index];
                const placement = position.placement;
                const ROW_SPAN = horizontal ? position.rowSpan : position.columnSpan;
                const COLUMN_SPAN = horizontal ? position.columnSpan : position.rowSpan;
                const COLUMN_COUNT = horizontal ? mainData.column.count : mainData.row.count;
                const rowA = horizontal ? 0 : 1;
                const colA = horizontal ? 1 : 0;
                const rowB = horizontal ? 2 : 3;
                const colB = horizontal ? 3 : 2;
                while (!placement[0] || !placement[1]) {
                    const PLACEMENT = placement.slice(0);
                    if (!PLACEMENT[rowA]) {
                        let l = rowData.length;
                        for (let i = 0, j = 0, k = -1; i < l; i++) {
                            if (!rowInvalid[i]) {
                                if (cellsPerRow[i] === undefined || cellsPerRow[i] < COLUMN_COUNT) {
                                    if (j === 0) {
                                        k = i;
                                        l = Math.max(l, i + ROW_SPAN);
                                    }
                                    if (++j === ROW_SPAN) {
                                        PLACEMENT[rowA] = k + 1;
                                        break;
                                    }
                                }
                                else {
                                    j = 0;
                                    k = -1;
                                    l = rowData.length;
                                }
                            }
                        }
                    }
                    if (!PLACEMENT[rowA]) {
                        placement[rowA] = rowData.length + 1;
                        if (!placement[colA]) {
                            placement[colA] = 1;
                        }
                    }
                    else if (!PLACEMENT[colA]) {
                        if (!PLACEMENT[rowB]) {
                            PLACEMENT[rowB] = PLACEMENT[rowA] + ROW_SPAN;
                        }
                        const available = [];
                        for (let i = PLACEMENT[rowA] - 1; i < PLACEMENT[rowB] - 1; i++) {
                            if (rowData[i] === undefined) {
                                available.push([[0, -1]]);
                            }
                            else if (rowData[i].map(column => column).length + COLUMN_SPAN <= COLUMN_COUNT) {
                                const range = [];
                                let span = 0;
                                for (let j = 0, k = -1; j < COLUMN_COUNT; j++) {
                                    if (rowData[i][j] === undefined) {
                                        if (k === -1) {
                                            k = j;
                                        }
                                        span++;
                                    }
                                    if (rowData[i][j] || j === COLUMN_COUNT - 1) {
                                        if (span >= COLUMN_SPAN) {
                                            range.push([k, k + span]);
                                        }
                                        k = -1;
                                        span = 0;
                                    }
                                }
                                if (range.length) {
                                    available.push(range);
                                }
                                else {
                                    break;
                                }
                            }
                            else {
                                break;
                            }
                        }
                        if (COLUMN_SPAN === available.length) {
                            if (available.length > 1) {
                                gapNested: {
                                    for (const outside of available[0]) {
                                        for (let i = outside[0]; i < outside[1]; i++) {
                                            for (let j = 1; j < available.length; j++) {
                                                for (let k = 0; k < available[j].length; k++) {
                                                    const inside = available[j][k];
                                                    if (i >= inside[0] && (inside[1] === -1 || i + COLUMN_SPAN <= inside[1])) {
                                                        PLACEMENT[colA] = i + 1;
                                                        break gapNested;
                                                    }
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                            else {
                                PLACEMENT[colA] = available[0][0][0] + 1;
                            }
                        }
                    }
                    if (PLACEMENT[rowA] && PLACEMENT[colA]) {
                        placement[rowA] = PLACEMENT[rowA];
                        placement[colA] = PLACEMENT[colA];
                    }
                    else if (PLACEMENT[rowA]) {
                        rowInvalid[PLACEMENT[rowA] - 1] = true;
                    }
                }
                if (!placement[rowB]) {
                    placement[rowB] = placement[rowA] + ROW_SPAN;
                }
                if (!placement[colB]) {
                    placement[colB] = placement[colA] + COLUMN_SPAN;
                }
                if (setDataRows(item, placement)) {
                    item.data(EXT_NAME.CSS_GRID, 'cellData', {
                        rowStart: placement[0] - 1,
                        rowSpan: placement[2] - placement[0],
                        columnStart: placement[1] - 1,
                        columnSpan: placement[3] - placement[1]
                    });
                    if (dense) {
                        rowInvalid = {};
                    }
                }
            });
            if (horizontal) {
                mainData.rowData = rowData;
            }
            else {
                for (let i = 0; i < rowData.length; i++) {
                    for (let j = 0; j < rowData[i].length; j++) {
                        if (mainData.rowData[j] === undefined) {
                            mainData.rowData[j] = [];
                        }
                        mainData.rowData[j][i] = rowData[i][j];
                    }
                }
            }
            if (mainData.rowData.length) {
                for (const row of mainData.rowData) {
                    mainData.column.count = Math.max(row.length, mainData.column.count);
                    for (const column of row) {
                        if (column) {
                            column.forEach(item => mainData.children.add(item));
                        }
                    }
                }
                if (mainData.children.size === node.length) {
                    mainData.row.count = mainData.rowData.length;
                    const modified = new Set();
                    for (let i = 0; i < mainData.row.count; i++) {
                        for (let j = 0; j < mainData.column.count; j++) {
                            const column = mainData.rowData[i][j];
                            if (column) {
                                column.forEach((item) => {
                                    if (item && !modified.has(item)) {
                                        const cellData = item.data(EXT_NAME.CSS_GRID, 'cellData');
                                        const x = j + (cellData ? cellData.columnSpan - 1 : 0);
                                        const y = i + (cellData ? cellData.rowSpan - 1 : 0);
                                        if (x < mainData.column.count - 1) {
                                            item.modifyBox(4 /* MARGIN_RIGHT */, mainData.column.gap);
                                        }
                                        if (y < mainData.row.count - 1) {
                                            item.modifyBox(8 /* MARGIN_BOTTOM */, mainData.row.gap);
                                        }
                                        modified.add(item);
                                    }
                                });
                            }
                        }
                    }
                    node.retain(Array.from(mainData.children));
                    node.cssSort('zIndex');
                    node.data(EXT_NAME.CSS_GRID, 'mainData', mainData);
                }
            }
            return { output: '' };
        }
    }

    class Flexbox extends Extension {
        static createDataAttribute(node, children) {
            const flex = node.flexbox;
            return {
                wrap: flex.wrap.startsWith('wrap'),
                wrapReverse: flex.wrap === 'wrap-reverse',
                directionReverse: flex.direction.endsWith('reverse'),
                justifyContent: flex.justifyContent,
                rowDirection: flex.direction.startsWith('row'),
                rowCount: 0,
                columnDirection: flex.direction.startsWith('column'),
                columnCount: 0,
                children
            };
        }
        condition(node) {
            return node.flexElement && node.length > 0;
        }
        processNode(node) {
            const controller = this.application.controllerHandler;
            const pageFlow = node.children.filter(item => item.pageFlow);
            const mainData = Flexbox.createDataAttribute(node, pageFlow);
            if (node.cssTry('display', 'block')) {
                for (const item of pageFlow) {
                    if (item.element) {
                        const bounds = item.element.getBoundingClientRect();
                        const initial = item.unsafe('initial');
                        Object.assign(initial.bounds, { width: bounds.width, height: bounds.height });
                    }
                }
                node.cssFinally('display');
            }
            if (mainData.wrap) {
                function setDirection(align, sort, size) {
                    const map = new Map();
                    pageFlow.sort((a, b) => {
                        if (!withinFraction(a.linear[align], b.linear[align])) {
                            return a.linear[align] < b.linear[align] ? -1 : 1;
                        }
                        return a.linear[sort] >= b.linear[sort] ? 1 : -1;
                    });
                    for (const item of pageFlow) {
                        const point = Math.round(item.linear[align]);
                        const items = map.get(point) || [];
                        items.push(item);
                        map.set(point, items);
                    }
                    let maxCount = 0;
                    let i = 0;
                    for (const segment of map.values()) {
                        const group = controller.createNodeGroup(segment[0], segment, node);
                        group.siblingIndex = i++;
                        const box = group.unsafe('box');
                        if (box) {
                            box[size] = node.box[size];
                        }
                        group.alignmentType |= 128 /* SEGMENTED */;
                        maxCount = Math.max(segment.length, maxCount);
                    }
                    node.sort(NodeList.siblingIndex);
                    if (mainData.rowDirection) {
                        mainData.rowCount = map.size;
                        mainData.columnCount = maxCount;
                    }
                    else {
                        mainData.rowCount = maxCount;
                        mainData.columnCount = map.size;
                    }
                }
                if (mainData.rowDirection) {
                    setDirection(mainData.wrapReverse ? 'bottom' : 'top', 'left', 'right');
                }
                else {
                    setDirection('left', 'top', 'bottom');
                }
            }
            else {
                if (pageFlow.some(item => item.flexbox.order !== 0)) {
                    if (mainData.directionReverse) {
                        node.sort((a, b) => a.flexbox.order <= b.flexbox.order ? 1 : -1);
                    }
                    else {
                        node.sort((a, b) => a.flexbox.order >= b.flexbox.order ? 1 : -1);
                    }
                }
                if (mainData.rowDirection) {
                    mainData.rowCount = 1;
                    mainData.columnCount = node.length;
                }
                else {
                    mainData.rowCount = node.length;
                    mainData.columnCount = 1;
                }
            }
            node.data(EXT_NAME.FLEXBOX, 'mainData', mainData);
            return { output: '' };
        }
    }

    class External extends Extension {
        beforeInit(element, internal = false) {
            if (internal || this.included(element)) {
                if (!getElementCache(element, 'andromeExternalDisplay')) {
                    const display = [];
                    let current = element;
                    while (current) {
                        display.push(getStyle(current).display);
                        current.style.display = 'block';
                        current = current.parentElement;
                    }
                    setElementCache(element, 'andromeExternalDisplay', display);
                }
            }
        }
        init(element) {
            if (this.included(element)) {
                this.application.parseElements.add(element);
            }
            return false;
        }
        afterInit(element, internal = false) {
            if (internal || this.included(element)) {
                const data = getElementCache(element, 'andromeExternalDisplay');
                if (data) {
                    const display = data;
                    let current = element;
                    let i = 0;
                    while (current) {
                        current.style.display = display[i];
                        current = current.parentElement;
                        i++;
                    }
                    deleteElementCache(element, 'andromeExternalDisplay');
                }
            }
        }
    }

    class Grid extends Extension {
        constructor() {
            super(...arguments);
            this.options = {
                columnBalanceEqual: false
            };
        }
        static createDataAttribute() {
            return {
                paddingTop: 0,
                paddingRight: 0,
                paddingBottom: 0,
                paddingLeft: 0,
                columnCount: 0
            };
        }
        static createDataCellAttribute() {
            return {
                rowSpan: 0,
                columnSpan: 0,
                index: -1,
                cellStart: false,
                cellEnd: false,
                rowEnd: false,
                rowStart: false,
                siblings: []
            };
        }
        condition(node) {
            return node.length > 1 && !node.flexElement && !node.gridElement && !node.has('listStyle') && (node.every(item => item.pageFlow && !item.visibleStyle.background && (!item.inlineFlow || item.blockStatic)) && (node.some(item => item.length > 1) && node.every(item => item.length > 0 && NodeList.linearX(item.children)) ||
                node.every(item => item.display === 'list-item' && !item.has('listStyleType'))) ||
                node.display === 'table' && node.every(item => item.display === 'table-row' && item.every(child => child.display === 'table-cell')));
        }
        processNode(node) {
            const columnEnd = [];
            const columnBalance = this.options.columnBalanceEqual;
            let columns = [];
            if (columnBalance) {
                const dimensions = [];
                node.each((item, index) => {
                    dimensions[index] = [];
                    item.each(child => dimensions[index].push(child.bounds.width));
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
                                    columns[m][assigned[m] + (every ? 1 : 0)].data(EXT_NAME.GRID, 'cellData', { siblings: [...removed] });
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
                                        columns[m][assigned[m] + (every ? 1 : 0)].data(EXT_NAME.GRID, 'cellData', { siblings: [...removed] });
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
                function getRowIndex(rowItem) {
                    for (const column of columns) {
                        const index = column.findIndex(item => withinFraction(rowItem.linear.top, item.linear.top) || rowItem.linear.top > item.linear.top && rowItem.linear.top < item.linear.bottom);
                        if (index !== -1) {
                            return index;
                        }
                    }
                    return -1;
                }
                const nextMapX = {};
                for (const item of node) {
                    for (const subitem of item) {
                        const x = Math.floor(subitem.linear.left);
                        if (nextMapX[x] === undefined) {
                            nextMapX[x] = [];
                        }
                        nextMapX[x].push(subitem);
                    }
                }
                const nextCoordsX = Object.keys(nextMapX);
                if (nextCoordsX.length) {
                    const columnRight = [];
                    for (let l = 0; l < nextCoordsX.length; l++) {
                        const nextAxisX = nextMapX[nextCoordsX[l]];
                        if (l === 0 && nextAxisX.length === 0) {
                            return { output: '' };
                        }
                        columnRight[l] = l === 0 ? 0 : columnRight[l - 1];
                        for (let m = 0; m < nextAxisX.length; m++) {
                            const nextX = nextAxisX[m];
                            const [left, right] = [nextX.linear.left, nextX.linear.right];
                            if (l === 0 || left >= columnRight[l - 1]) {
                                if (columns[l] === undefined) {
                                    columns[l] = [];
                                }
                                if (l === 0 || columns[0].length === nextAxisX.length) {
                                    columns[l][m] = nextX;
                                }
                                else {
                                    const index = getRowIndex(nextX);
                                    if (index !== -1) {
                                        columns[l][index] = nextX;
                                    }
                                    else {
                                        return { output: '' };
                                    }
                                }
                            }
                            else {
                                const current = columns.length - 1;
                                if (columns[current]) {
                                    const minLeft = minArray(columns[current].map(item => item.linear.left));
                                    const maxRight = maxArray(columns[current].map(item => item.linear.right));
                                    if (left > minLeft && right > maxRight) {
                                        const filtered = columns.filter(item => item);
                                        const index = getRowIndex(nextX);
                                        if (index !== -1 && filtered[filtered.length - 1][index] === undefined) {
                                            columns[current].length = 0;
                                        }
                                    }
                                }
                            }
                            columnRight[l] = Math.max(right, columnRight[l]);
                        }
                    }
                    for (let l = 0, m = -1; l < columnRight.length; l++) {
                        if (columns[l] === undefined) {
                            if (m === -1) {
                                m = l - 1;
                            }
                            else if (l === columnRight.length - 1) {
                                columnRight[m] = columnRight[l];
                            }
                        }
                        else if (m !== -1) {
                            columnRight[m] = columnRight[l - 1];
                            m = -1;
                        }
                    }
                    columns = columns.filter((item, index) => {
                        if (item && item.length > 0) {
                            columnEnd.push(columnRight[index]);
                            return true;
                        }
                        return false;
                    });
                    const columnMax = columns.reduce((a, b) => Math.max(a, b.length), 0);
                    for (let l = 0; l < columnMax; l++) {
                        for (let m = 0; m < columns.length; m++) {
                            if (columns[m][l] === undefined) {
                                columns[m][l] = { spacer: 1 };
                            }
                        }
                    }
                }
                columnEnd.push(node.box.right);
            }
            if (columns.length > 1 && columns[0].length === node.length) {
                const mainData = Object.assign(Grid.createDataAttribute(), { columnCount: columnBalance ? columns[0].length : columns.length });
                node.duplicate().forEach(item => node.remove(item) && item.hide());
                for (let l = 0, count = 0; l < columns.length; l++) {
                    let spacer = 0;
                    for (let m = 0, start = 0; m < columns[l].length; m++) {
                        const item = columns[l][m];
                        if (!item.spacer) {
                            item.parent = node;
                            const data = Object.assign(Grid.createDataCellAttribute(), item.data(EXT_NAME.GRID, 'cellData') || {});
                            if (columnBalance) {
                                data.rowStart = m === 0;
                                data.rowEnd = m === columns[l].length - 1;
                                data.cellStart = l === 0 && m === 0;
                                data.cellEnd = l === columns.length - 1 && data.rowEnd;
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
                                const index = Math.min(l + (columnSpan - 1), columnEnd.length - 1);
                                data.siblings.push(...flatMap(Array.from(item.documentParent.element.children), element => {
                                    const sibling = getElementAsNode(element);
                                    return (sibling &&
                                        sibling.visible &&
                                        !sibling.rendered &&
                                        sibling.linear.left >= item.linear.right &&
                                        sibling.linear.right <= columnEnd[index] ? sibling : null);
                                }));
                                data.rowSpan = rowSpan;
                                data.columnSpan = columnSpan;
                                data.rowStart = start++ === 0;
                                data.rowEnd = columnSpan + l === columns.length;
                                data.cellStart = count++ === 0;
                                data.cellEnd = data.rowEnd && m === columns[l].length - 1;
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
                sortAsc(node.children, 'documentParent.siblingIndex', 'siblingIndex');
                node.each((item, index) => item.siblingIndex = index);
                if (node.tableElement && node.css('borderCollapse') === 'collapse') {
                    node.modifyBox(32 /* PADDING_TOP */, null);
                    node.modifyBox(64 /* PADDING_RIGHT */, null);
                    node.modifyBox(128 /* PADDING_BOTTOM */, null);
                    node.modifyBox(256 /* PADDING_LEFT */, null);
                }
                node.data(EXT_NAME.GRID, 'mainData', mainData);
            }
            return { output: '' };
        }
    }

    function hasSingleImage(node) {
        return node.visibleStyle.backgroundImage && !node.visibleStyle.backgroundRepeat;
    }
    class List extends Extension {
        static createDataAttribute() {
            return {
                ordinal: '',
                imageSrc: '',
                imagePosition: ''
            };
        }
        condition(node) {
            return super.condition(node) && node.length > 0 && (node.every(item => item.blockStatic) ||
                node.every(item => item.inlineVertical) ||
                node.every(item => item.floating) && NodeList.floated(node.children).size === 1 ||
                node.every((item, index) => !item.floating && (index === 0 ||
                    index === node.length - 1 ||
                    item.blockStatic ||
                    item.inlineFlow && node.item(index - 1).blockStatic && node.item(index + 1).blockStatic))) && (node.some(item => item.display === 'list-item' && (item.css('listStyleType') !== 'none' || hasSingleImage(item))) ||
                node.every(item => item.tagName !== 'LI' && item.cssInitial('listStyleType') === 'none' && hasSingleImage(item)));
        }
        processNode(node) {
            let i = 0;
            node.each(item => {
                const mainData = List.createDataAttribute();
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
                                if (!item.visibleStyle.backgroundRepeat) {
                                    src = item.css('backgroundImage');
                                    position = item.css('backgroundPosition');
                                }
                                if (src && src !== 'none') {
                                    mainData.imageSrc = src;
                                    mainData.imagePosition = position;
                                    item.exclude({ resource: NODE_RESOURCE.IMAGE_SOURCE });
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
            });
            return { output: '' };
        }
        postBaseLayout(node) {
            node.modifyBox(16 /* MARGIN_LEFT */, null);
            node.modifyBox(256 /* PADDING_LEFT */, null);
        }
    }

    class Relative extends Extension {
        condition(node) {
            return node.positionRelative && !node.positionStatic || convertInt(node.cssInitial('verticalAlign')) !== 0;
        }
        processNode() {
            return { output: '', include: true };
        }
        postProcedure(node) {
            const renderParent = node.renderParent;
            if (renderParent) {
                let target = node;
                const verticalAlign = convertInt(node.verticalAlign);
                if (renderParent.support.container.positionRelative && node.length === 0 && (node.top !== 0 || node.bottom !== 0 || verticalAlign !== 0)) {
                    target = node.clone(this.application.nextId, true, true);
                    node.hide(true);
                    const layout = new Layout(renderParent, target, target.containerType, target.alignmentType);
                    this.application.controllerHandler.appendAfter(node.id, this.application.renderLayout(layout));
                    this.application.session.cache.append(target, false);
                    renderParent.renderEach(item => {
                        if (item.alignSibling('topBottom') === node.documentId) {
                            item.alignSibling('topBottom', target.documentId);
                        }
                        else if (item.alignSibling('bottomTop') === node.documentId) {
                            item.alignSibling('bottomTop', target.documentId);
                        }
                    });
                }
                if (node.top !== 0) {
                    target.modifyBox(2 /* MARGIN_TOP */, node.top);
                }
                else if (node.bottom !== 0) {
                    target.modifyBox(2 /* MARGIN_TOP */, node.bottom * -1);
                }
                if (verticalAlign !== 0) {
                    target.modifyBox(2 /* MARGIN_TOP */, verticalAlign * -1);
                }
                if (node.left !== 0) {
                    if (target.autoMargin.left) {
                        target.modifyBox(4 /* MARGIN_RIGHT */, node.left * -1);
                    }
                    else {
                        target.modifyBox(16 /* MARGIN_LEFT */, node.left);
                    }
                }
                else if (node.right !== 0) {
                    target.modifyBox(16 /* MARGIN_LEFT */, node.right * -1);
                }
            }
        }
    }

    class Sprite extends Extension {
        condition(node) {
            let valid = false;
            if (node.hasWidth && node.hasHeight && node.length === 0 && !node.inlineText) {
                let url = node.css('backgroundImage');
                if (!hasValue(url) || url === 'none') {
                    url = '';
                    const match = REGEX_PATTERN.CSS_URL.exec(node.css('background'));
                    if (match) {
                        url = match[0];
                    }
                }
                if (url !== '') {
                    url = cssResolveUrl(url);
                    const image = this.application.session.image.get(url);
                    if (image) {
                        const fontSize = node.fontSize;
                        const width = convertClientUnit(node.has('width') ? node.css('width') : node.css('minWidth'), node.bounds.width, fontSize);
                        const height = convertClientUnit(node.has('height') ? node.css('width') : node.css('minHeight'), node.bounds.height, fontSize);
                        const position = getBackgroundPosition(`${node.css('backgroundPositionX')} ${node.css('backgroundPositionY')}`, node.bounds, fontSize);
                        if (position.left <= 0 && position.top <= 0 && image.width > width && image.height > height) {
                            image.position = { x: position.left, y: position.top };
                            node.data(EXT_NAME.SPRITE, 'mainData', image);
                            valid = true;
                        }
                    }
                }
            }
            return valid && (!hasValue(node.dataset.use) || this.included(node.element));
        }
    }

    class Substitute extends Extension {
        constructor(name, framework, tagNames, options) {
            super(name, framework, tagNames, options);
            this.require(EXT_NAME.EXTERNAL, true);
        }
        processNode(node, parent) {
            const data = getDataSet(node.element, this.name);
            let output = '';
            if (data.tag) {
                node.setControlType(data.tag);
                node.render(parent);
                output = this.application.controllerHandler.renderNodeStatic(data.tag, node.renderDepth, {}, '', '', node, node.length > 0);
            }
            if (data.tagChild) {
                node.each(item => {
                    if (item.styleElement) {
                        item.dataset.use = this.name;
                        item.dataset.andromeSubstituteTag = data.tagChild;
                    }
                });
            }
            return { output };
        }
    }

    class Table extends Extension {
        static createDataAttribute() {
            return {
                layoutType: 0,
                rowCount: 0,
                columnCount: 0,
                expand: false
            };
        }
        processNode(node) {
            function setAutoWidth(td) {
                td.data(EXT_NAME.TABLE, 'percent', `${Math.round((td.bounds.width / node.bounds.width) * 100)}%`);
                td.data(EXT_NAME.TABLE, 'expand', true);
            }
            function setBoundsWidth(td) {
                td.css('width', formatPX(td.bounds.width), true);
            }
            const mainData = Table.createDataAttribute();
            const table = [];
            const thead = node.filter(item => item.tagName === 'THEAD');
            const tbody = node.filter(item => item.tagName === 'TBODY');
            const tfoot = node.filter(item => item.tagName === 'TFOOT');
            const colgroup = Array.from(node.element.children).find(element => element.tagName === 'COLGROUP');
            if (thead.length) {
                thead[0].cascade().filter(item => item.tagName === 'TH' || item.tagName === 'TD').forEach(item => item.inherit(thead[0], 'styleMap'));
                table.push(...thead[0].children);
                thead.forEach(item => item.hide());
            }
            if (tbody.length) {
                tbody.forEach(item => {
                    table.push(...item.children);
                    item.hide();
                });
            }
            if (tfoot.length) {
                tfoot[0].cascade().filter(item => item.tagName === 'TH' || item.tagName === 'TD').forEach(item => item.inherit(tfoot[0], 'styleMap'));
                table.push(...tfoot[0].children);
                tfoot.forEach(item => item.hide());
            }
            const layoutFixed = node.css('tableLayout') === 'fixed';
            const borderCollapse = node.css('borderCollapse') === 'collapse';
            const [horizontal, vertical] = borderCollapse ? [0, 0] : node.css('borderSpacing').split(' ').map(value => parseInt(value));
            if (horizontal > 0) {
                node.modifyBox(256 /* PADDING_LEFT */, horizontal);
                node.modifyBox(64 /* PADDING_RIGHT */, horizontal);
            }
            else {
                node.modifyBox(256 /* PADDING_LEFT */, null);
                node.modifyBox(64 /* PADDING_RIGHT */, null);
            }
            if (vertical > 0) {
                node.modifyBox(32 /* PADDING_TOP */, vertical);
                node.modifyBox(128 /* PADDING_BOTTOM */, vertical);
            }
            else {
                node.modifyBox(32 /* PADDING_TOP */, null);
                node.modifyBox(128 /* PADDING_BOTTOM */, null);
            }
            const spacingWidth = formatPX(horizontal > 1 ? Math.round(horizontal / 2) : horizontal);
            const spacingHeight = formatPX(vertical > 1 ? Math.round(vertical / 2) : vertical);
            const rowWidth = [];
            const mapBounds = [];
            const tableFilled = [];
            let columnIndex = new Array(table.length).fill(0);
            let mapWidth = [];
            let multiLine = 0;
            for (let i = 0; i < table.length; i++) {
                const tr = table[i];
                rowWidth[i] = horizontal;
                tableFilled[i] = [];
                for (let j = 0; j < tr.length; j++) {
                    const td = tr.item(j);
                    const element = td.element;
                    for (let k = 0; k < element.rowSpan - 1; k++) {
                        const l = (i + 1) + k;
                        if (columnIndex[l] !== undefined) {
                            columnIndex[l] += element.colSpan;
                        }
                    }
                    if (!td.visibleStyle.backgroundImage && !td.visibleStyle.backgroundColor) {
                        if (colgroup) {
                            const style = getStyle(colgroup.children[columnIndex[i]]);
                            if (style.background) {
                                element.style.background = style.background;
                            }
                            else if (style.backgroundColor) {
                                element.style.backgroundColor = style.backgroundColor;
                            }
                        }
                        else {
                            let value = cssInheritStyle(element, 'background', ['rgba(0, 0, 0, 0)', 'transparent'], ['TABLE']);
                            if (value !== '') {
                                element.style.background = value;
                            }
                            else {
                                value = cssInheritStyle(element, 'backgroundColor', ['rgba(0, 0, 0, 0)', 'transparent'], ['TABLE']);
                                if (value !== '') {
                                    element.style.backgroundColor = value;
                                }
                            }
                        }
                    }
                    switch (td.tagName) {
                        case 'TH':
                            if (!td.cssInitial('textAlign')) {
                                td.css('textAlign', 'center');
                            }
                        case 'TD':
                            if (!td.cssInitial('verticalAlign')) {
                                td.css('verticalAlign', 'middle');
                            }
                            break;
                    }
                    const columnWidth = td.cssInitial('width');
                    const m = columnIndex[i];
                    const reevaluate = mapWidth[m] === undefined || mapWidth[m] === 'auto';
                    if (i === 0 || reevaluate || !layoutFixed) {
                        if (columnWidth === '' || columnWidth === 'auto') {
                            if (mapWidth[m] === undefined) {
                                mapWidth[m] = columnWidth || '0px';
                                mapBounds[m] = 0;
                            }
                            else if (i === table.length - 1) {
                                if (reevaluate && mapBounds[m] === 0) {
                                    mapBounds[m] = td.bounds.width;
                                }
                            }
                        }
                        else {
                            const unit = isUnit(mapWidth[m]);
                            const percent = isPercent(columnWidth);
                            if (reevaluate || td.bounds.width < mapBounds[m] || (td.bounds.width === mapBounds[m] && ((unit || percent) ||
                                unit && percent ||
                                percent && isPercent(mapWidth[m]) && convertFloat(columnWidth) > convertFloat(mapWidth[m]) ||
                                unit && isUnit(columnWidth) && convertInt(columnWidth) > convertInt(mapWidth[m])))) {
                                mapWidth[m] = columnWidth;
                            }
                            if (reevaluate || element.colSpan === 1) {
                                mapBounds[m] = td.bounds.width;
                            }
                        }
                    }
                    if (multiLine === 0) {
                        multiLine = td.multiLine;
                    }
                    if (td.length || td.inlineText) {
                        rowWidth[i] += td.bounds.width + horizontal;
                    }
                    td.cssApply({
                        marginTop: i === 0 ? '0px' : spacingHeight,
                        marginRight: j < tr.length - 1 ? spacingWidth : '0px',
                        marginBottom: i + element.rowSpan - 1 >= table.length - 1 ? '0px' : spacingHeight,
                        marginLeft: columnIndex[i] === 0 ? '0px' : spacingWidth
                    }, true);
                    columnIndex[i] += element.colSpan;
                }
            }
            if (node.has('width', 2 /* UNIT */) && mapWidth.some(value => isPercent(value))) {
                mapWidth = mapWidth.map((value, index) => {
                    if (value === 'auto' && mapBounds[index] > 0) {
                        value = formatPX(mapBounds[index]);
                    }
                    return value;
                });
            }
            if (mapWidth.every(value => isPercent(value)) && mapWidth.reduce((a, b) => a + parseFloat(b), 0) > 1) {
                let percentTotal = 100;
                mapWidth = mapWidth.map(value => {
                    const percent = parseFloat(value);
                    if (percentTotal <= 0) {
                        value = '0px';
                    }
                    else if (percentTotal - percent < 0) {
                        value = formatPercent(percentTotal);
                    }
                    percentTotal -= percent;
                    return value;
                });
            }
            else if (mapWidth.every(value => isUnit(value))) {
                const width = mapWidth.reduce((a, b) => a + parseInt(b), 0);
                if (width < node.width) {
                    mapWidth = mapWidth.map(value => value !== '0px' ? `${(parseInt(value) / width) * 100}%` : value);
                }
                else if (width > node.width) {
                    node.css('width', 'auto', true);
                    if (!layoutFixed) {
                        node.cascade().forEach(item => item.css('width', 'auto', true));
                    }
                }
            }
            const mapPercent = mapWidth.reduce((a, b) => a + (isPercent(b) ? parseFloat(b) : 0), 0);
            mainData.layoutType = (() => {
                if (mapWidth.some(value => isPercent(value)) || mapWidth.every(value => isUnit(value) && value !== '0px')) {
                    return 3 /* VARIABLE */;
                }
                if (mapWidth.every(value => value === mapWidth[0])) {
                    if (multiLine) {
                        return node.some(td => td.has('height')) ? 2 /* FIXED */ : 3 /* VARIABLE */;
                    }
                    if (mapWidth[0] === 'auto') {
                        return node.has('width') ? 3 /* VARIABLE */ : 0 /* NONE */;
                    }
                    if (node.hasWidth) {
                        return 2 /* FIXED */;
                    }
                }
                if (mapWidth.every(value => value === 'auto' || (isUnit(value) && value !== '0px'))) {
                    return 1 /* STRETCH */;
                }
                return 0 /* NONE */;
            })();
            if (multiLine || (mainData.layoutType === 1 /* STRETCH */ && !node.hasWidth)) {
                mainData.expand = true;
            }
            const columnCount = maxArray(columnIndex);
            let rowCount = table.length;
            const caption = node.find(item => item.tagName === 'CAPTION');
            node.clear();
            if (caption) {
                if (!caption.hasWidth && !isUserAgent(8 /* EDGE */)) {
                    if (caption.textElement) {
                        if (!caption.has('maxWidth')) {
                            caption.css('maxWidth', formatPX(caption.bounds.width));
                        }
                    }
                    else if (caption.bounds.width > maxArray(rowWidth)) {
                        setBoundsWidth(caption);
                    }
                }
                if (!caption.cssInitial('textAlign')) {
                    caption.css('textAlign', 'center');
                }
                rowCount++;
                caption.data(EXT_NAME.TABLE, 'colSpan', columnCount);
                caption.parent = node;
            }
            columnIndex = new Array(table.length).fill(0);
            const hasWidth = node.hasWidth;
            for (let i = 0; i < table.length; i++) {
                const tr = table[i];
                const children = tr.duplicate();
                for (let j = 0; j < children.length; j++) {
                    const td = children[j];
                    const element = td.element;
                    const rowSpan = element.rowSpan;
                    const colSpan = element.colSpan;
                    for (let k = 0; k < rowSpan - 1; k++) {
                        const l = (i + 1) + k;
                        if (columnIndex[l] !== undefined) {
                            columnIndex[l] += colSpan;
                        }
                    }
                    if (rowSpan > 1) {
                        td.data(EXT_NAME.TABLE, 'rowSpan', rowSpan);
                    }
                    if (colSpan > 1) {
                        td.data(EXT_NAME.TABLE, 'colSpan', colSpan);
                    }
                    if (!td.has('verticalAlign')) {
                        td.css('verticalAlign', 'middle');
                    }
                    const columnWidth = mapWidth[columnIndex[i]];
                    if (columnWidth !== 'undefined') {
                        switch (mainData.layoutType) {
                            case 3 /* VARIABLE */:
                                if (columnWidth === 'auto') {
                                    if (mapPercent >= 1) {
                                        setBoundsWidth(td);
                                        td.data(EXT_NAME.TABLE, 'exceed', !hasWidth);
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
                                    if (!td.has('width') || td.has('width', 32 /* PERCENT */)) {
                                        setBoundsWidth(td);
                                    }
                                    td.data(EXT_NAME.TABLE, 'expand', false);
                                }
                                break;
                            case 2 /* FIXED */:
                                td.css('width', '0px');
                                break;
                            case 1 /* STRETCH */:
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
                    columnIndex[i] += colSpan;
                    for (let k = 0; k < rowSpan; k++) {
                        for (let l = 0; l < colSpan; l++) {
                            tableFilled[i + k].push(td);
                        }
                    }
                    td.parent = node;
                }
                if (columnIndex[i] < columnCount) {
                    const td = children[children.length - 1];
                    td.data(EXT_NAME.TABLE, 'spaceSpan', columnCount - columnIndex[i]);
                }
                tr.hide();
            }
            if (borderCollapse) {
                const borderTopColor = node.css('borderTopColor');
                const borderTopStyle = node.css('borderTopStyle');
                const borderTopWidth = node.css('borderTopWidth');
                const borderRightColor = node.css('borderRightColor');
                const borderRightStyle = node.css('borderRightStyle');
                const borderRightWidth = node.css('borderRightWidth');
                const borderBottomColor = node.css('borderBottomColor');
                const borderBottomStyle = node.css('borderBottomStyle');
                const borderBottomWidth = node.css('borderBottomWidth');
                const borderLeftColor = node.css('borderLeftColor');
                const borderLeftStyle = node.css('borderLeftStyle');
                const borderLeftWidth = node.css('borderLeftWidth');
                for (let i = 0; i < rowCount; i++) {
                    for (let j = 0; j < columnCount; j++) {
                        const td = tableFilled[i][j];
                        if (td && td.css('visibility') === 'visible') {
                            if (i === 0) {
                                if (td.borderTopWidth < parseInt(borderTopWidth)) {
                                    td.cssApply({
                                        borderTopColor,
                                        borderTopStyle,
                                        borderTopWidth
                                    });
                                }
                            }
                            if (i >= 0 && i < rowCount - 1) {
                                const next = tableFilled[i + 1][j];
                                if (next && next !== td && next.css('visibility') === 'visible') {
                                    if (td.borderBottomWidth >= next.borderTopWidth) {
                                        next.css('borderTopWidth', '0px');
                                    }
                                    else {
                                        td.css('borderBottomWidth', '0px');
                                    }
                                }
                            }
                            if (i === rowCount - 1) {
                                if (td.borderBottomWidth < parseInt(borderBottomWidth)) {
                                    td.cssApply({
                                        borderBottomColor,
                                        borderBottomStyle,
                                        borderBottomWidth
                                    });
                                }
                            }
                            if (j === 0) {
                                if (td.borderLeftWidth < parseInt(borderLeftWidth)) {
                                    td.cssApply({
                                        borderLeftColor,
                                        borderLeftStyle,
                                        borderLeftWidth
                                    });
                                }
                            }
                            if (j >= 0 && j < columnCount - 1) {
                                const next = tableFilled[i][j + 1];
                                if (next && next !== td && next.css('visibility') === 'visible') {
                                    if (td.borderRightWidth >= next.borderLeftWidth) {
                                        next.css('borderLeftWidth', '0px');
                                    }
                                    else {
                                        td.css('borderRightWidth', '0px');
                                    }
                                }
                            }
                            if (j === columnCount - 1) {
                                if (td.borderRightWidth < parseInt(borderRightWidth)) {
                                    td.cssApply({
                                        borderRightColor,
                                        borderRightStyle,
                                        borderRightWidth
                                    });
                                }
                            }
                        }
                    }
                }
                node.cssApply({
                    borderTopWidth: '0px',
                    borderRightWidth: '0px',
                    borderBottomWidth: '0px',
                    borderLeftWidth: '0px'
                });
            }
            mainData.rowCount = rowCount;
            mainData.columnCount = columnCount;
            node.data(EXT_NAME.TABLE, 'mainData', mainData);
            return { output: '' };
        }
    }

    class VerticalAlign extends Extension {
        condition(node) {
            return node.length > 1 && node.some(item => item.inlineVertical && convertInt(item.verticalAlign) !== 0) && NodeList.linearX(node.children);
        }
        processNode(node) {
            const belowBaseline = [];
            let aboveBaseline = [];
            let minTop = Number.MAX_VALUE;
            node.each((item) => {
                if (item.inlineVertical && item.linear.top <= minTop) {
                    if (item.linear.top < minTop) {
                        aboveBaseline.length = 0;
                    }
                    aboveBaseline.push(item);
                    minTop = item.linear.top;
                }
            });
            if (node.every(item => item.positionStatic || item.positionRelative && item.length > 0)) {
                if (aboveBaseline.length !== node.length) {
                    node.each((item) => {
                        let reset = false;
                        if (aboveBaseline.includes(item)) {
                            reset = true;
                        }
                        else if (item.inlineVertical && !item.baseline && isUnit(item.verticalAlign)) {
                            item.modifyBox(2 /* MARGIN_TOP */, item.linear.top - aboveBaseline[0].linear.top);
                            belowBaseline.push(item);
                            reset = true;
                        }
                        if (reset) {
                            item.css('verticalAlign', '0px', true);
                        }
                    });
                }
            }
            else {
                aboveBaseline = aboveBaseline.filter(item => isUnit(item.verticalAlign) && convertInt(item.verticalAlign) > 0);
            }
            if (aboveBaseline.length) {
                node.data(EXT_NAME.VERTICAL_ALIGN, 'mainData', {
                    aboveBaseline,
                    belowBaseline
                });
            }
            return { output: '' };
        }
        postProcedure(node) {
            const mainData = node.data(EXT_NAME.VERTICAL_ALIGN, 'mainData');
            if (mainData) {
                const baseline = node.find(item => item.baselineActive);
                if (baseline) {
                    baseline.modifyBox(2 /* MARGIN_TOP */, baseline.linear.top - mainData.aboveBaseline[0].linear.top);
                }
                else {
                    [...mainData.belowBaseline, ...mainData.aboveBaseline].some(item => {
                        const verticalAlign = convertInt(item.cssInitial('verticalAlign'));
                        if (verticalAlign > 0) {
                            item.modifyBox(8 /* MARGIN_BOTTOM */, verticalAlign);
                            return true;
                        }
                        return false;
                    });
                }
            }
        }
    }

    function setMinHeight(node, offset) {
        const minHeight = node.has('minHeight', 2 /* UNIT */) ? node.toInt('minHeight') : 0;
        node.css('minHeight', formatPX(Math.max(offset, minHeight)));
    }
    function applyMarginCollapse(parent, node, direction) {
        if (!node.lineBreak &&
            !node.plainText &&
            node === parent[direction ? 'firstChild' : 'lastChild'] &&
            parent[direction ? 'marginTop' : 'marginBottom'] > 0 &&
            parent[direction ? 'borderTopWidth' : 'borderBottomWidth'] === 0 &&
            parent[direction ? 'paddingTop' : 'paddingBottom'] === 0) {
            node.modifyBox(direction ? 2 /* MARGIN_TOP */ : 8 /* MARGIN_BOTTOM */, null);
        }
    }
    class WhiteSpace extends Extension {
        afterBaseLayout() {
            const processed = new Set();
            for (const node of this.application.processing.cache) {
                if (node.htmlElement && node.blockStatic) {
                    let firstChild;
                    let lastChild;
                    for (let i = 0; i < node.element.children.length; i++) {
                        const element = node.element.children[i];
                        let current = getElementAsNode(element);
                        if (current && current.pageFlow) {
                            if (firstChild === undefined) {
                                firstChild = current;
                            }
                            lastChild = current;
                            if (!current.lineBreak && current.blockStatic) {
                                const previousSiblings = current.previousSiblings();
                                if (previousSiblings.length) {
                                    let previous = previousSiblings[0];
                                    if (previous.blockStatic && !previous.lineBreak) {
                                        current = (current.renderAs || current);
                                        previous = (previous.renderAs || previous);
                                        let marginTop = convertInt(current.cssInitial('marginTop', false, true));
                                        const marginBottom = convertInt(current.cssInitial('marginBottom', false, true));
                                        const previousMarginTop = convertInt(previous.cssInitial('marginTop', false, true));
                                        let previousMarginBottom = convertInt(previous.cssInitial('marginBottom', false, true));
                                        if (previous.excluded && !current.excluded) {
                                            const offset = Math.min(previousMarginTop, previousMarginBottom);
                                            if (offset < 0) {
                                                if (Math.abs(offset) >= marginTop) {
                                                    current.modifyBox(2 /* MARGIN_TOP */, null);
                                                }
                                                else {
                                                    current.modifyBox(2 /* MARGIN_TOP */, offset);
                                                }
                                                processed.add(previous);
                                            }
                                        }
                                        else if (!previous.excluded && current.excluded) {
                                            const offset = Math.min(marginTop, marginBottom);
                                            if (offset < 0) {
                                                if (Math.abs(offset) >= previousMarginBottom) {
                                                    previous.modifyBox(8 /* MARGIN_BOTTOM */, null);
                                                }
                                                else {
                                                    previous.modifyBox(8 /* MARGIN_BOTTOM */, offset);
                                                }
                                                processed.add(current);
                                            }
                                        }
                                        else {
                                            if (marginTop === 0 && current.length > 0) {
                                                const topChild = current.firstChild;
                                                if (topChild && topChild.blockStatic) {
                                                    marginTop = convertInt(topChild.cssInitial('marginTop', false, true));
                                                    current = topChild;
                                                }
                                            }
                                            if (previousMarginBottom === 0 && previous.length > 0) {
                                                const bottomChild = previous.lastChild;
                                                if (bottomChild && bottomChild.blockStatic) {
                                                    previousMarginBottom = convertInt(bottomChild.cssInitial('marginBottom', false, true));
                                                    previous = bottomChild;
                                                }
                                            }
                                            if (previousMarginBottom > 0 && marginTop > 0) {
                                                if (marginTop <= previousMarginBottom) {
                                                    current.modifyBox(2 /* MARGIN_TOP */, null);
                                                }
                                                else {
                                                    previous.modifyBox(8 /* MARGIN_BOTTOM */, null);
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                    if (firstChild) {
                        applyMarginCollapse(node, firstChild, true);
                    }
                    if (lastChild) {
                        applyMarginCollapse(node, lastChild, false);
                    }
                }
            }
            if (this.application.processing.node) {
                flatMap(Array.from(this.application.processing.node.element.getElementsByTagName('BR')), item => getElementAsNode(item)).forEach((node) => {
                    if (!processed.has(node)) {
                        const actualParent = node.actualParent;
                        const previousSiblings = node.previousSiblings(true, true, true);
                        const nextSiblings = node.nextSiblings(true, true, true);
                        let valid = false;
                        if (previousSiblings.length && nextSiblings.length) {
                            if (nextSiblings[0].lineBreak) {
                                return;
                            }
                            else {
                                valid = true;
                                const bottomStart = previousSiblings.pop();
                                const topEnd = nextSiblings.pop();
                                if (bottomStart.inlineStatic && topEnd.inlineStatic && previousSiblings.length === 0) {
                                    processed.add(node);
                                    return;
                                }
                                let bottom;
                                let top;
                                if (bottomStart.lineHeight > 0 && bottomStart.cssTry('lineHeight', '0px')) {
                                    bottom = bottomStart.element.getBoundingClientRect().bottom + bottomStart.marginBottom;
                                    bottomStart.cssFinally('lineHeight');
                                }
                                else {
                                    bottom = bottomStart.linear.bottom;
                                }
                                if (topEnd.lineHeight > 0 && topEnd.cssTry('lineHeight', '0px')) {
                                    top = topEnd.element.getBoundingClientRect().top - topEnd.marginTop;
                                    topEnd.cssFinally('lineHeight');
                                }
                                else {
                                    top = topEnd.linear.top;
                                }
                                const bottomParent = bottomStart.visible ? bottomStart.renderParent : undefined;
                                const topParent = topEnd.visible ? topEnd.renderParent : undefined;
                                const offset = top - bottom;
                                if (offset > 0) {
                                    if (topParent && topParent.groupParent && topParent.firstChild === topEnd) {
                                        topParent.modifyBox(2 /* MARGIN_TOP */, offset);
                                    }
                                    else if (bottomParent && bottomParent.groupParent && bottomParent.lastChild === bottomStart) {
                                        bottomParent.modifyBox(8 /* MARGIN_BOTTOM */, offset);
                                    }
                                    else {
                                        if (topParent && topParent.layoutVertical && (topEnd.visible || topEnd.renderAs)) {
                                            (topEnd.renderAs || topEnd).modifyBox(2 /* MARGIN_TOP */, offset);
                                        }
                                        else if (bottomParent && bottomParent.layoutVertical && (bottomStart.visible || bottomStart.renderAs)) {
                                            (bottomStart.renderAs || bottomStart).modifyBox(8 /* MARGIN_BOTTOM */, offset);
                                        }
                                        else if (!topParent && !bottomParent && actualParent && actualParent.visible) {
                                            if (topEnd.lineBreak || topEnd.excluded) {
                                                actualParent.modifyBox(128 /* PADDING_BOTTOM */, offset);
                                            }
                                            else if (bottomStart.lineBreak || bottomStart.excluded) {
                                                actualParent.modifyBox(32 /* PADDING_TOP */, offset);
                                            }
                                            else {
                                                valid = false;
                                            }
                                        }
                                        else {
                                            valid = false;
                                        }
                                    }
                                }
                            }
                        }
                        else if (actualParent && actualParent.visible) {
                            if (!actualParent.documentRoot && previousSiblings.length) {
                                const previousStart = previousSiblings[previousSiblings.length - 1];
                                const offset = actualParent.box.bottom - previousStart.linear[previousStart.lineBreak || previousStart.excluded ? 'top' : 'bottom'];
                                if (offset > 0) {
                                    if (previousStart.visible) {
                                        actualParent.modifyBox(128 /* PADDING_BOTTOM */, offset);
                                    }
                                    else if (!actualParent.hasHeight) {
                                        setMinHeight(actualParent, offset);
                                    }
                                }
                            }
                            else if (nextSiblings.length) {
                                const nextStart = nextSiblings[nextSiblings.length - 1];
                                const offset = nextStart.linear[nextStart.lineBreak || nextStart.excluded ? 'bottom' : 'top'] - actualParent.box.top;
                                if (offset > 0) {
                                    if (nextStart.visible) {
                                        actualParent.modifyBox(32 /* PADDING_TOP */, offset);
                                    }
                                    else if (!actualParent.hasHeight) {
                                        setMinHeight(actualParent, offset);
                                    }
                                }
                            }
                            valid = true;
                        }
                        if (valid) {
                            processed.add(node);
                            previousSiblings.forEach((item) => processed.add(item));
                            nextSiblings.forEach((item) => processed.add(item));
                        }
                    }
                });
            }
            for (const node of this.application.processing.excluded) {
                if (!processed.has(node) && !node.lineBreak) {
                    const offset = node.marginTop + node.marginBottom;
                    if (offset !== 0) {
                        const nextSiblings = node.nextSiblings(true, true, true);
                        if (nextSiblings.length) {
                            const topEnd = nextSiblings.pop();
                            if (topEnd.visible) {
                                topEnd.modifyBox(2 /* MARGIN_TOP */, offset);
                                processed.add(node);
                            }
                        }
                    }
                }
            }
        }
        afterConstraints() {
            for (const node of this.application.processing.cache) {
                const renderParent = node.renderAs ? node.renderAs.renderParent : node.renderParent;
                if (renderParent && node.pageFlow) {
                    if (!renderParent.hasAlign(4 /* AUTO_LAYOUT */) && !node.alignParent('left') && node.styleElement && node.inlineVertical) {
                        const previous = [];
                        let current = node;
                        while (true) {
                            previous.push(...current.previousSiblings());
                            if (previous.length && !previous.some(item => item.lineBreak || item.excluded && item.blockStatic)) {
                                const previousSibling = previous[previous.length - 1];
                                if (previousSibling.inlineVertical) {
                                    const offset = node.linear.left - previous[previous.length - 1].actualRight();
                                    if (offset > 0) {
                                        (node.renderAs || node).modifyBox(16 /* MARGIN_LEFT */, offset);
                                    }
                                }
                                else if (previousSibling.floating) {
                                    previous.length = 0;
                                    current = previousSibling;
                                    continue;
                                }
                            }
                            break;
                        }
                    }
                }
            }
        }
    }

    let main;
    let framework;
    exports.settings = {};
    exports.system = {};
    const extensionsAsync = new Set();
    const optionsAsync = new Map();
    function setFramework(value, cached = false) {
        if (framework !== value) {
            const appBase = cached ? value.cached() : value.create();
            if (main || Object.keys(exports.settings).length === 0) {
                exports.settings = appBase.userSettings;
            }
            else {
                exports.settings = Object.assign(appBase.userSettings, exports.settings);
            }
            main = appBase.application;
            main.userSettings = exports.settings;
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
                register.forEach(item => main.extensionManager.include(item));
            }
            framework = value;
            exports.system = value.system;
        }
        reset();
    }
    function parseDocument(...elements) {
        if (main && !main.closed) {
            if (exports.settings.handleExtensionsAsync) {
                extensionsAsync.forEach(item => main.extensionManager.include(item));
                for (const [name, options] of optionsAsync.entries()) {
                    configure(name, options);
                }
                extensionsAsync.clear();
                optionsAsync.clear();
            }
            return main.parseDocument(...elements);
        }
        return {
            then: (callback) => {
                if (!main) {
                    alert('ERROR: Framework not installed.');
                }
                else if (main.closed) {
                    if (confirm('ERROR: Document is closed. Reset and rerun?')) {
                        main.reset();
                        parseDocument.call(null, ...arguments).then(callback);
                    }
                }
            }
        };
    }
    function include(value) {
        if (main) {
            if (value instanceof Extension) {
                return main.extensionManager.include(value);
            }
            else if (isString(value)) {
                value = value.trim();
                const ext = main.builtInExtensions[value] || retrieve(value);
                if (ext) {
                    return main.extensionManager.include(ext);
                }
            }
        }
        return false;
    }
    function includeAsync(value) {
        if (include(value)) {
            return true;
        }
        else if (value instanceof Extension) {
            extensionsAsync.add(value);
            if (exports.settings.handleExtensionsAsync) {
                return true;
            }
        }
        return false;
    }
    function exclude(value) {
        if (main) {
            if (value instanceof Extension) {
                if (extensionsAsync.has(value)) {
                    extensionsAsync.delete(value);
                    main.extensionManager.exclude(value);
                    return true;
                }
                else {
                    return main.extensionManager.exclude(value);
                }
            }
            else if (isString(value)) {
                value = value.trim();
                const ext = main.extensionManager.retrieve(value);
                if (ext) {
                    return main.extensionManager.exclude(ext);
                }
            }
        }
        return false;
    }
    function configure(value, options) {
        if (typeof options === 'object') {
            if (value instanceof Extension) {
                Object.assign(value.options, options);
                return true;
            }
            else if (isString(value)) {
                if (main) {
                    value = value.trim();
                    const ext = main.extensionManager.retrieve(value) || Array.from(extensionsAsync).find(item => item.name === value);
                    if (ext) {
                        Object.assign(ext.options, options);
                        return true;
                    }
                    else {
                        optionsAsync.set(value, options);
                        if (exports.settings.handleExtensionsAsync) {
                            return true;
                        }
                    }
                }
            }
        }
        return false;
    }
    function ext(value, options) {
        if (value instanceof Extension) {
            return include(value);
        }
        else if (isString(value)) {
            value = value.trim();
            if (typeof options === 'object') {
                return configure(value, options);
            }
            else {
                return retrieve(value);
            }
        }
        return false;
    }
    function retrieve(value) {
        return main && main.extensionManager.retrieve(value);
    }
    function ready() {
        return main && !main.initialized && !main.closed;
    }
    function close() {
        if (main && !main.initialized && main.size) {
            main.finalize();
        }
    }
    function reset() {
        if (main) {
            main.reset();
        }
    }
    function saveAllToDisk() {
        if (main && !main.initialized && main.size) {
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
            Application,
            Container,
            Controller,
            Extension,
            ExtensionManager,
            File,
            Layout,
            Node,
            NodeGroup,
            NodeList,
            Resource,
            Svg,
            SvgAnimate,
            SvgAnimateMotion,
            SvgAnimateTransform,
            SvgAnimation,
            SvgBuild,
            SvgElement,
            SvgGroup,
            SvgGroupViewBox,
            SvgImage,
            SvgPath,
            SvgUse
        },
        extensions: {
            Accessibility,
            CssGrid,
            External,
            Flexbox,
            Grid,
            List,
            Relative,
            Sprite,
            Substitute,
            Table,
            VerticalAlign,
            WhiteSpace
        },
        color,
        constant,
        dom,
        enumeration,
        svg,
        util,
        xml,
    };

    exports.close = close;
    exports.configure = configure;
    exports.exclude = exclude;
    exports.ext = ext;
    exports.include = include;
    exports.includeAsync = includeAsync;
    exports.lib = lib;
    exports.parseDocument = parseDocument;
    exports.ready = ready;
    exports.reset = reset;
    exports.retrieve = retrieve;
    exports.saveAllToDisk = saveAllToDisk;
    exports.setFramework = setFramework;
    exports.toString = toString;

    Object.defineProperty(exports, '__esModule', { value: true });

}));
