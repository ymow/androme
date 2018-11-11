import { CssGridData, CssGridCellData } from './types/data';

import { BOX_STANDARD } from '../lib/enumeration';
import { EXT_NAME } from '../lib/constant';

import Node from '../base/node';
import Extension from '../base/extension';

import { convertInt, convertPX, isNumber, isUnit, trimString } from '../lib/util';

const REGEX_PARTIAL = {
    UNIT: '[\\d.]+[a-z%]+|auto|max-content|min-content',
    MINMAX: 'minmax\\(.*?, .*?\\)',
    FIT_CONTENT: 'fit-content\\([\\d.]+[a-z%]+\\)',
    REPEAT: 'repeat\\((?:auto-fit|auto-fill|[0-9]+), .*?\\)',
    NAMED: '\\[[\\w\\-\\s]+\\]'
};

const PATTERN_GRID = {
    UNIT: new RegExp(`^${REGEX_PARTIAL.UNIT}$`),
    NAMED: new RegExp(`\\s*(${REGEX_PARTIAL.UNIT}|${REGEX_PARTIAL.MINMAX}|${REGEX_PARTIAL.FIT_CONTENT}|${REGEX_PARTIAL.REPEAT}|${REGEX_PARTIAL.NAMED})\\s*`, 'g')
};

export default class CssGrid<T extends Node> extends Extension<T> {
    public condition(node: T) {
        return node.length > 0 && node.display === 'grid';
    }

    public processNode(node: T, parent: T): ExtensionResult<T> {
        const fontSize = node.css('fontSize');
        const mainData = <CssGridData<T>> {
            children: new Set(),
            rows: [],
            rowCount: 0,
            rowGap: convertInt(convertPX(node.css('rowGap'), fontSize)),
            rowUnit: [],
            rowAuto: [],
            rowName: {},
            columnCount: 0,
            columnGap: convertInt(convertPX(node.css('columnGap'), fontSize)),
            columnUnit: [],
            columnAuto: [],
            columnName: {},
            templateAreas: {}
        };
        function convertUnit(value: string) {
            return isUnit(value) ? convertPX(value, fontSize) : value;
        }
        function setDataRows(item: T, placement: number[]) {
            if (placement.every(value => value > 0)) {
                for (let i = placement[0] - 1; i < placement[2] - 1; i++) {
                    if (mainData.rows[i] === undefined) {
                        mainData.rows[i] = [];
                    }
                    for (let j = placement[1] - 1; j < placement[3] - 1; j++) {
                        if (columnIndex[i] === undefined) {
                            columnIndex[i] = 0;
                        }
                        mainData.rows[i][j] = item;
                        columnIndex[i]++;
                    }
                }
                return true;
            }
            return false;
        }
        [node.styleMap.gridTemplateRows, node.styleMap.gridTemplateColumns, node.css('gridAutoRows'), node.css('gridAutoColumns')].forEach((value, index) => {
            if (value && value !== 'none' && value !== 'auto') {
                let i = 1;
                let match: RegExpMatchArray | null;
                while ((match = PATTERN_GRID.NAMED.exec(value)) !== null) {
                    if (index < 2) {
                        if (PATTERN_GRID.UNIT.test(match[1])) {
                            mainData[index === 0 ? 'rowUnit' : 'columnUnit'].push(convertUnit(match[1]));
                            i++;
                        }
                        else if (match[1].charAt(0) === '[') {
                            const direction = index === 0 ? 'rowName' : 'columnName';
                            const named = match[1].substring(1, match[1].length - 1);
                            if (mainData[direction][named] === undefined) {
                                mainData[direction][named] = [];
                            }
                            mainData[direction][named].push(i);
                        }
                    }
                    else {
                        mainData[index === 2 ? 'rowAuto' : 'columnAuto'].push(convertPX(match[1]));
                    }
                }
            }
        });
        node.css('gridTemplateAreas').split(/"[\s\n]+"/).map(value => trimString(value.trim(), '"')).forEach((value, row) => {
            value.split(' ').forEach((area, column) => {
                if (area !== '.') {
                    if (mainData.templateAreas[area] === undefined) {
                        mainData.templateAreas[area] = {
                            rowStart: row,
                            rowSpan: 1,
                            columnStart: column,
                            columnSpan: 1
                        };
                    }
                    else {
                        mainData.templateAreas[area].rowSpan = (row - mainData.templateAreas[area].rowStart) + 1;
                        mainData.templateAreas[area].columnSpan++;
                    }
                }
            });
        });
        let output = '';
        const columnIndex: number[] = [];
        mainData.columnCount = mainData.columnUnit.length;
        node.each((item: T, index) => {
            const positions = [item.css('gridRowStart'), item.css('gridColumnStart'), item.css('gridRowEnd'), item.css('gridColumnEnd')];
            if (mainData.templateAreas[positions[0]] && positions.every(value => value === positions[0])) {
                const cellData = mainData.templateAreas[positions[0]];
                const placement = [
                    cellData.rowStart + 1,
                    cellData.columnStart + 1,
                    cellData.rowStart + cellData.rowSpan + 1,
                    cellData.columnStart + cellData.columnSpan + 1
                ];
                if (setDataRows(item, placement)) {
                    item.data(EXT_NAME.CSS_GRID, 'cellData', cellData);
                }
            }
            else {
                const placement: number[] = [];
                for (let i = 0; i < positions.length; i++) {
                    const value = positions[i];
                    if (value === 'auto') {
                        placement.push(placement[i - 2] ? placement[i - 2] + 1 : 0);
                    }
                    else {
                        let [location, named] = value.split(' ');
                        const direction = i % 2 === 0 ? 'rowName' : 'columnName';
                        if (!named && isNumber(location)) {
                            placement.push(parseInt(location));
                        }
                        else {
                            if (location === 'span') {
                                placement.push(placement[i - 2] + parseInt(named));
                            }
                            else {
                                if (!named) {
                                    named = location;
                                    location = '1';
                                }
                                if (mainData[direction][named] !== undefined && parseInt(location) <= mainData[direction][named].length) {
                                    placement.push(mainData[direction][named][parseInt(location) - 1] + (i >= 2 && named === positions[i - 2] ? 1 : 0));
                                }
                            }
                        }
                    }
                }
                const gridArea = item.css('gridArea').split(/\s*\/\s*/);
                gridArea.forEach((value, position) => {
                    if (placement[position] === 0) {
                        switch (position) {
                            case 0:
                            case 1:
                                if (value !== 'auto') {
                                    placement[position] = parseInt(value);
                                }
                                else {
                                    if (index === 0) {
                                        placement[position] = 1;
                                    }
                                }
                                break;
                            case 2:
                            case 3:
                                if (value !== 'auto') {
                                    if (isNumber(value)) {
                                        placement[position] = parseInt(value);
                                    }
                                    else if (value.startsWith('span')) {
                                        placement[position] = placement[position - 2] + parseInt(value.split(' ')[1]);
                                    }
                                }
                                else {
                                    if (index === 0) {
                                        placement[position] = 2;
                                    }
                                }
                                break;
                        }
                    }
                });
                if (placement[0] === 0) {
                    for (let i = 0; i < columnIndex.length; i++) {
                        if (columnIndex[i] < mainData.columnCount) {
                            let valid = true;
                            if (placement[2] > 1) {
                                for (let j = 1; j < placement[2]; j++) {
                                    if (columnIndex[i + j] >= mainData.columnCount) {
                                        valid = false;
                                        break;
                                    }
                                }
                            }
                            if (valid) {
                                placement[0] = i + 1;
                                break;
                            }
                        }
                    }
                    if (placement[0] === 0) {
                        placement[0] = columnIndex.length + 1;
                    }
                }
                if (placement[2] === 0) {
                    placement[2] = placement[0] + 1;
                }
                if (placement[1] === 0) {
                    let startIndex: ArrayObject<Set<number>> = [];
                    const minSpan = placement[3] || 1;
                    for (let i = placement[0] - 1; i < placement[2] - 1; i++) {
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
                        startIndex = startIndex.filter(openGap => openGap.size > 0).sort((a, b) => a.size <= b.size ? -1 : 1);
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
                                    placement[1] = value + 1;
                                    break;
                                }
                            }
                        }
                        else if (startIndex.length === 1) {
                            placement[1] = startIndex[0].values().next().value + 1;
                        }
                        else {
                            placement[1] = 1;
                        }
                    }
                }
                if (placement[3] === 0) {
                    placement[3] = placement[1] + 1;
                }
                if (setDataRows(item, placement)) {
                    item.data(EXT_NAME.CSS_GRID, 'cellData', <CssGridCellData> {
                        rowStart: placement[0] - 1,
                        rowSpan: placement[2] - placement[0],
                        columnStart: placement[1] - 1,
                        columnSpan: placement[3] - placement[1]
                    });
                }
            }
        });
        if (mainData.rows.length > 0) {
            for (const row of mainData.rows) {
                mainData.columnCount = Math.max(row.length, mainData.columnCount);
                for (const column of row) {
                    if (column) {
                        mainData.children.add(column);
                    }
                }
            }
            if (mainData.children.size === node.length) {
                mainData.rowCount = mainData.rows.length;
                const modified = new Set<T>();
                for (let i = 0; i < mainData.rowCount; i++) {
                    for (let j = 0; j < mainData.columnCount; j++) {
                        const item = mainData.rows[i][j];
                        if (item && !modified.has(item)) {
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
        return { output, complete: true };
    }
}