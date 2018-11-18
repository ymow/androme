import WIDGET_NAME from '../namespace';

import EXTENSION_DRAWER_TMPL from '../__template/drawer';

import $dom = androme.lib.dom;
import $enum = androme.lib.enumeration;
import $const = androme.lib.constant;
import $util = androme.lib.util;

import $Resource = android.lib.base.Resource;
import $View = android.lib.base.View;

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
            this.application.parseElements.add(element);
            return true;
        }
        return false;
    }

    public processNode(node: T): ExtensionResult<T> {
        const options = $android_util.createAttribute(this.options.self);
        if ($dom.getNestedExtension(node.element, WIDGET_NAME.MENU)) {
            $util.defaultWhenNull(options, 'android', 'fitsSystemWindows', 'true');
            this.setStyleTheme();
        }
        else {
            const optionsNavigationView = $android_util.createAttribute(this.options.navigationView);
            $util.defaultWhenNull(optionsNavigationView, 'android', 'layout_gravity', node.localizeString('left'));
            const navView = node.item() as T;
            navView.android('layout_gravity', optionsNavigationView.android.layout_gravity);
            navView.android('layout_height', 'match_parent');
            navView.positioned = true;
        }
        const output = this.application.viewController.renderNodeStatic(
            $android_const.VIEW_SUPPORT.DRAWER,
            node.depth,
            $Resource.formatOptions(options, this.application.getExtensionOptionsValueAsBoolean($android_const.EXT_ANDROID.RESOURCE_STRINGS, 'useNumberAlias')),
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

    public postParseDocument(node: T) {
        const application = this.application;
        const options = $android_util.createAttribute(this.options.navigation);
        const menu = $util.optionalAsString($dom.getNestedExtension(node.element, WIDGET_NAME.MENU), 'dataset.layoutName');
        const headerLayout = $util.optionalAsString($dom.getNestedExtension(node.element, $const.EXT_NAME.EXTERNAL), 'dataset.layoutName');
        if (menu !== '') {
            $util.defaultWhenNull(options, 'app', 'menu', `@menu/${menu}`);
        }
        if (headerLayout !== '') {
            $util.defaultWhenNull(options, 'app', 'headerLayout', `@layout/${headerLayout}`);
        }
        if (menu !== '' || headerLayout !== '') {
            $util.defaultWhenNull(options, 'android', 'id', `${node.stringId}_navigation`);
            $util.defaultWhenNull(options, 'android', 'fitsSystemWindows', 'true');
            $util.defaultWhenNull(options, 'android', 'layout_gravity', node.localizeString('left'));
            const output = application.viewController.renderNodeStatic(
                $android_const.VIEW_SUPPORT.NAVIGATION_VIEW,
                node.depth + 1,
                $Resource.formatOptions(options, this.application.getExtensionOptionsValueAsBoolean($android_const.EXT_ANDROID.RESOURCE_STRINGS, 'useNumberAlias')),
                'wrap_content',
                'match_parent'
            );
            application.addRenderQueue(node.id.toString(), [output]);
        }
    }

    public postProcedure(node: T) {
        const header = $dom.getNodeFromElement<T>($dom.getNestedExtension(node.element, $const.EXT_NAME.EXTERNAL));
        if (header && !header.hasHeight) {
            header.android('layout_height', 'wrap_content');
        }
        const renderQueue = this.application.session.renderQueue;
        if (renderQueue.has(node.nodeId)) {
            const target = this.application.session.cache.find(item => item.parent === node.parent && item.controlName === $android_const.VIEW_SUPPORT.COORDINATOR);
            if (target) {
                renderQueue.set(target.nodeId, renderQueue.get(node.nodeId) as string[]);
                renderQueue.delete(node.nodeId);
            }
        }
    }

    private setStyleTheme() {
        const options: ExternalData = Object.assign({}, this.options.resource);
        $util.defaultWhenNull(options, 'appTheme', 'AppTheme');
        $util.defaultWhenNull(options, 'parentTheme', 'Theme.AppCompat.Light.NoActionBar');
        const data = {
            'appTheme': options.appTheme,
            'parentTheme': options.parentTheme,
            '1': []
        };
        $util.defaultWhenNull(options, 'output', 'path', 'res/values-v21');
        $util.defaultWhenNull(options, 'output', 'file', `${WIDGET_NAME.DRAWER}.xml`);
        (<android.lib.base.Resource<T>> this.application.resourceHandler).addStyleTheme(EXTENSION_DRAWER_TMPL, data, options);
    }
}