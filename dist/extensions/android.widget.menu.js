/* android.widget 2.2.2
   https://github.com/anpham6/androme */

this.android = this.android || {};
this.android.widget = this.android.widget || {};
this.android.widget.menu = (function () {
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

    var $enum = androme.lib.enumeration;
    var $dom = androme.lib.dom;
    var $android_Resource = android.lib.base.Resource;
    var $android_const = android.lib.constant;
    var $android_util = android.lib.util;
    const VIEW_NAVIGATION = {
        MENU: 'menu',
        ITEM: 'item',
        GROUP: 'group'
    };
    const VALIDATE_ITEM = {
        id: /^@\+id\/\w+$/,
        title: /^.+$/,
        titleCondensed: /^.+$/,
        icon: /^@drawable\/.+$/,
        onClick: /^.+$/,
        showAsAction: /^(ifRoom|never|withText|always|collapseActionView)$/,
        actionLayout: /^@layout\/.+$/,
        actionViewClass: /^.+$/,
        actionProviderClass: /^.+$/,
        alphabeticShortcut: /^[a-zA-Z]+$/,
        alphabeticModifiers: /(META|CTRL|ALT|SHIFT|SYM|FUNCTION)+/g,
        numericShortcut: /^[0-9]+$/,
        numericModifiers: /(META|CTRL|ALT|SHIFT|SYM|FUNCTION)+/g,
        checkable: /^(true|false)$/,
        visible: /^(true|false)$/,
        enabled: /^(true|false)$/,
        menuCategory: /^(container|system|secondary|alternative)$/,
        orderInCategory: /^[0-9]+$/
    };
    const VALIDATE_GROUP = {
        id: /^@\+id\/\w+$/,
        checkableBehavior: /^(none|all|single)$/,
        visible: /^(true|false)$/,
        enabled: /^(true|false)$/,
        menuCategory: /^(container|system|secondary|alternative)$/,
        orderInCategory: /^[0-9]+$/
    };
    function hasInputType(node, value) {
        return node.some(item => item.element.type === value);
    }
    function parseDataSet(validator, element, options) {
        for (const attr in element.dataset) {
            const value = element.dataset[attr];
            if (value && validator[attr]) {
                const match = value.match(validator[attr]);
                if (match) {
                    options['android'][attr] = Array.from(new Set(match)).join('|');
                }
            }
        }
    }
    class Menu extends androme.lib.base.extensions.Nav {
        condition() {
            return this.included();
        }
        processNode() {
            const node = this.node;
            const output = this.application.viewController.renderNodeStatic(VIEW_NAVIGATION.MENU, 0, {}, '', '', node, true);
            node.documentRoot = true;
            node.nodeType = $enum.NODE_STANDARD.BLOCK;
            node.excludeResource |= $enum.NODE_RESOURCE.ALL;
            node.excludeProcedure |= $enum.NODE_PROCEDURE.ALL;
            node.rendered = true;
            node.cascade().forEach(item => this.subscribersChild.add(item));
            return { output, complete: true };
        }
        processChild() {
            const node = this.node;
            const parent = this.parent;
            if (node.plainText) {
                node.hide();
                return { output: '', complete: true, next: true };
            }
            const element = node.element;
            const options = $android_util.createViewAttribute();
            let nodeName = VIEW_NAVIGATION.ITEM;
            let title = '';
            let next = false;
            let layout = false;
            if (node.some(item => (!item.inlineElement || !item.blockStatic) && item.length > 0)) {
                if (node.some(item => item.tagName === 'NAV')) {
                    if (element.title !== '') {
                        title = element.title;
                    }
                    else {
                        Array.from(node.element.childNodes).some((item) => {
                            if (item.nodeName === '#text') {
                                if (item.textContent) {
                                    title = item.textContent.trim();
                                    if (title !== '') {
                                        return true;
                                    }
                                }
                                return false;
                            }
                            else if (item.tagName !== 'NAV') {
                                title = item.innerText.trim();
                                return true;
                            }
                            return false;
                        });
                    }
                    node.each(item => item.tagName !== 'NAV' && item.hide());
                }
                else if (node.tagName === 'NAV') {
                    nodeName = VIEW_NAVIGATION.MENU;
                    next = true;
                }
                else {
                    nodeName = VIEW_NAVIGATION.GROUP;
                    let checkable = '';
                    if (node.every((item) => hasInputType(item, 'radio'))) {
                        checkable = 'single';
                    }
                    else if (node.every((item) => hasInputType(item, 'checkbox'))) {
                        checkable = 'all';
                    }
                    options['android'].checkableBehavior = checkable;
                }
                layout = true;
            }
            else {
                if (parent.android('checkableBehavior') === '') {
                    if (hasInputType(node, 'checkbox')) {
                        options['android'].checkable = 'true';
                    }
                }
                title = (element.title || element.innerText).trim();
            }
            switch (nodeName) {
                case VIEW_NAVIGATION.ITEM:
                    parseDataSet(VALIDATE_ITEM, element, options);
                    if (node.android('icon') === '') {
                        const style = $dom.getStyle(element);
                        let src = $android_Resource.addImageURL((style.backgroundImage !== 'none' ? style.backgroundImage : style.background), $android_const.DRAWABLE_PREFIX.MENU);
                        if (src !== '') {
                            options['android'].icon = `@drawable/${src}`;
                        }
                        else {
                            const image = node.find(item => item.imageElement);
                            if (image) {
                                src = $android_Resource.addImageSrcSet(image.element, $android_const.DRAWABLE_PREFIX.MENU);
                                if (src !== '') {
                                    options['android'].icon = `@drawable/${src}`;
                                }
                            }
                        }
                    }
                    break;
                case VIEW_NAVIGATION.GROUP:
                    parseDataSet(VALIDATE_GROUP, element, options);
                    break;
            }
            if (node.android('title') === '') {
                if (title !== '') {
                    const name = $android_Resource.addString(title, '', this.application.settings);
                    if (name !== '') {
                        title = `@string/${name}`;
                    }
                    options['android'].title = title;
                }
            }
            if (!options['android'].id) {
                node.setNodeType(nodeName);
            }
            else {
                node.controlName = nodeName;
            }
            const output = this.application.viewController.renderNodeStatic(nodeName, parent.renderDepth + 1, options, '', '', node, layout);
            node.excludeResource |= $enum.NODE_RESOURCE.ALL;
            node.excludeProcedure |= $enum.NODE_PROCEDURE.ALL;
            node.rendered = true;
            return { output, complete: true, next };
        }
        afterRender() {
            const node = this.node;
            super.afterRender();
            if (this.included(node.element)) {
                this.application.layoutProcessing.pathname = 'res/menu';
            }
        }
    }

    const menu = new Menu(WIDGET_NAME.MENU, WIDGET_NAME.__FRAMEWORK, ['NAV']);
    if (androme) {
        androme.registerExtensionAsync(menu);
    }

    return menu;

}());
