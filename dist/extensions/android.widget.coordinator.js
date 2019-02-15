/* android.widget 2.4.0
   https://github.com/anpham6/androme */

this.android = this.android || {};
this.android.widget = this.android.widget || {};
this.android.widget.coordinator = (function () {
    'use strict';

    var $Resource = android.lib.base.Resource;
    var $dom = androme.lib.dom;
    var $enum = androme.lib.enumeration;
    var $android_const = android.lib.constant;
    var $android_enum = android.lib.enumeration;
    var $android_util = android.lib.util;
    class Coordinator extends androme.lib.base.Extension {
        processNode(node, parent) {
            const controller = this.application.controllerHandler;
            const options = $android_util.createAttribute(this.options[node.element.id]);
            node.setControlType($android_const.SUPPORT_ANDROID.COORDINATOR, $android_enum.CONTAINER_NODE.BLOCK);
            node.exclude({ resource: $enum.NODE_RESOURCE.ASSET });
            node.render(parent);
            const output = controller.renderNodeStatic($android_const.SUPPORT_ANDROID.COORDINATOR, node.renderDepth, $Resource.formatOptions(options, this.application.extensionManager.optionValueAsBoolean($android_const.EXT_ANDROID.RESOURCE_STRINGS, 'numberResourceValue')), '', '', node, true);
            const element = Coordinator.findNestedByName(node.element, "android.widget.toolbar" /* TOOLBAR */);
            if (element) {
                const toolbar = $dom.getElementAsNode(element);
                if (toolbar) {
                    const ext = this.application.extensionManager.retrieve("android.widget.toolbar" /* TOOLBAR */);
                    if (ext) {
                        const toolbarOptions = $android_util.createAttribute(ext.options[toolbar.element.id]);
                        if (toolbarOptions.hasOwnProperty('collapsingToolbar')) {
                            node.android('fitsSystemWindows', 'true');
                        }
                    }
                }
            }
            return { output };
        }
        postProcedure(node) {
            if (node.documentRoot) {
                if (node.inlineWidth) {
                    node.some((item) => {
                        if (item.rightAligned) {
                            node.android('layout_width', 'match_parent', true);
                            return true;
                        }
                        return false;
                    });
                }
                if (node.inlineHeight) {
                    node.some((item) => {
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

    const coordinator = new Coordinator("android.widget.coordinator" /* COORDINATOR */, 2 /* ANDROID */);
    if (androme) {
        androme.includeAsync(coordinator);
    }

    return coordinator;

}());
