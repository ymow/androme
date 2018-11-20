import { NODE_ANDROID } from '../lib/constant';

import View from '../view';

import $const = androme.lib.constant;
import $enum = androme.lib.enumeration;
import $util = androme.lib.util;
import $xml = androme.lib.xml;

export default class <T extends View> extends androme.lib.extensions.CssGrid<T> {
    public processChild(node: T, parent: T): ExtensionResult<T> {
        const mainData: CssGridData<T> = parent.data($const.EXT_NAME.CSS_GRID, 'mainData');
        const cellData: CssGridCellData = node.data($const.EXT_NAME.CSS_GRID, 'cellData');
        let output = '';
        let container: T | undefined;
        if (mainData && cellData) {
            function applyLayout(item: T, direction: string, dimension: string) {
                const data = <CssGridDataAttribute> mainData[direction];
                const cellSpan = `${direction}Span`;
                const cellStart = `${direction}Start`;
                const minDimension = `min${$util.capitalize(dimension)}`;
                let size = 0;
                let minSize = 0;
                let minUnitSize = 0;
                let sizeWeight = 0;
                if (data.unit.every(value => value === 'auto')) {
                    if (dimension === 'width') {
                        data.unit = data.unit.map(value => '1fr');
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
                    if (minSize === 0) {
                        size += value;
                    }
                    else {
                        minSize += value;
                    }
                }
                if (minUnitSize > 0) {
                    minSize = minUnitSize;
                }
                item.android(`layout_${direction}`, cellData[cellStart].toString());
                if (cellData[cellSpan] > 1) {
                    item.android(`layout_${direction}Span`, cellData[cellSpan].toString());
                }
                if (minSize > 0 && !item.has(minDimension)) {
                    item.css(minDimension, $util.formatPX(minSize));
                }
                if (sizeWeight > 0) {
                    item.android(`layout_${dimension}`, '0px');
                    item.android(`layout_${direction}Weight`, sizeWeight.toString());
                }
                else if (size > 0 && !item.has(dimension)) {
                    item.css(dimension, $util.formatPX(size));
                }
            }
            const alignItems = node.has('alignSelf') ? node.css('alignSelf') : mainData.alignItems;
            const justifyItems = node.has('justifySelf') ? node.css('justifySelf') : mainData.justifyItems;
            if (/(start|end|center|baseline)/.test(alignItems) || /(start|end|center|baseline|left|right)/.test(justifyItems)) {
                container = new View(this.application.processing.cache.nextId, node.element, this.application.viewController.delegateNodeInit) as T;
                container.nodeName = node.nodeName;
                container.excludeProcedure |= $enum.NODE_PROCEDURE.AUTOFIT | $enum.NODE_PROCEDURE.CUSTOMIZATION;
                container.excludeResource |= $enum.NODE_RESOURCE.BOX_STYLE | $enum.NODE_RESOURCE.ASSET;
                container.inherit(node, 'initial', 'base');
                container.setNodeType(NODE_ANDROID.FRAME, $enum.NODE_STANDARD.FRAME);
                parent.replaceNode(node, container);
                this.application.processing.cache.append(container, false);
                output = $xml.getEnclosingTag(NODE_ANDROID.FRAME, container.id, container.renderDepth, $xml.formatPlaceholder(container.id));
                container.render(parent);
                applyLayout(container, 'column', 'width');
                applyLayout(container, 'row', 'height');
                container.mergeGravity('layout_gravity', 'fill_vertical');
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
                    node.android('layout_width', inlineWidth ? 'wrap_content' : 'match_parent');
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
                    node.mergeGravity('layout_height', 'match_parent');
                }
                container.resetBox($enum.BOX_STANDARD.MARGIN | $enum.BOX_STANDARD.PADDING);
                node.parent = container;
                node.inheritBox($enum.BOX_STANDARD.MARGIN, container);
            }
            const target = container || node;
            applyLayout(target, 'column', 'width');
            applyLayout(target, 'row', 'height');
            target.mergeGravity('layout_gravity', 'fill_vertical');
        }
        return { output, parent: container, complete: true };
    }

    public postProcedure(node: T) {
        const mainData: CssGridData<T> = node.data($const.EXT_NAME.CSS_GRID, 'mainData');
        if (mainData) {
            const columnGap = (!mainData.column.unit.includes('auto') ? mainData.column.gap * (mainData.column.count - 1) : 0);
            if (columnGap > 0 && node.viewWidth > 0) {
                if (node.has('width')) {
                    let width = $util.convertInt(node.android('layout_width'));
                    if (width > 0) {
                        width += columnGap;
                        node.android('layout_width', $util.formatPX(width));
                    }
                }
                if (node.has('minSize')) {
                    let minSize = $util.convertInt(node.android('minSize'));
                    if (minSize > 0) {
                        minSize += columnGap;
                        node.android('minSize', $util.formatPX(minSize));
                    }
                }
            }
            if (node.has('maxWidth') && node.inlineWidth) {
                node.android('layout_width', $util.formatPX(node.bounds.width + columnGap));
            }
        }
    }
}