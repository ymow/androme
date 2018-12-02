import { CONTAINER_NODE } from '../lib/enumeration';

import View from '../view';

import $Layout = androme.lib.base.Layout;

import $const = androme.lib.constant;
import $dom = androme.lib.dom;
import $enum = androme.lib.enumeration;
import $util = androme.lib.util;

export default class <T extends View> extends androme.lib.extensions.Grid<T> {
    public processNode(node: T, parent: T, mapX: LayoutMapX<T>): ExtensionResult<T> {
        super.processNode(node, parent, mapX);
        const mainData: GridData = node.data($const.EXT_NAME.GRID, 'mainData');
        let output = '';
        if (mainData) {
            const layout = new $Layout(
                parent,
                node,
                CONTAINER_NODE.GRID,
                $enum.NODE_ALIGNMENT.AUTO_LAYOUT,
                node.length,
                node.children as T[]
            );
            layout.columnCount = mainData.columnCount;
            output = this.application.renderNode(layout);
        }
        return { output, complete: output !== '' };
    }

    public processChild(node: T, parent: T): ExtensionResult<T> {
        const mainData: GridData = parent.data($const.EXT_NAME.GRID, 'mainData');
        const cellData: GridCellData<T> = node.data($const.EXT_NAME.GRID, 'cellData');
        if (mainData && cellData) {
            if (cellData.rowSpan > 1) {
                node.android('layout_rowSpan', cellData.rowSpan.toString());
            }
            if (cellData.columnSpan > 1) {
                node.android('layout_columnSpan', cellData.columnSpan.toString());
            }
            if (node.display === 'table-cell') {
                node.mergeGravity('layout_gravity', 'fill');
            }
            const siblings = cellData.siblings ? cellData.siblings.slice() : [];
            if (siblings.length) {
                const controller = <android.lib.base.Controller<T>> this.application.controllerHandler;
                siblings.unshift(node);
                const layout = new $Layout(
                    parent,
                    node,
                    0,
                    0,
                    siblings.length,
                    siblings
                );
                if (layout.linearY) {
                    layout.node = controller.createNodeGroup(node, siblings, parent);
                    layout.setType(CONTAINER_NODE.LINEAR, $enum.NODE_ALIGNMENT.VERTICAL);
                }
                else {
                    layout.init();
                    const result = controller.processTraverseHorizontal(layout);
                    layout.node = result.layout.node;
                }
                if (layout.containerType !== 0) {
                    siblings.forEach(item => item.inherit(layout.node, 'data'));
                    const output = this.application.renderNode(layout);
                    return { output, parent: layout.node, complete: true };
                }
            }
        }
        return { output: '' };
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
                                    this.application.controllerHandler.appendAfter(
                                        item.id,
                                        (<android.lib.base.Controller<T>> this.application.controllerHandler).renderSpace(item.renderDepth, 'match_parent', $util.formatPX(heightBottom), mainData.columnCount)
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
        if (!node.hasWidth && $util.withinFraction(node.box.right, $util.maxArray(node.renderChildren.filter(item => item.inlineFlow || !item.blockStatic).map(item => item.linear.right)))) {
            node.android('layout_width', 'wrap_content');
        }
    }
}