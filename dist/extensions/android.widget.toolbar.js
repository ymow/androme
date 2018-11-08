/* android.widget 2.2.2
   https://github.com/anpham6/androme */

this.android = this.android || {};
this.android.widget = this.android.widget || {};
this.android.widget.toolbar = (function () {
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

    const template = [
        '<?xml version="1.0" encoding="utf-8"?>',
        '<resources>',
        '	<style name="{&appTheme}" parent="{~parentTheme}">',
        '!1',
        '		<item name="{&name}">{&value}</item>',
        '!1',
        '	</style>',
        '	<style name="{&appTheme}.NoActionBar">',
        '		<item name="windowActionBar">false</item>',
        '		<item name="windowNoTitle">true</item>',
        '	</style>',
        '	<style name="AppTheme.AppBarOverlay" parent="{~appBarOverlay}" />',
        '	<style name="AppTheme.PopupOverlay" parent="{~popupOverlay}" />',
        '</resources>'
    ];
    var EXTENSION_APPBAR_TMPL = template.join('\n');

    var $View = android.lib.base.View;
    var $enum = androme.lib.enumeration;
    var $const = androme.lib.constant;
    var $util = androme.lib.util;
    var $dom = androme.lib.dom;
    var $xml = androme.lib.xml;
    var $android_Resource = android.lib.base.Resource;
    var $android_const = android.lib.constant;
    var $android_util = android.lib.util;
    class Toolbar extends androme.lib.base.Extension {
        constructor(name, framework, tagNames, options) {
            super(name, framework, tagNames, options);
            this.require(WIDGET_NAME.MENU);
        }
        init(element) {
            if (this.included(element)) {
                Array.from(element.children).some((item) => {
                    if (item.tagName === 'NAV' && !$util.includes(item.dataset.ext, $const.EXT_NAME.EXTERNAL)) {
                        item.dataset.ext = ($util.hasValue(item.dataset.ext) ? `${item.dataset.ext}, ` : '') + $const.EXT_NAME.EXTERNAL;
                        return true;
                    }
                    return false;
                });
                if (element.dataset.target) {
                    const target = document.getElementById(element.dataset.target);
                    if (target && element.parentElement !== target && !$util.includes(target.dataset.ext, WIDGET_NAME.COORDINATOR)) {
                        this.application.viewElements.add(element);
                    }
                }
            }
            return false;
        }
        processNode() {
            const controller = this.application.viewController;
            const node = this.node;
            const parent = this.parent;
            const target = $util.hasValue(node.dataset.target);
            const options = Object.assign({}, this.options[node.element.id]);
            const optionsToolbar = $android_util.createViewAttribute(options.self);
            const optionsAppBar = $android_util.createViewAttribute(options.appBar);
            const optionsCollapsingToolbar = $android_util.createViewAttribute(options.collapsingToolbar);
            const hasMenu = $dom.getNestedExtension(node.element, WIDGET_NAME.MENU) !== null;
            const backgroundImage = node.has('backgroundImage');
            const appBarChildren = [];
            const collapsingToolbarChildren = [];
            let output;
            let depth = target ? 0 : node.depth;
            let children = node.filter(item => item.auto).length;
            Array.from(node.element.children).forEach((element) => {
                if (element.tagName === 'IMG') {
                    if ($util.hasValue(element.dataset.navigationIcon)) {
                        const result = $android_Resource.addImageSrcSet(element, $android_const.DRAWABLE_PREFIX.MENU);
                        if (result !== '') {
                            $util.overwriteDefault(toolbar, 'app', 'navigationIcon', `@drawable/${result}`);
                            if ($dom.getStyle(element).display !== 'none') {
                                children--;
                            }
                        }
                    }
                    if ($util.hasValue(element.dataset.collapseIcon)) {
                        const result = $android_Resource.addImageSrcSet(element, $android_const.DRAWABLE_PREFIX.MENU);
                        if (result !== '') {
                            $util.overwriteDefault(toolbar, 'app', 'collapseIcon', `@drawable/${result}`);
                            if ($dom.getStyle(element).display !== 'none') {
                                children--;
                            }
                        }
                    }
                }
                if ($util.hasValue(element.dataset.target)) {
                    children--;
                }
                else {
                    const targetNode = $dom.getNodeFromElement(element);
                    if (targetNode) {
                        switch (element.dataset.targetModule) {
                            case 'appBar':
                                appBarChildren.push(targetNode);
                                children--;
                                break;
                            case 'collapsingToolbar':
                                collapsingToolbarChildren.push(targetNode);
                                children--;
                                break;
                        }
                    }
                }
            });
            const hasCollapsingToolbar = options.hasOwnProperty('collapsingToolbar') || collapsingToolbarChildren.length > 0;
            const hasAppBar = options.hasOwnProperty('appBar') || appBarChildren.length > 0 || hasCollapsingToolbar;
            let appBarOverlay = '';
            let popupOverlay = '';
            if (hasCollapsingToolbar) {
                $util.overwriteDefault(optionsToolbar, 'app', 'layout_collapseMode', 'pin');
            }
            else {
                if (!hasAppBar) {
                    $util.overwriteDefault(optionsToolbar, 'android', 'fitsSystemWindows', 'true');
                }
                $util.overwriteDefault(optionsToolbar, 'app', 'popupTheme', '@style/ThemeOverlay.AppCompat.Light');
                if (backgroundImage) {
                    $util.overwriteDefault(appBarChildren.length > 0 ? optionsAppBar : optionsToolbar, 'android', 'background', `@drawable/${$android_Resource.addImageURL(node.css('backgroundImage'))}`);
                    node.excludeResource |= $enum.NODE_RESOURCE.IMAGE_SOURCE;
                }
                else {
                    $util.overwriteDefault(optionsToolbar, 'app', 'layout_scrollFlags', 'scroll|enterAlways');
                }
            }
            if (appBarChildren.length > 0) {
                $util.overwriteDefault(optionsAppBar, 'android', 'layout_height', '?android:attr/actionBarSize');
            }
            else {
                $util.overwriteDefault(optionsToolbar, 'android', 'layout_height', '?android:attr/actionBarSize');
                node.excludeProcedure |= $enum.NODE_PROCEDURE.LAYOUT;
            }
            if (hasMenu) {
                if (hasAppBar) {
                    if (optionsToolbar['app'].popupTheme) {
                        popupOverlay = optionsToolbar['app'].popupTheme.replace('@style/', '');
                    }
                    optionsToolbar['app'].popupTheme = '@style/AppTheme.PopupOverlay';
                }
            }
            const innerDepth = depth + (hasAppBar ? 1 : 0) + (hasCollapsingToolbar ? 1 : 0);
            output = controller.renderNodeStatic($android_const.VIEW_SUPPORT.TOOLBAR, innerDepth, $android_Resource.formatOptions(optionsToolbar, this.application.settings), 'match_parent', 'wrap_content', node, children > 0);
            if (hasCollapsingToolbar) {
                if (backgroundImage) {
                    const optionsBackgroundImage = $android_util.createViewAttribute(options.backgroundImage);
                    let scaleType = 'center';
                    switch (node.css('backgroundSize')) {
                        case 'cover':
                        case '100% auto':
                        case 'auto 100%':
                            scaleType = 'centerCrop';
                            break;
                        case 'contain':
                        case '100% 100%':
                            scaleType = 'fitXY';
                            break;
                        case 'auto':
                            scaleType = 'matrix';
                            break;
                    }
                    $util.overwriteDefault(optionsBackgroundImage, 'android', 'id', `${node.stringId}_image`);
                    $util.overwriteDefault(optionsBackgroundImage, 'android', 'src', `@drawable/${$android_Resource.addImageURL(node.css('backgroundImage'))}`);
                    $util.overwriteDefault(optionsBackgroundImage, 'android', 'scaleType', scaleType);
                    $util.overwriteDefault(optionsBackgroundImage, 'android', 'fitsSystemWindows', 'true');
                    $util.overwriteDefault(optionsBackgroundImage, 'app', 'layout_collapseMode', 'parallax');
                    output = controller.renderNodeStatic($android_const.NODE_ANDROID.IMAGE, innerDepth, $android_Resource.formatOptions(optionsBackgroundImage, this.application.settings), 'match_parent', 'match_parent') + output;
                    node.excludeResource |= $enum.NODE_RESOURCE.IMAGE_SOURCE;
                }
            }
            let outer = '';
            let appBarNode;
            let collapsingToolbarNode;
            if (hasAppBar) {
                $util.overwriteDefault(optionsAppBar, 'android', 'id', `${node.stringId}_appbar`);
                $util.overwriteDefault(optionsAppBar, 'android', 'layout_height', node.viewHeight > 0 ? $android_util.delimitUnit('appbar', 'height', $util.formatPX(node.viewHeight), this.application.settings) : 'wrap_content');
                $util.overwriteDefault(optionsAppBar, 'android', 'fitsSystemWindows', 'true');
                if (hasMenu) {
                    if (optionsAppBar['android'].theme) {
                        appBarOverlay = optionsAppBar['android'].theme;
                    }
                    optionsAppBar['android'].theme = '@style/AppTheme.AppBarOverlay';
                    this.setStyleTheme(appBarOverlay, popupOverlay);
                }
                else {
                    $util.overwriteDefault(optionsAppBar, 'android', 'theme', '@style/ThemeOverlay.AppCompat.Dark.ActionBar');
                }
                appBarNode = this.createPlaceholder(this.application.cacheProcessing.nextId, node, appBarChildren);
                appBarNode.parent = node.parent;
                appBarNode.nodeId = $android_util.stripId(optionsAppBar['android'].id);
                this.application.cacheProcessing.append(appBarNode, appBarChildren.length > 0);
                outer = controller.renderNodeStatic($android_const.VIEW_SUPPORT.APPBAR, target ? -1 : depth, $android_Resource.formatOptions(optionsAppBar, this.application.settings), 'match_parent', 'wrap_content', appBarNode, true);
                if (hasCollapsingToolbar) {
                    depth++;
                    $util.overwriteDefault(optionsCollapsingToolbar, 'android', 'id', `${node.stringId}_collapsingtoolbar`);
                    $util.overwriteDefault(optionsCollapsingToolbar, 'android', 'fitsSystemWindows', 'true');
                    if (!backgroundImage) {
                        $util.overwriteDefault(optionsCollapsingToolbar, 'app', 'contentScrim', '?attr/colorPrimary');
                    }
                    $util.overwriteDefault(optionsCollapsingToolbar, 'app', 'layout_scrollFlags', 'scroll|exitUntilCollapsed');
                    $util.overwriteDefault(optionsCollapsingToolbar, 'app', 'toolbarId', node.stringId);
                    collapsingToolbarNode = this.createPlaceholder(this.application.cacheProcessing.nextId, node, collapsingToolbarChildren);
                    collapsingToolbarNode.parent = appBarNode;
                    if (collapsingToolbarNode) {
                        collapsingToolbarNode.each(item => item.dataset.target = collapsingToolbarNode.nodeId);
                        this.application.cacheProcessing.append(collapsingToolbarNode, collapsingToolbarChildren.length > 0);
                        const content = controller.renderNodeStatic($android_const.VIEW_SUPPORT.COLLAPSING_TOOLBAR, target && !hasAppBar ? -1 : depth, $android_Resource.formatOptions(optionsCollapsingToolbar, this.application.settings), 'match_parent', 'match_parent', collapsingToolbarNode, true);
                        outer = $xml.replacePlaceholder(outer, appBarNode.id, content);
                    }
                }
            }
            if (appBarNode) {
                output = $xml.replacePlaceholder(outer, collapsingToolbarNode ? collapsingToolbarNode.id : appBarNode.id, output);
                appBarNode.render(target ? appBarNode : parent);
                if (!collapsingToolbarNode) {
                    node.parent = appBarNode;
                }
                else {
                    collapsingToolbarNode.parent = appBarNode;
                    collapsingToolbarNode.render(appBarNode);
                    node.parent = collapsingToolbarNode;
                }
                node.data(WIDGET_NAME.TOOLBAR, 'outerParent', appBarNode.stringId);
                node.render(node.parent);
            }
            else if (collapsingToolbarNode) {
                collapsingToolbarNode.render(target ? collapsingToolbarNode : parent);
                node.parent = collapsingToolbarNode;
                node.render(collapsingToolbarNode);
            }
            else {
                node.render(target ? node : parent);
            }
            node.nodeType = $enum.NODE_STANDARD.BLOCK;
            node.excludeResource |= $enum.NODE_RESOURCE.FONT_STYLE;
            return { output, complete: false };
        }
        processChild() {
            const node = this.node;
            if (node.imageElement && ($util.hasValue(node.dataset.navigationIcon) || $util.hasValue(node.dataset.collapseIcon))) {
                node.hide();
                return { output: '', complete: true, next: true };
            }
            return { output: '', complete: false };
        }
        beforeInsert() {
            const node = this.node;
            const menu = $util.optional($dom.getNestedExtension(node.element, WIDGET_NAME.MENU), 'dataset.layoutName');
            if (menu !== '') {
                const options = Object.assign({}, this.options[node.element.id]);
                const optionsToolbar = $android_util.createViewAttribute(options.self);
                $util.overwriteDefault(optionsToolbar, 'app', 'menu', `@menu/${menu}`);
                node.app('menu', optionsToolbar['app'].menu);
            }
        }
        setStyleTheme(appBarOverlay, popupOverlay) {
            const options = Object.assign({}, this.options.resource);
            $util.overwriteDefault(options, 'appTheme', 'AppTheme');
            $util.overwriteDefault(options, 'parentTheme', 'Theme.AppCompat.Light.DarkActionBar');
            const data = {
                'appTheme': options.appTheme,
                'parentTheme': options.parentTheme,
                'appBarOverlay': appBarOverlay || 'ThemeOverlay.AppCompat.Dark.ActionBar',
                'popupOverlay': popupOverlay || 'ThemeOverlay.AppCompat.Light',
                '1': []
            };
            $util.overwriteDefault(options, 'output', 'path', 'res/values');
            $util.overwriteDefault(options, 'output', 'file', `${WIDGET_NAME.TOOLBAR}.xml`);
            this.application.resourceHandler.addStyleTheme(EXTENSION_APPBAR_TMPL, data, options);
        }
        createPlaceholder(nextId, container, nodes) {
            const placeholder = new $View(nextId, undefined, this.application.viewController.delegateNodeInit);
            placeholder.init();
            nodes.forEach(item => item.parent = placeholder);
            placeholder.inherit(container, 'dimensions');
            placeholder.auto = false;
            placeholder.excludeResource |= $enum.NODE_RESOURCE.ALL;
            return placeholder;
        }
    }

    const toolbar$1 = new Toolbar(WIDGET_NAME.TOOLBAR, WIDGET_NAME.__FRAMEWORK);
    if (androme) {
        androme.registerExtensionAsync(toolbar$1);
    }

    return toolbar$1;

}());
