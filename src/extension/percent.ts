import { CSS_STANDARD, NODE_ALIGNMENT, NODE_CONTAINER } from '../lib/enumeration';

import Extension from '../base/extension';
import Node from '../base/node';

export default abstract class Percent<T extends Node> extends Extension<T> {
    public condition(node: T, parent: T) {
        return this.included(<HTMLElement> node.element) || (
            node.alignmentType === NODE_ALIGNMENT.NONE &&
            node.pageflow &&
            node.has('width', CSS_STANDARD.PERCENT, { not: '100%' }) &&
            (parent.linearVertical || (parent.is(NODE_CONTAINER.FRAME) && node.singleChild)) &&
            !node.imageElement
        );
    }
}