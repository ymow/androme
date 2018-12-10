import { NODE_ALIGNMENT } from '../lib/enumeration';

import Node from './node';
import NodeList from './nodelist';

export default abstract class NodeGroup extends Node {
    public init() {
        if (this.length) {
            for (const item of this.children) {
                item.parent = this;
            }
            if (this.parent) {
                this.parent.sort(NodeList.siblingIndex);
            }
            this.initial.children.push(...this.duplicate());
        }
        this.setBounds();
        this.css('direction', this.documentParent.dir);
    }

    public setBounds(calibrate = false) {
        if (!calibrate) {
            if (this.length) {
                const bounds = this.outerRegion;
                this._bounds = Object.assign({ width: bounds.right - bounds.left, height: bounds.bottom - bounds.top }, bounds);
            }
        }
    }

    public previousSiblings(lineBreak = true, excluded = true, visible = false) {
        const node = this.item(0);
        return node ? node.previousSiblings(lineBreak, excluded, visible) : [];
    }

    public nextSiblings(lineBreak = true, excluded = true, visible = false) {
        const node = this.item();
        return node ? node.nextSiblings(lineBreak, excluded, visible) : [];
    }

    public firstChild() {
        const actualParent = NodeList.actualParent(this.initial.children);
        if (actualParent) {
            return super.firstChild(<HTMLElement> actualParent.element);
        }
        else if (this.initial.children.length) {
            return this.initial.children.slice().sort(NodeList.siblingIndex)[0];
        }
        return undefined;
    }

    public lastChild() {
        const actualParent = NodeList.actualParent(this.initial.children);
        if (actualParent) {
            return super.lastChild(<HTMLElement> actualParent.element);
        }
        else if (this.initial.children.length) {
            return this.initial.children.slice().sort(NodeList.siblingIndex)[this.initial.children.length - 1];
        }
        return undefined;
    }

    get inline() {
        return this.every(node => node.inline);
    }

    get pageFlow() {
        return this.every(node => node.pageFlow);
    }

    get inlineFlow() {
        return this.inlineStatic || this.hasAlign(NODE_ALIGNMENT.SEGMENTED);
    }

    get inlineStatic() {
        return this.every(node => node.inlineStatic);
    }

    get inlineVertical() {
        return this.every(node => node.inlineVertical);
    }

    get block() {
        return this.some(node => node.block);
    }

    get blockStatic() {
        return this.some(node => node.blockStatic);
    }

    get blockDimension() {
        return this.some(node => node.blockDimension);
    }

    get floating() {
        return this.every(node => node.floating);
    }

    get float() {
        if (this.floating) {
            return this.hasAlign(NODE_ALIGNMENT.RIGHT) ? 'right' : 'left';
        }
        return 'none';
    }

    get baseline() {
        const value = this.cssInitial('verticalAlign', true);
        return value !== '' ? value === 'baseline' : this.every(node => node.baseline);
    }

    get multiLine() {
        return this.children.reduce((a, b) => a + b.multiLine, 0);
    }

    get display() {
        return (
            this.css('display') ||
            this.some(node => node.block) ? 'block' : (this.some(node => node.blockDimension) ? 'inline-block' : 'inline')
        );
    }

    get element() {
        const children = this.cascade(true);
        return children.length ? children[0].element : super.element;
    }

    get groupParent() {
        return true;
    }

    private get outerRegion(): BoxRect {
        const nodes = this.children.slice();
        let top = nodes[0];
        let right = top;
        let bottom = top;
        let left = top;
        this.each(node => node.companion && !node.companion.visible && nodes.push(node.companion));
        for (let i = 1; i < nodes.length; i++) {
            const node = nodes[i];
            if (node.linear.top < top.linear.top) {
                top = node;
            }
            if (node.linear.right > right.linear.right) {
                right = node;
            }
            if (node.linear.bottom > bottom.linear.bottom) {
                bottom = node;
            }
            if (node.linear.left < left.linear.left) {
                left = node;
            }
        }
        return {
            top: top.linear.top,
            right: right.linear.right,
            bottom: bottom.linear.bottom,
            left: left.linear.left
        };
    }
}