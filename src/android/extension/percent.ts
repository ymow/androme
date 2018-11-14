import View from '../view';

import $enum = androme.lib.enumeration;

export default class <T extends View> extends androme.lib.extensions.Percent<T> {
    public processNode(node: T, parent: T): ExtensionResult<T> {
        const controller = <android.lib.base.Controller<T>> this.application.viewController;
        const group = controller.createGroup(parent, node, [node]);
        const renderOutput = this.application.writeGridLayout(group, parent, 2, 1);
        group.alignmentType |= $enum.NODE_ALIGNMENT.PERCENT;
        controller[node.float === 'right' || node.autoMarginLeft ? 'prependBefore' : 'appendAfter'](node.id, controller.renderColumnSpace(group.renderDepth + 1, `${100 - node.toInt('width')}%`));
        return { output: '', complete: true, parent: group, renderAs: group, renderOutput, include: true };
    }
}