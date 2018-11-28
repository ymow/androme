import { NODE_ALIGNMENT, NODE_CONTAINER, USER_AGENT } from '../lib/enumeration';

import Container from './container';
import Node from './node';

import {  isUserAgent } from '../lib/dom';
import { convertInt, hasBit, maxArray, minArray, partition, withinFraction } from '../lib/util';

export default class NodeList<T extends Node> extends Container<T> implements androme.lib.base.NodeList<T> {
    public static actualParent<T extends Node>(list: T[]) {
        for (const node of list) {
            if (node.domElement && node.actualParent) {
                return node.actualParent as T;
            }
        }
        return null;
    }

    public static floated<T extends Node>(list: T[]) {
        return new Set(list.map(node => node.float).filter(value => value !== 'none'));
    }

    public static cleared<T extends Node>(list: T[], parent = true) {
        if (parent && list.length > 1) {
            list.sort(this.siblingIndex);
            const actualParent = this.actualParent(list);
            if (actualParent) {
                const nodes: T[] = [];
                const listEnd = list[list.length - 1];
                let valid = false;
                for (let i = 0; i < actualParent.element.childNodes.length; i++) {
                    const node = Node.getElementAsNode<T>(<Element> actualParent.element.childNodes[i]);
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

    public static floatedAll<T extends Node>(parent: T) {
        return NodeList.floated(parent.actualChildren.filter(item => item.siblingflow) as T[]);
    }

    public static clearedAll<T extends Node>(parent: T) {
        return NodeList.cleared(parent.actualChildren.filter(item => item.siblingflow) as T[], false);
    }

    public static textBaseline<T extends Node>(list: T[]) {
        let baseline: T[] = [];
        if (!list.some(node => node.baseline && (node.textElement || node.imageElement))) {
            baseline = list.filter(node => node.baseline).sort((a, b) => {
                let containerTypeA = a.containerType;
                let containerTypeB = b.containerType;
                if (a.layoutHorizontal) {
                    containerTypeA = minArray(a.map(item => item.containerType));
                }
                else if (a.length > 0) {
                    containerTypeA = Number.MAX_VALUE;
                }
                if (b.layoutHorizontal) {
                    containerTypeB = minArray(b.map(item => item.containerType));
                }
                else if (b.length > 0) {
                    containerTypeB = Number.MAX_VALUE;
                }
                return containerTypeA === containerTypeB ? (a.id < b.id ? -1 : 1) : (containerTypeA < containerTypeB ? -1 : 1);
            });
        }
        else {
            const lineHeight = maxArray(list.map(node => node.lineHeight));
            const boundsHeight = maxArray(list.map(node => node.bounds.height));
            if (lineHeight > boundsHeight) {
                const result = list.filter(node => node.lineHeight === lineHeight);
                baseline = (result.length === list.length ? result.filter(node => node.htmlElement) : result).filter(node => node.baseline);
                if (baseline.length > 0) {
                    return baseline;
                }
            }
            baseline = list.slice().sort((a, b) => {
                if (a.groupElement || (!a.baseline && b.baseline)) {
                    return 1;
                }
                else if (b.groupElement || (a.baseline && !b.baseline)) {
                    return -1;
                }
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
                            return a.lineHeight <= b.lineHeight ? 1 : -1;
                        }
                        else if (fontSizeA === fontSizeB) {
                            return a.htmlElement || !b.htmlElement ? -1 : 1;
                        }
                    }
                    if (a.containerType !== b.containerType && (a.containerType < NODE_CONTAINER.TEXT || b.containerType < NODE_CONTAINER.TEXT)) {
                        if (a.textElement || a.imageElement) {
                            return -1;
                        }
                        else if (b.textElement || b.imageElement) {
                            return 1;
                        }
                        return a.containerType < b.containerType ? -1 : 1;
                    }
                    else if (b.imageElement || a.lineHeight > heightB && b.lineHeight === 0) {
                        return -1;
                    }
                    else if (a.imageElement || b.lineHeight > heightA && a.lineHeight === 0) {
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
                                return a.siblingIndex >= b.siblingIndex ? 1 : -1;
                            }
                        }
                        else if (fontSizeA !== fontSizeB && fontSizeA !== 0 && fontSizeB !== 0) {
                            return fontSizeA > fontSizeB ? -1 : 1;
                        }
                    }
                }
                return heightA <= heightB ? 1 : -1;
            });
        }
        let fontFamily: string;
        let fontSize: string;
        let fontWeight: string;
        return baseline.filter((node, index) => {
            if (node.length) {
                node = node.nodes.slice().sort((a, b) => {
                    if (a.textElement && !b.textElement) {
                        return -1;
                    }
                    else if (!a.textElement && b.textElement) {
                        return 1;
                    }
                    else {
                        return a.bounds.height <= b.bounds.height ? 1 : -1;
                    }
                })[0] as T;
            }
            if (index === 0) {
                fontFamily = node.css('fontFamily');
                fontSize = node.css('fontSize');
                fontWeight = node.css('fontWeight');
                return true;
            }
            else {
                return (
                    node.css('fontFamily') === fontFamily &&
                    node.css('fontSize') === fontSize &&
                    node.css('fontWeight') === fontWeight &&
                    node.tagName === baseline[0].tagName && (
                        node.lineHeight > 0 && node.lineHeight === baseline[0].lineHeight ||
                        node.bounds.height === baseline[0].bounds.height
                    )
                );
            }
        });
    }

    public static linearX<T extends Node>(list: T[]) {
        const nodes = list.filter(node => node.pageflow).sort(NodeList.siblingIndex);
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
                        if (nodes[i].alignedVertically(nodes[i].previousSibling(), undefined, cleared)) {
                            return false;
                        }
                    }
                    const boxLeft = minArray(nodes.map(node => node.linear.left));
                    const boxRight = maxArray(nodes.map(node => node.linear.right));
                    for (let i = 0, j = 0, k = 0; i < nodes.length; i++) {
                        const item = nodes[i];
                        if (Math.floor(item.linear.left) <= boxLeft) {
                            j++;
                        }
                        if (Math.ceil(item.linear.right) >= boxRight) {
                            k++;
                        }
                        if (i === 0) {
                            continue;
                        }
                        if (j === 2 || k === 2) {
                            return false;
                        }
                        const previous = nodes[i - 1];
                        if (withinFraction(item.linear.left, previous.linear.left)) {
                            return false;
                        }
                        else if (item.floating) {
                            const direction = item.float;
                            for (let l = 0; l < i; l++) {
                                const sibling = nodes[l];
                                if (withinFraction(item.linear[direction], sibling.linear[direction])) {
                                    return false;
                                }
                            }
                        }
                    }
                    return true;
                }
                return false;
        }
    }

    public static linearY<T extends Node>(list: T[]) {
        const nodes = list.filter(node => node.pageflow).sort(NodeList.siblingIndex);
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
                        if (!nodes[i].alignedVertically(nodes[i].previousSibling(), nodes, cleared)) {
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
            const previous = node.previousSibling() as T[];
            if (i === 0 || previous.length === 0) {
                if (list.includes(node)) {
                    row.push(node);
                }
            }
            else {
                if (node.alignedVertically(previous, row, cleared)) {
                    if (row.length > 0) {
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
            if (i === children.length - 1 && row.length > 0) {
                result.push(row);
            }
        }
        return result;
    }

    public static partitionAboveBottom<T extends Node>(list: T[], node: T, maxBottom?: number) {
        const result: T[] = [];
        const preferred: T[] = [];
        if (maxBottom) {
            list = list.filter(item => item.linear.bottom === maxBottom);
        }
        for (let i = 0; i < list.length; i++) {
            const above = list[i];
            if (node.intersectY(above.linear)) {
                if (maxBottom === undefined) {
                    if (node.linear.top >= above.linear.bottom) {
                        result.push(above);
                    }
                }
                else {
                    if (maxBottom === above.linear.bottom) {
                        preferred.push(above);
                    }
                }
            }
            else {
                if (maxBottom === above.linear.bottom) {
                    result.push(above);
                }
            }
        }
        return preferred.length ? preferred : result;
    }

    public static sortByAlignment<T extends Node>(list: T[], alignmentType: number) {
        if (hasBit(NODE_ALIGNMENT.HORIZONTAL | NODE_ALIGNMENT.FLOAT, alignmentType)) {
            function sortHorizontal(nodes: T[]) {
                if (nodes.some(node => node.floating) && !nodes.every(node => node.float === 'right')) {
                    nodes.sort((a, b) => {
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
                            else if (a.float === 'right' && b.float === 'right') {
                                return -1;
                            }
                        }
                        return 0;
                    });
                }
                else {
                    nodes.sort(NodeList.siblingIndex);
                }
                return nodes;
            }
            if (hasBit(NODE_ALIGNMENT.MULTILINE, alignmentType)) {
                const rows = this.partitionRows(list);
                const result: T[] = [];
                for (const row of rows) {
                    result.push(...sortHorizontal(row));
                }
                list.length = 0;
                list.push(...result);
            }
            else {
                sortHorizontal(list);
            }
        }
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

    public partition(predicate: (value: T) => boolean) {
        const [valid, invalid]: T[][] = partition(this.children, predicate);
        return [new NodeList(valid), new NodeList(invalid)];
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

    get linearX() {
        return NodeList.linearX(this.children);
    }
    get linearY() {
        return NodeList.linearY(this.children);
    }
}