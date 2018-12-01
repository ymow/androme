import { BOX_STANDARD, CSS_STANDARD } from '../lib/enumeration';

import Extension from '../base/extension';
import Node from '../base/node';
import NodeList from '../base/nodelist';

import { formatPX, maxArray } from '../lib/util';

export default abstract class Origin<T extends Node> extends Extension<T> {
    public afterInit() {
        function modifyMarginLeft(node: T, offset: number, parent = false) {
            node.bounds.left -= offset;
            node.bounds.width += Math.max(node.marginLeft < 0 ? node.marginLeft + offset : offset, 0);
            node.css('marginLeft', formatPX(node.marginLeft + (offset * (parent ? -1 : 1))), true);
            node.setBounds(true);
        }
        for (const node of this.application.processing.cache.elements) {
            const outside = node.some((item, index) => {
                if (item.pageFlow) {
                    return (
                        item.float !== 'right' &&
                        item.marginLeft < 0 &&
                        node.marginLeft >= Math.abs(item.marginLeft) &&
                        (Math.abs(item.marginLeft) >= item.bounds.width || node.documentRoot)
                    );
                }
                else {
                    const left = item.toInt('left');
                    const right = item.toInt('right');
                    return (
                        left < 0 && (index === 0 && node.marginLeft > 0 || node.marginLeft >= Math.abs(left)) ||
                        right < 0 && Math.abs(right) >= item.bounds.width
                    );
                }
            });
            if (outside) {
                const marginLeft: number[] = [];
                const marginRight: T[] = [];
                node.each((item: T, index) => {
                    let leftType = 0;
                    if (item.pageFlow) {
                        const left = item.marginLeft;
                        if (left < 0 && node.marginLeft >= Math.abs(left)) {
                            leftType = 1;
                        }
                    }
                    else {
                        const left = (item.left || 0) + item.marginLeft;
                        const right = item.right || 0;
                        if (left < 0) {
                            if (index === 0 || node.marginLeft >= Math.abs(left)) {
                                leftType = 2;
                            }
                        }
                        else if (right < 0) {
                            if (Math.abs(right) >= item.bounds.width) {
                                marginRight.push(item);
                            }
                        }
                    }
                    marginLeft.push(leftType);
                });
                if (marginRight.length) {
                    const [sectionLeft, sectionRight] = node.partition((item: T) => !marginRight.includes(item));
                    if (sectionLeft.length && sectionRight.length) {
                        if (node.style.marginLeft && node.autoMargin.left) {
                            node.css('marginLeft', node.style.marginLeft, true);
                        }
                        node.modifyBox(BOX_STANDARD.MARGIN_RIGHT, null);
                        const widthLeft = node.has('width', CSS_STANDARD.UNIT) ? node.toInt('width') : maxArray(sectionRight.map(item => item.bounds.width));
                        const widthRight = maxArray(sectionRight.map(item => Math.abs(item.toInt('right'))));
                        sectionLeft.forEach(item => item.pageFlow && !item.hasWidth && item.css(item.textElement ? 'maxWidth' : 'width', formatPX(widthLeft)));
                        node.css('width', formatPX(widthLeft + widthRight), true);
                    }
                }
                const marginLeftType = maxArray(marginLeft);
                if (marginLeftType > 0) {
                    const rows = NodeList.partitionRows(node.children.filter(item => item.pageFlow));
                    const columnStart: T[] = [];
                    rows.forEach((list: T[]) => {
                        columnStart.push(list[0]);
                        for (let i = 1; i < list.length; i++) {
                            if (list[i].multiLine) {
                                columnStart.push(list[i]);
                            }
                        }
                    });
                    node.each((item: T, index) => {
                        if (marginLeft[index] === 2) {
                            const left = item.toInt('left') + node.marginLeft;
                            item.css('left', formatPX(Math.max(left, 0)));
                            if (left < 0) {
                                item.css('marginLeft', formatPX(item.marginLeft + left), true);
                                modifyMarginLeft(item, left);
                            }
                        }
                        else if (columnStart.includes(item) && (marginLeftType === 2 || (item.pageFlow && !item.plainText && marginLeft.includes(1)))) {
                            modifyMarginLeft(item, node.marginLeft);
                        }
                    });
                    if (node.has('width', CSS_STANDARD.UNIT)) {
                        node.css('width', formatPX(node.toInt('width') + node.marginLeft), true);
                    }
                    modifyMarginLeft(node, node.marginLeft, true);
                }
            }
        }
    }
}