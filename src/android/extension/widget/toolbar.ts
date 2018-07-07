import { ExtensionResult } from '../../../lib/types';
import Extension from '../../../base/extension';
import Resource from '../../../base/resource';
import View from '../../view';
import ViewList from '../../viewlist';
import { convertPX } from '../../../lib/util';
import { findNestedMenu, overwriteDefault } from '../lib/util';
import { formatDimen, restoreIndent } from '../../../lib/xml';
import { getStyle } from '../../../lib/dom';
import { VIEW_RESOURCE } from '../../../lib/constants';
import { EXT_NAME } from '../../../extension/lib/constants';
import { DRAWABLE_PREFIX, VIEW_SUPPORT, WIDGET_NAME } from '../lib/constants';

import EXTENSION_COLLAPSINGTOOLBAR_TMPL from '../../template/extension/collapsingtoolbar';
import { VIEW_ANDROID } from '../../constants';

type T = View;
type U = ViewList<T>;

export default class Toolbar extends Extension<T, U> {
    constructor(name: string, tagNames: string[] = [], options?: {}) {
        super(name, tagNames, options);
        this.require(WIDGET_NAME.MENU);
    }

    public init(element: HTMLElement) {
        if (this.included(element)) {
            Array.from(element.children).forEach((item: HTMLElement) => {
                if (item.tagName === 'NAV' && item.dataset.ext == null) {
                    item.dataset.ext = EXT_NAME.EXTERNAL;
                }
            });
            if (element.dataset.extFor != null) {
                const extFor = document.getElementById(element.dataset.extFor);
                if (extFor && element.parentElement !== extFor && extFor.dataset.ext && extFor.dataset.ext.indexOf(WIDGET_NAME.COORDINATOR) === -1) {
                    this.application.elements.add(element);
                    return true;
                }
            }
            if (element.parentElement && element.parentElement.dataset.ext && element.parentElement.dataset.ext.indexOf(WIDGET_NAME.COORDINATOR) !== -1) {
                (<any> element).__nodeIsolated = true;
            }
        }
        return false;
    }

    public condition() {
        return (super.condition() && this.included());
    }

    public processNode(): ExtensionResult {
        const controller = this.application.controllerHandler;
        const node = (<T> this.node);
        const extFor = (node.element.dataset.extFor != null && document.getElementById(node.element.dataset.extFor) !== node.parent.element);
        const options = Object.assign({}, (this.element != null ? this.options[this.element.id] : {}));
        const optionsToolbar = Object.assign({}, options.toolbar);
        const optionsAppBar = Object.assign({}, options.appBar);
        const optionsCollapsingToolbar = Object.assign({}, options.collapsingToolbar);
        const collapsingToolbar = (options.collapsingToolbar != null);
        const appBar = (extFor || options.appBar != null);
        let depth = (extFor ? 0 : node.depth + node.renderDepth);
        let children = node.children.filter(item => item.isolated).length;
        Array.from(node.element.children).forEach((element: HTMLElement) => {
            if (element.tagName === 'IMG') {
                if (element.dataset.navigationIcon != null) {
                    const result = Resource.addImageSrcSet(<HTMLImageElement> element, DRAWABLE_PREFIX.MENU);
                    if (result !== '') {
                        overwriteDefault(toolbar, 'app', 'navigationIcon', `@drawable/${result}`);
                        if (getStyle(element).display !== 'none') {
                            children++;
                        }
                    }
                }
                if (element.dataset.collapseIcon != null) {
                    const result = Resource.addImageSrcSet(<HTMLImageElement> element, DRAWABLE_PREFIX.MENU);
                    if (result !== '') {
                        overwriteDefault(toolbar, 'app', 'collapseIcon', `@drawable/${result}`);
                        if (getStyle(element).display !== 'none') {
                            children++;
                        }
                    }
                }
            }
        });
        let appBarOverlay = '';
        let popupOverlay = '';
        if (extFor) {
            overwriteDefault(optionsToolbar, 'android', 'layout_height', '?attr/actionBarSize');
            overwriteDefault(optionsToolbar, 'android', 'background', '?attr/colorPrimary');
        }
        if (collapsingToolbar) {
            overwriteDefault(optionsToolbar, 'app', 'layout_collapseMode', 'pin');
            if (optionsToolbar.app.popupTheme != null) {
                popupOverlay = optionsToolbar.app.popupTheme;
            }
            optionsToolbar.app.popupTheme = '@style/AppTheme.PopupOverlay';
        }
        else {
            overwriteDefault(optionsToolbar, 'app', 'popupTheme', '@style/ThemeOverlay.AppCompat.Light');
        }
        if (findNestedMenu(node) != null) {
            overwriteDefault(optionsToolbar, 'app', 'menu', `@menu/{${node.id}:${WIDGET_NAME.TOOLBAR}:menu}`);
        }
        node.depth = depth + (appBar ? 1 : 0) + (options.collapsingToolbar ? 1 : 0);
        let xml = controller.getViewStatic(VIEW_SUPPORT.TOOLBAR, node.depth, { android: optionsToolbar.android, app: optionsToolbar.app }, 'match_parent', 'wrap_content', node, (node.children.length - children > 0));
        if (collapsingToolbar) {
            const style = node.element.style;
            if (style.backgroundImage) {
                const optionsBackgroundImage = Object.assign({}, options.backgroundImage);
                let scaleType = 'matrix';
                switch (style.backgroundSize) {
                    case 'contain':
                    case '100% auto':
                        scaleType = 'centerInside';
                        break;
                    case 'cover':
                    case 'auto 100%':
                        scaleType = 'centerCrop';
                        break;
                    case '100% 100%':
                        scaleType = 'center';
                        break;
                }
                overwriteDefault(optionsBackgroundImage, 'android', 'id', `${node.stringId}_image`);
                overwriteDefault(optionsBackgroundImage, 'android', 'src', `@drawable/${Resource.addImageURL(<string> style.backgroundImage)}`);
                overwriteDefault(optionsBackgroundImage, 'android', 'scaleType', scaleType);
                overwriteDefault(optionsBackgroundImage, 'android', 'fitsSystemWindows', 'true');
                overwriteDefault(optionsBackgroundImage, 'app', 'layout_collapseMode', 'parallax');
                xml += controller.getViewStatic(VIEW_ANDROID.IMAGE, node.depth, { android: optionsBackgroundImage.android, app: optionsBackgroundImage.app }, 'match_parent', 'match_parent');
                node.ignoreResource |= VIEW_RESOURCE.IMAGE_SOURCE;
            }
        }
        let outer = '';
        if (appBar) {
            overwriteDefault(optionsAppBar, 'android', 'id', `${node.stringId}_appbar`);
            overwriteDefault(optionsAppBar, 'android', 'layout_height', (node.viewHeight > 0 ? formatDimen('appbar', 'height', convertPX(node.viewHeight)) : 'wrap_content'));
            if (collapsingToolbar) {
                overwriteDefault(optionsAppBar, 'android', 'fitsSystemWindows', 'true');
                if (optionsAppBar.android.theme != null) {
                    appBarOverlay = optionsAppBar.android.theme;
                }
                optionsAppBar.android.theme = '@style/AppTheme.AppBarOverlay';
            }
            else {
                overwriteDefault(optionsAppBar, 'android', 'theme', '@style/ThemeOverlay.AppCompat.Dark.ActionBar');
            }
            outer = controller.getViewStatic(VIEW_SUPPORT.APPBAR, (extFor ? -1 : depth), { android: optionsAppBar.android, app: optionsAppBar.app }, 'match_parent', 'wrap_content', null, true);
            if (collapsingToolbar) {
                overwriteDefault(optionsCollapsingToolbar, 'android', 'id', `${node.stringId}_collapsing`);
                overwriteDefault(optionsCollapsingToolbar, 'android', 'fitsSystemWindows', 'true');
                overwriteDefault(optionsCollapsingToolbar, 'app', 'contentScrim', '?attr/colorPrimary');
                overwriteDefault(optionsCollapsingToolbar, 'app', 'layout_scrollFlags', 'scroll|exitUntilCollapsed');
                overwriteDefault(optionsCollapsingToolbar, 'app', 'toolbarId', node.stringId);
                outer = outer.replace('{:0}', controller.getViewStatic(VIEW_SUPPORT.COLLAPSING_TOOLBAR, ++depth, { android: optionsCollapsingToolbar.android, app: optionsCollapsingToolbar.app }, 'match_parent', 'match_parent', null, true));
                this.createResourceTheme(appBarOverlay, popupOverlay);
            }
            node.viewId = optionsAppBar.android.id.replace('@+id/', '');
        }
        if (outer !== '') {
            xml = outer.replace('{:0}', xml);
        }
        let proceed = false;
        if (extFor) {
            node.data(`${WIDGET_NAME.TOOLBAR}:insert`, xml);
            node.render(node);
            xml = '';
            proceed = true;
        }
        else {
            node.applyCustomizations();
            node.render(<T> this.parent);
            node.renderDepth = node.depth;
            node.setGravity();
        }
        node.ignoreResource |= VIEW_RESOURCE.FONT_STYLE;
        return { xml, proceed };
    }

    public processChild(): ExtensionResult {
        const element = this.element;
        if (element && element.tagName === 'IMG' && (element.dataset.navigationIcon != null || element.dataset.collapseIcon != null)) {
            this.node.hide();
        }
        return { xml: '' };
    }

    public insert() {
        const node = (<T> this.node);
        const extFor = node.element.dataset.extFor;
        if (extFor != null) {
            const parent = (<T> this.application.findByDomId(extFor));
            const coordinator = this.application.cacheInternal.list.find(item => (item.isolated && item.parent === parent && item.viewName === VIEW_SUPPORT.COORDINATOR));
            if (coordinator != null) {
                let xml = (<string> node.data(`${WIDGET_NAME.TOOLBAR}:insert`)) || '';
                if (xml !== '') {
                    xml = restoreIndent(xml, node.renderDepth);
                    node.renderDepth = node.depth + 1;
                    this.application.addInsertQueue(coordinator.id, [xml]);
                }
            }
        }
    }

    public afterInsert() {
        const node = (<T> this.node);
        node.android('layout_height', '?attr/actionBarSize');
    }

    public finalize() {
        const node = (<T> this.node);
        const menu = findNestedMenu(node);
        if (menu != null) {
            const layouts = this.application.layouts;
            for (let i = 0; i < layouts.length; i++) {
                layouts[i].content = layouts[i].content.replace(`{${node.id}:${WIDGET_NAME.TOOLBAR}:menu}`, <string> menu.dataset.currentId);
            }
        }
    }

    private createResourceTheme(appBarOverlay: string, popupOverlay: string) {
        const options = Object.assign({}, this.options.resource);
        overwriteDefault(options, 'resource', 'appTheme', 'AppTheme');
        overwriteDefault(options, 'resource', 'parentTheme', 'Theme.AppCompat.Light.DarkActionBar');
        const data = {
            '0': [{
                'appTheme': options.resource.appTheme,
                'parentTheme': options.resource.parentTheme,
                'appBarOverlay': appBarOverlay || 'ThemeOverlay.AppCompat.Dark.ActionBar',
                'popupOverlay': popupOverlay || 'ThemeOverlay.AppCompat.Light',
                '1': []
            }]
        };
        overwriteDefault(options, 'output', 'path', 'res/values');
        overwriteDefault(options, 'output', 'file', `${WIDGET_NAME.TOOLBAR}.xml`);
        this.application.resourceHandler.addResourceTheme(EXTENSION_COLLAPSINGTOOLBAR_TMPL, data, options);
    }
}