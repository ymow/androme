/* android.widget 2.4.0
   https://github.com/anpham6/androme */

this.android = this.android || {};
this.android.widget = this.android.widget || {};
this.android.widget.toolbar = (function () {
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
        '!1',
        '	<style name="{&appTheme}" parent="{~parentTheme}">',
        '!items',
        '		<item name="{&name}">{&value}</item>',
        '!items',
        '	</style>',
        '!1',
        '	<style name="{&appTheme}.NoActionBar">',
        '		<item name="windowActionBar">false</item>',
        '		<item name="windowNoTitle">true</item>',
        '	</style>',
        '	<style name="{&appTheme}.AppBarOverlay" parent="{~appBarOverlay}" />',
        '	<style name="{&appTheme}.PopupOverlay" parent="{~popupOverlay}" />',
        '</resources>'
    ];
    var EXTENSION_TOOLBAR_TMPL = template.join('\n');

    var $Resource = android.lib.base.Resource;
    var $const = androme.lib.constant;
    var $dom = androme.lib.dom;
    var $enum = androme.lib.enumeration;
    var $util = androme.lib.util;
    var $xml = androme.lib.xml;
    var $android_const = android.lib.constant;
    var $android_enum = android.lib.enumeration;
    var $android_util = android.lib.util;
    class Toolbar extends androme.lib.base.Extension {
        constructor(name, framework, tagNames, options) {
            super(name, framework, tagNames, options);
            this.require("android.widget.menu" /* MENU */);
        }
        init(element) {
            if (this.included(element)) {
                Array.from(element.children).some((item) => {
                    if (item.tagName === 'NAV' && !$util.includes(item.dataset.use, $const.EXT_NAME.EXTERNAL)) {
                        item.dataset.use = ($util.hasValue(item.dataset.use) ? `${item.dataset.use}, ` : '') + $const.EXT_NAME.EXTERNAL;
                        return true;
                    }
                    return false;
                });
                if (element.dataset.target) {
                    const target = document.getElementById(element.dataset.target);
                    if (target && element.parentElement !== target && !$util.includes(target.dataset.use, "android.widget.coordinator" /* COORDINATOR */)) {
                        this.application.parseElements.add(element);
                    }
                }
            }
            return false;
        }
        processNode(node, parent) {
            const application = this.application;
            const controller = application.controllerHandler;
            const target = $util.hasValue(node.dataset.target);
            const options = Object.assign({}, this.options[node.element.id]);
            const toolbarOptions = $android_util.createAttribute(options.self);
            const appBarOptions = $android_util.createAttribute(options.appBar);
            const collapsingToolbarOptions = $android_util.createAttribute(options.collapsingToolbar);
            const hasMenu = Toolbar.findNestedByName(node.element, "android.widget.menu" /* MENU */);
            const backgroundImage = node.has('backgroundImage');
            const appBarChildren = [];
            const collapsingToolbarChildren = [];
            let depth = target ? 0 : parent.renderDepth + 1;
            let children = node.filter(item => !item.positioned).length;
            Array.from(node.element.children).forEach((element) => {
                if (element.tagName === 'IMG') {
                    if ($util.hasValue(element.dataset.navigationIcon)) {
                        const result = $Resource.addImageSrcSet(element, $android_const.PREFIX_ANDROID.MENU);
                        if (result !== '') {
                            $util.defaultWhenNull(toolbar, 'app', 'navigationIcon', `@drawable/${result}`);
                            if ($dom.getStyle(element).display !== 'none') {
                                children--;
                            }
                        }
                    }
                    if ($util.hasValue(element.dataset.collapseIcon)) {
                        const result = $Resource.addImageSrcSet(element, $android_const.PREFIX_ANDROID.MENU);
                        if (result !== '') {
                            $util.defaultWhenNull(toolbar, 'app', 'collapseIcon', `@drawable/${result}`);
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
                    const targetNode = $dom.getElementAsNode(element);
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
            const hasCollapsingToolbar = options.hasOwnProperty('collapsingToolbar') || collapsingToolbarChildren.length;
            const hasAppBar = options.hasOwnProperty('appBar') || appBarChildren.length || hasCollapsingToolbar;
            let appBarOverlay = '';
            let popupOverlay = '';
            if (hasCollapsingToolbar) {
                $util.defaultWhenNull(toolbarOptions, 'app', 'layout_collapseMode', 'pin');
            }
            else {
                if (!hasAppBar) {
                    $util.defaultWhenNull(toolbarOptions, 'android', 'fitsSystemWindows', 'true');
                }
                $util.defaultWhenNull(toolbarOptions, 'app', 'popupTheme', '@style/ThemeOverlay.AppCompat.Light');
                if (backgroundImage) {
                    $util.defaultWhenNull(appBarChildren.length ? appBarOptions : toolbarOptions, 'android', 'background', `@drawable/${$Resource.addImageUrl(node.css('backgroundImage'))}`);
                    node.exclude({ resource: $enum.NODE_RESOURCE.IMAGE_SOURCE });
                }
                else {
                    $util.defaultWhenNull(toolbarOptions, 'app', 'layout_scrollFlags', 'scroll|enterAlways');
                }
            }
            if (appBarChildren.length) {
                $util.defaultWhenNull(appBarOptions, 'android', 'layout_height', '?android:attr/actionBarSize');
            }
            else {
                $util.defaultWhenNull(toolbarOptions, 'android', 'layout_height', '?android:attr/actionBarSize');
                node.exclude({ procedure: $enum.NODE_PROCEDURE.LAYOUT });
            }
            if (hasMenu) {
                if (hasAppBar) {
                    if (toolbarOptions.app.popupTheme) {
                        popupOverlay = toolbarOptions.app.popupTheme.replace('@style/', '');
                    }
                    toolbarOptions.app.popupTheme = '@style/AppTheme.PopupOverlay';
                }
            }
            const innerDepth = depth + (hasAppBar ? 1 : 0) + (hasCollapsingToolbar ? 1 : 0);
            const numberResourceValue = application.extensionManager.optionValueAsBoolean($android_const.EXT_ANDROID.RESOURCE_STRINGS, 'numberResourceValue');
            node.setControlType($android_const.SUPPORT_ANDROID.TOOLBAR, $android_enum.CONTAINER_NODE.BLOCK);
            let output = controller.renderNodeStatic($android_const.SUPPORT_ANDROID.TOOLBAR, innerDepth, $Resource.formatOptions(toolbarOptions, numberResourceValue), 'match_parent', 'wrap_content', node, children > 0);
            if (hasCollapsingToolbar) {
                if (backgroundImage) {
                    const backgroundImageOptions = $android_util.createAttribute(options.backgroundImage);
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
                    $util.defaultWhenNull(backgroundImageOptions, 'android', 'id', `${node.documentId}_image`);
                    $util.defaultWhenNull(backgroundImageOptions, 'android', 'src', `@drawable/${$Resource.addImageUrl(node.css('backgroundImage'))}`);
                    $util.defaultWhenNull(backgroundImageOptions, 'android', 'scaleType', scaleType);
                    $util.defaultWhenNull(backgroundImageOptions, 'android', 'fitsSystemWindows', 'true');
                    $util.defaultWhenNull(backgroundImageOptions, 'app', 'layout_collapseMode', 'parallax');
                    output = controller.renderNodeStatic($android_const.CONTAINER_ANDROID.IMAGE, innerDepth, $Resource.formatOptions(backgroundImageOptions, numberResourceValue), 'match_parent', 'match_parent') + output;
                    node.exclude({ resource: $enum.NODE_RESOURCE.IMAGE_SOURCE });
                }
            }
            let outer = '';
            let appBarNode;
            let collapsingToolbarNode;
            if (hasAppBar) {
                $util.defaultWhenNull(appBarOptions, 'android', 'id', `${node.documentId}_appbar`);
                $util.defaultWhenNull(appBarOptions, 'android', 'layout_height', node.hasHeight ? $util.formatPX(node.height) : 'wrap_content');
                $util.defaultWhenNull(appBarOptions, 'android', 'fitsSystemWindows', 'true');
                if (hasMenu) {
                    if (appBarOptions.android.theme) {
                        appBarOverlay = appBarOptions.android.theme;
                    }
                    appBarOptions.android.theme = '@style/AppTheme.AppBarOverlay';
                    node.data("android.widget.toolbar" /* TOOLBAR */, 'themeData', {
                        target,
                        appBarOverlay,
                        popupOverlay
                    });
                }
                else {
                    $util.defaultWhenNull(appBarOptions, 'android', 'theme', '@style/ThemeOverlay.AppCompat.Dark.ActionBar');
                }
                appBarNode = this.createPlaceholder(node, appBarChildren);
                appBarNode.parent = node.parent;
                appBarNode.controlId = $android_util.stripId(appBarOptions.android.id);
                appBarNode.setControlType($android_const.SUPPORT_ANDROID.APPBAR, $android_enum.CONTAINER_NODE.BLOCK);
                application.processing.cache.append(appBarNode, appBarChildren.length > 0);
                outer = controller.renderNodeStatic($android_const.SUPPORT_ANDROID.APPBAR, target ? -1 : depth, $Resource.formatOptions(appBarOptions, numberResourceValue), 'match_parent', 'wrap_content', appBarNode, true);
                if (hasCollapsingToolbar) {
                    depth++;
                    $util.defaultWhenNull(collapsingToolbarOptions, 'android', 'id', `${node.documentId}_collapsingtoolbar`);
                    $util.defaultWhenNull(collapsingToolbarOptions, 'android', 'fitsSystemWindows', 'true');
                    if (!backgroundImage) {
                        $util.defaultWhenNull(collapsingToolbarOptions, 'app', 'contentScrim', '?attr/colorPrimary');
                    }
                    $util.defaultWhenNull(collapsingToolbarOptions, 'app', 'layout_scrollFlags', 'scroll|exitUntilCollapsed');
                    $util.defaultWhenNull(collapsingToolbarOptions, 'app', 'toolbarId', node.documentId);
                    collapsingToolbarNode = this.createPlaceholder(node, collapsingToolbarChildren);
                    collapsingToolbarNode.parent = appBarNode;
                    if (collapsingToolbarNode) {
                        collapsingToolbarNode.each(item => item.dataset.target = collapsingToolbarNode.controlId);
                        collapsingToolbarNode.setControlType($android_const.SUPPORT_ANDROID.COLLAPSING_TOOLBAR, $android_enum.CONTAINER_NODE.BLOCK);
                        application.processing.cache.append(collapsingToolbarNode, collapsingToolbarChildren.length > 0);
                        const content = controller.renderNodeStatic($android_const.SUPPORT_ANDROID.COLLAPSING_TOOLBAR, target && !hasAppBar ? -1 : depth, $Resource.formatOptions(collapsingToolbarOptions, numberResourceValue), 'match_parent', 'match_parent', collapsingToolbarNode, true);
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
                node.data("android.widget.toolbar" /* TOOLBAR */, 'outerParent', appBarNode.documentId);
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
            node.containerType = $android_enum.CONTAINER_NODE.BLOCK;
            node.exclude({ resource: $enum.NODE_RESOURCE.FONT_STYLE });
            return { output };
        }
        processChild(node) {
            let next = false;
            if (node.imageElement && ($util.hasValue(node.dataset.navigationIcon) || $util.hasValue(node.dataset.collapseIcon))) {
                node.hide();
                next = true;
            }
            return { output: '', next };
        }
        postProcedure(node) {
            const menu = $util.optionalAsString(Toolbar.findNestedByName(node.element, "android.widget.menu" /* MENU */), 'dataset.layoutName');
            if (menu !== '') {
                const options = Object.assign({}, this.options[node.element.id]);
                const toolbarOptions = $android_util.createAttribute(options.self);
                $util.defaultWhenNull(toolbarOptions, 'app', 'menu', `@menu/${menu}`);
                node.app('menu', toolbarOptions.app.menu);
            }
            const themeData = node.data("android.widget.toolbar" /* TOOLBAR */, 'themeData');
            if (themeData) {
                this.setStyleTheme(themeData);
            }
        }
        setStyleTheme(themeData) {
            if (this.application.resourceHandler.fileHandler) {
                const options = Object.assign({}, this.options.resource);
                $util.defaultWhenNull(options, 'appTheme', getAppTheme(this.application.resourceHandler.fileHandler.assets) || 'AppTheme');
                $util.defaultWhenNull(options, 'parentTheme', 'Theme.AppCompat.Light.DarkActionBar');
                const data = {
                    'appTheme': options.appTheme,
                    'appBarOverlay': themeData.appBarOverlay || 'ThemeOverlay.AppCompat.Dark.ActionBar',
                    'popupOverlay': themeData.popupOverlay || 'ThemeOverlay.AppCompat.Light',
                    '1': [{
                            'appTheme': options.appTheme,
                            'parentTheme': options.parentTheme,
                            'items': []
                        }]
                };
                if (themeData.target) {
                    data['1'] = false;
                }
                else {
                    data['items'] = data['1'][0]['items'];
                }
                $util.defaultWhenNull(options, 'output', 'path', 'res/values');
                $util.defaultWhenNull(options, 'output', 'file', `${"android.widget.toolbar" /* TOOLBAR */}.xml`);
                this.application.resourceHandler.addStyleTheme(EXTENSION_TOOLBAR_TMPL, data, options);
            }
        }
        createPlaceholder(node, children) {
            const placeholder = this.application.createNode($dom.createElement(node.actualParent ? node.actualParent.baseElement : null, node.block));
            placeholder.inherit(node, 'base');
            placeholder.exclude({ resource: $enum.NODE_RESOURCE.ALL });
            placeholder.positioned = true;
            let siblingIndex = Number.MAX_VALUE;
            children.forEach(item => {
                siblingIndex = Math.min(siblingIndex, item.siblingIndex);
                item.parent = placeholder;
            });
            placeholder.siblingIndex = siblingIndex;
            return placeholder;
        }
    }

    const toolbar$1 = new Toolbar("android.widget.toolbar" /* TOOLBAR */, 2 /* ANDROID */);
    if (androme) {
        androme.includeAsync(toolbar$1);
    }

    return toolbar$1;

}());
