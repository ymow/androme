import { NODE_ALIGNMENT } from '../lib/enumeration';

import Container from './container';
import Node from './node';
import NodeList from './nodelist';

import { hasBit } from '../lib/util';

export default class Layout<T extends Node> extends Container<T> implements androme.lib.base.Layout<T> {
    public rowCount = 0;
    public columnCount = 0;

    private _floated: Set<string> | undefined;
    private _cleared: Map<T, string> | undefined;
    private _linearX: boolean | undefined;

    constructor(
        public parent: T,
        public node: T,
        public containerType = 0,
        public alignmentType = 0,
        public itemCount = 0,
        children?: T[])
    {
        super(children);
    }

    public init() {
        this.floated = this.getFloated();
        this.cleared = this.getCleared();
        this.linearX = this.getLinearX();
    }

    public initParent() {
        this.floated = this.getFloated(true);
        this.cleared = this.getCleared(true);
        this.linearX = this.getLinearX();
    }

    public setType(containerType: number, alignmentType?: number) {
        this.containerType = containerType;
        if (alignmentType) {
            this.add(alignmentType);
        }
    }

    public add(value: number) {
        this.alignmentType |= value;
        return this.alignmentType;
    }

    public retain(list: T[]) {
        super.retain(list);
        this.itemCount = list.length;
        return this;
    }

    public delete(value: number) {
        if (hasBit(this.alignmentType, value)) {
            this.alignmentType ^= value;
        }
        return this.alignmentType;
    }

    public getFloated(parent = false) {
        return parent ? NodeList.floatedAll(this.parent) : NodeList.floated(this.children);
    }

    public getCleared(parent = false) {
        return parent ? NodeList.clearedAll(this.parent) : NodeList.cleared(this.children);
    }

    public getLinearX() {
        return NodeList.linearX(this.children);
    }

    set floated(value) {
        if (value.size) {
            this.add(NODE_ALIGNMENT.FLOAT);
        }
        else {
            this.delete(NODE_ALIGNMENT.FLOAT);
        }
        if (this.every(item => item.float === 'right')) {
            this.add(NODE_ALIGNMENT.RIGHT);
        }
        else {
            this.delete(NODE_ALIGNMENT.RIGHT);
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

    set linearX(value) {
        this._linearX = value;
    }
    get linearX() {
        return this._linearX || this.getLinearX();
    }
}