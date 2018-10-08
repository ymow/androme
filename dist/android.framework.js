/* androme 1.10.1
   https://github.com/anpham6/androme */

var android = (function () {
    'use strict';

    var BUILD_ANDROID;
    (function (BUILD_ANDROID) {
        BUILD_ANDROID[BUILD_ANDROID["PIE"] = 28] = "PIE";
        BUILD_ANDROID[BUILD_ANDROID["OREO_1"] = 27] = "OREO_1";
        BUILD_ANDROID[BUILD_ANDROID["OREO"] = 26] = "OREO";
        BUILD_ANDROID[BUILD_ANDROID["NOUGAT_1"] = 25] = "NOUGAT_1";
        BUILD_ANDROID[BUILD_ANDROID["NOUGAT"] = 24] = "NOUGAT";
        BUILD_ANDROID[BUILD_ANDROID["MARSHMALLOW"] = 23] = "MARSHMALLOW";
        BUILD_ANDROID[BUILD_ANDROID["LOLLIPOP_1"] = 22] = "LOLLIPOP_1";
        BUILD_ANDROID[BUILD_ANDROID["LOLLIPOP"] = 21] = "LOLLIPOP";
        BUILD_ANDROID[BUILD_ANDROID["KITKAT_1"] = 20] = "KITKAT_1";
        BUILD_ANDROID[BUILD_ANDROID["KITKAT"] = 19] = "KITKAT";
        BUILD_ANDROID[BUILD_ANDROID["JELLYBEAN_2"] = 18] = "JELLYBEAN_2";
        BUILD_ANDROID[BUILD_ANDROID["JELLYBEAN_1"] = 17] = "JELLYBEAN_1";
        BUILD_ANDROID[BUILD_ANDROID["JELLYBEAN"] = 16] = "JELLYBEAN";
        BUILD_ANDROID[BUILD_ANDROID["ICE_CREAM_SANDWICH_1"] = 15] = "ICE_CREAM_SANDWICH_1";
        BUILD_ANDROID[BUILD_ANDROID["ICE_CREAM_SANDWICH"] = 14] = "ICE_CREAM_SANDWICH";
        BUILD_ANDROID[BUILD_ANDROID["ALL"] = 0] = "ALL";
        BUILD_ANDROID[BUILD_ANDROID["LATEST"] = 28] = "LATEST";
    })(BUILD_ANDROID || (BUILD_ANDROID = {}));
    var DENSITY_ANDROID;
    (function (DENSITY_ANDROID) {
        DENSITY_ANDROID[DENSITY_ANDROID["LDPI"] = 120] = "LDPI";
        DENSITY_ANDROID[DENSITY_ANDROID["MDPI"] = 160] = "MDPI";
        DENSITY_ANDROID[DENSITY_ANDROID["HDPI"] = 240] = "HDPI";
        DENSITY_ANDROID[DENSITY_ANDROID["XHDPI"] = 320] = "XHDPI";
        DENSITY_ANDROID[DENSITY_ANDROID["XXHDPI"] = 480] = "XXHDPI";
        DENSITY_ANDROID[DENSITY_ANDROID["XXXHDPI"] = 640] = "XXXHDPI";
    })(DENSITY_ANDROID || (DENSITY_ANDROID = {}));
    const NODE_ANDROID = {
        CHECKBOX: 'CheckBox',
        RADIO: 'RadioButton',
        EDIT: 'EditText',
        SELECT: 'Spinner',
        RANGE: 'SeekBar',
        TEXT: 'TextView',
        IMAGE: 'ImageView',
        BUTTON: 'Button',
        LINE: 'View',
        SPACE: 'Space',
        WEB_VIEW: 'WebView',
        FRAME: 'FrameLayout',
        LINEAR: 'LinearLayout',
        RADIO_GROUP: 'RadioGroup',
        GRID: 'android.support.v7.widget.GridLayout',
        RELATIVE: 'RelativeLayout',
        CONSTRAINT: 'android.support.constraint.ConstraintLayout',
        SCROLL_HORIZONTAL: 'HorizontalScrollView',
        SCROLL_VERTICAL: 'android.support.v4.widget.NestedScrollView',
        GUIDELINE: 'android.support.constraint.Guideline'
    };
    const BOX_ANDROID = {
        MARGIN: 'layout_margin',
        MARGIN_VERTICAL: 'layout_marginVertical',
        MARGIN_HORIZONTAL: 'layout_marginHorizontal',
        MARGIN_TOP: 'layout_marginTop',
        MARGIN_RIGHT: 'layout_marginRight',
        MARGIN_BOTTOM: 'layout_marginBottom',
        MARGIN_LEFT: 'layout_marginLeft',
        PADDING: 'padding',
        PADDING_VERTICAL: 'paddingVertical',
        PADDING_HORIZONTAL: 'paddingHorizontal',
        PADDING_TOP: 'paddingTop',
        PADDING_RIGHT: 'paddingRight',
        PADDING_BOTTOM: 'paddingBottom',
        PADDING_LEFT: 'paddingLeft'
    };
    const AXIS_ANDROID = {
        HORIZONTAL: 'horizontal',
        VERTICAL: 'vertical'
    };
    const XMLNS_ANDROID = {
        'android': 'http://schemas.android.com/apk/res/android',
        'app': 'http://schemas.android.com/apk/res-auto',
        'tools': 'http://schemas.android.com/tools'
    };
    const FONT_ANDROID = {
        'sans-serif': BUILD_ANDROID.ICE_CREAM_SANDWICH,
        'sans-serif-thin': BUILD_ANDROID.JELLYBEAN,
        'sans-serif-light': BUILD_ANDROID.JELLYBEAN,
        'sans-serif-condensed': BUILD_ANDROID.JELLYBEAN,
        'sans-serif-condensed-light': BUILD_ANDROID.JELLYBEAN,
        'sans-serif-medium': BUILD_ANDROID.LOLLIPOP,
        'sans-serif-black': BUILD_ANDROID.LOLLIPOP,
        'sans-serif-smallcaps': BUILD_ANDROID.LOLLIPOP,
        'serif-monospace': BUILD_ANDROID.LOLLIPOP,
        'serif': BUILD_ANDROID.LOLLIPOP,
        'casual': BUILD_ANDROID.LOLLIPOP,
        'cursive': BUILD_ANDROID.LOLLIPOP,
        'monospace': BUILD_ANDROID.LOLLIPOP,
        'sans-serif-condensed-medium': BUILD_ANDROID.OREO
    };
    const FONTALIAS_ANDROID = {
        'arial': 'sans-serif',
        'helvetica': 'sans-serif',
        'tahoma': 'sans-serif',
        'verdana': 'sans-serif',
        'times': 'serif',
        'times new roman': 'serif',
        'palatino': 'serif',
        'georgia': 'serif',
        'baskerville': 'serif',
        'goudy': 'serif',
        'fantasy': 'serif',
        'itc stone serif': 'serif',
        'sans-serif-monospace': 'monospace',
        'monaco': 'monospace',
        'courier': 'serif-monospace',
        'courier new': 'serif-monospace'
    };
    const FONTREPLACE_ANDROID = {
        'ms shell dlg \\32': 'sans-serif',
        'system-ui': 'sans-serif',
        '-apple-system': 'sans-serif'
    };
    const FONTWEIGHT_ANDROID = {
        '100': 'thin',
        '200': 'extra_light',
        '300': 'light',
        '400': 'normal',
        '500': 'medium',
        '600': 'semi_bold',
        '700': 'bold',
        '800': 'extra_bold',
        '900': 'black'
    };
    const WEBVIEW_ANDROID = [
        'STRONG',
        'B',
        'EM',
        'CITE',
        'DFN',
        'I',
        'BIG',
        'SMALL',
        'FONT',
        'BLOCKQUOTE',
        'TT',
        'A',
        'U',
        'SUP',
        'SUB',
        'STRIKE',
        'H1',
        'H2',
        'H3',
        'H4',
        'H5',
        'H6',
        'DEL',
        'LABEL',
        'BR',
        'PLAINTEXT'
    ];
    const RESERVED_JAVA = [
        'abstract',
        'assert',
        'boolean',
        'break',
        'byte',
        'case',
        'catch',
        'char',
        'class',
        'const',
        'continue',
        'default',
        'double',
        'do',
        'else',
        'enum',
        'extends',
        'false',
        'final',
        'finally',
        'float',
        'for',
        'goto',
        'if',
        'implements',
        'import',
        'instanceof',
        'int',
        'interface',
        'long',
        'native',
        'new',
        'null',
        'package',
        'private',
        'protected',
        'public',
        'return',
        'short',
        'static',
        'strictfp',
        'super',
        'switch',
        'synchronized',
        'this',
        'throw',
        'throws',
        'transient',
        'true',
        'try',
        'void',
        'volatile',
        'while'
    ];

    const API_ANDROID = {
        [BUILD_ANDROID.PIE]: {
            android: [],
            app: [],
            customizations: {}
        },
        [BUILD_ANDROID.OREO_1]: {
            android: [],
            app: [],
            customizations: {}
        },
        [BUILD_ANDROID.OREO]: {
            android: ['fontWeight', 'layout_marginHorizontal', 'layout_marginVertical', 'paddingHorizontal', 'paddingVertical'],
            app: [],
            customizations: {}
        },
        [BUILD_ANDROID.NOUGAT_1]: {
            android: [],
            app: [],
            customizations: {}
        },
        [BUILD_ANDROID.NOUGAT]: {
            android: [],
            app: [],
            customizations: {}
        },
        [BUILD_ANDROID.MARSHMALLOW]: {
            android: [],
            app: [],
            customizations: {}
        },
        [BUILD_ANDROID.LOLLIPOP_1]: {
            android: [],
            app: [],
            customizations: {}
        },
        [BUILD_ANDROID.LOLLIPOP]: {
            android: ['layout_columnWeight'],
            app: [],
            customizations: {}
        },
        [BUILD_ANDROID.KITKAT_1]: {
            android: [],
            app: [],
            customizations: {}
        },
        [BUILD_ANDROID.KITKAT]: {
            android: [],
            app: [],
            customizations: {}
        },
        [BUILD_ANDROID.JELLYBEAN_2]: {
            android: [],
            app: [],
            customizations: {}
        },
        [BUILD_ANDROID.JELLYBEAN_1]: {
            android: ['labelFor'],
            app: [],
            customizations: {}
        },
        [BUILD_ANDROID.JELLYBEAN]: {
            android: [],
            app: [],
            customizations: {}
        },
        [BUILD_ANDROID.ICE_CREAM_SANDWICH_1]: {
            android: [],
            app: [],
            customizations: {}
        },
        [BUILD_ANDROID.ICE_CREAM_SANDWICH]: {
            android: [],
            app: [],
            customizations: {}
        },
        [BUILD_ANDROID.ALL]: {
            android: [],
            app: [],
            customizations: {
                SUB: {
                    android: {
                        layout_marginTop: '6px'
                    }
                },
                SUP: {
                    android: {
                        layout_marginTop: '-4px'
                    }
                },
                Button: {
                    android: {
                        textAllCaps: 'false'
                    }
                }
            }
        }
    };

    let ID;
    function resetId() {
        ID = {
            android: ['parent']
        };
    }
    function generateId(section, name) {
        let prefix = name;
        let i = 1;
        const match = name.match(/^(\w+)_([0-9]+)$/);
        if (match) {
            prefix = match[1];
            i = parseInt(match[2]);
        }
        if (ID[section] == null) {
            ID[section] = [];
        }
        do {
            if (!ID[section].includes(name)) {
                ID[section].push(name);
                break;
            }
            else {
                name = `${prefix}_${i++}`;
            }
        } while (true);
        return name;
    }
    function stripId(value) {
        return value ? value.replace(/@\+?id\//, '') : '';
    }
    function convertDP(value, dpi = 160, font = false) {
        if (value) {
            value = parseFloat(value);
            if (!isNaN(value)) {
                value /= (dpi / 160);
                value = value >= 1 || value === 0 ? Math.floor(value) : value.toFixed(2);
                return value + (font ? 'sp' : 'dp');
            }
        }
        return '0dp';
    }
    function delimitDimens(nodeName, attr, size, { dimensResourceValue = true }) {
        return dimensResourceValue ? `{%${nodeName.toLowerCase()},${attr},${size}}` : size;
    }
    function replaceUnit(value, { density = 160, convertPixels = 'dp' }, font = false) {
        switch (convertPixels) {
            case 'dp':
                return value.replace(/("|>)(-)?([0-9]+(?:\.[0-9]+)?px)("|<)/g, (match, ...capture) => capture[0] + (capture[1] || '') + convertDP(capture[2], density, font) + capture[3]);
            default:
                return value;
        }
    }
    function calculateBias(start, end, accurracy) {
        return (parseFloat(Math.max(start === 0 ? 0
            : (end === 0 ? 1 : (start / (start + end))), 0)
            .toFixed(accurracy)));
    }
    function parseRTL(value, { supportRTL = true, targetAPI = BUILD_ANDROID.JELLYBEAN_1 }) {
        if (supportRTL && targetAPI >= BUILD_ANDROID.JELLYBEAN_1) {
            value = value.replace(/left/g, 'start').replace(/right/g, 'end');
            value = value.replace(/Left/g, 'Start').replace(/Right/g, 'End');
        }
        return value;
    }

    var $enum = androme.lib.enumeration;
    var $const = androme.lib.constant;
    var $util = androme.lib.util;
    var $dom = androme.lib.dom;
    var $nodelist = androme.lib.base.NodeList;
    var ViewBase = (Base) => {
        return class View extends Base {
            constructor(id = 0, element) {
                super(id, element);
                this.api = 0;
                this.children = [];
                this.renderChildren = [];
                this._namespaces = new Set(['android', 'app']);
                this._boxAdjustment = $dom.getBoxModel();
                this._boxReset = $dom.getBoxModel();
                this._android = {};
                this._app = {};
                this.constraint = { current: {} };
            }
            static documentBody() {
                if (View._documentBody == null) {
                    const body = new View(0, document.body);
                    body.hide();
                    body.setBounds();
                    View._documentBody = body;
                }
                return View._documentBody;
            }
            static getCustomizationValue(api, tagName, obj, attr) {
                for (const build of [API_ANDROID[api], API_ANDROID[0]]) {
                    if (build && build.customizations && build.customizations[tagName] && build.customizations[tagName][obj] && $util.isString(build.customizations[tagName][obj][attr])) {
                        return build.customizations[tagName][obj][attr];
                    }
                }
                return '';
            }
            static getControlName(nodeType) {
                return NODE_ANDROID[$enum.NODE_STANDARD[nodeType]];
            }
            attr(obj, attr, value = '', overwrite = true) {
                if (!this.supported(obj, attr)) {
                    return '';
                }
                return super.attr(obj, attr, value, overwrite);
            }
            android(attr, value = '', overwrite = true) {
                this.attr('android', attr, value, overwrite);
                return this._android[attr] || '';
            }
            app(attr, value = '', overwrite = true) {
                this.attr('app', attr, value, overwrite);
                return this._app[attr] || '';
            }
            apply(options = {}) {
                const local = Object.assign({}, options);
                super.apply(local);
                for (const obj in local) {
                    this.formatted(`${obj}="${local[obj]}"`);
                }
            }
            formatted(value, overwrite = true) {
                const match = value.match(/^(?:([a-z]+):)?(\w+)="((?:@+?[a-z]+\/)?.+)"$/);
                if (match) {
                    this.attr(match[1] || '_', match[2], match[3], overwrite);
                }
            }
            anchor(position, adjacent, orientation, overwrite) {
                if (arguments.length === 1 ||
                    this.constraint.current[position] == null ||
                    !this.constraint.current[position].overwrite ||
                    (orientation && !this.constraint[orientation])) {
                    if (overwrite == null) {
                        overwrite = adjacent === 'parent' || adjacent === 'true';
                    }
                    this[this.renderParent.controlName === NODE_ANDROID.RELATIVE ? 'android' : 'app'](position, adjacent, overwrite);
                    if (orientation) {
                        this.constraint[orientation] = true;
                    }
                    this.constraint.current[position] = { adjacent, orientation, overwrite };
                }
            }
            alignParent(position, settings) {
                if (this.renderParent.is($enum.NODE_STANDARD.CONSTRAINT, $enum.NODE_STANDARD.RELATIVE)) {
                    const constraint = this.renderParent.controlName === NODE_ANDROID.CONSTRAINT;
                    const direction = $util.capitalize(parseRTL(position, settings));
                    const attr = constraint ? `layout_constraint${direction}_to${direction}Of` : `layout_alignParent${direction}`;
                    return this[constraint ? 'app' : 'android'](attr) === (constraint ? 'parent' : 'true');
                }
                return false;
            }
            horizontalBias({ constraintPercentAccuracy = 4 }) {
                const parent = this.documentParent;
                if (parent !== this) {
                    const left = Math.max(0, this.linear.left - parent.box.left);
                    const right = Math.max(0, parent.box.right - this.linear.right);
                    return calculateBias(left, right, constraintPercentAccuracy);
                }
                return 0.5;
            }
            verticalBias({ constraintPercentAccuracy = 4 }) {
                const parent = this.documentParent;
                if (parent !== this) {
                    const top = Math.max(0, this.linear.top - parent.box.top);
                    const bottom = Math.max(0, parent.box.bottom - this.linear.bottom);
                    return calculateBias(top, bottom, constraintPercentAccuracy);
                }
                return 0.5;
            }
            modifyBox(region, offset, negative = false) {
                const name = typeof region === 'number' ? $util.convertEnum(region, $enum.BOX_STANDARD, BOX_ANDROID) : '';
                if (offset !== 0 && (name !== '' || $util.isString(region))) {
                    const attr = $util.isString(region) ? region : name.replace('layout_', '');
                    if (this._boxReset[attr] != null) {
                        if (offset == null) {
                            this._boxReset[attr] = 1;
                        }
                        else {
                            this._boxAdjustment[attr] += offset;
                            if (!negative) {
                                this._boxAdjustment[attr] = Math.max(0, this._boxAdjustment[attr]);
                            }
                        }
                    }
                }
            }
            valueBox(region) {
                const name = $util.convertEnum(region, $enum.BOX_STANDARD, BOX_ANDROID);
                if (name !== '') {
                    const attr = name.replace('layout_', '');
                    return [this._boxReset[attr] || 0, this._boxAdjustment[attr] || 0];
                }
                return [0, 0];
            }
            supported(obj, attr) {
                if (this.api > 0) {
                    for (let i = this.api + 1; i <= BUILD_ANDROID.LATEST; i++) {
                        const version = API_ANDROID[i];
                        if (version && version[obj] && version[obj].includes(attr)) {
                            return false;
                        }
                    }
                }
                return true;
            }
            combine(...objs) {
                const result = [];
                for (const value of this._namespaces.values()) {
                    const obj = this[`_${value}`];
                    if (objs.length === 0 || objs.includes(value)) {
                        for (const attr in obj) {
                            if (value !== '_') {
                                result.push(`${value}:${attr}="${obj[attr]}"`);
                            }
                            else {
                                result.push(`${attr}="${obj[attr]}"`);
                            }
                        }
                    }
                }
                return (result.sort((a, b) => {
                    if (a.startsWith('android:id=')) {
                        return -1;
                    }
                    else if (b.startsWith('android:id=')) {
                        return 1;
                    }
                    else {
                        return a > b ? 1 : -1;
                    }
                }));
            }
            clone(id, children = false) {
                const node = new View(id || this.id, this.element);
                node.api = this.api;
                node.nodeId = this.nodeId;
                node.nodeType = this.nodeType;
                node.controlName = this.controlName;
                node.alignmentType = this.alignmentType;
                node.depth = this.depth;
                node.rendered = this.rendered;
                node.renderDepth = this.renderDepth;
                node.renderParent = this.renderParent;
                node.renderExtension = this.renderExtension;
                node.documentRoot = this.documentRoot;
                node.documentParent = this.documentParent;
                if (children) {
                    node.children = this.children.slice();
                }
                node.inherit(this, 'initial', 'base', 'style', 'styleMap');
                return node;
            }
            setNodeType(nodeName) {
                for (const type in NODE_ANDROID) {
                    if (NODE_ANDROID[type] === nodeName && $enum.NODE_STANDARD[type] != null) {
                        this.nodeType = $enum.NODE_STANDARD[type];
                        break;
                    }
                }
                this.controlName = nodeName;
                if (this.android('id') !== '') {
                    this.nodeId = stripId(this.android('id'));
                }
                if (!this.nodeId) {
                    const element = this.element;
                    let name = $util.trimNull(element.id || element.name);
                    if (RESERVED_JAVA.includes(name)) {
                        name += '_1';
                    }
                    this.nodeId = $util.convertWord(generateId('android', (name || `${$util.lastIndexOf(this.controlName, '.').toLowerCase()}_1`)));
                    this.android('id', this.stringId);
                }
            }
            setLayout() {
                if (this.nodeType >= $enum.NODE_STANDARD.SCROLL_HORIZONTAL) {
                    this.android('layout_width', this.nodeType === $enum.NODE_STANDARD.SCROLL_HORIZONTAL && this.has('width', $enum.CSS_STANDARD.UNIT) ? this.css('width') : 'wrap_content');
                    this.android('layout_height', this.nodeType === $enum.NODE_STANDARD.SCROLL_VERTICAL && this.has('height', $enum.CSS_STANDARD.UNIT) ? this.css('height') : 'wrap_content');
                }
                else if (this.renderParent.nodeType >= $enum.NODE_STANDARD.SCROLL_HORIZONTAL) {
                    if (this.renderParent.is($enum.NODE_STANDARD.SCROLL_HORIZONTAL)) {
                        this.android('layout_width', 'wrap_content', false);
                        this.android('layout_height', 'match_parent', false);
                    }
                    else {
                        this.android('layout_width', 'match_parent', false);
                        this.android('layout_height', 'wrap_content', false);
                    }
                }
                else {
                    const parent = this.documentParent;
                    const renderParent = this.renderParent;
                    const renderChildren = this.renderChildren;
                    const width = this.linear ? this.linear.width
                        : (this.hasElement ? this.element.clientWidth + this.borderLeftWidth + this.borderRightWidth + this.marginLeft + this.marginRight : 0);
                    const height = this.linear ? this.linear.height
                        : (this.hasElement ? this.element.clientHeight + this.borderTopWidth + this.borderBottomWidth + this.marginTop + this.marginBottom : 0);
                    const widthParent = parent.initial.box ? parent.initial.box.width
                        : (parent.element instanceof HTMLElement ? parent.element.offsetWidth - (parent.paddingLeft + parent.paddingRight + parent.borderLeftWidth + parent.borderRightWidth) : 0);
                    const heightParent = parent.initial.box ? parent.initial.box.height
                        : (parent.element instanceof HTMLElement ? parent.element.offsetHeight - (parent.paddingTop + parent.paddingBottom + parent.borderTopWidth + parent.borderBottomWidth) : 0);
                    const styleMap = this.styleMap;
                    const constraint = this.constraint;
                    const tableElement = this.tagName === 'TABLE';
                    if (this.documentBody || (this.documentRoot && !this.flex.enabled && this.is($enum.NODE_STANDARD.FRAME, $enum.NODE_STANDARD.CONSTRAINT, $enum.NODE_STANDARD.RELATIVE))) {
                        if (!this.hasWidth &&
                            this.block &&
                            !constraint.layoutHorizontal) {
                            this.android('layout_width', 'match_parent', false);
                        }
                        if (!this.hasHeight &&
                            this.cascade().some(node => !node.pageflow) &&
                            !constraint.layoutHeight &&
                            !constraint.layoutVertical) {
                            this.android('layout_height', 'match_parent', false);
                        }
                    }
                    if (this.of($enum.NODE_STANDARD.GRID, $enum.NODE_ALIGNMENT.PERCENT)) {
                        this.android('layout_width', 'match_parent');
                    }
                    else {
                        if (this.android('layout_width') !== '0px') {
                            if (this.toInt('width') > 0 && (!this.inlineStatic ||
                                renderParent.is($enum.NODE_STANDARD.GRID) ||
                                !this.has('width', 0, { map: 'initial' }))) {
                                if (this.has('width', $enum.CSS_STANDARD.PERCENT)) {
                                    if (styleMap.width === '100%') {
                                        this.android('layout_width', 'match_parent', false);
                                    }
                                    else if (renderParent.of($enum.NODE_STANDARD.GRID, $enum.NODE_ALIGNMENT.PERCENT)) {
                                        this.android('layout_width', '0px');
                                        this.app('layout_columnWeight', (parseInt(styleMap.width) / 100).toFixed(2));
                                    }
                                    else {
                                        const widthPercent = Math.ceil(this.bounds.width) - (!tableElement ? this.paddingLeft + this.paddingRight + this.borderLeftWidth + this.borderRightWidth : 0);
                                        this.android('layout_width', $util.formatPX(widthPercent), false);
                                    }
                                }
                                else {
                                    this.android('layout_width', $util.convertInt(parent.android('layout_width')) > 0 && parent.viewWidth > 0 && this.viewWidth >= parent.viewWidth ? 'match_parent' : styleMap.width, renderParent.tagName !== 'TABLE');
                                }
                            }
                            if (constraint.layoutWidth) {
                                if (constraint.layoutHorizontal) {
                                    this.android('layout_width', parent.hasWidth ? 'match_parent' : 'wrap_content', false);
                                }
                                else {
                                    this.android('layout_width', this.bounds.width >= widthParent ? 'match_parent' : $util.formatPX(this.bounds.width), false);
                                }
                            }
                            if (this.has('minWidth', $enum.CSS_STANDARD.UNIT)) {
                                this.android('layout_width', 'wrap_content', false);
                                this.android('minWidth', styleMap.minWidth, false);
                            }
                            if (!this.documentBody &&
                                this.has('maxWidth', $enum.CSS_STANDARD.UNIT) &&
                                this.layoutVertical) {
                                const maxWidth = this.css('maxWidth');
                                for (const node of renderChildren) {
                                    if (node.is($enum.NODE_STANDARD.TEXT) && !node.has('maxWidth')) {
                                        node.android('maxWidth', maxWidth);
                                    }
                                }
                            }
                        }
                        if (this.android('layout_width') === '') {
                            const widthDefined = renderChildren.filter(node => !node.autoMargin && node.has('width', $enum.CSS_STANDARD.UNIT, { map: 'initial' }));
                            if ($util.convertFloat(this.app('layout_columnWeight')) > 0) {
                                this.android('layout_width', '0px');
                            }
                            else if (widthDefined.length > 0 &&
                                widthDefined.some(node => node.bounds.width >= this.box.width)) {
                                this.android('layout_width', 'wrap_content');
                            }
                            else if ((this.blockStatic && this.hasAlign($enum.NODE_ALIGNMENT.VERTICAL)) ||
                                (!this.documentRoot && renderChildren.some(node => node.hasAlign($enum.NODE_ALIGNMENT.VERTICAL) && !node.has('width')))) {
                                this.android('layout_width', 'match_parent');
                            }
                            else {
                                const inlineRight = Math.max.apply(null, renderChildren.filter(node => node.inlineElement && node.float !== 'right').map(node => node.linear.right)) || 0;
                                const wrap = (this.nodeType < $enum.NODE_STANDARD.INLINE ||
                                    this.inlineElement ||
                                    !this.pageflow ||
                                    !this.siblingflow ||
                                    this.display === 'table' ||
                                    parent.flex.enabled ||
                                    (renderParent.inlineElement && !renderParent.hasWidth && !this.inlineElement && this.nodeType > $enum.NODE_STANDARD.BLOCK) ||
                                    renderParent.is($enum.NODE_STANDARD.GRID));
                                if (this.is($enum.NODE_STANDARD.GRID) && $util.withinFraction(inlineRight, this.box.right)) {
                                    this.android('layout_width', 'wrap_content');
                                }
                                else if (!wrap || (this.blockStatic && !this.has('maxWidth'))) {
                                    const previousSibling = this.previousSibling();
                                    const nextSibling = this.nextSibling();
                                    if (width >= widthParent ||
                                        (this.linearVertical && !this.floating && !this.autoMargin) ||
                                        (this.hasElement && this.blockStatic && (this.documentParent.documentBody ||
                                            this.ascend().every(node => node.blockStatic) ||
                                            (this.documentParent.blockStatic && this.nodeType <= $enum.NODE_STANDARD.LINEAR && ((!previousSibling || !previousSibling.floating) && (!nextSibling || !nextSibling.floating))))) ||
                                        (this.is($enum.NODE_STANDARD.FRAME) && renderChildren.some(node => node.blockStatic && (node.autoMarginHorizontal || node.autoMarginLeft))) ||
                                        (!this.hasElement && this.length > 0 && renderChildren.some(item => item.linear.width >= this.documentParent.box.width) && !renderChildren.some(item => item.plainText && item.multiLine))) {
                                        this.android('layout_width', 'match_parent');
                                    }
                                }
                                this.android('layout_width', 'wrap_content', false);
                            }
                        }
                    }
                    if (this.android('layout_height') !== '0px') {
                        if (this.toInt('height') > 0 && (!this.inlineStatic || !this.has('height', 0, { map: 'initial' }))) {
                            if (this.has('height', $enum.CSS_STANDARD.PERCENT)) {
                                if (styleMap.height === '100%') {
                                    this.android('layout_height', 'match_parent', false);
                                }
                                else {
                                    let heightPercent = Math.ceil(this.bounds.height);
                                    if (!tableElement) {
                                        heightPercent -= this.paddingTop + this.paddingBottom + this.borderTopWidth + this.borderBottomWidth;
                                    }
                                    this.android('layout_height', $util.formatPX(heightPercent), false);
                                }
                            }
                            else {
                                this.android('layout_height', this.css('overflow') === 'hidden' && this.toInt('height') < this.box.height ? 'wrap_content' : styleMap.height);
                            }
                        }
                        if (constraint.layoutHeight) {
                            if (constraint.layoutVertical) {
                                this.android('layout_height', 'wrap_content', false);
                            }
                            else if (this.documentRoot) {
                                const bottomHeight = Math.max.apply(null, renderChildren.filter(node => node.pageflow).map(node => node.linear.bottom)) || 0;
                                this.android('layout_height', bottomHeight > 0 ? $util.formatPX(bottomHeight + this.paddingBottom + this.borderBottomWidth) : 'match_parent', false);
                            }
                            else {
                                this.android('layout_height', this.actualHeight < heightParent ? $util.formatPX(this.actualHeight) : 'match_parent', false);
                            }
                        }
                        if (this.has('minHeight', $enum.CSS_STANDARD.UNIT)) {
                            this.android('layout_height', 'wrap_content', false);
                            this.android('minHeight', styleMap.minHeight, false);
                        }
                        if (!this.documentBody &&
                            this.has('maxHeight', $enum.CSS_STANDARD.UNIT) &&
                            this.layoutHorizontal) {
                            const maxHeight = this.css('maxHeight');
                            for (const node of renderChildren) {
                                if (node.is($enum.NODE_STANDARD.TEXT) && !node.has('maxWidth')) {
                                    node.android('maxWidth', maxHeight);
                                }
                            }
                        }
                    }
                    if (this.android('layout_height') === '') {
                        if (height >= heightParent &&
                            parent.hasHeight &&
                            !(this.inlineElement && this.nodeType < $enum.NODE_STANDARD.INLINE) &&
                            !(renderParent.is($enum.NODE_STANDARD.RELATIVE) && renderParent.inlineHeight)) {
                            this.android('layout_height', 'match_parent');
                        }
                        else {
                            if (this.lineHeight > 0 &&
                                !this.plainText &&
                                !renderParent.linearHorizontal) {
                                const boundsHeight = this.actualHeight + renderParent.paddingTop + renderParent.paddingBottom;
                                if (this.inlineElement && boundsHeight > 0 && this.lineHeight >= boundsHeight) {
                                    this.android('layout_height', $util.formatPX(boundsHeight));
                                    this.modifyBox($enum.BOX_STANDARD.PADDING_TOP, null);
                                    this.modifyBox($enum.BOX_STANDARD.PADDING_BOTTOM, null);
                                }
                                else if (this.block &&
                                    this.box.height > 0 &&
                                    this.lineHeight === this.box.height) {
                                    this.android('layout_height', $util.formatPX(boundsHeight));
                                }
                            }
                            this.android('layout_height', 'wrap_content', false);
                        }
                    }
                }
                if (this.cssParent('visibility', true) === 'hidden') {
                    this.android('visibility', 'invisible');
                }
            }
            setAlignment(settings) {
                const renderParent = this.renderParent;
                const textAlignParent = this.cssParent('textAlign');
                const obj = renderParent.is($enum.NODE_STANDARD.GRID) ? 'app' : 'android';
                const left = parseRTL('left', settings);
                const right = parseRTL('right', settings);
                let textAlign = this.styleMap.textAlign || '';
                let verticalAlign = '';
                let floating = '';
                function mergeGravity(original, ...alignment) {
                    const direction = [
                        ...$util.trimNull(original).split('|'),
                        ...alignment
                    ]
                        .filter(value => value);
                    switch (direction.length) {
                        case 0:
                            return '';
                        case 1:
                            return direction[0];
                        default:
                            let x = '';
                            let y = '';
                            let z = '';
                            for (let i = 0; i < direction.length; i++) {
                                const value = direction[i];
                                switch (value) {
                                    case 'center':
                                        x = 'center_horizontal';
                                        y = 'center_vertical';
                                        break;
                                    case 'left':
                                    case 'start':
                                    case 'right':
                                    case 'end':
                                    case 'center_horizontal':
                                        x = value;
                                        break;
                                    case 'top':
                                    case 'bottom':
                                    case 'center_vertical':
                                        y = value;
                                        break;
                                    default:
                                        z += (z !== '' ? '|' : '') + value;
                                        break;
                                }
                            }
                            const gravity = [x, y].filter(value => value);
                            const merged = gravity.filter(value => value.indexOf('center') !== -1).length === 2 ? 'center' : gravity.join('|');
                            return (merged !== '' ? z !== '' ? `${merged}|${z}` : merged
                                : z);
                    }
                }
                function setAutoMargin(node) {
                    if (!node.blockWidth) {
                        const alignment = [];
                        const marginLeft = node.css('marginLeft') === 'auto';
                        const marginRight = node.css('marginRight') === 'auto';
                        const marginTop = node.css('marginTop') === 'auto';
                        const marginBottom = node.css('marginBottom') === 'auto';
                        if (marginLeft && marginRight) {
                            alignment.push('center_horizontal');
                        }
                        else if (marginLeft && !marginRight) {
                            alignment.push(right);
                        }
                        else if (!marginLeft && marginRight) {
                            alignment.push(left);
                        }
                        if (marginTop && marginBottom) {
                            alignment.push('center_vertical');
                        }
                        else if (marginTop && !marginBottom) {
                            alignment.push('bottom');
                        }
                        else if (!marginTop && marginBottom) {
                            alignment.push('top');
                        }
                        if (alignment.length > 0) {
                            const gravity = node.blockWidth ? 'gravity' : 'layout_gravity';
                            node[obj](gravity, mergeGravity(node[obj](gravity), ...alignment));
                            return true;
                        }
                    }
                    return false;
                }
                function convertHorizontal(value) {
                    switch (value) {
                        case 'left':
                        case 'start':
                            return left;
                        case 'right':
                        case 'end':
                            return right;
                        case 'center':
                            return 'center_horizontal';
                        default:
                            return '';
                    }
                }
                function setTextAlign(value) {
                    if (textAlign === '' || value === right) {
                        return value;
                    }
                    return textAlign;
                }
                if (!(this.floating || renderParent.of($enum.NODE_STANDARD.RELATIVE, $enum.NODE_ALIGNMENT.MULTILINE))) {
                    switch (this.styleMap.verticalAlign) {
                        case 'top':
                        case 'text-top':
                            verticalAlign = 'top';
                            if (renderParent.linearHorizontal && this.inlineHeight) {
                                this.android('layout_height', 'match_parent');
                            }
                            break;
                        case 'middle':
                            if (this.inline ||
                                this.documentParent.css('display') === 'table-cell' ||
                                (this.inlineStatic && this.documentParent.lineHeight > 0)) {
                                verticalAlign = 'center_vertical';
                            }
                            break;
                        case 'bottom':
                        case 'text-bottom':
                            verticalAlign = 'bottom';
                            break;
                    }
                }
                if (verticalAlign === '' &&
                    this.lineHeight > 0 &&
                    !this.blockHeight) {
                    verticalAlign = 'center_vertical';
                }
                if (renderParent.linearVertical || (this.documentRoot && this.linearVertical)) {
                    if (this.float === 'right') {
                        this[obj]('layout_gravity', right);
                    }
                    else {
                        setAutoMargin(this);
                    }
                }
                if (this.hasAlign($enum.NODE_ALIGNMENT.FLOAT)) {
                    if (this.hasAlign($enum.NODE_ALIGNMENT.RIGHT) || this.renderChildren.some(node => node.hasAlign($enum.NODE_ALIGNMENT.RIGHT))) {
                        floating = right;
                    }
                    else if (this.hasAlign($enum.NODE_ALIGNMENT.LEFT) || this.renderChildren.some(node => node.hasAlign($enum.NODE_ALIGNMENT.LEFT))) {
                        floating = left;
                    }
                }
                if (renderParent.tagName === 'TABLE') {
                    this[obj]('layout_gravity', mergeGravity(this[obj]('layout_gravity'), 'fill'));
                    if (textAlign === '' && this.tagName === 'TH') {
                        textAlign = 'center';
                    }
                    if (verticalAlign === '') {
                        verticalAlign = 'center_vertical';
                    }
                }
                if (renderParent.is($enum.NODE_STANDARD.FRAME)) {
                    if (!setAutoMargin(this)) {
                        floating = floating || this.float;
                        if (floating !== 'none') {
                            if (renderParent.inlineWidth || (this.singleChild && !renderParent.documentRoot)) {
                                renderParent.android('layout_gravity', mergeGravity(renderParent.android('layout_gravity'), parseRTL(floating, settings)));
                            }
                            else {
                                if (this.blockWidth) {
                                    textAlign = setTextAlign(floating);
                                }
                                else {
                                    this.android('layout_gravity', mergeGravity(this.android('layout_gravity'), parseRTL(floating, settings)));
                                }
                            }
                        }
                    }
                }
                else if (floating !== '') {
                    if (this.is($enum.NODE_STANDARD.LINEAR)) {
                        if (this.blockWidth) {
                            textAlign = setTextAlign(floating);
                        }
                        else {
                            this[obj]('layout_gravity', mergeGravity(this[obj]('layout_gravity'), floating));
                        }
                    }
                    else if (renderParent.hasAlign($enum.NODE_ALIGNMENT.VERTICAL)) {
                        textAlign = setTextAlign(floating);
                    }
                }
                if (textAlignParent !== '' && parseRTL(textAlignParent, settings) !== left) {
                    if (renderParent.is($enum.NODE_STANDARD.FRAME) &&
                        this.singleChild &&
                        !this.floating &&
                        !this.autoMargin) {
                        this[obj]('layout_gravity', mergeGravity(this[obj]('layout_gravity'), convertHorizontal(textAlignParent)));
                    }
                    if (textAlign === '') {
                        textAlign = textAlignParent;
                    }
                }
                if (verticalAlign !== '' && renderParent.linearHorizontal) {
                    this[obj]('layout_gravity', mergeGravity(this[obj]('layout_gravity'), verticalAlign));
                    verticalAlign = '';
                }
                if (this.documentRoot && (this.blockWidth || this.is($enum.NODE_STANDARD.FRAME))) {
                    this.delete(obj, 'layout_gravity');
                }
                this.android('gravity', mergeGravity(this.android('gravity'), convertHorizontal(textAlign), verticalAlign));
            }
            setBoxSpacing(settings) {
                if (!this.hasBit('excludeResource', $enum.NODE_RESOURCE.BOX_SPACING)) {
                    ['padding', 'margin'].forEach(region => {
                        ['Top', 'Left', 'Right', 'Bottom'].forEach(direction => {
                            const dimension = region + direction;
                            const value = (this._boxReset[dimension] === 0 ? this[dimension] : 0) + this._boxAdjustment[dimension];
                            if (value !== 0) {
                                const attr = parseRTL(BOX_ANDROID[`${region.toUpperCase()}_${direction.toUpperCase()}`], settings);
                                this.android(attr, $util.formatPX(value));
                            }
                        });
                    });
                    if (this.api >= BUILD_ANDROID.OREO) {
                        ['layout_margin', 'padding'].forEach((value, index) => {
                            const top = $util.convertInt(this.android(`${value}Top`));
                            const right = $util.convertInt(this.android(parseRTL(`${value}Right`, settings)));
                            const bottom = $util.convertInt(this.android(`${value}Bottom`));
                            const left = $util.convertInt(this.android(parseRTL(`${value}Left`, settings)));
                            if (top !== 0 &&
                                top === bottom &&
                                bottom === left &&
                                left === right) {
                                this.delete('android', `${value}*`);
                                this.android(value, $util.formatPX(top));
                            }
                            else {
                                if (!(this.renderParent.is($enum.NODE_STANDARD.GRID) && index === 0)) {
                                    if (top !== 0 && top === bottom) {
                                        this.delete('android', `${value}Top`, `${value}Bottom`);
                                        this.android(`${value}Vertical`, $util.formatPX(top));
                                    }
                                    if (left !== 0 && left === right) {
                                        this.delete('android', parseRTL(`${value}Left`, settings), parseRTL(`${value}Right`, settings));
                                        this.android(`${value}Horizontal`, $util.formatPX(left));
                                    }
                                }
                            }
                        });
                    }
                }
            }
            applyOptimizations(settings) {
                const renderParent = this.renderParent;
                const renderChildren = this.renderChildren;
                function getPaddedHeight(node) {
                    return node.paddingTop + node.paddingBottom + node.borderTopWidth + node.borderBottomWidth;
                }
                if (this.is($enum.NODE_STANDARD.LINEAR, $enum.NODE_STANDARD.RADIO_GROUP)) {
                    const linearHorizontal = this.linearHorizontal;
                    if (this.blockWidth && !this.blockStatic) {
                        [[linearHorizontal, this.inlineElement, 'width'], [!linearHorizontal, true, 'height']].forEach((value) => {
                            const attr = `inline${$util.capitalize(value[2])}`;
                            if (value[0] &&
                                value[1] &&
                                !this[attr] && renderChildren.every(node => node[attr])) {
                                this.android(`layout_${value[2]}`, 'wrap_content');
                            }
                        });
                    }
                    if (linearHorizontal) {
                        if (!renderChildren.some(node => node.imageElement && node.baseline) && (this.hasAlign($enum.NODE_ALIGNMENT.FLOAT) ||
                            renderChildren.some(node => node.floating || !node.siblingflow))) {
                            this.android('baselineAligned', 'false');
                        }
                        else {
                            const childIndex = renderParent.android('baselineAlignedChildIndex');
                            if (renderChildren.some(node => !node.alignOrigin || !node.baseline) ||
                                (childIndex !== '' && this.renderParent.renderChildren.findIndex(node => node === this) === parseInt(childIndex)) ||
                                (renderChildren.some(node => node.nodeType < $enum.NODE_STANDARD.TEXT) && renderChildren.some(node => node.textElement && node.baseline)) ||
                                (renderParent.is($enum.NODE_STANDARD.GRID) && !renderChildren.some(node => node.textElement && node.baseline))) {
                                const baseline = $nodelist.textBaseline(renderChildren);
                                if (baseline.length > 0) {
                                    this.android('baselineAlignedChildIndex', renderChildren.indexOf(baseline[0]).toString());
                                }
                            }
                        }
                        if (settings.ellipsisOnTextOverflow &&
                            this.length > 1 &&
                            renderChildren.every(node => node.textElement && !node.floating)) {
                            const node = renderChildren[renderChildren.length - 1];
                            if (node.textElement && !node.multiLine && node.textContent.trim().split(String.fromCharCode(32)).length > 1) {
                                node.android('singleLine', 'true');
                            }
                        }
                    }
                }
                if (this.pageflow) {
                    if (!renderParent.documentBody && renderParent.blockStatic && this.documentParent === renderParent) {
                        [['firstElementChild', 'Top', $enum.BOX_STANDARD.MARGIN_TOP, $enum.BOX_STANDARD.PADDING_TOP], ['lastElementChild', 'Bottom', $enum.BOX_STANDARD.MARGIN_BOTTOM, $enum.BOX_STANDARD.PADDING_BOTTOM]].forEach((item, index) => {
                            const node = $dom.getNodeFromElement(renderParent[item[0]]);
                            if (node &&
                                !node.lineBreak &&
                                (node === this || node === this.renderChildren[index === 0 ? 0 : this.renderChildren.length - 1])) {
                                const marginOffset = renderParent[`margin${item[1]}`];
                                if (marginOffset > 0 &&
                                    renderParent[`padding${item[1]}`] === 0 &&
                                    renderParent[`border${item[1]}Width`] === 0) {
                                    node.modifyBox(item[2], null);
                                }
                            }
                        });
                    }
                    if (this.hasElement && this.blockStatic) {
                        for (let i = 0; i < this.element.children.length; i++) {
                            const element = this.element.children[i];
                            const node = $dom.getNodeFromElement(element);
                            if (node && node.pageflow && node.blockStatic && !node.lineBreak) {
                                const previous = node.previousSibling();
                                if (previous && previous.pageflow && !previous.lineBreak) {
                                    const marginTop = $util.convertInt(node.cssInitial('marginTop', true));
                                    const marginBottom = $util.convertInt(previous.cssInitial('marginBottom', true));
                                    if (marginBottom > 0 && marginTop > 0) {
                                        if (marginTop <= marginBottom) {
                                            node.modifyBox($enum.BOX_STANDARD.MARGIN_TOP, null);
                                        }
                                        else {
                                            previous.modifyBox($enum.BOX_STANDARD.MARGIN_BOTTOM, null);
                                        }
                                    }
                                }
                                [element.previousElementSibling, element.nextElementSibling].forEach((item, index) => {
                                    const adjacent = $dom.getNodeFromElement(item);
                                    if (adjacent && adjacent.excluded) {
                                        const offset = Math.min(adjacent.marginTop, adjacent.marginBottom);
                                        if (offset < 0) {
                                            if (index === 0) {
                                                node.modifyBox($enum.BOX_STANDARD.MARGIN_TOP, offset, true);
                                            }
                                            else {
                                                node.modifyBox($enum.BOX_STANDARD.MARGIN_BOTTOM, offset, true);
                                            }
                                        }
                                    }
                                });
                            }
                        }
                    }
                }
                this.bindWhiteSpace(settings);
                if (settings.autoSizePaddingAndBorderWidth && !this.hasBit('excludeProcedure', $enum.NODE_PROCEDURE.AUTOFIT)) {
                    let layoutWidth = $util.convertInt(this.android('layout_width'));
                    let layoutHeight = $util.convertInt(this.android('layout_height'));
                    let borderWidth = false;
                    if (this.imageElement) {
                        const top = this.borderTopWidth;
                        const right = this.borderRightWidth;
                        const bottom = this.borderBottomWidth;
                        const left = this.borderLeftWidth;
                        let width = 0;
                        let height = 0;
                        if (top > 0) {
                            this.modifyBox($enum.BOX_STANDARD.PADDING_TOP, top);
                            height += top;
                        }
                        if (right > 0) {
                            this.modifyBox($enum.BOX_STANDARD.PADDING_RIGHT, right);
                            width += right;
                        }
                        if (bottom > 0) {
                            this.modifyBox($enum.BOX_STANDARD.PADDING_BOTTOM, bottom);
                            height += bottom;
                        }
                        if (left > 0) {
                            this.modifyBox($enum.BOX_STANDARD.PADDING_LEFT, left);
                            width += left;
                        }
                        height += this.paddingTop + this.paddingBottom;
                        width += this.paddingLeft + this.paddingRight;
                        if (width > 0) {
                            if (layoutWidth > 0) {
                                this.android('layout_width', $util.formatPX(layoutWidth + width));
                            }
                            else {
                                layoutWidth = $util.convertInt(renderParent.android('layout_width'));
                                if (layoutWidth > 0 && this.singleChild) {
                                    renderParent.android('layout_width', $util.formatPX(layoutWidth + this.marginLeft + width));
                                }
                            }
                        }
                        if (height > 0) {
                            if (layoutHeight > 0) {
                                this.android('layout_height', $util.formatPX(layoutHeight + height));
                            }
                            else {
                                layoutHeight = $util.convertInt(renderParent.android('layout_height'));
                                if (layoutHeight > 0 && this.singleChild) {
                                    renderParent.android('layout_height', $util.formatPX(layoutHeight + this.marginTop + height));
                                }
                            }
                        }
                    }
                    else if (this.is($enum.NODE_STANDARD.BUTTON) && layoutHeight === 0) {
                        this.android('layout_height', $util.formatPX(this.bounds.height + (this.css('borderStyle') === 'outset' ? $util.convertInt(this.css('borderWidth')) : 0)));
                    }
                    else if (this.is($enum.NODE_STANDARD.LINE)) {
                        if (layoutHeight > 0 &&
                            this.has('height', 0, { map: 'initial' }) &&
                            this.tagName !== 'HR') {
                            this.android('layout_height', $util.formatPX(layoutHeight + this.borderTopWidth + this.borderBottomWidth));
                        }
                    }
                    else if (this.tagName === 'TABLE') {
                        const width = $util.convertInt(this.android('layout_width'));
                        if (width > 0) {
                            if (this.bounds.width > width) {
                                this.android('layout_width', $util.formatPX(this.bounds.width));
                            }
                            if (this.has('width', $enum.CSS_STANDARD.AUTO, { map: 'initial' }) && renderChildren.every(node => node.inlineWidth)) {
                                for (const node of renderChildren) {
                                    node.android('layout_width', '0px');
                                    node.app('layout_columnWeight', '1');
                                }
                            }
                        }
                        borderWidth = this.css('boxSizing') === 'content-box';
                    }
                    else {
                        if (this.hasElement && !this.hasBit('excludeResource', $enum.NODE_RESOURCE.BOX_SPACING)) {
                            if (!(renderParent.tagName === 'TABLE' || this.css('boxSizing') === 'border-box')) {
                                const minWidth = $util.convertInt(this.android('minWidth'));
                                const minHeight = $util.convertInt(this.android('minHeight'));
                                const paddedWidth = this.paddingLeft + this.paddingRight + this.borderLeftWidth + this.borderRightWidth;
                                const paddedHeight = getPaddedHeight(this);
                                if (layoutWidth > 0 &&
                                    this.toInt('width', 0, { map: 'initial' }) > 0 &&
                                    paddedWidth > 0) {
                                    this.android('layout_width', $util.formatPX(layoutWidth + paddedWidth));
                                }
                                if (layoutHeight > 0 &&
                                    this.toInt('height', 0, { map: 'initial' }) > 0 &&
                                    paddedHeight > 0 && (this.lineHeight === 0 ||
                                    this.lineHeight < this.box.height ||
                                    this.lineHeight === this.toInt('height'))) {
                                    this.android('layout_height', $util.formatPX(layoutHeight + paddedHeight));
                                }
                                if (minWidth > 0 && paddedWidth > 0) {
                                    this.android('minWidth', $util.formatPX(minWidth + paddedWidth));
                                }
                                if (minHeight > 0 && paddedHeight > 0) {
                                    this.android('minHeight', $util.formatPX(minHeight + paddedHeight));
                                }
                            }
                            borderWidth = true;
                        }
                    }
                    if (borderWidth) {
                        this.modifyBox($enum.BOX_STANDARD.PADDING_TOP, this.borderTopWidth);
                        this.modifyBox($enum.BOX_STANDARD.PADDING_RIGHT, this.borderRightWidth);
                        this.modifyBox($enum.BOX_STANDARD.PADDING_BOTTOM, this.borderBottomWidth);
                        this.modifyBox($enum.BOX_STANDARD.PADDING_LEFT, this.borderLeftWidth);
                    }
                }
                if (this.linearHorizontal || this.of($enum.NODE_STANDARD.RELATIVE, $enum.NODE_ALIGNMENT.HORIZONTAL)) {
                    const pageflow = renderChildren.filter(node => !node.floating && (node.hasElement || node.renderChildren.length === 0));
                    if (pageflow.length > 0 &&
                        pageflow.every(node => node.baseline || node.has('verticalAlign', $enum.CSS_STANDARD.UNIT)) && (pageflow.some(node => node.imageElement && node.toInt('verticalAlign') !== 0) ||
                        (pageflow.some(node => node.toInt('verticalAlign') < 0) && pageflow.some(node => node.toInt('verticalAlign') > 0)))) {
                        const marginTop = Math.max.apply(null, pageflow.map(node => node.toInt('verticalAlign')));
                        const tallest = [];
                        let offsetTop = 0;
                        if (marginTop > 0) {
                            pageflow.forEach(node => {
                                const offset = node.toInt('verticalAlign');
                                const offsetHeight = (node.imageElement ? node.bounds.height : 0) + (offset > 0 ? offset : 0);
                                if (offsetHeight >= offsetTop) {
                                    if (offsetHeight > offsetTop) {
                                        tallest.length = 0;
                                    }
                                    tallest.push(node);
                                    offsetTop = offsetHeight;
                                }
                            });
                            tallest.sort(a => a.imageElement ? -1 : 1);
                            pageflow.forEach(node => {
                                if (!tallest.includes(node)) {
                                    const offset = node.toInt('verticalAlign');
                                    if (marginTop > 0) {
                                        node.modifyBox($enum.BOX_STANDARD.MARGIN_TOP, offsetTop - (tallest[0].imageElement ? node.bounds.height : 0));
                                    }
                                    if (offset !== 0) {
                                        node.modifyBox($enum.BOX_STANDARD.MARGIN_TOP, offset * -1, true);
                                        node.css('verticalAlign', '0px');
                                    }
                                }
                            });
                            tallest.forEach(node => node.css('verticalAlign', '0px'));
                        }
                    }
                    if (renderChildren.some(node => node.tagName === 'SUB') && this.inlineHeight) {
                        const offsetHeight = $util.convertInt(View.getCustomizationValue(this.api, 'SUB', 'android', 'layout_marginTop'));
                        if (offsetHeight > 0) {
                            this.android('layout_height', $util.formatPX(this.bounds.height + offsetHeight + getPaddedHeight(this)));
                        }
                    }
                }
                if (this.inline && !this.floating) {
                    const offset = this.toInt('verticalAlign');
                    if (offset !== 0) {
                        this.modifyBox($enum.BOX_STANDARD.MARGIN_TOP, offset * -1, true);
                        if (offset < 0 &&
                            renderParent.layoutHorizontal &&
                            renderParent.inlineHeight) {
                            renderParent.android('layout_height', $util.formatPX(renderParent.bounds.height + getPaddedHeight(renderParent)));
                        }
                    }
                }
                if (this.position === 'relative' || renderParent.is($enum.NODE_STANDARD.FRAME)) {
                    const top = this.toInt('top');
                    const bottom = this.toInt('bottom');
                    const left = this.toInt('left');
                    if (top !== 0) {
                        if (top < 0 &&
                            renderParent.is($enum.NODE_STANDARD.RELATIVE, $enum.NODE_STANDARD.LINEAR) &&
                            this.floating &&
                            !!this.data('RESOURCE', 'backgroundImage')) {
                            let found = false;
                            renderParent.renderChildren.some((node) => {
                                if (node === this) {
                                    found = true;
                                }
                                else {
                                    if (node.android('layout_below') !== '') {
                                        return true;
                                    }
                                    else if (found) {
                                        node.modifyBox($enum.BOX_STANDARD.MARGIN_TOP, Math.abs(top));
                                    }
                                }
                                return false;
                            });
                        }
                        else {
                            this.modifyBox($enum.BOX_STANDARD.MARGIN_TOP, top, true);
                        }
                    }
                    else if (bottom !== 0) {
                        this.modifyBox($enum.BOX_STANDARD.MARGIN_TOP, bottom * -1, true);
                    }
                    if (left !== 0) {
                        if (this.float === 'right' || (this.position === 'relative' && this.autoMarginLeft)) {
                            this.modifyBox($enum.BOX_STANDARD.MARGIN_RIGHT, left * -1, true);
                        }
                        else {
                            this.modifyBox($enum.BOX_STANDARD.MARGIN_LEFT, left, true);
                        }
                    }
                }
                if (!this.plainText && !renderParent.linearHorizontal) {
                    const offset = (this.lineHeight + this.toInt('verticalAlign')) - this.actualHeight;
                    if (offset > 0) {
                        this.modifyBox($enum.BOX_STANDARD.MARGIN_TOP, Math.floor(offset / 2));
                        this.modifyBox($enum.BOX_STANDARD.MARGIN_BOTTOM, Math.ceil(offset / 2));
                    }
                }
            }
            applyCustomizations(settings) {
                for (const build of [API_ANDROID[0], API_ANDROID[this.api]]) {
                    if (build && build.customizations) {
                        for (const nodeName of [this.tagName, this.controlName]) {
                            const customizations = build.customizations[nodeName];
                            if (customizations) {
                                for (const obj in customizations) {
                                    for (const attr in customizations[obj]) {
                                        this.attr(obj, attr, customizations[obj][attr], settings.customizationsOverwritePrivilege);
                                    }
                                }
                            }
                        }
                    }
                }
            }
            bindWhiteSpace(settings) {
                if (!this.hasAlign($enum.NODE_ALIGNMENT.FLOAT) && (this.linearHorizontal ||
                    this.of($enum.NODE_STANDARD.RELATIVE, $enum.NODE_ALIGNMENT.HORIZONTAL, $enum.NODE_ALIGNMENT.MULTILINE) ||
                    this.of($enum.NODE_STANDARD.CONSTRAINT, $enum.NODE_ALIGNMENT.HORIZONTAL))) {
                    const textAlign = this.css('textAlign');
                    const textIndent = this.toInt('textIndent');
                    const valueBox = this.valueBox($enum.BOX_STANDARD.PADDING_LEFT);
                    const relative = this.is($enum.NODE_STANDARD.RELATIVE);
                    let right = this.box.left + (textIndent > 0 ? this.toInt('textIndent')
                        : textIndent < 0 && valueBox[0] === 1 ? valueBox[0] : 0);
                    this.each((node, index) => {
                        if (!(node.floating || (relative && node.alignParent('left', settings)) || (index === 0 && (textAlign !== 'left' || node.plainText)) || ['SUP', 'SUB'].includes(node.tagName))) {
                            const width = Math.round(node.actualLeft() - right);
                            if (width >= 1) {
                                node.modifyBox($enum.BOX_STANDARD.MARGIN_LEFT, width);
                            }
                        }
                        right = node.actualRight();
                    }, true);
                }
                else if (this.linearVertical) {
                    this.each((node) => {
                        const previous = (() => {
                            let sibling = node;
                            do {
                                sibling = sibling.previousSibling(true, false, false);
                            } while (sibling && !this.initial.children.includes(sibling));
                            return sibling;
                        })();
                        const elements = $dom.getElementsBetweenSiblings(previous ? (previous.length > 0 && !previous.hasElement ? previous.lastElementChild : previous.baseElement)
                            : null, node.baseElement)
                            .filter(element => {
                            const item = $dom.getNodeFromElement(element);
                            if (item && (item.lineBreak || (item.excluded && item.blockStatic))) {
                                return true;
                            }
                            return false;
                        });
                        if (elements.length > 0) {
                            let bottom;
                            if (!previous) {
                                bottom = this.box.top;
                            }
                            else {
                                bottom = (() => {
                                    if (previous.layoutHorizontal &&
                                        previous.length > 0 &&
                                        previous.renderChildren.some(item => !item.floating)) {
                                        return (previous.renderChildren
                                            .filter(item => !item.floating)
                                            .sort((a, b) => a.linear.bottom < b.linear.bottom ? 1 : -1)[0]
                                            .linear.bottom);
                                    }
                                    return previous.linear.bottom;
                                })();
                            }
                            if (elements.length === 1 && elements[0].tagName === 'BR' && previous && previous.inline && node.inline) {
                                return;
                            }
                            const height = Math.round(node.linear.top - bottom);
                            if (height >= 1) {
                                node.modifyBox($enum.BOX_STANDARD.MARGIN_TOP, height);
                            }
                        }
                    }, true);
                }
            }
            get stringId() {
                return this.nodeId ? `@+id/${this.nodeId}` : '';
            }
            set controlName(value) {
                this._controlName = value;
            }
            get controlName() {
                if (this._controlName) {
                    return this._controlName;
                }
                else {
                    const value = $const.MAP_ELEMENT[this.nodeName];
                    return value != null ? View.getControlName(value) : '';
                }
            }
            set documentParent(value) {
                this._documentParent = value;
            }
            get documentParent() {
                if (this._documentParent) {
                    return this._documentParent;
                }
                else if (this.id === 0) {
                    return this;
                }
                else {
                    return this.getParentElementAsNode(false) || View.documentBody();
                }
            }
            set renderParent(value) {
                if (value !== this) {
                    value.renderAppend(this);
                }
                this._renderParent = value;
            }
            get renderParent() {
                return this._renderParent || View.documentBody();
            }
            get anchored() {
                return this.constraint.horizontal && this.constraint.vertical;
            }
            get layoutHorizontal() {
                return (this.linearHorizontal ||
                    this.hasAlign($enum.NODE_ALIGNMENT.HORIZONTAL) ||
                    (this.is($enum.NODE_STANDARD.FRAME) && this.nodes.every(node => node.domElement)) ||
                    (this.nodes.filter(node => node.pageflow).length > 1 && $nodelist.linearX(this.nodes)));
            }
            get layoutVertical() {
                return (this.linearVertical ||
                    this.hasAlign($enum.NODE_ALIGNMENT.VERTICAL) ||
                    (this.is($enum.NODE_STANDARD.FRAME) && this.nodes.some(node => node.linearVertical)) ||
                    (this.nodes.filter(node => node.pageflow).length > 1 && $nodelist.linearY(this.nodes)));
            }
            get linearHorizontal() {
                return this._android.orientation === AXIS_ANDROID.HORIZONTAL && this.is($enum.NODE_STANDARD.LINEAR, $enum.NODE_STANDARD.RADIO_GROUP);
            }
            get linearVertical() {
                return this._android.orientation === AXIS_ANDROID.VERTICAL && this.is($enum.NODE_STANDARD.LINEAR, $enum.NODE_STANDARD.RADIO_GROUP);
            }
            get inlineWidth() {
                return this._android.layout_width === 'wrap_content';
            }
            get inlineHeight() {
                return this._android.layout_height === 'wrap_content';
            }
            get blockWidth() {
                return this._android.layout_width === 'match_parent';
            }
            get blockHeight() {
                return this._android.layout_height === 'match_parent';
            }
        };
    };

    class View extends ViewBase(androme.lib.base.Node) {
        constructor(id = 0, element) {
            super(id, element);
        }
    }

    class ViewGroup extends ViewBase(androme.lib.base.NodeGroup) {
        constructor(id, node, parent, children) {
            super(id);
            this.api = node.api;
            this.parent = parent;
            this.children = children;
            this.depth = node.depth;
            this.nodeName = `${node.nodeName}_GROUP`;
            this.documentParent = node.documentParent;
            if (children.length > 0) {
                this.init();
            }
        }
    }

    const template = [
        '!0',
        '<?xml version="1.0" encoding="utf-8"?>',
        '<shape xmlns:android="http://schemas.android.com/apk/res/android" android:shape="rectangle">',
        '!1',
        '	<stroke android:width="{&width}" {borderStyle} />',
        '!1',
        '!2',
        '	<solid android:color="@color/{&color}" />',
        '!2',
        '!3',
        '	<corners android:radius="{&radius}" />',
        '!3',
        '</shape>',
        '!0'
    ];
    var SHAPERECTANGLE_TMPL = template.join('\n');

    const template$1 = [
        '!0',
        '<?xml version="1.0" encoding="utf-8"?>',
        '<layer-list xmlns:android="http://schemas.android.com/apk/res/android">',
        '!1',
        '	<item>',
        '		<shape android:shape="rectangle">',
        '			<solid android:color="@color/{&color}" />',
        '		</shape>',
        '	</item>',
        '!1',
        '!2',
        '	<item android:top="{@top}" android:right="{@right}" android:bottom="{@bottom}" android:left="{@left}" android:drawable="@drawable/{image}" width="{@width}" height="{@height}" />',
        '!2',
        '!3',
        '	<item android:top="{@top}" android:right="{@right}" android:bottom="{@bottom}" android:left="{@left}">',
        '		<bitmap android:src="@drawable/{image}" android:gravity="{@gravity}" android:tileMode="{@tileMode}" android:tileModeX="{@tileModeX}" android:tileModeY="{@tileModeY}" />',
        '	</item>',
        '!3',
        '!7',
        '	<item android:top="{@top}" android:right="{@right}" android:bottom="{@bottom}" android:left="{@left}">',
        '		<shape android:shape="rectangle">',
        '!8',
        '			<stroke android:width="{&width}" {borderStyle} />',
        '!8',
        '		</shape>',
        '	</item>',
        '!7',
        '!4',
        '	<item android:top="{@top}" android:right="{@right}" android:bottom="{@bottom}" android:left="{@left}">',
        '		<shape android:shape="rectangle">',
        '!5',
        '			<stroke android:width="{&width}" {borderStyle} />',
        '!5',
        '!6',
        '			<corners android:radius="{@radius}" android:topLeftRadius="{@topLeftRadius}" android:topRightRadius="{@topRightRadius}" android:bottomRightRadius="{@bottomRightRadius}" android:bottomLeftRadius="{@bottomLeftRadius}" />',
        '!6',
        '		</shape>',
        '	</item>',
        '!4',
        '</layer-list>',
        '!0'
    ];
    var LAYERLIST_TMPL = template$1.join('\n');

    var $enum$1 = androme.lib.enumeration;
    var $util$1 = androme.lib.util;
    var $dom$1 = androme.lib.dom;
    var $xml = androme.lib.xml;
    var $color = androme.lib.color;
    var $resource = androme.lib.base.Resource;
    const METHOD_ANDROID = {
        'boxStyle': {
            'background': 'android:background="@drawable/{0}"',
            'backgroundColor': 'android:background="@color/{0}"'
        },
        'fontStyle': {
            'fontFamily': 'android:fontFamily="{0}"',
            'fontStyle': 'android:textStyle="{0}"',
            'fontWeight': 'android:fontWeight="{0}"',
            'fontSize': 'android:textSize="{0}"',
            'color': 'android:textColor="@color/{0}"',
            'backgroundColor': 'android:background="@color/{0}"'
        },
        'valueString': {
            'text': 'android:text="{0}"'
        },
        'optionArray': {
            'entries': 'android:entries="@array/{0}"'
        },
        'imageSource': {
            'src': 'android:src="@drawable/{0}"'
        }
    };
    class ResourceHandler extends androme.lib.base.Resource {
        constructor(file) {
            super(file);
            this.tagStyle = {};
            this.tagCount = {};
            this.file.stored = $resource.STORED;
        }
        static getStored(name) {
            return $resource.STORED[name];
        }
        static formatOptions(options, settings) {
            for (const namespace in options) {
                const object = options[namespace];
                if (typeof object === 'object') {
                    for (const attr in object) {
                        if (object[attr] != null) {
                            let value = object[attr].toString();
                            switch (namespace) {
                                case 'android':
                                    switch (attr) {
                                        case 'text':
                                            if (!value.startsWith('@string/')) {
                                                value = ResourceHandler.addString(value, '', settings);
                                                if (value !== '') {
                                                    object[attr] = `@string/${value}`;
                                                    continue;
                                                }
                                            }
                                            break;
                                        case 'src':
                                            if (/^\w+:\/\//.test(value)) {
                                                value = ResourceHandler.addImage({ 'mdpi': value });
                                                if (value !== '') {
                                                    object[attr] = `@drawable/${value}`;
                                                    continue;
                                                }
                                            }
                                            break;
                                    }
                                    break;
                            }
                            const hex = $color.parseHex(value);
                            if (hex !== '') {
                                object[attr] = `@color/${ResourceHandler.addColor(hex)}`;
                            }
                        }
                    }
                }
            }
            return options;
        }
        static addString(value, name = '', { numberResourceValue = false }) {
            if (value !== '') {
                if (name === '') {
                    name = value;
                }
                const numeric = $util$1.isNumber(value);
                if (numberResourceValue || !numeric) {
                    for (const [resourceName, resourceValue] of $resource.STORED.strings.entries()) {
                        if (resourceValue === value) {
                            return resourceName;
                        }
                    }
                    name =
                        name.trim()
                            .toLowerCase()
                            .replace(/[^a-z0-9]/g, '_')
                            .replace(/_+/g, '_')
                            .split('_')
                            .slice(0, 4)
                            .join('_')
                            .replace(/_+$/g, '');
                    if (numeric || /^[0-9]/.test(name) || RESERVED_JAVA.includes(name)) {
                        name = `__${name}`;
                    }
                    else if (name === '') {
                        name = `__symbol${Math.ceil(Math.random() * 100000)}`;
                    }
                    if ($resource.STORED.strings.has(name)) {
                        name = generateId('strings', `${name}_1`);
                    }
                    $resource.STORED.strings.set(name, value);
                }
                return name;
            }
            return '';
        }
        static addImageSrcSet(element, prefix = '') {
            const srcset = element.srcset.trim();
            const images = {};
            if (srcset !== '') {
                const filepath = element.src.substring(0, element.src.lastIndexOf('/') + 1);
                srcset
                    .split(',')
                    .forEach(value => {
                    const match = /^(.*?)\s*([0-9]+\.?[0-9]*x)?$/.exec(value.trim());
                    if (match) {
                        if (match[2] == null) {
                            match[2] = '1x';
                        }
                        const image = filepath + $util$1.lastIndexOf(match[1]);
                        switch (match[2]) {
                            case '0.75x':
                                images['ldpi'] = image;
                                break;
                            case '1x':
                                images['mdpi'] = image;
                                break;
                            case '1.5x':
                                images['hdpi'] = image;
                                break;
                            case '2x':
                                images['xhdpi'] = image;
                                break;
                            case '3x':
                                images['xxhdpi'] = image;
                                break;
                            case '4x':
                                images['xxxhdpi'] = image;
                                break;
                        }
                    }
                });
            }
            if (images['mdpi'] == null) {
                images['mdpi'] = element.src;
            }
            return ResourceHandler.addImage(images, prefix);
        }
        static addImage(images, prefix = '') {
            let src = '';
            if (images && images['mdpi']) {
                src = $util$1.lastIndexOf(images['mdpi']);
                const format = $util$1.lastIndexOf(src, '.').toLowerCase();
                src = src.replace(/.\w+$/, '').replace(/-/g, '_');
                switch (format) {
                    case 'bmp':
                    case 'cur':
                    case 'gif':
                    case 'ico':
                    case 'jpg':
                    case 'png':
                        src = $resource.insertStoredAsset('images', prefix + src, images);
                        break;
                    default:
                        src = '';
                        break;
                }
            }
            return src;
        }
        static addImageURL(value, prefix = '') {
            const url = $dom$1.parseBackgroundUrl(value);
            if (url !== '') {
                return ResourceHandler.addImage({ 'mdpi': url }, prefix);
            }
            return '';
        }
        static addColor(value, opacity = '1') {
            value = value.toUpperCase().trim();
            const opaque = parseFloat(opacity) < 1 ? `#${parseFloat(opacity).toFixed(2).substring(2) + value.substring(1)}`
                : value;
            if (value !== '') {
                let colorName = '';
                if (!$resource.STORED.colors.has(opaque)) {
                    const color = $color.getColorNearest(value);
                    if (color !== '') {
                        color.name = $util$1.cameltoLowerCase(color.name);
                        if (value === color.hex && value === opaque) {
                            colorName = color.name;
                        }
                        else {
                            colorName = generateId('color', `${color.name}_1`);
                        }
                        $resource.STORED.colors.set(opaque, colorName);
                    }
                }
                else {
                    colorName = $resource.STORED.colors.get(opaque);
                }
                return colorName;
            }
            return '';
        }
        static getColor(value) {
            for (const [hex, name] of $resource.STORED.colors.entries()) {
                if (name === value) {
                    return hex;
                }
            }
            return '';
        }
        static parseBackgroundPosition(value, fontSize) {
            const match = new RegExp(/([0-9]+[a-z]{2}) ([0-9]+[a-z]{2})/).exec(value);
            if (match) {
                return [$util$1.convertPX(match[1], fontSize), $util$1.convertPX(match[2], fontSize)];
            }
            return ['', ''];
        }
        reset() {
            super.reset();
            this.file.reset();
            this.tagStyle = {};
            this.tagCount = {};
        }
        finalize(viewData) {
            this.processFontStyle(viewData);
            const styles = {};
            for (const node of viewData.cache) {
                const children = node.renderChildren.filter(item => item.auto && item.visible);
                if (children.length > 1) {
                    const map = new Map();
                    let style = '';
                    let valid = true;
                    for (let i = 0; i < children.length; i++) {
                        let found = false;
                        children[i]
                            .combine('_', 'android')
                            .some(value => {
                            if (value.startsWith('style=')) {
                                if (i === 0) {
                                    style = value;
                                }
                                else {
                                    if (style === '' || value !== style) {
                                        valid = false;
                                        return true;
                                    }
                                }
                                found = true;
                            }
                            else {
                                if (!map.has(value)) {
                                    map.set(value, 0);
                                }
                                map.set(value, map.get(value) + 1);
                            }
                            return false;
                        });
                        if (!valid || (style !== '' && !found)) {
                            valid = false;
                            break;
                        }
                    }
                    if (valid) {
                        for (const attr of map.keys()) {
                            if (map.get(attr) !== children.length) {
                                map.delete(attr);
                            }
                        }
                        if (map.size > 1) {
                            if (style !== '') {
                                style = $util$1.trimString(style.substring(style.indexOf('/') + 1), '"');
                            }
                            const common = [];
                            for (const attr of map.keys()) {
                                const match = attr.match(/(\w+):(\w+)="(.*?)"/);
                                if (match) {
                                    children.forEach(child => child.delete(match[1], match[2]));
                                    common.push(match[0]);
                                }
                            }
                            common.sort();
                            let name = '';
                            for (const index in styles) {
                                if (styles[index].join(';') === common.join(';')) {
                                    name = index;
                                    break;
                                }
                            }
                            if (!(name !== '' && style !== '' && name.startsWith(`${style}.`))) {
                                name = (style !== '' ? `${style}.` : '') + $util$1.capitalize(node.nodeId);
                                styles[name] = common;
                            }
                            children.forEach(child => child.attr('_', 'style', `@style/${name}`));
                        }
                    }
                }
            }
            for (const name in styles) {
                $resource.STORED.styles.set(name, { attributes: styles[name].join(';') });
            }
        }
        setBoxSpacing() {
            super.setBoxSpacing();
            this.cache.elements.filter(node => !node.hasBit('excludeResource', $enum$1.NODE_RESOURCE.BOX_SPACING)).each(node => {
                const stored = $dom$1.getElementCache(node.element, 'boxSpacing');
                if (stored) {
                    if (stored.marginLeft === stored.marginRight &&
                        node.alignParent('left', this.settings) &&
                        node.alignParent('right', this.settings) &&
                        !node.blockWidth &&
                        !(node.position === 'relative' && node.alignNegative)) {
                        node.modifyBox($enum$1.BOX_STANDARD.MARGIN_LEFT, null);
                        node.modifyBox($enum$1.BOX_STANDARD.MARGIN_RIGHT, null);
                    }
                    if (node.css('marginLeft') === 'auto') {
                        node.modifyBox($enum$1.BOX_STANDARD.MARGIN_LEFT, null);
                    }
                    if (node.css('marginRight') === 'auto') {
                        node.modifyBox($enum$1.BOX_STANDARD.MARGIN_RIGHT, null);
                    }
                }
            });
        }
        setBoxStyle() {
            super.setBoxStyle();
            this.cache.elements.filter(node => !node.hasBit('excludeResource', $enum$1.NODE_RESOURCE.BOX_STYLE)).each(node => {
                const stored = $dom$1.getElementCache(node.element, 'boxStyle');
                if (stored) {
                    if (Array.isArray(stored.backgroundColor) && stored.backgroundColor.length > 0) {
                        stored.backgroundColor = ResourceHandler.addColor(stored.backgroundColor[0], stored.backgroundColor[2]);
                    }
                    let backgroundImage = stored.backgroundImage.split(',').map(value => value.trim());
                    let backgroundRepeat = stored.backgroundRepeat.split(',').map(value => value.trim());
                    let backgroundPosition = stored.backgroundPosition.split(',').map(value => value.trim());
                    const backgroundImageUrl = [];
                    const backgroundDimensions = [];
                    for (let i = 0; i < backgroundImage.length; i++) {
                        if (backgroundImage[i] !== '' && backgroundImage[i] !== 'none') {
                            backgroundImageUrl.push(backgroundImage[i]);
                            const image = this.imageDimensions.get($dom$1.parseBackgroundUrl(backgroundImage[i]));
                            backgroundDimensions.push(image);
                            backgroundImage[i] = ResourceHandler.addImageURL(backgroundImage[i]);
                        }
                        else {
                            backgroundImage[i] = '';
                            backgroundRepeat[i] = '';
                            backgroundPosition[i] = '';
                        }
                    }
                    backgroundImage = backgroundImage.filter(value => value !== '');
                    backgroundRepeat = backgroundRepeat.filter(value => value !== '');
                    backgroundPosition = backgroundPosition.filter(value => value !== '');
                    const method = METHOD_ANDROID['boxStyle'];
                    const companion = node.companion;
                    if (companion &&
                        companion.hasElement &&
                        !$dom$1.cssFromParent(companion.element, 'backgroundColor')) {
                        const boxStyle = $dom$1.getElementCache(companion.element, 'boxStyle');
                        if (Array.isArray(boxStyle.backgroundColor) && boxStyle.backgroundColor.length > 0) {
                            stored.backgroundColor = ResourceHandler.addColor(boxStyle.backgroundColor[0], boxStyle.backgroundColor[2]);
                        }
                    }
                    const hasBorder = (this.borderVisible(stored.borderTop) ||
                        this.borderVisible(stored.borderRight) ||
                        this.borderVisible(stored.borderBottom) ||
                        this.borderVisible(stored.borderLeft) ||
                        stored.borderRadius.length > 0);
                    if (hasBorder || backgroundImage.length > 0) {
                        const borders = [
                            stored.borderTop,
                            stored.borderRight,
                            stored.borderBottom,
                            stored.borderLeft
                        ];
                        borders.forEach((item) => {
                            if (Array.isArray(item.color) && item.color.length > 0) {
                                item.color = ResourceHandler.addColor(item.color[0], item.color[2]);
                            }
                        });
                        let data;
                        const image2 = [];
                        const image3 = [];
                        let template = null;
                        let resourceName = '';
                        for (let i = 0; i < backgroundImage.length; i++) {
                            let gravity = '';
                            let tileMode = '';
                            let tileModeX = '';
                            let tileModeY = '';
                            let [left, top] = ResourceHandler.parseBackgroundPosition(backgroundPosition[i], node.css('fontSize'));
                            let right = '';
                            let bottom = '';
                            const image = backgroundDimensions[i];
                            switch (backgroundRepeat[i]) {
                                case 'repeat-x':
                                    if (image == null || image.width < node.bounds.width) {
                                        tileModeX = 'repeat';
                                    }
                                    break;
                                case 'repeat-y':
                                    if (image == null || image.height < node.bounds.height) {
                                        tileModeY = 'repeat';
                                    }
                                    break;
                                case 'no-repeat':
                                    tileMode = 'disabled';
                                    break;
                                case 'repeat':
                                    if (image == null ||
                                        image.width < node.bounds.width ||
                                        image.height < node.bounds.height) {
                                        tileMode = 'repeat';
                                    }
                                    break;
                            }
                            if (left === '') {
                                switch (backgroundPosition[i]) {
                                    case 'left top':
                                    case '0% 0%':
                                        gravity = 'left|top';
                                        break;
                                    case 'left center':
                                    case '0% 50%':
                                        gravity = 'left|center_vertical';
                                        break;
                                    case 'left bottom':
                                    case '0% 100%':
                                        gravity = 'left|bottom';
                                        break;
                                    case 'right top':
                                    case '100% 0%':
                                        gravity = 'right|top';
                                        break;
                                    case 'right center':
                                    case '100% 50%':
                                        gravity = 'right|center_vertical';
                                        break;
                                    case 'right bottom':
                                    case '100% 100%':
                                        gravity = 'right|bottom';
                                        break;
                                    case 'center top':
                                    case '50% 0%':
                                        gravity = 'center_horizontal|top';
                                        break;
                                    case 'center bottom':
                                    case '50% 100%':
                                        gravity = 'center_horizontal|bottom';
                                        break;
                                    case 'center center':
                                    case '50% 50%':
                                        gravity = 'center';
                                        break;
                                    default:
                                        const position = backgroundPosition[i].split(' ');
                                        if (position.length === 2) {
                                            function mergeGravity(original, alignment) {
                                                return original + (original !== '' ? '|' : '') + alignment;
                                            }
                                            position.forEach((value, index) => {
                                                if ($util$1.isPercent(value)) {
                                                    switch (index) {
                                                        case 0:
                                                            if (value === '0%') {
                                                                gravity = mergeGravity(gravity, 'left');
                                                            }
                                                            else if (value === '100%') {
                                                                gravity = mergeGravity(gravity, 'right');
                                                            }
                                                            else {
                                                                left = $util$1.formatPX(node.bounds.width * ($util$1.convertInt(value) / 100));
                                                            }
                                                            break;
                                                        case 1:
                                                            if (value === '0%') {
                                                                gravity = mergeGravity(gravity, 'top');
                                                            }
                                                            else if (value === '100%') {
                                                                gravity = mergeGravity(gravity, 'bottom');
                                                            }
                                                            else {
                                                                top = $util$1.formatPX(node.actualHeight * ($util$1.convertInt(value) / 100));
                                                            }
                                                            break;
                                                    }
                                                }
                                                else if (/^[a-z]+$/.test(value)) {
                                                    gravity = mergeGravity(gravity, value);
                                                }
                                                else {
                                                    const leftTop = $util$1.convertPX(value, node.css('fontSize'));
                                                    if (leftTop !== '0px') {
                                                        if (index === 0) {
                                                            left = leftTop;
                                                        }
                                                        else {
                                                            top = leftTop;
                                                        }
                                                    }
                                                    gravity = mergeGravity(gravity, index === 0 ? 'left' : 'top');
                                                }
                                            });
                                        }
                                        break;
                                }
                                if (gravity !== '' && image && image.width > 0 && image.height > 0) {
                                    if (tileModeY === 'repeat') {
                                        let backgroundWidth = node.viewWidth;
                                        if (backgroundWidth > 0) {
                                            if (this.settings.autoSizePaddingAndBorderWidth && !node.hasBit('excludeResource', $enum$1.NODE_RESOURCE.BOX_SPACING)) {
                                                backgroundWidth = node.viewWidth + node.paddingLeft + node.paddingRight;
                                            }
                                        }
                                        else {
                                            backgroundWidth = node.bounds.width - (node.borderLeftWidth + node.borderRightWidth);
                                        }
                                        if (image.width < backgroundWidth) {
                                            const layoutWidth = $util$1.convertInt(node.android('layout_width'));
                                            if (gravity.indexOf('left') !== -1) {
                                                right = $util$1.formatPX(backgroundWidth - image.width);
                                                if (node.viewWidth === 0 && backgroundWidth > layoutWidth) {
                                                    node.android('layout_width', $util$1.formatPX(node.bounds.width));
                                                }
                                            }
                                            else if (gravity.indexOf('right') !== -1) {
                                                left = $util$1.formatPX(backgroundWidth - image.width);
                                                if (node.viewWidth === 0 && backgroundWidth > layoutWidth) {
                                                    node.android('layout_width', $util$1.formatPX(node.bounds.width));
                                                }
                                            }
                                            else if (gravity === 'center' || gravity.indexOf('center_horizontal') !== -1) {
                                                right = $util$1.formatPX(Math.floor((backgroundWidth - image.width) / 2));
                                                if (node.viewWidth === 0 && backgroundWidth > layoutWidth) {
                                                    node.android('layout_width', $util$1.formatPX(node.bounds.width));
                                                }
                                            }
                                        }
                                    }
                                    if (tileModeX === 'repeat') {
                                        let backgroundHeight = node.viewHeight;
                                        if (backgroundHeight > 0) {
                                            if (this.settings.autoSizePaddingAndBorderWidth && !node.hasBit('excludeResource', $enum$1.NODE_RESOURCE.BOX_SPACING)) {
                                                backgroundHeight = node.viewHeight + node.paddingTop + node.paddingBottom;
                                            }
                                        }
                                        else {
                                            backgroundHeight = node.bounds.height - (node.borderTopWidth + node.borderBottomWidth);
                                        }
                                        if (image.height < backgroundHeight) {
                                            const layoutHeight = $util$1.convertInt(node.android('layout_height'));
                                            if (gravity.indexOf('top') !== -1) {
                                                bottom = $util$1.formatPX(backgroundHeight - image.height);
                                                if (node.viewHeight === 0 && backgroundHeight > layoutHeight) {
                                                    node.android('layout_height', $util$1.formatPX(node.bounds.height));
                                                }
                                            }
                                            else if (gravity.indexOf('bottom') !== -1) {
                                                top = $util$1.formatPX(backgroundHeight - image.height);
                                                if (node.viewHeight === 0 && backgroundHeight > layoutHeight) {
                                                    node.android('layout_height', $util$1.formatPX(node.bounds.height));
                                                }
                                            }
                                            else if (gravity === 'center' || gravity.indexOf('center_vertical') !== -1) {
                                                bottom = $util$1.formatPX(Math.floor((backgroundHeight - image.height) / 2));
                                                if (node.viewHeight === 0 && backgroundHeight > layoutHeight) {
                                                    node.android('layout_height', $util$1.formatPX(node.bounds.height));
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                            if (stored.backgroundSize.length > 0) {
                                if ($util$1.isPercent(stored.backgroundSize[0]) || $util$1.isPercent(stored.backgroundSize[1])) {
                                    if (stored.backgroundSize[0] === '100%' && stored.backgroundSize[1] === '100%') {
                                        tileMode = '';
                                        tileModeX = '';
                                        tileModeY = '';
                                        gravity = '';
                                    }
                                    else if (stored.backgroundSize[0] === '100%') {
                                        tileModeX = '';
                                    }
                                    else if (stored.backgroundSize[1] === '100%') {
                                        tileModeY = '';
                                    }
                                    stored.backgroundSize = [];
                                }
                            }
                            if (node.of($enum$1.NODE_STANDARD.IMAGE, $enum$1.NODE_ALIGNMENT.SINGLE) && backgroundPosition.length === 1) {
                                node.android('src', `@drawable/${backgroundImage[0]}`);
                                if ($util$1.convertInt(left) > 0) {
                                    node.modifyBox($enum$1.BOX_STANDARD.MARGIN_LEFT, $util$1.convertInt(left));
                                }
                                if ($util$1.convertInt(top) > 0) {
                                    node.modifyBox($enum$1.BOX_STANDARD.MARGIN_TOP, $util$1.convertInt(top));
                                }
                                let scaleType = '';
                                switch (gravity) {
                                    case 'left|top':
                                    case 'left|center_vertical':
                                    case 'left|bottom':
                                        scaleType = 'fitStart';
                                        break;
                                    case 'right|top':
                                    case 'right|center_vertical':
                                    case 'right|bottom':
                                        scaleType = 'fitEnd';
                                        break;
                                    case 'center':
                                    case 'center_horizontal|top':
                                    case 'center_horizontal|bottom':
                                        scaleType = 'center';
                                        break;
                                }
                                node.android('scaleType', scaleType);
                                if (!hasBorder) {
                                    return;
                                }
                                backgroundImage.length = 0;
                            }
                            else {
                                if (gravity !== '' ||
                                    tileMode !== '' ||
                                    tileModeX !== '' ||
                                    tileModeY !== '') {
                                    image3.push({
                                        top,
                                        right,
                                        bottom,
                                        left,
                                        gravity,
                                        tileMode,
                                        tileModeX,
                                        tileModeY,
                                        width: '',
                                        height: '',
                                        image: backgroundImage[i]
                                    });
                                }
                                else {
                                    image2.push({
                                        top,
                                        right,
                                        bottom,
                                        left,
                                        gravity,
                                        tileMode,
                                        tileModeX,
                                        tileModeY,
                                        width: (stored.backgroundSize.length > 0 ? stored.backgroundSize[0] : ''),
                                        height: (stored.backgroundSize.length > 0 ? stored.backgroundSize[1] : ''),
                                        image: backgroundImage[i]
                                    });
                                }
                            }
                        }
                        image3.sort((a, b) => {
                            if (!(a.tileModeX === 'repeat' || a.tileModeY === 'repeat' || a.tileMode === 'repeat')) {
                                return 1;
                            }
                            else if (!(b.tileModeX === 'repeat' || b.tileModeY === 'repeat' || b.tileMode === 'repeat')) {
                                return -1;
                            }
                            else {
                                if (a.tileMode === 'repeat') {
                                    return -1;
                                }
                                else if (b.tileMode === 'repeat') {
                                    return 1;
                                }
                                else {
                                    return b.tileModeX === 'repeat' || b.tileModeY === 'repeat' ? 1 : -1;
                                }
                            }
                        });
                        const backgroundColor = this.getShapeAttribute(stored, 'backgroundColor');
                        const radius = this.getShapeAttribute(stored, 'radius');
                        function createDoubleBorder(templateData, border, top, right, bottom, left) {
                            const width = parseInt(border.width);
                            const baseWidth = Math.floor(width / 3);
                            const remainder = width % 3;
                            const leftWidth = baseWidth + (remainder === 2 ? 1 : 0);
                            const rightWidth = baseWidth + (remainder === 2 ? 1 : 0);
                            let leftTop = `-${$util$1.formatPX(leftWidth + 1)}`;
                            let rightBottom = `-${$util$1.formatPX(leftWidth)}`;
                            templateData['4'].push({
                                'top': top ? '' : rightBottom,
                                'right': right ? '' : leftTop,
                                'bottom': bottom ? '' : rightBottom,
                                'left': left ? '' : leftTop,
                                '5': [{ width: $util$1.formatPX(leftWidth), borderStyle: this.getBorderStyle(border) }],
                                '6': radius
                            });
                            leftTop = `-${$util$1.formatPX(width + 1)}`;
                            rightBottom = `-${$util$1.formatPX(width)}`;
                            const indentWidth = `${$util$1.formatPX(width - baseWidth)}`;
                            templateData['4'].push({
                                'top': top ? indentWidth : leftTop,
                                'right': right ? indentWidth : rightBottom,
                                'bottom': bottom ? indentWidth : rightBottom,
                                'left': left ? indentWidth : leftTop,
                                '5': [{ width: $util$1.formatPX(rightWidth), borderStyle: this.getBorderStyle(border) }],
                                '6': radius
                            });
                        }
                        if (stored.border &&
                            this.borderVisible(stored.border) && !((parseInt(stored.border.width) > 1 && (stored.border.style === 'groove' || stored.border.style === 'ridge')) ||
                            (parseInt(stored.border.width) > 2 && stored.border.style === 'double'))) {
                            if (backgroundImage.length === 0) {
                                template = $xml.parseTemplate(SHAPERECTANGLE_TMPL);
                                data = {
                                    '0': [{
                                            '1': this.getShapeAttribute(stored, 'stroke'),
                                            '2': backgroundColor,
                                            '3': radius
                                        }]
                                };
                            }
                            else {
                                template = $xml.parseTemplate(LAYERLIST_TMPL);
                                data = {
                                    '0': [{
                                            '1': backgroundColor,
                                            '2': image2.length > 0 ? image2 : false,
                                            '3': image3.length > 0 ? image3 : false,
                                            '4': [{
                                                    '5': this.getShapeAttribute(stored, 'stroke'),
                                                    '6': radius
                                                }],
                                            '7': false
                                        }]
                                };
                            }
                        }
                        else {
                            template = $xml.parseTemplate(LAYERLIST_TMPL);
                            data = {
                                '0': [{
                                        '1': backgroundColor,
                                        '2': image2.length > 0 ? image2 : false,
                                        '3': image3.length > 0 ? image3 : false,
                                        '4': [],
                                        '7': []
                                    }]
                            };
                            const root = $xml.getTemplateLevel(data, '0');
                            const borderVisible = borders.filter(item => this.borderVisible(item));
                            const borderWidth = new Set(borderVisible.map(item => item.width));
                            const borderStyle = new Set(borderVisible.map(item => this.getBorderStyle(item)));
                            const borderData = borderVisible[0];
                            if (borderWidth.size === 1 &&
                                borderStyle.size === 1 &&
                                !(borderData.style === 'groove' || borderData.style === 'ridge')) {
                                const width = parseInt(borderData.width);
                                if (width > 2 && borderData.style === 'double') {
                                    createDoubleBorder.apply(this, [
                                        root,
                                        borderData,
                                        this.borderVisible(stored.borderTop),
                                        this.borderVisible(stored.borderRight),
                                        this.borderVisible(stored.borderBottom),
                                        this.borderVisible(stored.borderLeft)
                                    ]);
                                }
                                else {
                                    const leftTop = `-${$util$1.formatPX(width + 1)}`;
                                    const rightBottom = `-${$util$1.formatPX(width)}`;
                                    root['4'].push({
                                        'top': this.borderVisible(stored.borderTop) ? '' : leftTop,
                                        'right': this.borderVisible(stored.borderRight) ? '' : rightBottom,
                                        'bottom': this.borderVisible(stored.borderBottom) ? '' : rightBottom,
                                        'left': this.borderVisible(stored.borderLeft) ? '' : leftTop,
                                        '5': this.getShapeAttribute({ border: borderVisible[0] }, 'stroke'),
                                        '6': radius
                                    });
                                }
                            }
                            else {
                                for (let i = 0; i < borders.length; i++) {
                                    const border = borders[i];
                                    if (this.borderVisible(border)) {
                                        const width = parseInt(border.width);
                                        if (width > 2 && border.style === 'double') {
                                            createDoubleBorder.apply(this, [
                                                root,
                                                border,
                                                i === 0,
                                                i === 1,
                                                i === 2,
                                                i === 3
                                            ]);
                                        }
                                        else {
                                            const hasInset = width > 1 && (border.style === 'groove' || border.style === 'ridge');
                                            const outsetWidth = hasInset ? Math.ceil(width / 2) : width;
                                            let leftTop = `-${$util$1.formatPX(outsetWidth + 1)}`;
                                            let rightBottom = `-${$util$1.formatPX(outsetWidth)}`;
                                            root['4'].push({
                                                'top': i === 0 ? '' : leftTop,
                                                'right': i === 1 ? '' : rightBottom,
                                                'bottom': i === 2 ? '' : rightBottom,
                                                'left': i === 3 ? '' : leftTop,
                                                '5': this.getShapeAttribute({ border }, 'stroke', i, hasInset),
                                                '6': radius
                                            });
                                            if (hasInset) {
                                                leftTop = `-${$util$1.formatPX(width + 1)}`;
                                                rightBottom = `-${$util$1.formatPX(width)}`;
                                                root['7'].push({
                                                    'top': i === 0 ? '' : leftTop,
                                                    'right': i === 1 ? '' : rightBottom,
                                                    'bottom': i === 2 ? '' : rightBottom,
                                                    'left': i === 3 ? '' : leftTop,
                                                    '8': this.getShapeAttribute({ border }, 'stroke', i, true, true)
                                                });
                                            }
                                        }
                                    }
                                }
                            }
                            if (root['4'].length === 0) {
                                root['4'] = false;
                            }
                            if (root['7'].length === 0) {
                                root['7'] = false;
                            }
                        }
                        if (template) {
                            const xml = $xml.insertTemplateData(template, data);
                            for (const [name, value] of $resource.STORED.drawables.entries()) {
                                if (value === xml) {
                                    resourceName = name;
                                    break;
                                }
                            }
                            if (resourceName === '') {
                                resourceName = `${node.nodeName.toLowerCase()}_${node.nodeId}`;
                                $resource.STORED.drawables.set(resourceName, xml);
                            }
                        }
                        node.formatted($util$1.formatString(method['background'], resourceName), node.renderExtension.size === 0);
                        if (backgroundImage.length > 0) {
                            node.data('RESOURCE', 'backgroundImage', true);
                            if (this.settings.autoSizeBackgroundImage &&
                                !node.documentRoot &&
                                !node.imageElement &&
                                node.renderParent.tagName !== 'TABLE' &&
                                !node.hasBit('excludeProcedure', $enum$1.NODE_PROCEDURE.AUTOFIT)) {
                                const sizeParent = { width: 0, height: 0 };
                                backgroundDimensions.forEach(item => {
                                    if (item) {
                                        sizeParent.width = Math.max(sizeParent.width, item.width);
                                        sizeParent.height = Math.max(sizeParent.height, item.height);
                                    }
                                });
                                if (sizeParent.width === 0) {
                                    let current = node;
                                    while (current && !current.documentBody) {
                                        if (current.hasWidth) {
                                            sizeParent.width = current.bounds.width;
                                        }
                                        if (current.hasHeight) {
                                            sizeParent.height = current.bounds.height;
                                        }
                                        if (!current.pageflow || (sizeParent.width > 0 && sizeParent.height > 0)) {
                                            break;
                                        }
                                        current = current.documentParent;
                                    }
                                }
                                if (!node.has('width', $enum$1.CSS_STANDARD.UNIT)) {
                                    const width = node.bounds.width + (!node.is($enum$1.NODE_STANDARD.LINE) ? node.borderLeftWidth + node.borderRightWidth : 0);
                                    if (sizeParent.width === 0 || (width > 0 && width < sizeParent.width)) {
                                        node.css('width', $util$1.formatPX(width));
                                    }
                                }
                                if (!node.has('height', $enum$1.CSS_STANDARD.UNIT)) {
                                    const height = node.actualHeight + (!node.is($enum$1.NODE_STANDARD.LINE) ? node.borderTopWidth + node.borderBottomWidth : 0);
                                    if (sizeParent.height === 0 || (height > 0 && height < sizeParent.height)) {
                                        node.css('height', $util$1.formatPX(height));
                                        if (node.marginTop < 0) {
                                            node.modifyBox($enum$1.BOX_STANDARD.MARGIN_TOP, null);
                                        }
                                        if (node.marginBottom < 0) {
                                            node.modifyBox($enum$1.BOX_STANDARD.MARGIN_BOTTOM, null);
                                        }
                                    }
                                }
                            }
                        }
                    }
                    else if (!$dom$1.getElementCache(node.element, 'fontStyle') && $util$1.isString(stored.backgroundColor)) {
                        node.formatted($util$1.formatString(method['backgroundColor'], stored.backgroundColor), node.renderExtension.size === 0);
                    }
                }
            });
        }
        setFontStyle() {
            super.setFontStyle();
            const nodeName = {};
            this.cache
                .filter(node => node.visible &&
                !node.hasBit('excludeResource', $enum$1.NODE_RESOURCE.FONT_STYLE))
                .each(node => {
                if ($dom$1.getElementCache(node.element, 'fontStyle')) {
                    if (nodeName[node.nodeName] == null) {
                        nodeName[node.nodeName] = [];
                    }
                    nodeName[node.nodeName].push(node);
                }
                const match = node.css('textShadow').match(/(rgb(?:a)?\([0-9]{1,3}, [0-9]{1,3}, [0-9]{1,3}(?:, [0-9\.]+)?\)) ([0-9\.]+[a-z]{2}) ([0-9\.]+[a-z]{2}) ([0-9\.]+[a-z]{2})/);
                if (match) {
                    const color = $color.parseRGBA(match[1]);
                    if (color.length > 0) {
                        node.android('shadowColor', `@color/${ResourceHandler.addColor(color[0], color[2])}`);
                    }
                    node.android('shadowDx', $util$1.convertInt(match[2]).toString());
                    node.android('shadowDy', $util$1.convertInt(match[3]).toString());
                    node.android('shadowRadius', $util$1.convertInt(match[4]).toString());
                }
            });
            for (const tag in nodeName) {
                const nodes = new androme.lib.base.NodeList(nodeName[tag]);
                const sorted = [];
                for (let node of nodes) {
                    let system = false;
                    const nodeId = node.id;
                    if (node.companion && (node.companion.textElement || node.companion.tagName === 'LABEL')) {
                        node = node.companion;
                    }
                    const element = node.element;
                    const stored = Object.assign({}, $dom$1.getElementCache(element, 'fontStyle'));
                    if (Array.isArray(stored.backgroundColor) && stored.backgroundColor.length > 0) {
                        stored.backgroundColor = ResourceHandler.addColor(stored.backgroundColor[0], stored.backgroundColor[2]);
                    }
                    if (stored.fontFamily) {
                        let fontFamily = stored.fontFamily
                            .split(',')[0]
                            .replace(/"/g, '')
                            .toLowerCase()
                            .trim();
                        let fontStyle = '';
                        let fontWeight = '';
                        if (Array.isArray(stored.color) && stored.color.length > 0) {
                            stored.color = ResourceHandler.addColor(stored.color[0], stored.color[2]);
                        }
                        if (this.settings.fontAliasResourceValue && FONTREPLACE_ANDROID[fontFamily]) {
                            fontFamily = FONTREPLACE_ANDROID[fontFamily];
                        }
                        if ((FONT_ANDROID[fontFamily] && this.settings.targetAPI >= FONT_ANDROID[fontFamily]) ||
                            (this.settings.fontAliasResourceValue && FONTALIAS_ANDROID[fontFamily] && this.settings.targetAPI >= FONT_ANDROID[FONTALIAS_ANDROID[fontFamily]])) {
                            system = true;
                            stored.fontFamily = fontFamily;
                            if (stored.fontStyle === 'normal') {
                                delete stored.fontStyle;
                            }
                            if (stored.fontWeight === '400') {
                                delete stored.fontWeight;
                            }
                        }
                        else {
                            fontFamily = $util$1.convertWord(fontFamily);
                            stored.fontFamily = `@font/${fontFamily + (stored.fontStyle !== 'normal' ? `_${stored.fontStyle}` : '') + (stored.fontWeight !== '400' ? `_${FONTWEIGHT_ANDROID[stored.fontWeight] || stored.fontWeight}` : '')}`;
                            fontStyle = stored.fontStyle;
                            fontWeight = stored.fontWeight;
                            delete stored.fontStyle;
                            delete stored.fontWeight;
                        }
                        if (!system) {
                            const fonts = $resource.STORED.fonts.get(fontFamily) || {};
                            fonts[`${fontStyle}-${fontWeight}`] = true;
                            $resource.STORED.fonts.set(fontFamily, fonts);
                        }
                    }
                    const method = METHOD_ANDROID['fontStyle'];
                    const keys = Object.keys(method);
                    for (let i = 0; i < keys.length; i++) {
                        if (sorted[i] == null) {
                            sorted[i] = {};
                        }
                        const value = stored[keys[i]];
                        if ($util$1.hasValue(value)) {
                            if (node.supported('android', keys[i])) {
                                const attr = $util$1.formatString(method[keys[i]], value);
                                if (sorted[i][attr] == null) {
                                    sorted[i][attr] = [];
                                }
                                sorted[i][attr].push(nodeId);
                            }
                        }
                    }
                }
                const tagStyle = this.tagStyle[tag];
                if (tagStyle) {
                    for (let i = 0; i < tagStyle.length; i++) {
                        for (const attr in tagStyle[i]) {
                            if (sorted[i][attr]) {
                                sorted[i][attr].push(...tagStyle[i][attr]);
                            }
                            else {
                                sorted[i][attr] = tagStyle[i][attr];
                            }
                        }
                    }
                    this.tagCount[tag] += nodes.visible.length;
                }
                else {
                    this.tagCount[tag] = nodes.visible.length;
                }
                this.tagStyle[tag] = sorted;
            }
        }
        setImageSource() {
            this.cache
                .filter(node => node.visible &&
                (node.imageElement || (node.tagName === 'INPUT' && node.element.type === 'image')) &&
                !node.hasBit('excludeResource', $enum$1.NODE_RESOURCE.IMAGE_SOURCE)).each(node => {
                const element = node.element;
                if (!$dom$1.getElementCache(element, 'imageSource') || this.settings.alwaysReevaluateResources) {
                    const result = node.imageElement ? ResourceHandler.addImageSrcSet(element)
                        : ResourceHandler.addImage({ 'mdpi': element.src });
                    if (result !== '') {
                        const method = METHOD_ANDROID['imageSource'];
                        node.formatted($util$1.formatString(method['src'], result), node.renderExtension.size === 0);
                        $dom$1.setElementCache(element, 'imageSource', result);
                    }
                }
            });
        }
        setOptionArray() {
            super.setOptionArray();
            this.cache
                .filter(node => node.visible &&
                node.tagName === 'SELECT' &&
                !node.hasBit('excludeResource', $enum$1.NODE_RESOURCE.OPTION_ARRAY)).each(node => {
                const stored = $dom$1.getElementCache(node.element, 'optionArray');
                if (stored) {
                    const method = METHOD_ANDROID['optionArray'];
                    let result = [];
                    if (stored.numberArray) {
                        if (!this.settings.numberResourceValue) {
                            result = stored.numberArray;
                        }
                        else {
                            stored.stringArray = stored.numberArray;
                        }
                    }
                    if (stored.stringArray) {
                        result =
                            stored.stringArray
                                .map(value => {
                                const name = ResourceHandler.addString(value, '', this.settings);
                                return name !== '' ? `@string/${name}` : '';
                            })
                                .filter(name => name);
                    }
                    let arrayName = '';
                    const arrayValue = result.join('-');
                    for (const [storedName, storedResult] of $resource.STORED.arrays.entries()) {
                        if (arrayValue === storedResult.join('-')) {
                            arrayName = storedName;
                            break;
                        }
                    }
                    if (arrayName === '') {
                        arrayName = `${node.nodeId}_array`;
                        $resource.STORED.arrays.set(arrayName, result);
                    }
                    node.formatted($util$1.formatString(method['entries'], arrayName), node.renderExtension.size === 0);
                }
            });
        }
        setValueString() {
            super.setValueString();
            this.cache
                .filter(node => node.visible &&
                !node.hasBit('excludeResource', $enum$1.NODE_RESOURCE.VALUE_STRING))
                .each(node => {
                const stored = $dom$1.getElementCache(node.element, 'valueString');
                if (stored) {
                    if (node.renderParent.is($enum$1.NODE_STANDARD.RELATIVE)) {
                        if (node.alignParent('left', this.settings) && !$dom$1.cssParent(node.element, 'whiteSpace', 'pre', 'pre-wrap')) {
                            const value = node.textContent;
                            let leadingSpace = 0;
                            for (let i = 0; i < value.length; i++) {
                                switch (value.charCodeAt(i)) {
                                    case 32:
                                        continue;
                                    case 160:
                                        leadingSpace++;
                                        continue;
                                }
                                break;
                            }
                            if (leadingSpace === 0) {
                                stored.value = stored.value.replace(/^(\s|&#160;)+/, '');
                            }
                        }
                    }
                    if (node.hasElement && node.is($enum$1.NODE_STANDARD.TEXT)) {
                        switch (node.css('fontVariant')) {
                            case 'small-caps':
                                stored.value = stored.value.toUpperCase();
                                break;
                        }
                        const match = node.css('textDecoration').match(/(underline|line-through)/);
                        if (match) {
                            switch (match[0]) {
                                case 'underline':
                                    stored.value = `<u>${stored.value}</u>`;
                                    break;
                                case 'line-through':
                                    stored.value = `<strike>${stored.value}</strike>`;
                                    break;
                            }
                        }
                    }
                    const name = ResourceHandler.addString(stored.value, stored.name, this.settings);
                    if (name !== '') {
                        const method = METHOD_ANDROID['valueString'];
                        if (node.toInt('textIndent') + node.bounds.width > 0) {
                            node.formatted($util$1.formatString(method['text'], isNaN(parseInt(name)) || parseInt(name).toString() !== name ? `@string/${name}` : name), node.renderExtension.size === 0);
                        }
                    }
                }
            });
        }
        addTheme(template, templateData, options) {
            const map = $xml.parseTemplate(template);
            if (options.item) {
                const root = $xml.getTemplateLevel(templateData, '0');
                for (const name in options.item) {
                    let value = options.item[name];
                    const hex = $color.parseHex(value);
                    if (hex !== '') {
                        value = `@color/${ResourceHandler.addColor(hex)}`;
                    }
                    root['1'].push({ name, value });
                }
            }
            const xml = $xml.insertTemplateData(map, templateData);
            this.addFile(options.output.path, options.output.file, xml);
        }
        processFontStyle(viewData) {
            const style = {};
            const layout = {};
            const resource = {};
            const inherit = new Set();
            const mapNode = {};
            for (const tag in this.tagStyle) {
                style[tag] = {};
                layout[tag] = {};
                const count = this.tagCount[tag];
                let sorted = this.tagStyle[tag]
                    .filter((item) => Object.keys(item).length > 0)
                    .sort((a, b) => {
                    let maxA = 0;
                    let maxB = 0;
                    let countA = 0;
                    let countB = 0;
                    for (const attr in a) {
                        maxA = Math.max(a[attr].length, maxA);
                        countA += a[attr].length;
                    }
                    for (const attr in b) {
                        if (b[attr]) {
                            maxB = Math.max(b[attr].length, maxB);
                            countB += b[attr].length;
                        }
                    }
                    if (maxA !== maxB) {
                        return maxA > maxB ? -1 : 1;
                    }
                    else {
                        return countA >= countB ? -1 : 1;
                    }
                });
                do {
                    if (sorted.length === 1) {
                        for (const attr in sorted[0]) {
                            const value = sorted[0][attr];
                            if (value.length === 1) {
                                layout[tag][attr] = value;
                            }
                            else if (value.length > 1) {
                                style[tag][attr] = value;
                            }
                        }
                        sorted.length = 0;
                    }
                    else {
                        const styleKey = {};
                        const layoutKey = {};
                        for (let i = 0; i < sorted.length; i++) {
                            if (!sorted[i]) {
                                continue;
                            }
                            const filtered = {};
                            const combined = {};
                            const deleteKeys = new Set();
                            for (const attr1 in sorted[i]) {
                                const ids = sorted[i][attr1];
                                let revalidate = false;
                                if (!ids || ids.length === 0) {
                                    continue;
                                }
                                else if (ids.length === count) {
                                    styleKey[attr1] = ids.slice();
                                    sorted[i] = {};
                                    revalidate = true;
                                }
                                else if (ids.length === 1) {
                                    layoutKey[attr1] = ids.slice();
                                    sorted[i][attr1] = [];
                                    revalidate = true;
                                }
                                if (!revalidate) {
                                    const found = {};
                                    let merged = false;
                                    for (let j = 0; j < sorted.length; j++) {
                                        if (i !== j && sorted[j]) {
                                            for (const attr in sorted[j]) {
                                                const compare = sorted[j][attr];
                                                if (compare.length > 0) {
                                                    for (const nodeId of ids) {
                                                        if (compare.includes(nodeId)) {
                                                            if (found[attr] == null) {
                                                                found[attr] = [];
                                                            }
                                                            found[attr].push(nodeId);
                                                        }
                                                    }
                                                }
                                            }
                                        }
                                    }
                                    for (const attr2 in found) {
                                        if (found[attr2].length > 1) {
                                            filtered[[attr1, attr2].sort().join(';')] = found[attr2];
                                            merged = true;
                                        }
                                    }
                                    if (!merged) {
                                        filtered[attr1] = ids;
                                    }
                                }
                            }
                            for (const attr1 in filtered) {
                                for (const attr2 in filtered) {
                                    if (attr1 !== attr2 && filtered[attr1].join('') === filtered[attr2].join('')) {
                                        const index = filtered[attr1].join(',');
                                        if (combined[index]) {
                                            combined[index] = new Set([...combined[index], ...attr2.split(';')]);
                                        }
                                        else {
                                            combined[index] = new Set([...attr1.split(';'), ...attr2.split(';')]);
                                        }
                                        deleteKeys
                                            .add(attr1)
                                            .add(attr2);
                                    }
                                }
                            }
                            deleteKeys.forEach(value => delete filtered[value]);
                            for (const attrs in filtered) {
                                this.deleteStyleAttribute(sorted, attrs, filtered[attrs]);
                                style[tag][attrs] = filtered[attrs];
                            }
                            for (const index in combined) {
                                const attrs = Array
                                    .from(combined[index])
                                    .sort()
                                    .join(';');
                                const ids = index
                                    .split(',')
                                    .map(value => parseInt(value));
                                this.deleteStyleAttribute(sorted, attrs, ids);
                                style[tag][attrs] = ids;
                            }
                        }
                        const shared = Object.keys(styleKey);
                        if (shared.length > 0) {
                            if (shared.length > 1 || styleKey[shared[0]].length > 1) {
                                style[tag][shared.join(';')] = styleKey[shared[0]];
                            }
                            else {
                                Object.assign(layoutKey, styleKey);
                            }
                        }
                        for (const attr in layoutKey) {
                            layout[tag][attr] = layoutKey[attr];
                        }
                        for (let i = 0; i < sorted.length; i++) {
                            if (sorted[i] && Object.keys(sorted[i]).length === 0) {
                                delete sorted[i];
                            }
                        }
                        sorted =
                            sorted.filter((item) => {
                                if (item) {
                                    for (const attr in item) {
                                        if (item[attr] && item[attr].length > 0) {
                                            return true;
                                        }
                                    }
                                }
                                return false;
                            });
                    }
                } while (sorted.length > 0);
            }
            for (const tagName in style) {
                const tag = style[tagName];
                const tagData = [];
                for (const attributes in tag) {
                    tagData.push({
                        name: '',
                        attributes,
                        ids: tag[attributes]
                    });
                }
                tagData.sort((a, b) => {
                    let [c, d] = [a.ids.length, b.ids.length];
                    if (c === d) {
                        [c, d] = [a.attributes.split(';').length, b.attributes.split(';').length];
                    }
                    return (c >= d ? -1 : 1);
                });
                tagData.forEach((item, index) => item.name = $util$1.capitalize(tagName) + (index > 0 ? `_${index}` : ''));
                resource[tagName] = tagData;
            }
            for (const tagName in resource) {
                for (const group of resource[tagName]) {
                    for (const id of group.ids) {
                        if (mapNode[id] == null) {
                            mapNode[id] = { styles: [], attributes: [] };
                        }
                        mapNode[id].styles.push(group.name);
                    }
                }
                const tagData = layout[tagName];
                if (tagData) {
                    for (const attr in tagData) {
                        for (const id of tagData[attr]) {
                            if (mapNode[id] == null) {
                                mapNode[id] = { styles: [], attributes: [] };
                            }
                            mapNode[id].attributes.push(attr);
                        }
                    }
                }
            }
            for (const id in mapNode) {
                const node = viewData.cache.locate('id', parseInt(id));
                if (node) {
                    const styles = mapNode[id].styles;
                    const attrs = mapNode[id].attributes;
                    if (styles.length > 0) {
                        inherit.add(styles.join('.'));
                        node.attr('_', 'style', `@style/${styles.pop()}`);
                    }
                    if (attrs.length > 0) {
                        attrs.sort().forEach(value => node.formatted(replaceUnit(value, this.settings, true), false));
                    }
                }
            }
            for (const styles of inherit) {
                let parent = '';
                styles
                    .split('.')
                    .forEach(value => {
                    const match = value.match(/^(\w*?)(?:_([0-9]+))?$/);
                    if (match) {
                        const tagData = resource[match[1].toUpperCase()][match[2] == null ? 0 : parseInt(match[2])];
                        $resource.STORED.styles.set(value, { parent, attributes: tagData.attributes });
                        parent = value;
                    }
                });
            }
        }
        deleteStyleAttribute(sorted, attrs, ids) {
            attrs
                .split(';')
                .forEach(value => {
                for (let i = 0; i < sorted.length; i++) {
                    if (sorted[i]) {
                        let index = -1;
                        let key = '';
                        for (const j in sorted[i]) {
                            if (j === value) {
                                index = i;
                                key = j;
                                i = sorted.length;
                                break;
                            }
                        }
                        if (index !== -1) {
                            sorted[index][key] = sorted[index][key].filter((id) => !ids.includes(id));
                            if (sorted[index][key].length === 0) {
                                delete sorted[index][key];
                            }
                            break;
                        }
                    }
                }
            });
        }
        getShapeAttribute(stored, name, direction = -1, hasInset = false, isInset = false) {
            switch (name) {
                case 'stroke':
                    if (stored.border && stored.border.width !== '0px') {
                        if (!hasInset || isInset) {
                            return [{ width: stored.border.width, borderStyle: this.getBorderStyle(stored.border, (isInset ? direction : -1)) }];
                        }
                        else if (hasInset) {
                            return [{ width: $util$1.formatPX(Math.ceil(parseInt(stored.border.width) / 2)), borderStyle: this.getBorderStyle(stored.border, direction, true) }];
                        }
                    }
                    return false;
                case 'backgroundColor':
                    return stored.backgroundColor.length !== 0 && stored.backgroundColor !== '' ? [{ color: stored.backgroundColor }] : false;
                case 'radius':
                    if (stored.borderRadius.length === 1) {
                        if (stored.borderRadius[0] !== '0px') {
                            return [{ radius: stored.borderRadius[0] }];
                        }
                    }
                    else if (stored.borderRadius.length > 1) {
                        const result = {};
                        stored.borderRadius.forEach((value, index) => result[`${['topLeft', 'topRight', 'bottomRight', 'bottomLeft'][index]}Radius`] = value);
                        return [result];
                    }
                    return false;
            }
            return false;
        }
        getBorderStyle(border, direction = -1, halfSize = false) {
            const result = {
                solid: `android:color="@color/${border.color}"`,
                groove: '',
                ridge: ''
            };
            Object.assign(result, {
                double: result.solid,
                inset: result.solid,
                outset: result.solid,
                dotted: `${result.solid} android:dashWidth="3px" android:dashGap="1px"`,
                dashed: `${result.solid} android:dashWidth="1px" android:dashGap="1px"`
            });
            const groove = border.style === 'groove';
            if (parseInt(border.width) > 1 && (groove || border.style === 'ridge')) {
                let colorName = border.color;
                let hexValue = ResourceHandler.getColor(colorName);
                if (hexValue !== '') {
                    let opacity = '1';
                    if (hexValue.length === 9) {
                        hexValue = `#${hexValue.substring(3)}`;
                        opacity = `0.${hexValue.substring(1, 3)}`;
                    }
                    const reduced = $color.parseRGBA($color.reduceHexToRGB(hexValue, groove || hexValue === '#000000' ? 0.3 : -0.3));
                    if (reduced.length > 0) {
                        colorName = ResourceHandler.addColor(reduced[0], opacity);
                    }
                }
                const colorReduced = `android:color="@color/${colorName}"`;
                if (groove) {
                    if (halfSize) {
                        switch (direction) {
                            case 0:
                                result['groove'] = colorReduced;
                                break;
                            case 1:
                                result['groove'] = colorReduced;
                                break;
                            case 2:
                                result['groove'] = result.solid;
                                break;
                            case 3:
                                result['groove'] = result.solid;
                                break;
                        }
                    }
                    else {
                        switch (direction) {
                            case 0:
                                result['groove'] = result.solid;
                                break;
                            case 1:
                                result['groove'] = result.solid;
                                break;
                            case 2:
                                result['groove'] = colorReduced;
                                break;
                            case 3:
                                result['groove'] = colorReduced;
                                break;
                        }
                    }
                }
                else {
                    if (halfSize) {
                        switch (direction) {
                            case 0:
                                result['ridge'] = result.solid;
                                break;
                            case 1:
                                result['ridge'] = result.solid;
                                break;
                            case 2:
                                result['ridge'] = colorReduced;
                                break;
                            case 3:
                                result['ridge'] = colorReduced;
                                break;
                        }
                    }
                    else {
                        switch (direction) {
                            case 0:
                                result['ridge'] = colorReduced;
                                break;
                            case 1:
                                result['ridge'] = colorReduced;
                                break;
                            case 2:
                                result['ridge'] = result.solid;
                                break;
                            case 3:
                                result['ridge'] = result.solid;
                                break;
                        }
                    }
                }
            }
            return result[border.style] || result.solid;
        }
    }

    var BASE_TMPL = '<?xml version="1.0" encoding="utf-8"?>\n{:0}';

    var $enum$2 = androme.lib.enumeration;
    var $util$2 = androme.lib.util;
    var $dom$2 = androme.lib.dom;
    var $xml$1 = androme.lib.xml;
    var $nodelist$1 = androme.lib.base.NodeList;
    const MAP_LAYOUT = {
        relativeParent: {
            top: 'layout_alignParentTop',
            bottom: 'layout_alignParentBottom'
        },
        relative: {
            top: 'layout_alignTop',
            bottom: 'layout_alignBottom',
            baseline: 'layout_alignBaseline',
            bottomTop: 'layout_above',
            topBottom: 'layout_below'
        },
        constraint: {
            top: 'layout_constraintTop_toTopOf',
            bottom: 'layout_constraintBottom_toBottomOf',
            baseline: 'layout_constraintBaseline_toBaselineOf',
            bottomTop: 'layout_constraintBottom_toTopOf',
            topBottom: 'layout_constraintTop_toBottomOf'
        }
    };
    const MAP_CHAIN = {
        leftTop: ['left', 'top'],
        rightBottom: ['right', 'bottom'],
        rightLeftBottomTop: ['rightLeft', 'bottomTop'],
        leftRightTopBottom: ['leftRight', 'topBottom'],
        widthHeight: ['Width', 'Height'],
        horizontalVertical: ['Horizontal', 'Vertical']
    };
    class ViewController extends androme.lib.base.Controller {
        constructor() {
            super();
            this._merge = {};
            resetId();
        }
        initNode(node) {
            node.api = this.settings.targetAPI;
        }
        finalize(data) {
            this.setAttributes(data);
            for (const value of [...data.views, ...data.includes]) {
                value.content = $xml$1.removePlaceholders(value.content).replace(/\n\n/g, '\n');
                if (this.settings.dimensResourceValue) {
                    value.content = this.parseDimensions(value.content);
                }
                value.content = replaceUnit(value.content, this.settings);
                value.content = $xml$1.replaceTab(value.content, this.settings);
            }
        }
        reset() {
            super.reset();
            resetId();
            this._merge = {};
        }
        setConstraints() {
            Object.assign(MAP_LAYOUT.relativeParent, {
                left: parseRTL('layout_alignParentLeft', this.settings),
                right: parseRTL('layout_alignParentRight', this.settings)
            });
            Object.assign(MAP_LAYOUT.relative, {
                left: parseRTL('layout_alignLeft', this.settings),
                right: parseRTL('layout_alignRight', this.settings),
                leftRight: parseRTL('layout_toRightOf', this.settings),
                rightLeft: parseRTL('layout_toLeftOf', this.settings)
            });
            Object.assign(MAP_LAYOUT.constraint, {
                left: parseRTL('layout_constraintLeft_toLeftOf', this.settings),
                right: parseRTL('layout_constraintRight_toRightOf', this.settings),
                leftRight: parseRTL('layout_constraintLeft_toRightOf', this.settings),
                rightLeft: parseRTL('layout_constraintRight_toLeftOf', this.settings)
            });
            const relativeParent = MAP_LAYOUT.relativeParent;
            let mapLayout;
            let constraint = false;
            let relative = false;
            function mapParent(node, direction) {
                if (constraint) {
                    return node.app(mapLayout[direction]) === 'parent';
                }
                else {
                    return node.android(relativeParent[direction]) === 'true';
                }
            }
            function mapSibling(node, direction) {
                return node[constraint ? 'app' : 'android'](mapLayout[direction]);
            }
            function mapDelete(node, ...direction) {
                node.delete(constraint ? 'app' : 'android', ...direction.map(value => mapLayout[value]));
            }
            function anchoredSibling(node, nodes, orientation) {
                if (!node.constraint[orientation]) {
                    let parent = node;
                    while (parent) {
                        const stringId = mapSibling(parent, (orientation === AXIS_ANDROID.HORIZONTAL ? 'leftRight' : 'topBottom'));
                        if (stringId) {
                            parent = nodes.locate('nodeId', stripId(stringId));
                            if (parent && parent.constraint[orientation]) {
                                return true;
                            }
                        }
                        else {
                            parent = null;
                        }
                    }
                    return false;
                }
                return true;
            }
            for (const node of this.cache.visible) {
                relative = node.is($enum$2.NODE_STANDARD.RELATIVE);
                constraint = node.is($enum$2.NODE_STANDARD.CONSTRAINT);
                const flex = node.flex;
                if (relative || constraint || flex.enabled) {
                    const nodes = new androme.lib.base.NodeList(node.renderChildren.filter(item => item.auto), node);
                    const cleared = $nodelist$1.cleared(node.initial.children);
                    if (relative) {
                        mapLayout = MAP_LAYOUT.relative;
                        const rows = [];
                        const baseline = [];
                        const textIndent = node.toInt('textIndent');
                        const noWrap = node.css('whiteSpace') === 'nowrap';
                        let boxWidth = node.box.width;
                        if (node.renderParent.overflowX) {
                            boxWidth = node.viewWidth || boxWidth || node.renderParent.toInt('width', 0, { map: 'initial' });
                        }
                        else if (node.renderParent.hasAlign($enum$2.NODE_ALIGNMENT.FLOAT)) {
                            const minLeft = Math.min.apply(null, nodes.list.map(item => item.linear.left));
                            const maxRight = Math.max.apply(null, nodes.list.map(item => item.linear.right));
                            boxWidth = maxRight - minLeft;
                        }
                        else {
                            const floatEnd = Math.max.apply(null, node.documentParent
                                .initial.children
                                .filter(item => item.float === 'left' && item.siblingIndex < node.siblingIndex)
                                .map(item => item.linear.right));
                            if (nodes.list.some(item => item.linear.left === floatEnd)) {
                                boxWidth = node.box.right - floatEnd;
                            }
                        }
                        boxWidth = Math.ceil(boxWidth);
                        let rowWidth = 0;
                        let rowPaddingLeft = 0;
                        let rowPreviousLeft = null;
                        let rowPreviousBottom = null;
                        if (textIndent < 0 && Math.abs(textIndent) <= node.paddingLeft) {
                            rowPaddingLeft = Math.abs(textIndent);
                            node.modifyBox($enum$2.BOX_STANDARD.PADDING_LEFT, node.paddingLeft + textIndent);
                            node.modifyBox($enum$2.BOX_STANDARD.PADDING_LEFT, null);
                        }
                        for (let i = 0; i < nodes.length; i++) {
                            const current = nodes.get(i);
                            const previous = nodes.get(i - 1);
                            let dimension = current.bounds;
                            if (current.inlineText && !current.hasWidth) {
                                const [bounds, multiLine] = $dom$2.getRangeClientRect(current.element);
                                if (bounds && (multiLine || bounds.width < dimension.width)) {
                                    dimension = bounds;
                                }
                            }
                            const sideParent = relativeParent[(current.float === 'right' ? 'right' : 'left')];
                            const sideSibling = mapLayout[(current.float === 'right' ? 'rightLeft' : 'leftRight')];
                            if (i === 0) {
                                current.android(sideParent, 'true');
                                if (!node.inline && textIndent > 0) {
                                    current.modifyBox($enum$2.BOX_STANDARD.MARGIN_LEFT, textIndent);
                                }
                                if (!current.siblingflow ||
                                    (current.floating && current.position === 'relative') ||
                                    (current.multiLine && textIndent < 0)) {
                                    rowPreviousLeft = current;
                                }
                                rows[rows.length] = [current];
                            }
                            else {
                                const items = rows[rows.length - 1];
                                const siblings = $dom$2.getElementsBetweenSiblings(previous.baseElement, current.baseElement, false, true);
                                const viewGroup = current instanceof ViewGroup && !current.hasAlign($enum$2.NODE_ALIGNMENT.SEGMENTED);
                                const previousSibling = current.previousSibling();
                                const baseWidth = rowWidth + current.marginLeft + dimension.width;
                                let connected = false;
                                if (i === 1 && previous.textElement && current.textElement) {
                                    connected = siblings.length === 0 && !/\s+$/.test(previous.textContent) && !/^\s+/.test(current.textContent);
                                }
                                if (!noWrap &&
                                    !connected &&
                                    !['SUP', 'SUB'].includes(current.tagName) &&
                                    (previous.float !== 'left' || current.linear.top >= previous.linear.bottom) && ((current.float !== 'right' && baseWidth - (current.hasElement && current.inlineStatic ? current.paddingLeft + current.paddingRight : 0) > boxWidth) ||
                                    (current.multiLine && $dom$2.hasLineBreak(current.element)) ||
                                    (previous.multiLine && previous.textContent.trim() !== '' && !/^\s*\n+/.test(previous.textContent) && !/\n+\s*$/.test(previous.textContent) && $dom$2.hasLineBreak(previous.element)) ||
                                    (previousSibling && previousSibling.lineBreak) ||
                                    current.blockStatic ||
                                    cleared.has(current) ||
                                    viewGroup ||
                                    (current.floating && ((current.float === 'left' && $util$2.withinFraction(current.linear.left, node.box.left)) ||
                                        (current.float === 'right' && $util$2.withinFraction(current.linear.right, node.box.right)) ||
                                        current.linear.top >= previous.linear.bottom)) ||
                                    (siblings.length > 0 && siblings.some(element => $dom$2.isLineBreak(element))))) {
                                    rowPreviousBottom = items.filter(item => !item.floating)[0] || items[0];
                                    for (let j = 0; j < items.length; j++) {
                                        if (items[j] !== rowPreviousBottom &&
                                            items[j].linear.bottom > rowPreviousBottom.linear.bottom && (!items[j].floating ||
                                            (items[j].floating && rowPreviousBottom.floating))) {
                                            rowPreviousBottom = items[j];
                                        }
                                    }
                                    if (viewGroup || (previous instanceof ViewGroup && i === nodes.length - 1)) {
                                        current.constraint.marginVertical = rowPreviousBottom.stringId;
                                    }
                                    current.anchor(mapLayout['topBottom'], rowPreviousBottom.stringId);
                                    if (rowPreviousLeft &&
                                        current.linear.top < rowPreviousLeft.bounds.bottom &&
                                        !$util$2.withinRange(current.bounds.top, rowPreviousLeft.bounds.top, 1) &&
                                        !$util$2.withinRange(current.bounds.bottom, rowPreviousLeft.bounds.bottom, 1)) {
                                        current.anchor(sideSibling, rowPreviousLeft.stringId);
                                    }
                                    else {
                                        current.anchor(sideParent, 'true');
                                        rowPreviousLeft = null;
                                    }
                                    if (this.settings.ellipsisOnTextOverflow && previous.linearHorizontal) {
                                        this.checkSingleLine(previous.children[previous.children.length - 1], true);
                                    }
                                    if (rowPaddingLeft > 0) {
                                        if (this.settings.ellipsisOnTextOverflow &&
                                            rows.length === 1 &&
                                            rows[0].length === 1 &&
                                            rows[0][0].textElement) {
                                            this.checkSingleLine(rows[0][0], true);
                                        }
                                        current.modifyBox($enum$2.BOX_STANDARD.PADDING_LEFT, rowPaddingLeft);
                                    }
                                    this.adjustBaseline(baseline);
                                    node.alignmentType ^= $enum$2.NODE_ALIGNMENT.HORIZONTAL;
                                    node.alignmentType |= $enum$2.NODE_ALIGNMENT.MULTILINE;
                                    rowWidth = 0;
                                    baseline.length = 0;
                                    rows.push([current]);
                                }
                                else {
                                    if (i === 1 && rowPaddingLeft > 0 && !previous.plainText) {
                                        current.anchor(sideParent, 'true');
                                        current.modifyBox($enum$2.BOX_STANDARD.PADDING_LEFT, rowPaddingLeft);
                                    }
                                    else {
                                        current.anchor(sideSibling, previous.stringId);
                                    }
                                    if (connected || baseWidth > boxWidth) {
                                        this.checkSingleLine(current);
                                    }
                                    if (rowPreviousBottom) {
                                        current.anchor(mapLayout['topBottom'], rowPreviousBottom.stringId);
                                    }
                                    items.push(current);
                                }
                            }
                            rowWidth += dimension.width + current.marginLeft + current.marginRight + (previous && !previous.floating && !previous.plainText && !previous.preserveWhiteSpace &&
                                previous.textContent.trim() !== '' && !/\s+$/.test(previous.textContent) &&
                                !current.floating && !current.plainText && !current.preserveWhiteSpace &&
                                current.textContent.trim() !== '' && !/^\s+/.test(current.textContent) ? this.settings.whitespaceHorizontalOffset : 0);
                            if (!current.floating) {
                                baseline.push(current);
                            }
                        }
                        this.adjustBaseline(baseline);
                        if (node.marginTop < 0 && nodes.get(0).position === 'relative') {
                            rows[0].forEach((item, index) => item.modifyBox($enum$2.BOX_STANDARD.MARGIN_TOP, node.marginTop * (index === 0 ? 1 : -1), true));
                        }
                        if (rows.length === 1 && node.baseline) {
                            rows[0].forEach(item => {
                                switch (item.css('verticalAlign')) {
                                    case 'top':
                                        item.anchor(relativeParent['top'], 'true');
                                        break;
                                    case 'middle':
                                        item.anchor('layout_centerVertical', 'true');
                                        rows[0].forEach(subitem => {
                                            if (subitem !== item && subitem.bounds.height < item.bounds.height) {
                                                subitem.anchor('layout_centerVertical', 'true');
                                            }
                                        });
                                        break;
                                }
                            });
                        }
                        if (this.settings.ellipsisOnTextOverflow) {
                            const widthParent = !node.ascend().some(parent => parent.hasWidth);
                            if ((rows.length === 1 || node.hasAlign($enum$2.NODE_ALIGNMENT.HORIZONTAL)) && !node.ascend(true).some(item => item.is($enum$2.NODE_STANDARD.GRID))) {
                                for (let i = 1; i < nodes.length; i++) {
                                    const item = nodes.get(i);
                                    if (!item.multiLine && !item.floating && !item.alignParent('left', this.settings)) {
                                        this.checkSingleLine(item, false, widthParent);
                                    }
                                }
                            }
                            else {
                                for (const row of rows) {
                                    if (row.length > 1) {
                                        const item = row[row.length - 1];
                                        if (item.inlineText) {
                                            this.checkSingleLine(item, false, widthParent);
                                        }
                                    }
                                }
                            }
                        }
                    }
                    else {
                        mapLayout = MAP_LAYOUT.constraint;
                        if (node.hasAlign($enum$2.NODE_ALIGNMENT.HORIZONTAL)) {
                            const optimal = $nodelist$1.textBaseline(nodes.list)[0];
                            const baseline = nodes.list
                                .filter(item => item.textElement && item.baseline)
                                .sort((a, b) => a.bounds.height >= b.bounds.height ? -1 : 1);
                            let images = nodes.list
                                .filter(item => item.imageElement && item.baseline)
                                .sort((a, b) => a.bounds.height >= b.bounds.height ? -1 : 1);
                            if (images.length > 0) {
                                const tallest = images[0];
                                images.forEach((item, index) => index > 0 && item.app(mapLayout['baseline'], tallest.stringId));
                                if (!optimal.imageElement) {
                                    optimal.app(mapLayout['bottom'], tallest.stringId);
                                }
                                images = images.filter(item => item !== tallest);
                            }
                            for (let i = 0; i < nodes.length; i++) {
                                const current = nodes.get(i);
                                let alignWith = optimal;
                                if (i === 0) {
                                    current.app(mapLayout['left'], 'parent');
                                }
                                else {
                                    const previous = nodes.get(i - 1);
                                    current.app(mapLayout['leftRight'], previous.stringId);
                                    if (!previous.floating && !current.floating) {
                                        current.constraint.marginHorizontal = previous.stringId;
                                    }
                                }
                                if (images.includes(current)) {
                                    continue;
                                }
                                let verticalAlign = current.css('verticalAlign');
                                if (verticalAlign === 'baseline' && (current.controlName === 'RadioGroup' ||
                                    current.tagName === 'TEXTAREA')) {
                                    verticalAlign = 'text-bottom';
                                }
                                if (!alignWith ||
                                    verticalAlign.startsWith('text') ||
                                    optimal === current) {
                                    baseline.some(item => {
                                        if (item !== current) {
                                            alignWith = item;
                                            return true;
                                        }
                                        return false;
                                    });
                                    if (!alignWith) {
                                        nodes.list
                                            .slice()
                                            .sort((a, b) => a.nodeType <= b.nodeType ? -1 : 1)
                                            .some(item => {
                                            if (item !== current) {
                                                alignWith = item;
                                                return true;
                                            }
                                            return false;
                                        });
                                    }
                                }
                                switch (verticalAlign) {
                                    case 'text-top':
                                        if (alignWith) {
                                            current.app(mapLayout['top'], alignWith.stringId);
                                        }
                                        break;
                                    case 'top':
                                        current.app(mapLayout['top'], 'parent');
                                        break;
                                    case 'middle':
                                        this.setAlignParent(current, AXIS_ANDROID.VERTICAL);
                                        break;
                                    case 'baseline':
                                        if (alignWith) {
                                            current.app(mapLayout['baseline'], alignWith.stringId);
                                        }
                                        break;
                                    case 'text-bottom':
                                        if (alignWith) {
                                            current.app(mapLayout['bottom'], alignWith.stringId);
                                        }
                                        break;
                                    case 'bottom':
                                        current.app(mapLayout['bottom'], 'parent');
                                        break;
                                }
                            }
                        }
                        else {
                            const [absolute, pageflow] = nodes.partition(item => !item.pageflow || (item.position === 'relative' && item.alignNegative));
                            const percentage = node.hasAlign($enum$2.NODE_ALIGNMENT.PERCENT);
                            const columnCount = node.toInt('columnCount');
                            if (percentage) {
                                node.android('layout_width', 'match_parent');
                            }
                            else if (columnCount === 0) {
                                for (const current of pageflow) {
                                    const parent = current.documentParent;
                                    if (current.autoMarginHorizontal) {
                                        this.setAlignParent(current, AXIS_ANDROID.HORIZONTAL);
                                    }
                                    else {
                                        if (current.linear.left <= parent.box.left || $util$2.withinFraction(current.linear.left, parent.box.left)) {
                                            current.anchor(mapLayout['left'], 'parent', AXIS_ANDROID.HORIZONTAL);
                                        }
                                        if (current.linear.right >= parent.box.right || $util$2.withinFraction(current.linear.right, parent.box.right)) {
                                            current.anchor(mapLayout['right'], 'parent', parent.hasWidth || current.float === 'right' || current.autoMarginLeft ? AXIS_ANDROID.HORIZONTAL : '');
                                        }
                                    }
                                    if (current.linear.top <= parent.box.top || $util$2.withinFraction(current.linear.top, parent.box.top)) {
                                        current.anchor(mapLayout['top'], 'parent', AXIS_ANDROID.VERTICAL);
                                    }
                                    else if (current.linear.bottom >= parent.box.bottom || $util$2.withinFraction(current.linear.bottom, parent.box.bottom)) {
                                        current.anchor(mapLayout['bottom'], 'parent', parent.hasHeight ? AXIS_ANDROID.VERTICAL : '');
                                    }
                                    for (const adjacent of pageflow) {
                                        if (current !== adjacent) {
                                            const stringId = adjacent.stringId;
                                            const horizontal = anchoredSibling(adjacent, nodes, AXIS_ANDROID.HORIZONTAL) ? AXIS_ANDROID.HORIZONTAL : '';
                                            const vertical = anchoredSibling(adjacent, nodes, AXIS_ANDROID.VERTICAL) ? AXIS_ANDROID.VERTICAL : '';
                                            const intersectY = current.intersectY(adjacent.linear);
                                            const alignOrigin = current.alignOrigin && adjacent.alignOrigin;
                                            if (!current.hasWidth &&
                                                current.linear.left === adjacent.linear.left &&
                                                current.linear.right === adjacent.linear.right) {
                                                if (!mapParent(current, 'right')) {
                                                    current.anchor(mapLayout['left'], stringId);
                                                }
                                                if (!mapParent(current, 'left')) {
                                                    current.anchor(mapLayout['right'], stringId);
                                                }
                                            }
                                            if ($util$2.withinFraction(current.linear.left, adjacent.linear.right) || (alignOrigin && $util$2.withinRange(current.linear.left, adjacent.linear.right, this.settings.whitespaceHorizontalOffset))) {
                                                if (current.float !== 'right' || current.float === adjacent.float) {
                                                    current.anchor(mapLayout['leftRight'], stringId, horizontal, current.withinX(adjacent.linear));
                                                }
                                            }
                                            if ($util$2.withinFraction(current.linear.right, adjacent.linear.left) || (alignOrigin && $util$2.withinRange(current.linear.right, adjacent.linear.left, this.settings.whitespaceHorizontalOffset))) {
                                                current.anchor(mapLayout['rightLeft'], stringId, horizontal, current.withinX(adjacent.linear));
                                            }
                                            const topParent = mapParent(current, 'top');
                                            const bottomParent = mapParent(current, 'bottom');
                                            const blockElement = !flex.enabled && !current.inlineElement;
                                            if ($util$2.withinFraction(current.linear.top, adjacent.linear.bottom) || (alignOrigin && $util$2.withinRange(current.linear.top, adjacent.linear.bottom, this.settings.whitespaceVerticalOffset))) {
                                                if (intersectY || !bottomParent || blockElement) {
                                                    current.anchor(mapLayout['topBottom'], stringId, vertical, intersectY);
                                                }
                                            }
                                            if ($util$2.withinFraction(current.linear.bottom, adjacent.linear.top) || (alignOrigin && $util$2.withinRange(current.linear.bottom, adjacent.linear.top, this.settings.whitespaceVerticalOffset))) {
                                                if (intersectY || !topParent || blockElement) {
                                                    current.anchor(mapLayout['bottomTop'], stringId, vertical, intersectY);
                                                }
                                            }
                                            if (!topParent && !bottomParent) {
                                                if (current.linear.top === adjacent.linear.top) {
                                                    current.anchor(mapLayout['top'], stringId, vertical);
                                                }
                                                if (current.linear.bottom === adjacent.linear.bottom) {
                                                    current.anchor(mapLayout['bottom'], stringId, vertical);
                                                }
                                            }
                                        }
                                    }
                                }
                                for (const current of pageflow) {
                                    const leftRight = mapSibling(current, 'leftRight');
                                    if (leftRight) {
                                        if (!current.constraint.horizontal) {
                                            current.constraint.horizontal = flex.enabled || anchoredSibling(current, nodes, AXIS_ANDROID.HORIZONTAL);
                                        }
                                        current.constraint.marginHorizontal = leftRight;
                                    }
                                    const topBottom = mapSibling(current, 'topBottom');
                                    if (topBottom) {
                                        if (!current.constraint.vertical) {
                                            current.constraint.vertical = flex.enabled || anchoredSibling(current, nodes, AXIS_ANDROID.VERTICAL);
                                        }
                                        current.constraint.marginVertical = topBottom;
                                        mapDelete(current, 'top');
                                    }
                                    if (mapParent(current, 'left') && mapParent(current, 'right')) {
                                        if (current.autoMargin) {
                                            if (current.autoMarginLeft) {
                                                mapDelete(current, 'left');
                                            }
                                            if (current.autoMarginRight) {
                                                mapDelete(current, 'right');
                                            }
                                            if (current.autoMarginHorizontal) {
                                                if (node.hasWidth && !current.has('width', $enum$2.CSS_STANDARD.PERCENT)) {
                                                    current.android('layout_width', 'match_parent');
                                                }
                                                else if (current.inlineElement && !current.hasWidth) {
                                                    current.android('layout_width', 'wrap_content');
                                                }
                                            }
                                        }
                                        else if (current.floating) {
                                            mapDelete(current, current.float === 'right' ? 'left' : 'right');
                                        }
                                        else if (current.inlineElement) {
                                            if (current.nodeType <= $enum$2.NODE_STANDARD.IMAGE) {
                                                switch (current.css('textAlign')) {
                                                    case 'center':
                                                        break;
                                                    case 'right':
                                                    case 'end':
                                                        mapDelete(current, 'left');
                                                        break;
                                                    default:
                                                        mapDelete(current, 'right');
                                                        break;
                                                }
                                            }
                                            else {
                                                mapDelete(current, 'right');
                                            }
                                        }
                                        else {
                                            mapDelete(current, 'right');
                                            current.android('layout_width', 'match_parent');
                                        }
                                    }
                                    if (mapSibling(current, 'bottomTop')) {
                                        mapDelete(current, 'bottom');
                                    }
                                    if (current.plainText || (!current.hasElement && current.renderChildren.some(item => item.textElement))) {
                                        const textAlign = current.cssParent('textAlign');
                                        if (textAlign === 'right') {
                                            current.anchor(mapLayout['right'], 'parent', AXIS_ANDROID.HORIZONTAL);
                                            current.constraint.horizontal = true;
                                        }
                                        else if (textAlign === 'center') {
                                            current.constraint.horizontal = false;
                                            this.setAlignParent(current, AXIS_ANDROID.HORIZONTAL);
                                        }
                                    }
                                }
                                for (let i = 0; i < pageflow.length; i++) {
                                    const current = pageflow.get(i);
                                    if (!current.anchored) {
                                        const result = $util$2.searchObject(current.get('app'), '*constraint*');
                                        for (const [key, value] of result) {
                                            if (value !== 'parent' && pageflow.filter(item => item.anchored).locate('stringId', value)) {
                                                if ($util$2.indexOf(key, parseRTL('Left', this.settings), parseRTL('Right', this.settings)) !== -1) {
                                                    current.constraint.horizontal = true;
                                                }
                                                if ($util$2.indexOf(key, 'Top', 'Bottom', 'Baseline', 'above', 'below') !== -1) {
                                                    current.constraint.vertical = true;
                                                }
                                            }
                                        }
                                        if (current.anchored) {
                                            i = -1;
                                        }
                                    }
                                }
                                if (absolute.length > 0) {
                                    for (const current of absolute) {
                                        let alignMarginLeft = false;
                                        if (current.right != null && current.toInt('right') >= 0) {
                                            current.anchor(mapLayout['right'], 'parent', AXIS_ANDROID.HORIZONTAL);
                                            if (current.toInt('left') > 0) {
                                                current.anchor(mapLayout['left'], 'parent');
                                                current.modifyBox($enum$2.BOX_STANDARD.MARGIN_LEFT, current.toInt('left'));
                                                alignMarginLeft = true;
                                            }
                                        }
                                        if (!alignMarginLeft && current.left != null && current.toInt('left') === 0) {
                                            current.anchor(mapLayout['left'], 'parent', AXIS_ANDROID.HORIZONTAL);
                                            if (current.toInt('right') > 0) {
                                                current.anchor(mapLayout['right'], 'parent');
                                                current.modifyBox($enum$2.BOX_STANDARD.MARGIN_RIGHT, current.toInt('right'));
                                            }
                                        }
                                        if (current.top != null && current.toInt('top') === 0) {
                                            current.anchor(mapLayout['top'], 'parent', AXIS_ANDROID.VERTICAL);
                                        }
                                        if (current.bottom != null && current.toInt('bottom') >= 0) {
                                            current.anchor(mapLayout['bottom'], 'parent', AXIS_ANDROID.VERTICAL);
                                        }
                                        if (current.left === 0 &&
                                            current.right === 0 &&
                                            !current.floating &&
                                            !current.has('width', $enum$2.CSS_STANDARD.PERCENT)) {
                                            current.android('layout_width', 'match_parent');
                                        }
                                        if (current.top === 0 && current.bottom === 0) {
                                            current.android('layout_height', 'match_parent');
                                        }
                                    }
                                }
                            }
                            if (flex.enabled ||
                                columnCount > 0 ||
                                (!this.settings.constraintChainDisabled && pageflow.length > 1)) {
                                const horizontal = [];
                                const vertical = [];
                                if (flex.enabled) {
                                    if (flex.wrap === 'nowrap') {
                                        switch (flex.direction) {
                                            case 'row-reverse':
                                                const row = pageflow.clone();
                                                row.list.reverse();
                                                horizontal.push(row);
                                                break;
                                            case 'row':
                                                horizontal.push(pageflow.clone());
                                                break;
                                            case 'column-reverse':
                                                const column = pageflow.clone();
                                                column.list.reverse();
                                                vertical.push(column);
                                                break;
                                            case 'column':
                                                vertical.push(pageflow.clone());
                                                break;
                                        }
                                    }
                                    else {
                                        const sorted = pageflow.clone();
                                        const map = {};
                                        const levels = [];
                                        function reverseMap() {
                                            for (const y in map) {
                                                map[y].reverse();
                                            }
                                        }
                                        switch (flex.direction) {
                                            case 'row-reverse':
                                            case 'column-reverse':
                                                sorted.list.reverse();
                                                break;
                                        }
                                        for (const item of sorted) {
                                            const y = item.linear.top;
                                            if (map[y] == null) {
                                                map[y] = [];
                                                levels.push(y);
                                            }
                                            map[y].push(item);
                                        }
                                        switch (flex.wrap) {
                                            case 'wrap':
                                                if (flex.direction === 'column-reverse') {
                                                    reverseMap();
                                                }
                                                break;
                                            case 'wrap-reverse':
                                                if (flex.direction.indexOf('row') !== -1) {
                                                    levels.reverse();
                                                }
                                                else if (flex.direction === 'column') {
                                                    reverseMap();
                                                }
                                                break;
                                        }
                                        for (const n of levels) {
                                            horizontal.push(new androme.lib.base.NodeList(map[n]));
                                        }
                                    }
                                }
                                else if (columnCount > 0) {
                                    const columns = [];
                                    const perRowCount = Math.ceil(pageflow.length / Math.min(columnCount, pageflow.length));
                                    for (let i = 0, j = 0; i < pageflow.length; i++) {
                                        const item = pageflow.get(i);
                                        if (i % perRowCount === 0) {
                                            if (i > 0) {
                                                j++;
                                            }
                                            if (columns[j] == null) {
                                                columns[j] = [];
                                            }
                                        }
                                        columns[j].push(item);
                                    }
                                    const row = [];
                                    const marginLeft = $util$2.convertInt(node.css('columnGap')) || 16;
                                    const marginTotal = columns
                                        .map(list => Math.max.apply(null, list.map(item => item.marginLeft + item.marginRight)))
                                        .reduce((a, b) => a + b, 0);
                                    const marginPercent = Math.max(((marginTotal + (marginLeft * (columnCount - 1))) / node.box.width) / columnCount, 0.01);
                                    for (let i = 0; i < columns.length; i++) {
                                        const column = columns[i];
                                        const first = column[0];
                                        if (i > 0) {
                                            first.android(`layout_${parseRTL('marginLeft', this.settings)}`, $util$2.formatPX(first.marginLeft + marginLeft));
                                        }
                                        row.push(first);
                                        column.forEach(item => {
                                            if (!item.hasWidth) {
                                                item.android('layout_width', '0px');
                                                item.app('layout_constraintWidth_percent', ((1 / columnCount) - marginPercent).toFixed(2));
                                            }
                                        });
                                        vertical.push(new androme.lib.base.NodeList(column));
                                    }
                                    horizontal.push(new androme.lib.base.NodeList(row));
                                }
                                else {
                                    const horizontalChain = pageflow.list.filter(current => !current.constraint.horizontal);
                                    const verticalChain = pageflow.list.filter(current => !current.constraint.vertical);
                                    pageflow.list.some((current) => {
                                        const horizontalOutput = [];
                                        const verticalOutput = [];
                                        if (horizontalChain.includes(current)) {
                                            horizontalOutput.push(...this.partitionChain(current, pageflow, AXIS_ANDROID.HORIZONTAL, !percentage));
                                            if (horizontalOutput.length > 0) {
                                                horizontal.push(new androme.lib.base.NodeList($util$2.sortAsc(horizontalOutput, 'linear.left')));
                                            }
                                        }
                                        if (verticalChain.includes(current) && !percentage) {
                                            verticalOutput.push(...this.partitionChain(current, pageflow, AXIS_ANDROID.HORIZONTAL, true));
                                            if (verticalOutput.length > 0) {
                                                vertical.push(new androme.lib.base.NodeList($util$2.sortAsc(verticalOutput, 'linear.top')));
                                            }
                                        }
                                        return horizontalOutput.length === pageflow.length || verticalOutput.length === pageflow.length;
                                    });
                                    horizontal.sort((a, b) => a.length >= b.length ? -1 : 1);
                                    vertical.sort((a, b) => a.length >= b.length ? -1 : 1);
                                }
                                [horizontal, vertical].forEach((connected, index) => {
                                    if (connected.length > 0) {
                                        const mapId = new Set();
                                        const connectedRows = [];
                                        connected
                                            .filter(current => {
                                            const id = current.list.map(item => item.id).sort().join('-');
                                            if (!mapId.has(id)) {
                                                mapId.add(id);
                                                return true;
                                            }
                                            return false;
                                        })
                                            .forEach((chainable, level) => {
                                            if (chainable.length > (flex.enabled ? 0 : 1)) {
                                                const inverse = index === 0 ? 1 : 0;
                                                const [HV, VH] = [MAP_CHAIN['horizontalVertical'][index], MAP_CHAIN['horizontalVertical'][inverse]];
                                                const [LT, TL] = [MAP_CHAIN['leftTop'][index], MAP_CHAIN['leftTop'][inverse]];
                                                const [RB, BR] = [MAP_CHAIN['rightBottom'][index], MAP_CHAIN['rightBottom'][inverse]];
                                                const [WH, HW] = [MAP_CHAIN['widthHeight'][index], MAP_CHAIN['widthHeight'][inverse]];
                                                const orientation = HV.toLowerCase();
                                                const orientationInverse = VH.toLowerCase();
                                                const dimension = WH.toLowerCase();
                                                if (flex.enabled) {
                                                    if (chainable.list.some(item => item.flex.order > 0)) {
                                                        chainable[flex.direction.indexOf('reverse') !== -1 ? 'sortDesc' : 'sortAsc']('flex.order');
                                                    }
                                                }
                                                else if (!percentage && columnCount === 0) {
                                                    if (chainable.list.every(item => anchoredSibling(item, nodes, orientation))) {
                                                        return;
                                                    }
                                                }
                                                chainable.parent = node;
                                                const first = chainable.get(0);
                                                const last = chainable.get();
                                                let disconnected = false;
                                                let marginDelete = false;
                                                let maxOffset = -1;
                                                const attrs = index === 0 ? ['left', 'leftRight', 'top', AXIS_ANDROID.VERTICAL, 'hasWidth', 'right', 'marginHorizontal']
                                                    : ['top', 'topBottom', 'left', AXIS_ANDROID.HORIZONTAL, 'hasHeight', 'bottom', 'marginVertical'];
                                                for (let i = 0; i < chainable.length; i++) {
                                                    const item = chainable.get(i);
                                                    if (i === 0) {
                                                        if (!mapParent(item, attrs[0])) {
                                                            disconnected = true;
                                                            break;
                                                        }
                                                    }
                                                    else {
                                                        if (!mapSibling(item, attrs[1])) {
                                                            disconnected = true;
                                                            break;
                                                        }
                                                    }
                                                }
                                                if (!disconnected) {
                                                    if (chainable.list.every(item => $util$2.sameValue(first, item, `linear.${attrs[2]}`))) {
                                                        for (let j = 1; j < chainable.length; j++) {
                                                            const item = chainable.get(j);
                                                            if (!item.constraint[attrs[3]]) {
                                                                item.anchor(mapLayout[attrs[2]], first.stringId, attrs[3]);
                                                            }
                                                        }
                                                    }
                                                    if (!flex.enabled && node[attrs[4]] === 0) {
                                                        mapDelete(last, attrs[5]);
                                                        last.constraint[attrs[6]] = mapSibling(last, attrs[1]);
                                                    }
                                                }
                                                if (percentage) {
                                                    first.anchor(mapLayout[LT], 'parent', orientation);
                                                    last.anchor(mapLayout[RB], 'parent', orientation);
                                                    if (!node.renderParent.autoMarginHorizontal) {
                                                        if (first.float === 'right' && last.float === 'right') {
                                                            first.app(`layout_constraint${HV}_bias`, '1');
                                                        }
                                                        else {
                                                            first.app(`layout_constraint${HV}_bias`, '0');
                                                        }
                                                    }
                                                }
                                                else {
                                                    first.anchor(mapLayout[LT], 'parent', orientation);
                                                    last.anchor(mapLayout[RB], 'parent', orientation);
                                                }
                                                for (let i = 0; i < chainable.length; i++) {
                                                    const chain = chainable.get(i);
                                                    const next = chainable.get(i + 1);
                                                    const previous = chainable.get(i - 1);
                                                    if (flex.enabled) {
                                                        if (chain.linear[TL] === node.box[TL] && chain.linear[BR] === node.box[BR]) {
                                                            this.setAlignParent(chain, orientationInverse);
                                                        }
                                                        const rowNext = connected[level + 1];
                                                        if (rowNext) {
                                                            const chainNext = rowNext.get(i);
                                                            if (chainNext && chain.withinY(chainNext.linear)) {
                                                                chain.anchor(mapLayout['bottomTop'], chainNext.stringId);
                                                                if (!mapParent(chain, 'bottom')) {
                                                                    mapDelete(chain, 'bottom');
                                                                }
                                                            }
                                                        }
                                                    }
                                                    else if (percentage) {
                                                        if (connectedRows.length === 0) {
                                                            chain.anchor(mapLayout['top'], 'parent');
                                                        }
                                                        else {
                                                            const previousRow = connectedRows[connectedRows.length - 1];
                                                            const bottom = Math.max.apply(null, previousRow.list.map(item => item.linear.bottom));
                                                            let anchorAbove;
                                                            if (chainable.length === previousRow.length) {
                                                                anchorAbove = previousRow.get(i);
                                                            }
                                                            else {
                                                                anchorAbove = previousRow.list.find(item => item.linear.bottom === bottom);
                                                            }
                                                            if (anchorAbove) {
                                                                chain.anchor(mapLayout['topBottom'], anchorAbove.stringId);
                                                            }
                                                        }
                                                        const width = chain.css('width');
                                                        if ($util$2.isPercent(width)) {
                                                            chain.android('layout_width', '0px');
                                                            chain.app(`layout_constraint${WH}_percent`, (parseInt(width) / 100).toFixed(2));
                                                        }
                                                        chain.constraint.horizontal = true;
                                                        chain.constraint.vertical = true;
                                                    }
                                                    else if (columnCount > 0) {
                                                        if (index === 0) {
                                                            chain.app(`layout_constraint${VH}_bias`, '0');
                                                        }
                                                        if (index === 1 && i > 0) {
                                                            chain.anchor(mapLayout['left'], first.stringId);
                                                        }
                                                        chain.constraint.horizontal = true;
                                                        chain.constraint.vertical = true;
                                                    }
                                                    if (next) {
                                                        chain.anchor(mapLayout[MAP_CHAIN['rightLeftBottomTop'][index]], next.stringId);
                                                        maxOffset = Math.max(next.linear[LT] - chain.linear[RB], maxOffset);
                                                    }
                                                    if (previous) {
                                                        chain.anchor(mapLayout[MAP_CHAIN['leftRightTopBottom'][index]], previous.stringId);
                                                        chain.constraint[`margin${HV}`] = previous.stringId;
                                                    }
                                                    chain.constraint[`chain${HV}`] = true;
                                                    if (!chain.has(dimension) || chain.has(dimension, $enum$2.CSS_STANDARD.PERCENT)) {
                                                        const minWH = chain.styleMap[`min${WH}`];
                                                        const maxWH = chain.styleMap[`max${WH}`];
                                                        if ($util$2.isUnit(minWH)) {
                                                            chain.app(`layout_constraint${WH}_min`, minWH);
                                                            chain.android(`layout_${dimension}`, '0px');
                                                        }
                                                        if ($util$2.isUnit(maxWH)) {
                                                            chain.app(`layout_constraint${WH}_max`, maxWH);
                                                            chain.android(`layout_${dimension}`, '0px');
                                                        }
                                                    }
                                                    if (flex.enabled) {
                                                        chain.app(`layout_constraint${HV}_weight`, chain.flex.grow.toString());
                                                        if (chain[`view${WH}`] === 0 && chain.flex.grow === 0 && chain.flex.shrink <= 1) {
                                                            chain.android(`layout_${dimension}`, 'wrap_content');
                                                        }
                                                        else if (chain.flex.grow > 0) {
                                                            chain.android(`layout_${dimension}`, '0px');
                                                        }
                                                        if (chain.flex.shrink === 0) {
                                                            chain.app(`layout_constrained${WH}`, 'true');
                                                        }
                                                        switch (chain.flex.alignSelf) {
                                                            case 'flex-start':
                                                                chain.anchor(mapLayout[TL], 'parent', orientationInverse);
                                                                break;
                                                            case 'flex-end':
                                                                chain.anchor(mapLayout[BR], 'parent', orientationInverse);
                                                                break;
                                                            case 'baseline':
                                                                const valid = chainable.list.some(adjacent => {
                                                                    if (adjacent !== chain && adjacent.nodeType <= $enum$2.NODE_STANDARD.TEXT) {
                                                                        chain.anchor(mapLayout['baseline'], adjacent.stringId);
                                                                        return true;
                                                                    }
                                                                    return false;
                                                                });
                                                                if (valid) {
                                                                    mapDelete(chain, 'top', 'bottom');
                                                                    for (const item of chainable) {
                                                                        if (mapSibling(item, 'top') === chain.stringId) {
                                                                            mapDelete(item, 'top');
                                                                        }
                                                                        if (mapSibling(item, 'bottom') === chain.stringId) {
                                                                            mapDelete(item, 'bottom');
                                                                        }
                                                                    }
                                                                    chain.constraint.vertical = true;
                                                                }
                                                                break;
                                                            case 'center':
                                                            case 'stretch':
                                                                if (chain.flex.alignSelf !== 'center') {
                                                                    chain.android(`layout_${HW.toLowerCase()}`, '0px');
                                                                }
                                                                chain.constraint[orientationInverse] = false;
                                                                this.setAlignParent(chain, orientationInverse);
                                                                break;
                                                        }
                                                        if (chain.flex.basis !== 'auto') {
                                                            const basis = $util$2.convertInt(chain.flex.basis);
                                                            if (basis > 0) {
                                                                if ($util$2.isPercent(chain.flex.basis)) {
                                                                    chain.app(`layout_constraint${WH}_percent`, (basis / 100).toFixed(2));
                                                                }
                                                                else {
                                                                    chain.app(`layout_constraint${WH}_min`, $util$2.formatPX(basis));
                                                                    chain.constraint[`min${WH}`] = true;
                                                                }
                                                            }
                                                        }
                                                    }
                                                }
                                                const chainStyle = `layout_constraint${HV}_chainStyle`;
                                                if (flex.enabled &&
                                                    flex.justifyContent !== 'normal' &&
                                                    Math.max.apply(null, chainable.list.map(item => item.flex.grow)) === 0) {
                                                    switch (flex.justifyContent) {
                                                        case 'space-between':
                                                            first.app(chainStyle, 'spread_inside');
                                                            break;
                                                        case 'space-evenly':
                                                            first.app(chainStyle, 'spread');
                                                            for (const item of chainable) {
                                                                item.app(`layout_constraint${HV}_weight`, (item.flex.grow || 1).toString());
                                                            }
                                                            break;
                                                        case 'space-around':
                                                            first.app(`layout_constraint${HV}_chainStyle`, 'spread_inside');
                                                            first.constraint[orientation] = false;
                                                            last.constraint[orientation] = false;
                                                            this.addGuideline(first, orientation, true, false);
                                                            this.addGuideline(last, orientation, true, true);
                                                            break;
                                                        default:
                                                            let justifyContent = flex.justifyContent;
                                                            if (flex.direction.indexOf('reverse') !== -1) {
                                                                switch (flex.justifyContent) {
                                                                    case 'flex-start':
                                                                        justifyContent = 'flex-end';
                                                                        break;
                                                                    case 'flex-end':
                                                                        justifyContent = 'flex-start';
                                                                        break;
                                                                }
                                                            }
                                                            let bias = '0.5';
                                                            switch (justifyContent) {
                                                                case 'flex-start':
                                                                    bias = '0';
                                                                    break;
                                                                case 'flex-end':
                                                                    bias = '1';
                                                                    break;
                                                            }
                                                            first.app(chainStyle, 'packed');
                                                            first.app(`layout_constraint${HV}_bias`, bias);
                                                            break;
                                                    }
                                                    marginDelete = true;
                                                }
                                                else if (percentage) {
                                                    first.app(chainStyle, 'packed');
                                                }
                                                else if (!flex.enabled && columnCount > 0) {
                                                    first.app(chainStyle, index === 0 ? 'spread_inside' : 'packed');
                                                }
                                                else {
                                                    const alignLeft = $util$2.withinFraction(node.box.left, first.linear.left);
                                                    const alignRight = $util$2.withinFraction(last.linear.right, node.box.right);
                                                    const alignTop = $util$2.withinFraction(node.box.top, first.linear.top);
                                                    const alignBottom = $util$2.withinFraction(last.linear.bottom, node.box.bottom);
                                                    if ((orientation === AXIS_ANDROID.HORIZONTAL && alignLeft && alignRight) || (orientation === AXIS_ANDROID.VERTICAL && alignTop && alignBottom)) {
                                                        if (flex.enabled || chainable.length > 2) {
                                                            if (!flex.enabled && node.inlineElement) {
                                                                first.app(chainStyle, 'packed');
                                                                first.app(`layout_constraint${HV}_bias`, index === 0 && node.float === 'right' ? '1' : '0');
                                                            }
                                                            else {
                                                                first.app(chainStyle, 'spread_inside');
                                                                marginDelete = true;
                                                            }
                                                        }
                                                        else if (maxOffset > this.settings[`constraintChainPacked${HV}Offset`]) {
                                                            if (mapParent(first, LT)) {
                                                                mapDelete(first, MAP_CHAIN['rightLeftBottomTop'][index]);
                                                            }
                                                            if (mapParent(last, RB)) {
                                                                mapDelete(last, MAP_CHAIN['leftRightTopBottom'][index]);
                                                            }
                                                        }
                                                    }
                                                    else if ((maxOffset <= this.settings[`chainPacked${HV}Offset`] || node.flex.wrap !== 'nowrap') ||
                                                        (orientation === AXIS_ANDROID.HORIZONTAL && (alignLeft || alignRight))) {
                                                        first.app(chainStyle, 'packed');
                                                        let bias = '';
                                                        if (orientation === AXIS_ANDROID.HORIZONTAL) {
                                                            if (alignLeft) {
                                                                bias = '0';
                                                            }
                                                            else if (alignRight) {
                                                                bias = '1';
                                                            }
                                                        }
                                                        if (bias === '') {
                                                            bias = chainable[`${orientation}Bias`];
                                                        }
                                                        first.app(`layout_constraint${HV}_bias`, bias);
                                                    }
                                                    else {
                                                        first.app(chainStyle, 'spread');
                                                        marginDelete = true;
                                                    }
                                                    if (!flex.enabled) {
                                                        (index === 0 ? [[TL, BR], [BR, TL]] : [[LT, RB], [RB, LT]]).forEach(opposing => {
                                                            if (chainable.list.every(upper => $util$2.sameValue(first, upper, `linear.${opposing[0]}`) &&
                                                                chainable.list.some(lower => !$util$2.sameValue(first, lower, `linear.${opposing[1]}`)))) {
                                                                for (const chain of chainable) {
                                                                    mapDelete(chain, opposing[1]);
                                                                }
                                                            }
                                                        });
                                                        for (const item of chainable) {
                                                            for (const list of connected) {
                                                                if (list.locate('id', item.id)) {
                                                                    list.clear();
                                                                }
                                                            }
                                                        }
                                                    }
                                                    else {
                                                        marginDelete = true;
                                                    }
                                                }
                                                if (marginDelete) {
                                                    for (const item of chainable) {
                                                        delete item.constraint.marginHorizontal;
                                                        delete item.constraint.marginVertical;
                                                    }
                                                }
                                                connectedRows.push(chainable);
                                            }
                                        });
                                    }
                                });
                            }
                            for (const current of pageflow) {
                                current.constraint.horizontal = anchoredSibling(current, nodes, AXIS_ANDROID.HORIZONTAL);
                                current.constraint.vertical = anchoredSibling(current, nodes, AXIS_ANDROID.VERTICAL);
                            }
                            if (flex.enabled) {
                                if (flex.wrap !== 'nowrap') {
                                    ['topBottom', 'bottomTop'].forEach((value, index) => {
                                        for (const current of pageflow) {
                                            if (mapParent(current, index === 0 ? 'bottom' : 'top')) {
                                                const chain = [current];
                                                let valid = false;
                                                let adjacent = current;
                                                while (adjacent) {
                                                    const topBottom = mapSibling(adjacent, value);
                                                    if (topBottom) {
                                                        adjacent = nodes.locate('nodeId', stripId(topBottom));
                                                        if (adjacent && current.withinY(adjacent.linear)) {
                                                            chain.push(adjacent);
                                                            valid = mapParent(adjacent, index === 0 ? 'top' : 'bottom');
                                                            if (valid) {
                                                                break;
                                                            }
                                                        }
                                                    }
                                                    else {
                                                        adjacent = null;
                                                    }
                                                }
                                                if (!valid) {
                                                    for (const item of chain) {
                                                        pageflow.list.some(next => {
                                                            if (item !== next &&
                                                                next.linear.top === item.linear.top &&
                                                                next.linear.bottom === item.linear.bottom) {
                                                                mapDelete(item, 'topBottom', 'bottomTop');
                                                                item.app(mapLayout['top'], next.stringId);
                                                                item.app(mapLayout['bottom'], next.stringId);
                                                                return true;
                                                            }
                                                            return false;
                                                        });
                                                    }
                                                }
                                            }
                                        }
                                    });
                                }
                            }
                            else if (columnCount === 0) {
                                for (const current of pageflow) {
                                    [['top', 'bottom', 'topBottom'], ['bottom', 'top', 'bottomTop']].forEach(direction => {
                                        if (mapParent(current, direction[1]) && !mapSibling(current, direction[2])) {
                                            ['leftRight', 'rightLeft'].forEach(value => {
                                                const stringId = mapSibling(current, value);
                                                if (stringId) {
                                                    const aligned = pageflow.locate('stringId', stringId);
                                                    if (aligned && mapSibling(aligned, direction[2])) {
                                                        if ($util$2.withinFraction(current.linear[direction[0]], aligned.linear[direction[0]])) {
                                                            current.anchor(mapLayout[direction[0]], aligned.stringId);
                                                        }
                                                        if ($util$2.withinFraction(current.linear[direction[1]], aligned.linear[direction[1]])) {
                                                            current.anchor(mapLayout[direction[1]], aligned.stringId);
                                                        }
                                                    }
                                                }
                                            });
                                        }
                                    });
                                }
                                const unbound = pageflow.filter(current => !current.anchored && (mapParent(current, 'top') ||
                                    mapParent(current, 'right') ||
                                    mapParent(current, 'bottom') ||
                                    mapParent(current, 'left')));
                                if (nodes.filter(item => item.anchored).length === 0 && unbound.length === 0) {
                                    unbound.append(nodes.get(0));
                                }
                                for (const current of unbound) {
                                    this.addGuideline(current, '', false, false);
                                }
                                const [adjacent, unanchored] = nodes.partition(item => item.anchored);
                                for (const current of unanchored) {
                                    if ($util$2.withinRange(current.horizontalBias(this.settings), 0.5, 0.01) && $util$2.withinRange(current.verticalBias(this.settings), 0.5, 0.01)) {
                                        this.setAlignParent(current);
                                    }
                                    else if (this.settings.constraintCirclePositionAbsolute &&
                                        adjacent.length > 0 &&
                                        !current.constraint.horizontal &&
                                        !current.constraint.vertical) {
                                        const opposite = adjacent.get(0);
                                        const center1 = current.center;
                                        const center2 = opposite.center;
                                        const x = Math.abs(center1.x - center2.x);
                                        const y = Math.abs(center1.y - center2.y);
                                        let degrees = Math.round(Math.atan(Math.min(x, y) / Math.max(x, y)) * (180 / Math.PI));
                                        const radius = Math.round(Math.sqrt(Math.pow(x, 2) + Math.pow(y, 2)));
                                        if (center1.y > center2.y) {
                                            if (center1.x > center2.x) {
                                                if (x > y) {
                                                    degrees += 90;
                                                }
                                                else {
                                                    degrees = 180 - degrees;
                                                }
                                            }
                                            else {
                                                if (x > y) {
                                                    degrees = 270 - degrees;
                                                }
                                                else {
                                                    degrees += 180;
                                                }
                                            }
                                        }
                                        else if (center1.y < center2.y) {
                                            if (center2.x > center1.x) {
                                                if (x > y) {
                                                    degrees += 270;
                                                }
                                                else {
                                                    degrees = 360 - degrees;
                                                }
                                            }
                                            else {
                                                if (x > y) {
                                                    degrees = 90 - degrees;
                                                }
                                            }
                                        }
                                        else {
                                            degrees = center1.x > center2.x ? 90 : 270;
                                        }
                                        current.delete('app', 'layout_constraint*');
                                        current.app('layout_constraintCircle', opposite.stringId);
                                        current.app('layout_constraintCircleRadius', delimitDimens(`${current.nodeName}`, 'constraintcircleradius', $util$2.formatPX(radius), this.settings));
                                        current.app('layout_constraintCircleAngle', degrees.toString());
                                        current.constraint.horizontal = true;
                                        current.constraint.vertical = true;
                                    }
                                    else {
                                        this.addGuideline(current);
                                    }
                                }
                                let bottomParent = null;
                                let rightParent = null;
                                const maxBottom = Math.max.apply(null, nodes.list.map(item => item.linear.bottom));
                                const connected = {};
                                function deleteChain(item, value) {
                                    mapDelete(item, value);
                                    connected[item.stringId][value] = null;
                                }
                                for (let i = 0; i < nodes.length; i++) {
                                    const current = nodes.get(i);
                                    const top = mapParent(current, 'top');
                                    const right = mapParent(current, 'right');
                                    let bottom = mapParent(current, 'bottom');
                                    const left = mapParent(current, 'left');
                                    connected[current.stringId] = {
                                        leftRight: mapSibling(current, 'leftRight'),
                                        rightLeft: mapSibling(current, 'rightLeft'),
                                        topBottom: mapSibling(current, 'topBottom'),
                                        bottomTop: mapSibling(current, 'bottomTop'),
                                    };
                                    if ((bottom && mapSibling(current, 'topBottom') && current.hasHeight) ||
                                        (top && bottom && (!current.has('marginTop', $enum$2.CSS_STANDARD.AUTO) &&
                                            current.linear.bottom < maxBottom))) {
                                        mapDelete(current, 'bottom');
                                        bottom = false;
                                    }
                                    if (current.pageflow) {
                                        [[left, right, 'rightLeft', 'leftRight', 'right', 'left', 'Horizontal'], [top, bottom, 'bottomTop', 'topBottom', 'bottom', 'top', 'Vertical']].forEach((value, index) => {
                                            if (value[0] || value[1]) {
                                                let valid = value[0] && value[1];
                                                let next = current;
                                                if (!valid) {
                                                    do {
                                                        const stringId = mapSibling(next, (value[0] ? value[2] : value[3]));
                                                        if (stringId) {
                                                            next = this.findByStringId(stringId);
                                                            if (next && ((value[0] && mapParent(next, value[4])) ||
                                                                (value[1] && mapParent(next, value[5])))) {
                                                                valid = true;
                                                                break;
                                                            }
                                                        }
                                                        else {
                                                            next = null;
                                                        }
                                                    } while (next);
                                                }
                                                if (valid) {
                                                    node.constraint[`layout${value[6]}`] = true;
                                                }
                                                if (!current.constraint[`chain${value[6]}`]) {
                                                    if (value[0] && value[1]) {
                                                        if (!current.autoMargin && !current.linearVertical) {
                                                            current.android(`layout_${(index === 0 ? 'width' : 'height')}`, 'match_parent', false);
                                                        }
                                                    }
                                                    else if (value[1]) {
                                                        if (valid) {
                                                            const below = this.findByStringId(mapSibling(current, value[3]));
                                                            if (below && below.marginBottom === 0) {
                                                                mapDelete(current, value[4]);
                                                            }
                                                        }
                                                    }
                                                }
                                            }
                                        });
                                        if (right) {
                                            if (!rightParent) {
                                                rightParent = false;
                                                rightParent = anchoredSibling(current, nodes, AXIS_ANDROID.HORIZONTAL);
                                            }
                                        }
                                        else if (left) {
                                            if (current.is($enum$2.NODE_STANDARD.TEXT) && current.cssParent('textAlign', true) === 'center') {
                                                current.anchor(mapLayout['right'], 'parent');
                                            }
                                            if (current.textElement &&
                                                !current.hasWidth &&
                                                current.toInt('maxWidth') === 0 &&
                                                current.multiLine &&
                                                !$dom$2.hasLineBreak(current.element) &&
                                                !nodes.list.some(item => mapSibling(item, 'rightLeft') === current.stringId)) {
                                                current.android('layout_width', 'match_parent');
                                            }
                                        }
                                        if (bottom) {
                                            if (!bottomParent) {
                                                bottomParent = false;
                                                bottomParent = anchoredSibling(current, nodes, AXIS_ANDROID.VERTICAL);
                                            }
                                        }
                                    }
                                    else {
                                        if (left &&
                                            right &&
                                            current.right == null &&
                                            current.hasWidth) {
                                            switch (current.cssParent('textAlign', true)) {
                                                case 'center':
                                                case 'right':
                                                case 'end':
                                                    break;
                                                default:
                                                    mapDelete(current, 'right');
                                                    break;
                                            }
                                        }
                                        if (top &&
                                            bottom &&
                                            current.bottom == null &&
                                            current.hasHeight) {
                                            switch (current.css('verticalAlign')) {
                                                case 'bottom':
                                                case 'text-bottom':
                                                case 'middle':
                                                    break;
                                                default:
                                                    mapDelete(current, 'bottom');
                                                    break;
                                            }
                                        }
                                        if (left && right && !node.hasWidth) {
                                            node.constraint.layoutWidth = true;
                                        }
                                        if (top && bottom && !node.hasHeight) {
                                            node.constraint.layoutHeight = true;
                                        }
                                        if (right && current.toInt('right') > 0) {
                                            current.modifyBox($enum$2.BOX_STANDARD.MARGIN_RIGHT, Math.max(current.toInt('right') - node.paddingRight, 0));
                                        }
                                        if (bottom && current.toInt('bottom') > 0) {
                                            current.modifyBox($enum$2.BOX_STANDARD.MARGIN_BOTTOM, Math.max(current.toInt('bottom') - node.paddingBottom, 0));
                                        }
                                        if (right && bottom) {
                                            if (node.documentRoot) {
                                                if (!node.hasWidth) {
                                                    node.constraint.layoutWidth = false;
                                                    node.constraint.layoutHorizontal = false;
                                                }
                                                if (!node.hasHeight) {
                                                    node.constraint.layoutHeight = false;
                                                    node.constraint.layoutVertical = false;
                                                }
                                            }
                                        }
                                    }
                                }
                                for (const left in connected) {
                                    for (const right in connected) {
                                        if (left !== right) {
                                            ['leftRight', 'rightLeft', 'bottomTop', 'topBottom'].forEach(value => {
                                                if (connected[left][value] && connected[left][value] === connected[right][value]) {
                                                    const conflict = nodes.locate('stringId', connected[left][value]);
                                                    if (conflict) {
                                                        [nodes.locate('stringId', left), nodes.locate('stringId', right)].some((item, index) => {
                                                            if (item) {
                                                                const stringId = index === 0 ? left : right;
                                                                switch (value) {
                                                                    case 'leftRight':
                                                                    case 'rightLeft':
                                                                        if ((mapSibling(item, 'left') || mapSibling(item, 'right')) && mapSibling(conflict, value === 'rightLeft' ? 'leftRight' : 'rightLeft') !== stringId) {
                                                                            deleteChain(item, value);
                                                                            return true;
                                                                        }
                                                                        break;
                                                                    case 'bottomTop':
                                                                    case 'topBottom':
                                                                        if ((mapSibling(item, 'top') || mapSibling(item, 'bottom')) && mapSibling(conflict, value === 'topBottom' ? 'bottomTop' : 'topBottom') !== stringId) {
                                                                            deleteChain(item, value);
                                                                            return true;
                                                                        }
                                                                        break;
                                                                }
                                                            }
                                                            return false;
                                                        });
                                                    }
                                                }
                                            });
                                        }
                                    }
                                }
                                if (rightParent === false) {
                                    node.constraint.layoutWidth = true;
                                }
                                if (bottomParent === false) {
                                    node.constraint.layoutHeight = true;
                                }
                            }
                        }
                    }
                    for (const current of nodes) {
                        if (current.constraint.marginHorizontal) {
                            const item = this.findByStringId(current.constraint.marginHorizontal);
                            if (item) {
                                const offset = current.linear.left - item.actualRight();
                                if (offset >= 1) {
                                    current.modifyBox($enum$2.BOX_STANDARD.MARGIN_LEFT, offset);
                                }
                            }
                        }
                        if (current.constraint.marginVertical) {
                            const item = this.findByStringId(current.constraint.marginVertical);
                            if (item) {
                                const offset = current.linear.top - item.linear.bottom;
                                if (offset >= 1) {
                                    current.modifyBox($enum$2.BOX_STANDARD.MARGIN_TOP, offset);
                                }
                            }
                        }
                    }
                }
                else {
                    if (node.linearHorizontal) {
                        this.adjustLineHeight(node.renderChildren, node);
                    }
                }
            }
        }
        getEmptySpacer(nodeType, depth, width, height, columnSpan = 1) {
            let xml = '';
            const percent = width && $util$2.isPercent(width) ? (parseInt(width) / 100).toFixed(2) : '';
            switch (nodeType) {
                case $enum$2.NODE_STANDARD.GRID:
                    xml =
                        this.renderNodeStatic($enum$2.NODE_STANDARD.SPACE, depth, {
                            app: {
                                layout_columnWeight: percent,
                                layout_columnSpan: columnSpan.toString()
                            }
                        }, percent !== '' ? '0px' : 'wrap_content', !height ? 'wrap_content' : $util$2.formatPX(height));
                    break;
            }
            return xml;
        }
        createGroup(parent, node, children) {
            const group = new ViewGroup(this.cache.nextId, node, parent, children);
            if (children.length > 0) {
                children.forEach(item => item.inherit(group, 'data'));
            }
            this.cache.append(group);
            return group;
        }
        renderGroup(node, parent, viewName, options) {
            const target = $util$2.hasValue(node.dataset.target) && !$util$2.hasValue(node.dataset.include);
            let preXml = '';
            let postXml = '';
            if (typeof viewName === 'number') {
                viewName = View.getControlName(viewName);
            }
            switch (viewName) {
                case NODE_ANDROID.LINEAR:
                    options = {
                        android: {
                            orientation: options && options.horizontal ? AXIS_ANDROID.HORIZONTAL : AXIS_ANDROID.VERTICAL
                        }
                    };
                    break;
                case NODE_ANDROID.GRID:
                    options = {
                        app: {
                            columnCount: options && options.columns > 0 ? options.columns.toString() : '2',
                            rowCount: options && options.rows > 0 ? options.rows.toString() : ''
                        }
                    };
                    break;
                default:
                    options = {};
                    break;
            }
            node.setNodeType(viewName);
            if (node.overflowX || node.overflowY) {
                const overflow = [];
                if (node.overflowX && node.overflowY) {
                    overflow.push(NODE_ANDROID.SCROLL_HORIZONTAL, NODE_ANDROID.SCROLL_VERTICAL);
                }
                else {
                    if (node.overflowX) {
                        overflow.push(NODE_ANDROID.SCROLL_HORIZONTAL);
                    }
                    if (node.overflowY) {
                        overflow.push(NODE_ANDROID.SCROLL_VERTICAL);
                    }
                }
                let previous = null;
                const scrollView = overflow.map((nodeName, index) => {
                    const container = new View(this.cache.nextId, index === 0 ? node.element : undefined);
                    container.api = this.settings.targetAPI;
                    container.nodeName = node.nodeName;
                    container.documentParent = node.documentParent;
                    container.setNodeType(nodeName);
                    if (index === 0) {
                        container.inherit(node, 'initial', 'base', 'data', 'style', 'styleMap');
                        container.parent = parent;
                        container.render(parent);
                    }
                    else {
                        container.init();
                        container.inherit(node, 'dimensions');
                        container.inherit(node, 'initial', 'style', 'styleMap');
                        if (previous) {
                            previous.css('overflow', 'visible scroll');
                            previous.css('overflowX', 'scroll');
                            previous.css('overflowY', 'visible');
                            container.parent = previous;
                            container.render(previous);
                        }
                        container.css('overflow', 'scroll visible');
                        container.css('overflowX', 'visible');
                        container.css('overflowY', 'scroll');
                        if (node.has('height', $enum$2.CSS_STANDARD.UNIT)) {
                            container.css('height', $util$2.formatPX(node.toInt('height') + node.paddingTop + node.paddingBottom));
                        }
                    }
                    container.resetBox($enum$2.BOX_STANDARD.PADDING);
                    const indent = $util$2.repeat(container.renderDepth);
                    preXml += `{<${container.id}}${indent}<${nodeName}{@${container.id}}>\n` +
                        `{:${container.id}}`;
                    postXml = `${indent}</${nodeName}>\n{>${container.id}}` + (index === 1 ? '\n' : '') + postXml;
                    previous = container;
                    this.cache.append(container);
                    return container;
                });
                if (scrollView.length === 2) {
                    node.android('layout_width', 'wrap_content');
                    node.android('layout_height', 'wrap_content');
                }
                else {
                    node.android(node.overflowX ? 'layout_width' : 'layout_height', 'wrap_content');
                }
                node.removeElement();
                node.resetBox($enum$2.BOX_STANDARD.MARGIN);
                node.parent = scrollView[scrollView.length - 1];
                node.render(node.parent);
            }
            else {
                node.render(target ? node : parent);
            }
            node.apply(options);
            return (this.getEnclosingTag(target || $util$2.hasValue(parent.dataset.target) || (node.renderDepth === 0 && !node.documentRoot) ? -1 : node.renderDepth, viewName, node.id, $xml$1.formatPlaceholder(node.id), preXml, postXml));
        }
        renderNode(node, parent, nodeName, recursive = false) {
            const target = $util$2.hasValue(node.dataset.target) && !$util$2.hasValue(node.dataset.include);
            if (typeof nodeName === 'number') {
                nodeName = View.getControlName(nodeName);
            }
            node.setNodeType(nodeName);
            switch (node.tagName) {
                case 'IMG': {
                    if (!recursive) {
                        const element = node.element;
                        const percentWidth = node.has('width', $enum$2.CSS_STANDARD.PERCENT);
                        const percentHeight = node.has('height', $enum$2.CSS_STANDARD.PERCENT);
                        let width = node.toInt('width');
                        let height = node.toInt('height');
                        let scaleType = '';
                        if (percentWidth || percentHeight) {
                            scaleType = percentWidth && percentHeight ? 'fitXY' : 'fitCenter';
                        }
                        else {
                            if (width === 0) {
                                const match = /width="([0-9]+)"/.exec(element.outerHTML);
                                if (match) {
                                    width = parseInt(match[1]);
                                    node.css('width', $util$2.formatPX(match[1]));
                                }
                            }
                            if (height === 0) {
                                const match = /height="([0-9]+)"/.exec(element.outerHTML);
                                if (match) {
                                    height = parseInt(match[1]);
                                    node.css('height', $util$2.formatPX(match[1]));
                                }
                            }
                            switch (node.css('objectFit')) {
                                case 'contain':
                                    scaleType = 'centerInside';
                                    break;
                                case 'cover':
                                    scaleType = 'centerCrop';
                                    break;
                                case 'scale-down':
                                    scaleType = 'fitCenter';
                                    break;
                                case 'none':
                                    scaleType = 'matrix';
                                    break;
                                default:
                                    scaleType = 'fitXY';
                                    break;
                            }
                        }
                        if (scaleType !== '') {
                            node.android('scaleType', scaleType);
                        }
                        if ((width > 0 && height === 0) || (width === 0 && height > 0)) {
                            node.android('adjustViewBounds', 'true');
                        }
                        if (!node.pageflow) {
                            const left = node.toInt('left');
                            const top = node.toInt('top');
                            if (left < 0 || top < 0) {
                                const container = new View(this.cache.nextId, node.element);
                                container.api = this.settings.targetAPI;
                                container.excludeProcedure |= $enum$2.NODE_PROCEDURE.ALL;
                                container.excludeResource |= $enum$2.NODE_RESOURCE.ALL;
                                container.android('layout_width', width > 0 ? $util$2.formatPX(width) : 'wrap_content');
                                container.android('layout_height', height > 0 ? $util$2.formatPX(height) : 'wrap_content');
                                container.setBounds();
                                container.setNodeType(NODE_ANDROID.FRAME);
                                container.render(parent);
                                if (left < 0) {
                                    node.modifyBox($enum$2.BOX_STANDARD.MARGIN_LEFT, left, true);
                                    container.css('left', '0px');
                                }
                                if (top < 0) {
                                    node.modifyBox($enum$2.BOX_STANDARD.MARGIN_TOP, top, true);
                                    container.css('top', '0px');
                                }
                                node.parent = container;
                                this.cache.append(container);
                                return (this.getEnclosingTag(container.renderDepth, NODE_ANDROID.FRAME, container.id, this.renderNode(node, container, nodeName, true)));
                            }
                        }
                        else {
                            if (parent.layoutHorizontal && node.baseline) {
                                node.android('baselineAlignBottom', 'true');
                            }
                        }
                    }
                    break;
                }
                case 'TEXTAREA': {
                    const element = node.element;
                    node.android('minLines', '2');
                    if (element.rows > 2) {
                        node.android('maxLines', element.rows.toString());
                    }
                    if (element.maxLength > 0) {
                        node.android('maxLength', element.maxLength.toString());
                    }
                    if (!node.hasWidth) {
                        const cols = $util$2.convertInt(element.cols);
                        if (cols > 0) {
                            node.css('width', $util$2.formatPX(cols * 10));
                        }
                    }
                    node.android('hint', element.placeholder);
                    node.android('scrollbars', AXIS_ANDROID.VERTICAL);
                    node.android('inputType', 'textMultiLine');
                    if (node.overflowX) {
                        node.android('scrollHorizontally', 'true');
                    }
                    break;
                }
                case 'INPUT': {
                    const element = node.element;
                    switch (element.type) {
                        case 'radio':
                            if (!recursive) {
                                const radiogroup = parent.children
                                    .map(item => {
                                    if (item.renderAs) {
                                        item = item.renderAs;
                                    }
                                    const input = item.element;
                                    if (item.visible &&
                                        !item.rendered &&
                                        input.type === 'radio' &&
                                        input.name === element.name) {
                                        return item;
                                    }
                                    return null;
                                })
                                    .filter(item => item);
                                if (radiogroup.length > 1) {
                                    const group = this.createGroup(parent, node, radiogroup);
                                    group.setNodeType(NODE_ANDROID.RADIO_GROUP);
                                    group.inherit(node, 'alignment');
                                    group.render(parent);
                                    let xml = '';
                                    let checked = '';
                                    for (const item of group.children) {
                                        if (item.element.checked) {
                                            checked = item.stringId;
                                        }
                                        xml += this.renderNode(item, group, $enum$2.NODE_STANDARD.RADIO, true);
                                    }
                                    group.android('orientation', $nodelist$1.linearX(radiogroup, radiogroup.every(item => item.documentParent === radiogroup[0].documentParent)) ? AXIS_ANDROID.HORIZONTAL : AXIS_ANDROID.VERTICAL);
                                    group.alignmentType |= $enum$2.NODE_ALIGNMENT.SEGMENTED;
                                    if (checked !== '') {
                                        group.android('checkedButton', checked);
                                    }
                                    return this.getEnclosingTag(group.renderDepth, NODE_ANDROID.RADIO_GROUP, group.id, xml);
                                }
                            }
                            break;
                        case 'password':
                            node.android('inputType', 'textPassword');
                            break;
                        case 'text':
                            node.android('inputType', 'text');
                            break;
                        case 'range':
                            if ($util$2.hasValue(element.min)) {
                                node.android('min', element.min);
                            }
                            if ($util$2.hasValue(element.max)) {
                                node.android('max', element.max);
                            }
                            if ($util$2.hasValue(element.value)) {
                                node.android('progess', element.value);
                            }
                            break;
                    }
                    switch (element.type) {
                        case 'text':
                        case 'search':
                        case 'tel':
                        case 'url':
                        case 'email':
                        case 'password':
                            if (!node.hasWidth) {
                                const size = $util$2.convertInt(element.size);
                                if (size > 0) {
                                    node.css('width', $util$2.formatPX(size * 10));
                                }
                            }
                            break;
                    }
                    break;
                }
            }
            switch (node.controlName) {
                case NODE_ANDROID.TEXT:
                    const scrollbars = [];
                    if (node.overflowX) {
                        scrollbars.push(AXIS_ANDROID.HORIZONTAL);
                    }
                    if (node.overflowY) {
                        scrollbars.push(AXIS_ANDROID.VERTICAL);
                    }
                    if (scrollbars.length > 0) {
                        node.android('scrollbars', scrollbars.join('|'));
                    }
                    if (node.has('maxWidth', $enum$2.CSS_STANDARD.UNIT)) {
                        node.android('maxWidth', node.css('maxWidth'));
                    }
                    if (node.has('maxHeight', $enum$2.CSS_STANDARD.UNIT)) {
                        node.android('maxHeight', node.css('maxHeight'));
                    }
                    if (node.css('whiteSpace') === 'nowrap') {
                        node.android('singleLine', 'true');
                    }
                    break;
                case NODE_ANDROID.LINE:
                    if (!node.hasHeight) {
                        node.android('layout_height', $util$2.formatPX(node.borderTopWidth + node.borderBottomWidth + node.paddingTop + node.paddingBottom || 1));
                    }
                    break;
            }
            node.render(target ? node : parent);
            return (this.getEnclosingTag(target || $util$2.hasValue(parent.dataset.target) || (node.renderDepth === 0 && !node.documentRoot) ? -1 : node.renderDepth, node.controlName, node.id));
        }
        renderNodeStatic(nodeName, depth, options = {}, width = '', height = '', node, children) {
            if (!node) {
                node = new View();
                node.api = this.settings.targetAPI;
            }
            node.apply(ResourceHandler.formatOptions(options, this.settings));
            const renderDepth = Math.max(0, depth);
            const viewName = typeof nodeName === 'number' ? View.getControlName(nodeName) : nodeName;
            switch (viewName) {
                case 'include':
                case 'merge':
                case 'menu':
                    break;
                default:
                    node.setNodeType(viewName);
                    break;
            }
            const displayName = node.hasElement ? node.nodeName : viewName;
            if ($util$2.hasValue(width)) {
                if (!isNaN(parseInt(width))) {
                    width = delimitDimens(displayName, 'width', width, this.settings);
                }
                node.android('layout_width', width, false);
            }
            if ($util$2.hasValue(height)) {
                if (!isNaN(parseInt(height))) {
                    height = delimitDimens(displayName, 'height', height, this.settings);
                }
                node.android('layout_height', height, false);
            }
            node.renderDepth = renderDepth;
            let output = this.getEnclosingTag(!node.documentRoot && depth === 0 ? -1 : depth, viewName, node.id, children ? $xml$1.formatPlaceholder(node.id) : '');
            if (this.settings.showAttributes && node.id === 0) {
                const indent = $util$2.repeat(renderDepth + 1);
                const attrs = node.combine()
                    .map(value => `\n${indent + value}`).join('');
                output = output.replace($xml$1.formatPlaceholder(node.id, '@'), attrs);
            }
            options['stringId'] = node.stringId;
            return output;
        }
        renderInclude(node, parent, name) {
            this._merge[name] = node.dataset.includeMerge === 'true';
            node.documentRoot = !this._merge[name];
            return (this.renderNodeStatic('include', parent.renderDepth + 1, { layout: `@layout/${name}` }));
        }
        renderMerge(name, value) {
            let xml = value.join('');
            if (this._merge[name]) {
                const node = new View();
                node.api = this.settings.targetAPI;
                node.documentRoot = true;
                xml =
                    this.renderNodeStatic('merge', 0, {}, '', '', node, true)
                        .replace('{:0}', xml);
            }
            return xml;
        }
        baseRenderDepth(name) {
            return this._merge[name] ? 0 : -1;
        }
        setBoxSpacing(data) {
            for (const node of data.cache.visible) {
                node.setBoxSpacing(this.settings);
            }
        }
        setDimensions(data) {
            function addToGroup(nodeName, node, dimen, attr, value) {
                const group = groups[nodeName];
                let name = dimen;
                if (arguments.length === 5) {
                    if (value && /(px|dp|sp)$/.test(value)) {
                        name = `${dimen},${attr},${value}`;
                    }
                    else {
                        return;
                    }
                }
                if (group[name] == null) {
                    group[name] = [];
                }
                group[name].push(node);
            }
            const groups = {};
            for (const node of data.cache.visible) {
                if (this.settings.dimensResourceValue) {
                    const nodeName = node.nodeName.toLowerCase();
                    if (groups[nodeName] == null) {
                        groups[nodeName] = {};
                    }
                    for (const key of Object.keys($enum$2.BOX_STANDARD)) {
                        const result = this.valueBox(node, key);
                        if (result[0] !== '' && result[1] !== '0px') {
                            const name = `${$enum$2.BOX_STANDARD[key].toLowerCase()},${result[0]},${result[1]}`;
                            addToGroup(nodeName, node, name);
                        }
                    }
                    ['android:layout_width:width',
                        'android:layout_height:height',
                        'android:minWidth:min_width',
                        'android:minHeight:min_height',
                        'app:layout_constraintWidth_min:constraint_width_min',
                        'app:layout_constraintHeight_min:constraint_height_min'].forEach(value => {
                        const [obj, attr, dimen] = value.split(':');
                        addToGroup(nodeName, node, dimen, attr, node[obj](attr));
                    });
                }
            }
            if (this.settings.dimensResourceValue) {
                const resource = ResourceHandler.getStored('dimens');
                for (const nodeName in groups) {
                    const group = groups[nodeName];
                    for (const name in group) {
                        const [dimen, attr, value] = name.split(',');
                        const key = this.getDimensResourceKey(resource, `${nodeName}_${parseRTL(dimen, this.settings)}`, value);
                        group[name].forEach(node => node[attr.indexOf('constraint') !== -1 ? 'app' : 'android'](attr, `@dimen/${key}`));
                        resource.set(key, value);
                    }
                }
            }
        }
        getEnclosingTag(depth, controlName, id, xml = '', preXml = '', postXml = '') {
            const indent = $util$2.repeat(Math.max(0, depth));
            let output = preXml +
                `{<${id}}`;
            if (xml !== '') {
                output += indent + `<${controlName}${(depth === 0 ? '{#0}' : '')}{@${id}}>\n` +
                    xml +
                    indent + `</${controlName}>\n`;
            }
            else {
                output += indent + `<${controlName}${(depth === 0 ? '{#0}' : '')}{@${id}} />\n`;
            }
            output += `{>${id}}` +
                postXml;
            return output;
        }
        valueBox(node, region) {
            const name = $util$2.convertEnum(parseInt(region), $enum$2.BOX_STANDARD, BOX_ANDROID);
            if (name !== '') {
                const attr = parseRTL(name, this.settings);
                return [attr, node.android(attr) || '0px'];
            }
            return ['', '0px'];
        }
        parseDimensions(content) {
            const resource = ResourceHandler.getStored('dimens');
            const pattern = /\s+\w+:\w+="({%(\w+),(\w+),(-?\w+)})"/g;
            let match;
            while ((match = pattern.exec(content)) != null) {
                const key = this.getDimensResourceKey(resource, `${match[2]}_${parseRTL(match[3], this.settings)}`, match[4]);
                resource.set(key, match[4]);
                content = content.replace(new RegExp(match[1], 'g'), `@dimen/${key}`);
            }
            return content;
        }
        setAttributes(data) {
            if (this.settings.showAttributes) {
                const cache = data.cache.visible.list.map(node => ({ pattern: $xml$1.formatPlaceholder(node.id, '@'), attributes: this.parseAttributes(node) }));
                for (const value of [...data.views, ...data.includes]) {
                    cache.forEach(item => value.content = value.content.replace(item.pattern, item.attributes));
                    value.content = value.content.replace(`{#0}`, this.getRootNamespace(value.content));
                }
            }
        }
        parseAttributes(node) {
            if (node.dir === 'rtl') {
                if (node.nodeType < $enum$2.NODE_STANDARD.INLINE) {
                    node.android('textDirection', 'rtl');
                }
                else if (node.length > 0) {
                    node.android('layoutDirection', 'rtl');
                }
            }
            for (const name in node.dataset) {
                if (/^attr[A-Z]+/.test(name)) {
                    const obj = $util$2.capitalize(name.substring(4), false);
                    node.dataset[name]
                        .split(';')
                        .forEach(values => {
                        const [key, value] = values.split('::');
                        if ($util$2.hasValue(key) && $util$2.hasValue(value)) {
                            node.attr(obj, key, value);
                        }
                    });
                }
            }
            const indent = $util$2.repeat(node.renderDepth + 1);
            return (node.combine()
                .map(value => `\n${indent + value}`)
                .join(''));
        }
        getRootNamespace(content) {
            let output = '';
            for (const namespace in XMLNS_ANDROID) {
                if (new RegExp(`\\s+${namespace}:`).test(content)) {
                    output += `\n\txmlns:${namespace}="${XMLNS_ANDROID[namespace]}"`;
                }
            }
            return output;
        }
        getDimensResourceKey(resource, key, value) {
            if (resource.has(key) && resource.get(key) !== value) {
                key = generateId('dimens', `${key}_1`);
            }
            return key;
        }
        setAlignParent(node, orientation = '', bias = false) {
            const map = MAP_LAYOUT.constraint;
            [AXIS_ANDROID.HORIZONTAL, AXIS_ANDROID.VERTICAL].forEach((value, index) => {
                if (!node.constraint[value] && (orientation === '' || value === orientation)) {
                    node.app(map[index === 0 ? 'left' : 'top'], 'parent');
                    node.app(map[index === 0 ? 'right' : 'bottom'], 'parent');
                    node.constraint[value] = true;
                    if (bias) {
                        node.app(`layout_constraint${value.charAt(0).toUpperCase() + value.substring(1)}_bias`, node[`${value}Bias`]);
                    }
                }
            });
        }
        partitionChain(node, nodes, orientation, validate) {
            const map = MAP_LAYOUT.constraint;
            const mapParent = [];
            const coordinate = [];
            const connected = [];
            switch (orientation) {
                case AXIS_ANDROID.HORIZONTAL:
                    mapParent.push(map['left'], map['right']);
                    coordinate.push('linear.top', 'linear.bottom');
                    connected.push(map['leftRight'], map['rightLeft']);
                    break;
                case AXIS_ANDROID.VERTICAL:
                    mapParent.push(map['top'], map['bottom']);
                    coordinate.push('linear.left', 'linear.right');
                    connected.push(map['topBottom'], map['bottomTop']);
                    break;
            }
            const result = coordinate
                .map(value => {
                const sameXY = $util$2.sortAsc(nodes.list.filter(item => $util$2.sameValue(node, item, value)), coordinate[0]);
                if (sameXY.length > 1) {
                    if (!validate || (!sameXY.some(item => item.floating) && sameXY[0].app(mapParent[0]) === 'parent' && sameXY[sameXY.length - 1].app(mapParent[1]) === 'parent')) {
                        return sameXY;
                    }
                    else {
                        const chained = new Set([node]);
                        let valid;
                        do {
                            valid = false;
                            Array
                                .from(chained)
                                .some(item => {
                                return sameXY.some(adjacent => {
                                    if (!chained.has(adjacent) && (adjacent.app(connected[0]) === item.stringId || adjacent.app(connected[1]) === item.stringId)) {
                                        chained.add(adjacent);
                                        valid = true;
                                    }
                                    return valid;
                                });
                            });
                        } while (valid);
                        return Array.from(chained);
                    }
                }
                return [];
            })
                .reduce((a, b) => a.length >= b.length ? a : b);
            return result;
        }
        addGuideline(node, orientation = '', percent, opposite) {
            const map = MAP_LAYOUT.constraint;
            if (node.pageflow) {
                if (opposite == null) {
                    opposite = (node.float === 'right' ||
                        (node.left == null && node.right != null) ||
                        (node.textElement && node.css('textAlign') === 'right') ||
                        node.alignParent('right', this.settings));
                }
                if (percent == null && opposite === true) {
                    percent = true;
                }
            }
            if (node.dataset.constraintPercent) {
                percent = node.dataset.constraintPercent === 'true';
            }
            const parent = node.documentParent;
            const beginPercent = `layout_constraintGuide_${(percent ? 'percent' : 'begin')}`;
            [AXIS_ANDROID.HORIZONTAL, AXIS_ANDROID.VERTICAL].forEach((value, index) => {
                if (!node.constraint[value] && (orientation === '' || value === orientation)) {
                    let LT = '';
                    let RB = '';
                    let LTRB = '';
                    let RBLT = '';
                    let found = false;
                    let offset = 0;
                    switch (index) {
                        case 0:
                            LT = !opposite ? 'left' : 'right';
                            RB = !opposite ? 'right' : 'left';
                            LTRB = !opposite ? 'leftRight' : 'rightLeft';
                            RBLT = !opposite ? 'rightLeft' : 'leftRight';
                            if (node.position === 'relative' && node.toInt('left') < 0) {
                                offset = node.toInt('left');
                            }
                            break;
                        case 1:
                            LT = !opposite ? 'top' : 'bottom';
                            RB = !opposite ? 'bottom' : 'top';
                            LTRB = !opposite ? 'topBottom' : 'bottomTop';
                            RBLT = !opposite ? 'bottomTop' : 'topBottom';
                            if (node.position === 'relative' && node.toInt('top') < 0) {
                                offset = node.toInt('top');
                            }
                            break;
                    }
                    const dimension = node.pageflow ? 'bounds' : 'linear';
                    const position = percent ? Math.abs((node[dimension][LT] + offset) - (parent.documentBody ? 0 : parent.box[LT])) / parent.box[index === 0 ? 'width' : 'height']
                        : 0;
                    if (!percent) {
                        found =
                            parent.renderChildren.some(item => {
                                if (item.constraint[value] && (!item.constraint[`chain${$util$2.capitalize(value)}`] || item.constraint[`margin${$util$2.capitalize(value)}`])) {
                                    if ($util$2.withinFraction(node.linear[LT] + offset, item.linear[RB])) {
                                        node.anchor(map[LTRB], item.stringId, value, true);
                                        return true;
                                    }
                                    else if ($util$2.withinFraction(node.linear[RB] + offset, item.linear[LT])) {
                                        node.anchor(map[RBLT], item.stringId, value, true);
                                        return true;
                                    }
                                    if ($util$2.withinFraction(node.bounds[LT] + offset, item.bounds[LT])) {
                                        node.anchor(map[index === 1 &&
                                            node.textElement &&
                                            node.baseline &&
                                            item.textElement &&
                                            item.baseline ? 'baseline' : LT], item.stringId, value, true);
                                        return true;
                                    }
                                    else if ($util$2.withinFraction(node.bounds[RB] + offset, item.bounds[RB])) {
                                        node.anchor(map[RB], item.stringId, value, true);
                                        return true;
                                    }
                                }
                                return false;
                            });
                    }
                    if (!found) {
                        const guideline = parent.constraint.guideline || {};
                        let location = percent ? parseFloat(Math.abs(position - (!opposite ? 0 : 1)).toFixed(this.settings.constraintPercentAccuracy))
                            : (!opposite ? (node[dimension][LT] + offset) - parent.box[LT]
                                : (node[dimension][LT] + offset) - parent.box[RB]);
                        if (!percent && !opposite) {
                            if (location < 0) {
                                const padding = parent[`padding${$util$2.capitalize(LT)}`];
                                if (padding >= Math.abs(location)) {
                                    location = 0;
                                }
                                else {
                                    location = Math.abs(location) - padding;
                                }
                            }
                            else {
                                if (parent.documentBody) {
                                    location = node[dimension][LT] + offset;
                                }
                            }
                        }
                        if (location === 0) {
                            node.anchor(map[LT], 'parent', value, true);
                        }
                        else {
                            const options = {
                                android: {
                                    orientation: index === 0 ? AXIS_ANDROID.VERTICAL : AXIS_ANDROID.HORIZONTAL
                                },
                                app: {
                                    [beginPercent]: location.toString()
                                }
                            };
                            const anchors = $util$2.optional(guideline, `${value}.${beginPercent}.${LT}`, 'object');
                            if (anchors) {
                                for (const stringId in anchors) {
                                    if (anchors[stringId] === location) {
                                        node.anchor(map[LT], stringId, value, true);
                                        node.delete('app', map[RB]);
                                        found = true;
                                        break;
                                    }
                                }
                            }
                            if (!found) {
                                if (!percent) {
                                    options.app[beginPercent] = delimitDimens(node.nodeName, 'constraintguide_begin', $util$2.formatPX(location), this.settings);
                                }
                                const xml = this.renderNodeStatic(NODE_ANDROID.GUIDELINE, node.renderDepth, options, 'wrap_content', 'wrap_content');
                                const stringId = options['stringId'];
                                this.appendAfter(node.id, xml);
                                node.anchor(map[LT], stringId, value, true);
                                node.delete('app', map[RB]);
                                node.constraint[`${value}Guideline`] = stringId;
                                if (guideline[value] == null) {
                                    guideline[value] = {};
                                }
                                if (guideline[value][beginPercent] == null) {
                                    guideline[value][beginPercent] = {};
                                }
                                if (guideline[value][beginPercent][LT] == null) {
                                    guideline[value][beginPercent][LT] = {};
                                }
                                guideline[value][beginPercent][LT][stringId] = location;
                                parent.constraint.guideline = guideline;
                            }
                        }
                    }
                }
            });
        }
        adjustBaseline(nodes) {
            if (nodes.length > 1) {
                const baseline = $nodelist$1.textBaseline(nodes.filter(node => node.baseline && node.toInt('top') === 0 && node.toInt('bottom') === 0));
                if (baseline.length > 0) {
                    const mapLayout = MAP_LAYOUT.relative;
                    const alignWith = baseline[0];
                    const images = [];
                    let baseExcluded = null;
                    for (const node of nodes) {
                        if (node !== alignWith) {
                            if (node.baseline && (node.nodeType <= $enum$2.NODE_STANDARD.INLINE ||
                                (node.linearHorizontal && node.renderChildren.some(item => item.baseline && item.nodeType <= $enum$2.NODE_STANDARD.INLINE)))) {
                                if (!alignWith.imageElement && node.imageElement) {
                                    images.push(node);
                                }
                                else if (node.alignOrigin) {
                                    node.android(mapLayout[(node.imageElement || node.is($enum$2.NODE_STANDARD.BUTTON) ? 'bottom' : 'baseline')], alignWith.stringId);
                                }
                                else if (alignWith.position === 'relative' &&
                                    node.bounds.height < alignWith.bounds.height &&
                                    node.lineHeight === 0) {
                                    node.android(mapLayout[$util$2.convertInt(alignWith.top) > 0 ? 'top' : 'bottom'], alignWith.stringId);
                                }
                            }
                            if (alignWith.imageElement && (!baseExcluded || node.bounds.height > baseExcluded.bounds.height)) {
                                baseExcluded = node;
                            }
                        }
                    }
                    if (images.length > 0) {
                        images.sort((a, b) => a.bounds.height >= b.bounds.height ? -1 : 1);
                        for (let i = 0; i < images.length; i++) {
                            if (i === 0) {
                                alignWith.android(mapLayout['bottom'], images[i].stringId);
                            }
                            else {
                                images[i].android(mapLayout['bottom'], images[0].stringId);
                            }
                        }
                        baseExcluded = null;
                    }
                    if (baseExcluded) {
                        if (!baseExcluded.imageElement) {
                            baseExcluded.delete('android', mapLayout['baseline']);
                        }
                        else if (baseExcluded.bounds.height > alignWith.bounds.height) {
                            baseExcluded.delete('android', mapLayout['bottom']);
                        }
                        else {
                            baseExcluded = null;
                        }
                        if (baseExcluded) {
                            alignWith.android(mapLayout['bottom'], baseExcluded.stringId);
                        }
                    }
                }
            }
        }
        checkSingleLine(node, nowrap = false, flexParent = false) {
            if (node &&
                node.textElement && (nowrap ||
                flexParent ||
                (!node.hasWidth && !node.multiLine && node.textContent.trim().split(String.fromCharCode(32)).length > 1))) {
                node.android('singleLine', 'true');
            }
        }
        adjustLineHeight(nodes, parent) {
            const lineHeight = Math.max.apply(null, nodes.map(node => node.toInt('lineHeight')));
            if (lineHeight > 0) {
                let minHeight = Number.MAX_VALUE;
                let offsetTop = 0;
                const valid = nodes.every(node => {
                    const offset = lineHeight - node.bounds.height;
                    if (offset > 0) {
                        minHeight = Math.min(offset, minHeight);
                        if (lineHeight === node.toInt('lineHeight')) {
                            offsetTop = Math.max(node.toInt('top') < 0 ? Math.abs(node.toInt('top')) : 0, offsetTop);
                        }
                        return true;
                    }
                    return false;
                });
                if (valid) {
                    parent.modifyBox($enum$2.BOX_STANDARD.PADDING_TOP, Math.floor(minHeight / 2));
                    parent.modifyBox($enum$2.BOX_STANDARD.PADDING_BOTTOM, Math.ceil(minHeight / 2) + offsetTop);
                }
            }
        }
        findByStringId(id) {
            return this.cache.locate('stringId', id);
        }
        get baseTemplate() {
            return BASE_TMPL;
        }
        get supportInline() {
            return WEBVIEW_ANDROID;
        }
        get supportInclude() {
            return true;
        }
        get settingsInternal() {
            return {
                layout: {
                    directory: 'res/layout',
                    fileExtension: 'xml'
                }
            };
        }
    }

    const template$2 = [
        '!0',
        '<?xml version="1.0" encoding="utf-8"?>',
        '<resources>',
        '!1',
        '	<string name="{name}">{value}</string>',
        '!1',
        '</resources>',
        '<!-- filename: res/values/strings.xml -->',
        '!0'
    ];
    var STRING_TMPL = template$2.join('\n');

    const template$3 = [
        '!0',
        '<?xml version="1.0" encoding="utf-8"?>',
        '<resources>',
        '!1',
        '	<string-array name="{name}">',
        '!2',
        '		<item>{value}</item>',
        '!2',
        '	</string-array>',
        '!1',
        '</resources>',
        '<!-- filename: res/values/string_arrays.xml -->',
        '!0'
    ];
    var STRINGARRAY_TMPL = template$3.join('\n');

    const template$4 = [
        '!0',
        '<?xml version="1.0" encoding="utf-8"?>',
        '<font-family xmlns:android="http://schemas.android.com/apk/res/android" xmlns:app="{#app=http://schemas.android.com/apk/res-auto}">',
        '!1',
        '	<font android:fontStyle="{style}" android:fontWeight="{weight}" android:font="{font}" app:fontStyle="{#app=style}" app:fontWeight="{#app=weight}" app:font="{#app=font}" />',
        '!1',
        '</font-family>',
        '<!-- filename: res/font/{name}.xml -->',
        '!0'
    ];
    var FONT_TMPL = template$4.join('\n');

    const template$5 = [
        '!0',
        '<?xml version="1.0" encoding="utf-8"?>',
        '<resources>',
        '!1',
        '	<color name="{value}">{name}</color>',
        '!1',
        '</resources>',
        '<!-- filename: res/values/colors.xml -->',
        '!0'
    ];
    var COLOR_TMPL = template$5.join('\n');

    const template$6 = [
        '!0',
        '<?xml version="1.0" encoding="utf-8"?>',
        '<resources>',
        '!1',
        '	<style name="{name1}" parent="{@parent}">',
        '!2',
        '		<item name="{name2}">{value}</item>',
        '!2',
        '	</style>',
        '!1',
        '</resources>',
        '<!-- filename: res/values/styles.xml -->',
        '!0'
    ];
    var STYLE_TMPL = template$6.join('\n');

    const template$7 = [
        '!0',
        '<?xml version="1.0" encoding="utf-8"?>',
        '<resources>',
        '!1',
        '	<dimen name="{name}">{value}</dimen>',
        '!1',
        '</resources>',
        '<!-- filename: res/values/dimens.xml -->',
        '!0'
    ];
    var DIMEN_TMPL = template$7.join('\n');

    const template$8 = [
        '!0',
        '{value}',
        '<!-- filename: {name} -->',
        '!0'
    ];
    var DRAWABLE_TMPL = template$8.join('\n');

    var $util$3 = androme.lib.util;
    var $xml$2 = androme.lib.xml;
    function caseInsensitve(a, b) {
        return a.toString().toLowerCase() >= b.toString().toLowerCase() ? 1 : -1;
    }
    class FileHandler extends androme.lib.base.File {
        constructor(settings) {
            super(settings.outputDirectory, settings.outputMaxProcessingTime, settings.outputArchiveFileType);
            this.settings = settings;
        }
        saveAllToDisk(data) {
            const files = [];
            const views = [...data.views, ...data.includes];
            for (let i = 0; i < views.length; i++) {
                const view = views[i];
                files.push(this.getLayoutFile(view.pathname, i === 0 ? this.settings.outputMainFileName : `${view.filename}.xml`, view.content));
            }
            const xml = this.resourceDrawableToXml();
            files.push(...this.parseFileDetails(this.resourceStringToXml()));
            files.push(...this.parseFileDetails(this.resourceStringArrayToXml()));
            files.push(...this.parseFileDetails(this.resourceFontToXml()));
            files.push(...this.parseFileDetails(this.resourceColorToXml()));
            files.push(...this.parseFileDetails(this.resourceStyleToXml()));
            files.push(...this.parseFileDetails(this.resourceDimenToXml()));
            files.push(...this.parseImageDetails(xml), ...this.parseFileDetails(xml));
            this.saveToDisk(files);
        }
        layoutAllToXml(data, saveToDisk = false) {
            const result = {};
            const files = [];
            const views = [...data.views, ...data.includes];
            for (let i = 0; i < views.length; i++) {
                const view = views[i];
                result[view.filename] = view.content;
                if (saveToDisk) {
                    files.push(this.getLayoutFile(view.pathname, i === 0 ? this.settings.outputMainFileName : `${view.filename}.xml`, view.content));
                }
            }
            if (saveToDisk) {
                this.saveToDisk(files);
            }
            return result;
        }
        resourceAllToXml(saveToDisk = false) {
            const result = {
                string: this.resourceStringToXml(),
                stringArray: this.resourceStringArrayToXml(),
                font: this.resourceFontToXml(),
                color: this.resourceColorToXml(),
                style: this.resourceStyleToXml(),
                dimen: this.resourceDimenToXml(),
                drawable: this.resourceDrawableToXml()
            };
            for (const resource in result) {
                if (result[resource] === '') {
                    delete result[resource];
                }
            }
            if (saveToDisk) {
                const files = [];
                for (const resource in result) {
                    if (resource === 'drawable') {
                        files.push(...this.parseImageDetails(result[resource]));
                    }
                    files.push(...this.parseFileDetails(result[resource]));
                }
                this.saveToDisk(files);
            }
            return result;
        }
        resourceStringToXml(saveToDisk = false) {
            let xml = '';
            this.stored.strings = new Map([...this.stored.strings.entries()].sort(caseInsensitve));
            const template = $xml$2.parseTemplate(STRING_TMPL);
            const data = {
                '0': [{
                        '1': []
                    }]
            };
            const root = $xml$2.getTemplateLevel(data, '0');
            if (this.appName !== '' && !this.stored.strings.has('app_name')) {
                root['1'].push({ name: 'app_name', value: this.appName });
            }
            for (const [name, value] of this.stored.strings.entries()) {
                root['1'].push({ name, value });
            }
            xml = $xml$2.insertTemplateData(template, data);
            xml = $xml$2.replaceTab(xml, this.settings, true);
            if (saveToDisk) {
                this.saveToDisk(this.parseFileDetails(xml));
            }
            return xml;
        }
        resourceStringArrayToXml(saveToDisk = false) {
            let xml = '';
            this.stored.arrays = new Map([...this.stored.arrays.entries()].sort());
            if (this.stored.arrays.size > 0) {
                const template = $xml$2.parseTemplate(STRINGARRAY_TMPL);
                const data = {
                    '0': [{
                            '1': []
                        }]
                };
                const root = $xml$2.getTemplateLevel(data, '0');
                for (const [name, values] of this.stored.arrays.entries()) {
                    const arrayItem = {
                        name,
                        '2': []
                    };
                    const item = arrayItem['2'];
                    for (const value of values) {
                        item.push({ value });
                    }
                    root['1'].push(arrayItem);
                }
                xml = $xml$2.insertTemplateData(template, data);
                xml = $xml$2.replaceTab(xml, this.settings, true);
                if (saveToDisk) {
                    this.saveToDisk(this.parseFileDetails(xml));
                }
            }
            return xml;
        }
        resourceFontToXml(saveToDisk = false) {
            let xml = '';
            this.stored.fonts = new Map([...this.stored.fonts.entries()].sort());
            if (this.stored.fonts.size > 0) {
                const template = $xml$2.parseTemplate(FONT_TMPL);
                for (const [name, font] of this.stored.fonts.entries()) {
                    const data = {
                        '#include': {},
                        '#exclude': {},
                        '0': [{
                                name,
                                '1': []
                            }]
                    };
                    data[(this.settings.targetAPI < BUILD_ANDROID.OREO ? '#include' : '#exclude')]['app'] = true;
                    const root = $xml$2.getTemplateLevel(data, '0');
                    for (const attr in font) {
                        const [style, weight] = attr.split('-');
                        root['1'].push({
                            style,
                            weight,
                            font: `@font/${name + (style === 'normal' && weight === '400' ? `_${style}`
                            : (style !== 'normal' ? `_${style}` : '') + (weight !== '400' ? `_${FONTWEIGHT_ANDROID[weight] || weight}`
                                : ''))}`
                        });
                    }
                    xml += '\n\n' + $xml$2.insertTemplateData(template, data);
                }
                xml = $xml$2.replaceTab(xml, this.settings);
                if (saveToDisk) {
                    this.saveToDisk(this.parseFileDetails(xml));
                }
            }
            return xml.trim();
        }
        resourceColorToXml(saveToDisk = false) {
            let xml = '';
            if (this.stored.colors.size > 0) {
                this.stored.colors = new Map([...this.stored.colors.entries()].sort());
                const template = $xml$2.parseTemplate(COLOR_TMPL);
                const data = {
                    '0': [{
                            '1': []
                        }]
                };
                const root = $xml$2.getTemplateLevel(data, '0');
                for (const [name, value] of this.stored.colors.entries()) {
                    root['1'].push({ name, value });
                }
                xml = $xml$2.insertTemplateData(template, data);
                xml = $xml$2.replaceTab(xml, this.settings);
                if (saveToDisk) {
                    this.saveToDisk(this.parseFileDetails(xml));
                }
            }
            return xml;
        }
        resourceStyleToXml(saveToDisk = false) {
            let xml = '';
            if (this.stored.styles.size > 0) {
                this.stored.styles = new Map([...this.stored.styles.entries()].sort(caseInsensitve));
                const template = $xml$2.parseTemplate(STYLE_TMPL);
                const data = {
                    '0': [{
                            '1': []
                        }]
                };
                const root = $xml$2.getTemplateLevel(data, '0');
                for (const [name1, style] of this.stored.styles.entries()) {
                    const styleItem = {
                        name1,
                        parent: style.parent || '',
                        '2': []
                    };
                    style.attributes
                        .split(';')
                        .sort()
                        .forEach((attr) => {
                        const [name2, value] = attr.split('=');
                        styleItem['2'].push({ name2, value: value.replace(/"/g, '') });
                    });
                    root['1'].push(styleItem);
                }
                xml = $xml$2.insertTemplateData(template, data);
                xml = replaceUnit(xml, this.settings, true);
                xml = $xml$2.replaceTab(xml, this.settings);
                if (saveToDisk) {
                    this.saveToDisk(this.parseFileDetails(xml));
                }
            }
            return xml;
        }
        resourceDimenToXml(saveToDisk = false) {
            let xml = '';
            this.stored.dimens = new Map([...this.stored.dimens.entries()].sort());
            if (this.stored.dimens.size > 0) {
                const template = $xml$2.parseTemplate(DIMEN_TMPL);
                const data = {
                    '0': [{
                            '1': []
                        }]
                };
                const root = $xml$2.getTemplateLevel(data, '0');
                for (const [name, value] of this.stored.dimens.entries()) {
                    root['1'].push({ name, value });
                }
                xml = $xml$2.insertTemplateData(template, data);
                xml = replaceUnit(xml, this.settings);
                xml = $xml$2.replaceTab(xml, this.settings);
                if (saveToDisk) {
                    this.saveToDisk(this.parseFileDetails(xml));
                }
            }
            return xml;
        }
        resourceDrawableToXml(saveToDisk = false) {
            let xml = '';
            if (this.stored.drawables.size > 0 || this.stored.images.size > 0) {
                const template = $xml$2.parseTemplate(DRAWABLE_TMPL);
                const data = {
                    '0': []
                };
                const root = data['0'];
                for (const [name, value] of this.stored.drawables.entries()) {
                    root.push({
                        name: `res/drawable/${name}.xml`,
                        value
                    });
                }
                for (const [name, images] of this.stored.images.entries()) {
                    if (Object.keys(images).length > 1) {
                        for (const dpi in images) {
                            root.push({
                                name: `res/drawable-${dpi}/${name}.${$util$3.lastIndexOf(images[dpi], '.')}`,
                                value: `<!-- image: ${images[dpi]} -->`
                            });
                        }
                    }
                    else if (images['mdpi']) {
                        root.push({
                            name: `res/drawable/${name}.${$util$3.lastIndexOf(images['mdpi'], '.')}`,
                            value: `<!-- image: ${images['mdpi']} -->`
                        });
                    }
                }
                xml = $xml$2.insertTemplateData(template, data);
                xml = replaceUnit(xml, this.settings);
                xml = $xml$2.replaceTab(xml, this.settings);
                if (saveToDisk) {
                    this.saveToDisk([...this.parseImageDetails(xml), ...this.parseFileDetails(xml)]);
                }
            }
            return xml;
        }
        parseImageDetails(xml) {
            const result = [];
            const pattern = /<!-- image: (.+) -->\n<!-- filename: (.+)\/(.*?\.\w+) -->/;
            let match = null;
            while ((match = pattern.exec(xml)) != null) {
                result.push({
                    uri: match[1],
                    pathname: match[2],
                    filename: match[3],
                    content: ''
                });
                xml = xml.replace(match[0], '');
            }
            return result;
        }
        parseFileDetails(xml) {
            const result = [];
            const pattern = /<\?xml[\w\W]*?(<!-- filename: (.+)\/(.*?\.xml) -->)/;
            let match = null;
            while ((match = pattern.exec(xml)) != null) {
                result.push({
                    content: match[0].replace(match[1], '').trim(),
                    pathname: match[2],
                    filename: match[3]
                });
                xml = xml.replace(match[0], '');
            }
            return result;
        }
        getLayoutFile(pathname, filename, content) {
            return {
                pathname,
                filename,
                content
            };
        }
    }

    const settings = {
        builtInExtensions: [
            'androme.external',
            'androme.origin',
            'androme.custom',
            'androme.accessibility',
            'androme.list',
            'androme.table',
            'androme.grid',
            'androme.widget'
        ],
        targetAPI: BUILD_ANDROID.OREO,
        density: DENSITY_ANDROID.MDPI,
        supportRTL: true,
        dimensResourceValue: true,
        numberResourceValue: false,
        fontAliasResourceValue: true,
        alwaysReevaluateResources: true,
        renderInlineText: true,
        ellipsisOnTextOverflow: true,
        preloadImages: true,
        autoSizeBackgroundImage: true,
        autoSizePaddingAndBorderWidth: true,
        whitespaceHorizontalOffset: 3.5,
        whitespaceVerticalOffset: 16,
        constraintChainDisabled: false,
        constraintChainPackedHorizontalOffset: 3.5,
        constraintChainPackedVerticalOffset: 16,
        constraintCirclePositionAbsolute: false,
        constraintPercentAccuracy: 4,
        supportNegativeLeftTop: true,
        floatOverlapDisabled: false,
        collapseUnattributedElements: true,
        customizationsOverwritePrivilege: false,
        showAttributes: true,
        insertSpaces: 4,
        convertPixels: 'dp',
        autoCloseOnWrite: true,
        outputDirectory: 'app/src/main',
        outputMainFileName: 'activity_main.xml',
        outputArchiveFileType: 'zip',
        outputMaxProcessingTime: 30
    };

    const WIDGET_NAME = {
        FAB: 'androme.widget.floatingactionbutton',
        MENU: 'androme.widget.menu',
        COORDINATOR: 'androme.widget.coordinator',
        TOOLBAR: 'androme.widget.toolbar',
        DRAWER: 'androme.widget.drawer',
        BOTTOM_NAVIGATION: 'androme.widget.bottomnavigation'
    };
    const VIEW_SUPPORT = {
        DRAWER: 'android.support.v4.widget.DrawerLayout',
        NAVIGATION_VIEW: 'android.support.design.widget.NavigationView',
        COORDINATOR: 'android.support.design.widget.CoordinatorLayout',
        APPBAR: 'android.support.design.widget.AppBarLayout',
        COLLAPSING_TOOLBAR: 'android.support.design.widget.CollapsingToolbarLayout',
        TOOLBAR: 'android.support.v7.widget.Toolbar',
        FLOATING_ACTION_BUTTON: 'android.support.design.widget.FloatingActionButton',
        BOTTOM_NAVIGATION: 'android.support.design.widget.BottomNavigationView'
    };
    const VIEW_NAVIGATION = {
        MENU: 'menu',
        ITEM: 'item',
        GROUP: 'group'
    };
    const DRAWABLE_PREFIX = {
        MENU: 'ic_menu_',
        DIALOG: 'ic_dialog_'
    };

    class ExternalAndroid extends androme.lib.base.extensions.External {
    }

    class OriginAndroid extends androme.lib.base.extensions.Origin {
    }

    class CustomAndroid extends androme.lib.base.extensions.Custom {
        constructor(name, framework = 0, tagNames, options) {
            super(name, framework, tagNames, options);
        }
        afterInsert() {
            const node = this.node;
            const options = Object.assign({}, this.options[node.element.id]);
            node.apply(ResourceHandler.formatOptions(options, this.application.settings));
        }
    }

    var $enum$3 = androme.lib.enumeration;
    var $util$4 = androme.lib.util;
    var $dom$3 = androme.lib.dom;
    class AccessibilityAndroid extends androme.lib.base.extensions.Accessibility {
        constructor(name, framework = 0, tagNames, options) {
            super(name, framework, tagNames, options);
        }
        afterRender() {
            for (const node of this.application.cache.elements) {
                if (!node.hasBit('excludeProcedure', $enum$3.NODE_PROCEDURE.ACCESSIBILITY)) {
                    const element = node.element;
                    switch (node.controlName) {
                        case NODE_ANDROID.EDIT:
                            if (!node.companion) {
                                [node.nextElementSibling, node.previousElementSibling].some((sibling) => {
                                    const label = $dom$3.getNodeFromElement(sibling);
                                    const labelParent = sibling && sibling.parentElement && sibling.parentElement.tagName === 'LABEL' ? $dom$3.getNodeFromElement(sibling.parentElement) : null;
                                    if (label && label.visible && label.pageflow) {
                                        if ($util$4.hasValue(sibling.htmlFor) && sibling.htmlFor === element.id) {
                                            label.android('labelFor', node.stringId);
                                            return true;
                                        }
                                        else if (label.textElement && labelParent) {
                                            labelParent.android('labelFor', node.stringId);
                                            return true;
                                        }
                                    }
                                    return false;
                                });
                            }
                        case NODE_ANDROID.SELECT:
                        case NODE_ANDROID.CHECKBOX:
                        case NODE_ANDROID.RADIO:
                        case NODE_ANDROID.BUTTON:
                            if (element.disabled) {
                                node.android('focusable', 'false');
                            }
                            break;
                    }
                }
            }
        }
    }

    var $enum$4 = androme.lib.enumeration;
    var $const$1 = androme.lib.constant;
    var $util$5 = androme.lib.util;
    class ListAndroid extends androme.lib.base.extensions.List {
        constructor(name, framework = 0, tagNames, options) {
            super(name, framework, tagNames, options);
        }
        processChild() {
            const node = this.node;
            const mainData = node.data($const$1.EXT_NAME.LIST, 'mainData');
            if (mainData) {
                const parent = this.parent;
                const controller = this.application.viewController;
                const settings = this.application.settings;
                const parentLeft = $util$5.convertInt(parent.css('paddingLeft')) + $util$5.convertInt(parent.cssInitial('marginLeft', true));
                let columnCount = 0;
                let paddingLeft = node.marginLeft;
                node.modifyBox($enum$4.BOX_STANDARD.MARGIN_LEFT, null);
                if (parent.is($enum$4.NODE_STANDARD.GRID)) {
                    columnCount = $util$5.convertInt(parent.app('columnCount'));
                    paddingLeft += parentLeft;
                }
                else if (parent.children[0] === node) {
                    paddingLeft += parentLeft;
                }
                const ordinal = node.children.find(item => item.float === 'left' &&
                    $util$5.convertInt(item.cssInitial('marginLeft', true)) < 0 &&
                    Math.abs($util$5.convertInt(item.cssInitial('marginLeft', true))) <= $util$5.convertInt(item.documentParent.cssInitial('marginLeft', true)));
                if (ordinal && mainData.ordinal === '') {
                    let output = '';
                    ordinal.parent = parent;
                    if (ordinal.inlineText || ordinal.children.length === 0) {
                        output = controller.renderNode(ordinal, parent, $enum$4.NODE_STANDARD.TEXT);
                    }
                    else if (ordinal.children.every(item => item.pageflow)) {
                        output = controller.renderGroup(ordinal, parent, $enum$4.NODE_STANDARD.RELATIVE);
                    }
                    else {
                        output = controller.renderGroup(ordinal, parent, $enum$4.NODE_STANDARD.CONSTRAINT);
                    }
                    controller.prependBefore(node.id, output);
                    if (columnCount === 3) {
                        node.app('layout_columnSpan', '2');
                    }
                    paddingLeft += ordinal.marginLeft;
                    ordinal.modifyBox($enum$4.BOX_STANDARD.MARGIN_LEFT, null);
                    if (!ordinal.hasWidth && paddingLeft > 0) {
                        ordinal.android('minWidth', $util$5.formatPX(paddingLeft));
                    }
                }
                else {
                    const columnWeight = columnCount > 0 ? '0' : '';
                    const positionInside = node.css('listStylePosition') === 'inside';
                    const listStyleImage = !['', 'none'].includes(node.css('listStyleImage'));
                    let image = '';
                    let [left, top] = [0, 0];
                    if (mainData.imageSrc !== '') {
                        image = ResourceHandler.addImageURL(mainData.imageSrc);
                        [left, top] = ResourceHandler.parseBackgroundPosition(mainData.imagePosition, node.css('fontSize')).map(value => $util$5.convertInt(value));
                    }
                    const gravity = (image !== '' && !listStyleImage) || (parentLeft === 0 && node.marginLeft === 0) ? '' : 'right';
                    if (gravity === '') {
                        paddingLeft += node.paddingLeft;
                        node.modifyBox($enum$4.BOX_STANDARD.PADDING_LEFT, null);
                    }
                    if (left > 0 && paddingLeft > left) {
                        paddingLeft -= left;
                    }
                    paddingLeft = Math.max(paddingLeft, 20);
                    const minWidth = paddingLeft > 0 ? delimitDimens(node.nodeName, parseRTL('min_width', settings), $util$5.formatPX(paddingLeft), settings) : '';
                    const paddingRight = (() => {
                        if (paddingLeft <= 24) {
                            return 6;
                        }
                        else if (paddingLeft <= 32) {
                            return 8;
                        }
                        else {
                            return 10;
                        }
                    })();
                    let marginLeftValue = left > 0 ? $util$5.formatPX(left) : '';
                    const paddingLeftValue = gravity === '' && image === '' ? $util$5.formatPX(paddingRight)
                        : (paddingLeft === 20 ? '2px' : '');
                    const paddingRightValue = gravity === 'right' && paddingLeft > 20 ? $util$5.formatPX(paddingRight) : '';
                    const options = {
                        android: {},
                        app: {
                            layout_columnWeight: columnWeight
                        }
                    };
                    if (positionInside) {
                        if (marginLeftValue !== '') {
                            marginLeftValue = delimitDimens(node.nodeName, parseRTL('margin_left', settings), marginLeftValue, settings);
                        }
                        controller.prependBefore(node.id, controller.renderNodeStatic($enum$4.NODE_STANDARD.SPACE, parent.renderDepth + 1, {
                            android: {
                                minWidth,
                                [parseRTL('layout_marginLeft', settings)]: marginLeftValue
                            },
                            app: { layout_columnWeight: columnWeight }
                        }, 'wrap_content', 'wrap_content'));
                        Object.assign(options.android, {
                            minWidth: delimitDimens(node.nodeName, parseRTL('min_width', settings), $util$5.formatPX(24), settings)
                        });
                    }
                    else {
                        Object.assign(options.android, {
                            minWidth,
                            gravity: paddingLeft > 20 ? parseRTL(gravity, settings) : '',
                            [parseRTL('layout_marginLeft', settings)]: marginLeftValue,
                            [parseRTL('paddingLeft', settings)]: paddingLeftValue,
                            [parseRTL('paddingRight', settings)]: paddingRightValue,
                            paddingTop: node.paddingTop > 0 ? $util$5.formatPX(node.paddingTop) : ''
                        });
                        if (columnCount === 3) {
                            node.app('layout_columnSpan', '2');
                        }
                    }
                    if (node.tagName === 'DT' && image === '') {
                        node.app('layout_columnSpan', columnCount.toString());
                    }
                    else {
                        if (image !== '') {
                            Object.assign(options.android, {
                                src: `@drawable/${image}`,
                                layout_marginTop: top > 0 ? $util$5.formatPX(top) : '',
                                baselineAlignBottom: 'true',
                                scaleType: !positionInside && gravity === 'right' ? 'fitEnd' : 'fitStart'
                            });
                        }
                        else {
                            Object.assign(options.android, { text: mainData.ordinal });
                        }
                        const companion = new View(this.application.cache.nextId, document.createElement('SPAN'));
                        companion.api = node.api;
                        companion.alignmentType = $enum$4.NODE_ALIGNMENT.SPACE;
                        companion.nodeName = `${node.tagName}_ORDINAL`;
                        companion.setNodeType(NODE_ANDROID.SPACE);
                        companion.inherit(node, 'style');
                        if (mainData.ordinal !== '' && !/[A-Za-z0-9]+\./.test(mainData.ordinal) && companion.toInt('fontSize') > 12) {
                            companion.css('fontSize', '12px');
                        }
                        node.companion = companion;
                        this.application.cache.append(companion);
                        controller.prependBefore(node.id, controller.renderNodeStatic(image !== '' ? $enum$4.NODE_STANDARD.IMAGE
                            : mainData.ordinal !== '' ? $enum$4.NODE_STANDARD.TEXT : $enum$4.NODE_STANDARD.SPACE, parent.renderDepth + 1, options, 'wrap_content', 'wrap_content', companion));
                    }
                }
                if (columnCount > 0) {
                    node.app('layout_columnWeight', '1');
                }
            }
            return { output: '', complete: true };
        }
        beforeInsert() {
            const node = this.node;
            if (node.is($enum$4.NODE_STANDARD.GRID)) {
                const columnCount = node.app('columnCount');
                const children = node.renderChildren;
                for (let i = 0; i < children.length; i++) {
                    const current = children[i];
                    const previous = children[i - 1];
                    let spaceHeight = 0;
                    if (previous) {
                        const marginBottom = $util$5.convertInt(previous.android('layout_marginBottom'));
                        if (marginBottom > 0) {
                            spaceHeight += $util$5.convertInt(previous.android('layout_marginBottom'));
                            previous.delete('android', 'layout_marginBottom');
                            previous.modifyBox($enum$4.BOX_STANDARD.MARGIN_BOTTOM, null);
                        }
                    }
                    const marginTop = $util$5.convertInt(current.android('layout_marginTop'));
                    if (marginTop > 0) {
                        spaceHeight += marginTop;
                        current.delete('android', 'layout_marginTop');
                        current.modifyBox($enum$4.BOX_STANDARD.MARGIN_TOP, null);
                    }
                    if (spaceHeight > 0) {
                        this.application.viewController.prependBefore(current.id, this.application.viewController.renderNodeStatic($enum$4.NODE_STANDARD.SPACE, current.renderDepth, {
                            app: { layout_columnSpan: columnCount.toString() }
                        }, 'match_parent', $util$5.formatPX(spaceHeight)), 0);
                    }
                }
            }
        }
        afterInsert() {
            const node = this.node;
            if (node.is($enum$4.NODE_STANDARD.GRID) && node.blockStatic && !node.has('width')) {
                node.android('layout_width', 'match_parent');
            }
        }
    }

    var $enum$5 = androme.lib.enumeration;
    var $const$2 = androme.lib.constant;
    var $util$6 = androme.lib.util;
    var $dom$4 = androme.lib.dom;
    class GridAndroid extends androme.lib.base.extensions.Grid {
        constructor(name, framework = 0, tagNames, options) {
            super(name, framework, tagNames, options);
        }
        processChild() {
            const node = this.node;
            const data = node.data($const$2.EXT_NAME.GRID, 'cellData');
            if (data) {
                if (data.rowSpan > 1) {
                    node.app('layout_rowSpan', data.rowSpan.toString());
                }
                if (data.columnSpan > 1) {
                    node.app('layout_columnSpan', data.columnSpan.toString());
                }
                if (node.parent.display === 'table' && node.display === 'table-cell') {
                    node.app('layout_gravity', 'fill');
                }
            }
            return super.processChild();
        }
        afterRender() {
            for (const node of this.subscribers) {
                if (!(node.display === 'table' && node.css('borderCollapse') === 'collapse')) {
                    const mainData = node.data($const$2.EXT_NAME.GRID, 'mainData');
                    if (mainData) {
                        node.each(item => {
                            const cellData = item.data($const$2.EXT_NAME.GRID, 'cellData');
                            if (cellData) {
                                const dimensions = $dom$4.getBoxSpacing(item.documentParent.element, true);
                                const padding = mainData.padding;
                                if (cellData.cellFirst) {
                                    padding.top = dimensions.paddingTop + dimensions.marginTop;
                                }
                                if (cellData.rowStart) {
                                    padding.left = Math.max(dimensions.marginLeft + dimensions.paddingLeft, padding.left);
                                }
                                if (cellData.rowEnd) {
                                    const heightBottom = dimensions.marginBottom + dimensions.paddingBottom + (!cellData.cellLast ? dimensions.marginTop + dimensions.paddingTop : 0);
                                    if (heightBottom > 0) {
                                        if (cellData.cellLast) {
                                            padding.bottom = heightBottom;
                                        }
                                        else {
                                            this.application.viewController.appendAfter(item.id, this.application.viewController.renderNodeStatic(NODE_ANDROID.SPACE, item.renderDepth, {
                                                app: { layout_columnSpan: mainData.columnCount.toString() }
                                            }, 'match_parent', $util$6.formatPX(heightBottom)));
                                        }
                                    }
                                    padding.right = Math.max(dimensions.marginRight + dimensions.paddingRight, padding.right);
                                }
                            }
                        }, true);
                    }
                }
            }
            for (const node of this.subscribers) {
                const data = node.data($const$2.EXT_NAME.GRID, 'mainData');
                if (data) {
                    node.modifyBox($enum$5.BOX_STANDARD.PADDING_TOP, data.padding.top);
                    node.modifyBox($enum$5.BOX_STANDARD.PADDING_RIGHT, data.padding.right);
                    node.modifyBox($enum$5.BOX_STANDARD.PADDING_BOTTOM, data.padding.bottom);
                    node.modifyBox($enum$5.BOX_STANDARD.PADDING_LEFT, data.padding.left);
                }
            }
        }
    }

    var $const$3 = androme.lib.constant;
    var $util$7 = androme.lib.util;
    class TableAndroid extends androme.lib.base.extensions.Table {
        constructor(name, framework = 0, tagNames, options) {
            super(name, framework, tagNames, options);
        }
        processNode() {
            const result = super.processNode();
            const node = this.node;
            const columnCount = $util$7.convertInt(node.app('columnCount'));
            if (columnCount > 1) {
                let requireWidth = !!node.data($const$3.EXT_NAME.TABLE, 'expand');
                node.each((item) => {
                    if (item.css('width') === '0px') {
                        item.android('layout_width', '0px');
                        item.app('layout_columnWeight', (item.element.colSpan || 1).toString());
                    }
                    else {
                        const expand = item.data($const$3.EXT_NAME.TABLE, 'expand');
                        const exceed = !!item.data($const$3.EXT_NAME.TABLE, 'exceed');
                        const downsized = !!item.data($const$3.EXT_NAME.TABLE, 'downsized');
                        if (expand != null) {
                            if (expand) {
                                const percent = $util$7.convertFloat(item.data($const$3.EXT_NAME.TABLE, 'percent')) / 100;
                                if (percent > 0) {
                                    item.android('layout_width', '0px');
                                    item.app('layout_columnWeight', $util$7.trimEnd(percent.toFixed(3), '0'));
                                    requireWidth = true;
                                }
                            }
                            else {
                                item.app('layout_columnWeight', '0');
                            }
                        }
                        if (downsized) {
                            if (exceed) {
                                item.app('layout_columnWeight', '0.01');
                            }
                            else {
                                if (item.textElement) {
                                    item.android('maxLines', '1');
                                }
                                if (item.has('width') && item.toInt('width') < item.bounds.width) {
                                    item.android('layout_width', $util$7.formatPX(item.bounds.width));
                                }
                            }
                        }
                    }
                });
                if (requireWidth && !node.hasWidth) {
                    let widthParent = 0;
                    node.ascend()
                        .some(item => {
                        if (item.hasWidth) {
                            widthParent = item.bounds.width;
                            return true;
                        }
                        return false;
                    });
                    if (node.bounds.width >= widthParent) {
                        node.android('layout_width', 'match_parent');
                    }
                    else {
                        node.css('width', $util$7.formatPX(node.bounds.width));
                    }
                }
            }
            return result;
        }
        processChild() {
            const node = this.node;
            const rowSpan = $util$7.convertInt(node.data($const$3.EXT_NAME.TABLE, 'rowSpan'));
            const columnSpan = $util$7.convertInt(node.data($const$3.EXT_NAME.TABLE, 'colSpan'));
            const spaceSpan = $util$7.convertInt(node.data($const$3.EXT_NAME.TABLE, 'spaceSpan'));
            if (rowSpan > 1) {
                node.app('layout_rowSpan', rowSpan.toString());
            }
            if (columnSpan > 1) {
                node.app('layout_columnSpan', columnSpan.toString());
            }
            if (spaceSpan > 0) {
                const parent = this.parent;
                this.application.viewController.appendAfter(node.id, this.application.viewController.renderNodeStatic(NODE_ANDROID.SPACE, parent.renderDepth + 1, {
                    app: { layout_columnSpan: spaceSpan.toString() }
                }, 'wrap_content', 'wrap_content'));
            }
            return { output: '', complete: true };
        }
    }

    var $enum$6 = androme.lib.enumeration;
    var $util$8 = androme.lib.util;
    var $color$1 = androme.lib.color;
    class FloatingActionButton extends androme.lib.base.extensions.Button {
        constructor(name, framework = 0, tagNames, options) {
            super(name, framework, tagNames, options);
        }
        processNode() {
            const node = this.node;
            const parent = this.parent;
            const target = $util$8.hasValue(node.dataset.target);
            const element = node.element;
            const options = Object.assign({}, this.options[element.id]);
            const backgroundColor = $color$1.parseRGBA(node.css('backgroundColor'), node.css('opacity'));
            $util$8.overwriteDefault(options, 'android', 'backgroundTint', backgroundColor.length > 0 ? `@color/${ResourceHandler.addColor(backgroundColor[0], backgroundColor[2])}`
                : '?attr/colorAccent');
            if (node.hasBit('excludeProcedure', $enum$6.NODE_PROCEDURE.ACCESSIBILITY)) {
                $util$8.overwriteDefault(options, 'android', 'focusable', 'false');
            }
            let src = '';
            switch (element.tagName) {
                case 'IMG':
                    src = ResourceHandler.addImageSrcSet(element, DRAWABLE_PREFIX.DIALOG);
                    break;
                case 'INPUT':
                    if (element.type === 'image') {
                        src = ResourceHandler.addImage({ 'mdpi': element.src }, DRAWABLE_PREFIX.DIALOG);
                    }
                    else {
                        src = ResourceHandler.addImageURL(node.css('backgroundImage'), DRAWABLE_PREFIX.DIALOG);
                    }
                    break;
                case 'BUTTON':
                    src = ResourceHandler.addImageURL(node.css('backgroundImage'), DRAWABLE_PREFIX.DIALOG);
                    break;
            }
            if (src !== '') {
                $util$8.overwriteDefault(options, 'app', 'srcCompat', `@drawable/${src}`);
            }
            const output = this.application.viewController.renderNodeStatic(VIEW_SUPPORT.FLOATING_ACTION_BUTTON, target ? -1 : parent.renderDepth + 1, options, 'wrap_content', 'wrap_content', node);
            node.nodeType = $enum$6.NODE_STANDARD.BUTTON;
            node.excludeResource |= $enum$6.NODE_RESOURCE.BOX_STYLE | $enum$6.NODE_RESOURCE.ASSET;
            if (!node.pageflow || target) {
                node.auto = false;
                this.setFrameGravity(node);
                if (target) {
                    let anchor = parent.stringId;
                    if (parent.controlName === VIEW_SUPPORT.TOOLBAR) {
                        const outerParent = parent.data(WIDGET_NAME.TOOLBAR, 'outerParent');
                        if (outerParent) {
                            anchor = outerParent;
                        }
                    }
                    node.app('layout_anchor', anchor);
                    node.app('layout_anchorGravity', node.android('layout_gravity'));
                    node.delete('android', 'layout_gravity');
                    node.excludeProcedure |= $enum$6.NODE_PROCEDURE.ALIGNMENT;
                    node.render(node);
                }
                else {
                    node.render(parent);
                }
            }
            else {
                node.render(parent);
            }
            return { output, complete: true };
        }
        afterInsert() {
            const node = this.node;
            node.android('layout_width', 'wrap_content');
            node.android('layout_height', 'wrap_content');
        }
        setFrameGravity(node) {
            const settings = this.application.settings;
            const parent = node.documentParent;
            const horizontalBias = node.horizontalBias(settings);
            const verticalBias = node.verticalBias(settings);
            const gravity = [];
            if (horizontalBias < 0.5) {
                gravity.push(parseRTL('left', settings));
            }
            else if (horizontalBias > 0.5) {
                gravity.push(parseRTL('right', settings));
            }
            else {
                gravity.push('center_horizontal');
            }
            if (verticalBias < 0.5) {
                gravity.push('top');
                node.app('layout_dodgeInsetEdges', 'top');
            }
            else if (verticalBias > 0.5) {
                gravity.push('bottom');
            }
            else {
                gravity.push('center_vertical');
            }
            node.android('layout_gravity', gravity.filter(value => value.indexOf('center') !== -1).length === 2 ? 'center' : gravity.join('|'));
            if (horizontalBias > 0 && horizontalBias < 1 && horizontalBias !== 0.5) {
                if (horizontalBias < 0.5) {
                    node.css('marginLeft', $util$8.formatPX(Math.floor(node.bounds.left - parent.box.left)));
                }
                else {
                    node.css('marginRight', $util$8.formatPX(Math.floor(parent.box.right - node.bounds.right)));
                }
            }
            if (verticalBias > 0 && verticalBias < 1 && verticalBias !== 0.5) {
                if (verticalBias < 0.5) {
                    node.css('marginTop', $util$8.formatPX(Math.floor(node.bounds.top - parent.box.top)));
                }
                else {
                    node.css('marginBottom', $util$8.formatPX(Math.floor(parent.box.bottom - node.bounds.bottom)));
                }
            }
        }
    }

    var $enum$7 = androme.lib.enumeration;
    const VALIDATE_ITEM = {
        id: /^@\+id\/\w+$/,
        title: /^.+$/,
        titleCondensed: /^.+$/,
        icon: /^@drawable\/.+$/,
        onClick: /^.+$/,
        showAsAction: /^(ifRoom|never|withText|always|collapseActionView)$/,
        actionLayout: /^@layout\/.+$/,
        actionViewClass: /^.+$/,
        actionProviderClass: /^.+$/,
        alphabeticShortcut: /^[a-zA-Z]+$/,
        alphabeticModifiers: /(META|CTRL|ALT|SHIFT|SYM|FUNCTION)+/g,
        numericShortcut: /^[0-9]+$/,
        numericModifiers: /(META|CTRL|ALT|SHIFT|SYM|FUNCTION)+/g,
        checkable: /^(true|false)$/,
        visible: /^(true|false)$/,
        enabled: /^(true|false)$/,
        menuCategory: /^(container|system|secondary|alternative)$/,
        orderInCategory: /^[0-9]+$/
    };
    const VALIDATE_GROUP = {
        id: /^@\+id\/\w+$/,
        checkableBehavior: /^(none|all|single)$/,
        visible: /^(true|false)$/,
        enabled: /^(true|false)$/,
        menuCategory: /^(container|system|secondary|alternative)$/,
        orderInCategory: /^[0-9]+$/
    };
    const NAMESPACE_APP = ['showAsAction', 'actionViewClass', 'actionProviderClass'];
    class Menu extends androme.lib.base.extensions.Nav {
        constructor(name, framework = 0, tagNames, options) {
            super(name, framework, tagNames, options);
        }
        condition() {
            return this.included();
        }
        processNode() {
            const node = this.node;
            const output = this.application.viewController.renderNodeStatic(VIEW_NAVIGATION.MENU, 0, {}, '', '', node, true);
            node.documentRoot = true;
            node.nodeType = $enum$7.NODE_STANDARD.BLOCK;
            node.excludeResource |= $enum$7.NODE_RESOURCE.ALL;
            node.excludeProcedure |= $enum$7.NODE_PROCEDURE.ALL;
            node.rendered = true;
            node.cascade().forEach(item => this.subscribersChild.add(item));
            return { output, complete: true };
        }
        processChild() {
            const node = this.node;
            const parent = this.parent;
            if (node.plainText) {
                node.hide();
                return { output: '', complete: true, next: true };
            }
            const element = node.element;
            const options = { android: {}, app: {} };
            let nodeName = VIEW_NAVIGATION.ITEM;
            let title = '';
            let next = false;
            let layout = false;
            if (node.children.some(item => (!item.inlineElement || !item.blockStatic) && item.children.length > 0)) {
                if (node.children.some(item => item.tagName === 'NAV')) {
                    if (element.title !== '') {
                        title = element.title;
                    }
                    else {
                        Array
                            .from(node.element.childNodes)
                            .some((item) => {
                            if (item.nodeName === '#text') {
                                if (item.textContent) {
                                    title = item.textContent.trim();
                                    if (title !== '') {
                                        return true;
                                    }
                                }
                                return false;
                            }
                            else if (item.tagName !== 'NAV') {
                                title = item.innerText.trim();
                                return true;
                            }
                            return false;
                        });
                    }
                    node.each(item => item.tagName !== 'NAV' && item.hide());
                }
                else if (node.tagName === 'NAV') {
                    nodeName = VIEW_NAVIGATION.MENU;
                    next = true;
                }
                else {
                    nodeName = VIEW_NAVIGATION.GROUP;
                    let checkable = '';
                    if (node.children.every((item) => this.hasInputType(item, 'radio'))) {
                        checkable = 'single';
                    }
                    else if (node.children.every((item) => this.hasInputType(item, 'checkbox'))) {
                        checkable = 'all';
                    }
                    options.android.checkableBehavior = checkable;
                }
                layout = true;
            }
            else {
                if (parent.android('checkableBehavior') === '') {
                    if (this.hasInputType(node, 'checkbox')) {
                        options.android.checkable = 'true';
                    }
                }
                title = (element.title || element.innerText).trim();
            }
            switch (nodeName) {
                case VIEW_NAVIGATION.ITEM:
                    this.parseDataSet(VALIDATE_ITEM, element, options);
                    if (node.android('icon') === '') {
                        let src = ResourceHandler.addImageURL(element.style.backgroundImage, DRAWABLE_PREFIX.MENU);
                        if (src !== '') {
                            options.android.icon = `@drawable/${src}`;
                        }
                        else {
                            const image = node.children.find(item => item.imageElement);
                            if (image) {
                                src = ResourceHandler.addImageSrcSet(image.element, DRAWABLE_PREFIX.MENU);
                                if (src !== '') {
                                    options.android.icon = `@drawable/${src}`;
                                }
                            }
                        }
                    }
                    break;
                case VIEW_NAVIGATION.GROUP:
                    this.parseDataSet(VALIDATE_GROUP, element, options);
                    break;
            }
            if (node.android('title') === '') {
                if (title !== '') {
                    const name = ResourceHandler.addString(title, '', this.application.settings);
                    if (name !== '') {
                        title = `@string/${name}`;
                    }
                    options.android.title = title;
                }
            }
            if (!options.android.id) {
                node.setNodeType(nodeName);
            }
            else {
                node.controlName = nodeName;
            }
            const output = this.application.viewController.renderNodeStatic(nodeName, parent.renderDepth + 1, options, '', '', node, layout);
            node.excludeResource |= $enum$7.NODE_RESOURCE.ALL;
            node.excludeProcedure |= $enum$7.NODE_PROCEDURE.ALL;
            node.rendered = true;
            return { output, complete: true, next };
        }
        afterRender() {
            super.afterRender();
            if (this.included(this.node.element)) {
                this.application.layoutProcessing.pathname = 'res/menu';
            }
        }
        parseDataSet(validator, element, options) {
            for (const attr in element.dataset) {
                const value = element.dataset[attr];
                if (value && validator[attr]) {
                    const match = value.match(validator[attr]);
                    if (match) {
                        const namespace = (this.options.appCompat == null || this.options.appCompat === true) && NAMESPACE_APP.includes(attr) ? 'app' : 'android';
                        options[namespace][attr] = Array.from(new Set(match)).join('|');
                    }
                }
            }
        }
        hasInputType(node, value) {
            return node.children.length > 0 && node.children.some(item => item.element.type === value);
        }
    }

    var $enum$8 = androme.lib.enumeration;
    var $dom$5 = androme.lib.dom;
    class Coordinator extends androme.lib.base.Extension {
        constructor(name, framework = 0, tagNames, options) {
            super(name, framework, tagNames, options);
        }
        processNode() {
            const node = this.node;
            const parent = this.parent;
            const output = this.application.viewController.renderGroup(node, parent, VIEW_SUPPORT.COORDINATOR);
            node.apply(this.options[node.element.id]);
            node.nodeType = $enum$8.NODE_STANDARD.BLOCK;
            node.excludeResource |= $enum$8.NODE_RESOURCE.ASSET;
            const toolbar = $dom$5.getNodeFromElement($dom$5.locateExtension(node.element, WIDGET_NAME.TOOLBAR));
            if (toolbar) {
                const ext = this.application.getExtension(WIDGET_NAME.TOOLBAR);
                if (ext) {
                    if (ext.options[toolbar.element.id] && ext.options[toolbar.element.id].collapsingToolbar) {
                        node.android('fitsSystemWindows', 'true');
                    }
                }
            }
            return { output, complete: false };
        }
        afterInsert() {
            const node = this.node;
            if (node.documentRoot) {
                node.android('layout_width', 'match_parent');
                node.android('layout_height', 'match_parent');
            }
        }
    }

    const template$9 = [
        '!0',
        '<?xml version="1.0" encoding="utf-8"?>',
        '<resources>',
        '	<style name="{@appTheme}" parent="{@parentTheme}">',
        '!1',
        '		<item name="{name}">{value}</item>',
        '!1',
        '	</style>',
        '	<style name="{@appTheme}.NoActionBar">',
        '		<item name="windowActionBar">false</item>',
        '		<item name="windowNoTitle">true</item>',
        '	</style>',
        '	<style name="AppTheme.AppBarOverlay" parent="{@appBarOverlay}" />',
        '	<style name="AppTheme.PopupOverlay" parent="{@popupOverlay}" />',
        '</resources>',
        '!0'
    ];
    var EXTENSION_APPBAR_TMPL = template$9.join('\n');

    var $enum$9 = androme.lib.enumeration;
    var $const$4 = androme.lib.constant;
    var $util$9 = androme.lib.util;
    var $dom$6 = androme.lib.dom;
    var $xml$3 = androme.lib.xml;
    class Toolbar extends androme.lib.base.Extension {
        constructor(name, framework = 0, tagNames, options) {
            super(name, framework, tagNames, options);
            this.require(WIDGET_NAME.MENU);
        }
        init(element) {
            if (this.included(element)) {
                Array
                    .from(element.children)
                    .some((item) => {
                    if (item.tagName === 'NAV' && !$util$9.includes(item.dataset.ext, $const$4.EXT_NAME.EXTERNAL)) {
                        item.dataset.ext = ($util$9.hasValue(item.dataset.ext) ? `${item.dataset.ext}, ` : '') + $const$4.EXT_NAME.EXTERNAL;
                        return true;
                    }
                    return false;
                });
                if (element.dataset.target) {
                    const target = document.getElementById(element.dataset.target);
                    if (target &&
                        element.parentElement !== target &&
                        !$util$9.includes(target.dataset.ext, WIDGET_NAME.COORDINATOR)) {
                        this.application.elements.add(element);
                    }
                }
            }
            return false;
        }
        processNode() {
            const controller = this.application.viewController;
            const node = this.node;
            const parent = this.parent;
            const target = $util$9.hasValue(node.dataset.target);
            const options = Object.assign({}, this.options[node.element.id]);
            const optionsToolbar = Object.assign({}, options.toolbar);
            const optionsAppBar = Object.assign({}, options.appBar);
            const optionsCollapsingToolbar = Object.assign({}, options.collapsingToolbar);
            const hasMenu = $dom$6.locateExtension(node.element, WIDGET_NAME.MENU) != null;
            const backgroundImage = node.has('backgroundImage');
            const appBarChildren = [];
            const collapsingToolbarChildren = [];
            let output = '';
            let depth = target ? 0 : node.depth;
            let children = node.children.filter(item => item.auto).length;
            Array
                .from(node.element.children)
                .forEach((element) => {
                if (element.tagName === 'IMG') {
                    if ($util$9.hasValue(element.dataset.navigationIcon)) {
                        const result = ResourceHandler.addImageSrcSet(element, DRAWABLE_PREFIX.MENU);
                        if (result !== '') {
                            $util$9.overwriteDefault(toolbar, 'app', 'navigationIcon', `@drawable/${result}`);
                            if ($dom$6.getStyle(element).display !== 'none') {
                                children--;
                            }
                        }
                    }
                    if ($util$9.hasValue(element.dataset.collapseIcon)) {
                        const result = ResourceHandler.addImageSrcSet(element, DRAWABLE_PREFIX.MENU);
                        if (result !== '') {
                            $util$9.overwriteDefault(toolbar, 'app', 'collapseIcon', `@drawable/${result}`);
                            if ($dom$6.getStyle(element).display !== 'none') {
                                children--;
                            }
                        }
                    }
                }
                if ($util$9.hasValue(element.dataset.target)) {
                    children--;
                }
                else {
                    const targetNode = $dom$6.getNodeFromElement(element);
                    if (targetNode) {
                        switch (element.dataset.targetModule) {
                            case 'appBar':
                                appBarChildren.push(targetNode);
                                children--;
                                break;
                            case 'collapsingToolbar':
                                collapsingToolbarChildren.push(targetNode);
                                children--;
                                break;
                        }
                    }
                }
            });
            const hasCollapsingToolbar = options.collapsingToolbar != null || collapsingToolbarChildren.length > 0;
            const hasAppBar = options.appBar != null || appBarChildren.length > 0 || hasCollapsingToolbar;
            let appBarOverlay = '';
            let popupOverlay = '';
            if (hasCollapsingToolbar) {
                $util$9.overwriteDefault(optionsToolbar, 'app', 'layout_collapseMode', 'pin');
            }
            else {
                if (!hasAppBar) {
                    $util$9.overwriteDefault(optionsToolbar, 'android', 'fitsSystemWindows', 'true');
                }
                $util$9.overwriteDefault(optionsToolbar, 'app', 'popupTheme', '@style/ThemeOverlay.AppCompat.Light');
                if (backgroundImage) {
                    $util$9.overwriteDefault(appBarChildren.length > 0 ? optionsAppBar : optionsToolbar, 'android', 'background', `@drawable/${ResourceHandler.addImageURL(node.css('backgroundImage'))}`);
                    node.excludeResource |= $enum$9.NODE_RESOURCE.IMAGE_SOURCE;
                }
                else {
                    $util$9.overwriteDefault(optionsToolbar, 'app', 'layout_scrollFlags', 'scroll|enterAlways');
                }
            }
            if (appBarChildren.length > 0) {
                $util$9.overwriteDefault(optionsAppBar, 'android', 'layout_height', '?android:attr/actionBarSize');
            }
            else {
                $util$9.overwriteDefault(optionsToolbar, 'android', 'layout_height', '?android:attr/actionBarSize');
                node.excludeProcedure |= $enum$9.NODE_PROCEDURE.LAYOUT;
            }
            if (hasMenu) {
                if (hasAppBar) {
                    if (optionsToolbar.app.popupTheme) {
                        popupOverlay = optionsToolbar.app.popupTheme.replace('@style/', '');
                    }
                    optionsToolbar.app.popupTheme = '@style/AppTheme.PopupOverlay';
                }
            }
            const innerDepth = depth + (hasAppBar ? 1 : 0) + (hasCollapsingToolbar ? 1 : 0);
            output =
                controller.renderNodeStatic(VIEW_SUPPORT.TOOLBAR, innerDepth, optionsToolbar, 'match_parent', 'wrap_content', node, children > 0);
            if (hasCollapsingToolbar) {
                if (backgroundImage) {
                    const optionsBackgroundImage = Object.assign({}, options.backgroundImage);
                    let scaleType = 'center';
                    switch (node.css('backgroundSize')) {
                        case 'cover':
                        case '100% auto':
                        case 'auto 100%':
                            scaleType = 'centerCrop';
                            break;
                        case 'contain':
                        case '100% 100%':
                            scaleType = 'fitXY';
                            break;
                        case 'auto':
                            scaleType = 'matrix';
                            break;
                    }
                    $util$9.overwriteDefault(optionsBackgroundImage, 'android', 'id', `${node.stringId}_image`);
                    $util$9.overwriteDefault(optionsBackgroundImage, 'android', 'src', `@drawable/${ResourceHandler.addImageURL(node.css('backgroundImage'))}`);
                    $util$9.overwriteDefault(optionsBackgroundImage, 'android', 'scaleType', scaleType);
                    $util$9.overwriteDefault(optionsBackgroundImage, 'android', 'fitsSystemWindows', 'true');
                    $util$9.overwriteDefault(optionsBackgroundImage, 'app', 'layout_collapseMode', 'parallax');
                    output =
                        controller.renderNodeStatic(NODE_ANDROID.IMAGE, innerDepth, optionsBackgroundImage, 'match_parent', 'match_parent')
                            + output;
                    node.excludeResource |= $enum$9.NODE_RESOURCE.IMAGE_SOURCE;
                }
            }
            let outer = '';
            let appBarNode = null;
            let collapsingToolbarNode = null;
            if (hasAppBar) {
                $util$9.overwriteDefault(optionsAppBar, 'android', 'id', `${node.stringId}_appbar`);
                $util$9.overwriteDefault(optionsAppBar, 'android', 'layout_height', node.viewHeight > 0 ? delimitDimens('appbar', 'height', $util$9.formatPX(node.viewHeight), this.application.settings) : 'wrap_content');
                $util$9.overwriteDefault(optionsAppBar, 'android', 'fitsSystemWindows', 'true');
                if (hasMenu) {
                    if (optionsAppBar.android.theme) {
                        appBarOverlay = optionsAppBar.android.theme;
                    }
                    optionsAppBar.android.theme = '@style/AppTheme.AppBarOverlay';
                    this.createResourceTheme(appBarOverlay, popupOverlay);
                }
                else {
                    $util$9.overwriteDefault(optionsAppBar, 'android', 'theme', '@style/ThemeOverlay.AppCompat.Dark.ActionBar');
                }
                appBarNode = this.createPlaceholder(this.application.cache.nextId, node, appBarChildren);
                appBarNode.parent = node.parent;
                appBarNode.nodeId = stripId(optionsAppBar.android.id);
                this.application.cache.append(appBarNode);
                outer =
                    controller.renderNodeStatic(VIEW_SUPPORT.APPBAR, target ? -1 : depth, optionsAppBar, 'match_parent', 'wrap_content', appBarNode, true);
                if (hasCollapsingToolbar) {
                    depth++;
                    $util$9.overwriteDefault(optionsCollapsingToolbar, 'android', 'id', `${node.stringId}_collapsingtoolbar`);
                    $util$9.overwriteDefault(optionsCollapsingToolbar, 'android', 'fitsSystemWindows', 'true');
                    if (!backgroundImage) {
                        $util$9.overwriteDefault(optionsCollapsingToolbar, 'app', 'contentScrim', '?attr/colorPrimary');
                    }
                    $util$9.overwriteDefault(optionsCollapsingToolbar, 'app', 'layout_scrollFlags', 'scroll|exitUntilCollapsed');
                    $util$9.overwriteDefault(optionsCollapsingToolbar, 'app', 'toolbarId', node.stringId);
                    collapsingToolbarNode = this.createPlaceholder(this.application.cache.nextId, node, collapsingToolbarChildren);
                    collapsingToolbarNode.parent = appBarNode;
                    if (collapsingToolbarNode) {
                        collapsingToolbarNode.each(item => item.dataset.target = collapsingToolbarNode.nodeId);
                        this.application.cache.append(collapsingToolbarNode);
                        const content = controller.renderNodeStatic(VIEW_SUPPORT.COLLAPSING_TOOLBAR, target && !hasAppBar ? -1 : depth, optionsCollapsingToolbar, 'match_parent', 'match_parent', collapsingToolbarNode, true);
                        outer = $xml$3.replacePlaceholder(outer, appBarNode.id, content);
                    }
                }
            }
            if (appBarNode) {
                output = collapsingToolbarNode ? $xml$3.replacePlaceholder(outer, collapsingToolbarNode.id, output)
                    : $xml$3.replacePlaceholder(outer, appBarNode.id, output);
                appBarNode.render(target ? appBarNode : parent);
                if (!collapsingToolbarNode) {
                    node.parent = appBarNode;
                }
                else {
                    collapsingToolbarNode.parent = appBarNode;
                    collapsingToolbarNode.render(appBarNode);
                    node.parent = collapsingToolbarNode;
                }
                node.data(WIDGET_NAME.TOOLBAR, 'outerParent', appBarNode.stringId);
                node.render(node.parent);
            }
            else if (collapsingToolbarNode) {
                collapsingToolbarNode.render(target ? collapsingToolbarNode : parent);
                node.parent = collapsingToolbarNode;
                node.render(collapsingToolbarNode);
            }
            else {
                node.render(target ? node : parent);
            }
            node.nodeType = $enum$9.NODE_STANDARD.BLOCK;
            node.excludeResource |= $enum$9.NODE_RESOURCE.FONT_STYLE;
            return { output, complete: false };
        }
        processChild() {
            const node = this.node;
            if (node.imageElement && ($util$9.hasValue(node.dataset.navigationIcon) || $util$9.hasValue(node.dataset.collapseIcon))) {
                node.hide();
                return { output: '', complete: true, next: true };
            }
            return { output: '', complete: false };
        }
        beforeInsert() {
            const node = this.node;
            const menu = $util$9.optional($dom$6.locateExtension(node.element, WIDGET_NAME.MENU), 'dataset.layoutName');
            if (menu !== '') {
                const options = Object.assign({}, this.options[node.element.id]);
                const optionsToolbar = Object.assign({}, options.toolbar);
                $util$9.overwriteDefault(optionsToolbar, 'app', 'menu', `@menu/${menu}`);
                node.app('menu', optionsToolbar.app.menu);
            }
        }
        createResourceTheme(appBarOverlay, popupOverlay) {
            const options = Object.assign({}, this.options.resource);
            $util$9.overwriteDefault(options, '', 'appTheme', 'AppTheme');
            $util$9.overwriteDefault(options, '', 'parentTheme', 'Theme.AppCompat.Light.DarkActionBar');
            const data = {
                '0': [{
                        'appTheme': options.appTheme,
                        'parentTheme': options.parentTheme,
                        'appBarOverlay': appBarOverlay || 'ThemeOverlay.AppCompat.Dark.ActionBar',
                        'popupOverlay': popupOverlay || 'ThemeOverlay.AppCompat.Light',
                        '1': []
                    }]
            };
            $util$9.overwriteDefault(options, 'output', 'path', 'res/values');
            $util$9.overwriteDefault(options, 'output', 'file', `${WIDGET_NAME.TOOLBAR}.xml`);
            this.application.resourceHandler.addTheme(EXTENSION_APPBAR_TMPL, data, options);
        }
        createPlaceholder(nextId, node, children = []) {
            const placeholder = new View(nextId);
            placeholder.init();
            placeholder.api = node.api;
            for (const item of children) {
                item.parent = placeholder;
            }
            placeholder.inherit(node, 'dimensions');
            placeholder.auto = false;
            placeholder.excludeResource |= $enum$9.NODE_RESOURCE.ALL;
            return placeholder;
        }
    }

    const template$a = [
        '!0',
        '<?xml version="1.0" encoding="utf-8"?>',
        '<resources>',
        '	<style name="{@appTheme}" parent="{@parentTheme}">',
        '!1',
        '		<item name="{name}">{value}</item>',
        '!1',
        '	</style>',
        '</resources>',
        '!0'
    ];
    var EXTENSION_GENERIC_TMPL = template$a.join('\n');

    var $enum$a = androme.lib.enumeration;
    var $util$a = androme.lib.util;
    var $dom$7 = androme.lib.dom;
    class BottomNavigation extends androme.lib.base.Extension {
        constructor(name, framework = 0, tagNames, options) {
            super(name, framework, tagNames, options);
            this.require(WIDGET_NAME.MENU);
        }
        processNode() {
            const node = this.node;
            const parent = this.parent;
            const options = Object.assign({}, this.options[node.element.id]);
            $util$a.overwriteDefault(options, 'android', 'background', `?android:attr/windowBackground`);
            const output = this.application.viewController.renderNodeStatic(VIEW_SUPPORT.BOTTOM_NAVIGATION, node.depth, options, parent.is($enum$a.NODE_STANDARD.CONSTRAINT) ? '0px' : 'match_parent', 'wrap_content', node);
            for (let i = 5; i < node.children.length; i++) {
                node.children[i].hide();
                node.children[i].cascade().forEach(item => item.hide());
            }
            node.cascade().forEach(item => this.subscribersChild.add(item));
            node.render(parent);
            node.nodeType = $enum$a.NODE_STANDARD.BLOCK;
            node.excludeResource |= $enum$a.NODE_RESOURCE.ASSET;
            this.createResourceTheme();
            return { output, complete: true };
        }
        beforeInsert() {
            const node = this.node;
            const menu = $util$a.optional($dom$7.locateExtension(node.element, WIDGET_NAME.MENU), 'dataset.layoutName');
            if (menu !== '') {
                const options = Object.assign({}, this.options[node.element.id]);
                $util$a.overwriteDefault(options, 'app', 'menu', `@menu/${menu}`);
                node.app('menu', options.app.menu);
            }
        }
        afterInsert() {
            const node = this.node;
            if (!node.renderParent.has('width')) {
                node.renderParent.android('layout_width', 'match_parent');
            }
            if (!node.renderParent.has('height')) {
                node.renderParent.android('layout_height', 'match_parent');
            }
        }
        createResourceTheme() {
            const options = Object.assign({}, this.options.resource);
            $util$a.overwriteDefault(options, '', 'appTheme', 'AppTheme');
            $util$a.overwriteDefault(options, '', 'parentTheme', 'Theme.AppCompat.Light.DarkActionBar');
            const data = {
                '0': [{
                        'appTheme': options.appTheme,
                        'parentTheme': options.parentTheme,
                        '1': []
                    }]
            };
            $util$a.overwriteDefault(options, 'output', 'path', 'res/values');
            $util$a.overwriteDefault(options, 'output', 'file', `${WIDGET_NAME.BOTTOM_NAVIGATION}.xml`);
            this.application.resourceHandler.addTheme(EXTENSION_GENERIC_TMPL, data, options);
        }
    }

    const template$b = [
        '!0',
        '<?xml version="1.0" encoding="utf-8"?>',
        '<resources>',
        '	<style name="{@appTheme}" parent="{@parentTheme}">',
        '		<item name="android:windowDrawsSystemBarBackgrounds">true</item>',
        '		<item name="android:statusBarColor">@android:color/transparent</item>',
        '		<item name="android:windowTranslucentStatus">true</item>',
        '!1',
        '		<item name="{name}">{value}</item>',
        '!1',
        '	</style>',
        '</resources>',
        '!0'
    ];
    var EXTENSION_DRAWER_TMPL = template$b.join('\n');

    var $enum$b = androme.lib.enumeration;
    var $const$5 = androme.lib.constant;
    var $util$b = androme.lib.util;
    var $dom$8 = androme.lib.dom;
    class Drawer extends androme.lib.base.Extension {
        constructor(name, framework = 0, tagNames, options) {
            super(name, framework, tagNames, options);
            this.documentRoot = true;
            this.require($const$5.EXT_NAME.EXTERNAL, true);
            this.require(WIDGET_NAME.MENU);
            this.require(WIDGET_NAME.COORDINATOR);
        }
        init(element) {
            if (this.included(element) && element.children.length > 0) {
                Array
                    .from(element.children)
                    .forEach((item) => {
                    if (item.tagName === 'NAV' && !$util$b.includes(item.dataset.ext, $const$5.EXT_NAME.EXTERNAL)) {
                        item.dataset.ext = ($util$b.hasValue(item.dataset.ext) ? `${item.dataset.ext}, ` : '') + $const$5.EXT_NAME.EXTERNAL;
                    }
                });
                this.application.elements.add(element);
                return true;
            }
            return false;
        }
        processNode() {
            const node = this.node;
            const options = Object.assign({}, this.options.self);
            if ($dom$8.locateExtension(node.element, WIDGET_NAME.MENU)) {
                $util$b.overwriteDefault(options, 'android', 'fitsSystemWindows', 'true');
                this.createResourceTheme();
            }
            else {
                const optionsNavigationView = Object.assign({}, this.options.navigationView);
                $util$b.overwriteDefault(optionsNavigationView, 'android', 'layout_gravity', parseRTL('left', this.application.settings));
                const navView = node.children[node.children.length - 1];
                navView.android('layout_gravity', optionsNavigationView.android.layout_gravity);
                navView.android('layout_height', 'match_parent');
                navView.auto = false;
            }
            const output = this.application.viewController.renderNodeStatic(VIEW_SUPPORT.DRAWER, node.depth, options, 'match_parent', 'match_parent', node, true);
            node.documentRoot = true;
            node.rendered = true;
            node.nodeType = $enum$b.NODE_STANDARD.BLOCK;
            node.excludeResource |= $enum$b.NODE_RESOURCE.FONT_STYLE;
            return { output, complete: true };
        }
        beforeInsert() {
            const application = this.application;
            const node = this.node;
            if (application.renderQueue[node.nodeId]) {
                const target = application.cacheSession.locate(item => item.parent === node.parent && item.controlName === VIEW_SUPPORT.COORDINATOR);
                if (target) {
                    application.renderQueue[target.nodeId] = application.renderQueue[node.nodeId];
                    delete application.renderQueue[node.nodeId];
                }
            }
            const menu = $util$b.optional($dom$8.locateExtension(node.element, WIDGET_NAME.MENU), 'dataset.layoutName');
            const headerLayout = $util$b.optional($dom$8.locateExtension(node.element, $const$5.EXT_NAME.EXTERNAL), 'dataset.layoutName');
            const options = Object.assign({}, this.options.navigation);
            if (menu !== '') {
                $util$b.overwriteDefault(options, 'app', 'menu', `@menu/${menu}`);
            }
            if (headerLayout !== '') {
                $util$b.overwriteDefault(options, 'app', 'headerLayout', `@layout/${headerLayout}`);
            }
            if (menu !== '' || headerLayout !== '') {
                $util$b.overwriteDefault(options, 'android', 'id', `${node.stringId}_navigation`);
                $util$b.overwriteDefault(options, 'android', 'fitsSystemWindows', 'true');
                $util$b.overwriteDefault(options, 'android', 'layout_gravity', parseRTL('left', this.application.settings));
                const output = application.viewController.renderNodeStatic(VIEW_SUPPORT.NAVIGATION_VIEW, node.depth + 1, options, 'wrap_content', 'match_parent');
                application.addRenderQueue(node.id.toString(), [output]);
            }
        }
        afterInsert() {
            const headerLayout = $dom$8.locateExtension(this.node.element, $const$5.EXT_NAME.EXTERNAL);
            if (headerLayout) {
                const node = $dom$8.getNodeFromElement(headerLayout);
                if (node && !node.hasHeight) {
                    node.android('layout_height', 'wrap_content');
                }
            }
        }
        createResourceTheme() {
            const options = Object.assign({}, this.options.resource);
            $util$b.overwriteDefault(options, '', 'appTheme', 'AppTheme');
            $util$b.overwriteDefault(options, '', 'parentTheme', 'Theme.AppCompat.Light.NoActionBar');
            const data = {
                '0': [{
                        'appTheme': options.appTheme,
                        'parentTheme': options.parentTheme,
                        '1': []
                    }]
            };
            $util$b.overwriteDefault(options, 'output', 'path', 'res/values-v21');
            $util$b.overwriteDefault(options, 'output', 'file', `${WIDGET_NAME.DRAWER}.xml`);
            this.application.resourceHandler.addTheme(EXTENSION_DRAWER_TMPL, data, options);
        }
    }

    function autoClose() {
        const main = viewController.application;
        if (main.settings.autoCloseOnWrite && !main.loading && !main.closed) {
            main.finalize();
            return true;
        }
        return false;
    }
    const APP_FRAMEWORK = androme.lib.enumeration.APP_FRAMEWORK;
    let initialized = false;
    let application;
    let viewController;
    let fileHandler;
    let resourceHandler;
    let settings$1;
    let builtInExtensions;
    const appBase = {
        create() {
            const EXT_NAME = androme.lib.constant.EXT_NAME;
            settings$1 = Object.assign({}, settings);
            application = new androme.lib.base.Application(APP_FRAMEWORK.ANDROID);
            viewController = new ViewController();
            fileHandler = new FileHandler(settings$1);
            resourceHandler = new ResourceHandler(fileHandler);
            builtInExtensions = {
                [EXT_NAME.EXTERNAL]: new ExternalAndroid(EXT_NAME.EXTERNAL, APP_FRAMEWORK.ANDROID),
                [EXT_NAME.ORIGIN]: new OriginAndroid(EXT_NAME.ORIGIN, APP_FRAMEWORK.ANDROID),
                [EXT_NAME.CUSTOM]: new CustomAndroid(EXT_NAME.CUSTOM, APP_FRAMEWORK.ANDROID),
                [EXT_NAME.ACCESSIBILITY]: new AccessibilityAndroid(EXT_NAME.ACCESSIBILITY, APP_FRAMEWORK.ANDROID),
                [EXT_NAME.LIST]: new ListAndroid(EXT_NAME.LIST, APP_FRAMEWORK.ANDROID, ['UL', 'OL', 'DL', 'DIV']),
                [EXT_NAME.TABLE]: new TableAndroid(EXT_NAME.TABLE, APP_FRAMEWORK.ANDROID, ['TABLE']),
                [EXT_NAME.GRID]: new GridAndroid(EXT_NAME.GRID, APP_FRAMEWORK.ANDROID, ['FORM', 'UL', 'OL', 'DL', 'DIV', 'TABLE', 'NAV', 'SECTION', 'ASIDE', 'MAIN', 'HEADER', 'FOOTER', 'P', 'ARTICLE', 'FIELDSET', 'SPAN']),
                [WIDGET_NAME.FAB]: new FloatingActionButton(WIDGET_NAME.FAB, APP_FRAMEWORK.ANDROID, ['BUTTON', 'INPUT', 'IMG']),
                [WIDGET_NAME.MENU]: new Menu(WIDGET_NAME.MENU, APP_FRAMEWORK.ANDROID, ['NAV']),
                [WIDGET_NAME.COORDINATOR]: new Coordinator(WIDGET_NAME.COORDINATOR, APP_FRAMEWORK.ANDROID),
                [WIDGET_NAME.TOOLBAR]: new Toolbar(WIDGET_NAME.TOOLBAR, APP_FRAMEWORK.ANDROID),
                [WIDGET_NAME.BOTTOM_NAVIGATION]: new BottomNavigation(WIDGET_NAME.BOTTOM_NAVIGATION, APP_FRAMEWORK.ANDROID),
                [WIDGET_NAME.DRAWER]: new Drawer(WIDGET_NAME.DRAWER, APP_FRAMEWORK.ANDROID)
            };
            initialized = true;
            return {
                framework: APP_FRAMEWORK.ANDROID,
                application,
                viewController,
                resourceHandler,
                nodeObject: View,
                builtInExtensions,
                settings: settings$1
            };
        },
        cached() {
            if (initialized) {
                return {
                    framework: APP_FRAMEWORK.ANDROID,
                    application,
                    viewController,
                    resourceHandler,
                    nodeObject: View,
                    builtInExtensions,
                    settings: settings$1
                };
            }
            return appBase.create();
        },
        system: {
            customize(build, widget, options) {
                if (API_ANDROID[build]) {
                    const customizations = API_ANDROID[build].customizations;
                    if (customizations[widget] == null) {
                        customizations[widget] = {};
                    }
                    Object.assign(customizations[widget], options);
                }
            },
            addXmlNs(name, uri) {
                XMLNS_ANDROID[name] = uri;
            },
            writeLayoutAllXml(saveToDisk = false) {
                if (initialized) {
                    const main = viewController.application;
                    if (main.closed || autoClose()) {
                        return resourceHandler.file.layoutAllToXml(main.viewData, saveToDisk);
                    }
                }
                return '';
            },
            writeResourceAllXml(saveToDisk = false) {
                if (initialized) {
                    const main = viewController.application;
                    if (main.closed || autoClose()) {
                        return resourceHandler.file.resourceAllToXml(saveToDisk);
                    }
                }
                return '';
            },
            writeResourceStringXml(saveToDisk = false) {
                if (initialized) {
                    const main = viewController.application;
                    if (main.closed || autoClose()) {
                        return resourceHandler.file.resourceStringToXml(saveToDisk);
                    }
                }
                return '';
            },
            writeResourceArrayXml(saveToDisk = false) {
                if (initialized) {
                    const main = viewController.application;
                    if (main.closed || autoClose()) {
                        return resourceHandler.file.resourceStringArrayToXml(saveToDisk);
                    }
                }
                return '';
            },
            writeResourceFontXml(saveToDisk = false) {
                if (initialized) {
                    const main = viewController.application;
                    if (main.closed || autoClose()) {
                        return resourceHandler.file.resourceFontToXml(saveToDisk);
                    }
                }
                return '';
            },
            writeResourceColorXml(saveToDisk = false) {
                if (initialized) {
                    const main = viewController.application;
                    if (main.closed || autoClose()) {
                        return resourceHandler.file.resourceColorToXml(saveToDisk);
                    }
                }
                return '';
            },
            writeResourceStyleXml(saveToDisk = false) {
                if (initialized) {
                    const main = viewController.application;
                    if (main.closed || autoClose()) {
                        return resourceHandler.file.resourceStyleToXml(saveToDisk);
                    }
                }
                return '';
            },
            writeResourceDimenXml(saveToDisk = false) {
                if (initialized) {
                    const main = viewController.application;
                    if (main.closed || autoClose()) {
                        return resourceHandler.file.resourceDimenToXml(saveToDisk);
                    }
                }
                return '';
            },
            writeResourceDrawableXml(saveToDisk = false) {
                if (initialized) {
                    const main = viewController.application;
                    if (main.closed || autoClose()) {
                        return resourceHandler.file.resourceDrawableToXml(saveToDisk);
                    }
                }
                return '';
            }
        }
    };

    return appBase;

}());
