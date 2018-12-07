import { CONTAINER_NODE } from '../lib/enumeration';

import View from '../view';

import $Layout = androme.lib.base.Layout;

import $enum = androme.lib.enumeration;

export default class <T extends View> extends androme.lib.extensions.Percent<T> {
    public processNode(node: T, parent: T): ExtensionResult<T> {
        if (node.has('width', $enum.CSS_STANDARD.PERCENT)) {
            const controller = <android.lib.base.Controller<T>> this.application.controllerHandler;
            const group = controller.createNodeGroup(node, [node], parent);
            group.android('layout_width', 'match_parent');
            const layout = new $Layout(
                parent,
                group,
                CONTAINER_NODE.GRID,
                $enum.NODE_ALIGNMENT.AUTO_LAYOUT,
                1,
                group.children as T[]
            );
            layout.rowCount = 1;
            layout.columnCount = 2;
            node.android('layout_width', '0px');
            node.android('layout_columnWeight', (parseInt(node.css('width')) / 100).toFixed(2));
            const outputAs = this.application.renderNode(layout);
            controller[node.rightAligned ? 'prependBefore' : 'appendAfter'](node.id, controller.renderSpace(group.renderDepth + 1, `${100 - node.toInt('width')}%`, '', 1));
            return { output: '', parent: group, renderAs: group, outputAs, include: true };
        }
        return { output: '' };
    }
}