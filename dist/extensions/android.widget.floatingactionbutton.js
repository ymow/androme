/* android.widget 2.2.2
   https://github.com/anpham6/androme */

this.android = this.android || {};
this.android.widget = this.android.widget || {};
this.android.widget.floatingactionbutton = (function () {
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
    var $util = androme.lib.util;
    var $color = androme.lib.color;
    var $android_Resource = android.lib.base.Resource;
    var $android_const = android.lib.constant;
    var $android_util = android.lib.util;
    class FloatingActionButton extends androme.lib.base.extensions.Button {
        processNode() {
            const node = this.node;
            const parent = this.parent;
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
                    src = $android_Resource.addImageSrcSet(element, $android_const.DRAWABLE_PREFIX.DIALOG);
                    break;
                case 'INPUT':
                    if (element.type === 'image') {
                        src = $android_Resource.addImage({ mdpi: element.src }, $android_const.DRAWABLE_PREFIX.DIALOG);
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
            const output = this.application.viewController.renderNodeStatic($android_const.VIEW_SUPPORT.FLOATING_ACTION_BUTTON, target ? -1 : parent.renderDepth + 1, $android_Resource.formatOptions(options, this.application.settings), 'wrap_content', 'wrap_content', node);
            node.nodeType = $enum.NODE_STANDARD.BUTTON;
            node.excludeResource |= $enum.NODE_RESOURCE.BOX_STYLE | $enum.NODE_RESOURCE.ASSET;
            if (!node.pageflow || target) {
                const horizontalBias = node.horizontalBias();
                const verticalBias = node.verticalBias();
                const documentParent = node.documentParent;
                const gravity = [];
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
                node.android('layout_gravity', gravity.filter(value => value.indexOf('center') !== -1).length === 2 ? 'center' : gravity.join('|'));
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
                        const outerParent = parent.data(WIDGET_NAME.TOOLBAR, 'outerParent');
                        if (outerParent) {
                            anchor = outerParent;
                        }
                    }
                    node.app('layout_anchor', anchor);
                    node.app('layout_anchorGravity', node.android('layout_gravity'));
                    node.delete('android', 'layout_gravity');
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
        afterInsert() {
            const node = this.node;
            node.android('layout_width', 'wrap_content');
            node.android('layout_height', 'wrap_content');
        }
    }

    const fab = new FloatingActionButton(WIDGET_NAME.FAB, WIDGET_NAME.__FRAMEWORK, ['BUTTON', 'INPUT', 'IMG']);
    if (androme) {
        androme.registerExtensionAsync(fab);
    }

    return fab;

}());
