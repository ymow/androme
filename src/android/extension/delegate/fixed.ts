import { CONTAINER_NODE } from '../../lib/enumeration';

import View from '../../view';

import $Layout = androme.lib.base.Layout;

import $enum = androme.lib.enumeration;

function getFixedNodes<T extends View>(node: T) {
    return node.filter(item => !item.pageFlow && (item.position === 'fixed' || item.absoluteParent === node));
}

export default class Fixed<T extends View> extends androme.lib.base.Extension<T> {
    public condition(node: T) {
        if (node.documentRoot) {
            const fixed = getFixedNodes(node);
            if (fixed.length > 0) {
                const top = fixed.filter(item => item.top !== 0);
                const right = fixed.filter(item => item.right !== 0);
                const bottom = fixed.filter(item => item.bottom !== 0);
                const left = fixed.filter(item => item.left !== 0);
                return (
                    node.documentRoot && (
                        node.paddingTop > 0 && top.length > 0 ||
                        node.paddingRight > 0 && right.length > 0 ||
                        node.paddingBottom > 0 && bottom.length > 0 ||
                        node.paddingLeft > 0 && left.length > 0
                    ) ||
                    node.documentBody && (
                        node.marginTop > 0 && top.length > 0 ||
                        node.marginRight > 0 && right.length > 0 ||
                        node.marginBottom > 0 && bottom.length > 0 ||
                        node.marginLeft > 0 && left.length > 0
                    )
                );
            }
        }
        return false;
    }

    public processNode(node: T, parent: T): ExtensionResult<T> {
        const controller = (<android.lib.base.Controller<T>> this.application.controllerHandler);
        const fixed = getFixedNodes(node);
        const children = [node, ...fixed] as T[];
        const container = controller.createNodeWrapper(node);
        container.android('layout_width', 'match_parent');
        container.android('layout_height', 'match_parent');
        children.forEach((item, index) => {
            item.siblingIndex = index;
            item.parent = container;
        });
        node.each((item, index) => item.siblingIndex = index);
        const layout = new $Layout(
            parent,
            container,
            CONTAINER_NODE.CONSTRAINT,
            $enum.NODE_ALIGNMENT.ABSOLUTE,
            children.length,
            children
        );
        return { output: '', parent: container, renderAs: container, outputAs: this.application.renderLayout(layout) };
    }
}