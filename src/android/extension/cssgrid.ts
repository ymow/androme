import { CssGridCellData, CssGridData, CssGridDataAttribute } from '../../extension/types/data';

import View from '../view';

import $const = androme.lib.constant;
import $util = androme.lib.util;

export default class <T extends View> extends androme.lib.extensions.CssGrid<T> {
    public processChild(node: T, parent: T): ExtensionResult<T> {
        const mainData: CssGridData<T> = parent.data($const.EXT_NAME.CSS_GRID, 'mainData');
        const cellData: CssGridCellData = node.data($const.EXT_NAME.CSS_GRID, 'cellData');
        if (mainData && cellData) {
            function applyLayout(direction: string, dimension: string) {
                const cellSpan = `${direction}Span`;
                const cellStart = `${direction}Start`;
                const minDimension = `min${$util.capitalize(dimension)}`;
                const data = <CssGridDataAttribute> mainData[direction];
                let size = 0;
                let minSize = 0;
                let sizeWeight = 0;
                for (let i = 0, j = 0; i < cellData[cellSpan]; i++) {
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
                    else if (value.indexOf('fr') !== -1) {
                        sizeWeight += parseInt(value);
                        minSize = size;
                        size = 0;
                    }
                    else {
                        const gap = parseInt(value);
                        if (minSize === 0) {
                            size += gap;
                        }
                        else {
                            minSize += gap;
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
                node.android(`layout_${direction}`, cellData[cellStart].toString());
                if (cellData[cellSpan] > 1) {
                    node.android(`layout_${direction}Span`, cellData[cellSpan].toString());
                }
                if (size > 0 && !node.has(dimension)) {
                    node.css(dimension, $util.formatPX(size));
                }
                if (minSize > 0 && !node.has(minDimension)) {
                    node.css(minDimension, $util.formatPX(minSize));
                }
                node.android(`layout_${direction}Weight`, sizeWeight > 0 ? sizeWeight.toString() : '0');
            }
            applyLayout('column', 'width');
            applyLayout('row', 'height');
            node.mergeGravity('layout_gravity', 'fill_vertical');
        }
        return { output: '' };
    }

    public postProcedure(node: T) {
        const mainData: CssGridData<T> = node.data($const.EXT_NAME.CSS_GRID, 'mainData');
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