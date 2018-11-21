import { BOX_STANDARD, CSS_STANDARD } from '../lib/enumeration';

import Extension from '../base/extension';
import Node from '../base/node';

import { formatPX, partition } from '../lib/util';

export default abstract class Origin<T extends Node> extends Extension<T> {
    public afterInit() {
        function modifyMarginLeft(node: T, offset: number, parent = false) {
            node.bounds.left -= offset;
            node.bounds.width += Math.max(node.marginLeft < 0 ? node.marginLeft + offset : offset, 0);
            node.css('marginLeft', formatPX(node.marginLeft + (offset * (parent ? -1 : 1))));
            node.setBounds(true);
        }
        for (const node of this.application.processing.cache.elements) {
            const outside = node.some(current => {
                if (current.pageflow) {
                    return (
                        current.float !== 'right' &&
                        current.marginLeft < 0 &&
                        node.marginLeft >= Math.abs(current.marginLeft) &&
                        (Math.abs(current.marginLeft) >= current.bounds.width || node.documentRoot)
                    );
                }
                else {
                    const left = current.toInt('left');
                    const right = current.toInt('right');
                    return (left < 0 && node.marginLeft >= Math.abs(left)) || (right < 0 && Math.abs(right) >= current.bounds.width);
                }
            });
            if (outside) {
                const marginLeft: number[] = [];
                const marginRight: T[] = [];
                for (const current of node) {
                    let leftType = 0;
                    if (current.pageflow) {
                        const left = current.marginLeft;
                        if (left < 0 && node.marginLeft >= Math.abs(left)) {
                            leftType = 1;
                        }
                    }
                    else {
                        const left = (current.left || 0) + current.marginLeft;
                        const right = current.right || 0;
                        if (left < 0) {
                            if (node.marginLeft >= Math.abs(left)) {
                                leftType = 2;
                            }
                        }
                        else if (right < 0) {
                            if (Math.abs(right) >= current.bounds.width) {
                                marginRight.push(current as T);
                            }
                        }
                    }
                    marginLeft.push(leftType);
                }
                if (marginRight.length) {
                    const [sectionLeft, sectionRight] = partition(node.children, (item: T) => !marginRight.includes(item));
                    if (sectionLeft.length && sectionRight.length) {
                        if (node.style.marginLeft && node.autoMarginLeft) {
                            node.css('marginLeft', node.style.marginLeft);
                        }
                        node.modifyBox(BOX_STANDARD.MARGIN_RIGHT, null);
                        const widthLeft: number = node.has('width', CSS_STANDARD.UNIT) ? node.toInt('width') : Math.max.apply(null, sectionRight.map(item => item.bounds.width));
                        const widthRight: number = Math.max.apply(null, sectionRight.map(item => Math.abs(item.toInt('right'))));
                        sectionLeft.forEach(item => item.pageflow && !item.hasWidth && item.css(item.textElement ? 'maxWidth' : 'width', formatPX(widthLeft)));
                        node.css('width', formatPX(widthLeft + widthRight));
                    }
                }
                const marginLeftType: number = Math.max.apply(null, marginLeft);
                if (marginLeftType > 0) {
                    node.each((current: T, index) => {
                        if (marginLeft[index] === 2) {
                            const left = current.toInt('left') + node.marginLeft;
                            current.css('left', formatPX(Math.max(left, 0)));
                            if (left < 0) {
                                current.css('marginLeft', formatPX(current.marginLeft + left));
                                modifyMarginLeft(current, left);
                            }
                        }
                        else if (marginLeftType === 2 || (current.pageflow && !current.plainText && marginLeft.includes(1))) {
                            modifyMarginLeft(current, node.marginLeft);
                        }
                    });
                    if (node.has('width', CSS_STANDARD.UNIT)) {
                        node.css('width', formatPX(node.toInt('width') + node.marginLeft));
                    }
                    modifyMarginLeft(node, node.marginLeft, true);
                }
            }
        }
    }
}