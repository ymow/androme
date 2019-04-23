import { BOX_STANDARD } from '../lib/enumeration';

import Extension from '../base/extension';
import Layout from '../base/layout';
import Node from '../base/node';

import { convertInt } from '../lib/util';

export default abstract class Relative<T extends Node> extends Extension<T> {
    public condition(node: T) {
        return node.positionRelative && !node.positionStatic || convertInt(node.cssInitial('verticalAlign')) !== 0;
    }

    public processNode() {
        return { output: '', include: true };
    }

    public postProcedure(node: T) {
        const renderParent = node.renderParent as T;
        if (renderParent) {
            let target = node;
            const verticalAlign = convertInt(node.verticalAlign);
            if (renderParent.support.container.positionRelative && node.length === 0 && (node.top !== 0 || node.bottom !== 0 || verticalAlign !== 0)) {
                target = node.clone(this.application.nextId, true, true) as T;
                node.hide(true);
                const layout = new Layout(
                    renderParent,
                    target,
                    target.containerType,
                    target.alignmentType
                );
                this.application.controllerHandler.appendAfter(node.id, this.application.renderLayout(layout));
                this.application.session.cache.append(target, false);
                renderParent.renderEach(item => {
                    if (item.alignSibling('topBottom') === node.documentId) {
                        item.alignSibling('topBottom', target.documentId);
                    }
                    else if (item.alignSibling('bottomTop') === node.documentId) {
                        item.alignSibling('bottomTop', target.documentId);
                    }
                });
            }
            if (node.top !== 0) {
                target.modifyBox(BOX_STANDARD.MARGIN_TOP, node.top);
            }
            else if (node.bottom !== 0) {
                target.modifyBox(BOX_STANDARD.MARGIN_TOP, node.bottom * -1);
            }
            if (verticalAlign !== 0) {
                target.modifyBox(BOX_STANDARD.MARGIN_TOP, verticalAlign * -1);
            }
            if (node.left !== 0) {
                if (target.autoMargin.left) {
                    target.modifyBox(BOX_STANDARD.MARGIN_RIGHT, node.left * -1);
                }
                else {
                    target.modifyBox(BOX_STANDARD.MARGIN_LEFT, node.left);
                }
            }
            else if (node.right !== 0) {
                target.modifyBox(BOX_STANDARD.MARGIN_LEFT, node.right * -1);
            }
        }
    }
}