import { EXT_NAME } from '../lib/constant';
import { BOX_STANDARD } from '../lib/enumeration';

import Extension from '../base/extension';
import Node from '../base/node';

import { getElementAsNode } from '../lib/dom';
import { flatMap, sortAsc, withinFraction } from '../lib/util';

export default abstract class Grid<T extends Node> extends Extension<T> {
    public static createDataAttribute(): GridData {
        return {
            paddingTop: 0,
            paddingRight: 0,
            paddingBottom: 0,
            paddingLeft: 0,
            columnCount: 0
        };
    }

    public static createDataCellAttribute<T extends Node>(): GridCellData<T> {
        return {
            inherit: true,
            rowSpan: 0,
            columnSpan: 0,
            index: -1,
            cellStart: false,
            cellEnd: false,
            rowEnd: false,
            rowStart: false,
            siblings: []
        };
    }

    public readonly options = {
        columnBalanceEqual: false
    };

    public condition(node: T) {
        return (
            this.included(<HTMLElement> node.element) ||
            node.length > 1 && !node.flexElement && !node.gridElement && (
                node.every(item => item.pageFlow && !item.visibleStyle.background && (!item.inlineFlow || item.blockStatic)) && (
                    node.css('listStyle') === 'none' ||
                    node.every(item => item.display === 'list-item' && item.css('listStyleType') === 'none') ||
                    node.some(item => item.length > 1) && !node.some(item => item.textElement || item.display === 'list-item')
                ) ||
                node.display === 'table' && node.every(item => item.display === 'table-row' && item.every(child => child.display === 'table-cell'))
            )
        );
    }

    public processNode(node: T, parent: T, mapX: LayoutMapX<T>): ExtensionResult<T> {
        const mainData = Grid.createDataAttribute();
        const columnEnd: number[] = [];
        const columnBalance = this.options.columnBalanceEqual;
        let columns: T[][] = [];
        if (columnBalance) {
            const dimensions: number[][] = [];
            node.each((item, index) => {
                dimensions[index] = [];
                item.each(child => dimensions[index].push(child.bounds.width));
                columns.push(item.duplicate() as T[]);
            });
            const base = columns[
                dimensions.findIndex(item => {
                    const column = dimensions.reduce((a, b) => {
                        if (a.length === b.length) {
                            const sumA = a.reduce((c, d) => c + d, 0);
                            const sumB = b.reduce((c, d) => c + d, 0);
                            return sumA < sumB ? a : b;
                        }
                        else {
                            return a.length < b.length ? a : b;
                        }
                    });
                    return item === column;
                })
            ];
            if (base && base.length > 1) {
                let maxIndex = -1;
                let assigned: number[] = [];
                let every = false;
                for (let l = 0; l < base.length; l++) {
                    const bounds = base[l].bounds;
                    const found: number[] = [];
                    if (l < base.length - 1) {
                        for (let m = 0; m < columns.length; m++) {
                            if (columns[m] === base) {
                                found.push(l);
                            }
                            else {
                                const result = columns[m].findIndex((item, index) => index >= l && Math.floor(item.bounds.width) === Math.floor(bounds.width) && index < columns[m].length - 1);
                                if (result !== -1) {
                                    found.push(result);
                                }
                                else {
                                    found.length = 0;
                                    break;
                                }
                            }
                        }
                    }
                    else {
                        for (let m = 0; m < columns.length; m++) {
                            if (columns[m].length > base.length) {
                                const removed = columns[m].splice(assigned[m] + (every ? 2 : 1), columns[m].length - base.length);
                                columns[m][assigned[m] + (every ? 1 : 0)].data(EXT_NAME.GRID, 'cellData', { siblings: [...removed] });
                            }
                        }
                    }
                    if (found.length === columns.length) {
                        const minIndex = found.reduce((a, b) => Math.min(a, b));
                        maxIndex = found.reduce((a, b) => Math.max(a, b));
                        if (maxIndex > minIndex) {
                            for (let m = 0; m < columns.length; m++) {
                                if (found[m] > minIndex) {
                                    const removed = columns[m].splice(minIndex, found[m] - minIndex);
                                    columns[m][assigned[m] + (every ? 1 : 0)].data(EXT_NAME.GRID, 'cellData', { siblings: [...removed] });
                                }
                            }
                        }
                        assigned = found;
                        every = true;
                    }
                    else {
                        assigned = new Array(columns.length).fill(l);
                        every = false;
                    }
                }
            }
            else {
                columns.length = 0;
            }
        }
        else {
            function getRowIndex(current: T) {
                return (
                    columns[0].findIndex(item => withinFraction(item.linear.top, current.linear.top) ||
                    current.linear.top >= item.linear.top && current.linear.bottom <= item.linear.bottom)
                );
            }
            const nextMapX: ObjectIndex<T[]> = mapX[node.depth + 2];
            const nextCoordsX = nextMapX ? Object.keys(nextMapX) : [];
            if (nextCoordsX.length > 1) {
                const columnRight: number[] = [];
                for (let l = 0; l < nextCoordsX.length; l++) {
                    const nextAxisX = sortAsc(nextMapX[parseInt(nextCoordsX[l])].filter(item => item.documentParent.documentParent.id === node.id), 'linear.top');
                    if (l === 0 && nextAxisX.length === 0) {
                        return { output: '' };
                    }
                    columnRight[l] = l === 0 ? 0 : columnRight[l - 1];
                    for (let m = 0; m < nextAxisX.length; m++) {
                        const nextX = nextAxisX[m];
                        let [left, right] = [nextX.linear.left, nextX.linear.right];
                        let index = l;
                        if (nextX.float === 'right' && nextX.cssTry('float', 'none')) {
                            const bounds = nextX.element.getBoundingClientRect();
                            if (bounds.left - nextX.marginLeft !== left) {
                                [left, right] = [bounds.left - nextX.marginLeft, bounds.right + nextX.marginRight];
                                for (let n = 1; n < columnRight.length; n++) {
                                    index = n;
                                    if (left > columnRight[n - 1]) {
                                        break;
                                    }
                                }
                            }
                            nextX.cssFinally('float');
                        }
                        if (index === 0 || left >= columnRight[index - 1]) {
                            if (columns[index] === undefined) {
                                columns[index] = [];
                            }
                            if (index === 0 || columns[0].length === nextAxisX.length) {
                                columns[index][m] = nextX;
                            }
                            else {
                                const row = getRowIndex(nextX);
                                if (row !== -1) {
                                    columns[index][row] = nextX;
                                }
                            }
                        }
                        else {
                            const current = columns.length - 1;
                            if (columns[current]) {
                                const minLeft = columns[current].reduce((a, b) => Math.min(a, b.linear.left), Number.MAX_VALUE);
                                const maxRight = columns[current].reduce((a, b) => Math.max(a, b.linear.right), Number.MAX_VALUE * -1);
                                if (left > minLeft && right > maxRight) {
                                    const filtered = columns.filter(item => item);
                                    const rowIndex = getRowIndex(nextX);
                                    if (rowIndex !== -1 && filtered[filtered.length - 1][rowIndex] === undefined) {
                                        columns[current].length = 0;
                                    }
                                }
                            }
                        }
                        columnRight[l] = Math.max(nextX.linear.right, columnRight[l]);
                    }
                }
                for (let l = 0, m = -1; l < columnRight.length; l++) {
                    if (columns[l] === undefined) {
                        if (m === -1) {
                            m = l - 1;
                        }
                        else if (l === columnRight.length - 1) {
                            columnRight[m] = columnRight[l];
                        }
                    }
                    else if (m !== -1) {
                        columnRight[m] = columnRight[l - 1];
                        m = -1;
                    }
                }
                columns = columns.filter((item, index) => {
                    if (item && item.length > 0) {
                        columnEnd.push(columnRight[index]);
                        return true;
                    }
                    return false;
                });
                const columnMax = columns.reduce((a, b) => Math.max(a, b.length), 0);
                for (let l = 0; l < columnMax; l++) {
                    for (let m = 0; m < columns.length; m++) {
                        if (columns[m][l] === undefined) {
                            columns[m][l] = { spacer: 1 } as any;
                        }
                    }
                }
            }
            columnEnd.push(node.box.right);
        }
        if (columns.length > 1 && columns[0].length === node.length) {
            mainData.columnCount = columnBalance ? columns[0].length : columns.length;
            node.duplicate().forEach(item => node.remove(item) && item.hide());
            for (let l = 0, count = 0; l < columns.length; l++) {
                let spacer = 0;
                for (let m = 0, start = 0; m < columns[l].length; m++) {
                    const item = columns[l][m];
                    if (!(<any> item).spacer) {
                        item.parent = node;
                        const data: GridCellData<T> = Object.assign(Grid.createDataCellAttribute(), item.data(EXT_NAME.GRID, 'cellData') || {});
                        if (columnBalance) {
                            data.rowStart = m === 0;
                            data.rowEnd = m === columns[l].length - 1;
                            data.cellStart = l === 0 && m === 0;
                            data.cellEnd = l === columns.length - 1 && data.rowEnd;
                            data.index = m;
                        }
                        else {
                            let rowSpan = 1;
                            let columnSpan = 1 + spacer;
                            for (let n = l + 1; n < columns.length; n++) {
                                if ((columns[n][m] as any).spacer === 1) {
                                    columnSpan++;
                                    (columns[n][m] as any).spacer = 2;
                                }
                                else {
                                    break;
                                }
                            }
                            if (columnSpan === 1) {
                                for (let n = m + 1; n < columns[l].length; n++) {
                                    if ((columns[l][n] as any).spacer === 1) {
                                        rowSpan++;
                                        (columns[l][n] as any).spacer = 2;
                                    }
                                    else {
                                        break;
                                    }
                                }
                            }
                            const index = Math.min(l + (columnSpan - 1), columnEnd.length - 1);
                            data.siblings.push(
                                ...flatMap(Array.from(item.documentParent.element.children), element => {
                                    const sibling = getElementAsNode<T>(element);
                                    return (
                                        sibling &&
                                        sibling.visible &&
                                        !sibling.rendered &&
                                        sibling.linear.left >= item.linear.right &&
                                        sibling.linear.right <= columnEnd[index] ? sibling : null
                                    );
                                }) as T[]
                            );
                            data.rowSpan = rowSpan;
                            data.columnSpan = columnSpan;
                            data.rowStart = start++ === 0;
                            data.rowEnd = columnSpan + l === columns.length;
                            data.cellStart = count++ === 0;
                            data.cellEnd = data.rowEnd && m === columns[l].length - 1;
                            data.index = l;
                            spacer = 0;
                        }
                        item.data(EXT_NAME.GRID, 'cellData', data);
                    }
                    else if ((<any> item).spacer === 1) {
                        spacer++;
                    }
                }
            }
            sortAsc(node.children, 'documentParent.siblingIndex', 'siblingIndex');
            if (node.tableElement && node.css('borderCollapse') === 'collapse') {
                node.modifyBox(BOX_STANDARD.PADDING_TOP, null);
                node.modifyBox(BOX_STANDARD.PADDING_RIGHT, null);
                node.modifyBox(BOX_STANDARD.PADDING_BOTTOM, null);
                node.modifyBox(BOX_STANDARD.PADDING_LEFT, null);
            }
            node.data(EXT_NAME.GRID, 'mainData', mainData);
        }
        return { output: '' };
    }
}