import { CachedValue, Support } from '../types/lib.base.types.node';

import { CSS_SPACING, ELEMENT_BLOCK, ELEMENT_INLINE, REGEX_PATTERN } from '../lib/constant';
import { APP_SECTION, BOX_STANDARD, CSS_STANDARD, NODE_ALIGNMENT, NODE_PROCEDURE, NODE_RESOURCE } from '../lib/enumeration';

import Container from './container';
import Extension from './extension';

import { assignBounds, checkStyleAttribute, cssInheritAttribute, deleteElementCache, getElementAsNode, getElementCache, getRangeClientRect, getStyle, hasComputedStyle, hasFreeFormText, newRectDimension, setElementCache, createElement } from '../lib/dom';
import { assignWhenNull, convertCamelCase, convertInt, convertPX, filterArray, formatPX, hasBit, hasValue, isArray, isPercent, isUnit, searchObject, trimNull, withinFraction } from '../lib/util';

type T = Node;

export default abstract class Node extends Container<T> implements androme.lib.base.Node {
    public style!: CSSStyleDeclaration;
    public alignmentType = 0;
    public depth = -1;
    public siblingIndex = Number.MAX_VALUE;
    public renderPosition = -1;
    public documentRoot = false;
    public visible = true;
    public excluded = false;
    public rendered = false;
    public baselineActive = false;
    public positioned = false;
    public renderExtension = new Set<Extension<T>>();
    public controlId = '';
    public companion: T | undefined;

    public abstract readonly localSettings: {};
    public abstract readonly renderChildren: T[];

    protected abstract _namespaces: Set<string>;

    protected abstract readonly _boxAdjustment: BoxModel;
    protected abstract readonly _boxReset: BoxModel;

    protected _cached: CachedValue<T> = {};
    protected _styleMap: StringMap = {};
    protected _box: RectDimension | undefined;
    protected _bounds: RectDimension | undefined;
    protected _linear: RectDimension | undefined;
    protected _controlName: string | undefined;
    protected _renderParent: T | undefined;
    protected _documentParent: T | undefined;

    protected readonly _initial: InitialData<T> = {
        iteration: -1,
        children: [],
        styleMap: {}
    };

    private _parent: T | undefined;
    private _renderAs: T | undefined;
    private _renderDepth = -1;
    private _renderPositionId: string | undefined;
    private _data = {};
    private _excludeSection = 0;
    private _excludeProcedure = 0;
    private _excludeResource = 0;

    private readonly _element: Element | null = null;

    protected constructor(
        public readonly id: number,
        element?: Element)
    {
        super();
        if (element) {
            this._element = element;
            this.init();
        }
        else {
            this.style = <CSSStyleDeclaration> {};
        }
    }

    public abstract setControlType(viewName: string, containerType?: number): void;
    public abstract setLayout(width?: number, height?: number): void;
    public abstract setAlignment(): void;
    public abstract setBoxSpacing(): void;
    public abstract applyOptimizations(): void;
    public abstract applyCustomizations(): void;
    public abstract alignParent(position: string): boolean;
    public abstract alignSibling(position: string, documentId?: string): string;
    public abstract localizeString(value: string): string;
    public abstract clone(id?: number, attributes?: boolean, position?: boolean): T;
    public abstract set containerType(value: number);
    public abstract get containerType(): number;
    public abstract get documentId(): string;
    public abstract get fontSize(): number;
    public abstract get support(): Support;

    public init() {
        const element = <HTMLElement> this._element;
        if (element) {
            setElementCache(element, 'node', this);
            this.style = getElementCache(element, 'style') || getStyle(element, false);
        }
        if (this.styleElement) {
            const styleMap = getElementCache(element, 'styleMap') || {};
            const fontSize = convertInt(this.style.fontSize as string);
            for (let attr of Array.from(element.style)) {
                attr = convertCamelCase(attr);
                const value = checkStyleAttribute(element, attr, element.style[attr], this.style, fontSize);
                if (value !== '') {
                    styleMap[attr] = value;
                }
            }
            this._styleMap = { ...styleMap };
        }
    }

    public saveAsInitial() {
        if (this._initial.iteration === -1) {
            this._initial.children = this.duplicate();
            this._initial.styleMap = { ...this._styleMap };
            this._initial.documentParent = this._documentParent;
        }
        if (this._bounds) {
             this._initial.bounds = assignBounds(this._bounds);
             this._initial.linear = assignBounds(this.linear);
             this._initial.box = assignBounds(this.box);
        }
        this._initial.iteration++;
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

    public render(parent: T) {
        this.renderParent = parent;
        this.renderDepth = this.documentRoot || this === parent || hasValue(parent.dataset.target) ? 0 : parent.renderDepth + 1;
        this.rendered = true;
    }

    public renderEach(predicate: IteratorPredicate<T, void>) {
        for (let i = 0; i < this.renderChildren.length; i++) {
            if (this.renderChildren[i].visible) {
                predicate(this.renderChildren[i], i, this.renderChildren);
            }
        }
        return this;
    }

    public renderFilter(predicate: IteratorPredicate<T, boolean>) {
        return filterArray(this.renderChildren, predicate);
    }

    public hide(invisible?: boolean) {
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
        else if (value === null) {
            delete this._data[obj];
        }
        return this._data[obj] === undefined || this._data[obj][attr] === undefined ? undefined : this._data[obj][attr];
    }

    public unsetCache(...attrs: string[]) {
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

    public ascend(generated = false, levels = -1) {
        const result: T[] = [];
        const attr = generated ? (this.renderParent ? 'renderParent' : 'parent') : 'actualParent';
        let current: T | undefined = this[attr];
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

    public cascade(element = false) {
        function cascade(node: T) {
            const current: T[] = [];
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

    public inherit(node: T, ...props: string[]) {
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

    public alignedVertically(previousSiblings: T[], siblings?: T[], cleared?: Map<T, string>, checkFloat = true) {
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
                const vertical = (
                    previous.blockStatic ||
                    this.blockStatic && (
                        !previous.inlineFlow ||
                        !!cleared && cleared.has(previous)
                    ) ||
                    !!cleared && cleared.get(previous) === 'both' && (!isArray(siblings) || siblings[0] !== previous) ||
                    !previous.floating && (
                        this.blockStatic ||
                        !this.floating && !this.inlineFlow
                    ) ||
                    actualParent && previous.bounds.width > (actualParent.has('width', CSS_STANDARD.UNIT) ? actualParent.width : actualParent.box.width) && (
                        !previous.textElement ||
                        previous.textElement && previous.css('whiteSpace') === 'nowrap'
                    ) ||
                    previous.lineBreak ||
                    previous.autoMargin.leftRight ||
                    previous.float === 'left' && this.autoMargin.right ||
                    previous.float === 'right' && this.autoMargin.left
                );
                if (vertical) {
                    return true;
                }
            }
        }
        return false;
    }

    public intersectX(rect: RectDimension, dimension = 'linear') {
        const self: RectDimension = this[dimension];
        return (
            rect.top >= self.top && rect.top < self.bottom ||
            rect.bottom > self.top && rect.bottom <= self.bottom ||
            self.top >= rect.top && self.bottom <= rect.bottom ||
            rect.top >= self.top && rect.bottom <= self.bottom
        );
    }

    public intersectY(rect: RectDimension, dimension = 'linear') {
        const self: RectDimension = this[dimension];
        return (
            rect.left >= self.left && rect.left < self.right ||
            rect.right > self.left && rect.right <= self.right ||
            self.left >= rect.left && self.right <= rect.right ||
            rect.left >= self.left && rect.right <= self.right
        );
    }

    public withinX(rect: RectDimension, dimension = 'linear') {
        const self: RectDimension = this[dimension];
        return Math.ceil(self.top) >= Math.floor(rect.top) && Math.floor(self.bottom) <= Math.ceil(rect.bottom);
    }

    public withinY(rect: RectDimension, dimension = 'linear') {
        const self: RectDimension = this[dimension];
        return Math.ceil(self.left) >= Math.floor(rect.left) && Math.floor(self.right) <= Math.ceil(rect.right);
    }

    public outsideX(rect: RectDimension, dimension = 'linear') {
        const self: RectDimension = this[dimension];
        return Math.ceil(self.left) < Math.floor(rect.left) || Math.ceil(self.left) >= Math.floor(rect.right);
    }

    public outsideY(rect: RectDimension, dimension = 'linear') {
        const self: RectDimension = this[dimension];
        return Math.ceil(self.top) < Math.floor(rect.top) || Math.ceil(self.top) >= Math.floor(rect.bottom);
    }

    public css(attr: string, value = '', cache = false): string {
        if (arguments.length >= 2) {
            this._styleMap[attr] = value;
            if (cache) {
                this.unsetCache(attr);
            }
        }
        return this._styleMap[attr] || this.style && this.style[attr] || '';
    }

    public cssApply(values: StringMap, cache = false) {
        Object.assign(this._styleMap, values);
        if (cache) {
            for (const name in values) {
                this.unsetCache(name);
            }
        }
        return this;
    }

    public cssInitial(attr: string, modified = false, computed = false) {
        if (this._initial.iteration === -1 && !modified) {
            computed = true;
        }
        let value = modified ? this._styleMap[attr] : this._initial.styleMap[attr];
        if (computed && !hasValue(value)) {
            value = this.style[attr];
        }
        return value || '';
    }

    public cssAscend(attr: string, startChild = false, visible = false) {
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

    public cssSort(attr: string, desc = false, duplicate = false) {
        const children = (duplicate ? this.duplicate() :  this.children);
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

    public cssPX(attr: string, value: number, negative = false, cache = false) {
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

    public cssTry(attr: string, value: string) {
        if (this.styleElement) {
            const element = <HTMLElement> this._element;
            const current = this.css(attr);
            element.style[attr] = value;
            if (element.style[attr] === value) {
                setElementCache(element, attr, current);
                return true;
            }
        }
        return false;
    }

    public cssFinally(attr: string) {
        if (this.styleElement) {
            const element = <HTMLElement> this._element;
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
        const value = (initial ? this._initial.styleMap : this._styleMap)[attr];
        return parseInt(value) || defaultValue;
    }

    public convertPX(value: string, horizontal = true, parent = true) {
        return this.convertPercent(value, horizontal, parent) || convertPX(value, this.fontSize);
    }

    public convertPercent(value: string, horizontal: boolean, parent = true) {
        if (isPercent(value)) {
            const node = (parent ? this.absoluteParent : null) || this;
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
        return '';
    }

    public has(attr: string, checkType: number = 0, options?: ObjectMap<string | string[]>): boolean {
        const value = (options && options.map === 'initial' ? this._initial.styleMap : this._styleMap)[attr];
        if (hasValue(value)) {
            switch (value) {
                case '0px':
                    if (hasBit(checkType, CSS_STANDARD.ZERO)) {
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

    public appendTry(node: T, withNode: T, append = true) {
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

    public modifyBox(region: number, offset: number | null, negative = true) {
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

    public valueBox(region: number): [number, number] {
        const attr = CSS_SPACING.get(region);
        if (attr) {
            return [this._boxReset[attr], this._boxAdjustment[attr]];
        }
        return [0, 0];
    }

    public resetBox(region: number, node?: T, fromParent = false) {
        const keys = Array.from(CSS_SPACING.keys());
        const applyReset = (start: number, end: number, margin: boolean) => {
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
        if (hasBit(region, BOX_STANDARD.MARGIN)) {
            applyReset(0, 4, true);
        }
        if (hasBit(region, BOX_STANDARD.PADDING)) {
            applyReset(4, 8, false);
        }
    }

    public inheritBox(region: number, node: T) {
        const keys = Array.from(CSS_SPACING.keys());
        const applyReset = (start: number, end: number, margin: boolean) => {
            let i = margin ? 0 : 4;
            for (const attr of Array.from(CSS_SPACING.values()).slice(start, end)) {
                const value: number = this._boxAdjustment[attr];
                if (value > 0) {
                    node.modifyBox(keys[i], this._boxAdjustment[attr], false);
                    this._boxAdjustment[attr] = 0;
                }
                i++;
            }
        };
        if (hasBit(region, BOX_STANDARD.MARGIN)) {
            applyReset(0, 4, true);
        }
        if (hasBit(region, BOX_STANDARD.PADDING)) {
            applyReset(4, 8, false);
        }
    }

    public previousSiblings(lineBreak = true, excluded = true, height = false) {
        let element: Element | null = null;
        const result: T[] = [];
        if (this._element) {
            element = <Element> this._element.previousSibling;
        }
        else if (this._initial.children.length) {
            const children = this._initial.children.filter(node => node.pageFlow);
            element = children.length && children[0].element ? <Element> children[0].element.previousSibling : null;
        }
        while (element) {
            const node = getElementAsNode<T>(element);
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
            element = <Element> element.previousSibling;
        }
        return result;
    }

    public nextSiblings(lineBreak = true, excluded = true, visible = false) {
        let element: Element | null = null;
        const result: T[] = [];
        if (this._element) {
            element = <Element> this._element.nextSibling;
        }
        else if (this._initial.children.length) {
            const children = this._initial.children.filter(node => node.pageFlow);
            if (children.length) {
                const lastChild = children[children.length - 1];
                element = lastChild.element ? <Element> lastChild.element.nextSibling : null;
            }
        }
        while (element) {
            const node = getElementAsNode<T>(element);
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
            element = <Element> element.nextSibling;
        }
        return result;
    }

    public actualRight(dimension = 'linear') {
        const node = this.companion && !this.companion.visible && this.companion[dimension].right > this[dimension].right ? this.companion : this;
        return node[dimension].right as number;
    }

    private setDimensions(dimension: string) {
        const bounds: RectDimension = this.unsafe(dimension);
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

    private convertPosition(attr: string) {
        let result = 0;
        if (!this.positionStatic) {
            const value = this.cssInitial(attr);
            if (isUnit(value) || isPercent(value)) {
                result = convertInt(this.convertUnit(attr, value, attr === 'left' || attr === 'right'));
            }
        }
        return result;
    }

    private convertBox(region: string, direction: string) {
        const attr = region + direction;
        return convertInt(this.convertUnit(attr, this.css(attr), direction === 'Left' || direction === 'Right'));
    }

    private convertUnit(attr: string, value: string, horizontal: boolean, parent = true) {
        if (isPercent(value)) {
            return isUnit(this.style[attr]) ? this.style[attr] as string : this.convertPercent(value, horizontal, parent);
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
                    value = (element.tagName === 'INPUT' ? (<HTMLInputElement> element).type : element.tagName).toUpperCase();
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
            this._cached.positionAuto = (
                !this.pageFlow &&
                (styleMap.top === 'auto' || !styleMap.top) &&
                (styleMap.right === 'auto' || !styleMap.right) &&
                (styleMap.bottom === 'auto' || !styleMap.bottom) &&
                (styleMap.left === 'auto' || !styleMap.left)
            );
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
                                const node = getElementAsNode<T>(item);
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
            this._cached.rightAligned = (
                this.float === 'right' ||
                this.autoMargin.left ||
                this.inlineVertical && this.cssAscend('textAlign', true) === 'right' ||
                !this.pageFlow && this.has('right')
            );
        }
        return this._cached.rightAligned || this.hasAlign(NODE_ALIGNMENT.RIGHT);
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
        if (value === 0 || value === NODE_ALIGNMENT.VERTICAL || value === NODE_ALIGNMENT.HORIZONTAL || value === (NODE_ALIGNMENT.HORIZONTAL | NODE_ALIGNMENT.VERTICAL)) {
            this._cached.overflow = value;
        }
    }
    get overflow() {
        if (this._cached.overflow === undefined) {
            const [overflow, overflowX, overflowY] = [this.css('overflow'), this.css('overflowX'), this.css('overflowY')];
            const element = this._element;
            let value = 0;
            if (this.hasWidth && (
                    overflow === 'scroll' ||
                    overflowX === 'scroll' ||
                    overflowX === 'auto' && element && element.clientWidth !== element.scrollWidth
               ))
            {
                value |= NODE_ALIGNMENT.HORIZONTAL;
            }
            if (this.hasHeight && (
                    overflow === 'scroll' ||
                    overflowY === 'scroll' ||
                    overflowY === 'auto' && element && element.clientHeight !== element.scrollHeight
               ))
            {
                value |= NODE_ALIGNMENT.VERTICAL;
            }
            this._cached.overflow = value;
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
            this._cached.multiLine = this.plainText || this.inlineFlow && this.inlineText ? getRangeClientRect(<Element> this._element).multiLine : 0;
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
        return this.hasAlign(NODE_ALIGNMENT.HORIZONTAL);
    }
    get layoutVertical() {
        return this.hasAlign(NODE_ALIGNMENT.VERTICAL);
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
        return this.baseElement && this.baseElement.parentElement ? getElementAsNode(this.baseElement.parentElement) as T : undefined;
    }

    get actualChildren() {
        if (this._cached.actualChildren === undefined) {
            if (this.htmlElement) {
                const actualChildren: T[] = [];
                (<HTMLElement> this._element).childNodes.forEach((element: Element) => {
                    const node = getElementAsNode<T>(element);
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
        const element = this._element as HTMLElement;
        if (element) {
            for (let i = 0; i < element.childNodes.length; i++) {
                const node = getElementAsNode<T>(<Element> element.childNodes[i]);
                if (node) {
                    return node;
                }
            }
        }
        return undefined;
    }

    get lastChild() {
        const element = this._element as HTMLElement;
        if (element) {
            for (let i = element.childNodes.length - 1; i >= 0; i--) {
                const node = getElementAsNode<T>(<Element> element.childNodes[i]);
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
            let value = this.naturalElement && this.styleElement ? (<HTMLElement> this._element).dir : '';
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

    get center(): Point {
        return {
            x: this.bounds.left + Math.floor(this.bounds.width / 2),
            y: this.bounds.top + Math.floor(this.actualHeight / 2)
        };
    }
}