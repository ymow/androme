import { BOX_STANDARD } from '../lib/enumeration';

import Extension from '../base/extension';
import Layout from '../base/layout';
import Node from '../base/node';

export default abstract class Relative<T extends Node> extends Extension<T> {
    public condition(node: T) {
        return node.positionRelative && !node.positionStatic;
    }

    public processNode() {
        return { output: '', include: true };
    }

    public postProcedure(node: T) {
        const renderParent = node.renderParent as T;
        if (renderParent) {
            let target = node;
            if ((node.top !== 0 || node.bottom !== 0) && node.length === 0 && renderParent.support.container.positionRelative) {
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
            }
            if (node.top !== 0) {
                target.modifyBox(BOX_STANDARD.MARGIN_TOP, node.top);
            }
            else if (node.bottom !== 0) {
                target.modifyBox(BOX_STANDARD.MARGIN_TOP, node.bottom * -1);
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