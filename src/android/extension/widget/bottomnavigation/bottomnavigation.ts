import { WIDGET_NAME, getAppTheme } from '../common';

import EXTENSION_GENERIC_TMPL from '../__template/generic';

import $dom = androme.lib.dom;
import $enum = androme.lib.enumeration;
import $util = androme.lib.util;

import $Resource = android.lib.base.Resource;
import $View = android.lib.base.View;

import $android_const = android.lib.constant;
import $android_util = android.lib.util;

export default class BottomNavigation<T extends $View> extends androme.lib.base.Extension<T> {
    constructor(
        name: string,
        framework: number,
        tagNames?: string[],
        options?: ExternalData)
    {
        super(name, framework, tagNames, options);
        this.require(WIDGET_NAME.MENU);
    }

    public processNode(node: T, parent: T): ExtensionResult<T> {
        const options = $android_util.createAttribute(this.options[node.element.id]);
        $util.defaultWhenNull(options, 'android', 'background', `?android:attr/windowBackground`);
        for (let i = 5; i < node.length; i++) {
            const item = node.item(i) as T;
            item.hide();
            item.cascade().forEach(child => child.hide());
        }
        node.cascade().forEach(item => this.subscribersChild.add(item as T));
        node.excludeResource |= $enum.NODE_RESOURCE.ASSET;
        node.setControlType($android_const.SUPPORT_ANDROID.BOTTOM_NAVIGATION, $enum.NODE_CONTAINER.BLOCK);
        const output = this.application.viewController.renderNodeStatic(
            $android_const.SUPPORT_ANDROID.BOTTOM_NAVIGATION,
            node.depth,
            $Resource.formatOptions(options, this.application.getExtensionOptionsValueAsBoolean($android_const.EXT_ANDROID.RESOURCE_STRINGS, 'useNumberAlias')),
            parent.layoutConstraint ? '0px' : 'match_parent',
            'wrap_content',
            node
        );
        node.render(parent);
        this.setStyleTheme();
        return { output, complete: true };
    }

    public postBaseLayout(node: T) {
        const renderParent = node.renderParent as T;
        if (!renderParent.has('width')) {
            renderParent.android('layout_width', 'match_parent');
        }
        if (!renderParent.has('height')) {
            renderParent.android('layout_height', 'match_parent');
        }
        const menu = $util.optionalAsString($dom.getNestedExtension(node.element, WIDGET_NAME.MENU), 'dataset.layoutName');
        if (menu !== '') {
            const options = $android_util.createAttribute(this.options[node.element.id]);
            $util.defaultWhenNull(options, 'app', 'menu', `@menu/${menu}`);
            node.app('menu', options.app.menu);
        }
    }

    private setStyleTheme() {
        const options: ExternalData = Object.assign({}, this.options.resource);
        $util.defaultWhenNull(options, 'appTheme', getAppTheme(this.application.resourceHandler.fileHandler.assets) || 'AppTheme');
        $util.defaultWhenNull(options, 'parentTheme', 'Theme.AppCompat.Light.DarkActionBar');
        const data = {
            'appTheme': options.appTheme,
            'parentTheme': options.parentTheme,
            'items': []
        };
        $util.defaultWhenNull(options, 'output', 'path', 'res/values');
        $util.defaultWhenNull(options, 'output', 'file', `${WIDGET_NAME.BOTTOM_NAVIGATION}.xml`);
        (<android.lib.base.Resource<T>> this.application.resourceHandler).addStyleTheme(EXTENSION_GENERIC_TMPL, data, options);
    }
}