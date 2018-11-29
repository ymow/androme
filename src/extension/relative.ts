import { BOX_STANDARD } from '../lib/enumeration';

import Extension from '../base/extension';
import Node from '../base/Node';

export default abstract class Relative<T extends Node> extends Extension<T> {
    public afterConstraints() {
        for (const node of this.application.session.cache) {
            if (node.positionRelative) {
                if (node.floating || node.renderParent.layoutVertical || node.rightAligned) {
                    const top = node.top;
                    const bottom = node.bottom;
                    const left = node.left;
                    if (top !== 0) {
                        node.modifyBox(BOX_STANDARD.MARGIN_TOP, top);
                    }
                    else if (bottom !== 0) {
                        node.modifyBox(BOX_STANDARD.MARGIN_TOP, bottom * -1);
                    }
                    if (left !== 0) {
                        if (node.float === 'right' || node.autoMargin.left) {
                            node.modifyBox(BOX_STANDARD.MARGIN_RIGHT, left * -1);
                        }
                        else {
                            node.modifyBox(BOX_STANDARD.MARGIN_LEFT, left);
                        }
                    }
                }
            }
        }
    }
}