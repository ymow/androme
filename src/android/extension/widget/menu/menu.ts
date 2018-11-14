import { ViewAttribute } from '../../../types/module';

import $const = androme.lib.constant;
import $dom = androme.lib.dom;
import $enum = androme.lib.enumeration;

import $Resource = android.lib.base.Resource;
import $View = android.lib.base.View;

import $android_const = android.lib.constant;
import $android_util = android.lib.util;

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

const NAMESPACE_APP = ['showAsAction', 'actionViewClass', 'actionProviderClass'];

function hasInputType(node: $View, value: string) {
    return node.some(item => (<HTMLInputElement> item.element).type === value);
}

function parseDataSet(validator: ObjectMap<RegExp>, element: HTMLElement, options: ViewAttribute) {
    for (const attr in element.dataset) {
        const value = element.dataset[attr];
        if (value && validator[attr]) {
            const match = value.match(validator[attr]);
            if (match) {
                options[NAMESPACE_APP.includes(attr) ? 'app' : 'android'][attr] = Array.from(new Set(match)).join('|');
            }
        }
    }
}

export default class Menu<T extends $View> extends androme.lib.base.Extension<T> {
    constructor(
        name: string,
        framework: number,
        tagNames?: string[],
        options?: ExternalData)
    {
        super(name, framework, tagNames, options);
        this.require($const.EXT_NAME.EXTERNAL, true);
    }

    public init(element: HTMLElement) {
        if (this.included(element)) {
            let valid = false;
            if (element.children.length > 0) {
                const tagName = element.children[0].tagName;
                valid = Array.from(element.children).every(item => item.tagName === tagName);
                let current = element.parentElement;
                while (current) {
                    if (current.tagName === 'NAV' && this.application.viewElements.has(current)) {
                        valid = false;
                        break;
                    }
                    current = current.parentElement;
                }
            }
            if (valid) {
                Array.from(element.querySelectorAll('NAV')).forEach((item: HTMLElement) => {
                    if ($dom.getStyle(element).display === 'none') {
                        $dom.setElementCache(item, 'andromeExternalDisplay', 'none');
                        item.style.display = 'block';
                    }
                });
                this.application.viewElements.add(<HTMLElement> element);
            }
        }
        return false;
    }

    public condition(node: T) {
        return this.included(<HTMLElement> node.element);
    }

    public processNode(node: T): ExtensionResult<T> {
        const output = this.application.viewController.renderNodeStatic(
            VIEW_NAVIGATION.MENU,
            0,
            {},
            '',
            '',
            node,
            true
        );
        node.documentRoot = true;
        node.nodeType = $enum.NODE_STANDARD.BLOCK;
        node.excludeResource |= $enum.NODE_RESOURCE.ALL;
        node.excludeProcedure |= $enum.NODE_PROCEDURE.ALL;
        node.rendered = true;
        node.cascade().forEach(item => this.subscribersChild.add(item as T));
        return { output, complete: true };
    }

    public processChild(node: T, parent: T): ExtensionResult<T> {
        if (node.plainText) {
            node.hide();
            return { output: '', next: true };
        }
        const element = <HTMLElement> node.element;
        const options = $android_util.createAttribute();
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
                    Array.from(node.element.childNodes).some((item: HTMLElement) => {
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
                if (node.every((item: T) => hasInputType(item, 'radio'))) {
                    checkable = 'single';
                }
                else if (node.every((item: T) => hasInputType(item, 'checkbox'))) {
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
                    let src = $Resource.addImageUrl((style.backgroundImage !== 'none' ? style.backgroundImage : style.background) as string, $android_const.DRAWABLE_PREFIX.MENU);
                    if (src !== '') {
                        options['android'].icon = `@drawable/${src}`;
                    }
                    else {
                        const image = node.find(item => item.imageElement);
                        if (image) {
                            src = $Resource.addImageSrcSet(<HTMLImageElement> image.element, $android_const.DRAWABLE_PREFIX.MENU);
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
                const name = $Resource.addString(title, '', this.application.getExtensionOptionsValueAsBoolean($android_const.EXT_ANDROID.RESOURCE_STRINGS, 'useNumberAlias'));
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
        const output = this.application.viewController.renderNodeStatic(
            nodeName,
            parent.renderDepth + 1,
            options,
            '',
            '',
            node,
            layout
        );
        node.excludeResource |= $enum.NODE_RESOURCE.ALL;
        node.excludeProcedure |= $enum.NODE_PROCEDURE.ALL;
        node.rendered = true;
        return { output, complete: true, next };
    }

    public postBaseLayout(node: T) {
        if (this.included(<HTMLElement> node.element)) {
            Array.from(node.element.querySelectorAll('NAV')).forEach((item: HTMLElement) => {
                const display = $dom.getElementCache(item, 'andromeExternalDisplay');
                if (display) {
                    item.style.display = display;
                    $dom.deleteElementCache(item, 'andromeExternalDisplay');
                }
            });
            if (node === this.application.nodeProcessing) {
                this.application.layoutProcessing.pathname = 'res/menu';
            }
        }
    }
}