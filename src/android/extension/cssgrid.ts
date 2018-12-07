import { BOX_ANDROID, CONTAINER_ANDROID } from '../lib/constant';
import { CONTAINER_NODE } from '../lib/enumeration';

import View from '../view';

import { createAttribute } from '../lib/util';

import $Layout = androme.lib.base.Layout;

import $const = androme.lib.constant;
import $dom = androme.lib.dom;
import $enum = androme.lib.enumeration;
import $util = androme.lib.util;
import $xml = androme.lib.xml;

export default class <T extends View> extends androme.lib.extensions.CssGrid<T> {
    public processNode(node: T, parent: T): ExtensionResult<T> {
        super.processNode(node, parent);
        const mainData: CssGridData<T> = node.data($const.EXT_NAME.CSS_GRID, 'mainData');
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
            layout.rowCount = mainData.row.count;
            layout.columnCount = mainData.column.count;
            output = this.application.renderNode(layout);
        }
        return { output, complete: output !== '' };
    }

    public processChild(node: T, parent: T): ExtensionResult<T> {
        const mainData: CssGridData<T> = parent.data($const.EXT_NAME.CSS_GRID, 'mainData');
        const cellData: CssGridCellData = node.data($const.EXT_NAME.CSS_GRID, 'cellData');
        let output = '';
        let container: T | undefined;
        if (mainData && cellData) {
            function applyLayout(item: T, direction: string, dimension: string) {
                const data = <CssGridDirectionData> mainData[direction];
                const cellSpan = `${direction}Span`;
                const cellStart = `${direction}Start`;
                const minDimension = `min${$util.capitalize(dimension)}`;
                let size = 0;
                let minSize = 0;
                let minUnitSize = 0;
                let sizeWeight = 0;
                if (data.unit.every(value => value === 'auto')) {
                    if (dimension === 'width') {
                        data.unit = data.unit.map(() => '1fr');
                    }
                    else {
                        data.unit.length = 0;
                    }
                }
                for (let i = 0, j = 0; i < cellData[cellSpan]; i++) {
                    minUnitSize += parseInt(parent.convertPX(data.unitMin[cellData[cellStart] + i]));
                    let value = data.unit[cellData[cellStart] + i];
                    if (!$util.hasValue(value)) {
                        if (data.auto[j]) {
                            value = data.auto[j];
                            if (data.auto[j + 1]) {
                                j++;
                            }
                        }
                        else {
                            continue;
                        }
                    }
                    if ($util.hasValue(value)) {
                        if (value === 'auto' || value === 'min-content' || value === 'max-content') {
                            if (parent.has(dimension) || value === 'min-content') {
                                size = node.bounds[dimension];
                                minSize = 0;
                                sizeWeight = 0;
                            }
                            else {
                                size = 0;
                                minSize = 0;
                                sizeWeight = 0.01;
                            }
                            break;
                        }
                        else if ($util.isPercent(value)) {
                            sizeWeight += parseInt(value) / 100;
                            minSize = size;
                            size = 0;
                        }
                        else if (value.endsWith('fr')) {
                            sizeWeight += parseInt(value);
                            minSize = size;
                            size = 0;
                        }
                        else if (value.endsWith('px')) {
                            const gap = parseInt(value);
                            if (minSize === 0) {
                                size += gap;
                            }
                            else {
                                minSize += gap;
                            }
                        }
                    }
                }
                if (cellData[cellSpan] > 1) {
                    const value = (cellData[cellSpan] - 1) * data.gap;
                    if (size > 0 && minSize === 0) {
                        size += value;
                    }
                    else if (minSize > 0) {
                        minSize += value;
                    }
                    if (minUnitSize > 0) {
                        minUnitSize += value;
                    }
                }
                if (minUnitSize > 0) {
                    if (data.autoFill && size === 0 && mainData[direction === 'column' ? 'row' : 'column'].count === 1) {
                        size = Math.max(node.bounds.width, minUnitSize);
                        sizeWeight = 0;
                    }
                    else {
                        minSize = minUnitSize;
                    }
                }
                item.android(`layout_${direction}`, cellData[cellStart].toString());
                if (cellData[cellSpan] > 1) {
                    item.android(`layout_${direction}Span`, cellData[cellSpan].toString());
                }
                if (minSize > 0 && !item.has(minDimension)) {
                    item.css(minDimension, $util.formatPX(minSize));
                    item.unsetCache(dimension);
                }
                if (sizeWeight > 0) {
                    item.android(`layout_${dimension}`, '0px');
                    item.android(`layout_${direction}Weight`, sizeWeight.toString());
                    item.mergeGravity('layout_gravity', direction === 'column' ? 'fill_horizontal' : 'fill_vertical');
                }
                else if (size > 0 && !item.has(dimension)) {
                    item.css(dimension, $util.formatPX(size), true);
                }
            }
            const alignItems = node.has('alignSelf') ? node.css('alignSelf') : mainData.alignItems;
            const justifyItems = node.has('justifySelf') ? node.css('justifySelf') : mainData.justifyItems;
            if (/(start|end|center|baseline)/.test(alignItems) || /(start|end|center|baseline|left|right)/.test(justifyItems)) {
                container = new View(
                    this.application.nextId,
                    $dom.createElement(node.absoluteParent.baseElement),
                    this.application.controllerHandler.delegateNodeInit
                ) as T;
                container.tagName = node.tagName;
                container.setControlType(CONTAINER_ANDROID.FRAME, CONTAINER_NODE.FRAME);
                container.inherit(node, 'initial', 'base');
                container.resetBox($enum.BOX_STANDARD.MARGIN | $enum.BOX_STANDARD.PADDING);
                container.exclude({ procedure: $enum.NODE_PROCEDURE.AUTOFIT | $enum.NODE_PROCEDURE.CUSTOMIZATION, resource: $enum.NODE_RESOURCE.BOX_STYLE | $enum.NODE_RESOURCE.ASSET });
                parent.appendTry(node, container);
                container.render(parent);
                this.application.processing.cache.append(container, false);
                node.parent = container;
                node.inheritBox($enum.BOX_STANDARD.MARGIN, container);
                applyLayout(container, 'column', 'width');
                applyLayout(container, 'row', 'height');
                let inlineWidth = false;
                if (justifyItems.endsWith('start') || justifyItems.endsWith('left') || justifyItems.endsWith('baseline')) {
                    node.mergeGravity('layout_gravity', 'left');
                    inlineWidth = true;
                }
                else if (justifyItems.endsWith('end') || justifyItems.endsWith('right')) {
                    node.mergeGravity('layout_gravity', 'right');
                    inlineWidth = true;
                }
                else if (justifyItems.endsWith('center')) {
                    node.mergeGravity('layout_gravity', 'center_horizontal');
                    inlineWidth = true;
                }
                if (!node.hasWidth) {
                    node.android('layout_width', inlineWidth ? 'wrap_content' : 'match_parent', false);
                }
                if (alignItems.endsWith('start') || alignItems.endsWith('baseline')) {
                    node.mergeGravity('layout_gravity', 'top');
                }
                else if (alignItems.endsWith('end')) {
                    node.mergeGravity('layout_gravity', 'bottom');
                }
                else if (alignItems.endsWith('center')) {
                    node.mergeGravity('layout_gravity', 'center_vertical');
                }
                else if (!node.hasHeight) {
                    node.android('layout_height', 'match_parent', false);
                }
                output = $xml.getEnclosingTag(CONTAINER_ANDROID.FRAME, container.id, container.renderDepth, $xml.formatPlaceholder(container.id));
            }
            const target = container || node;
            applyLayout(target, 'column', 'width');
            applyLayout(target, 'row', 'height');
            if (!target.has('height')) {
                if (parent.hasHeight) {
                    target.android('layout_height', '0px');
                    target.android('layout_rowWeight', '1');
                }
                target.mergeGravity('layout_gravity', 'fill_vertical');
            }
            if (!target.has('width')) {
                target.mergeGravity('layout_gravity', 'fill_horizontal');
            }
        }
        return { output, parent: container, complete: output !== '' };
    }

    public postProcedure(node: T) {
        const mainData: CssGridData<T> = node.data($const.EXT_NAME.CSS_GRID, 'mainData');
        if (mainData && node.renderParent) {
            const controller = <android.lib.base.Controller<T>> this.application.controllerHandler;
            const columnUnit = mainData.column.unit;
            const columnGap = !columnUnit.includes('auto') ? mainData.column.gap * (mainData.column.count - 1) : 0;
            const lastChild = Array.from(mainData.children)[mainData.children.size - 1];
            if (!node.renderParent.hasAlign($enum.NODE_ALIGNMENT.AUTO_LAYOUT)) {
                if (columnGap > 0) {
                    let width = $util.convertInt(node.android('layout_width'));
                    if (width > 0) {
                        width += columnGap;
                        node.android('layout_width', $util.formatPX(width));
                    }
                    let minWidth = $util.convertInt(node.android('minWidth'));
                    if (minWidth > 0) {
                        minWidth += columnGap;
                        node.android('minWidth', $util.formatPX(minWidth));
                    }
                }
            }
            if (node.inlineWidth && node.has('maxWidth')) {
                node.android('layout_width', $util.formatPX(node.bounds.width + columnGap));
            }
            if (columnUnit.every(value => $util.isPercent(value))) {
                const percentTotal = columnUnit.reduce((a, b) => a + parseInt(b), 0);
                if (percentTotal < 100) {
                    node.android('columnCount', (mainData.column.count + 1).toString());
                    for (let i = 0; i < mainData.row.count; i++) {
                        controller.appendAfter(
                            lastChild.id,
                            controller.renderSpace(
                                node.renderDepth + 1,
                                $util.formatPercent(100 - percentTotal),
                                'wrap_content',
                                0,
                                0,
                                createAttribute({
                                    android: {
                                        [node.localizeString(BOX_ANDROID.MARGIN_LEFT)]: $util.formatPX(mainData.column.gap),
                                        layout_row: i.toString(),
                                        layout_column: mainData.column.count.toString()
                                    }
                                })
                            )
                        );
                    }
                }
            }
            for (let i = 0; i < mainData.emptyRows.length; i++) {
                const item = mainData.emptyRows[i];
                if (item) {
                    for (let j = 0; j < item.length; j++) {
                        if (item[j]) {
                            controller.appendAfter(
                                lastChild.id,
                                controller.renderSpace(
                                    node.renderDepth + 1,
                                    'wrap_content',
                                    $util.formatPX(mainData.row.gap),
                                    0,
                                    0,
                                    createAttribute({
                                        android: {
                                            layout_row: i.toString(),
                                            layout_column: j.toString()
                                        }
                                    })
                                )
                            );
                            break;
                        }
                    }
                }
            }
        }
    }
}