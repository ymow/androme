import { WIDGET_NAME } from '../common';

import $Resource = android.lib.base.Resource;
import $View = android.lib.base.View;

import $dom = androme.lib.dom;
import $enum = androme.lib.enumeration;

import $android_const = android.lib.constant;
import $android_enum = android.lib.enumeration;
import $android_util = android.lib.util;

export default class Coordinator<T extends $View> extends androme.lib.base.Extension<T> {
    public processNode(node: T, parent: T): ExtensionResult<T> {
        const controller = this.application.controllerHandler;
        const options = $android_util.createAttribute(this.options[node.element.id]);
        node.setControlType($android_const.SUPPORT_ANDROID.COORDINATOR, $android_enum.CONTAINER_NODE.BLOCK);
        node.exclude({ resource: $enum.NODE_RESOURCE.ASSET });
        node.render(parent);
        const output = controller.renderNodeStatic(
            $android_const.SUPPORT_ANDROID.COORDINATOR,
            node.renderDepth,
            $Resource.formatOptions(options, this.application.extensionManager.optionValueAsBoolean($android_const.EXT_ANDROID.RESOURCE_STRINGS, 'numberResourceValue')),
            '',
            '',
            node,
            true
        );
        const element = Coordinator.findNestedByName(node.element, WIDGET_NAME.TOOLBAR);
        if (element) {
            const toolbar = $dom.getElementAsNode<T>(element);
            if (toolbar) {
                const ext = this.application.extensionManager.retrieve(WIDGET_NAME.TOOLBAR);
                if (ext) {
                    const toolbarOptions = $android_util.createAttribute(ext.options[toolbar.element.id]);
                    if ('collapsingToolbar' in toolbarOptions) {
                        node.android('fitsSystemWindows', 'true');
                    }
                }
            }
        }
        return { output };
    }

    public postProcedure(node: T) {
        if (node.documentRoot) {
            if (node.inlineWidth) {
                node.some((item: T) => {
                    if (item.rightAligned) {
                        node.android('layout_width', 'match_parent', true);
                        return true;
                    }
                    return false;
                });
            }
            if (node.inlineHeight) {
                node.some((item: T) => {
                    if (item.bottomAligned) {
                        node.android('layout_height', 'match_parent', true);
                        return true;
                    }
                    return false;
                });
            }
        }
    }
}