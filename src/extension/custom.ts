import { EXT_NAME } from '../lib/constant';
import { NODE_STANDARD } from '../lib/enumeration';

import Extension from '../base/extension';
import Node from '../base/node';

import { getDataSet } from '../lib/dom';

export default abstract class Custom<T extends Node> extends Extension<T> {
    protected constructor(
        name: string,
        framework: number,
        tagNames?: string[],
        options?: ExternalData)
    {
        super(name, framework, tagNames, options);
        this.require(EXT_NAME.EXTERNAL, true);
    }

    public processNode(node: T, parent: T): ExtensionResult<T> {
        let output = '';
        const data = getDataSet(node.element, this.name);
        if (data.tag) {
            if (node.length > 0) {
                output = this.application.viewController.renderGroup(node, parent, data.tag);
            }
            else {
                output = this.application.viewController.renderNode(node, parent, data.tag);
            }
            node.nodeType = node.blockStatic ? NODE_STANDARD.BLOCK : NODE_STANDARD.INLINE;
        }
        if (data.tagChild) {
            for (const item of node) {
                if (item.styleElement) {
                    item.dataset.ext = this.name;
                    item.dataset.andromeCustomTag = data.tagChild;
                }
            }
        }
        return { output };
    }
}