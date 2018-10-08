import { SettingsAndroid } from '../../lib/types';
import View from '../../view';
import ResourceHandler from '../../resourcehandler';
import { delimitDimens, stripId } from '../../lib/util';
import { NODE_ANDROID } from '../../lib/constant';
import { DRAWABLE_PREFIX, VIEW_SUPPORT, WIDGET_NAME } from '../lib/constant';

import $enum = androme.lib.enumeration;
import $const = androme.lib.constant;
import $util = androme.lib.util;
import $dom = androme.lib.dom;
import $xml = androme.lib.xml;

import EXTENSION_APPBAR_TMPL from '../../template/extension/appbar';

export default class Toolbar<T extends View> extends androme.lib.base.Extension<T> {
    constructor(name: string, framework = 0, tagNames?: string[], options?: {}) {
        super(name, framework, tagNames, options);
        this.require(WIDGET_NAME.MENU);
    }

    public init(element: HTMLElement) {
        if (this.included(element)) {
            Array
                .from(element.children)
                .some((item: HTMLElement) => {
                    if (item.tagName === 'NAV' && !$util.includes(item.dataset.ext, $const.EXT_NAME.EXTERNAL)) {
                        item.dataset.ext = ($util.hasValue(item.dataset.ext) ? `${item.dataset.ext}, ` : '') + $const.EXT_NAME.EXTERNAL;
                        return true;
                    }
                    return false;
                });
            if (element.dataset.target) {
                const target = document.getElementById(element.dataset.target);
                if (target &&
                    element.parentElement !== target &&
                    !$util.includes(target.dataset.ext, WIDGET_NAME.COORDINATOR))
                {
                    this.application.elements.add(element);
                }
            }
        }
        return false;
    }

    public processNode(): ExtensionResult {
        const controller = this.application.viewController;
        const node = this.node;
        const parent = this.parent as T;
        const target = $util.hasValue(node.dataset.target);
        const options = Object.assign({}, this.options[node.element.id]);
        const optionsToolbar = Object.assign({}, options.toolbar);
        const optionsAppBar = Object.assign({}, options.appBar);
        const optionsCollapsingToolbar = Object.assign({}, options.collapsingToolbar);
        const hasMenu = $dom.locateExtension(node.element, WIDGET_NAME.MENU) != null;
        const backgroundImage = node.has('backgroundImage');
        const appBarChildren: T[] = [];
        const collapsingToolbarChildren: T[] = [];
        let output = '';
        let depth = target ? 0 : node.depth;
        let children = node.children.filter(item => item.auto).length;
        Array
            .from(node.element.children)
            .forEach((element: HTMLElement) => {
                if (element.tagName === 'IMG') {
                    if ($util.hasValue(element.dataset.navigationIcon)) {
                        const result = ResourceHandler.addImageSrcSet(<HTMLImageElement> element, DRAWABLE_PREFIX.MENU);
                        if (result !== '') {
                            $util.overwriteDefault(toolbar, 'app', 'navigationIcon', `@drawable/${result}`);
                            if ($dom.getStyle(element).display !== 'none') {
                                children--;
                            }
                        }
                    }
                    if ($util.hasValue(element.dataset.collapseIcon)) {
                        const result = ResourceHandler.addImageSrcSet(<HTMLImageElement> element, DRAWABLE_PREFIX.MENU);
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
                    const targetNode = $dom.getNodeFromElement<T>(element);
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
        const hasCollapsingToolbar = options.collapsingToolbar != null || collapsingToolbarChildren.length > 0;
        const hasAppBar = options.appBar != null || appBarChildren.length > 0 || hasCollapsingToolbar;
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
                $util.overwriteDefault(appBarChildren.length > 0 ? optionsAppBar : optionsToolbar, 'android', 'background', `@drawable/${ResourceHandler.addImageURL(node.css('backgroundImage'))}`);
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
                if (optionsToolbar.app.popupTheme) {
                    popupOverlay = optionsToolbar.app.popupTheme.replace('@style/', '');
                }
                optionsToolbar.app.popupTheme = '@style/AppTheme.PopupOverlay';
            }
        }
        const innerDepth = depth + (hasAppBar ? 1 : 0) + (hasCollapsingToolbar ? 1 : 0);
        output =
            controller.renderNodeStatic(
                VIEW_SUPPORT.TOOLBAR,
                innerDepth,
                optionsToolbar,
                'match_parent',
                'wrap_content',
                node,
                children > 0
            );
        if (hasCollapsingToolbar) {
            if (backgroundImage) {
                const optionsBackgroundImage = Object.assign({}, options.backgroundImage);
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
                $util.overwriteDefault(optionsBackgroundImage, 'android', 'src', `@drawable/${ResourceHandler.addImageURL(node.css('backgroundImage'))}`);
                $util.overwriteDefault(optionsBackgroundImage, 'android', 'scaleType', scaleType);
                $util.overwriteDefault(optionsBackgroundImage, 'android', 'fitsSystemWindows', 'true');
                $util.overwriteDefault(optionsBackgroundImage, 'app', 'layout_collapseMode', 'parallax');
                output =
                    controller.renderNodeStatic(
                        NODE_ANDROID.IMAGE,
                        innerDepth,
                        optionsBackgroundImage,
                        'match_parent',
                        'match_parent'
                    )
                    + output;
                node.excludeResource |= $enum.NODE_RESOURCE.IMAGE_SOURCE;
            }
        }
        let outer = '';
        let appBarNode: Null<T> = null;
        let collapsingToolbarNode: Null<T> = null;
        if (hasAppBar) {
            $util.overwriteDefault(optionsAppBar, 'android', 'id', `${node.stringId}_appbar`);
            $util.overwriteDefault(optionsAppBar, 'android', 'layout_height', node.viewHeight > 0 ? delimitDimens('appbar', 'height', $util.formatPX(node.viewHeight), <SettingsAndroid> this.application.settings) : 'wrap_content');
            $util.overwriteDefault(optionsAppBar, 'android', 'fitsSystemWindows', 'true');
            if (hasMenu) {
                if (optionsAppBar.android.theme) {
                    appBarOverlay = optionsAppBar.android.theme;
                }
                optionsAppBar.android.theme = '@style/AppTheme.AppBarOverlay';
                this.createResourceTheme(appBarOverlay, popupOverlay);
            }
            else {
                $util.overwriteDefault(optionsAppBar, 'android', 'theme', '@style/ThemeOverlay.AppCompat.Dark.ActionBar');
            }
            appBarNode = this.createPlaceholder(this.application.cache.nextId, node, appBarChildren) as T;
            appBarNode.parent = node.parent;
            appBarNode.nodeId = stripId(optionsAppBar.android.id);
            this.application.cache.append(appBarNode);
            outer =
                controller.renderNodeStatic(
                    VIEW_SUPPORT.APPBAR,
                    target ? -1 : depth,
                    optionsAppBar,
                    'match_parent',
                    'wrap_content',
                    appBarNode,
                    true
                );
            if (hasCollapsingToolbar) {
                depth++;
                $util.overwriteDefault(optionsCollapsingToolbar, 'android', 'id', `${node.stringId}_collapsingtoolbar`);
                $util.overwriteDefault(optionsCollapsingToolbar, 'android', 'fitsSystemWindows', 'true');
                if (!backgroundImage) {
                    $util.overwriteDefault(optionsCollapsingToolbar, 'app', 'contentScrim', '?attr/colorPrimary');
                }
                $util.overwriteDefault(optionsCollapsingToolbar, 'app', 'layout_scrollFlags', 'scroll|exitUntilCollapsed');
                $util.overwriteDefault(optionsCollapsingToolbar, 'app', 'toolbarId', node.stringId);
                collapsingToolbarNode = this.createPlaceholder(this.application.cache.nextId, node, collapsingToolbarChildren) as T;
                collapsingToolbarNode.parent = appBarNode;
                if (collapsingToolbarNode) {
                    collapsingToolbarNode.each(item => item.dataset.target = (collapsingToolbarNode as T).nodeId);
                    this.application.cache.append(collapsingToolbarNode);
                    const content =
                        controller.renderNodeStatic(
                            VIEW_SUPPORT.COLLAPSING_TOOLBAR,
                            target && !hasAppBar ? -1 : depth,
                            optionsCollapsingToolbar,
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
            output = collapsingToolbarNode ? $xml.replacePlaceholder(outer, collapsingToolbarNode.id, output)
                                           : $xml.replacePlaceholder(outer, appBarNode.id, output);
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

    public processChild(): ExtensionResult {
        const node = this.node;
        if (node.imageElement && ($util.hasValue(node.dataset.navigationIcon) || $util.hasValue(node.dataset.collapseIcon))) {
            node.hide();
            return { output: '', complete: true, next: true };
        }
        return { output: '', complete: false };
    }

    public beforeInsert() {
        const node = this.node;
        const menu: string = $util.optional($dom.locateExtension(node.element, WIDGET_NAME.MENU), 'dataset.layoutName');
        if (menu !== '') {
            const options = Object.assign({}, this.options[node.element.id]);
            const optionsToolbar = Object.assign({}, options.toolbar);
            $util.overwriteDefault(optionsToolbar, 'app', 'menu', `@menu/${menu}`);
            node.app('menu', optionsToolbar.app.menu);
        }
    }

    private createResourceTheme(appBarOverlay: string, popupOverlay: string) {
        const options = Object.assign({}, this.options.resource);
        $util.overwriteDefault(options, '', 'appTheme', 'AppTheme');
        $util.overwriteDefault(options, '', 'parentTheme', 'Theme.AppCompat.Light.DarkActionBar');
        const data = {
            '0': [{
                    'appTheme': options.appTheme,
                    'parentTheme': options.parentTheme,
                    'appBarOverlay': appBarOverlay || 'ThemeOverlay.AppCompat.Dark.ActionBar',
                    'popupOverlay': popupOverlay || 'ThemeOverlay.AppCompat.Light',
                    '1': []
                }]
        };
        $util.overwriteDefault(options, 'output', 'path', 'res/values');
        $util.overwriteDefault(options, 'output', 'file', `${WIDGET_NAME.TOOLBAR}.xml`);
        this.application.resourceHandler.addTheme(EXTENSION_APPBAR_TMPL, data, options);
    }

    private createPlaceholder(nextId: number, node: T, children: T[] = []) {
        const placeholder = new View(nextId);
        placeholder.init();
        placeholder.api = node.api;
        for (const item of children) {
            item.parent = placeholder;
        }
        placeholder.inherit(node, 'dimensions');
        placeholder.auto = false;
        placeholder.excludeResource |= $enum.NODE_RESOURCE.ALL;
        return placeholder;
    }
}