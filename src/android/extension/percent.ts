import View from '../view';

import $enum = androme.lib.enumeration;

export default class <T extends View> extends androme.lib.extensions.Percent<T> {
    public processNode(node: T, parent: T): ExtensionResult<T> {
        const controller = <android.lib.base.Controller<T>> this.application.viewController;
        const group = controller.createGroup(parent, node, [node]);
        const renderOutput = this.application.writeGridLayout(group, parent, 2, 1);
        group.android('layout_width', 'match_parent');
        controller[node.float === 'right' || node.autoMarginLeft ? 'prependBefore' : 'appendAfter'](node.id, controller.renderColumnSpace(group.renderDepth + 1, `${100 - node.toInt('width')}%`));
        return { output: '', complete: true, parent: group, renderAs: group, renderOutput, include: true };
    }

    public processChild(node: T) {
        if (node.has('width', $enum.CSS_STANDARD.PERCENT)) {
            node.android('layout_width', '0px');
            node.android('layout_columnWeight', (parseInt(node.styleMap.width) / 100).toFixed(2));
        }
        return { output: '' };
    }
}