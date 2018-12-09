import { CONTAINER_ANDROID } from '../../lib/constant';

import View from '../../view';

import $xml = androme.lib.xml;

export default class MaxWidthHeight<T extends View> extends androme.lib.base.Extension<T> {
    public condition(node: T) {
        return node.has('maxWidth') || node.has('maxHeight');
    }

    public processNode(node: T, parent: T): ExtensionResult<T> {
        const controller = (<android.lib.base.Controller<T>> this.application.controllerHandler);
        const container = controller.createNodeWrapper(node, parent, CONTAINER_ANDROID.FRAME);
        container.css('display', 'block', true);
        if (node.has('maxWidth')) {
            container.css('width', node.css('maxWidth'), true);
            node.css('maxWidth', 'auto');
        }
        if (node.has('maxHeight')) {
            container.css('height', node.css('maxHeight'), true);
            node.css('maxHeight', 'auto');
        }
        container.render(parent);
        node.parent = container;
        const outputAs = controller.getEnclosingTag(CONTAINER_ANDROID.FRAME, container.id, container.renderDepth, $xml.formatPlaceholder(container.id));
        return { output: '', parent: container, renderAs: container, outputAs };
    }
}