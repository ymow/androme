import { ExtensionResult } from '../../../extension/lib/types';
import Extension from '../../../base/extension';
import View from '../../view';
import { hasValue, includes, optional } from '../../../lib/util';
import { findNestedExtension, overwriteDefault } from '../lib/util';
import { getNode } from '../../../lib/dom';
import { NODE_RESOURCE, NODE_STANDARD } from '../../../lib/constants';
import { EXT_NAME } from '../../../extension/lib/constants';
import { VIEW_SUPPORT, WIDGET_NAME } from '../lib/constants';
import parseRTL from '../../localization';

import EXTENSION_DRAWER_TMPL from '../../template/extension/drawer';

type T = View;

export default class Drawer extends Extension<T> {
    constructor(name: string, tagNames?: string[], options?: {}) {
        super(name, tagNames, options);
        this.documentRoot = true;
        this.require(EXT_NAME.EXTERNAL, true);
        this.require(WIDGET_NAME.MENU);
        this.require(WIDGET_NAME.COORDINATOR);
    }

    public init(element: HTMLElement) {
        if (this.included(element) && element.children.length > 0) {
            Array.from(element.children).forEach((item: HTMLElement) => {
                if (item.tagName === 'NAV' && !includes(item.dataset.ext || '', EXT_NAME.EXTERNAL)) {
                    item.dataset.ext = (hasValue(item.dataset.ext) ? `${item.dataset.ext}, ` : '') + EXT_NAME.EXTERNAL;
                }
            });
            this.application.elements.add(element);
            return true;
        }
        return false;
    }

    public processNode(): ExtensionResult {
        const application = this.application;
        const controller = application.controllerHandler;
        const node = this.node as T;
        node.documentRoot = true;
        const options = Object.assign({}, this.options.drawer);
        if (findNestedExtension(node, WIDGET_NAME.MENU) != null) {
            overwriteDefault(options, 'android', 'fitsSystemWindows', 'true');
            this.createResourceTheme();
        }
        else {
            const optionsNavigation = Object.assign({}, this.options.navigation);
            overwriteDefault(optionsNavigation, 'android', 'layout_gravity', parseRTL('left'));
            const navView = node.children[node.children.length - 1];
            navView.android('layout_gravity', optionsNavigation.android.layout_gravity);
            navView.android('layout_height', 'match_parent');
            navView.isolated = true;
        }
        const xml = controller.renderNodeStatic(VIEW_SUPPORT.DRAWER, node.depth, options, 'match_parent', 'match_parent', node, true);
        node.rendered = true;
        node.nodeType = NODE_STANDARD.BLOCK;
        node.excludeResource |= NODE_RESOURCE.FONT_STYLE;
        return { xml };
    }

    public beforeInsert() {
        const application = this.application;
        const node = this.node as T;
        if (application.insert[node.nodeId] != null) {
            const target = application.cacheInternal.locate(item => item.isolated && item.parent === node.parent && item.nodeName === VIEW_SUPPORT.COORDINATOR);
            if (target != null) {
                application.insert[target.nodeId] = application.insert[node.nodeId];
                delete application.insert[node.nodeId];
            }
        }
        const menu: string = optional(findNestedExtension(node, WIDGET_NAME.MENU), 'dataset.viewName');
        const headerLayout: string = optional(findNestedExtension(node, EXT_NAME.EXTERNAL), 'dataset.viewName');
        const options: {} = Object.assign({}, this.options.navigation);
        if (menu !== '') {
            overwriteDefault(options, 'app', 'menu', `@menu/${menu}`);
        }
        if (headerLayout !== '') {
            overwriteDefault(options, 'app', 'headerLayout', `@layout/${headerLayout}`);
        }
        if (menu !== '' || headerLayout !== '') {
            overwriteDefault(options, 'android', 'id', `${node.stringId}_view`);
            overwriteDefault(options, 'android', 'fitsSystemWindows', 'true');
            overwriteDefault(options, 'android', 'layout_gravity', parseRTL('left'));
            const xml = application.controllerHandler.renderNodeStatic(VIEW_SUPPORT.NAVIGATION_VIEW, node.depth + 1, options, 'wrap_content', 'match_parent');
            application.addInsertQueue(node.id.toString(), [xml]);
        }
    }

    public afterInsert() {
        const headerLayout = findNestedExtension(this.node, EXT_NAME.EXTERNAL);
        if (headerLayout != null) {
            const node = getNode(headerLayout) as T;
            if (node.viewHeight === 0) {
                node.android('layout_height', 'wrap_content');
            }
        }
    }

    private createResourceTheme() {
        const options = Object.assign({}, this.options.resource);
        overwriteDefault(options, '', 'appTheme', 'AppTheme');
        overwriteDefault(options, '', 'parentTheme', 'Theme.AppCompat.Light.NoActionBar');
        const data = {
            '0': [{
                'appTheme': options.appTheme,
                'parentTheme': options.parentTheme,
                '1': []
            }]
        };
        overwriteDefault(options, 'output', 'path', 'res/values-v21');
        overwriteDefault(options, 'output', 'file', `${WIDGET_NAME.DRAWER}.xml`);
        this.application.resourceHandler.addTheme(EXTENSION_DRAWER_TMPL, data, options);
    }
}