import { EXT_ANDROID } from '../../lib/constant';

import Resource from '../../resource';
import View from '../../view';

import $const = androme.lib.constant;
import $dom = androme.lib.dom;
import $enum = androme.lib.enumeration;

export default class <T extends View> extends androme.lib.base.Extension<T> {
    constructor(
        name: string,
        framework: number,
        tagNames?: string[],
        options?: ExternalData)
    {
        super(name, framework, tagNames, options);
        this.require($const.EXT_NAME.EXTERNAL, true);
    }

    public processNode(node: T, parent: T): ExtensionResult<T> {
        const data = $dom.getDataSet(node.element, this.name);
        let output = '';
        if (data.tag) {
            node.setNodeType(data.tag, node.blockStatic ? $enum.NODE_STANDARD.BLOCK : $enum.NODE_STANDARD.INLINE);
            node.render(parent);
            output = this.application.viewController.renderNodeStatic(data.tag, node.renderDepth, {}, '', '', node, node.length > 0);
        }
        if (data.tagChild) {
            for (const item of node) {
                if (item.styleElement) {
                    item.dataset.ext = this.name;
                    item.dataset.androidElementCustomTag = data.tagChild;
                }
            }
        }
        return { output };
    }

    public postProcedure(node: T) {
        const options: ExternalData = Object.assign({}, this.options[node.element.id]);
        node.apply(Resource.formatOptions(options, this.application.getExtensionOptionsValueAsBoolean(EXT_ANDROID.RESOURCE_STRINGS, 'useNumberAlias')));
    }
}