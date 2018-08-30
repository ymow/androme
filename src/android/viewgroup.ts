import View from './view';
import { includesEnum } from '../lib/util';
import { NODE_ALIGNMENT } from '../lib/constants';

type T = View;

export default class ViewGroup extends View {
    public baseNode: T;

    constructor(
        id: number,
        node: T,
        parent?: T,
        children?: T[],
        element?: HTMLElement)
    {
        super(id, node.api);
        this.baseNode = node;
        if (parent != null) {
            this.parent = parent;
        }
        if (element != null) {
            this.element = element;
        }
        if (children != null) {
            this.children = children;
            this.lateInit();
        }
    }

    public lateInit() {
        super.lateInit();
        const node = this.baseNode;
        this.children.forEach(item => item.parent = this);
        this.documentParent = node.documentParent;
        if (this.hasElement) {
            this.tagName = node.tagName;
            this.inherit(node, 'base', 'style', 'styleMap');
            this.documentRoot = node.documentRoot;
            this.excludeProcedure = node.excludeProcedure;
            this.excludeResource = node.excludeResource;
            this.renderExtension = node.renderExtension;
        }
        else {
            this.tagName = `${node.tagName}_GROUP`;
            this.setBounds();
        }
        if (this.element == null) {
            node.hide();
        }
        this.depth = node.depth;
        this.css('direction', this.documentParent.dir);
    }

    public setLayout() {
        super.setLayout.apply(this, (this.hasElement ? null : this.childrenBox));
    }

    public setBounds(calibrate = false) {
        const nodes = this.outerRegion;
        if (!calibrate) {
            this.bounds = {
                top: nodes.top[0].bounds.top,
                right: nodes.right[0].bounds.right,
                bottom: nodes.bottom[0].bounds.bottom,
                left: nodes.left[0].bounds.left,
                width: 0,
                height: 0
            };
            this.bounds.width = this.bounds.right - this.bounds.left;
            this.bounds.height = this.bounds.bottom - this.bounds.top;
        }
        this.linear = {
            top: nodes.top[0].linear.top,
            right: nodes.right[0].linear.right,
            bottom: nodes.bottom[0].linear.bottom,
            left: nodes.left[0].linear.left,
            width: 0,
            height: 0
        };
        this.box = {
            top: nodes.top[0].box.top,
            right: nodes.right[0].box.right,
            bottom: nodes.bottom[0].box.bottom,
            left: nodes.left[0].box.left,
            width: 0,
            height: 0
        };
        this.setDimensions();
    }

    get pageflow() {
        return (this.element != null ? super.pageflow : this.children.some(node => node.pageflow));
    }

    get display() {
        return (this.children.some(node => node.block && !node.floating) ? 'block' : (this.children.every(node => node.inline) ? 'inline' : 'inline-block'));
    }

    get inlineElement() {
        return includesEnum(this.alignmentType, NODE_ALIGNMENT.SEGMENTED);
    }

    get childrenBox() {
        let minLeft = Number.MAX_VALUE;
        let maxRight = 0;
        let minTop = Number.MAX_VALUE;
        let maxBottom = 0;
        for (const node of this.children) {
            minLeft = Math.min(node.linear.left, minLeft);
            maxRight = Math.max(node.linear.right, maxRight);
            minTop = Math.min(node.linear.top, minTop);
            maxBottom = Math.max(node.linear.bottom, maxBottom);
        }
        return [maxRight - minLeft, maxBottom - minTop];
    }

    get outerRegion() {
        let top: T[] = [];
        let right: T[] = [];
        let bottom: T[] = [];
        let left: T[] = [];
        this.each((node: T, index: number) => {
            if (index === 0) {
                top.push(node);
                right.push(node);
                bottom.push(node);
                left.push(node);
            }
            else {
                if (top[0].linear.top === node.linear.top) {
                    top.push(node);
                }
                else if (node.linear.top < top[0].linear.top) {
                    top = [node];
                }
                if (right[0].linear.right === node.linear.right) {
                    right.push(node);
                }
                else if (node.linear.right > right[0].linear.right) {
                    right = [node];
                }
                if (bottom[0].linear.bottom === node.linear.bottom) {
                    bottom.push(node);
                }
                else if (node.linear.bottom > bottom[0].linear.bottom) {
                    bottom = [node];
                }
                if (left[0].linear.left === node.linear.left) {
                    left.push(node);
                }
                else if (node.linear.left < left[0].linear.left) {
                    left = [node];
                }
            }
        });
        return { top, right, bottom, left };
    }

    get previousSibling() {
        return (this.children.length > 0 ? this.children[0].previousSibling : null);
    }

    get nextSibling() {
        return (this.children.length > 0 ? this.children[this.children.length - 1].nextSibling : null);
    }
}