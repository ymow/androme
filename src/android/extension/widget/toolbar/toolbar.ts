import { WIDGET_NAME, getAppTheme } from '../common';

import EXTENSION_TOOLBAR_TMPL from '../__template/toolbar';

import $const = androme.lib.constant;
import $dom = androme.lib.dom;
import $enum = androme.lib.enumeration;
import $util = androme.lib.util;
import $xml = androme.lib.xml;

import $Resource = android.lib.base.Resource;
import $View = android.lib.base.View;

import $android_const = android.lib.constant;
import $android_util = android.lib.util;

type ToolbarThemeData = {
    target: boolean;
    appBarOverlay: string;
    popupOverlay: string;
};

export default class Toolbar<T extends $View> extends androme.lib.base.Extension<T> {
    constructor(
        name: string,
        framework: number,
        tagNames?: string[],
        options?: ExternalData)
    {
        super(name, framework, tagNames, options);
        this.require(WIDGET_NAME.MENU);
    }

    public init(element: HTMLElement) {
        if (this.included(element)) {
            Array.from(element.children).some((item: HTMLElement) => {
                if (item.tagName === 'NAV' && !$util.includes(item.dataset.import, $const.EXT_NAME.EXTERNAL)) {
                    item.dataset.import = ($util.hasValue(item.dataset.import) ? `${item.dataset.import}, ` : '') + $const.EXT_NAME.EXTERNAL;
                    return true;
                }
                return false;
            });
            if (element.dataset.target) {
                const target = document.getElementById(element.dataset.target);
                if (target && element.parentElement !== target && !$util.includes(target.dataset.import, WIDGET_NAME.COORDINATOR)) {
                    this.application.parseElements.add(element);
                }
            }
        }
        return false;
    }

    public processNode(node: T, parent: T): ExtensionResult<T> {
        const application = this.application;
        const controller = application.controllerHandler;
        const target = $util.hasValue(node.dataset.target);
        const options: ExternalData = Object.assign({}, this.options[node.element.id]);
        const toolbarOptions = $android_util.createAttribute(options.self);
        const appBarOptions = $android_util.createAttribute(options.appBar);
        const collapsingToolbarOptions = $android_util.createAttribute(options.collapsingToolbar);
        const hasMenu = Toolbar.findNestedByName(node.element, WIDGET_NAME.MENU);
        const backgroundImage = node.has('backgroundImage');
        const appBarChildren: T[] = [];
        const collapsingToolbarChildren: T[] = [];
        let output: string;
        let depth = target ? 0 : node.depth;
        let children = node.filter(item => !item.positioned).length;
        Array.from(node.element.children).forEach((element: HTMLElement) => {
            if (element.tagName === 'IMG') {
                if ($util.hasValue(element.dataset.navigationIcon)) {
                    const result = $Resource.addImageSrcSet(<HTMLImageElement> element, $android_const.PREFIX_ANDROID.MENU);
                    if (result !== '') {
                        $util.defaultWhenNull(toolbar, 'app', 'navigationIcon', `@drawable/${result}`);
                        if ($dom.getStyle(element).display !== 'none') {
                            children--;
                        }
                    }
                }
                if ($util.hasValue(element.dataset.collapseIcon)) {
                    const result = $Resource.addImageSrcSet(<HTMLImageElement> element, $android_const.PREFIX_ANDROID.MENU);
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
                const targetNode = $dom.getElementAsNode<T>(element);
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
                if (toolbarOptions['app'].popupTheme) {
                    popupOverlay = toolbarOptions['app'].popupTheme.replace('@style/', '');
                }
                toolbarOptions['app'].popupTheme = '@style/AppTheme.PopupOverlay';
            }
        }
        const innerDepth = depth + (hasAppBar ? 1 : 0) + (hasCollapsingToolbar ? 1 : 0);
        const useNumberAlias = application.getExtensionOptionValueAsBoolean($android_const.EXT_ANDROID.RESOURCE_STRINGS, 'useNumberAlias');
        node.setControlType($android_const.SUPPORT_ANDROID.TOOLBAR, $enum.NODE_CONTAINER.BLOCK);
        output = controller.renderNodeStatic(
            $android_const.SUPPORT_ANDROID.TOOLBAR,
            innerDepth,
            $Resource.formatOptions(toolbarOptions, useNumberAlias),
            'match_parent',
            'wrap_content',
            node,
            children > 0
        );
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
                $util.defaultWhenNull(backgroundImageOptions, 'android', 'id', `${node.stringId}_image`);
                $util.defaultWhenNull(backgroundImageOptions, 'android', 'src', `@drawable/${$Resource.addImageUrl(node.css('backgroundImage'))}`);
                $util.defaultWhenNull(backgroundImageOptions, 'android', 'scaleType', scaleType);
                $util.defaultWhenNull(backgroundImageOptions, 'android', 'fitsSystemWindows', 'true');
                $util.defaultWhenNull(backgroundImageOptions, 'app', 'layout_collapseMode', 'parallax');
                output = controller.renderNodeStatic(
                    $android_const.CONTAINER_ANDROID.IMAGE,
                    innerDepth,
                    $Resource.formatOptions(backgroundImageOptions, useNumberAlias),
                    'match_parent',
                    'match_parent'
                ) + output;
                node.exclude({ resource: $enum.NODE_RESOURCE.IMAGE_SOURCE });
            }
        }
        let outer = '';
        let appBarNode: T | undefined;
        let collapsingToolbarNode: T | undefined;
        if (hasAppBar) {
            $util.defaultWhenNull(appBarOptions, 'android', 'id', `${node.stringId}_appbar`);
            $util.defaultWhenNull(appBarOptions, 'android', 'fitsSystemWindows', 'true');
            if (hasMenu) {
                if (appBarOptions['android'].theme) {
                    appBarOverlay = appBarOptions['android'].theme;
                }
                appBarOptions['android'].theme = '@style/AppTheme.AppBarOverlay';
                node.data(WIDGET_NAME.TOOLBAR, 'themeData', <ToolbarThemeData> {
                    target,
                    appBarOverlay,
                    popupOverlay
                });
            }
            else {
                $util.defaultWhenNull(appBarOptions, 'android', 'theme', '@style/ThemeOverlay.AppCompat.Dark.ActionBar');
            }
            appBarNode = this.createPlaceholder(application.nextId, node, parent, appBarChildren) as T;
            appBarNode.parent = node.parent;
            appBarNode.controlId = $android_util.stripId(appBarOptions['android'].id);
            appBarNode.setControlType($android_const.SUPPORT_ANDROID.APPBAR, $enum.NODE_CONTAINER.BLOCK);
            application.processing.cache.append(appBarNode, appBarChildren.length > 0);
            outer = controller.renderNodeStatic(
                $android_const.SUPPORT_ANDROID.APPBAR,
                target ? -1 : depth,
                $Resource.formatOptions(appBarOptions, useNumberAlias),
                'match_parent',
                'wrap_content',
                appBarNode,
                true
            );
            if (hasCollapsingToolbar) {
                depth++;
                $util.defaultWhenNull(collapsingToolbarOptions, 'android', 'id', `${node.stringId}_collapsingtoolbar`);
                $util.defaultWhenNull(collapsingToolbarOptions, 'android', 'fitsSystemWindows', 'true');
                if (!backgroundImage) {
                    $util.defaultWhenNull(collapsingToolbarOptions, 'app', 'contentScrim', '?attr/colorPrimary');
                }
                $util.defaultWhenNull(collapsingToolbarOptions, 'app', 'layout_scrollFlags', 'scroll|exitUntilCollapsed');
                $util.defaultWhenNull(collapsingToolbarOptions, 'app', 'toolbarId', node.stringId);
                collapsingToolbarNode = this.createPlaceholder(application.nextId, node, parent, collapsingToolbarChildren) as T;
                collapsingToolbarNode.parent = appBarNode;
                if (collapsingToolbarNode) {
                    collapsingToolbarNode.each(item => item.dataset.target = (collapsingToolbarNode as T).controlId);
                    collapsingToolbarNode.setControlType($android_const.SUPPORT_ANDROID.COLLAPSING_TOOLBAR, $enum.NODE_CONTAINER.BLOCK);
                    application.processing.cache.append(collapsingToolbarNode, collapsingToolbarChildren.length > 0);
                    const content = controller.renderNodeStatic(
                        $android_const.SUPPORT_ANDROID.COLLAPSING_TOOLBAR,
                        target && !hasAppBar ? -1 : depth,
                        $Resource.formatOptions(collapsingToolbarOptions, useNumberAlias),
                        'match_parent',
                        'match_parent',
                        collapsingToolbarNode,
                        true
                    );
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
        node.containerType = $enum.NODE_CONTAINER.BLOCK;
        node.exclude({ resource: $enum.NODE_RESOURCE.FONT_STYLE });
        return { output };
    }

    public processChild(node: T): ExtensionResult<T> {
        let next = false;
        if (node.imageElement && ($util.hasValue(node.dataset.navigationIcon) || $util.hasValue(node.dataset.collapseIcon))) {
            node.hide();
            next = true;
        }
        return { output: '', next };
    }

    public postProcedure(node: T) {
        const menu = $util.optionalAsString(Toolbar.findNestedByName(node.element, WIDGET_NAME.MENU), 'dataset.layoutName');
        if (menu !== '') {
            const options: ExternalData = Object.assign({}, this.options[node.element.id]);
            const toolbarOptions = $android_util.createAttribute(options.self);
            $util.defaultWhenNull(toolbarOptions, 'app', 'menu', `@menu/${menu}`);
            node.app('menu', toolbarOptions['app'].menu);
        }
        const themeData: ToolbarThemeData = node.data(WIDGET_NAME.TOOLBAR, 'themeData');
        if (themeData) {
            this.setStyleTheme(themeData);
        }
    }

    private setStyleTheme(themeData: ToolbarThemeData) {
        const options: ExternalData = Object.assign({}, this.options.resource);
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
            data['1'] = false as any;
        }
        else {
            data['items'] = data['1'][0]['items'];
        }
        $util.defaultWhenNull(options, 'output', 'path', 'res/values');
        $util.defaultWhenNull(options, 'output', 'file', `${WIDGET_NAME.TOOLBAR}.xml`);
        (<android.lib.base.Resource<T>> this.application.resourceHandler).addStyleTheme(EXTENSION_TOOLBAR_TMPL, data, options);
    }

    private createPlaceholder(nextId: number, node: T, parent: T, nodes: T[]) {
        const placeholder = new $View(nextId, $dom.createElement(parent.actualBoxParent.baseElement, node.block), this.application.controllerHandler.delegateNodeInit);
        placeholder.init();
        placeholder.inherit(node, 'dimensions');
        placeholder.positioned = true;
        placeholder.exclude({ resource: $enum.NODE_RESOURCE.ALL });
        nodes.forEach(item => item.parent = placeholder);
        return placeholder;
    }
}