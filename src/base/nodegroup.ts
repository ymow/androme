import { NODE_ALIGNMENT } from '../lib/enumeration';

import Node from './node';
import NodeList from './nodelist';

import { assignBounds, newRectDimensions } from '../lib/dom';

export default abstract class NodeGroup extends Node {
    public static outerRegion<T extends Node>(list: T[], dimension = 'linear') {
        let top: T[] = [];
        let right: T[] = [];
        let bottom: T[] = [];
        let left: T[] = [];
        const nodes = list.slice();
        list.forEach(node => node.companion && nodes.push(node.companion as T));
        for (let i = 0; i < nodes.length; i++) {
            const node = nodes[i];
            if (i === 0) {
                top.push(node);
                right.push(node);
                bottom.push(node);
                left.push(node);
            }
            else {
                if (top[0][dimension].top === node[dimension].top) {
                    top.push(node);
                }
                else if (node[dimension].top < top[0][dimension].top) {
                    top = [node];
                }
                if (right[0][dimension].right === node[dimension].right) {
                    right.push(node);
                }
                else if (node[dimension].right > right[0][dimension].right) {
                    right = [node];
                }
                if (bottom[0][dimension].bottom === node[dimension].bottom) {
                    bottom.push(node);
                }
                else if (node[dimension].bottom > bottom[0][dimension].bottom) {
                    bottom = [node];
                }
                if (left[0][dimension].left === node[dimension].left) {
                    left.push(node);
                }
                else if (node[dimension].left < left[0][dimension].left) {
                    left = [node];
                }
            }
        }
        return { top, right, bottom, left };
    }

    public setBounds(calibrate = false) {
        if (!calibrate) {
            if (this.length) {
                const nodes = NodeGroup.outerRegion(this.children);
                this._bounds = {
                    top: nodes.top[0].linear.top,
                    right: nodes.right[0].linear.right,
                    bottom: nodes.bottom[0].linear.bottom,
                    left: nodes.left[0].linear.left,
                    width: 0,
                    height: 0
                };
            }
            else {
                this._bounds = newRectDimensions();
            }
            this.bounds.width = this.bounds.right - this.bounds.left;
            this.bounds.height = this.bounds.bottom - this.bounds.top;
        }
        this._linear = assignBounds(this.bounds);
        this.setDimensions('linear');
        this._box = assignBounds(this.bounds);
        this.setDimensions('box');
    }

    public previousSiblings(lineBreak = true, excluded = true, visible = false) {
        const node = this.item(0);
        return node ? node.previousSiblings(lineBreak, excluded, visible) : [];
    }

    public nextSiblings(lineBreak = true, excluded = true, visible = false) {
        const node = this.item();
        return node ? node.nextSiblings(lineBreak, excluded, visible) : [];
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

    get blockStatic() {
        return this.some(node => node.blockStatic);
    }

    get blockDimension() {
        return this.some(node => node.blockDimension);
    }

    get floating() {
        return this.hasAlign(NODE_ALIGNMENT.FLOAT) || this.some(node => node.floating);
    }

    get float() {
        if (this.floating) {
            return this.hasAlign(NODE_ALIGNMENT.RIGHT) ? 'right' : 'left';
        }
        return 'none';
    }

    get baseline() {
        return this.every(node => node.baseline);
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

    get baseElement() {
        return undefined;
    }

    get actualBoxParent() {
        return NodeList.actualParent(this.cascade(true)) || this;
    }

    public firstChild() {
        const actualParent = NodeList.actualParent(this.initial.children);
        if (actualParent) {
            return super.firstChild(<HTMLElement> actualParent.element);
        }
        else if (this.initial.children.length > 0) {
            return this.initial.children.slice().sort(NodeList.siblingIndex)[0];
        }
        return null;
    }

    public lastChild() {
        const actualParent = NodeList.actualParent(this.initial.children);
        if (actualParent) {
            return super.lastChild(<HTMLElement> actualParent.element);
        }
        else if (this.initial.children.length > 0) {
            return this.initial.children.slice().sort(NodeList.siblingIndex)[this.initial.children.length - 1];
        }
        return null;
    }
}