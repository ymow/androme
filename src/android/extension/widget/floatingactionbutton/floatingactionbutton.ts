import { WIDGET_NAME } from '../common';

import $color = androme.lib.color;
import $enum = androme.lib.enumeration;
import $util = androme.lib.util;

import $Resource = android.lib.base.Resource;
import $View = android.lib.base.View;

import $android_const = android.lib.constant;
import $android_util = android.lib.util;

export default class FloatingActionButton<T extends $View> extends androme.lib.base.Extension<T> {
    public is(node: T) {
        return super.is(node) && (node.tagName !== 'INPUT' || ['button', 'file', 'image', 'reset', 'search', 'submit'].includes((<HTMLInputElement> node.element).type));
    }

    public condition(node: T) {
        return this.included(<HTMLElement> node.element);
    }

    public processNode(node: T, parent: T): ExtensionResult<T> {
        const target = $util.hasValue(node.dataset.target);
        const element = node.element;
        const options = $android_util.createAttribute(this.options[element.id]);
        const backgroundColor = $color.parseRGBA(node.css('backgroundColor'), node.css('opacity'));
        let colorValue = '';
        if (backgroundColor) {
            colorValue = $Resource.addColor(backgroundColor);
        }
        $util.defaultWhenNull(options, 'android', 'backgroundTint', colorValue !== '' ? `@color/${colorValue}` : '?attr/colorAccent');
        if (node.hasBit('excludeProcedure', $enum.NODE_PROCEDURE.ACCESSIBILITY)) {
            $util.defaultWhenNull(options, 'android', 'focusable', 'false');
        }
        let src = '';
        switch (element.tagName) {
            case 'IMG':
                src = $Resource.addImageSrcSet(<HTMLImageElement> element, $android_const.PREFIX_ANDROID.DIALOG);
                break;
            case 'INPUT':
                if ((<HTMLInputElement> element).type === 'image') {
                    src = $Resource.addImage({ mdpi: (<HTMLInputElement> element).src }, $android_const.PREFIX_ANDROID.DIALOG);
                }
                else {
                    src = $Resource.addImageUrl(node.css('backgroundImage'), $android_const.PREFIX_ANDROID.DIALOG);
                }
                break;
            case 'BUTTON':
                src = $Resource.addImageUrl(node.css('backgroundImage'), $android_const.PREFIX_ANDROID.DIALOG);
                break;
        }
        if (src !== '') {
            $util.defaultWhenNull(options, 'app', 'srcCompat', `@drawable/${src}`);
        }
        node.setControlType($android_const.SUPPORT_ANDROID.FLOATING_ACTION_BUTTON, $enum.NODE_CONTAINER.BUTTON);
        node.exclude({ resource: $enum.NODE_RESOURCE.BOX_STYLE | $enum.NODE_RESOURCE.ASSET });
        if (!node.pageFlow || target) {
            const horizontalBias = node.horizontalBias();
            const verticalBias = node.verticalBias();
            const documentParent = node.documentParent;
            const gravity: string[] = [];
            if (horizontalBias < 0.5) {
                gravity.push(node.localizeString('left'));
            }
            else if (horizontalBias > 0.5) {
                gravity.push(node.localizeString('right'));
            }
            else {
                gravity.push('center_horizontal');
            }
            if (verticalBias < 0.5) {
                gravity.push('top');
                node.app('layout_dodgeInsetEdges', 'top');
            }
            else if (verticalBias > 0.5) {
                gravity.push('bottom');
            }
            else {
                gravity.push('center_vertical');
            }
            const layoutGravity = node.mergeGravity('layout_gravity', ...gravity);
            if (horizontalBias > 0 && horizontalBias < 1 && horizontalBias !== 0.5) {
                if (horizontalBias < 0.5) {
                    node.css('marginLeft', $util.formatPX(Math.floor(node.bounds.left - documentParent.box.left)), true);
                }
                else {
                    node.css('marginRight', $util.formatPX(Math.floor(documentParent.box.right - node.bounds.right)), true);
                }
            }
            if (verticalBias > 0 && verticalBias < 1 && verticalBias !== 0.5) {
                if (verticalBias < 0.5) {
                    node.css('marginTop', $util.formatPX(Math.floor(node.bounds.top - documentParent.box.top)), true);
                }
                else {
                    node.css('marginBottom', $util.formatPX(Math.floor(documentParent.box.bottom - node.bounds.bottom)), true);
                }
            }
            if (target) {
                let anchor = parent.stringId;
                if (parent.controlName === $android_const.SUPPORT_ANDROID.TOOLBAR) {
                    const outerParent: string = parent.data(WIDGET_NAME.TOOLBAR, 'outerParent');
                    if (outerParent) {
                        anchor = outerParent;
                    }
                }
                node.app('layout_anchor', anchor);
                if (layoutGravity !== '') {
                    node.app('layout_anchorGravity', layoutGravity);
                    node.delete('android', 'layout_gravity');
                }
                node.exclude({ procedure: $enum.NODE_PROCEDURE.ALIGNMENT });
                node.render(node);
            }
            else {
                node.render(parent);
            }
            node.positioned = true;
        }
        else {
            node.render(parent);
        }
        const output = this.application.viewController.renderNodeStatic(
            $android_const.SUPPORT_ANDROID.FLOATING_ACTION_BUTTON,
            target ? -1 : node.renderDepth,
            $Resource.formatOptions(options, this.application.getExtensionOptionValueAsBoolean($android_const.EXT_ANDROID.RESOURCE_STRINGS, 'useNumberAlias')),
            'wrap_content',
            'wrap_content',
            node
        );
        return { output, complete: true };
    }
}