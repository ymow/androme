import { NODE_ALIGNMENT } from '../lib/enumeration';

import Extension from '../base/extension';
import Node from '../base/node';
import NodeList from '../base/nodelist';

import { partition, sortAsc, sortDesc } from '../lib/util';

export default abstract class Flexbox<T extends Node> extends Extension<T> {
    public condition(node: T) {
        return node.length > 0 && node.flexElement;
    }

    public processNode(node: T, parent: T): ExtensionResult<T> {
        const controller = this.application.viewController;
        const flex = node.flexbox;
        const [absolute, pageflow] = partition(node.children, item => !item.pageflow);
        let output = '';
        let rowCount = 1;
        if (node.cssTry('display', 'block')) {
            for (const item of pageflow) {
                const bounds = item.element.getBoundingClientRect();
                Object.assign(item.initial.bounds, { width: bounds.width, height: bounds.height });
            }
            node.cssFinally('display');
        }
        if (flex.wrap === 'wrap' || flex.wrap === 'wrap-reverse') {
            const alignTop = pageflow.slice() as T[];
            const mapY = new Map<number, T[]>();
            alignTop.sort((a, b) => {
                if (a.intersectX(b.linear)) {
                    return a.linear.left < b.linear.left ? -1 : 1;
                }
                else {
                    return a.linear.top < b.linear.top ? -1 : 1;
                }
            });
            for (const item of alignTop) {
                const y = Math.round(item.linear.top);
                const items: T[] = mapY.get(y) || [];
                items.push(item);
                mapY.set(y, items);
            }
            if (mapY.size > 0) {
                Array.from(mapY.values()).forEach((segment, index) => {
                    const group = controller.createGroup(node, segment[0], segment);
                    group.siblingIndex = index;
                    const box = group.unsafe('box');
                    box.right = node.box.right;
                    group.alignmentType |= NODE_ALIGNMENT.SEGMENTED;
                });
                node.sort(NodeList.siblingIndex);
                rowCount = mapY.size;
            }
        }
        else {
            if (pageflow.some(item => item.flexbox.order !== 0)) {
                if (flex.direction.indexOf('reverse') !== -1) {
                    sortDesc(node.children, 'flexbox.order');
                }
                else {
                    sortAsc(node.children, 'flexbox.order');
                }
            }
        }
        if (absolute.length > 0 || rowCount === 1) {
            output = this.application.writeConstraintLayout(node, parent);
        }
        else {
            output = this.application.writeLinearLayout(node, parent, false);
        }
        node.alignmentType |= NODE_ALIGNMENT.AUTO_LAYOUT;
        return { output, complete: true };
    }
}