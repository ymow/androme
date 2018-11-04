import { NODE_ALIGNMENT, NODE_STANDARD } from '../lib/enumeration';

import Node from './node';
import NodeList from './nodelist';

import { assignBounds, newClientRect } from '../lib/dom';

export default abstract class NodeGroup<T extends Node> extends Node {
    public init() {
        super.init();
        if (this.length > 0) {
            for (const item of this) {
                this.siblingIndex = Math.min(this.siblingIndex, item.siblingIndex);
                item.parent = this;
            }
            this.parent.sort(NodeList.siblingIndex);
            this.initial.children.push(...this.duplicate());
        }
        this.setBounds();
        this.css('direction', this.documentParent.dir);
    }

    public setBounds(calibrate = false) {
        if (!calibrate) {
            if (this.length > 0) {
                const nodes = NodeList.outerRegion(this.list);
                this.bounds = {
                    top: nodes.top[0].linear.top,
                    right: nodes.right[0].linear.right,
                    bottom: nodes.bottom[0].linear.bottom,
                    left: nodes.left[0].linear.left,
                    width: 0,
                    height: 0
                };
            }
            else {
                this.bounds = newClientRect();
            }
            this.bounds.width = this.bounds.right - this.bounds.left;
            this.bounds.height = this.bounds.bottom - this.bounds.top;
        }
        this.linear = assignBounds(this.bounds);
        this.box = assignBounds(this.bounds);
        this.setDimensions();
    }

    public previousSibling(pageflow = false, lineBreak = true, excluded = true) {
        const node = this.item(0);
        return node ? node.previousSibling(pageflow, lineBreak, excluded) : undefined;
    }

    public nextSibling(pageflow = false, lineBreak = true, excluded = true) {
        const node = this.item(0);
        return node ? node.nextSibling(pageflow, lineBreak, excluded) : undefined;
    }

    get inline() {
        return this.every(node => node.inline);
    }

    get pageflow() {
        return this.every(node => node.pageflow);
    }

    get siblingflow() {
        return this.every(node => node.siblingflow);
    }

    get inlineElement() {
        return this.hasAlign(NODE_ALIGNMENT.SEGMENTED);
    }

    get inlineStatic() {
        return this.every(node => node.inlineStatic);
    }

    get blockStatic() {
        return this.every(node => node.blockStatic);
    }

    get floating() {
        return this.hasAlign(NODE_ALIGNMENT.FLOAT);
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
        return this.some(node => node.multiLine);
    }

    get display() {
        return this.css('display') || (this.every(node => node.blockStatic) || this.of(NODE_STANDARD.CONSTRAINT, NODE_ALIGNMENT.PERCENT) ? 'block' : this.every(node => node.inline) ? 'inline' : 'inline-block');
    }

    get baseElement() {
        function cascade(nodes: T[]): Element | undefined {
            for (const node of nodes) {
                if (node.domElement) {
                    return node.element;
                }
                else if (node.length > 0) {
                    const element = cascade(node.nodes as T[]);
                    if (element) {
                        return element;
                    }
                }
            }
            return undefined;
        }
        return cascade(this.nodes as T[]) || super.baseElement;
    }
}