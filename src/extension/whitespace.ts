import { BOX_STANDARD, CSS_STANDARD, NODE_ALIGNMENT } from '../lib/enumeration';

import Extension from '../base/extension';
import Node from '../base/Node';

import { getElementAsNode } from '../lib/dom';
import { convertInt, flatMap, formatPX } from '../lib/util';

function setMinHeight<T extends Node>(node: T, offset: number) {
    const minHeight = node.has('minHeight', CSS_STANDARD.UNIT) ? node.toInt('minHeight') : 0;
    node.css('minHeight', formatPX(Math.max(offset, minHeight)));
}

function applyMarginCollapse<T extends Node>(parent: T, node: T, direction: string) {
    if (!node.lineBreak && !node.plainText && node === parent.renderChildren[direction === 'Top' ? 0 : parent.renderChildren.length - 1]) {
        if (parent[`margin${direction}`] > 0 && parent[`padding${direction}`] === 0 && parent[`border${direction}Width`] === 0) {
            node.modifyBox(direction === 'Top' ? BOX_STANDARD.MARGIN_TOP : BOX_STANDARD.MARGIN_BOTTOM, null);
        }
    }
}

export default abstract class WhiteSpace<T extends Node> extends Extension<T> {
    public afterBaseLayout() {
        const processed = new Set<T>();
        for (const node of this.application.session.cache) {
            if (node.htmlElement && node.blockStatic) {
                let firstChild: T | undefined;
                let lastChild: T | undefined;
                for (let i = 0; i < node.element.children.length; i++) {
                    const element = node.element.children[i];
                    let current = getElementAsNode<T>(element);
                    if (current && current.pageFlow) {
                        if (firstChild === undefined) {
                            firstChild = current;
                        }
                        lastChild = current;
                        if (!current.lineBreak && current.blockStatic) {
                            const previousSiblings = current.previousSiblings();
                            if (previousSiblings.length) {
                                let previous = previousSiblings[0];
                                if (previous.blockStatic && !previous.lineBreak) {
                                    current = current.renderAs as T || current;
                                    previous = previous.renderAs as T || previous;
                                    if (previous.excluded && !current.excluded) {
                                        const offset = Math.min(previous.marginTop, previous.marginBottom);
                                        if (offset < 0) {
                                            const marginTop = convertInt(current.cssInitial('marginTop', false, true));
                                            if (Math.abs(offset) >= marginTop) {
                                                current.modifyBox(BOX_STANDARD.MARGIN_TOP, null);
                                            }
                                            else {
                                                current.modifyBox(BOX_STANDARD.MARGIN_TOP, offset);
                                            }
                                            processed.add(previous as T);
                                        }
                                    }
                                    else if (!previous.excluded && current.excluded) {
                                        const offset = Math.min(current.marginTop, current.marginBottom);
                                        if (offset < 0) {
                                            const marginBottom = convertInt(previous.cssInitial('marginBottom', false, true));
                                            if (Math.abs(offset) >= marginBottom) {
                                                previous.modifyBox(BOX_STANDARD.MARGIN_BOTTOM, null);
                                            }
                                            else {
                                                previous.modifyBox(BOX_STANDARD.MARGIN_BOTTOM, offset);
                                            }
                                            processed.add(current as T);
                                        }
                                    }
                                    else {
                                        const marginTop = convertInt(current.cssInitial('marginTop', false, true));
                                        const marginBottom = convertInt(previous.cssInitial('marginBottom', false, true));
                                        if (marginBottom > 0 && marginTop > 0) {
                                            if (marginTop <= marginBottom) {
                                                current.modifyBox(BOX_STANDARD.MARGIN_TOP, null);
                                            }
                                            else {
                                                previous.modifyBox(BOX_STANDARD.MARGIN_BOTTOM, null);
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
                if (firstChild) {
                    applyMarginCollapse(node, firstChild, 'Top');
                }
                if (lastChild) {
                    applyMarginCollapse(node, lastChild, 'Bottom');
                }
            }
        }
        for (const element of this.application.parseElements) {
            flatMap(Array.from(element.getElementsByTagName('BR')), item => getElementAsNode(item) as T).forEach(node => {
                if (!processed.has(node)) {
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
                            const topEnd = nextSiblings.pop() as T;
                            if (bottomStart.inlineStatic && topEnd.inlineStatic && previousSiblings.length === 0) {
                                processed.add(node);
                                return;
                            }
                            let bottom: number;
                            let top: number;
                            if (bottomStart.lineHeight > 0 && bottomStart.cssTry('lineHeight', '0px')) {
                                bottom = bottomStart.element.getBoundingClientRect().bottom + bottomStart.marginBottom;
                                bottomStart.cssFinally('lineHeight');
                            }
                            else {
                                bottom = bottomStart.linear.bottom;
                            }
                            if (topEnd.lineHeight > 0 && topEnd.cssTry('lineHeight', '0px')) {
                                top = topEnd.element.getBoundingClientRect().top - topEnd.marginTop;
                                topEnd.cssFinally('lineHeight');
                            }
                            else {
                                top = topEnd.linear.top;
                            }
                            const bottomParent = bottomStart.visible ? bottomStart.renderParent : undefined;
                            const topParent = topEnd.visible ? topEnd.renderParent : undefined;
                            const offset = top - bottom;
                            if (offset > 0) {
                                if (topParent && topParent.groupParent && topParent.firstChild() === topEnd) {
                                    topParent.modifyBox(BOX_STANDARD.MARGIN_TOP, offset);
                                }
                                else if (bottomParent && bottomParent.groupParent && bottomParent.lastChild() === bottomStart) {
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
                        if (!actualParent.documentBody && previousSiblings.length) {
                            const previousStart = previousSiblings[previousSiblings.length - 1];
                            const offset = actualParent.box.bottom - previousStart.linear[previousStart.lineBreak || previousStart.excluded ? 'top' : 'bottom'];
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
                            const offset = nextStart.linear[nextStart.lineBreak || nextStart.excluded ? 'bottom' : 'top'] - actualParent.box.top;
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
                        processed.add(node);
                        previousSiblings.forEach((item: T) => processed.add(item));
                        nextSiblings.forEach((item: T) => processed.add(item));
                    }
                }
            });
        }
        for (const node of this.application.session.excluded) {
            if (!processed.has(node) && !node.lineBreak) {
                const offset = node.marginTop + node.marginBottom;
                if (offset !== 0) {
                    const nextSiblings = node.nextSiblings(true, true, true);
                    if (nextSiblings.length) {
                        const topEnd = nextSiblings.pop() as T;
                        if (topEnd.visible) {
                            topEnd.modifyBox(BOX_STANDARD.MARGIN_TOP, offset);
                            processed.add(node);
                        }
                    }
                }
            }
        }
    }

    public afterConstraints() {
        for (const node of this.application.session.cache) {
            const renderParent = node.renderAs ? node.renderAs.renderParent : node.renderParent;
            if (renderParent && node.pageFlow) {
                if (!renderParent.hasAlign(NODE_ALIGNMENT.AUTO_LAYOUT) && !node.alignParent('left') && node.styleElement && node.inlineVertical) {
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
            }
        }
    }
}