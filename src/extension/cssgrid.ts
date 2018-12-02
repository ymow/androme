import { EXT_NAME } from '../lib/constant';
import { BOX_STANDARD } from '../lib/enumeration';

import Extension from '../base/extension';
import Node from '../base/node';

import { convertInt, isNumber, isUnit, trimString, withinFraction } from '../lib/util';

type GridPosition = {
    placement: number[],
    rowSpan: number,
    columnSpan: number
};

const REGEX_PARTIAL = {
    UNIT: '[\\d.]+[a-z%]+|auto|max-content|min-content',
    MINMAX: 'minmax\\((.*?), (.*?)\\)',
    FIT_CONTENT: 'fit-content\\(([\\d.]+[a-z%]+)\\)',
    REPEAT: 'repeat\\((auto-fit|auto-fill|[0-9]+), ((?:minmax|fit-content)\\(.*?\\)|.*?)\\)',
    NAMED: '\\[([\\w\\-\\s]+)\\]'
};

const PATTERN_GRID = {
    UNIT: new RegExp(`^${REGEX_PARTIAL.UNIT}$`),
    NAMED: new RegExp(`\\s*(${REGEX_PARTIAL.NAMED}|${REGEX_PARTIAL.REPEAT}|${REGEX_PARTIAL.MINMAX}|${REGEX_PARTIAL.FIT_CONTENT}|${REGEX_PARTIAL.UNIT})\\s*`, 'g')
};

function cssOrder<T extends Node>(a: T, b: T) {
    return a.toInt('order') >= b.toInt('order') ? 1 : -1;
}

export default class CssGrid<T extends Node> extends Extension<T> {
    public static createDataAttribute(): CssGridDataAttribute {
        return {
            count: 0,
            gap: 0,
            unit: [],
            unitMin: [],
            auto: [],
            autoFill: false,
            autoFit: false,
            name: {}
        };
    }

    public condition(node: T) {
        return node.gridElement && node.length > 0;
    }

    public processNode(node: T, parent: T): ExtensionResult<T> {
        const mainData = <CssGridData<T>> {
            children: new Set(),
            rowData: [],
            templateAreas: {},
            row: Object.assign(CssGrid.createDataAttribute(), { gap: parseInt(node.convertPX(node.css('rowGap'))) }),
            column: Object.assign(CssGrid.createDataAttribute(), { gap: parseInt(node.convertPX(node.css('columnGap'))) }),
            alignItems: node.css('alignItems'),
            justifyItems: node.css('justifyItems')
        };
        const gridAutoFlow = node.css('gridAutoFlow');
        const horizontal = gridAutoFlow.indexOf('row') !== -1;
        const dense = gridAutoFlow.indexOf('dense') !== -1;
        const rowData: T[][][] = [];
        const cellsPerRow: number[] = [];
        const gridPosition: GridPosition[] = [];
        let rowInvalid: ObjectIndex<boolean> = {};
        function setDataRows(item: T, placement: number[]) {
            if (placement.every(value => value > 0)) {
                for (let i = placement[horizontal ? 0 : 1] - 1; i < placement[horizontal ? 2 : 3] - 1; i++) {
                    if (rowData[i] === undefined) {
                        rowData[i] = [];
                    }
                    for (let j = placement[horizontal ? 1 : 0] - 1; j < placement[horizontal ? 3 : 2] - 1; j++) {
                        if (cellsPerRow[i] === undefined) {
                            cellsPerRow[i] = 0;
                        }
                        if (rowData[i][j] === undefined) {
                            rowData[i][j] = [];
                            cellsPerRow[i]++;
                        }
                        rowData[i][j].push(item);
                    }
                }
                return true;
            }
            return false;
        }
        function convertUnit(value: string) {
            return isUnit(value) ? node.convertPX(value) : value;
        }
        [node.cssInitial('gridTemplateRows', false, true), node.cssInitial('gridTemplateColumns', false, true), node.css('gridAutoRows'), node.css('gridAutoColumns')].forEach((value, index) => {
            if (value && value !== 'none' && value !== 'auto') {
                let i = 1;
                let match: RegExpMatchArray | null;
                while ((match = PATTERN_GRID.NAMED.exec(value)) !== null) {
                    if (index < 2) {
                        const data = mainData[index === 0 ? 'row' : 'column'];
                        if (match[1].charAt(0) === '[') {
                            if (data.name[match[2]] === undefined) {
                                data.name[match[2]] = [];
                            }
                            data.name[match[2]].push(i);
                        }
                        else if (match[1].startsWith('repeat')) {
                            let iterations = 1;
                            switch (match[3]) {
                                case 'auto-fit':
                                    data.autoFit = true;
                                    break;
                                case 'auto-fill':
                                    data.autoFill = true;
                                    break;
                                default:
                                    iterations = convertInt(match[3]);
                                    break;
                            }
                            const minmax = new RegExp(REGEX_PARTIAL.MINMAX).exec(match[4]);
                            if (minmax) {
                                data.unit.push(convertUnit(minmax[2]));
                                data.unitMin.push(convertUnit(minmax[1]));
                                i++;
                            }
                            else if (PATTERN_GRID.UNIT.test(match[4])) {
                                for (let j = 0; j < iterations; j++) {
                                    data.unit.push(match[4]);
                                    data.unitMin.push('');
                                    i++;
                                }
                            }
                        }
                        else if (PATTERN_GRID.UNIT.test(match[1])) {
                            data.unit.push(convertUnit(match[1]));
                            data.unitMin.push('');
                            i++;
                        }
                    }
                    else {
                        mainData[index === 2 ? 'row' : 'column'].auto.push(node.convertPX(match[1]));
                    }
                }
            }
        });
        if (!node.has('gridTemplateAreas') && node.every(item => item.css('gridRow') === 'auto / auto' && item.css('gridColumn') === 'auto / auto')) {
            let row = 0;
            let column = 0;
            const direction = horizontal ? 'left' : 'top';
            node.sort(cssOrder).each((item: T, index) => {
                if (withinFraction(item.linear[direction], node.box[direction])) {
                    row++;
                    column = 1;
                }
                gridPosition[index] = <GridPosition> {
                    placement: horizontal ? [row, column, row + 1, column + 1] : [column, row, column + 1, row + 1],
                    rowSpan: 1,
                    columnSpan: 1
                };
                column++;
            });
        }
        else {
            node.css('gridTemplateAreas').split(/"[\s\n]+"/).map(value => trimString(value.trim(), '"')).forEach((value, i) => {
                value.split(' ').forEach((area, j) => {
                    if (area !== '.') {
                        if (mainData.templateAreas[area] === undefined) {
                            mainData.templateAreas[area] = {
                                rowStart: i,
                                rowSpan: 1,
                                columnStart: j,
                                columnSpan: 1
                            };
                        }
                        else {
                            mainData.templateAreas[area].rowSpan = (i - mainData.templateAreas[area].rowStart) + 1;
                            mainData.templateAreas[area].columnSpan++;
                        }
                    }
                });
            });
            node.sort(cssOrder).each((item: T, index) => {
                const positions = [
                    item.css('gridRowStart'),
                    item.css('gridColumnStart'),
                    item.css('gridRowEnd'),
                    item.css('gridColumnEnd')
                ];
                const placement: number[] = [];
                let rowSpan = 1;
                let columnSpan = 1;
                for (let i = 0; i < positions.length; i++) {
                    const value = positions[i];
                    let template = mainData.templateAreas[value];
                    if (template === undefined) {
                        const match = /^([\w\-]+)-(start|end)$/.exec(value);
                        if (match) {
                            template = mainData.templateAreas[match[1]];
                            if (template) {
                                if (match[2] === 'start') {
                                    switch (i) {
                                        case 0:
                                        case 2:
                                            placement[i] = template.rowStart + 1;
                                            break;
                                        case 1:
                                        case 3:
                                            placement[i] = template.columnStart + 1;
                                            break;
                                    }
                                }
                                else {
                                    switch (i) {
                                        case 0:
                                        case 2:
                                            placement[i] = template.rowStart + template.rowSpan + 1;
                                            break;
                                        case 1:
                                        case 3:
                                            placement[i] = template.columnStart + template.columnSpan + 1;
                                            break;
                                    }
                                }
                            }
                        }
                    }
                    else {
                        switch (i) {
                            case 0:
                                placement[i] = template.rowStart + 1;
                                break;
                            case 1:
                                placement[i] = template.columnStart + 1;
                                break;
                            case 2:
                                placement[i] = template.rowStart + template.rowSpan + 1;
                                break;
                            case 3:
                                placement[i] = template.columnStart + template.columnSpan + 1;
                                break;
                        }
                    }
                }
                if (placement.filter(value => value).length < 4) {
                    function setPlacement(value: string, position: number) {
                        if (isNumber(value)) {
                            placement[position] = parseInt(value);
                            return true;
                        }
                        else if (value.startsWith('span')) {
                            const span = parseInt(value.split(' ')[1]);
                            if (!placement[position - 2]) {
                                if (position % 2 === 0) {
                                    rowSpan = span;
                                }
                                else {
                                    columnSpan = span;
                                }
                            }
                            else {
                                placement[position] = placement[position - 2] + span;
                            }
                            return true;
                        }
                        return false;
                    }
                    for (let i = 0; i < positions.length; i++) {
                        const value = positions[i];
                        if (value !== 'auto' && !placement[i] && !setPlacement(value, i)) {
                            const data = mainData[i % 2 === 0 ? 'row' : 'column'];
                            const alias = value.split(' ');
                            if (alias.length === 1) {
                                alias[1] = alias[0];
                                alias[0] = '1';
                            }
                            if (data.name[alias[1]] && parseInt(alias[0]) <= data.name[alias[1]].length) {
                                placement[i] = data.name[alias[1]][parseInt(alias[0]) - 1] + (alias[1] === positions[i - 2] ? 1 : 0);
                            }
                        }
                    }
                    item.css('gridArea').split(/\s*\/\s*/).forEach((value, position) => !placement[position] && setPlacement(value, position));
                }
                gridPosition[index] = <GridPosition> {
                    placement,
                    rowSpan,
                    columnSpan
                };
            });
        }
        {
            const data = mainData[horizontal ? 'column' : 'row'];
            data.count = Math.max(data.unit.length, 1);
            for (let i = 0; i < gridPosition.length; i++) {
                const item = gridPosition[i];
                if (item) {
                    data.count = Math.max(
                        data.count,
                        item.placement[horizontal ? 1 : 0] || 0,
                        horizontal ? item.columnSpan : item.rowSpan, (item.placement[horizontal ? 3 : 2] || 0) - 1
                    );
                }
            }
            const unitRepeat = data.unit[data.unit.length - 1] || 'auto';
            if (data.autoFill || data.autoFit) {
                for (let i = data.unit.length; i < data.count; i++) {
                    data.unit[i] = unitRepeat;
                    data.unitMin[i] = '';
                }
            }
        }
        node.each((item: T, index) => {
            const position = gridPosition[index];
            const placement = position.placement;
            const ROW_SPAN = horizontal ? position.rowSpan : position.columnSpan;
            const COLUMN_SPAN = horizontal ? position.columnSpan : position.rowSpan;
            const COLUMN_COUNT = horizontal ? mainData.column.count : mainData.row.count;
            const rowA = horizontal ? 0 : 1;
            const colA = horizontal ? 1 : 0;
            const rowB = horizontal ? 2 : 3;
            const colB = horizontal ? 3 : 2;
            while (!placement[0] || !placement[1]) {
                const PLACEMENT = placement.slice();
                if (!PLACEMENT[rowA]) {
                    for (let i = 0, j = 0; i < rowData.length; i++) {
                        if (!rowInvalid[i] && cellsPerRow[i] < COLUMN_COUNT) {
                            if (++j === ROW_SPAN) {
                                PLACEMENT[rowA] = i + 1;
                                break;
                            }
                        }
                    }
                }
                if (!PLACEMENT[rowA]) {
                    placement[rowA] = rowData.length + 1;
                    if (!placement[colA]) {
                        placement[colA] = 1;
                    }
                }
                else if (!PLACEMENT[colA]) {
                    if (!PLACEMENT[rowB]) {
                        PLACEMENT[rowB] = PLACEMENT[rowA] + ROW_SPAN;
                    }
                    const available: [number, number][][] = [];
                    for (let i = PLACEMENT[rowA] - 1; i < PLACEMENT[rowB] - 1; i++) {
                        if (rowData[i] === undefined) {
                            available.push([[0, -1]] as [number, number][]);
                        }
                        else if (rowData[i].map(column => column).length + COLUMN_SPAN <= COLUMN_COUNT) {
                            const range: [number, number][] = [];
                            let span = 0;
                            for (let j = 0, k = -1; j < COLUMN_COUNT; j++) {
                                if (rowData[i][j] === undefined) {
                                    if (k === -1) {
                                        k = j;
                                    }
                                    span++;
                                }
                                if (rowData[i][j] || j === COLUMN_COUNT - 1) {
                                    if (span >= COLUMN_SPAN) {
                                        range.push([k, k + span]);
                                    }
                                    k = -1;
                                    span = 0;
                                }
                            }
                            if (range.length) {
                                available.push(range);
                            }
                            else {
                                break;
                            }
                        }
                        else {
                            break;
                        }
                    }
                    if (COLUMN_SPAN === available.length) {
                        if (available.length > 1) {
                            gapNested: {
                                for (const outside of available[0]) {
                                    for (let i = outside[0]; i < outside[1]; i++) {
                                        for (let j = 1; j < available.length; j++) {
                                            for (let k = 0; k < available[j].length; k++) {
                                                const inside = available[j][k];
                                                if (i >= inside[0] && (inside[1] === -1 || i + COLUMN_SPAN <= inside[1])) {
                                                    PLACEMENT[colA] = i + 1;
                                                    break gapNested;
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        }
                        else {
                            PLACEMENT[colA] = available[0][0][0] + 1;
                        }
                    }
                }
                if (PLACEMENT[rowA] && PLACEMENT[colA]) {
                    placement[rowA] = PLACEMENT[rowA];
                    placement[colA] = PLACEMENT[colA];
                }
                else if (PLACEMENT[rowA]) {
                    rowInvalid[PLACEMENT[rowA] - 1] = true;
                }
            }
            if (!placement[rowB]) {
                placement[rowB] = placement[rowA] + ROW_SPAN;
            }
            if (!placement[colB]) {
                placement[colB] = placement[colA] + COLUMN_SPAN;
            }
            if (setDataRows(item, placement)) {
                item.data(EXT_NAME.CSS_GRID, 'cellData', <CssGridCellData> {
                    rowStart: placement[0] - 1,
                    rowSpan: placement[2] - placement[0],
                    columnStart: placement[1] - 1,
                    columnSpan: placement[3] - placement[1]
                });
                if (dense) {
                    rowInvalid = {};
                }
            }
        });
        if (horizontal) {
            mainData.rowData = rowData;
        }
        else {
            for (let i = 0; i < rowData.length; i++) {
                for (let j = 0; j < rowData[i].length; j++) {
                    if (mainData.rowData[j] === undefined) {
                        mainData.rowData[j] = [];
                    }
                    mainData.rowData[j][i] = rowData[i][j];
                }
            }
        }
        if (mainData.rowData.length) {
            for (const row of mainData.rowData) {
                mainData.column.count = Math.max(row.length, mainData.column.count);
                for (const column of row) {
                    if (column) {
                        column.forEach(item => mainData.children.add(item));
                    }
                }
            }
            if (mainData.children.size === node.length) {
                mainData.row.count = mainData.rowData.length;
                const modified = new Set<T>();
                for (let i = 0; i < mainData.row.count; i++) {
                    for (let j = 0; j < mainData.column.count; j++) {
                        const column = mainData.rowData[i][j];
                        if (column) {
                            column.forEach(item => {
                                if (item && !modified.has(item)) {
                                    const cellData = <CssGridCellData> item.data(EXT_NAME.CSS_GRID, 'cellData');
                                    const x = j + (cellData ? cellData.columnSpan - 1 : 0);
                                    const y = i + (cellData ? cellData.rowSpan - 1 : 0);
                                    if (x < mainData.column.count - 1) {
                                        item.modifyBox(BOX_STANDARD.MARGIN_RIGHT, mainData.column.gap);
                                    }
                                    if (y < mainData.row.count - 1) {
                                        item.modifyBox(BOX_STANDARD.MARGIN_BOTTOM, mainData.row.gap);
                                    }
                                    modified.add(item);
                                }
                            });
                        }
                    }
                }
                node.retain(Array.from(mainData.children).sort((a, b) => a.toInt('zIndex') >= b.toInt('zIndex') ? 1 : -1));
                node.data(EXT_NAME.CSS_GRID, 'mainData', mainData);
            }
        }
        return { output: '' };
    }
}