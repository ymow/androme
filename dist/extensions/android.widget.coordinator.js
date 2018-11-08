/* android.widget 2.2.2
   https://github.com/anpham6/androme */

this.android = this.android || {};
this.android.widget = this.android.widget || {};
this.android.widget.coordinator = (function () {
    'use strict';

    var WIDGET_NAME = {
        __FRAMEWORK: 2,
        FAB: 'android.widget.floatingactionbutton',
        MENU: 'android.widget.menu',
        COORDINATOR: 'android.widget.coordinator',
        TOOLBAR: 'android.widget.toolbar',
        DRAWER: 'android.widget.drawer',
        BOTTOM_NAVIGATION: 'android.widget.bottomnavigation'
    };

    var $enum = androme.lib.enumeration;
    var $dom = androme.lib.dom;
    var $android_const = android.lib.constant;
    class Coordinator extends androme.lib.base.Extension {
        processNode() {
            const node = this.node;
            const output = this.application.viewController.renderGroup(node, this.parent, $android_const.VIEW_SUPPORT.COORDINATOR);
            node.apply(this.options[node.element.id]);
            node.nodeType = $enum.NODE_STANDARD.BLOCK;
            node.excludeResource |= $enum.NODE_RESOURCE.ASSET;
            const toolbar = $dom.getNodeFromElement($dom.getNestedExtension(node.element, WIDGET_NAME.TOOLBAR));
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
        afterInsert() {
            const node = this.node;
            if (node.documentRoot) {
                node.android('layout_width', 'match_parent');
                node.android('layout_height', 'match_parent');
            }
        }
    }

    const coordinator = new Coordinator(WIDGET_NAME.COORDINATOR, WIDGET_NAME.__FRAMEWORK);
    if (androme) {
        androme.registerExtensionAsync(coordinator);
    }

    return coordinator;

}());
