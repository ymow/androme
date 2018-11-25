import Node from './node';

export default class Layout<T extends Node> implements androme.lib.base.Layout<T> {
    public rowCount = 0;
    public columnCount = 0;

    private _items: T[] | undefined;

    constructor(
        public node: T,
        public parent: T,
        public containerType = 0,
        public alignmentType = 0,
        public itemCount = 0,
        items?: T[])
    {
        if (items) {
            this.items = items;
        }
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

    public delete(value: number) {
        this.alignmentType ^= value;
        return this.alignmentType;
    }

    set items(value) {
        this._items = value;
        this.itemCount = value.length;
    }
    get items() {
        if (this._items === undefined) {
            this._items = [];
        }
        return this._items;
    }
}