import { ListData } from '../../extension/types/data';

import { BOX_ANDROID, NODE_ANDROID } from '../lib/constant';

import Resource from '../resource';
import View from '../view';

import { createAttribute } from '../lib/util';

import $const = androme.lib.constant;
import $dom = androme.lib.dom;
import $enum = androme.lib.enumeration;
import $util = androme.lib.util;

export default class <T extends View> extends androme.lib.extensions.List<T> {
    public processChild(node: T, parent: T): ExtensionResult<T> {
        const mainData: ListData = node.data($const.EXT_NAME.LIST, 'mainData');
        if (mainData) {
            const controller = this.application.viewController;
            const parentLeft = $util.convertInt(parent.css('paddingLeft')) + $util.convertInt(parent.cssInitial('marginLeft', true));
            let columnCount = 0;
            let paddingLeft = node.marginLeft;
            node.modifyBox($enum.BOX_STANDARD.MARGIN_LEFT, null);
            if (parent.is($enum.NODE_STANDARD.GRID)) {
                columnCount = $util.convertInt(parent.android('columnCount'));
                paddingLeft += parentLeft;
            }
            else if (parent.item(0) === node) {
                paddingLeft += parentLeft;
            }
            const ordinal = <T> node.find(item =>
                item.float === 'left' &&
                $util.convertInt(item.cssInitial('marginLeft', true)) < 0 &&
                Math.abs($util.convertInt(item.cssInitial('marginLeft', true))) <= $util.convertInt(item.documentParent.cssInitial('marginLeft', true))
            );
            if (ordinal && mainData.ordinal === '') {
                let output = '';
                ordinal.parent = parent;
                if (ordinal.inlineText || ordinal.length === 0) {
                    output = controller.renderNode(ordinal, parent, $enum.NODE_STANDARD.TEXT);
                }
                else if (ordinal.every(item => item.pageflow)) {
                    output = controller.renderGroup(ordinal, parent, $enum.NODE_STANDARD.RELATIVE);
                }
                else {
                    output = controller.renderGroup(ordinal, parent, $enum.NODE_STANDARD.CONSTRAINT);
                }
                controller.prependBefore(node.id, output);
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
                const layoutMarginLeft = left > 0 ? $util.formatPX(left) : '';
                const options = createAttribute({
                    android: {
                        layout_columnWeight: columnWeight
                    }
                });
                if (positionInside) {
                    controller.prependBefore(
                        node.id,
                        controller.renderNodeStatic(
                            $enum.NODE_STANDARD.SPACE,
                            parent.renderDepth + 1,
                            {
                                android: {
                                    minWidth,
                                    layout_columnWeight: columnWeight,
                                    [node.localizeString(BOX_ANDROID.MARGIN_LEFT)]: layoutMarginLeft
                                }
                            },
                            'wrap_content',
                            'wrap_content'
                        )
                    );
                    Object.assign(options.android, {
                        minWidth: $util.formatPX('24')
                    });
                }
                else {
                    Object.assign(options.android, {
                        minWidth,
                        gravity: paddingLeft > 20 ? node.localizeString(gravity) : '',
                        [node.localizeString(BOX_ANDROID.MARGIN_LEFT)]: layoutMarginLeft,
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
                        Object.assign(options.android, { text: mainData.ordinal });
                    }
                    const companion = new View(this.application.processing.cache.nextId, document.createElement('SPAN'), this.application.viewController.delegateNodeInit) as T;
                    companion.alignmentType = $enum.NODE_ALIGNMENT.SPACE;
                    companion.nodeName = `${node.tagName}_ORDINAL`;
                    companion.setNodeType(NODE_ANDROID.SPACE);
                    companion.inherit(node, 'style');
                    if (mainData.ordinal !== '' && !/[A-Za-z\d]+\./.test(mainData.ordinal) && companion.toInt('fontSize') > 12) {
                        companion.css('fontSize', '12px');
                    }
                    node.companion = companion;
                    this.application.processing.cache.append(companion, false);
                    controller.prependBefore(
                        node.id,
                        controller.renderNodeStatic(
                            image !== '' ? $enum.NODE_STANDARD.IMAGE
                                         : mainData.ordinal !== '' ? $enum.NODE_STANDARD.TEXT : $enum.NODE_STANDARD.SPACE,
                            parent.renderDepth + 1,
                            options,
                            'wrap_content',
                            'wrap_content',
                            companion
                        )
                    );
                }
            }
            if (columnCount > 0) {
                node.android('layout_columnWeight', '1');
            }
        }
        return { output: '' };
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
                this.application.viewController.prependBefore(
                    current.id,
                    this.application.viewController.renderNodeStatic(
                        $enum.NODE_STANDARD.SPACE,
                        current.renderDepth,
                        {
                            android: {
                                layout_columnSpan: columnCount.toString()
                            }
                        },
                        'match_parent',
                        $util.formatPX(spaceHeight)
                    ),
                    0
                );
            }
        }
    }

    public postProcedure(node: T) {
        if (node.blockStatic && !node.has('width')) {
            node.android('layout_width', 'match_parent');
        }
    }
}