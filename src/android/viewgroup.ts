import View from './view';
import ViewBase from './viewbase';

export default class ViewGroup<T extends View> extends ViewBase(androme.lib.base.NodeGroup) {
    constructor(
        id: number,
        node: T,
        parent: T,
        children: T[],
        afterInit?: SelfWrapped<T, void>)
    {
        super(id, undefined, afterInit);
        parent.replaceNode(node, this);
        this.tagName = `${node.tagName}_GROUP`;
        this.documentParent = node.documentParent;
        this.replace(children);
        if (children.length) {
            this.init();
        }
    }
}