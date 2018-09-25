import Extension from '../base/extension';
import Node from '../base/node';
import { hasValue } from '../lib/util';
import { getNodeFromElement } from '../lib/dom';
import { NODE_PROCEDURE } from '../lib/constants';

export default class Accessibility<T extends Node> extends Extension<T> {
    constructor(name: string, tagNames?: string[], options?: {}) {
        super(name, tagNames, options);
    }

    public afterInit() {
        for (const node of this.application.cache.elements) {
            if (!node.hasBit('excludeProcedure', NODE_PROCEDURE.ACCESSIBILITY)) {
                const element = node.element;
                if (element instanceof HTMLInputElement) {
                    switch (element.type) {
                        case 'radio':
                        case 'checkbox':
                            [node.nextElementSibling, node.previousElementSibling].some((sibling: HTMLLabelElement) => {
                                const label = getNodeFromElement(sibling);
                                const labelParent = sibling && sibling.parentElement && sibling.parentElement.tagName === 'LABEL' ? getNodeFromElement(sibling.parentElement) : null;
                                if (label && label.visible && label.pageflow) {
                                    if (hasValue(sibling.htmlFor) && sibling.htmlFor === element.id) {
                                        node.companion = label;
                                    }
                                    else if (label.textElement && labelParent != null) {
                                        node.companion = label;
                                        labelParent.renderAs = node;
                                    }
                                    if (node.companion != null) {
                                        label.hide();
                                        return true;
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