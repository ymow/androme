import { CssGridData, CssGridCellData } from './types/data';

import { EXT_NAME } from '../lib/constant';

import Node from '../base/node';
import Extension from '../base/extension';

import { convertInt, convertPX, isNumber, isPercent } from '../lib/util';
import { BOX_STANDARD } from '../lib/enumeration';

const PATTERN_GRID = {
    UNIT_ONLY: /^(\s*[0-9]+(?:px|em|pt|fr))+$/
};

export default class CssGrid<T extends Node> extends Extension<T> {
    public condition() {
        const node = this.node as T;
        return this.included() || (node.length > 0 && node.display === 'grid');
    }

    public processNode(): ExtensionResult {
        const node = this.node as T;
        const parent = this.parent as T;
        const gridTemplateColumns = node.css('gridTemplateColumns');
        const fontSize = node.css('fontSize');
        const mainData = <CssGridData<T>> {
            children: new Set(),
            rows: [],
            rowCount: 0,
            rowGap: convertInt(convertPX(node.css('rowGap'), fontSize)),
            columnCount: 0,
            columnGap: convertInt(convertPX(node.css('columnGap'), fontSize)),
            columnUnit: []
        };
        let output = '';
        const match = PATTERN_GRID.UNIT_ONLY.exec(gridTemplateColumns);
        if (match) {
            mainData.columnUnit.push(...gridTemplateColumns.split(' ').map(value => isPercent(value) ? value : convertPX(value, fontSize)));
            mainData.columnCount = mainData.columnUnit.length;
        }
        if (mainData.columnCount > 0) {
            const columnIndex: number[] = [];
            node.each((item: T, index: number) => {
                const gridIndex = [convertInt(item.css('gridRowStart')), convertInt(item.css('gridColumnStart')), convertInt(item.css('gridRowEnd')), convertInt(item.css('gridColumnEnd'))];
                const gridArea = item.css('gridArea').split(/\s*\/\s*/);
                gridArea.forEach((value, position) => {
                    if (gridIndex[position] === 0) {
                        switch (position) {
                            case 0:
                            case 1:
                                if (value !== 'auto') {
                                    gridIndex[position] = parseInt(value);
                                }
                                else {
                                    if (index === 0) {
                                        gridIndex[position] = 1;
                                    }
                                }
                                break;
                            case 2:
                            case 3:
                                if (value !== 'auto') {
                                    if (isNumber(value)) {
                                        gridIndex[position] = parseInt(value);
                                    }
                                    else if (value.startsWith('span')) {
                                        gridIndex[position] = gridIndex[position - 2] + parseInt(value.split(' ')[1]);
                                    }
                                }
                                else {
                                    if (index === 0) {
                                        gridIndex[position] = 2;
                                    }
                                }
                                break;
                        }
                    }
                });
                if (gridIndex[0] === 0) {
                    for (let i = 0; i < columnIndex.length; i++) {
                        if (columnIndex[i] < mainData.columnCount) {
                            let valid = true;
                            if (gridIndex[2] > 1) {
                                for (let j = 1; j < gridIndex[2]; j++) {
                                    if (columnIndex[i + j] >= mainData.columnCount) {
                                        valid = false;
                                        break;
                                    }
                                }
                            }
                            if (valid) {
                                gridIndex[0] = i + 1;
                                break;
                            }
                        }
                    }
                    if (gridIndex[0] === 0) {
                        gridIndex[0] = columnIndex.length + 1;
                    }
                }
                if (gridIndex[2] === 0) {
                    gridIndex[2] = gridIndex[0] + 1;
                }
                if (gridIndex[1] === 0) {
                    let startIndex: ArrayObject<Set<number>> = [];
                    const minSpan = gridIndex[3] || 1;
                    for (let i = gridIndex[0] - 1; i < gridIndex[2] - 1; i++) {
                        if (mainData.rows[i] === undefined) {
                            startIndex.push(new Set());
                        }
                        else if (mainData.rows[i].map(column => column).length < mainData.columnCount) {
                            const openGap: number[] = [];
                            let cellGap = 0;
                            for (let j = 0; j < mainData.columnCount; j++) {
                                if (mainData.rows[i][j] === undefined) {
                                    cellGap++;
                                }
                                else {
                                    cellGap = 0;
                                }
                                if (cellGap === minSpan) {
                                    openGap.push(j - (minSpan - 1));
                                    cellGap = 0;
                                }
                            }
                            if (openGap.length > 0) {
                                startIndex.push(new Set(openGap));
                            }
                            else {
                                break;
                            }
                        }
                        else {
                            break;
                        }
                    }
                    if (startIndex.length === minSpan) {
                        startIndex = startIndex.filter(indexGap => indexGap.size > 0).sort((a, b) => a.size <= b.size ? -1 : 1);
                        if (startIndex.length > 1) {
                            for (const value of startIndex[0].values()) {
                                let valid = true;
                                for (let i = 1; i < startIndex.length; i++) {
                                    if (!startIndex[i].has(value)) {
                                        valid = false;
                                        break;
                                    }
                                }
                                if (valid) {
                                    gridIndex[1] = value + 1;
                                    break;
                                }
                            }
                        }
                        else if (startIndex.length === 1) {
                            gridIndex[1] = startIndex[0].values().next().value + 1;
                        }
                        else {
                            gridIndex[1] = 1;
                        }
                    }
                }
                if (gridIndex[3] === 0) {
                    gridIndex[3] = gridIndex[1] + 1;
                }
                if (gridIndex.every(value => value > 0)) {
                    for (let i = gridIndex[0] - 1; i < gridIndex[2] - 1; i++) {
                        if (mainData.rows[i] === undefined) {
                            mainData.rows[i] = [];
                        }
                        for (let j = gridIndex[1] - 1; j < gridIndex[3] - 1; j++) {
                            if (columnIndex[i] === undefined) {
                                columnIndex[i] = 0;
                            }
                            mainData.rows[i][j] = item;
                            columnIndex[i]++;
                        }
                    }
                    item.data(EXT_NAME.CSS_GRID, 'cellData', <CssGridCellData> {
                        rowStart: gridIndex[0] - 1,
                        rowSpan: gridIndex[2] - gridIndex[0],
                        columnStart: gridIndex[1] - 1,
                        columnSpan: gridIndex[3] - gridIndex[1]
                    });
                }
            });
            if (mainData.rows.every(item => item.length === mainData.columnCount)) {
                for (const row of mainData.rows) {
                    for (const column of row) {
                        mainData.children.add(column);
                    }
                }
                if (mainData.children.size === node.length) {
                    mainData.rowCount = mainData.rows.length;
                    const modified = new Set<T>();
                    for (let i = 0; i < mainData.rowCount; i++) {
                        for (let j = 0; j < mainData.columnCount; j++) {
                            const item = mainData.rows[i][j];
                            if (!modified.has(item)) {
                                const cellData = <CssGridCellData> item.data(EXT_NAME.CSS_GRID, 'cellData');
                                const x = j + (cellData ? cellData.columnSpan - 1 : 0);
                                const y = i + (cellData ? cellData.rowSpan - 1 : 0);
                                if (x < mainData.columnCount - 1) {
                                    item.modifyBox(BOX_STANDARD.MARGIN_RIGHT, mainData.columnGap);
                                }
                                if (y < mainData.rowCount - 1) {
                                    item.modifyBox(BOX_STANDARD.MARGIN_BOTTOM, mainData.rowGap);
                                }
                                modified.add(item);
                            }
                        }
                    }
                    node.replace(Array.from(mainData.children));
                    node.data(EXT_NAME.CSS_GRID, 'mainData', mainData);
                    output = this.application.writeGridLayout(node, parent, mainData.columnCount, mainData.rowCount);
                }
            }
        }
        return { output, complete: true };
    }
}