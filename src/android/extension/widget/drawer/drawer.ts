import { SettingsAndroid } from '../../../types/module';

import WIDGET_NAME from '../namespace';

import EXTENSION_DRAWER_TMPL from '../__template/drawer';

import $enum = androme.lib.enumeration;
import $const = androme.lib.constant;
import $util = androme.lib.util;
import $dom = androme.lib.dom;

import $View = android.lib.base.View;
import $android_Resource = android.lib.base.Resource;

import $android_const = android.lib.constant;
import $android_util = android.lib.util;

export default class Drawer<T extends $View> extends androme.lib.base.Extension<T> {
    constructor(
        name: string,
        framework: number,
        tagNames?: string[],
        options?: ExternalData)
    {
        super(name, framework, tagNames, options);
        this.documentRoot = true;
        this.require($const.EXT_NAME.EXTERNAL, true);
        this.require(WIDGET_NAME.MENU);
        this.require(WIDGET_NAME.COORDINATOR);
    }

    public init(element: HTMLElement) {
        if (this.included(element) && element.children.length > 0) {
            Array.from(element.children).forEach((item: HTMLElement) => {
                if (item.tagName === 'NAV' && !$util.includes(item.dataset.ext, $const.EXT_NAME.EXTERNAL)) {
                    item.dataset.ext = ($util.hasValue(item.dataset.ext) ? `${item.dataset.ext}, ` : '') + $const.EXT_NAME.EXTERNAL;
                }
            });
            this.application.viewElements.add(element);
            return true;
        }
        return false;
    }

    public processNode(): ExtensionResult {
        const node = this.node as T;
        const options = $android_util.createViewAttribute(this.options.self);
        if ($dom.getNestedExtension(node.element, WIDGET_NAME.MENU)) {
            $util.overwriteDefault(options, 'android', 'fitsSystemWindows', 'true');
            this.setStyleTheme();
        }
        else {
            const optionsNavigationView = $android_util.createViewAttribute(this.options.navigationView);
            $util.overwriteDefault(optionsNavigationView, 'android', 'layout_gravity', node.localizeString('left'));
            const navView = node.item() as T;
            navView.android('layout_gravity', optionsNavigationView.android.layout_gravity);
            navView.android('layout_height', 'match_parent');
            navView.auto = false;
        }
        const output = this.application.viewController.renderNodeStatic(
            $android_const.VIEW_SUPPORT.DRAWER,
            node.depth,
            $android_Resource.formatOptions(options, <SettingsAndroid> this.application.settings),
            'match_parent',
            'match_parent',
            node,
            true
        );
        node.documentRoot = true;
        node.rendered = true;
        node.nodeType = $enum.NODE_STANDARD.BLOCK;
        node.excludeResource |= $enum.NODE_RESOURCE.FONT_STYLE;
        return { output, complete: true };
    }

    public postProcedure(node: T) {
        const application = this.application;
        const header = $dom.getNodeFromElement<T>($dom.getNestedExtension(node.element, $const.EXT_NAME.EXTERNAL));
        if (header && !header.hasHeight) {
            header.android('layout_height', 'wrap_content');
        }
        if (application.renderQueue[node.nodeId]) {
            const target = application.cacheSession.find(item => item.parent === node.parent && item.controlName === $android_const.VIEW_SUPPORT.COORDINATOR);
            if (target) {
                application.renderQueue[target.nodeId] = application.renderQueue[node.nodeId];
                delete application.renderQueue[node.nodeId];
            }
        }
        const options = $android_util.createViewAttribute(this.options.navigation);
        const menu = $util.optionalAsString($dom.getNestedExtension(node.element, WIDGET_NAME.MENU), 'dataset.layoutName');
        const headerLayout = $util.optionalAsString($dom.getNestedExtension(node.element, $const.EXT_NAME.EXTERNAL), 'dataset.layoutName');
        if (menu !== '') {
            $util.overwriteDefault(options, 'app', 'menu', `@menu/${menu}`);
        }
        if (headerLayout !== '') {
            $util.overwriteDefault(options, 'app', 'headerLayout', `@layout/${headerLayout}`);
        }
        if (menu !== '' || headerLayout !== '') {
            $util.overwriteDefault(options, 'android', 'id', `${node.stringId}_navigation`);
            $util.overwriteDefault(options, 'android', 'fitsSystemWindows', 'true');
            $util.overwriteDefault(options, 'android', 'layout_gravity', node.localizeString('left'));
            const output = application.viewController.renderNodeStatic(
                $android_const.VIEW_SUPPORT.NAVIGATION_VIEW,
                node.depth + 1,
                $android_Resource.formatOptions(options, <SettingsAndroid> this.application.settings),
                'wrap_content',
                'match_parent'
            );
            application.addRenderQueue(node.id.toString(), [output]);
        }
    }

    private setStyleTheme() {
        const options: ExternalData = Object.assign({}, this.options.resource);
        $util.overwriteDefault(options, 'appTheme', 'AppTheme');
        $util.overwriteDefault(options, 'parentTheme', 'Theme.AppCompat.Light.NoActionBar');
        const data = {
            'appTheme': options.appTheme,
            'parentTheme': options.parentTheme,
            '1': []
        };
        $util.overwriteDefault(options, 'output', 'path', 'res/values-v21');
        $util.overwriteDefault(options, 'output', 'file', `${WIDGET_NAME.DRAWER}.xml`);
        (<android.lib.base.Resource<T>> this.application.resourceHandler).addStyleTheme(EXTENSION_DRAWER_TMPL, data, options);
    }
}