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
        const rowDirection = flex.direction.indexOf('row') !== -1;
        const [pageflow, absolute] = partition(node.children as T[], item => item.pageflow);
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
            function setFlexDirection(align: string, sort: string, size: string) {
                const map = new Map<number, T[]>();
                pageflow.sort((a, b) => {
                    if (a.linear[align] < b.linear[align]) {
                        return a.linear[align] < b.linear[align] ? -1 : 1;
                    }
                    else {
                        return a.linear[sort] < b.linear[sort] ? -1 : 1;
                    }
                });
                for (const item of pageflow) {
                    const xy = Math.round(item.linear[align]);
                    const items: T[] = map.get(xy) || [];
                    items.push(item);
                    map.set(xy, items);
                }
                if (map.size > 0) {
                    Array.from(map.values()).forEach((segment, index) => {
                        const group = controller.createGroup(node, segment[0], segment);
                        group.siblingIndex = index;
                        const box = group.unsafe('box');
                        if (box) {
                            box[size] = node.box[size];
                        }
                        group.alignmentType |= NODE_ALIGNMENT.SEGMENTED;
                    });
                    node.sort(NodeList.siblingIndex);
                    rowCount = map.size;
                }
            }
            if (rowDirection) {
                setFlexDirection('top', 'left', 'right');
            }
            else {
                setFlexDirection('left', 'top', 'bottom');
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
            output = this.application.writeLinearLayout(node, parent, !rowDirection);
        }
        node.alignmentType |= NODE_ALIGNMENT.AUTO_LAYOUT;
        return { output, complete: true };
    }
}