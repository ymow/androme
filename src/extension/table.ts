import { EXT_NAME } from '../lib/constant';
import { BOX_STANDARD, CSS_STANDARD, NODE_ALIGNMENT, NODE_CONTAINER, USER_AGENT } from '../lib/enumeration';

import Extension from '../base/extension';
import Layout from '../base/layout';
import Node from '../base/node';

import { cssInherit, getStyle, isUserAgent } from '../lib/dom';
import { convertFloat, convertInt, formatPercent, formatPX, isPercent, isUnit, maxArray } from '../lib/util';

const enum LAYOUT_TABLE {
    NONE = 0,
    STRETCH = 1,
    FIXED = 2,
    VARIABLE = 3
}

export default abstract class Table<T extends Node> extends Extension<T> {
    public processNode(node: T, parent: T): ExtensionResult<T> {
        function setAutoWidth(td: T) {
            td.data(EXT_NAME.TABLE, 'percent', `${Math.round((td.bounds.width / node.bounds.width) * 100)}%`);
            td.data(EXT_NAME.TABLE, 'expand', true);
        }
        function setBoundsWidth(td: T) {
            td.css('width', formatPX(td.bounds.width));
            td.unsetCache('width', 'hasWidth');
        }
        const table: T[] = [];
        const thead = node.filter(item => item.tagName === 'THEAD');
        const tbody = node.filter(item => item.tagName === 'TBODY');
        const tfoot = node.filter(item => item.tagName === 'TFOOT');
        const colgroup = Array.from(node.element.children).find(element => element.tagName === 'COLGROUP');
        if (thead.length) {
            thead[0].cascade().filter(item => item.tagName === 'TH' || item.tagName === 'TD').forEach(item => item.inherit(thead[0], 'styleMap'));
            table.push(...thead[0].children as T[]);
            thead.forEach(item => item.hide());
        }
        if (tbody.length) {
            tbody.forEach(item => {
                table.push(...item.children as T[]);
                item.hide();
            });
        }
        if (tfoot.length) {
            tfoot[0].cascade().filter(item => item.tagName === 'TH' || item.tagName === 'TD').forEach(item => item.inherit(tfoot[0], 'styleMap'));
            table.push(...tfoot[0].children as T[]);
            tfoot.forEach(item => item.hide());
        }
        const layoutFixed = node.css('tableLayout') === 'fixed';
        const borderCollapse = node.css('borderCollapse') === 'collapse';
        const [horizontal, vertical] = borderCollapse ? [0, 0] : node.css('borderSpacing').split(' ').map(value => parseInt(value));
        if (horizontal > 0) {
            node.modifyBox(BOX_STANDARD.PADDING_LEFT, horizontal);
            node.modifyBox(BOX_STANDARD.PADDING_RIGHT, horizontal);
        }
        else {
            node.modifyBox(BOX_STANDARD.PADDING_LEFT, null);
            node.modifyBox(BOX_STANDARD.PADDING_RIGHT, null);
        }
        if (vertical > 0) {
            node.modifyBox(BOX_STANDARD.PADDING_TOP, vertical);
            node.modifyBox(BOX_STANDARD.PADDING_BOTTOM, vertical);
        }
        else {
            node.modifyBox(BOX_STANDARD.PADDING_TOP, null);
            node.modifyBox(BOX_STANDARD.PADDING_BOTTOM, null);
        }
        const spacingWidth = formatPX(horizontal > 1 ? Math.round(horizontal / 2) : horizontal);
        const spacingHeight = formatPX(vertical > 1 ? Math.round(vertical / 2) : vertical);
        const rowWidth: number[] = [];
        const mapBounds: number[] = [];
        const tableFilled: T[][] = [];
        let columnIndex = new Array(table.length).fill(0);
        let mapWidth: string[] = [];
        let multiLine = 0;
        for (let i = 0; i < table.length; i++) {
            const tr = table[i];
            rowWidth[i] = horizontal;
            tableFilled[i] = [];
            for (let j = 0; j < tr.length; j++) {
                const td = tr.item(j) as T;
                const element = <HTMLTableCellElement> td.element;
                for (let k = 0; k < element.rowSpan - 1; k++)  {
                    const l = (i + 1) + k;
                    if (columnIndex[l] !== undefined) {
                        columnIndex[l] += element.colSpan;
                    }
                }
                if (!td.visibleStyle.backgroundImage && !td.visibleStyle.backgroundColor) {
                    if (colgroup) {
                        const style = getStyle(colgroup.children[columnIndex[i]]);
                        if (style.background) {
                            element.style.background = style.background;
                        }
                        else if (style.backgroundColor) {
                            element.style.backgroundColor = style.backgroundColor;
                        }
                    }
                    else {
                        let value = cssInherit(element, 'background', ['rgba(0, 0, 0, 0)', 'transparent'], ['TABLE']);
                        if (value !== '') {
                            element.style.background = value;
                        }
                        else {
                            value = cssInherit(element, 'backgroundColor', ['rgba(0, 0, 0, 0)', 'transparent'], ['TABLE']);
                            if (value !== '') {
                                element.style.backgroundColor = value;
                            }
                        }
                    }
                }
                switch (td.tagName) {
                    case 'TH':
                        if (!td.cssInitial('textAlign')) {
                            td.css('textAlign', 'center');
                        }
                    case 'TD':
                        if (!td.cssInitial('verticalAlign')) {
                            td.css('verticalAlign', 'middle');
                        }
                        break;
                }
                const columnWidth = td.cssInitial('width');
                const m = columnIndex[i];
                const reevaluate = mapWidth[m] === undefined || mapWidth[m] === 'auto';
                if (i === 0 || reevaluate || !layoutFixed) {
                    if (columnWidth === '' || columnWidth === 'auto') {
                        if (mapWidth[m] === undefined) {
                            mapWidth[m] = columnWidth || '0px';
                            mapBounds[m] = 0;
                        }
                        else if (i === table.length - 1) {
                            if (reevaluate && mapBounds[m] === 0) {
                                mapBounds[m] = td.bounds.width;
                            }
                        }
                    }
                    else {
                        const percent = isPercent(columnWidth);
                        const unit = isUnit(mapWidth[m]);
                        if (reevaluate || td.bounds.width < mapBounds[m] || td.bounds.width === mapBounds[m] && (
                                (percent || unit) ||
                                percent && unit ||
                                percent && isPercent(mapWidth[m]) && convertFloat(columnWidth) > convertFloat(mapWidth[m]) ||
                                unit && isUnit(columnWidth) && convertInt(columnWidth) > convertInt(mapWidth[m])
                           ))
                        {
                            mapWidth[m] = columnWidth;
                        }
                        if (reevaluate || element.colSpan === 1) {
                            mapBounds[m] = td.bounds.width;
                        }
                    }
                }
                if (multiLine === 0) {
                    multiLine = td.multiLine;
                }
                if (td.length || td.inlineText) {
                    rowWidth[i] += td.bounds.width + horizontal;
                }
                columnIndex[i] += element.colSpan;
                td.css({
                    marginTop: i === 0 ? '0px' : spacingHeight,
                    marginRight: j < tr.length - 1 ? spacingWidth : '0px',
                    marginBottom: i + element.rowSpan - 1 >= table.length - 1 ? '0px' : spacingHeight,
                    marginLeft: columnIndex[i] === 0 ? '0px' : spacingWidth
                }, '', true);
            }
        }
        if (node.has('width', CSS_STANDARD.UNIT) && mapWidth.some(value => isPercent(value))) {
            mapWidth = mapWidth.map((value, index) => {
                if (value === 'auto' && mapBounds[index] > 0) {
                    value = formatPX(mapBounds[index]);
                }
                return value;
            });
        }
        if (mapWidth.every(value => isPercent(value)) && mapWidth.reduce((a, b) => a + parseFloat(b), 0) > 1) {
            let percentTotal = 100;
            mapWidth = mapWidth.map(value => {
                const percent = parseFloat(value);
                if (percentTotal <= 0) {
                    value = '0px';
                }
                else if (percentTotal - percent < 0) {
                    value = formatPercent(percentTotal);
                }
                percentTotal -= percent;
                return value;
            });
        }
        else if (mapWidth.every(value => isUnit(value))) {
            const width = mapWidth.reduce((a, b) => a + parseInt(b), 0);
            if (node.has('width', CSS_STANDARD.PERCENT) || width < node.width) {
                mapWidth = mapWidth.map(value => value !== '0px' ? `${(parseInt(value) / width) * 100}%` : value);
            }
            else if (width > node.width) {
                node.css('width', 'auto');
                node.unsetCache('width', 'hasWidth');
                if (!layoutFixed) {
                    node.cascade().forEach(item => {
                        item.css('width', 'auto');
                        node.unsetCache('width', 'hasWidth');
                    });
                }
            }
        }
        const mapPercent = mapWidth.reduce((a, b) => a + (isPercent(b) ? parseFloat(b) : 0), 0);
        const typeWidth = (() => {
            if (mapWidth.some(value => isPercent(value)) || mapWidth.every(value => isUnit(value) && value !== '0px')) {
                return LAYOUT_TABLE.VARIABLE;
            }
            if (mapWidth.every(value => value === mapWidth[0])) {
                if (multiLine) {
                    return node.some(td => td.has('height')) ? LAYOUT_TABLE.FIXED : LAYOUT_TABLE.VARIABLE;
                }
                if (mapWidth[0] === 'auto') {
                    return node.has('width') ? LAYOUT_TABLE.VARIABLE : LAYOUT_TABLE.NONE;
                }
                if (node.hasWidth) {
                    return LAYOUT_TABLE.FIXED;
                }
            }
            if (mapWidth.every(value => value === 'auto' || (isUnit(value) && value !== '0px'))) {
                return LAYOUT_TABLE.STRETCH;
            }
            return LAYOUT_TABLE.NONE;
        })();
        if (multiLine || (typeWidth === 2 && !node.hasWidth)) {
            node.data(EXT_NAME.TABLE, 'expand', true);
        }
        const columnCount = maxArray(columnIndex);
        let rowCount = table.length;
        const caption = node.find(item => item.tagName === 'CAPTION') as T | undefined;
        node.clear();
        if (caption) {
            if (!caption.hasWidth && !isUserAgent(USER_AGENT.EDGE)) {
                if (caption.textElement) {
                    if (!caption.has('maxWidth')) {
                        caption.css('maxWidth', formatPX(caption.bounds.width));
                    }
                }
                else if (caption.bounds.width > maxArray(rowWidth)) {
                    setBoundsWidth(caption);
                }
            }
            if (!caption.cssInitial('textAlign')) {
                caption.css('textAlign', 'center');
            }
            rowCount++;
            caption.data(EXT_NAME.TABLE, 'colSpan', columnCount);
            caption.parent = node;
        }
        columnIndex = new Array(table.length).fill(0);
        const hasWidth = node.hasWidth;
        for (let i = 0; i < table.length; i++) {
            const tr = table[i];
            const children = tr.duplicate();
            for (let j = 0; j < children.length; j++) {
                const td = children[j] as T;
                const element = <HTMLTableCellElement> td.element;
                const rowSpan = element.rowSpan;
                const colSpan = element.colSpan;
                for (let k = 0; k < rowSpan - 1; k++)  {
                    const l = (i + 1) + k;
                    if (columnIndex[l] !== undefined) {
                        columnIndex[l] += colSpan;
                    }
                }
                if (rowSpan > 1) {
                    td.data(EXT_NAME.TABLE, 'rowSpan', rowSpan);
                }
                if (colSpan > 1) {
                    td.data(EXT_NAME.TABLE, 'colSpan', colSpan);
                }
                if (!td.has('verticalAlign')) {
                    td.css('verticalAlign', 'middle');
                }
                const columnWidth = mapWidth[columnIndex[i]];
                if (columnWidth !== 'undefined') {
                    switch (typeWidth) {
                        case LAYOUT_TABLE.VARIABLE:
                            if (columnWidth === 'auto') {
                                if (mapPercent >= 1) {
                                    setBoundsWidth(td);
                                    td.data(EXT_NAME.TABLE, 'exceed', !hasWidth);
                                    td.data(EXT_NAME.TABLE, 'downsized', true);
                                }
                                else {
                                    setAutoWidth(td);
                                }
                            }
                            else if (isPercent(columnWidth)) {
                                td.data(EXT_NAME.TABLE, 'percent', columnWidth);
                                td.data(EXT_NAME.TABLE, 'expand', true);
                            }
                            else if (isUnit(columnWidth) && parseInt(columnWidth) > 0) {
                                if (td.bounds.width >= parseInt(columnWidth)) {
                                    setBoundsWidth(td);
                                    td.data(EXT_NAME.TABLE, 'expand', false);
                                    td.data(EXT_NAME.TABLE, 'downsized', false);
                                }
                                else {
                                    if (layoutFixed) {
                                        setAutoWidth(td);
                                        td.data(EXT_NAME.TABLE, 'downsized', true);
                                    }
                                    else {
                                        setBoundsWidth(td);
                                        td.data(EXT_NAME.TABLE, 'expand', false);
                                    }
                                }
                            }
                            else {
                                if (!td.has('width') || td.has('width', CSS_STANDARD.PERCENT)) {
                                    setBoundsWidth(td);
                                }
                                td.data(EXT_NAME.TABLE, 'expand', false);
                            }
                            break;
                        case LAYOUT_TABLE.FIXED:
                            td.css('width', '0px');
                            break;
                        case LAYOUT_TABLE.STRETCH:
                            if (columnWidth === 'auto') {
                                td.css('width', '0px');
                            }
                            else {
                                if (layoutFixed) {
                                    td.data(EXT_NAME.TABLE, 'downsized', true);
                                }
                                else {
                                    setBoundsWidth(td);
                                }
                                td.data(EXT_NAME.TABLE, 'expand', false);
                            }
                            break;

                    }
                }
                columnIndex[i] += colSpan;
                for (let k = 0; k < rowSpan; k++) {
                    for (let l = 0; l < colSpan; l++) {
                        tableFilled[i + k].push(td);
                    }
                }
                td.parent = node;
            }
            if (columnIndex[i] < columnCount) {
                const td = children[children.length - 1];
                td.data(EXT_NAME.TABLE, 'spaceSpan', columnCount - columnIndex[i]);
            }
            tr.hide();
        }
        if (borderCollapse) {
            const borderTopColor = node.css('borderTopColor');
            const borderTopStyle = node.css('borderTopStyle');
            const borderTopWidth = node.css('borderTopWidth');
            const borderRightColor = node.css('borderRightColor');
            const borderRightStyle = node.css('borderRightStyle');
            const borderRightWidth = node.css('borderRightWidth');
            const borderBottomColor = node.css('borderBottomColor');
            const borderBottomStyle = node.css('borderBottomStyle');
            const borderBottomWidth = node.css('borderBottomWidth');
            const borderLeftColor = node.css('borderLeftColor');
            const borderLeftStyle = node.css('borderLeftStyle');
            const borderLeftWidth = node.css('borderLeftWidth');
            for (let i = 0; i < rowCount; i++) {
                for (let j = 0; j < columnCount; j++) {
                    const td = tableFilled[i][j];
                    if (td && td.css('visibility') === 'visible') {
                        if (i === 0) {
                            if (td.borderTopWidth < parseInt(borderTopWidth)) {
                                td.css({
                                    borderTopColor,
                                    borderTopStyle,
                                    borderTopWidth
                                });
                            }
                        }
                        if (i >= 0 && i < rowCount - 1) {
                            const next = tableFilled[i + 1][j];
                            if (next && next !== td && next.css('visibility') === 'visible') {
                                if (td.borderBottomWidth >= next.borderTopWidth) {
                                    next.css('borderTopWidth', '0px');
                                }
                                else {
                                    td.css('borderBottomWidth', '0px');
                                }
                            }
                        }
                        if (i === rowCount - 1) {
                            if (td.borderBottomWidth < parseInt(borderBottomWidth)) {
                                td.css({
                                    borderBottomColor,
                                    borderBottomStyle,
                                    borderBottomWidth
                                });
                            }
                        }
                        if (j === 0) {
                            if (td.borderLeftWidth < parseInt(borderLeftWidth)) {
                                td.css({
                                    borderLeftColor,
                                    borderLeftStyle,
                                    borderLeftWidth
                                });
                            }
                        }
                        if (j >= 0 && j < columnCount - 1) {
                            const next = tableFilled[i][j + 1];
                            if (next && next !== td && next.css('visibility') === 'visible') {
                                if (td.borderRightWidth >= next.borderLeftWidth) {
                                    next.css('borderLeftWidth', '0px');
                                }
                                else {
                                    td.css('borderRightWidth', '0px');
                                }
                            }
                        }
                        if (j === columnCount - 1) {
                            if (td.borderRightWidth < parseInt(borderRightWidth)) {
                                td.css({
                                    borderRightColor,
                                    borderRightStyle,
                                    borderRightWidth
                                });
                            }
                        }
                    }
                }
            }
            node.css({
                borderTopWidth: '0px',
                borderRightWidth: '0px',
                borderBottomWidth: '0px',
                borderLeftWidth: '0px'
            });
        }
        const layout = new Layout(
            parent,
            node,
            NODE_CONTAINER.GRID,
            NODE_ALIGNMENT.AUTO_LAYOUT,
            node.length,
            node.children as T[]
        );
        layout.rowCount = rowCount;
        layout.columnCount = columnCount;
        const output = this.application.renderNode(layout);
        return { output, complete: true };
    }
}