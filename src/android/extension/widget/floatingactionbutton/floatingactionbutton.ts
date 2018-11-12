import WIDGET_NAME from '../namespace';

import $enum = androme.lib.enumeration;
import $util = androme.lib.util;
import $color = androme.lib.color;

import $View = android.lib.base.View;
import $android_Resource = android.lib.base.Resource;

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
        const options = $android_util.createViewAttribute(this.options[element.id]);
        const backgroundColor = $color.parseRGBA(node.css('backgroundColor'), node.css('opacity'));
        let colorValue = '';
        if (backgroundColor) {
            colorValue = $android_Resource.addColor(backgroundColor);
        }
        $util.overwriteDefault(options, 'android', 'backgroundTint', colorValue !== '' ? `@color/${colorValue}` : '?attr/colorAccent');
        if (node.hasBit('excludeProcedure', $enum.NODE_PROCEDURE.ACCESSIBILITY)) {
            $util.overwriteDefault(options, 'android', 'focusable', 'false');
        }
        let src = '';
        switch (element.tagName) {
            case 'IMG':
                src = $android_Resource.addImageSrcSet(<HTMLImageElement> element, $android_const.DRAWABLE_PREFIX.DIALOG);
                break;
            case 'INPUT':
                if ((<HTMLInputElement> element).type === 'image') {
                    src = $android_Resource.addImage({ mdpi: (<HTMLInputElement> element).src }, $android_const.DRAWABLE_PREFIX.DIALOG);
                }
                else {
                    src = $android_Resource.addImageURL(node.css('backgroundImage'), $android_const.DRAWABLE_PREFIX.DIALOG);
                }
                break;
            case 'BUTTON':
                src = $android_Resource.addImageURL(node.css('backgroundImage'), $android_const.DRAWABLE_PREFIX.DIALOG);
                break;
        }
        if (src !== '') {
            $util.overwriteDefault(options, 'app', 'srcCompat', `@drawable/${src}`);
        }
        const output = this.application.viewController.renderNodeStatic(
            $android_const.VIEW_SUPPORT.FLOATING_ACTION_BUTTON,
            target ? -1 : parent.renderDepth + 1,
            $android_Resource.formatOptions(options, this.application.getExtensionOptionsValueAsBoolean($android_const.EXT_ANDROID.RESOURCE_STRINGS, 'useNumberAlias')),
            'wrap_content',
            'wrap_content',
            node
        );
        node.nodeType = $enum.NODE_STANDARD.BUTTON;
        node.excludeResource |= $enum.NODE_RESOURCE.BOX_STYLE | $enum.NODE_RESOURCE.ASSET;
        if (!node.pageflow || target) {
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
                    node.css('marginLeft', $util.formatPX(Math.floor(node.bounds.left - documentParent.box.left)));
                }
                else {
                    node.css('marginRight', $util.formatPX(Math.floor(documentParent.box.right - node.bounds.right)));
                }
            }
            if (verticalBias > 0 && verticalBias < 1 && verticalBias !== 0.5) {
                if (verticalBias < 0.5) {
                    node.css('marginTop', $util.formatPX(Math.floor(node.bounds.top - documentParent.box.top)));
                }
                else {
                    node.css('marginBottom', $util.formatPX(Math.floor(documentParent.box.bottom - node.bounds.bottom)));
                }
            }
            if (target) {
                let anchor = parent.stringId;
                if (parent.controlName === $android_const.VIEW_SUPPORT.TOOLBAR) {
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
                node.excludeProcedure |= $enum.NODE_PROCEDURE.ALIGNMENT;
                node.render(node);
            }
            else {
                node.render(parent);
            }
            node.auto = false;
        }
        else {
            node.render(parent);
        }
        return { output, complete: true };
    }

    public postProcedure(node: T) {
        node.android('layout_width', 'wrap_content');
        node.android('layout_height', 'wrap_content');
    }
}