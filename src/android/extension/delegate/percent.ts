import { CONTAINER_ANDROID } from '../../lib/constant';

import View from '../../view';

import $enum = androme.lib.enumeration;
import $util = androme.lib.util;
import $xml = androme.lib.xml;

export default class Percent<T extends View> extends androme.lib.base.Extension<T> {
    public condition(node: T, parent: T) {
        return parent.layoutVertical && node.pageFlow && !node.imageElement && node.has('width', $enum.CSS_STANDARD.PERCENT, { not: '100%' });
    }

    public processNode(node: T, parent: T): ExtensionResult<T> {
        const container = (<android.lib.base.Controller<T>> this.application.controllerHandler).createNodeWrapper(node, parent, CONTAINER_ANDROID.CONSTRAINT);
        container.android('layout_width', 'match_parent');
        container.android('layout_height', 'wrap_content');
        container.render(parent);
        if (!node.has('height', $enum.CSS_STANDARD.UNIT)) {
            node.css('height', $util.formatPX(node.bounds.height), true);
        }
        const outputAs = $xml.getEnclosingTag(CONTAINER_ANDROID.CONSTRAINT, container.id, container.renderDepth, $xml.formatPlaceholder(container.id));
        return { output: '', parent: container, renderAs: container, outputAs };
    }
}