import { BOX_STANDARD } from '../lib/enumeration';

import Extension from '../base/extension';
import Node from '../base/Node';

export default abstract class Relative<T extends Node> extends Extension<T> {
    public afterConstraints() {
        for (const node of this.application.session.cache) {
            if (node.positionRelative) {
                const renderParent = node.renderParent;
                if (!node.baseline || renderParent && !renderParent.support.container.positionRelative) {
                    if (node.top !== 0) {
                        node.modifyBox(BOX_STANDARD.MARGIN_TOP, node.top);
                    }
                    else if (node.bottom !== 0) {
                        node.modifyBox(BOX_STANDARD.MARGIN_TOP, node.bottom * -1);
                    }
                    if (node.left !== 0) {
                        if (node.rightAligned) {
                            node.modifyBox(BOX_STANDARD.MARGIN_RIGHT, node.left * -1);
                        }
                        else {
                            node.modifyBox(BOX_STANDARD.MARGIN_LEFT, node.left);
                        }
                    }
                }
            }
        }
    }
}