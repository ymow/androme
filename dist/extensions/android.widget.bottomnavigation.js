/* android.widget 2.3.0
   https://github.com/anpham6/androme */

this.android = this.android || {};
this.android.widget = this.android.widget || {};
this.android.widget.bottomnavigation = (function () {
    'use strict';

    function getAppTheme(assets) {
        for (const theme of assets) {
            const match = /<style\s+name="([\w$]+)"\s+parent="Theme\.[\w$.]+"/.exec(theme.content);
            if (match) {
                return match[1];
            }
        }
        return '';
    }

    const template = [
        '<?xml version="1.0" encoding="utf-8"?>',
        '<resources>',
        '	<style name="{&appTheme}" parent="{~parentTheme}">',
        '!items',
        '		<item name="{&name}">{&value}</item>',
        '!items',
        '	</style>',
        '</resources>'
    ];
    var EXTENSION_GENERIC_TMPL = template.join('\n');

    var $Resource = android.lib.base.Resource;
    var $enum = androme.lib.enumeration;
    var $util = androme.lib.util;
    var $android_const = android.lib.constant;
    var $android_enum = android.lib.enumeration;
    var $android_util = android.lib.util;
    class BottomNavigation extends androme.lib.base.Extension {
        constructor(name, framework, tagNames, options) {
            super(name, framework, tagNames, options);
            this.require("android.widget.menu" /* MENU */);
        }
        processNode(node, parent) {
            const options = $android_util.createAttribute(this.options[node.element.id]);
            $util.defaultWhenNull(options, 'android', 'background', `?android:attr/windowBackground`);
            for (let i = 5; i < node.length; i++) {
                const item = node.item(i);
                item.hide();
                item.cascade().forEach(child => child.hide());
            }
            node.setControlType($android_const.SUPPORT_ANDROID.BOTTOM_NAVIGATION, $android_enum.CONTAINER_NODE.BLOCK);
            node.exclude({ resource: $enum.NODE_RESOURCE.ASSET });
            node.render(parent);
            const output = this.application.controllerHandler.renderNodeStatic($android_const.SUPPORT_ANDROID.BOTTOM_NAVIGATION, node.renderDepth, $Resource.formatOptions(options, this.application.getExtensionOptionValueAsBoolean($android_const.EXT_ANDROID.RESOURCE_STRINGS, 'numberResourceValue')), parent.layoutConstraint ? '0px' : 'match_parent', 'wrap_content', node);
            node.cascade().forEach(item => this.subscribersChild.add(item));
            this.setStyleTheme();
            return { output, complete: true };
        }
        postBaseLayout(node) {
            const renderParent = node.renderParent;
            if (renderParent) {
                if (!renderParent.has('width')) {
                    renderParent.android('layout_width', 'match_parent');
                }
                if (!renderParent.has('height')) {
                    renderParent.android('layout_height', 'match_parent');
                }
            }
            const menu = $util.optionalAsString(BottomNavigation.findNestedByName(node.element, "android.widget.menu" /* MENU */), 'dataset.layoutName');
            if (menu !== '') {
                const options = $android_util.createAttribute(this.options[node.element.id]);
                $util.defaultWhenNull(options, 'app', 'menu', `@menu/${menu}`);
                node.app('menu', options.app.menu);
            }
        }
        setStyleTheme() {
            if (this.application.resourceHandler.fileHandler) {
                const options = Object.assign({}, this.options.resource);
                $util.defaultWhenNull(options, 'appTheme', getAppTheme(this.application.resourceHandler.fileHandler.assets) || 'AppTheme');
                $util.defaultWhenNull(options, 'parentTheme', 'Theme.AppCompat.Light.DarkActionBar');
                const data = {
                    'appTheme': options.appTheme,
                    'parentTheme': options.parentTheme,
                    'items': []
                };
                $util.defaultWhenNull(options, 'output', 'path', 'res/values');
                $util.defaultWhenNull(options, 'output', 'file', `${"android.widget.bottomnavigation" /* BOTTOM_NAVIGATION */}.xml`);
                this.application.resourceHandler.addStyleTheme(EXTENSION_GENERIC_TMPL, data, options);
            }
        }
    }

    const bottomNavigation = new BottomNavigation("android.widget.bottomnavigation" /* BOTTOM_NAVIGATION */, 2 /* ANDROID */);
    if (androme) {
        androme.includeAsync(bottomNavigation);
    }

    return bottomNavigation;

}());
