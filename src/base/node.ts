import { BoxStyle, InitialData } from '../types/lib.base.types.node';

import { ELEMENT_BLOCK, ELEMENT_INLINE, REGEX_PATTERN } from '../lib/constant';
import { APP_SECTION, BOX_STANDARD, CSS_STANDARD, NODE_ALIGNMENT, NODE_CONTAINER, NODE_PROCEDURE, NODE_RESOURCE } from '../lib/enumeration';

import Container from './container';
import Extension from './extension';

import { assignBounds, getElementCache, getElementAsNode, getRangeClientRect, hasFreeFormText, hasLineBreak, isPlainText, isStyleElement, newClientRect, setElementCache, deleteElementCache } from '../lib/dom';
import { assignWhenNull, convertCamelCase, convertInt, convertPX, hasBit, hasValue, isPercent, isUnit, searchObject, trimNull } from '../lib/util';

type T = Node;

interface CachedValue {
    pageflow?: boolean;
    siblingflow?: boolean;
    inlineflow?: boolean;
    baseline?: boolean;
    multiLine?: boolean;
    inlineText?: boolean;
    supSubscript?: boolean;
    positionStatic?: boolean;
    alignOrigin?: boolean;
    inline?: boolean;
    inlineStatic?: boolean;
    inlineVertical?: boolean;
    block?: boolean;
    blockStatic?: boolean;
    floating?: boolean;
    autoMargin?: boolean;
    autoMarginLeft?: boolean;
    autoMarginRight?: boolean;
    autoMarginHorizontal?: boolean;
    autoMarginVertical?: boolean;
    rightAligned?: boolean;
    bottomAligned?: boolean;
    preserveWhiteSpace?: boolean;
    overflow?: number;
    lineHeight?: number;
    dir?: string;
    tagName?: string;
    textContent?: string;
    float?: string;
    flexbox?: Flexbox;
    boxStyle?: BoxStyle;
}

const BOX_MARGIN = ['marginTop', 'marginRight', 'marginBottom', 'marginLeft'];
const BOX_PADDING = ['paddingTop', 'paddingRight', 'paddingBottom', 'paddingLeft'];

export default abstract class Node extends Container<T> implements androme.lib.base.Node {
    public static getContentBoxWidth<T extends Node>(node: T) {
        return node.tableElement && node.css('borderCollapse') === 'collapse' ? 0 : node.borderLeftWidth + node.paddingLeft + node.paddingRight + node.borderRightWidth;
    }

    public static getContentBoxHeight<T extends Node>(node: T) {
        return node.tableElement && node.css('borderCollapse') === 'collapse' ? 0 : node.borderTopWidth + node.paddingTop + node.paddingBottom + node.borderBottomWidth;
    }

    public static getElementAsNode<T extends Node>(element: UndefNull<Element>) {
        return getElementAsNode<T>(element);
    }

    public abstract readonly localSettings: EnvironmentSettings;
    public abstract readonly renderChildren: T[];
    public style: CSSStyleDeclaration;
    public styleMap: StringMap = {};
    public containerType = 0;
    public alignmentType = 0;
    public depth = -1;
    public siblingIndex = Number.MAX_VALUE;
    public renderIndex = Number.MAX_VALUE;
    public renderPosition = -1;
    public documentRoot = false;
    public positioned = false;
    public visible = true;
    public excluded = false;
    public rendered = false;
    public renderExtension = new Set<Extension<T>>();
    public controlId = '';
    public companion: T | undefined;
    public readonly initial: InitialData<T>;

    protected abstract _namespaces: Set<string>;
    protected abstract _controlName: string;
    protected abstract _renderParent: T;
    protected abstract _documentParent: T;
    protected abstract readonly _boxAdjustment: BoxModel;
    protected abstract readonly _boxReset: BoxModel;
    protected _cached: CachedValue = {};
    protected _box: BoxDimensions;
    protected _bounds: BoxDimensions;
    protected _linear: BoxDimensions;

    private _element: Element;
    private _parent: T;
    private _renderAs: T;
    private _renderDepth: number;
    private _data = {};
    private _excludeSection = 0;
    private _excludeProcedure = 0;
    private _excludeResource = 0;
    private _initialized = false;

    protected constructor(
        public readonly id: number,
        element?: Element)
    {
        super();
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

    public abstract setControlType(viewName: string, containerType?: number): void;
    public abstract setLayout(width?: number, height?: number): void;
    public abstract setAlignment(): void;
    public abstract applyOptimizations(): void;
    public abstract applyCustomizations(): void;
    public abstract modifyBox(region: number | string, offset: number | null, negative?: boolean): void;
    public abstract valueBox(region: number): [number, number];
    public abstract localizeString(value: string): string;
    public abstract clone(id?: number, children?: boolean): T;
    public abstract set controlName(value: string);
    public abstract get controlName();
    public abstract set documentParent(value: T);
    public abstract get documentParent(): T;
    public abstract set renderParent(value: T);
    public abstract get renderParent(): T;
    public abstract get linearHorizontal(): boolean;
    public abstract get linearVertical(): boolean;
    public abstract get layoutHorizontal(): boolean;
    public abstract get layoutVertical(): boolean;
    public abstract get inlineWidth(): boolean;
    public abstract get inlineHeight(): boolean;
    public abstract get blockWidth(): boolean;
    public abstract get blockHeight(): boolean;
    public abstract get dpi(): number;
    public abstract get fontSize(): number;

    public init() {
        if (!this._initialized) {
            if (this.styleElement) {
                const element = <HTMLElement> this._element;
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

    public is(...containers: number[]) {
        return containers.some(value => this.containerType === value);
    }

    public of(containerType: number, ...alignmentType: number[]) {
        return this.containerType === containerType && alignmentType.some(value => this.hasAlign(value));
    }

    public unsafe(obj: string): any {
        const name = `_${obj}`;
        return this[name] || undefined;
    }

    public attr(obj: string, attr: string, value = '', overwrite = true): string {
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

    public namespace(obj: string): StringMap {
        const name = `__${obj}`;
        return this[name] || {};
    }

    public delete(obj: string, ...attrs: string[]) {
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

    public apply(options: {}) {
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

    public each(predicate: IteratorPredicate<T, void>, rendered = false) {
        (rendered ? this.renderChildren : this.children).forEach(predicate);
        return this;
    }

    public render(parent: T) {
        this.renderParent = parent;
        this.renderDepth = this.documentRoot || this === parent || hasValue(parent.dataset.target) ? 0 : parent.renderDepth + 1;
        this.rendered = true;
    }

    public hide() {
        this.rendered = true;
        this.visible = false;
    }

    public data(obj: string, attr: string, value?: any, overwrite = true) {
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
        return this._data[obj] === undefined || this._data[obj][attr] === undefined ? undefined : this._data[obj][attr];
    }

    public unsetCache(attr?: string) {
        if (attr) {
            this._cached[attr] = undefined;
        }
        else {
            this._cached = {};
        }
    }

    public ascend(generated = false, levels = -1) {
        const result: T[] = [];
        const attr = generated ? 'parent' : 'documentParent';
        let current: T = this[attr];
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

    public cascade() {
        function cascade(node: T) {
            const current = [...node.children];
            node.each(item => current.push(...cascade(item)));
            return current;
        }
        return cascade(this);
    }

    public inherit(node: T, ...props: string[]) {
        if (this._initialized) {
            for (const type of props) {
                switch (type) {
                    case 'initial':
                        Object.assign(this.initial, node.initial);
                        break;
                    case 'base':
                        this.style = node.style;
                        this.documentParent = node.documentParent;
                        if (this.tagName === '') {
                            this.tagName = node.tagName;
                        }
                    case 'dimensions':
                        this._bounds = assignBounds(node.bounds);
                        this._linear = assignBounds(node.linear);
                        this._box = assignBounds(node.box);
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
                        assignWhenNull(node.styleMap, this.styleMap);
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
                }
            }
        }
    }

    public alignedVertically(previous: T | null, cleared?: Map<T, string>, floatSize = 2, firstNode = false) {
        if (previous) {
            return (
                this.lineBreak ||
                (previous.lineBreak && !this.floating) ||
                previous.blockStatic ||
                (previous.float === 'left' && this.autoMarginRight) ||
                (previous.float === 'right' && this.autoMarginLeft) ||
                (previous.plainText && previous.multiLine && (this.parent && !this.parent.layoutRelative)) ||
                (previous.bounds && previous.bounds.width > (this.documentParent.has('width', CSS_STANDARD.UNIT) ? this.documentParent.toInt('width') : this.documentParent.box.width) && (
                    !previous.textElement ||
                    previous.css('whiteSpace') === 'nowrap'
                )) ||
                (!previous.floating && (
                    (!this.inlineflow && !this.floating) ||
                    this.blockStatic
                )) ||
                (this.blockStatic && (
                    !previous.inlineflow ||
                    (cleared && cleared.has(previous) && previous.floating)
                )) ||
                (!firstNode && previous && previous.linear && (
                    (cleared && cleared.has(this)) ||
                    (this.linear.top >= previous.linear.bottom && this.floating && previous.floating && floatSize === 2)
                ))
            );
        }
        return false;
    }

    public intersectX(rect: BoxDimensions, dimension = 'linear') {
        const bounds: BoxDimensions = this[dimension] || this.linear;
        return (
            (rect.top >= bounds.top && rect.top < bounds.bottom) ||
            (rect.bottom > bounds.top && rect.bottom <= bounds.bottom) ||
            (bounds.top >= rect.top && this[dimension].bottom <= rect.bottom) ||
            (rect.top >= bounds.top && rect.bottom <= bounds.bottom)
        );
    }

    public intersectY(rect: BoxDimensions, dimension = 'linear') {
        const bounds: BoxDimensions = this[dimension] || this.linear;
        return (
            (rect.left >= bounds.left && rect.left < bounds.right) ||
            (rect.right > bounds.left && rect.right <= bounds.right) ||
            (bounds.left >= rect.left && bounds.right <= rect.right) ||
            (rect.left >= bounds.left && rect.right <= bounds.right)
        );
    }

    public withinX(rect: BoxDimensions, dimension = 'linear') {
        const bounds: BoxDimensions = this[dimension] || this.linear;
        return bounds.top >= rect.top && bounds.bottom <= rect.bottom;
    }

    public withinY(rect: BoxDimensions, dimension = 'linear') {
        const bounds: BoxDimensions = this[dimension] || this.linear;
        return bounds.left >= rect.left && bounds.right <= rect.right;
    }

    public inside(rect: BoxDimensions, dimension = 'linear') {
        const bounds: BoxDimensions = this[dimension] || this.linear;
        const top = rect.top > bounds.top && rect.top < bounds.bottom;
        const right = Math.floor(rect.right) > Math.ceil(bounds.left) && rect.right < bounds.right;
        const bottom = Math.floor(rect.bottom) > Math.ceil(bounds.top) && rect.bottom < bounds.bottom;
        const left = rect.left > bounds.left && rect.left < bounds.right;
        return (top && (left || right)) || (bottom && (left || right));
    }

    public outsideX(rect: BoxDimensions, dimension = 'linear') {
        const bounds: BoxDimensions = this[dimension] || this.linear;
        return bounds.bottom < rect.top || bounds.top > rect.bottom;
    }

    public outsideY(rect: BoxDimensions, dimension = 'linear') {
        const bounds: BoxDimensions = this[dimension] || this.linear;
        return bounds.right < rect.left || bounds.left > rect.right;
    }

    public css(attr: object | string, value = ''): string {
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

    public cssInitial(attr: string, complete = false) {
        return this.initial.styleMap[attr] || (complete ? this.css(attr) : '');
    }

    public cssParent(attr: string, startChild = false, ignoreHidden = false) {
        let result = '';
        if (this.element) {
            let current = startChild ? this : this.actualParent;
            while (current) {
                result = current.initial.styleMap[attr] || '';
                if (result || current.documentBody) {
                    if (ignoreHidden && !current.visible) {
                        result = '';
                    }
                    break;
                }
                current = current.actualParent;
            }
        }
        return result;
    }

    public cssTry(attr: string, value: string) {
        if (this.styleElement) {
            const element = <HTMLElement> this.element;
            const current = this.cssInitial(attr, true);
            element.style.display = value;
            if (element.style.display === value) {
                setElementCache(element, attr, current);
                return true;
            }
        }
        return false;
    }

    public cssFinally(attr: string) {
        if (this.styleElement) {
            const element = <HTMLElement> this.element;
            const value: string = getElementCache(element, attr);
            if (value) {
                element.style[attr] = value;
                deleteElementCache(element, attr);
                return true;
            }
        }
        return false;
    }

    public toInt(attr: string, initial = false, defaultValue = 0) {
        const value = (initial ? this.initial.styleMap : this.styleMap)[attr];
        return parseInt(value) || defaultValue;
    }

    public convertPX(value: string) {
        return convertPX(value, this.dpi, this.fontSize);
    }

    public convertPercent(value: string, horizontal: boolean, parent = false) {
        if (isPercent(value)) {
            const node = parent ? this.documentParent : this;
            const attr = horizontal ? 'width' : 'height';
            let dimension: number;
            if (node.has(attr, CSS_STANDARD.UNIT)) {
                dimension = node.toInt(attr);
            }
            else {
                dimension = node[parent ? 'box' : 'bounds'][attr];
            }
            const percent = parseFloat(value) >= 1 ? parseInt(value) / 100 : parseFloat(value);
            return `${Math.round(percent * dimension)}px`;
        }
        return '0px';
    }

    public has(attr: string, checkType: number = 0, options?: ObjectMap<string | string[]>) {
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

    public hasBit(attr: string, value: number) {
        if (this[attr] !== undefined) {
            return hasBit(this[attr], value);
        }
        return false;
    }

    public hasAlign(value: number) {
        return hasBit(this.alignmentType, value);
    }

    public exclude({ section = 0, procedure = 0, resource = 0 }) {
        if (section) {
            this._excludeSection |= section;
        }
        if (procedure) {
            this._excludeProcedure |= procedure;
        }
        if (resource) {
            this._excludeResource |= resource;
        }
    }

    public setExclusions() {
        if (this.styleElement) {
            const applyExclusions = (attr: string, enumeration: {}) => {
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

    public setBounds(calibrate = false) {
        if (this._element && !calibrate) {
            if (this.styleElement) {
                this._bounds = assignBounds(this._element.getBoundingClientRect());
            }
            else if (this.plainText) {
                const [bounds, multiLine] = getRangeClientRect(this._element);
                this._bounds = bounds;
                this._cached.multiLine = multiLine;
            }
            Object.assign(this.initial.bounds, this._bounds);
        }
        if (this._bounds) {
            this._linear = {
                top: this.bounds.top - (this.marginTop > 0 ? this.marginTop : 0),
                right: this.bounds.right + this.marginRight,
                bottom: this.bounds.bottom + this.marginBottom,
                left: this.bounds.left - (this.marginLeft > 0 ? this.marginLeft : 0),
                width: 0,
                height: 0
            };
            this.setDimensions('linear');
            this._box = {
                top: this.bounds.top + (this.paddingTop + this.borderTopWidth),
                right: this.bounds.right - (this.paddingRight + this.borderRightWidth),
                bottom: this.bounds.bottom - (this.paddingBottom + this.borderBottomWidth),
                left: this.bounds.left + (this.paddingLeft + this.borderLeftWidth),
                width: 0,
                height: 0
            };
            this.setDimensions('box');
        }
    }

    public replaceNode(node: T, withNode: T, append = true) {
        for (let i = 0; i < this.length; i++) {
            if (node === this.item(i)) {
                withNode.siblingIndex = node.siblingIndex;
                this.item(i, withNode);
                withNode.parent = this;
                return true;
            }
        }
        if (append) {
            let currentIndex = -1;
            this.each(item => {
                if (item.siblingIndex !== Number.MAX_VALUE) {
                    currentIndex = Math.max(item.siblingIndex, currentIndex);
                }
            });
            withNode.siblingIndex = currentIndex + 1;
            withNode.parent = this;
            return true;
        }
        return false;
    }

    public renderChild(node: T) {
        if (this.renderChildren.indexOf(node) === -1) {
            this.renderChildren.push(node);
        }
    }

    public resetBox(region: number, node?: T, fromParent = false) {
        [BOX_MARGIN, BOX_PADDING].forEach((item, index) => {
            if ((index === 0 && hasBit(region, BOX_STANDARD.MARGIN)) || (index === 1 && hasBit(region, BOX_STANDARD.PADDING))) {
                for (let i = 0; i < item.length; i++) {
                    const attr = item[i];
                    this._boxReset[attr] = 1;
                    if (node) {
                        node.modifyBox(fromParent ? BOX_MARGIN[i] : BOX_PADDING[i], this[index === 0 ? BOX_MARGIN[i] : BOX_PADDING[i]]);
                    }
                }
            }
        });
    }

    public inheritBox(region: number, node: T) {
        [BOX_MARGIN, BOX_PADDING].forEach((item, index) => {
            if ((index === 0 && hasBit(region, BOX_STANDARD.MARGIN)) || (index === 1 && hasBit(region, BOX_STANDARD.PADDING))) {
                for (let i = 0; i < item.length; i++) {
                    const attr = item[i];
                    const value = this._boxAdjustment[attr];
                    if (value > 0) {
                        node.modifyBox(attr, this._boxAdjustment[attr], false);
                        this._boxAdjustment[attr] = 0;
                    }
                }
            }
        });
    }

    public getParentElementAsNode(negative = false) {
        if (this._element) {
            let parent = this.actualParent;
            if (!this.pageflow) {
                let found = false;
                let previous: T | null = null;
                let relativeParent: T | null = null;
                let outside = false;
                while (parent && parent.id !== 0) {
                    if (relativeParent === null && this.position === 'absolute') {
                        if (!parent.positionStatic) {
                            if (parent.css('overflow') === 'hidden') {
                                return parent;
                            }
                            else {
                                const top = this.top || 0;
                                const left = this.left || 0;
                                if ((top >= 0 && left >= 0) || !negative || (negative && (Math.abs(top) <= parent.marginTop || Math.abs(left) <= parent.marginLeft)) || this.imageElement) {
                                    if (negative &&
                                        !parent.documentRoot &&
                                        top !== 0 &&
                                        left !== 0 &&
                                        this.bottom === null &&
                                        this.right === null &&
                                        (this.outsideX(parent.linear) || this.outsideX(parent.linear)))
                                    {
                                        outside = true;
                                    }
                                    else {
                                        found = true;
                                        break;
                                    }
                                }
                            }
                            relativeParent = parent;
                        }
                    }
                    else {
                        if ((this.withinX(parent.box) && this.withinY(parent.box)) ||
                            (previous && (
                                (this.linear.top >= parent.linear.top && this.linear.top < previous.linear.top) ||
                                (this.linear.right <= parent.linear.right && this.linear.right > previous.linear.right) ||
                                (this.linear.bottom <= parent.linear.bottom && this.linear.bottom > previous.linear.bottom) ||
                                (this.linear.left >= parent.linear.left && this.linear.left < previous.linear.left)
                           )))
                        {
                            found = true;
                            break;
                        }
                    }
                    previous = parent;
                    parent = parent.actualParent;
                }
                if (!found && !outside && relativeParent) {
                    parent = relativeParent;
                }
            }
            return parent;
        }
        return null;
    }

    public previousSibling(pageflow = false, lineBreak = true, excluded = true) {
        let element: Element | null = null;
        if (this._element) {
            element = <Element> this._element.previousSibling;
        }
        else if (this.initial.children.length) {
            const list = this.initial.children.filter(node => pageflow ? node.pageflow : node.siblingflow);
            element = list.length ? <Element> list[0].element.previousSibling : null;
        }
        while (element) {
            const node = Node.getElementAsNode(element);
            if (node && !(node.lineBreak && !lineBreak) && !(node.excluded && !excluded) && ((pageflow && node.pageflow) || (!pageflow && node.siblingflow))) {
                return node;
            }
            element = <Element> element.previousSibling;
        }
        return null;
    }

    public nextSibling(pageflow = false, lineBreak = true, excluded = true) {
        let element: Element | null = null;
        if (this._element) {
            element = <Element> this._element.nextSibling;
        }
        else if (this.initial.children.length) {
            const list = this.initial.children.filter(node => pageflow ? node.pageflow : node.siblingflow);
            element = list.length ? <Element> list[0].element.nextSibling : null;
        }
        while (element) {
            const node = Node.getElementAsNode(element);
            if (node && !(node.lineBreak && !lineBreak) && !(node.excluded && !excluded) && (pageflow && node.pageflow || !pageflow && node.siblingflow)) {
                return node;
            }
            element = <Element> element.nextSibling;
        }
        return null;
    }

    public actualLeft(dimension = 'linear') {
        return this.companion && !this.companion.visible && this.companion[dimension] ? Math.min(this[dimension].left, this.companion[dimension].left) : this[dimension].left;
    }

    public actualRight(dimension = 'linear') {
        return this.companion && !this.companion.visible && this.companion[dimension] ? Math.max(this[dimension].right, this.companion[dimension].right) : this[dimension].right;
    }

    protected setDimensions(dimension: string) {
        const bounds = this[dimension];
        bounds.width = this.bounds.width;
        bounds.height = bounds.bottom - bounds.top;
        if (this.styleElement) {
            switch (dimension) {
                case 'linear':
                    bounds.width += (this.marginLeft > 0 ? this.marginLeft : 0) + this.marginRight;
                    break;
                case 'box':
                    bounds.width -= Node.getContentBoxWidth(this);
                    break;
            }
        }
        if (this.initial[dimension] === undefined) {
            this.initial[dimension] = assignBounds(bounds);
        }
    }

    private convertBox(region: string, direction: string) {
        const attr = region + direction;
        const value = this.css(attr);
        if (isPercent(value)) {
            return this.style[attr] && this.style[attr] !== value ? convertInt(this.style[attr]) : this.documentParent.box[direction === 'Left' || direction === 'Right' ? 'width' : 'height'] * convertInt(value) / 100;
        }
        return convertInt(value);
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
                if (this.groupElement && value.siblingIndex !== Number.MAX_VALUE) {
                    this.siblingIndex = Math.min(this.siblingIndex, value.siblingIndex);
                }
            }
            if (this.initial.depth === -1) {
                Object.assign(this.initial, { depth: value.depth + 1 });
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

    set tagName(value) {
        this._cached.tagName = value.toUpperCase();
    }
    get tagName() {
        if (this._cached.tagName === undefined) {
            this._cached.tagName = '';
            const element = this._element;
            if (element) {
                if (this.styleElement) {
                    this._cached.tagName = (element.tagName === 'INPUT' ? (<HTMLInputElement> element).type : element.tagName).toUpperCase();
                }
                else if (element.nodeName === '#text') {
                    this._cached.tagName = 'PLAINTEXT';
                }
            }
        }
        return this._cached.tagName;
    }

    set element(value) {
        this._element = value;
    }
    get element() {
        return this._element || { __node: this, __style: this.style, __styleMap: this.styleMap, style: {}, tagName: this.tagName, dataset: {} };
    }

    get htmlElement() {
        return this._element instanceof HTMLElement;
    }

    get svgElement() {
        return this._element instanceof SVGSVGElement;
    }

    get styleElement() {
        return this.htmlElement || this.svgElement;
    }

    get domElement() {
        return this.styleElement || this.plainText;
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

    get groupElement() {
        return !this.domElement && this.length > 0;
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

    get box() {
        return this._box || newClientRect();
    }

    get bounds() {
        return this._bounds || newClientRect();
    }

    get linear() {
        return this._linear || newClientRect();
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
        if (this._renderDepth === undefined) {
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

    get dataset(): DOMStringMap {
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

    get extension() {
        return this.dataset.ext ? this.dataset.ext.split(',')[0].trim() : '';
    }

    get flexbox(): Flexbox {
        if (this._cached.flexbox === undefined) {
            this._cached.flexbox = {
                order: convertInt(this.css('order')),
                wrap: this.css('flexWrap'),
                direction: this.css('flexDirection'),
                alignSelf: !this.has('alignSelf') && this.documentParent.has('alignItems') ? this.documentParent.css('alignItems') : this.css('alignSelf'),
                justifyContent: this.css('justifyContent'),
                basis: this.css('flexBasis'),
                grow: convertInt(this.css('flexGrow')),
                shrink: convertInt(this.css('flexShrink'))
            };
        }
        return this._cached.flexbox;
    }

    get viewWidth() {
        return this.inlineStatic || this.has('width', CSS_STANDARD.PERCENT) ? 0 : (this.toInt('width') || this.toInt('minWidth'));
    }
    get viewHeight() {
        return this.inlineStatic || this.has('height', CSS_STANDARD.PERCENT) ? 0 : (this.toInt('height') || this.toInt('minHeight'));
    }

    get hasWidth() {
        return this.inlineStatic ? false : this.has('width', CSS_STANDARD.UNIT | CSS_STANDARD.PERCENT, { map: 'initial', not: ['0px', '0%'] }) || this.toInt('minWidth') > 0;
    }
    get hasHeight() {
        return this.inlineStatic ? false : this.has('height', CSS_STANDARD.UNIT | CSS_STANDARD.PERCENT, { map: 'initial', not: ['0px', '0%'] }) || this.toInt('minHeight') > 0;
    }

    get lineHeight() {
        if (this._cached.lineHeight === undefined) {
            this._cached.lineHeight = this.toInt('lineHeight');
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
            const position = this.position;
            this._cached.positionStatic = position === 'static' || position === 'initial' || position === 'unset';
        }
        return this._cached.positionStatic;
    }

    get positionRelative() {
        return this.position === 'relative';
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
        return this.inlineStatic ? 0 : this.convertBox('margin', 'Top');
    }
    get marginRight() {
        return this.convertBox('margin', 'Right');
    }
    get marginBottom() {
        return this.inlineStatic ? 0 : this.convertBox('margin', 'Bottom');
    }
    get marginLeft() {
        return this.convertBox('margin', 'Left');
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
        return this.convertBox('padding', 'Top');
    }
    get paddingRight() {
        return this.convertBox('padding', 'Right');
    }
    get paddingBottom() {
        return this.convertBox('padding', 'Bottom');
    }
    get paddingLeft() {
        return this.convertBox('padding', 'Left');
    }

    get pageflow() {
        if (this._cached.pageflow === undefined) {
            let value = this.positionStatic || this.positionRelative || this.alignOrigin;
            if (this.parent) {
                if (!value && this.parent.length === 1 && this.toInt('top') === 0 && this.toInt('right') === 0 && this.toInt('bottom') === 0 && this.toInt('left') === 0) {
                    value = true;
                }
                this._cached.pageflow = value;
            }
            return value;
        }
        return this._cached.pageflow;
    }

    get siblingflow() {
        if (this._cached.siblingflow === undefined) {
            const value = this.position;
            this._cached.siblingflow = !(value === 'absolute' || value === 'fixed');
        }
        return this._cached.siblingflow;
    }

    get inlineflow() {
        if (this._cached.inlineflow === undefined) {
            const display = this.display;
            this._cached.inlineflow = this.inline || display.startsWith('inline') || display === 'table-cell' || this.imageElement || this.floating || (!this.siblingflow && this.alignOrigin);
        }
        return this._cached.inlineflow;
    }

    get inline() {
        if (this._cached.inline === undefined) {
            const value = this.display;
            this._cached.inline = value === 'inline' || ((value === 'initial' || value === 'unset') && ELEMENT_INLINE.includes(this.tagName));
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
            this._cached.inlineVertical = (this.inline || this.display === 'inline-block') && !this.floating && !this.plainText;
        }
        return this._cached.inlineVertical;
    }

    get inlineText() {
        if (this._cached.inlineText === undefined) {
            switch (this.tagName) {
                case 'INPUT':
                case 'BUTTON':
                case 'IMG':
                case 'SELECT':
                case 'TEXTAREA':
                    this._cached.inlineText = false;
                    break;
                default:
                    this._cached.inlineText = (
                        this.htmlElement &&
                        hasFreeFormText(this._element) &&
                        (this.initial.children.length === 0 || this.initial.children.every(node => !!getElementCache(node.element, 'inlineSupport'))) &&
                        (this._element.childNodes.length === 0 || !Array.from(this._element.childNodes).some((element: Element) => {
                            const node = Node.getElementAsNode(element);
                            return !!node && !node.lineBreak && (!node.excluded || !node.visible);
                        }))
                    );
                    break;
            }
        }
        return this._cached.inlineText;
    }

    get block() {
        if (this._cached.block === undefined) {
            const value = this.display;
            this._cached.block = value === 'block' || value === 'list-item' || (value === 'initial' && ELEMENT_BLOCK.includes(this.tagName));
        }
        return this._cached.block;
    }

    get blockStatic() {
        if (this._cached.blockStatic === undefined) {
            this._cached.blockStatic = this.block && this.siblingflow && (!this.floating || this.cssInitial('width') === '100%');
        }
        return this._cached.blockStatic;
    }

    get alignOrigin() {
        if (this._cached.alignOrigin === undefined) {
            this._cached.alignOrigin = this.top === null && this.right === null && this.bottom === null && this.left === null;
        }
        return this._cached.alignOrigin;
    }

    get rightAligned() {
        if (this._cached.rightAligned === undefined) {
            this._cached.rightAligned = this.float === 'right' || this.autoMarginLeft || this.css('textAlign') === 'right' || (!this.siblingflow && this.right !== null && this.right >= 0);
        }
        return this._cached.rightAligned || this.hasAlign(NODE_ALIGNMENT.RIGHT);
    }

    get bottomAligned() {
        if (this._cached.bottomAligned === undefined) {
            this._cached.bottomAligned = !this.siblingflow && this.bottom !== null && this.bottom >= 0;
        }
        return this._cached.bottomAligned;
    }

    get autoMargin() {
        if (this._cached.autoMargin === undefined) {
            this._cached.autoMargin = this.blockStatic && (this.initial.styleMap.marginLeft === 'auto' || this.initial.styleMap.marginRight === 'auto');
        }
        return this._cached.autoMargin;
    }

    get autoMarginLeft() {
        if (this._cached.autoMarginLeft === undefined) {
            this._cached.autoMarginLeft = this.blockStatic && this.initial.styleMap.marginLeft === 'auto' && this.initial.styleMap.marginRight !== 'auto';
        }
        return this._cached.autoMarginLeft;
    }

    get autoMarginRight() {
        if (this._cached.autoMarginRight === undefined) {
            this._cached.autoMarginRight = this.blockStatic && this.initial.styleMap.marginLeft !== 'auto' && this.initial.styleMap.marginRight === 'auto';
        }
        return this._cached.autoMarginRight;
    }

    get autoMarginHorizontal() {
        if (this._cached.autoMarginHorizontal === undefined) {
            this._cached.autoMarginHorizontal = this.blockStatic && this.initial.styleMap.marginLeft === 'auto' && this.initial.styleMap.marginRight === 'auto';
        }
        return this._cached.autoMarginHorizontal;
    }

    get autoMarginVertical() {
        if (this._cached.autoMarginVertical === undefined) {
            this._cached.autoMarginVertical = this.blockStatic && this.initial.styleMap.marginTop === 'auto' && this.initial.styleMap.marginBottom === 'auto';
        }
        return this._cached.autoMarginVertical;
    }

    get floating() {
        if (this._cached.floating === undefined) {
            const value = this.css('cssFloat');
            this._cached.floating = this.siblingflow ? (value === 'left' || value === 'right') : false;
        }
        return this._cached.floating;
    }

    get float() {
        if (this._cached.float === undefined) {
            this._cached.float = this.floating ? this.css('cssFloat') : 'none';
        }
        return this._cached.float;
    }

    get textContent() {
        if (this._cached.textContent === undefined) {
            this._cached.textContent = '';
            if (this._element) {
                if (this._element instanceof HTMLElement) {
                    this._cached.textContent = this._element.innerText || this._element.innerHTML;
                }
                else if (this.plainText) {
                    this._cached.textContent = this._element.textContent || '';
                }
            }

        }
        return this._cached.textContent;
    }

    set overflow(value) {
        if (value === 0 || value === NODE_ALIGNMENT.HORIZONTAL || value === NODE_ALIGNMENT.VERTICAL || value === (NODE_ALIGNMENT.HORIZONTAL | NODE_ALIGNMENT.VERTICAL)) {
            this._cached.overflow = value;
        }
    }
    get overflow() {
        if (this._cached.overflow === undefined) {
            this._cached.overflow = 0;
            const [overflow, overflowX, overflowY] = [this.css('overflow'), this.css('overflowX'), this.css('overflowY')];
            if (this.toInt('width') > 0 && (overflow === 'scroll' || overflowX === 'scroll' || (overflowX === 'auto' && this._element.clientWidth !== this._element.scrollWidth))) {
                this._cached.overflow |= NODE_ALIGNMENT.HORIZONTAL;
            }
            if (this.toInt('height') > 0 && (overflow === 'scroll' || overflowY === 'scroll' || (overflowY === 'auto' && this._element.clientHeight !== this._element.scrollHeight))) {
                this._cached.overflow |= NODE_ALIGNMENT.VERTICAL;
            }
        }
        return this._cached.overflow;
    }

    get overflowX() {
        return hasBit(this.overflow, NODE_ALIGNMENT.HORIZONTAL);
    }
    get overflowY() {
        return hasBit(this.overflow, NODE_ALIGNMENT.VERTICAL);
    }

    get baseline() {
        if (this._cached.baseline === undefined) {
            const value = this.verticalAlign;
            this._cached.baseline = this.siblingflow && (value === 'baseline' || value === 'initial');
        }
        return this._cached.baseline;
    }

    get verticalAlign() {
        return this.css('verticalAlign');
    }

    get supSubscript() {
        if (this._cached.supSubscript === undefined) {
            const tagName = this.tagName;
            const verticalAlign = this.verticalAlign;
            this._cached.supSubscript = tagName === 'SUP' || tagName === 'SUB' || verticalAlign === 'super' || verticalAlign === 'sub';
        }
        return this._cached.supSubscript;
    }

    set multiLine(value) {
        this._cached.multiLine = value;
    }
    get multiLine() {
        if (this._cached.multiLine === undefined) {
            this._cached.multiLine = false;
            switch (this._element.tagName) {
                case 'IMG':
                case 'INPUT':
                case 'BUTTON':
                case 'TEXTAREA':
                case 'HR':
                case 'IFRAME':
                    break;
                default:
                    if (this.textElement && !this.hasWidth && (this.blockStatic || this.display === 'table-cell' || hasLineBreak(this._element))) {
                        this._cached.multiLine = getRangeClientRect(this._element)[1];
                    }
                    break;
            }
        }
        return this._cached.multiLine;
    }

    get boxStyle() {
        if (this._cached.boxStyle === undefined) {
            const hasBorder = this.borderTopWidth > 0 || this.borderRightWidth > 0 || this.borderBottomWidth > 0 || this.borderLeftWidth > 0;
            const hasBackgroundImage = REGEX_PATTERN.CSS_URL.test(this.css('backgroundImage')) || REGEX_PATTERN.CSS_URL.test(this.css('background'));
            const hasBackgroundColor = this.has('backgroundColor');
            this._cached.boxStyle = {
                hasBackground: hasBorder || hasBackgroundImage || hasBackgroundColor,
                hasBorder,
                hasBackgroundImage,
                hasBackgroundColor
            };
        }
        return this._cached.boxStyle;
    }

    get preserveWhiteSpace() {
        if (this._cached.preserveWhiteSpace === undefined) {
            const value = this.css('whiteSpace');
            this._cached.preserveWhiteSpace = value === 'pre' || value === 'pre-wrap';
        }
        return this._cached.preserveWhiteSpace;
    }

    get layoutRelative() {
        return this.is(NODE_CONTAINER.RELATIVE);
    }
    get layoutConstraint() {
        return this.is(NODE_CONTAINER.CONSTRAINT);
    }

    get actualParent(): T | null {
        return getElementAsNode(this.element.parentElement);
    }

    get actualHeight() {
        return this.plainText ? this.bounds.bottom - this.bounds.top : this.bounds.height;
    }

    get singleChild() {
        return this.rendered ? this.renderParent.length === 1 : this.parent.length === 1;
    }

    get dir() {
        if (this._cached.dir === undefined) {
            this._cached.dir = this.css('direction');
            switch (this._cached.dir) {
                case 'unset':
                case 'inherit':
                    let parent = this.actualParent;
                    while (parent && parent.id !== 0) {
                        const value = parent.dir;
                        if (value !== '') {
                            this._cached.dir = value;
                            break;
                        }
                        parent = parent.actualParent;
                    }
                    this._cached.dir = document.body.dir;
                    break;
            }
        }
        return this._cached.dir;
    }

    get nodes() {
        return this.rendered ? this.renderChildren : this.children;
    }

    get previousElementSibling() {
        let element = <Element> this.element.previousSibling;
        while (element) {
            if (isPlainText(element) || isStyleElement(element) || element.tagName === 'BR') {
                return element;
            }
            element = <Element> element.previousSibling;
        }
        return null;
    }
    get nextElementSibling() {
        let element = <Element> this.element.nextSibling;
        while (element) {
            if (isPlainText(element) || isStyleElement(element) || element.tagName === 'BR') {
                return element;
            }
            element = <Element> element.nextSibling;
        }
        return null;
    }

    get center(): Point {
        return {
            x: this.bounds.left + Math.floor(this.bounds.width / 2),
            y: this.bounds.top + Math.floor(this.actualHeight / 2)
        };
    }
}