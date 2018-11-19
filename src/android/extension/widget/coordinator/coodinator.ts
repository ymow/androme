import { WIDGET_NAME } from '../common';

import $dom = androme.lib.dom;
import $enum = androme.lib.enumeration;

import $Resource = android.lib.base.Resource;
import $View = android.lib.base.View;

import $android_const = android.lib.constant;
import $android_util = android.lib.util;

export default class Coordinator<T extends $View> extends androme.lib.base.Extension<T> {
    public processNode(node: T, parent: T): ExtensionResult<T> {
        const controller = this.application.viewController;
        const options = $android_util.createAttribute(this.options[node.element.id]);
        node.excludeResource |= $enum.NODE_RESOURCE.ASSET;
        node.setNodeType($android_const.VIEW_SUPPORT.COORDINATOR, $enum.NODE_STANDARD.BLOCK);
        node.render(parent);
        const output = controller.renderNodeStatic(
            $android_const.VIEW_SUPPORT.COORDINATOR,
            node.renderDepth,
            $Resource.formatOptions(options, this.application.getExtensionOptionsValueAsBoolean($android_const.EXT_ANDROID.RESOURCE_STRINGS, 'useNumberAlias')),
            'match_parent',
            'wrap_content',
            node,
            true
        );
        const toolbar = $dom.getNodeFromElement<T>($dom.getNestedExtension(node.element, WIDGET_NAME.TOOLBAR));
        if (toolbar) {
            const ext = this.application.getExtension(WIDGET_NAME.TOOLBAR);
            if (ext) {
                const toolbarOptions = $android_util.createAttribute(ext.options[toolbar.element.id]);
                if (toolbarOptions.hasOwnProperty('collapsingToolbar')) {
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