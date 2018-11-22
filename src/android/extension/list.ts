import { BOX_ANDROID, CONTAINER_ANDROID } from '../lib/constant';

import Resource from '../resource';
import View from '../view';

import { createAttribute } from '../lib/util';

import $Application = androme.lib.base.Application;

import $const = androme.lib.constant;
import $dom = androme.lib.dom;
import $enum = androme.lib.enumeration;
import $util = androme.lib.util;

export default class <T extends View> extends androme.lib.extensions.List<T> {
    public processChild(node: T, parent: T): ExtensionResult<T> {
        const mainData: ListData = node.data($const.EXT_NAME.LIST, 'mainData');
        let output = '';
        if (mainData) {
            const controller = this.application.viewController;
            const parentLeft = $util.convertInt(parent.css('paddingLeft')) + $util.convertInt(parent.cssInitial('marginLeft', true));
            let columnCount = 0;
            let paddingLeft = node.marginLeft;
            node.modifyBox($enum.BOX_STANDARD.MARGIN_LEFT, null);
            if (parent.is($enum.NODE_CONTAINER.GRID)) {
                columnCount = $util.convertInt(parent.android('columnCount'));
                paddingLeft += parentLeft;
            }
            else if (parent.item(0) === node) {
                paddingLeft += parentLeft;
            }
            const ordinal = node.find(item => item.float === 'left' && $util.convertInt(item.cssInitial('marginLeft', true)) < 0 && Math.abs($util.convertInt(item.cssInitial('marginLeft', true))) <= $util.convertInt(item.documentParent.cssInitial('marginLeft', true))) as T | undefined;
            if (ordinal && mainData.ordinal === '') {
                ordinal.parent = parent;
                const layoutData = $Application.createLayoutData(ordinal, parent);
                if (ordinal.inlineText || ordinal.length === 0) {
                    layoutData.containerType = $enum.NODE_CONTAINER.TEXT;
                }
                else {
                    layoutData.items = ordinal.children as T[];
                    layoutData.itemCount = ordinal.length;
                    if (this.application.viewController.checkRelativeHorizontal(ordinal as T, ordinal.children as T[])) {
                        layoutData.containerType = $enum.NODE_CONTAINER.RELATIVE;
                        layoutData.alignmentType |= $enum.NODE_ALIGNMENT.HORIZONTAL;
                    }
                    else {
                        layoutData.containerType = $enum.NODE_CONTAINER.CONSTRAINT;
                        layoutData.alignmentType |= $enum.NODE_ALIGNMENT.UNKNOWN;
                    }
                }
                controller.prependBefore(node.id, this.application.renderNode(layoutData));
                if (columnCount === 3) {
                    node.android('layout_columnSpan', '2');
                }
                paddingLeft += ordinal.marginLeft;
                ordinal.modifyBox($enum.BOX_STANDARD.MARGIN_LEFT, null);
                if (!ordinal.hasWidth && paddingLeft > 0) {
                    ordinal.android('minWidth', $util.formatPX(paddingLeft));
                }
            }
            else {
                const columnWeight = columnCount > 0 ? '0' : '';
                const positionInside = node.css('listStylePosition') === 'inside';
                const listStyleImage = !['', 'none'].includes(node.css('listStyleImage'));
                let image = '';
                let left = 0;
                let top = 0;
                if (mainData.imageSrc !== '') {
                    const boxPosition = $dom.getBackgroundPosition(mainData.imagePosition, node.bounds, node.dpi, node.fontSize);
                    left = boxPosition.left;
                    top = boxPosition.top;
                    image = Resource.addImageUrl(mainData.imageSrc);
                }
                const gravity = (image !== '' && !listStyleImage) || (parentLeft === 0 && node.marginLeft === 0) ? '' : 'right';
                if (gravity === '') {
                    paddingLeft += node.paddingLeft;
                    node.modifyBox($enum.BOX_STANDARD.PADDING_LEFT, null);
                }
                if (left > 0 && paddingLeft > left) {
                    paddingLeft -= left;
                }
                paddingLeft = Math.max(paddingLeft, 20);
                const minWidth = paddingLeft > 0 ? $util.formatPX(paddingLeft) : '';
                const paddingRight = (() => {
                    if (paddingLeft <= 24) {
                        return 6;
                    }
                    else if (paddingLeft <= 32) {
                        return 8;
                    }
                    else {
                        return 10;
                    }
                })();
                const marginLeft = left > 0 ? $util.formatPX(left) : '';
                const options = createAttribute({
                    android: {
                        layout_columnWeight: columnWeight
                    }
                });
                if (positionInside) {
                    const insideOptions = createAttribute({
                        android: {
                            minWidth,
                            layout_columnWeight: columnWeight,
                            [node.localizeString(BOX_ANDROID.MARGIN_LEFT)]: marginLeft
                        }
                    });
                    const xml = controller.renderNodeStatic(CONTAINER_ANDROID.SPACE, parent.renderDepth + 1, insideOptions, 'wrap_content', 'wrap_content');
                    controller.prependBefore(node.id, xml);
                    options.android.minWidth = $util.formatPX('24');
                }
                else {
                    Object.assign(options.android, {
                        minWidth,
                        gravity: paddingLeft > 20 ? node.localizeString(gravity) : '',
                        [BOX_ANDROID.MARGIN_TOP]: node === parent.children[0] && node.marginTop > 0 ? $util.formatPX(node.marginTop) : '',
                        [node.localizeString(BOX_ANDROID.MARGIN_LEFT)]: marginLeft,
                        [node.localizeString(BOX_ANDROID.PADDING_LEFT)]: gravity === '' && image === '' ? $util.formatPX(paddingRight) : (paddingLeft === 20 ? '2px' : ''),
                        [node.localizeString(BOX_ANDROID.PADDING_RIGHT)]: gravity === 'right' && paddingLeft > 20 ? $util.formatPX(paddingRight) : '',
                        [BOX_ANDROID.PADDING_TOP]: node.paddingTop > 0 ? $util.formatPX(node.paddingTop) : ''
                    });
                    if (columnCount === 3) {
                        node.android('layout_columnSpan', '2');
                    }
                }
                if (node.tagName === 'DT' && image === '') {
                    node.android('layout_columnSpan', columnCount.toString());
                }
                else {
                    if (image !== '') {
                        Object.assign(options.android, {
                            src: `@drawable/${image}`,
                            [BOX_ANDROID.MARGIN_TOP]: top > 0 ? $util.formatPX(top) : '',
                            baselineAlignBottom: 'true',
                            scaleType: !positionInside && gravity === 'right' ? 'fitEnd' : 'fitStart'
                        });
                    }
                    else {
                        options.android.text = mainData.ordinal;
                    }
                    const companion = new View(this.application.processing.cache.nextId, document.createElement('SPAN'), this.application.viewController.delegateNodeInit) as T;
                    companion.alignmentType = $enum.NODE_ALIGNMENT.SPACE;
                    companion.tagName = `${node.tagName}_ORDINAL`;
                    companion.inherit(node, 'style');
                    if (mainData.ordinal !== '' && !/[A-Za-z\d]+\./.test(mainData.ordinal) && companion.toInt('fontSize') > 12) {
                        companion.css('fontSize', '12px');
                    }
                    node.companion = companion;
                    this.application.processing.cache.append(companion, false);
                    const xml = controller.renderNodeStatic(
                        image !== '' ? CONTAINER_ANDROID.IMAGE : (mainData.ordinal !== '' ? CONTAINER_ANDROID.TEXT : CONTAINER_ANDROID.SPACE),
                        parent.renderDepth + 1,
                        options,
                        'wrap_content',
                        'wrap_content',
                        companion
                    );
                    controller.prependBefore(node.id, xml);
                }
            }
            if (columnCount > 0) {
                node.android('layout_width', '0px');
                node.android('layout_columnWeight', '1');
            }
            if (node.length === 1 && node.children[0].textElement && node.children[0].baseline) {
                const layoutData = $Application.createLayoutData(node, parent, $enum.NODE_CONTAINER.LINEAR, $enum.NODE_ALIGNMENT.HORIZONTAL, 1, node.children as T[]);
                node.android('baselineAlignedChildIndex', '0');
                output = this.application.renderNode(layoutData);
            }
        }
        return { output };
    }

    public postBaseLayout(node: T) {
        super.postBaseLayout(node);
        const columnCount = node.android('columnCount');
        for (let i = 0; i < node.renderChildren.length; i++) {
            const current = node.renderChildren[i];
            const previous = node.renderChildren[i - 1];
            let spaceHeight = 0;
            if (previous) {
                const marginBottom = $util.convertInt(previous.android(BOX_ANDROID.MARGIN_BOTTOM));
                if (marginBottom > 0) {
                    spaceHeight += marginBottom;
                    previous.delete('android', BOX_ANDROID.MARGIN_BOTTOM);
                    previous.modifyBox($enum.BOX_STANDARD.MARGIN_BOTTOM, null);
                }
            }
            const marginTop = $util.convertInt(current.android(BOX_ANDROID.MARGIN_TOP));
            if (marginTop > 0) {
                spaceHeight += marginTop;
                current.delete('android', BOX_ANDROID.MARGIN_TOP);
                current.modifyBox($enum.BOX_STANDARD.MARGIN_TOP, null);
            }
            if (spaceHeight > 0) {
                const options = createAttribute({
                    android: {
                        layout_columnSpan: columnCount.toString()
                    }
                });
                const xml = this.application.viewController.renderNodeStatic(CONTAINER_ANDROID.SPACE, current.renderDepth, options, 'match_parent', $util.formatPX(spaceHeight));
                this.application.viewController.prependBefore(current.id, xml, 0);
            }
        }
    }

    public postProcedure(node: T) {
        if (node.blockStatic && !node.has('width')) {
            node.android('layout_width', 'match_parent');
        }
    }
}