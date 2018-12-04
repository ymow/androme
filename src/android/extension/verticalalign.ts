import { CONTAINER_NODE } from '../lib/enumeration';

import View from '../view';

import $Layout = androme.lib.base.Layout;

import $const = androme.lib.constant;
import $enum = androme.lib.enumeration;

export default class <T extends View> extends androme.lib.extensions.VerticalAlign<T> {
    public processNode(node: T, parent: T): ExtensionResult<T> {
        super.processNode(node, parent);
        const mainData: VerticalAlignData<T> = node.data($const.EXT_NAME.VERTICAL_ALIGN, 'mainData');
        let output = '';
        if (mainData) {
            const layout = new $Layout(
                parent,
                node,
                CONTAINER_NODE.RELATIVE,
                $enum.NODE_ALIGNMENT.HORIZONTAL,
                node.length,
                node.children as T[]
            );
            layout.floated = layout.getFloated(true);
            output = this.application.renderNode(layout);
        }
        return { output };
    }
}