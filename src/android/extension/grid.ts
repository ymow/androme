import { GridCellData, GridData } from '../../extension/types/data';

import View from '../view';

import $const = androme.lib.constant;
import $dom = androme.lib.dom;
import $enum = androme.lib.enumeration;
import $util = androme.lib.util;

export default class <T extends View> extends androme.lib.extensions.Grid<T> {
    public processChild(node: T, parent: T): ExtensionResult<T> {
        const data: GridCellData = node.data($const.EXT_NAME.GRID, 'cellData');
        if (data) {
            if (data.rowSpan > 1) {
                node.android('layout_rowSpan', data.rowSpan.toString());
            }
            if (data.columnSpan > 1) {
                node.android('layout_columnSpan', data.columnSpan.toString());
            }
            if (node.parent.display === 'table' && node.display === 'table-cell') {
                node.mergeGravity('layout_gravity', 'fill');
            }
        }
        return super.processChild(node, parent);
    }

    public postBaseLayout(node: T) {
        if (!(node.display === 'table' && node.css('borderCollapse') === 'collapse')) {
            const mainData: GridData = node.data($const.EXT_NAME.GRID, 'mainData');
            if (mainData) {
                node.each(item => {
                    const cellData: GridCellData = item.data($const.EXT_NAME.GRID, 'cellData');
                    if (cellData) {
                        const dimensions = $dom.getBoxSpacing(item.documentParent.element, true);
                        const padding = mainData.padding;
                        if (cellData.cellFirst) {
                            padding.top = dimensions.paddingTop + dimensions.marginTop;
                        }
                        if (cellData.rowStart) {
                            padding.left = Math.max(dimensions.marginLeft + dimensions.paddingLeft, padding.left);
                        }
                        if (cellData.rowEnd) {
                            const heightBottom = dimensions.marginBottom + dimensions.paddingBottom + (!cellData.cellLast ? dimensions.marginTop + dimensions.paddingTop : 0);
                            if (heightBottom > 0) {
                                if (cellData.cellLast) {
                                    padding.bottom = heightBottom;
                                }
                                else {
                                    this.application.viewController.appendAfter(
                                        item.id,
                                        (<android.lib.base.Controller<T>> this.application.viewController).renderColumnSpace(item.renderDepth, 'match_parent', $util.formatPX(heightBottom), mainData.columnCount)
                                    );
                                }
                            }
                            padding.right = Math.max(dimensions.marginRight + dimensions.paddingRight, padding.right);
                        }
                    }
                }, true);
            }
        }
        const data: GridData = node.data($const.EXT_NAME.GRID, 'mainData');
        if (data) {
            node.modifyBox($enum.BOX_STANDARD.PADDING_TOP, data.padding.top);
            node.modifyBox($enum.BOX_STANDARD.PADDING_RIGHT, data.padding.right);
            node.modifyBox($enum.BOX_STANDARD.PADDING_BOTTOM, data.padding.bottom);
            node.modifyBox($enum.BOX_STANDARD.PADDING_LEFT, data.padding.left);
        }
    }
}