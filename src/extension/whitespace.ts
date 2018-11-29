import { BOX_STANDARD, CSS_STANDARD, NODE_ALIGNMENT } from '../lib/enumeration';

import Extension from '../base/extension';
import Node from '../base/Node';

import { getElementAsNode, getFirstChildElement, getLastChildElement } from '../lib/dom';
import { convertInt, flatMap, formatPX } from '../lib/util';

function setMinHeight<T extends Node>(node: T, offset: number) {
    const minHeight = node.has('minHeight', CSS_STANDARD.UNIT) ? node.toInt('minHeight') : 0;
    node.css('minHeight', formatPX(Math.max(offset, minHeight)));
}

export default abstract class WhiteSpace<T extends Node> extends Extension<T> {
    public afterConstraints() {
        for (const node of this.application.session.cache) {
            if (node.pageFlow) {
                if (!node.renderParent.hasAlign(NODE_ALIGNMENT.AUTO_LAYOUT) && !node.alignParent('left') && node.styleElement && node.inlineVertical) {
                    const previous: T[] = [];
                    let current = node;
                    while (true) {
                        previous.push(...current.previousSiblings() as T[]);
                        if (previous.length && !previous.some(item => item.lineBreak || item.excluded && item.blockStatic)) {
                            const previousSibling = previous[previous.length - 1];
                            if (previousSibling.inlineVertical) {
                                const offset = node.linear.left - previous[previous.length - 1].actualRight();
                                if (offset > 0) {
                                    (node.renderAs || node).modifyBox(BOX_STANDARD.MARGIN_LEFT, offset);
                                }
                            }
                            else if (previousSibling.floating) {
                                previous.length = 0;
                                current = previousSibling;
                                continue;
                            }
                        }
                        break;
                    }
                }
                if (node.htmlElement && node.blockStatic && node.length > 0) {
                    const applyMarginCollapse = (direction: string, element: Element | null) => {
                        const adjacent = getElementAsNode<T>(element);
                        if (adjacent && !adjacent.lineBreak && (node === adjacent || adjacent === node.renderChildren[direction === 'Top' ? 0 : node.renderChildren.length - 1])) {
                            const offset = node[`margin${direction}`];
                            if (offset > 0 && node[`padding${direction}`] === 0 && node[`border${direction}Width`] === 0) {
                                adjacent.modifyBox(BOX_STANDARD[`MARGIN_${direction.toUpperCase()}`], null);
                            }
                        }
                    };
                    applyMarginCollapse('Top', getFirstChildElement(node.element));
                    applyMarginCollapse('Bottom', getLastChildElement(node.element));
                    for (let i = 0; i < node.element.children.length; i++) {
                        const element = node.element.children[i];
                        const sibling = getElementAsNode<T>(element);
                        if (sibling && sibling.pageFlow && sibling.blockStatic && !sibling.lineBreak) {
                            const previousSiblings = sibling.previousSiblings();
                            if (previousSiblings.length === 1 && !previousSiblings.some(item => item.lineBreak || item.excluded)) {
                                const previous = previousSiblings[0];
                                const marginTop = convertInt(sibling.cssInitial('marginTop', true));
                                const marginBottom = convertInt(previous.cssInitial('marginBottom', true));
                                if (marginBottom > 0 && marginTop > 0) {
                                    if (marginTop <= marginBottom) {
                                        sibling.modifyBox(BOX_STANDARD.MARGIN_TOP, null);
                                    }
                                    else {
                                        previous.modifyBox(BOX_STANDARD.MARGIN_BOTTOM, null);
                                    }
                                }
                            }
                            [element.previousElementSibling, element.nextElementSibling].forEach((item, index) => {
                                const adjacent = getElementAsNode<T>(item);
                                if (adjacent && adjacent.excluded) {
                                    const offset = Math.min(adjacent.marginTop, adjacent.marginBottom);
                                    if (offset < 0) {
                                        if (index === 0) {
                                            node.modifyBox(BOX_STANDARD.MARGIN_TOP, offset);
                                        }
                                        else {
                                            node.modifyBox(BOX_STANDARD.MARGIN_BOTTOM, offset);
                                        }
                                    }
                                }
                            });
                        }
                    }
                }
            }
        }
        const lineBreak = new Set<T>();
        for (const element of this.application.parseElements) {
            flatMap(Array.from(element.getElementsByTagName('BR')), item => getElementAsNode(item) as T).forEach(node => {
                if (!lineBreak.has(node)) {
                    const actualParent = node.actualParent;
                    const previousSiblings = node.previousSiblings(true, true, true);
                    const nextSiblings = node.nextSiblings(true, true, true);
                    let valid = false;
                    if (previousSiblings.length && nextSiblings.length) {
                        if (nextSiblings[0].lineBreak) {
                            return;
                        }
                        else {
                            valid = true;
                            const bottomStart = previousSiblings.pop() as T;
                            const bottomParent = bottomStart.rendered && bottomStart.visible ? bottomStart.renderParent : null;
                            const topEnd = nextSiblings.pop() as T;
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
                        if (!actualParent.documentRoot && previousSiblings.length) {
                            const previousStart = previousSiblings[previousSiblings.length - 1];
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
                        else if (nextSiblings.length) {
                            const nextStart = nextSiblings[nextSiblings.length - 1];
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
                        previousSiblings.forEach((item: T) => item.lineBreak && lineBreak.add(item));
                        nextSiblings.forEach((item: T) => item.lineBreak && lineBreak.add(item));
                    }
                }
            });
        }
    }
}