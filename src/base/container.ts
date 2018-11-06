export default class Container<T> implements androme.lib.base.Container<T>, Iterable<T> {
    private _children: T[] = [];

    public constructor(children?: T[]) {
        if (Array.isArray(children)) {
            this.replace(children);
        }
    }

    public [Symbol.iterator]() {
        const list = this._children;
        let i = 0;
        return {
            next(): IteratorResult<T> {
                if (i < list.length) {
                    return { done: false, value: list[i++] };
                }
                else {
                    return { done: true, value: undefined } as any;
                }
            }
        };
    }

    public item(index?: number, value?: T): T | undefined {
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

    public append(item: T) {
        this._children.push(item);
    }

    public remove(item: T) {
        for (let i = 0; i < this.list.length; i++) {
            if (item === this.list[i]) {
                return this.list.splice(i, 1);
            }
        }
        return [];
    }

    public contains(item: T) {
        return this._children.includes(item);
    }

    public replace(item: T[]) {
        this._children = item;
    }

    public duplicate() {
        return this._children.slice();
    }

    public clear() {
        this._children.length = 0;
        return this;
    }

    public each(predicate: IteratorPredicate<T, void>) {
        this._children.forEach(predicate);
        return this;
    }

    public find(predicate: string | IteratorPredicate<T, boolean>, value?: any) {
        if (typeof predicate === 'string') {
            return this._children.find(item => item[predicate] === value);
        }
        return this._children.find(predicate);
    }

    public filter(predicate: IteratorPredicate<T, any>) {
        return this._children.filter(predicate);
    }

    public map<U>(predicate: IteratorPredicate<T, U>): U[] {
        return this._children.map(predicate);
    }

    public sort(predicate: (a: T, b: T) => number) {
        this._children.sort(predicate);
        return this;
    }

    public every(predicate: IteratorPredicate<T, boolean>) {
        return this.length > 0 && this._children.every(predicate);
    }

    public some(predicate: IteratorPredicate<T, boolean>) {
        return this.length > 0 && this._children.some(predicate);
    }

    get list() {
        return this._children;
    }

    get length() {
        return this._children.length;
    }
}