/* android.widget 2.4.0
   https://github.com/anpham6/androme */

this.android = this.android || {};
this.android.widget = this.android.widget || {};
this.android.widget.drawer = (function () {
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
        '		<item name="android:windowDrawsSystemBarBackgrounds">true</item>',
        '		<item name="android:statusBarColor">@android:color/transparent</item>',
        '		<item name="android:windowTranslucentStatus">true</item>',
        '!items',
        '		<item name="{&name}">{&value}</item>',
        '!items',
        '	</style>',
        '</resources>'
    ];
    var EXTENSION_DRAWER_TMPL = template.join('\n');

    var $Resource = android.lib.base.Resource;
    var $dom = androme.lib.dom;
    var $enum = androme.lib.enumeration;
    var $const = androme.lib.constant;
    var $util = androme.lib.util;
    var $android_const = android.lib.constant;
    var $android_enum = android.lib.enumeration;
    var $android_util = android.lib.util;
    class Drawer extends androme.lib.base.Extension {
        constructor(name, framework, tagNames, options) {
            super(name, framework, tagNames, options);
            this.documentRoot = true;
            this.require($const.EXT_NAME.EXTERNAL, true);
            this.require("android.widget.menu" /* MENU */);
            this.require("android.widget.coordinator" /* COORDINATOR */);
        }
        init(element) {
            if (this.included(element) && element.children.length) {
                Array.from(element.children).forEach((item) => {
                    if (item.tagName === 'NAV' && !$util.includes(item.dataset.use, $const.EXT_NAME.EXTERNAL)) {
                        item.dataset.use = ($util.hasValue(item.dataset.use) ? `${item.dataset.use}, ` : '') + $const.EXT_NAME.EXTERNAL;
                    }
                });
                this.application.parseElements.add(element);
                return true;
            }
            return false;
        }
        processNode(node) {
            const options = $android_util.createAttribute(this.options.self);
            if (Drawer.findNestedByName(node.element, "android.widget.menu" /* MENU */)) {
                $util.defaultWhenNull(options, 'android', 'fitsSystemWindows', 'true');
                this.setStyleTheme(node.localSettings.targetAPI);
            }
            else {
                const navigationViewOptions = $android_util.createAttribute(this.options.navigationView);
                $util.defaultWhenNull(navigationViewOptions, 'android', 'layout_gravity', node.localizeString('left'));
                const navView = node.item();
                navView.android('layout_gravity', navigationViewOptions.android.layout_gravity);
                navView.android('layout_height', 'match_parent');
                navView.positioned = true;
            }
            node.documentRoot = true;
            node.setControlType($android_const.SUPPORT_ANDROID.DRAWER, $android_enum.CONTAINER_NODE.BLOCK);
            node.exclude({ resource: $enum.NODE_RESOURCE.FONT_STYLE });
            const output = this.application.controllerHandler.renderNodeStatic($android_const.SUPPORT_ANDROID.DRAWER, 0, $Resource.formatOptions(options, this.application.extensionManager.optionValueAsBoolean($android_const.EXT_ANDROID.RESOURCE_STRINGS, 'numberResourceValue')), 'match_parent', 'match_parent', node, true);
            return { output, complete: true };
        }
        postParseDocument(node) {
            const application = this.application;
            const options = $android_util.createAttribute(this.options.navigation);
            const menu = $util.optionalAsString(Drawer.findNestedByName(node.element, "android.widget.menu" /* MENU */), 'dataset.layoutName');
            const headerLayout = $util.optionalAsString(Drawer.findNestedByName(node.element, $const.EXT_NAME.EXTERNAL), 'dataset.layoutName');
            if (menu !== '') {
                $util.defaultWhenNull(options, 'app', 'menu', `@menu/${menu}`);
            }
            if (headerLayout !== '') {
                $util.defaultWhenNull(options, 'app', 'headerLayout', `@layout/${headerLayout}`);
            }
            if (menu !== '' || headerLayout !== '') {
                $util.defaultWhenNull(options, 'android', 'id', `${node.documentId}_navigation`);
                $util.defaultWhenNull(options, 'android', 'fitsSystemWindows', 'true');
                $util.defaultWhenNull(options, 'android', 'layout_gravity', node.localizeString('left'));
                const output = application.controllerHandler.renderNodeStatic($android_const.SUPPORT_ANDROID.NAVIGATION_VIEW, 1, $Resource.formatOptions(options, this.application.extensionManager.optionValueAsBoolean($android_const.EXT_ANDROID.RESOURCE_STRINGS, 'numberResourceValue')), 'wrap_content', 'match_parent');
                application.addRenderQueue(node.id.toString(), output);
            }
        }
        postProcedure(node) {
            const element = Drawer.findNestedByName(node.element, "android.widget.coordinator" /* COORDINATOR */);
            if (element) {
                const coordinator = $dom.getElementAsNode(element);
                if (coordinator && coordinator.some(item => item.positioned) && coordinator.inlineHeight) {
                    coordinator.android('layout_height', 'match_parent');
                }
            }
        }
        setStyleTheme(api) {
            if (this.application.resourceHandler.fileHandler) {
                const options = Object.assign({}, this.options.resource);
                $util.defaultWhenNull(options, 'appTheme', getAppTheme(this.application.resourceHandler.fileHandler.assets) || 'AppTheme');
                $util.defaultWhenNull(options, 'parentTheme', 'Theme.AppCompat.Light.NoActionBar');
                const data = {
                    'appTheme': options.appTheme,
                    'parentTheme': options.parentTheme,
                    'items': []
                };
                $util.defaultWhenNull(options, 'output', 'path', `res/values${api >= 21 ? '' : '-v21'}`);
                $util.defaultWhenNull(options, 'output', 'file', `${"android.widget.drawer" /* DRAWER */}.xml`);
                this.application.resourceHandler.addStyleTheme(EXTENSION_DRAWER_TMPL, data, options);
            }
        }
    }

    const drawer = new Drawer("android.widget.drawer" /* DRAWER */, 2 /* ANDROID */);
    if (androme) {
        androme.includeAsync(drawer);
    }

    return drawer;

}());
