import Container from './container';
import Node from './node';

import { getElementAsNode } from '../lib/dom';
import { convertInt, isUnit, maxArray, minArray, withinFraction } from '../lib/util';

export default class NodeList<T extends Node> extends Container<T> implements androme.lib.base.NodeList<T> {
    public static actualParent<T extends Node>(list: T[]) {
        for (const node of list) {
            if (node.baseElement && node.actualParent) {
                return node.actualParent as T;
            }
        }
        return undefined;
    }

    public static baseline<T extends Node>(list: T[], text = false) {
        let baseline = list.filter(item => !item.floating && !isUnit(item.verticalAlign) && !['absolute', 'fixed'].includes(item.cssInitial('position')));
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
            if (a.groupParent || (!a.baseline && b.baseline)) {
                return 1;
            }
            else if (b.groupParent || (a.baseline && !b.baseline)) {
                return -1;
            }
            if (!a.imageElement || !b.imageElement) {
                const fontSizeA = convertInt(a.css('fontSize'));
                const fontSizeB = convertInt(b.css('fontSize'));
                if (a.multiLine || b.multiLine) {
                    if (a.lineHeight && b.lineHeight) {
                        return a.lineHeight <= b.lineHeight ? 1 : -1;
                    }
                    else if (fontSizeA === fontSizeB) {
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
                    if (fontSizeA === fontSizeB) {
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
                    else if (fontSizeA !== fontSizeB && fontSizeA !== 0 && fontSizeB !== 0) {
                        return fontSizeA > fontSizeB ? -1 : 1;
                    }
                }
            }
            return 0;
        });
    }

    public static floated<T extends Node>(list: T[]) {
        return new Set(list.map(node => node.float).filter(value => value !== 'none'));
    }

    public static cleared<T extends Node>(list: T[], parent = true) {
        if (parent && list.length > 1) {
            list.slice().sort(this.siblingIndex);
            const actualParent = this.actualParent(list);
            if (actualParent) {
                const nodes: T[] = [];
                const listEnd = list[list.length - 1];
                let valid = false;
                for (let i = 0; i < actualParent.element.childNodes.length; i++) {
                    const node = getElementAsNode<T>(<Element> actualParent.element.childNodes[i]);
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
        const result = new Map<T, string>();
        const floated = new Set<string>();
        for (const node of list) {
            if (node.pageFlow) {
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

    public static floatedAll<T extends Node>(parent: T) {
        return this.floated(parent.actualChildren.filter(item => item.pageFlow) as T[]);
    }

    public static clearedAll<T extends Node>(parent: T) {
        return this.cleared(parent.actualChildren.filter(item => item.pageFlow) as T[], false);
    }

    public static linearX<T extends Node>(list: T[]) {
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
                    const boxLeft = minArray(nodes.map(node => node.linear.left));
                    const boxRight = maxArray(nodes.map(node => node.linear.right));
                    const floatLeft =  maxArray(nodes.filter(node => node.float === 'left').map(node => node.linear.right));
                    const floatRight =  minArray(nodes.filter(node => node.float === 'right').map(node => node.linear.left));
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

    public static linearY<T extends Node>(list: T[]) {
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

    public static partitionRows<T extends Node>(list: T[]) {
        const [children, cleared] = ((): [T[], Map<T, string>] => {
            const parent = this.actualParent(list);
            if (parent) {
                return [parent.actualChildren as T[], this.clearedAll(parent)];
            }
            else {
                return [list, this.cleared(list)];
            }
        })();
        const result: T[][] = [];
        let row: T[] = [];
        for (let i = 0; i < children.length; i++) {
            const node = children[i];
            const previousSiblings = node.previousSiblings() as T[];
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

    public static siblingIndex<T extends Node>(a: T, b: T) {
        return a.siblingIndex >= b.siblingIndex ? 1 : -1;
    }

    public delegateAppend?: (node: T) => void;

    private _currentId = 0;

    constructor(children?: T[]) {
        super(children);
    }

    public append(node: T, delegate = true) {
        super.append(node);
        if (delegate && this.delegateAppend) {
            this.delegateAppend.call(this, node);
        }
        return this;
    }

    public reset() {
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