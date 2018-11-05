import WIDGET_NAME from '../namespace';

import $View = android.lib.base.View;

import $enum = androme.lib.enumeration;
import $dom = androme.lib.dom;

import $android_const = android.lib.constant;

export default class Coordinator<T extends $View> extends androme.lib.base.Extension<T> {
    public processNode(): ExtensionResult {
        const node = this.node as T;
        const output = this.application.viewController.renderGroup(node, this.parent as T, $android_const.VIEW_SUPPORT.COORDINATOR);
        node.apply(this.options[node.element.id]);
        node.nodeType = $enum.NODE_STANDARD.BLOCK;
        node.excludeResource |= $enum.NODE_RESOURCE.ASSET;
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
        return { output, complete: false };
    }

    public afterInsert() {
        const node = this.node as T;
        if (node.documentRoot) {
            node.android('layout_width', 'match_parent');
            node.android('layout_height', 'match_parent');
        }
    }
}