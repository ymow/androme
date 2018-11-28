import { BOX_STANDARD, CSS_STANDARD, NODE_ALIGNMENT } from '../lib/enumeration';

import Extension from '../base/extension';
import Node from '../base/Node';

import { getElementAsNode } from '../lib/dom';
import { flatMap, formatPX } from '../lib/util';

function setMinHeight<T extends Node>(node: T, offset: number) {
    const minHeight = node.has('minHeight', CSS_STANDARD.UNIT) ? node.toInt('minHeight') : 0;
    node.css('minHeight', formatPX(Math.max(offset, minHeight)));
}

export default abstract class WhiteSpace<T extends Node> extends Extension<T> {
    public afterBaseLayout() {
        for (const node of this.application.session.cache) {
            if (node.pageflow && node.styleElement && node.inlineVertical && !node.renderParent.hasAlign(NODE_ALIGNMENT.AUTO_LAYOUT) && !node.alignParent('left')) {
                const previous = node.previousSibling(false);
                if (previous.length && !previous.some(item => item.lineBreak || item.excluded && item.blockStatic)) {
                    const offset = node.linear.left - previous[previous.length - 1].actualRight();
                    if (offset > 0) {
                        (node.renderAs || node).modifyBox(BOX_STANDARD.MARGIN_LEFT, offset);
                    }
                }
            }
        }
        const lineBreak = new Set<T>();
        for (const element of this.application.parseElements) {
            flatMap(Array.from(element.getElementsByTagName('BR')), item => getElementAsNode(item) as T).forEach(node => {
                if (!lineBreak.has(node)) {
                    const actualParent = node.actualParent;
                    const previous = node.previousSibling(false, true, true, true);
                    const next = node.nextSibling(false, true, true, true);
                    let valid = false;
                    if (previous.length && next.length) {
                        if (next[0].lineBreak) {
                            return;
                        }
                        else {
                            valid = true;
                            const bottomStart = previous.pop() as T;
                            const bottomParent = bottomStart.rendered && bottomStart.visible ? bottomStart.renderParent : null;
                            const topEnd = next.pop() as T;
                            const topParent = topEnd.rendered && topEnd.visible ? topEnd.renderParent : null;
                            const offset = topEnd.linear.top - bottomStart.linear.bottom;
                            if (offset > 0) {
                                if (topParent && topParent.groupElement && topParent.firstChild() === topEnd) {
                                    topParent.modifyBox(BOX_STANDARD.MARGIN_TOP, offset);
                                }
                                else if (bottomParent && bottomParent.groupElement && bottomParent.lastChild() === bottomStart) {
                                    bottomParent.modifyBox(BOX_STANDARD.MARGIN_BOTTOM, offset);
                                }
                                else {
                                    if (topParent && topParent.layoutVertical && (topEnd.visible || topEnd.renderAs)) {
                                        (topEnd.renderAs || topEnd).modifyBox(BOX_STANDARD.MARGIN_TOP, offset);
                                    }
                                    else if (bottomParent && bottomParent.layoutVertical && (bottomStart.visible || bottomStart.renderAs)) {
                                        (bottomStart.renderAs || bottomStart).modifyBox(BOX_STANDARD.MARGIN_BOTTOM, offset);
                                    }
                                    else if (!topParent && !bottomParent && actualParent && actualParent.visible) {
                                        if (topEnd.lineBreak || topEnd.excluded) {
                                            actualParent.modifyBox(BOX_STANDARD.PADDING_BOTTOM, offset);
                                        }
                                        else if (bottomStart.lineBreak || bottomStart.excluded) {
                                            actualParent.modifyBox(BOX_STANDARD.PADDING_TOP, offset);
                                        }
                                        else {
                                            valid = false;
                                        }
                                    }
                                    else {
                                        valid = false;
                                    }
                                }
                            }
                        }
                    }
                    else if (actualParent && actualParent.visible) {
                        if (previous.length) {
                            const previousStart = previous[previous.length - 1];
                            const offset = node.linear.bottom - previousStart.linear[previousStart.lineBreak || previousStart.excluded ? 'top' : 'bottom'];
                            if (offset > 0) {
                                if (previousStart.visible) {
                                    actualParent.modifyBox(BOX_STANDARD.PADDING_BOTTOM, offset);
                                }
                                else if (!actualParent.hasHeight) {
                                    setMinHeight(actualParent, offset);
                                }
                            }
                        }
                        else if (next.length) {
                            const nextStart = next[next.length - 1];
                            const offset = nextStart.linear[nextStart.lineBreak || nextStart.excluded ? 'bottom' : 'top'] - node.linear.top;
                            if (offset > 0) {
                                if (nextStart.visible) {
                                    actualParent.modifyBox(BOX_STANDARD.PADDING_TOP, offset);
                                }
                                else if (!actualParent.hasHeight) {
                                    setMinHeight(actualParent, offset);
                                }
                            }
                        }
                        valid = true;
                    }
                    if (valid) {
                        previous.forEach((item: T) => item.lineBreak && lineBreak.add(item));
                        next.forEach((item: T) => item.lineBreak && lineBreak.add(item));
                    }
                }
            });
        }
    }
}