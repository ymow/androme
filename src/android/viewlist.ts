import View from './view';
import NodeList from '../base/nodelist';
import { calculateBias } from '../lib/util';

export default class ViewList<T extends View> extends NodeList<T> {
    constructor(
        nodes?: T[],
        parent?: T)
    {
        super(nodes, parent);
    }

    public slice(...args) {
        return new ViewList(this.list.slice.apply(this.list, arguments));
    }

    public filter(...args) {
        return new ViewList(this.list.filter.apply(this.list, arguments));
    }

    get anchors() {
        return this.list.filter(node => node.anchored);
    }

    get horizontalBias() {
        if (this.parent != null && this.list.length > 0) {
            const left = this.first.linear.left - this.parent.box.left;
            const right = this.parent.box.right - this.last.linear.right;
            return calculateBias(left, right);
        }
        return 0.5;
    }
    get verticalBias() {
        if (this.parent != null && this.list.length > 0) {
            const top = this.first.linear.top - this.parent.box.top;
            const bottom = this.parent.box.bottom - this.last.linear.bottom;
            return calculateBias(top, bottom);
        }
        return 0.5;
    }
}