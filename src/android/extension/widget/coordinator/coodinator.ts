import { WIDGET_NAME } from '../common';

import $dom = androme.lib.dom;
import $enum = androme.lib.enumeration;

import $Resource = android.lib.base.Resource;
import $View = android.lib.base.View;

import $android_const = android.lib.constant;

export default class Coordinator<T extends $View> extends androme.lib.base.Extension<T> {
    public processNode(node: T, parent: T): ExtensionResult<T> {
        const controller = this.application.viewController;
        node.excludeResource |= $enum.NODE_RESOURCE.ASSET;
        node.setNodeType($android_const.VIEW_SUPPORT.COORDINATOR, $enum.NODE_STANDARD.BLOCK);
        node.render(parent);
        const output = controller.renderNodeStatic(
            $android_const.VIEW_SUPPORT.COORDINATOR,
            node.renderDepth,
            $Resource.formatOptions(this.options[node.element.id]),
            'match_parent',
            'wrap_content',
            node,
            true
        );
        const toolbar = $dom.getNodeFromElement<T>($dom.getNestedExtension(node.element, WIDGET_NAME.TOOLBAR));
        if (toolbar) {
            const ext = this.application.getExtension(WIDGET_NAME.TOOLBAR);
            if (ext) {
                const options = ext.options[toolbar.element.id];
                if (typeof options === 'object' && options.hasOwnProperty('collapsingToolbar')) {
                    node.android('fitsSystemWindows', 'true');
                }
            }
        }
        return { output };
    }

    public postProcedure(node: T) {
        if (node.documentRoot) {
            node.android('layout_width', 'match_parent');
            node.android('layout_height', 'match_parent');
        }
    }
}