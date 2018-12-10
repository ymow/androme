import View from './view';
import ViewBase from './viewbase';

export default class ViewGroup<T extends View> extends ViewBase(androme.lib.base.NodeGroup) {
    constructor(
        id: number,
        node: T,
        children: T[],
        afterInit?: SelfWrapped<T, void>)
    {
        super(id, undefined, afterInit);
        this.tagName = `${node.tagName}_GROUP`;
        this.documentParent = node.documentParent;
        this.retain(children);
    }
}