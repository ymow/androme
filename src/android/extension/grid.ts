import View from '../view';

import $const = androme.lib.constant;
import $dom = androme.lib.dom;
import $enum = androme.lib.enumeration;
import $util = androme.lib.util;

export default class <T extends View> extends androme.lib.extensions.Grid<T> {
    public processChild(node: T, parent: T): ExtensionResult<T> {
        const cellData: GridCellData<T> = node.data($const.EXT_NAME.GRID, 'cellData');
        if (cellData) {
            if (cellData.rowSpan > 1) {
                node.android('layout_rowSpan', cellData.rowSpan.toString());
            }
            if (cellData.columnSpan > 1) {
                node.android('layout_columnSpan', cellData.columnSpan.toString());
            }
            if (node.parent.tableElement && node.display === 'table-cell') {
                node.mergeGravity('layout_gravity', 'fill');
            }
        }
        return super.processChild(node, parent);
    }

    public postBaseLayout(node: T) {
        if (!(node.tableElement && node.css('borderCollapse') === 'collapse')) {
            const mainData: GridData = node.data($const.EXT_NAME.GRID, 'mainData');
            if (mainData) {
                node.each(item => {
                    const cellData: GridCellData<T> = item.data($const.EXT_NAME.GRID, 'cellData');
                    if (cellData) {
                        const dimensions = $dom.getBoxSpacing(item.documentParent.element, true);
                        if (cellData.cellStart) {
                            mainData.paddingTop = dimensions.paddingTop + dimensions.marginTop;
                        }
                        if (cellData.rowStart) {
                            mainData.paddingLeft = Math.max(dimensions.marginLeft + dimensions.paddingLeft, mainData.paddingLeft);
                        }
                        if (cellData.rowEnd) {
                            const heightBottom = dimensions.marginBottom + dimensions.paddingBottom + (!cellData.cellEnd ? dimensions.marginTop + dimensions.paddingTop : 0);
                            if (heightBottom > 0) {
                                if (cellData.cellEnd) {
                                    mainData.paddingBottom = heightBottom;
                                }
                                else {
                                    this.application.viewController.appendAfter(
                                        item.id,
                                        (<android.lib.base.Controller<T>> this.application.viewController).renderSpace(item.renderDepth, 'match_parent', $util.formatPX(heightBottom), mainData.columnCount)
                                    );
                                }
                            }
                            mainData.paddingRight = Math.max(dimensions.marginRight + dimensions.paddingRight, mainData.paddingRight);
                        }
                    }
                }, true);
            }
            node.modifyBox($enum.BOX_STANDARD.PADDING_TOP, mainData.paddingTop);
            node.modifyBox($enum.BOX_STANDARD.PADDING_RIGHT, mainData.paddingRight);
            node.modifyBox($enum.BOX_STANDARD.PADDING_BOTTOM, mainData.paddingBottom);
            node.modifyBox($enum.BOX_STANDARD.PADDING_LEFT, mainData.paddingLeft);
        }
    }
}