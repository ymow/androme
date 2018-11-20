import { EXT_NAME } from '../lib/constant';
import { NODE_ALIGNMENT } from '../lib/enumeration';

import Extension from '../base/extension';
import Node from '../base/node';
import NodeList from '../base/nodelist';

import { partition, sortAsc, sortDesc } from '../lib/util';

export default abstract class Flexbox<T extends Node> extends Extension<T> {
    public static createDataAttribute<T extends Node>(children: T[]): FlexboxData<T> {
        return {
            wrap: false,
            wrapReverse: false,
            directionReverse: false,
            justifyContent: '',
            rowDirection: false,
            rowCount: 0,
            columnDirection: false,
            columnCount: 0,
            children
        };
    }

    public condition(node: T) {
        return node.length > 0 && node.flexElement;
    }

    public processNode(node: T, parent: T): ExtensionResult<T> {
        const controller = this.application.viewController;
        const [pageflow, absolute] = partition(node.children as T[], item => item.pageflow);
        const flex = node.flexbox;
        const mainData = Object.assign(Flexbox.createDataAttribute(pageflow), {
            wrap: flex.wrap.startsWith('wrap'),
            wrapReverse: flex.wrap === 'wrap-reverse',
            directionReverse: flex.direction.endsWith('reverse'),
            justifyContent: flex.justifyContent,
            rowDirection: flex.direction.startsWith('row'),
            columnDirection: flex.direction.startsWith('column')
        });
        if (node.cssTry('display', 'block')) {
            for (const item of pageflow) {
                const bounds = item.element.getBoundingClientRect();
                Object.assign(item.initial.bounds, { width: bounds.width, height: bounds.height });
            }
            node.cssFinally('display');
        }
        if (mainData.wrap) {
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
                    let maxCount = 0;
                    Array.from(map.values()).forEach((segment, index) => {
                        const group = controller.createGroup(node, segment[0], segment);
                        group.siblingIndex = index;
                        const box = group.unsafe('box');
                        if (box) {
                            box[size] = node.box[size];
                        }
                        group.alignmentType |= NODE_ALIGNMENT.SEGMENTED;
                        maxCount = Math.max(segment.length, maxCount);
                    });
                    node.sort(NodeList.siblingIndex);
                    if (mainData.rowDirection) {
                        mainData.rowCount = map.size;
                        mainData.columnCount = maxCount;
                    }
                    else {
                        mainData.rowCount = maxCount;
                        mainData.columnCount = map.size;
                    }
                }
            }
            if (mainData.rowDirection) {
                setFlexDirection(mainData.wrapReverse ? 'bottom' : 'top', 'left', 'right');
            }
            else {
                setFlexDirection('left', 'top', 'bottom');
            }
        }
        else {
            if (pageflow.some(item => item.flexbox.order !== 0)) {
                if (mainData.directionReverse) {
                    sortDesc(node.children, 'flexbox.order');
                }
                else {
                    sortAsc(node.children, 'flexbox.order');
                }
            }
            if (mainData.rowDirection) {
                mainData.rowCount = 1;
                mainData.columnCount = node.children.length;
            }
            else {
                mainData.rowCount = node.children.length;
                mainData.columnCount = 1;
            }
        }
        let output = '';
        if (absolute.length > 0 || (mainData.rowDirection && (mainData.rowCount === 1 || node.hasHeight)) || (mainData.columnDirection && mainData.columnCount === 1)) {
            output = this.application.writeConstraintLayout(node, parent);
        }
        else {
            output = this.application.writeLinearLayout(node, parent, mainData.columnDirection);
        }
        node.data(EXT_NAME.FLEXBOX, 'mainData', mainData);
        node.alignmentType |= NODE_ALIGNMENT.AUTO_LAYOUT;
        return { output, complete: true };
    }
}