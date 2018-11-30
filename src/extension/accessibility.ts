import { NODE_PROCEDURE } from '../lib/enumeration';

import Extension from '../base/extension';
import Node from '../base/node';

import { getElementAsNode, getNextElementSibling, getPreviousElementSibling } from '../lib/dom';
import { hasValue } from '../lib/util';

export default abstract class Accessibility<T extends Node> extends Extension<T> {
    public afterInit() {
        for (const node of this.application.processing.cache.elements) {
            if (!node.hasBit('excludeProcedure', NODE_PROCEDURE.ACCESSIBILITY)) {
                const element = node.element;
                if (element instanceof HTMLInputElement) {
                    switch (element.type) {
                        case 'radio':
                        case 'checkbox':
                            [getPreviousElementSibling(element), getNextElementSibling(element)].some((sibling: HTMLLabelElement) => {
                                if (sibling) {
                                    const label = getElementAsNode<T>(sibling);
                                    const labelParent = sibling.parentElement && sibling.parentElement.tagName === 'LABEL' ? getElementAsNode<T>(sibling.parentElement) : null;
                                    if (label && label.visible && label.pageFlow) {
                                        if (hasValue(sibling.htmlFor) && sibling.htmlFor === element.id) {
                                            node.companion = label;
                                        }
                                        else if (label.textElement && labelParent) {
                                            node.companion = label;
                                            labelParent.renderAs = node;
                                        }
                                        if (node.companion) {
                                            if (this.options && !this.options.showLabel) {
                                                label.hide();
                                            }
                                            return true;
                                        }
                                    }
                                }
                                return false;
                            });
                            break;
                    }
                }
            }
        }
    }
}