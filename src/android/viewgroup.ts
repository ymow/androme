import View from './view';
import ViewBase from './viewbase';

import $NodeList = androme.lib.base.NodeList;

import $dom = androme.lib.dom;

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

    public init() {
        if (this.length) {
            for (const item of this.children) {
                item.parent = this;
            }
            if (this.parent) {
                this.parent.sort($NodeList.siblingIndex);
            }
            this.initial.children.push(...this.duplicate());
        }
        this.setBounds();
        this.css('direction', this.documentParent.dir);
    }

    get element() {
        function cascade<T extends View>(nodes: T[]): Element | null {
            for (const node of nodes.slice().sort($NodeList.siblingIndex)) {
                if (node.baseElement) {
                    return node.baseElement;
                }
                else if (node.length) {
                    const element = cascade(node.children as T[]);
                    if (element) {
                        return element;
                    }
                }
            }
            return null;
        }
        if ($dom.hasComputedStyle(super.element)) {
            return super.element;
        }
        return cascade(this.children as T[]) || super.element;
    }
}