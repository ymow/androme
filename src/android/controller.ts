import { SettingsAndroid } from './types/module';

import { AXIS_ANDROID, BOX_ANDROID, NODE_ANDROID, WEBVIEW_ANDROID, XMLNS_ANDROID } from './lib/constant';

import BASE_TMPL from './template/base';

import Resource from './resource';
import View from './view';
import ViewGroup from './viewgroup';

import { createAttribute, getXmlNs, replaceTab, replaceUnit } from './lib/util';

import $Node = androme.lib.base.Node;
import $NodeList = androme.lib.base.NodeList;

import $color = androme.lib.color;
import $dom = androme.lib.dom;
import $enum = androme.lib.enumeration;
import $util = androme.lib.util;
import $xml = androme.lib.xml;

function adjustBaseline<T extends View>(nodes: T[]) {
    if (nodes.length > 1) {
        const textBaseline = $NodeList.textBaseline(nodes.filter(item => item.baseline && item.toInt('top') === 0 && item.toInt('bottom') === 0));
        if (textBaseline.length > 0) {
            const alignWith = textBaseline[0];
            const images: T[] = [];
            let exclude: T | undefined;
            for (const node of nodes) {
                if (node !== alignWith) {
                    if (node.baseline && (node.nodeType <= $enum.NODE_STANDARD.INLINE || (node.linearHorizontal && node.renderChildren.some(item => item.baseline && item.nodeType <= $enum.NODE_STANDARD.INLINE)))) {
                        if (!alignWith.imageElement && node.imageElement) {
                            images.push(node);
                        }
                        else if (node.alignOrigin) {
                            node.anchor(node.imageElement || node.is($enum.NODE_STANDARD.BUTTON) ? 'bottom' : 'baseline', alignWith.stringId);
                        }
                        else if (alignWith.position === 'relative' && node.bounds.height < alignWith.bounds.height && node.lineHeight === 0) {
                            node.anchor(alignWith.top ? 'top' : 'bottom', alignWith.stringId);
                        }
                    }
                    if (alignWith.imageElement && (!exclude || node.bounds.height > exclude.bounds.height)) {
                        exclude = node;
                    }
                }
            }
            if (images.length > 0) {
                images.sort((a, b) => a.bounds.height <= b.bounds.height ? 1 : -1);
                for (let i = 0; i < images.length; i++) {
                    if (i === 0) {
                        alignWith.anchor('bottom', images[i].stringId);
                    }
                    else {
                        images[i].anchor('bottom', images[0].stringId);
                    }
                }
                exclude = undefined;
            }
            if (exclude) {
                if (!exclude.imageElement) {
                    exclude.anchorDelete('baseline');
                }
                else if (exclude.bounds.height > alignWith.bounds.height) {
                    exclude.anchorDelete('bottom');
                }
                else {
                    exclude = undefined;
                }
                if (exclude) {
                    alignWith.anchor('bottom', exclude.stringId);
                }
            }
        }
    }
}

function checkSingleLine<T extends View>(node: T, nowrap = false, flexParent = false) {
    if (node && node.textElement && (nowrap || flexParent || (!node.hasWidth && !node.multiLine && node.textContent.trim().split(String.fromCharCode(32)).length > 1))) {
        node.android('singleLine', 'true');
    }
}

function constraintMinMax<T extends View>(node: T, dimension: string) {
    const minWH = node.cssInitial(`min${dimension}`);
    const maxWH = node.cssInitial(`max${dimension}`);
    if ($util.isUnit(minWH)) {
        node.app(`layout_constraint${dimension}_min`, minWH);
        node.constraint.minWidth = true;
    }
    if ($util.isUnit(maxWH)) {
        node.app(`layout_constraint${dimension}_max`, maxWH);
        node.constraint.minHeight = true;
    }
}

function constraintPercentValue<T extends View>(node: T, dimension: string, value: string) {
    if ($util.isPercent(value)) {
        node.app(`layout_constraint${dimension}_percent`, (parseInt(value) / 100).toFixed(2));
        node.android(`layout_${dimension.toLowerCase()}`, '0px');
    }
}

function constraintPercentWidth<T extends View>(node: T) {
    const value = node.has('width') ? node.css('width') : '';
    constraintPercentValue(node, 'Width', value);
}

function constraintPercentHeight<T extends View>(node: T) {
    if (node.documentParent.hasHeight) {
        const value = node.has('height') ? node.css('height') : '';
        constraintPercentValue(node, 'Height', value);
    }
}

export default class Controller<T extends View> extends androme.lib.base.Controller<T> implements android.lib.base.Controller<T> {
    public static anchorEvaluate<T extends View>(nodes: T[]) {
        const horizontal = nodes.filter(item => item.constraint.horizontal);
        const vertical = nodes.filter(item => item.constraint.vertical);
        let i = -1;
        while (++i < nodes.length) {
            const node = nodes[i];
            if (!node.constraint.horizontal) {
                for (const attr in node.constraint.current) {
                    const position = node.constraint.current[attr];
                    if (position.horizontal && horizontal.find(item => item.stringId === position.stringId)) {
                        node.constraint.horizontal = true;
                        horizontal.push(node);
                        i = -1;
                        break;
                    }
                }
            }
            if (!node.constraint.vertical) {
                for (const attr in node.constraint.current) {
                    const position = node.constraint.current[attr];
                    if (!position.horizontal && vertical.find(item => item.stringId === position.stringId)) {
                        node.constraint.vertical = true;
                        vertical.push(node);
                        i = -1;
                        break;
                    }
                }
            }
        }
    }

    public static dimensionConstraint<T extends View>(node: T) {
        constraintPercentWidth(node);
        constraintPercentHeight(node);
        constraintMinMax(node, 'Width');
        constraintMinMax(node, 'Height');
    }

    public static dimensionFlex<T extends View>(node: T, horizontal: boolean) {
        const dimension = horizontal ? 'width' : 'height';
        const oppositeDimension = horizontal ? 'height' : 'width';
        let basis = node.flexbox.basis;
        if (basis !== 'auto') {
            if ($util.isPercent(basis)) {
                if (basis !== '0%') {
                    node.app(`layout_constraint${horizontal ? 'Width' : 'Height'}_percent`, (parseInt(basis) / 100).toFixed(2));
                    basis = '';
                }
            }
            else if ($util.isUnit(basis)) {
                node.android(`layout_${dimension}`, node.convertPX(basis));
                basis = '';
            }
        }
        if (basis !== '') {
            const size = node.has(dimension) ? node.css(dimension) : '';
            if (node.flexbox.grow > 0) {
                node.android(`layout_${dimension}`, '0px');
                node.app(`layout_constraint${horizontal ? 'Horizontal' : 'Vertical'}_weight`, node.flexbox.grow.toString());
            }
            else if ($util.isUnit(size)) {
                node.android(`layout_${dimension}`, size);
            }
            else if (node.flexbox.shrink > 1) {
                node.android(`layout_${dimension}`, 'wrap_content');
            }
            else {
                if (horizontal) {
                    constraintPercentWidth(node);
                }
                else {
                    constraintPercentHeight(node);
                }
            }
            if (node.flexbox.shrink < 1) {
                node.app(`layout_constrained${horizontal ? 'Width' : 'Height'}`, 'true');
            }
        }
        const oppositeSize = node.has(oppositeDimension) ? node.css(oppositeDimension) : '';
        if ($util.isUnit(oppositeSize)) {
            node.android(`layout_${oppositeDimension}`, oppositeSize);
        }
        else {
            if (horizontal) {
                constraintPercentHeight(node);
            }
            else {
                constraintPercentWidth(node);
            }
        }
        constraintMinMax(node, 'Width');
        constraintMinMax(node, 'Height');
    }

    public settings: SettingsAndroid;
    public readonly localSettings: ControllerSettings = {
        baseTemplate: BASE_TMPL,
        layout: {
            pathName: 'res/layout',
            fileExtension: 'xml'
        },
        inline: {
            always: ['BR'],
            tagName: new Set(WEBVIEW_ANDROID),
        },
        unsupported: {
            tagName: new Set(['OPTION', 'MAP', 'AREA', 'svg'])
        },
        constraint: {
            alignParentBottomOffset: 3.5,
            percentAccuracy: 4
        }
    };

    public finalize(viewData: ViewData<$NodeList<T>>) {
        if (this.settings.showAttributes) {
            function getRootNamespace(content: string) {
                let output = '';
                for (const namespace in XMLNS_ANDROID) {
                    if (new RegExp(`\\s+${namespace}:`).test(content)) {
                        output += `\n\t${getXmlNs(namespace)}`;
                    }
                }
                return output;
            }
            function parseAttributes(node: T) {
                if (node.dir === 'rtl') {
                    if (node.nodeType < $enum.NODE_STANDARD.INLINE) {
                        node.android('textDirection', 'rtl');
                    }
                    else if (node.renderChildren.length > 0) {
                        node.android('layoutDirection', 'rtl');
                    }
                }
                for (const name in node.dataset) {
                    if (/^attr[A-Z]+/.test(name)) {
                        const obj = $util.capitalize(name.substring(4), false);
                        (node.dataset[name] as string).split(';').forEach(values => {
                            const [key, value] = values.split('::');
                            if ($util.hasValue(key) && $util.hasValue(value)) {
                                node.attr(obj, key, value);
                            }
                        });
                    }
                }
                const indent = $util.repeat(node.renderDepth + 1);
                return node.combine().map(value => `\n${indent + value}`).join('');
            }
            const cache: StringMap[] = viewData.cache.visible.map(node => ({ pattern: $xml.formatPlaceholder(node.id, '@'), attributes: parseAttributes(node) }));
            for (const value of [...viewData.views, ...viewData.includes]) {
                cache.forEach(item => value.content = value.content.replace(item.pattern, item.attributes));
                value.content = value.content.replace(`{#0}`, getRootNamespace(value.content));
            }
        }
        for (const value of [...viewData.views, ...viewData.includes]) {
            value.content = replaceUnit(value.content, this.settings);
            value.content = replaceTab(value.content, this.settings);
            value.content = $xml.removePlaceholderAll(value.content).replace(/\n\n/g, '\n');
        }
    }

    public setConstraints() {
        for (const node of this.cache.visible) {
            if (!node.hasBit('excludeProcedure', $enum.NODE_PROCEDURE.CONSTRAINT)) {
                const children = node.renderChildren.filter(item => !item.positioned) as T[];
                if (children.length > 0) {
                    if (node.layoutRelative) {
                        let boxWidth = node.box.width;
                        if (node.renderParent.overflowX) {
                            boxWidth = node.viewWidth || boxWidth || node.renderParent.toInt('width', 0, true);
                        }
                        else if (node.renderParent.hasAlign($enum.NODE_ALIGNMENT.FLOAT)) {
                            const minLeft: number = Math.min.apply(null, children.map(item => item.linear.left));
                            const maxRight: number = Math.max.apply(null, children.map(item => item.linear.right));
                            boxWidth = maxRight - minLeft;
                        }
                        else {
                            const floatEnd = Math.max.apply(null, node.documentParent.initial.children.filter(item => item.float === 'left' && item.siblingIndex < node.siblingIndex).map(item => item.linear.right));
                            if (children.some(item => item.linear.left === floatEnd)) {
                                boxWidth = node.box.right - floatEnd;
                            }
                        }
                        boxWidth = Math.ceil(boxWidth);
                        let rowWidth = 0;
                        let rowPaddingLeft = 0;
                        let rowPreviousLeft: T | undefined;
                        let rowPreviousBottom: T | undefined;
                        const textIndent = node.toInt('textIndent');
                        if (textIndent < 0 && Math.abs(textIndent) <= node.paddingLeft) {
                            rowPaddingLeft = Math.abs(textIndent);
                            node.modifyBox($enum.BOX_STANDARD.PADDING_LEFT, node.paddingLeft + textIndent);
                            node.modifyBox($enum.BOX_STANDARD.PADDING_LEFT, null);
                        }
                        const rows: T[][] = [];
                        const baseline: T[][] = [];
                        const rangeMultiLine = new Set<T>();
                        const cleared = $NodeList.cleared(node.initial.children);
                        const noWrap = node.css('whiteSpace') === 'nowrap';
                        const edgeOrFirefox = $dom.isUserAgent($enum.USER_AGENT.EDGE | $enum.USER_AGENT.FIREFOX);
                        for (let i = 0; i < children.length; i++) {
                            const current = children[i];
                            const previous = children[i - 1];
                            let dimension = current.bounds;
                            if (current.inlineText && !current.hasWidth) {
                                const [bounds, multiLine] = $dom.getRangeClientRect(current.element);
                                if (bounds && (multiLine || bounds.width < current.box.width)) {
                                    dimension = bounds;
                                    if (edgeOrFirefox && multiLine && !/^\s*\n+/.test(current.textContent)) {
                                        rangeMultiLine.add(current);
                                    }
                                }
                            }
                            const sideParent = current.float === 'right' ? 'right' : 'left';
                            const sideSibling = current.float === 'right' ? 'rightLeft' : 'leftRight';
                            if (i === 0) {
                                current.anchor(sideParent, 'true');
                                if (!node.inline && textIndent > 0) {
                                    current.modifyBox($enum.BOX_STANDARD.MARGIN_LEFT, textIndent);
                                }
                                if (!current.siblingflow || (current.floating && current.position === 'relative') || (current.multiLine && textIndent < 0)) {
                                    rowPreviousLeft = current;
                                }
                                baseline.push([]);
                                rows.push([current]);
                            }
                            else {
                                const rowItems = rows[rows.length - 1];
                                const siblings = $dom.getBetweenElements(previous.baseElement, current.baseElement, false, true);
                                const viewGroup = current.groupElement && !current.hasAlign($enum.NODE_ALIGNMENT.SEGMENTED);
                                const previousSibling = current.previousSibling();
                                const baseWidth = rowWidth + current.marginLeft + dimension.width - (edgeOrFirefox ? current.borderRightWidth : 0);
                                let connected = false;
                                if (i === 1 && previous.textElement && current.textElement) {
                                    connected = siblings.length === 0 && !/\s+$/.test(previous.textContent) && !/^\s+/.test(current.textContent);
                                }
                                if (!noWrap &&
                                    !connected &&
                                    !['SUP', 'SUB'].includes(current.tagName) &&
                                    (previous.float !== 'left' || current.linear.top >= previous.linear.bottom) && (
                                        (current.float !== 'right' && Math.floor(baseWidth) - (current.styleElement && current.inlineStatic ? current.paddingLeft + current.paddingRight : 0) > boxWidth) ||
                                        (current.multiLine && $dom.hasLineBreak(current.element)) ||
                                        (previous.multiLine && previous.textContent.trim() !== '' && !/^\s*\n+/.test(previous.textContent) && !/\n+\s*$/.test(previous.textContent) && $dom.hasLineBreak(previous.element)) ||
                                        (previousSibling && previousSibling.lineBreak) ||
                                        (current.preserveWhiteSpace && /^\n+/.test(current.textContent)) ||
                                        current.blockStatic ||
                                        viewGroup ||
                                        cleared.has(current) ||
                                        rangeMultiLine.has(previous) ||
                                        (siblings.length > 0 && siblings.some(element => $dom.isLineBreak(element))) ||
                                        (current.floating && (
                                            (current.float === 'left' && $util.withinFraction(current.linear.left, node.box.left)) ||
                                            (current.float === 'right' && $util.withinFraction(current.linear.right, node.box.right)) ||
                                            current.linear.top >= previous.linear.bottom
                                        ))
                                    ))
                                {
                                    rowPreviousBottom = rowItems.filter(item => !item.floating)[0] || rowItems[0];
                                    for (let j = 0; j < rowItems.length; j++) {
                                        if (rowItems[j] !== rowPreviousBottom && rowItems[j].linear.bottom > rowPreviousBottom.linear.bottom && (!rowItems[j].floating || (rowItems[j].floating && rowPreviousBottom.floating))) {
                                            rowPreviousBottom = rowItems[j];
                                        }
                                    }
                                    if (viewGroup || (previous.groupElement && i === children.length - 1)) {
                                        current.constraint.marginVertical = rowPreviousBottom.stringId;
                                    }
                                    current.anchor('topBottom', rowPreviousBottom.stringId);
                                    if (rowPreviousLeft && current.linear.top < rowPreviousLeft.bounds.bottom && !$util.withinRange(current.bounds.top, rowPreviousLeft.bounds.top, 1) && !$util.withinRange(current.bounds.bottom, rowPreviousLeft.bounds.bottom, 1)) {
                                        current.anchor(sideSibling, rowPreviousLeft.stringId);
                                    }
                                    else {
                                        current.anchor(sideParent, 'true');
                                        rowPreviousLeft = undefined;
                                    }
                                    if (this.settings.ellipsisOnTextOverflow && previous.linearHorizontal) {
                                        checkSingleLine(previous.item() as T, true);
                                    }
                                    if (rowPaddingLeft > 0) {
                                        if (this.settings.ellipsisOnTextOverflow && rows.length === 1 && rows[0].length === 1 && rows[0][0].textElement) {
                                            checkSingleLine(rows[0][0], true);
                                        }
                                        current.modifyBox($enum.BOX_STANDARD.PADDING_LEFT, rowPaddingLeft);
                                    }
                                    node.alignmentType ^= $enum.NODE_ALIGNMENT.HORIZONTAL;
                                    node.alignmentType |= $enum.NODE_ALIGNMENT.MULTILINE;
                                    rowWidth = 0;
                                    baseline.push([]);
                                    rows.push([current]);
                                }
                                else {
                                    if (i === 1 && rowPaddingLeft > 0 && !previous.plainText) {
                                        current.anchor(sideParent, 'true');
                                        current.modifyBox($enum.BOX_STANDARD.PADDING_LEFT, rowPaddingLeft);
                                    }
                                    else {
                                        current.anchor(sideSibling, previous.stringId);
                                    }
                                    if (connected || baseWidth > boxWidth) {
                                        checkSingleLine(current);
                                    }
                                    if (rowPreviousBottom) {
                                        current.anchor('topBottom', rowPreviousBottom.stringId);
                                    }
                                    rowItems.push(current);
                                }
                            }
                            rowWidth += dimension.width + current.marginLeft + current.marginRight + (
                                            previous && !previous.floating && !previous.plainText && !previous.preserveWhiteSpace &&
                                            previous.textContent.trim() !== '' && !/\s+$/.test(previous.textContent) &&
                                            !current.floating && !current.plainText && !current.preserveWhiteSpace &&
                                            current.textContent.trim() !== '' && !/^\s+/.test(current.textContent) ? this.settings.whitespaceHorizontalOffset : 0
                                        );
                            if (!current.floating) {
                                baseline[baseline.length - 1].push(current);
                            }
                        }
                        baseline.forEach(item => adjustBaseline(item));
                        if (node.marginTop < 0 && children[0].position === 'relative') {
                            rows[0].forEach((item, index) => item.modifyBox($enum.BOX_STANDARD.MARGIN_TOP, node.marginTop * (index === 0 ? 1 : -1), true));
                        }
                        if (node.baseline && rows.length === 1) {
                            rows[0].forEach(item => {
                                switch (item.css('verticalAlign')) {
                                    case 'top':
                                        item.anchor('top', 'true');
                                        break;
                                    case 'middle':
                                        item.anchor('centerVertical', 'true');
                                        rows[0].forEach(sibling => item !== sibling && sibling.bounds.height <= item.actualHeight && sibling.anchor('centerVertical', 'true'));
                                        break;
                                }
                            });
                        }
                        if (this.settings.ellipsisOnTextOverflow) {
                            const widthParent = !node.ascend().some(parent => parent.hasWidth);
                            if (!node.ascend(true).some(item => item.is($enum.NODE_STANDARD.GRID)) && (rows.length === 1 || node.hasAlign($enum.NODE_ALIGNMENT.HORIZONTAL))) {
                                for (let i = 1; i < children.length; i++) {
                                    const item = children[i];
                                    if (!item.multiLine && !item.floating && !item.alignParent('left')) {
                                        checkSingleLine(item, false, widthParent);
                                    }
                                }
                            }
                            else {
                                for (const row of rows) {
                                    if (row.length > 1) {
                                        const item = row[row.length - 1];
                                        if (item.inlineText) {
                                            checkSingleLine(item, false, widthParent);
                                        }
                                    }
                                }
                            }
                        }
                    }
                    else if (node.layoutConstraint) {
                        const [pageflow, absolute] = $util.partition(children, item => item.pageflow);
                        const documentParent = node.groupElement ? node : null;
                        let resetPadding = false;
                        for (const item of absolute) {
                            let alignLeft = false;
                            if (item.right !== null && item.toInt('right') >= 0) {
                                item.anchor('right', 'parent');
                                if (item.toInt('left') > 0) {
                                    item.anchor('left', 'parent');
                                    item.modifyBox($enum.BOX_STANDARD.MARGIN_LEFT, item.toInt('left'));
                                    alignLeft = true;
                                }
                                resetPadding = true;
                            }
                            if (!alignLeft && item.left !== null && item.toInt('left') === 0) {
                                item.anchor('left', 'parent');
                                if (item.toInt('right') > 0) {
                                    item.anchor('right', 'parent');
                                    item.modifyBox($enum.BOX_STANDARD.MARGIN_RIGHT, item.toInt('right'));
                                }
                                resetPadding = true;
                            }
                            if (item.top !== null && item.toInt('top') === 0) {
                                item.anchor('top', 'parent');
                                resetPadding = true;
                            }
                            if (item.bottom !== null && item.toInt('bottom') >= 0) {
                                item.anchor('bottom', 'parent');
                                resetPadding = true;
                            }
                            if (item.left === 0 && item.right === 0 && !item.floating && !item.has('width', $enum.CSS_STANDARD.PERCENT)) {
                                item.android('layout_width', 'match_parent');
                            }
                            if (item.top === 0 && item.bottom === 0) {
                                item.android('layout_height', 'match_parent');
                            }
                            item.positioned = true;
                        }
                        if (node.hasAlign($enum.NODE_ALIGNMENT.HORIZONTAL)) {
                            function boundsHeight(a: T, b: T) {
                                return a.bounds.height <= b.bounds.height ? 1 : -1;
                            }
                            const optimal = $NodeList.textBaseline(children)[0];
                            const baseline = children.filter(item => item.textElement && item.baseline).sort(boundsHeight);
                            const images = children.filter(item => item.imageElement && item.baseline).sort(boundsHeight);
                            if (images.length > 0) {
                                const tallest = images.shift() as T;
                                for (const image of images) {
                                    image.anchor('baseline', tallest.stringId);
                                }
                                if (!optimal.imageElement) {
                                    optimal.anchor('bottom', tallest.stringId);
                                }
                            }
                            for (let i = 0; i < children.length; i++) {
                                const current = children[i];
                                const previous = children[i - 1];
                                let alignWith: T | undefined = optimal;
                                if (i === 0) {
                                    current.anchor('left', 'parent');
                                }
                                else if (previous) {
                                    current.anchor('leftRight', previous.stringId);
                                    if (!previous.floating && !current.floating) {
                                        current.constraint.marginHorizontal = previous.stringId;
                                    }
                                }
                                if (images.includes(current)) {
                                    continue;
                                }
                                let verticalAlign = current.css('verticalAlign');
                                if (verticalAlign === 'baseline' && current.tagName === 'TEXTAREA') {
                                    verticalAlign = 'text-bottom';
                                }
                                if (!alignWith || verticalAlign.startsWith('text') || alignWith === current) {
                                    alignWith = undefined;
                                    baseline.some(item => {
                                        if (item !== current) {
                                            alignWith = item;
                                            return true;
                                        }
                                        return false;
                                    });
                                    if (!alignWith) {
                                        children.slice().sort((a, b) => a.nodeType >= b.nodeType ? 1 : -1).some(item => {
                                            if (item !== current) {
                                                alignWith = item;
                                                return true;
                                            }
                                            return false;
                                        });
                                    }
                                }
                                switch (verticalAlign) {
                                    case 'text-top':
                                        if (alignWith) {
                                            current.anchor('top', alignWith.stringId);
                                        }
                                        break;
                                    case 'top':
                                        current.anchor('top', 'parent');
                                        break;
                                    case 'middle':
                                        current.anchorParent(AXIS_ANDROID.VERTICAL);
                                        break;
                                    case 'baseline':
                                        if (alignWith) {
                                            current.anchor('baseline', alignWith.stringId);
                                        }
                                        break;
                                    case 'text-bottom':
                                        if (alignWith) {
                                            current.anchor('bottom', alignWith.stringId);
                                        }
                                        break;
                                    case 'bottom':
                                        current.anchor('bottom', 'parent');
                                        break;
                                }
                            }
                        }
                        else if (node.hasAlign($enum.NODE_ALIGNMENT.COLUMN)) {
                            const columnCount = node.toInt('columnCount');
                            const perRowCount = Math.ceil(pageflow.length / Math.min(columnCount, pageflow.length));
                            const columns: T[][] = [];
                            for (let i = 0, j = 0; i < pageflow.length; i++) {
                                const item = pageflow[i];
                                if (i % perRowCount === 0) {
                                    if (i > 0) {
                                        j++;
                                    }
                                    if (columns[j] === undefined) {
                                        columns[j] = [];
                                    }
                                }
                                columns[j].push(item);
                            }
                            const marginLeft = $util.convertInt(node.css('columnGap')) || 16;
                            const marginTotal: number = columns.map(column => Math.max.apply(null, column.map(item => item.marginLeft + item.marginRight))).reduce((a: number, b: number) => a + b, 0);
                            const marginPercent = Math.max(((marginTotal + (marginLeft * (columnCount - 1))) / node.box.width) / columnCount, 0.01);
                            const chainHorizontal: T[][] = [];
                            const chainVertical: T[][] = [];
                            const columnStart: T[] = [];
                            for (let i = 0; i < columns.length; i++) {
                                const column = columns[i];
                                const first = column[0];
                                if (i > 0) {
                                    first.android(first.localizeString(BOX_ANDROID.MARGIN_LEFT), $util.formatPX(first.marginLeft + marginLeft));
                                }
                                columnStart.push(first);
                                column.forEach(item => {
                                    if (item.viewWidth === 0 || item.has('width', $enum.CSS_STANDARD.PERCENT)) {
                                        const percent = item.toInt('width');
                                        item.android('layout_width', '0px');
                                        item.app('layout_constraintWidth_percent', (percent ? percent / 100 : ((1 / columnCount) - marginPercent)).toFixed(2));
                                    }
                                });
                                chainVertical.push(column);
                            }
                            chainHorizontal.push(columnStart);
                            [chainHorizontal, chainVertical].forEach((connected, index) => {
                                const horizontal = index === 0;
                                connected.forEach(chainable => {
                                    const first = chainable[0];
                                    const last = chainable[chainable.length - 1];
                                    first.anchor(horizontal ? 'left' : 'top', 'parent');
                                    last.anchor(horizontal ? 'right' : 'bottom', 'parent');
                                    for (let i = 0; i < chainable.length; i++) {
                                        const chain = chainable[i];
                                        const previous: T | undefined = chainable[i - 1];
                                        const next: T | undefined = chainable[i + 1];
                                        if (horizontal) {
                                            chain.app('layout_constraintVertical_bias', '0');
                                        }
                                        else {
                                            if (i > 0) {
                                                chain.anchor('left', first.stringId);
                                            }
                                        }
                                        if (next) {
                                            chain.anchor(horizontal ? 'rightLeft' : 'bottomTop', next.stringId);
                                        }
                                        if (previous) {
                                            chain.anchor(horizontal ? 'leftRight' : 'topBottom', previous.stringId);
                                        }
                                        Controller.dimensionConstraint(chain);
                                        chain.anchored = true;
                                    }
                                    if (horizontal) {
                                        first.app('layout_constraintHorizontal_chainStyle', 'spread_inside');
                                    }
                                    else {
                                        first.app('layout_constraintVertical_chainStyle', 'packed');
                                    }
                                });
                            });
                        }
                        else if (pageflow.length > 1) {
                            const chainHorizontal = Controller.partitionRows(pageflow, node);
                            for (const item of pageflow) {
                                const parent = documentParent || item.documentParent;
                                if (item.rightAligned) {
                                    if ($util.withinFraction(item.linear.right, parent.box.right) || item.linear.right > parent.box.right) {
                                        item.anchor('right', 'parent');
                                    }
                                }
                                else {
                                    if ($util.withinFraction(item.linear.left, parent.box.left) || item.linear.left < parent.box.left) {
                                        item.anchor('left', 'parent');
                                    }
                                }
                                if ($util.withinFraction(item.linear.top, parent.box.top) || item.linear.top < parent.box.top) {
                                    item.anchor('top', 'parent');
                                }
                            }
                            if (node.hasAlign($enum.NODE_ALIGNMENT.FLOAT)) {
                                const right = node.hasAlign($enum.NODE_ALIGNMENT.RIGHT);
                                chainHorizontal.forEach((chainable, index) => {
                                    const first = chainable[0];
                                    if (right) {
                                        chainable.reverse();
                                    }
                                    if (index > 0 && (chainable.length === 1 || !chainable.some(item => item.alignParent('left') || item.alignParent('right')))) {
                                        const rowPrevious = chainHorizontal[index - 1];
                                        let chained = true;
                                        for (let i = 0; i < rowPrevious.length; i++) {
                                            const current = rowPrevious[i];
                                            if (first.linear.left === current.linear.left) {
                                                first.anchor('left', current.stringId);
                                                chained = false;
                                            }
                                            if (first.linear.right === current.linear.right) {
                                                first.anchor('right', current.stringId);
                                                chained = false;
                                            }
                                            if (!chained) {
                                                break;
                                            }
                                        }
                                    }
                                });
                                if (pageflow.some(item => item.has('width', $enum.CSS_STANDARD.PERCENT))) {
                                    node.android('layout_width', 'match_parent');
                                }
                            }
                            chainHorizontal.forEach((chainable, level) => {
                                const first = chainable[0];
                                const last = chainable.length > 1 ? chainable[chainable.length - 1] : null;
                                const chained = !!last && first.alignSibling('left') === '' && first.alignSibling('right') === '';
                                if (chained) {
                                    first.app('layout_constraintHorizontal_chainStyle', 'packed');
                                    first.app('layout_constraintHorizontal_bias', node.rightAligned ? '1' : '0');
                                    first.anchor('left', 'parent');
                                    if (last) {
                                        last.anchor('right', 'parent');
                                    }
                                }
                                for (let i = 0; i < chainable.length; i++) {
                                    const chain = chainable[i];
                                    if (chain.autoMarginHorizontal) {
                                        chain.anchorParent(AXIS_ANDROID.HORIZONTAL);
                                    }
                                    else {
                                        const previous = chainable[i - 1];
                                        const next = chainable[i + 1];
                                        if (previous) {
                                            chain.anchor('leftRight', previous.stringId);
                                            chain.constraint.marginHorizontal = previous.stringId;
                                        }
                                        if (next) {
                                            chain.anchor('rightLeft', next.stringId);
                                        }
                                    }
                                    Controller.dimensionConstraint(chain);
                                    if (chainHorizontal.length > 1) {
                                        const rowPrevious = chainHorizontal[level - 1];
                                        if (rowPrevious) {
                                            const abovePrevious = Controller.partitionAboveBottom(rowPrevious, chain);
                                            if (abovePrevious.length > 0) {
                                                const stringId = abovePrevious[0].stringId;
                                                chain.anchor('topBottom', stringId);
                                                chain.constraint.marginVertical = stringId;
                                            }
                                            else {
                                                for (const item of chainable) {
                                                    if (item !== chain && $util.withinFraction(chain.linear.top, item.linear.top)) {
                                                        chain.anchor('top', item.stringId);
                                                        break;
                                                    }
                                                }
                                            }
                                        }
                                        const rowNext = chainHorizontal[level + 1];
                                        if (rowNext) {
                                            for (let j = 0; j < rowNext.length; j++) {
                                                if (chain.intersectY(rowNext[j].linear)) {
                                                    chain.anchor('bottomTop', rowNext[j].stringId);
                                                    break;
                                                }
                                            }
                                        }
                                        else {
                                            if (this.alignParentBottom(chain.linear.bottom, node.box.bottom)) {
                                                chain.anchor('bottom', 'parent');
                                            }
                                        }
                                    }
                                }
                            });
                            Controller.anchorEvaluate(pageflow);
                            for (const current of pageflow) {
                                const parent = documentParent || current.documentParent;
                                if (!current.constraint.horizontal) {
                                    if (current.autoMarginHorizontal) {
                                        current.anchorParent(AXIS_ANDROID.HORIZONTAL);
                                    }
                                    else {
                                        if ($util.withinFraction(current.linear.left, parent.box.left) || current.linear.left < parent.box.left) {
                                            current.anchor('left', 'parent');
                                        }
                                        else if ($util.withinFraction(current.linear.right, parent.box.right) || current.linear.right > parent.box.right) {
                                            current.anchor('right', 'parent');
                                        }
                                    }
                                }
                                if (!current.constraint.vertical) {
                                    if ($util.withinFraction(current.linear.top, parent.box.top) || current.linear.top < parent.box.top) {
                                        current.anchor('top', 'parent');
                                    }
                                    else if (this.alignParentBottom(current.linear.bottom, parent.box.bottom)) {
                                        current.anchor('bottom', 'parent');
                                    }
                                }
                                for (const adjacent of pageflow) {
                                    if (current !== adjacent) {
                                        if (!current.constraint.horizontal) {
                                            if (current.linear.left === adjacent.linear.left && !current.rightAligned && !adjacent.rightAligned) {
                                                current.anchor('left', adjacent.stringId);
                                            }
                                            else if (current.linear.right === adjacent.linear.right && current.rightAligned && adjacent.rightAligned) {
                                                current.anchor('right', adjacent.stringId);
                                            }
                                        }
                                        if (!current.constraint.vertical) {
                                            if ($util.withinFraction(current.linear.top, adjacent.linear.top)) {
                                                current.anchor('top', adjacent.stringId);
                                            }
                                            else if ($util.withinFraction(current.linear.bottom, adjacent.linear.bottom)) {
                                                current.anchor('bottom', adjacent.stringId);
                                            }
                                        }
                                    }
                                }
                            }
                            for (const item of pageflow) {
                                if (item.alignParent('left') && item.alignParent('right')) {
                                    if (item.autoMargin) {
                                        if (item.autoMarginLeft) {
                                            item.anchorDelete('left');
                                        }
                                        if (item.autoMarginRight) {
                                            item.anchorDelete('right');
                                        }
                                        if (item.autoMarginHorizontal) {
                                            if (node.hasWidth && !item.has('width', $enum.CSS_STANDARD.PERCENT)) {
                                                item.android('layout_width', 'match_parent');
                                            }
                                            else if (item.inlineElement && !item.hasWidth) {
                                                item.android('layout_width', 'wrap_content');
                                            }
                                        }
                                    }
                                    else if (item.floating) {
                                        item.anchorDelete(item.float === 'right' ? 'left' : 'right');
                                    }
                                    else if (item.inlineElement) {
                                        if (item.nodeType <= $enum.NODE_STANDARD.IMAGE) {
                                            switch (item.css('textAlign')) {
                                                case 'center':
                                                    break;
                                                case 'right':
                                                case 'end' :
                                                    item.anchorDelete('left');
                                                    break;
                                                default:
                                                    item.anchorDelete('right');
                                                    break;
                                            }
                                        }
                                        else {
                                            item.anchorDelete('right');
                                        }
                                    }
                                    else {
                                        item.anchorDelete('right');
                                        item.android('layout_width', 'match_parent');
                                    }
                                }
                                if (!item.constraint.horizontal && (item.plainText || (!item.styleElement && item.renderChildren.some(sibling => sibling.textElement)))) {
                                    const textAlign = item.cssParent('textAlign');
                                    if (textAlign === 'right') {
                                        item.anchor('right', 'parent');
                                     }
                                    else if (textAlign === 'center') {
                                        item.anchorParent(AXIS_ANDROID.HORIZONTAL, true);
                                    }
                                }
                            }
                            if (resetPadding && pageflow.length <= 1) {
                                const content: T | undefined = pageflow[0];
                                if (content) {
                                    if (content.alignParent('top')) {
                                        node.resetBox($enum.BOX_STANDARD.PADDING, content, true);
                                        if (this.alignParentBottom(content.linear.bottom, content.documentParent.box.bottom)) {
                                            content.anchor('bottom', 'parent');
                                        }
                                    }
                                }
                                else {
                                    node.resetBox($enum.BOX_STANDARD.PADDING);
                                }
                            }
                            for (const item of children) {
                                const top = item.alignParent('top');
                                let right = item.alignParent('right');
                                let bottom = item.alignParent('bottom');
                                const left = item.alignParent('left');
                                if (item.pageflow) {
                                    if ((bottom && item.alignSibling('topBottom') && item.hasHeight) || (top && bottom && this.alignParentBottom(item.linear.bottom, node.box.bottom) && !item.has('marginTop', $enum.CSS_STANDARD.AUTO))) {
                                        item.anchorDelete('bottom');
                                        bottom = false;
                                    }
                                    if (left) {
                                        if (item.is($enum.NODE_STANDARD.TEXT) && item.cssParent('textAlign', true) === 'center') {
                                            item.anchor('right', 'parent');
                                        }
                                        if (item.textElement &&
                                            !item.hasWidth &&
                                            item.toInt('maxWidth') === 0 &&
                                            item.multiLine &&
                                            !$dom.hasLineBreak(item.element) &&
                                            !children.some(sibling => sibling.alignSibling('rightLeft') === item.stringId))
                                        {
                                            item.android('layout_width', 'match_parent');
                                        }
                                    }
                                }
                                else {
                                    if (left && right && item.right === null && item.hasWidth) {
                                        switch (item.cssParent('textAlign', true)) {
                                            case 'center':
                                            case 'right':
                                            case 'end':
                                                break;
                                            default:
                                                item.anchorDelete('right');
                                                right = false;
                                                break;
                                        }
                                    }
                                    if (top && bottom && item.bottom === null && item.hasHeight) {
                                        switch (item.css('verticalAlign')) {
                                            case 'bottom':
                                            case 'text-bottom':
                                            case 'middle':
                                                break;
                                            default:
                                                item.anchorDelete('bottom');
                                                bottom = false;
                                                break;
                                        }
                                    }
                                    if (right && item.toInt('right') > 0) {
                                        item.modifyBox($enum.BOX_STANDARD.MARGIN_RIGHT, Math.max(item.toInt('right') - node.paddingRight, 0));
                                    }
                                    if (bottom && item.toInt('bottom') > 0) {
                                        item.modifyBox($enum.BOX_STANDARD.MARGIN_BOTTOM, Math.max(item.toInt('bottom') - node.paddingBottom, 0));
                                    }
                                }
                            }
                        }
                        Controller.anchorEvaluate(pageflow);
                        children.forEach(item => {
                            if (!item.anchored) {
                                this.addGuideline(item);
                                if (item.pageflow) {
                                    Controller.anchorEvaluate(pageflow);
                                }
                            }
                        });
                    }
                }
                node.each((item: T) => {
                    if (item.pageflow) {
                        if (item.constraint.marginHorizontal) {
                            const previous = this.getNodeByStringId(item.constraint.marginHorizontal);
                            if (previous) {
                                const offset = item.linear.left - previous.actualRight();
                                if (offset >= 1) {
                                    item.modifyBox($enum.BOX_STANDARD.MARGIN_LEFT, offset);
                                }
                            }
                        }
                        if (item.constraint.marginVertical) {
                            const previous = this.getNodeByStringId(item.constraint.marginVertical);
                            if (previous) {
                                let bottom = previous.linear.bottom;
                                if ($dom.isUserAgent($enum.USER_AGENT.EDGE)) {
                                    const elements = $dom.getBetweenElements(previous.groupElement ? (previous.item() as T).baseElement : previous.baseElement, item.baseElement).filter(element => element.tagName === 'BR');
                                    if (elements.length > 0) {
                                        bottom = Math.min(bottom, elements[0].getBoundingClientRect().top + this.settings.whitespaceVerticalOffset);
                                    }
                                }
                                const offset = item.linear.top - bottom;
                                if (offset >= 1) {
                                    item.modifyBox($enum.BOX_STANDARD.MARGIN_TOP, offset);
                                }
                            }
                        }
                    }
                }, true);
            }
        }
    }

    public createGroup(parent: T, node: T, children: T[]) {
        const group = new ViewGroup(this.cache.nextId, node, parent, children, this.delegateNodeInit) as T;
        this.cache.append(group);
        return group;
    }

    public renderGroup(node: T, parent: T, nodeType: number, options: ExternalData = {}) {
        const target = $util.hasValue(node.dataset.target) && !$util.hasValue(node.dataset.include);
        const controlName = View.getControlName(nodeType);
        node.setNodeType(controlName, nodeType);
        switch (controlName) {
            case NODE_ANDROID.LINEAR:
                options = {
                    android: {
                        orientation: options.horizontal ? AXIS_ANDROID.HORIZONTAL : AXIS_ANDROID.VERTICAL
                    }
                };
                break;
            case NODE_ANDROID.GRID:
                options = {
                    android: {
                        columnCount: options.columnCount > 0 ? options.columnCount.toString() : '2',
                        rowCount: options.rowCount > 0 ? options.rowCount.toString() : ''
                    }
                };
                break;
        }
        let preXml = '';
        let postXml = '';
        if (node.overflowX || node.overflowY) {
            const overflow: string[] = [];
            if (node.overflowX && node.overflowY) {
                overflow.push(NODE_ANDROID.SCROLL_HORIZONTAL, NODE_ANDROID.SCROLL_VERTICAL);
            }
            else {
                if (node.overflowX) {
                    overflow.push(NODE_ANDROID.SCROLL_HORIZONTAL);
                }
                if (node.overflowY) {
                    overflow.push(NODE_ANDROID.SCROLL_VERTICAL);
                }
            }
            let previous: T;
            const scrollView = overflow.map((value, index) => {
                const container = new View(this.cache.nextId, index === 0 ? node.element : undefined, this.delegateNodeInit) as T;
                container.nodeName = node.nodeName;
                container.setNodeType(value);
                if (index === 0) {
                    container.inherit(node, 'initial', 'base', 'style', 'styleMap');
                    parent.replaceNode(node, container);
                    container.render(parent);
                }
                else {
                    container.init();
                    container.documentParent = node.documentParent;
                    container.inherit(node, 'dimensions');
                    container.inherit(node, 'initial', 'style', 'styleMap');
                    if (previous) {
                        previous.css('overflow', 'visible scroll');
                        previous.css('overflowX', 'scroll');
                        previous.css('overflowY', 'visible');
                        container.parent = previous;
                        container.render(previous);
                    }
                    container.css('overflow', 'scroll visible');
                    container.css('overflowX', 'visible');
                    container.css('overflowY', 'scroll');
                    if (node.has('height', $enum.CSS_STANDARD.UNIT)) {
                        container.css('height', $util.formatPX(node.toInt('height') + node.paddingTop + node.paddingBottom));
                    }
                }
                container.resetBox($enum.BOX_STANDARD.PADDING);
                const indent = $util.repeat(container.renderDepth);
                preXml += `{<${container.id}}${indent}<${value}{@${container.id}}>\n` +
                          $xml.formatPlaceholder(container.id);
                postXml = `${indent}</${value}>\n{>${container.id}}` + (index === 1 ? '\n' : '') + postXml;
                previous = container;
                this.cache.append(container);
                return container;
            });
            if (scrollView.length === 2) {
                for (const item of scrollView) {
                    if (item.hasWidth) {
                        const value = item.css('width');
                        if ($util.isPercent(value)) {
                            item.android('layout_width', item.convertPercent(value, true, true));
                        }
                        else {
                            item.android('layout_width', value);
                        }
                    }
                    else {
                        item.android('layout_width', 'wrap_content');
                    }

                    item.android('layout_height', item.has('height', $enum.CSS_STANDARD.UNIT) ? item.css('height') : 'wrap_content');
                }
                node.android('layout_width', 'wrap_content');
                node.android('layout_height', 'wrap_content');
            }
            else {
                if (node.overflowX) {
                    node.android('layout_width', 'wrap_content');
                    node.android('layout_height', 'match_parent');
                }
                else {
                    node.android('layout_width', 'match_parent');
                    node.android('layout_height', 'wrap_content');
                }
            }
            node.removeElement();
            node.resetBox($enum.BOX_STANDARD.MARGIN);
            node.parent = scrollView[scrollView.length - 1];
            node.render(node.parent);
        }
        else {
            node.render(target ? node : parent);
        }
        node.apply(options);
        return $xml.getEnclosingTag(controlName, node.id, target || (node.renderDepth === 0 && !node.documentRoot) ? -1 : node.renderDepth, $xml.formatPlaceholder(node.id), preXml, postXml);
    }

    public renderNode(node: T, parent: T, nodeType: number, options: ExternalData = {}, recursive = false): string {
        const target = $util.hasValue(node.dataset.target) && !$util.hasValue(node.dataset.include);
        const controlName = View.getControlName(nodeType);
        node.setNodeType(controlName, nodeType);
        switch (node.tagName) {
            case 'IMG': {
                if (!recursive && !node.hasBit('excludeResource', $enum.NODE_RESOURCE.IMAGE_SOURCE)) {
                    const element = <HTMLImageElement> node.element;
                    const widthPercent = node.has('width', $enum.CSS_STANDARD.PERCENT);
                    const heightPercent = node.has('height', $enum.CSS_STANDARD.PERCENT);
                    let width = node.toInt('width');
                    let height = node.toInt('height');
                    let scaleType = '';
                    if (widthPercent || heightPercent) {
                        scaleType = widthPercent && heightPercent ? 'fitXY' : 'fitCenter';
                    }
                    else {
                        if (width === 0) {
                            const match = /width="(\d+)"/.exec(element.outerHTML);
                            if (match) {
                                width = parseInt(match[1]);
                                node.css('width', $util.formatPX(match[1]));
                            }
                        }
                        if (height === 0) {
                            const match = /height="(\d+)"/.exec(element.outerHTML);
                            if (match) {
                                height = parseInt(match[1]);
                                node.css('height', $util.formatPX(match[1]));
                            }
                        }
                        switch (node.css('objectFit')) {
                            case 'contain':
                                scaleType = 'centerInside';
                                break;
                            case 'cover':
                                scaleType = 'centerCrop';
                                break;
                            case 'scale-down':
                                scaleType = 'fitCenter';
                                break;
                            case 'none':
                                scaleType = 'matrix';
                                break;
                            default:
                                scaleType = 'fitXY';
                                break;
                        }
                    }
                    node.android('scaleType', scaleType);
                    if ((width > 0 && height === 0) || (width === 0 && height > 0)) {
                        node.android('adjustViewBounds', 'true');
                    }
                    const src = Resource.addImageSrcSet(element);
                    if (src !== '') {
                        node.android('src', `@drawable/${src}`);
                    }
                    if (!node.pageflow) {
                        const left = node.toInt('left');
                        const top = node.toInt('top');
                        if (left < 0 || top < 0) {
                            const container = new View(this.cache.nextId, undefined, this.delegateNodeInit) as T;
                            container.excludeProcedure |= $enum.NODE_PROCEDURE.ALL;
                            container.excludeResource |= $enum.NODE_RESOURCE.ALL;
                            container.setNodeType(NODE_ANDROID.FRAME, $enum.NODE_STANDARD.FRAME);
                            container.init();
                            container.inherit(node, 'base');
                            parent.replaceNode(node, container);
                            container.render(parent);
                            this.cache.append(container);
                            if (width > 0) {
                                container.android('layout_width', width < parent.box.width ? $util.formatPX(width) : 'match_parent');
                            }
                            if (height > 0) {
                                container.android('layout_height', height < parent.box.height ? $util.formatPX(height) : 'match_parent');
                            }
                            return $xml.getEnclosingTag(NODE_ANDROID.FRAME, container.id, container.renderDepth, this.renderNode(node, container, nodeType, options, true));
                        }
                    }
                    else {
                        if (parent.layoutHorizontal && node.baseline) {
                            node.android('baselineAlignBottom', 'true');
                        }
                    }
                }
                break;
            }
            case 'TEXTAREA': {
                const element = <HTMLTextAreaElement> node.element;
                node.android('minLines', '2');
                if (element.rows > 2) {
                    node.android('maxLines', element.rows.toString());
                }
                if (element.maxLength > 0) {
                    node.android('maxLength', element.maxLength.toString());
                }
                if (!node.hasWidth) {
                    if (element.cols > 0) {
                        node.css('width', $util.formatPX(element.cols * 10));
                    }
                }
                node.android('hint', element.placeholder);
                node.android('scrollbars', AXIS_ANDROID.VERTICAL);
                node.android('inputType', 'textMultiLine');
                if (node.overflowX) {
                    node.android('scrollHorizontally', 'true');
                }
                break;
            }
            case 'INPUT': {
                const element = <HTMLInputElement> node.element;
                switch (element.type) {
                    case 'radio':
                        if (!recursive) {
                            const radiogroup = parent.map(item => {
                                if (item.renderAs) {
                                    item = item.renderAs;
                                }
                                const input = <HTMLInputElement> item.element;
                                if (item.visible && !item.rendered && input.type === 'radio' && input.name === element.name) {
                                    return item;
                                }
                                return null;
                            })
                            .filter(item => item) as T[];
                            if (radiogroup.length > 1) {
                                const group = this.createGroup(parent, node, radiogroup);
                                group.setNodeType(NODE_ANDROID.RADIO_GROUP, $enum.NODE_STANDARD.RADIO_GROUP);
                                group.inherit(node, 'alignment');
                                group.render(parent);
                                let xml = '';
                                let checked = '';
                                group.each((item: T) => {
                                    if ((<HTMLInputElement> item.element).checked) {
                                        checked = item.stringId;
                                    }
                                    xml += this.renderNode(item, group, $enum.NODE_STANDARD.RADIO, options, true);
                                });
                                group.android('orientation', $NodeList.linearX(radiogroup, radiogroup.every(item => item.documentParent === radiogroup[0].documentParent)) ? AXIS_ANDROID.HORIZONTAL : AXIS_ANDROID.VERTICAL);
                                group.alignmentType |= $enum.NODE_ALIGNMENT.SEGMENTED;
                                if (checked !== '') {
                                    group.android('checkedButton', checked);
                                }
                                return $xml.getEnclosingTag(NODE_ANDROID.RADIO_GROUP, group.id, group.renderDepth, xml);
                            }
                        }
                        break;
                    case 'password':
                        node.android('inputType', 'textPassword');
                        break;
                    case 'text':
                        node.android('inputType', 'text');
                        break;
                    case 'range':
                        if ($util.hasValue(element.min)) {
                            node.android('min', element.min);
                        }
                        if ($util.hasValue(element.max)) {
                            node.android('max', element.max);
                        }
                        if ($util.hasValue(element.value)) {
                            node.android('progress', element.value);
                        }
                        break;
                    case 'image':
                        if (!node.hasBit('excludeResource', $enum.NODE_RESOURCE.IMAGE_SOURCE)) {
                            const result = Resource.addImage({ mdpi: element.src });
                            if (result !== '') {
                                node.android('src', `@drawable/${result}`, node.renderExtension.size === 0);
                            }
                        }
                        break;
                }
                switch (element.type) {
                    case 'text':
                    case 'search':
                    case 'tel':
                    case 'url':
                    case 'email':
                    case 'password':
                        if (!node.hasWidth && element.size > 0) {
                            node.css('width', $util.formatPX(element.size * 10));
                        }
                        break;
                }
                break;
            }
        }
        switch (node.controlName) {
            case NODE_ANDROID.TEXT:
                const scrollbars: string[] = [];
                if (node.overflowX) {
                    scrollbars.push(AXIS_ANDROID.HORIZONTAL);
                }
                if (node.overflowY) {
                    scrollbars.push(AXIS_ANDROID.VERTICAL);
                }
                if (scrollbars.length > 0) {
                    node.android('scrollbars', scrollbars.join('|'));
                }
                if (node.css('whiteSpace') === 'nowrap') {
                    node.android('singleLine', 'true');
                }
                const textShadow = node.css('textShadow');
                if (textShadow !== 'none') {
                    [/^(rgba?\(\d+, \d+, \d+(?:, [\d.]+)?\)) ([\d.]+[a-z]+) ([\d.]+[a-z]+) ([\d.]+[a-z]+)$/, /^([\d.]+[a-z]+) ([\d.]+[a-z]+) ([\d.]+[a-z]+) (.+)$/].some((value, index) => {
                        const match = textShadow.match(value);
                        if (match) {
                            const color = $color.parseRGBA(match[index === 0 ? 1 : 4]);
                            if (color) {
                                const colorValue = Resource.addColor(color);
                                if (colorValue !== '') {
                                    node.android('shadowColor', `@color/${colorValue}`);
                                }
                            }
                            node.android('shadowDx', $util.convertInt(match[index === 0 ? 2 : 1]).toString());
                            node.android('shadowDy', $util.convertInt(match[index === 0 ? 3 : 2]).toString());
                            node.android('shadowRadius', $util.convertInt(match[index === 0 ? 4 : 3]).toString());
                            return true;
                        }
                        return false;
                    });
                }
                break;
            case NODE_ANDROID.LINE:
                if (!node.hasHeight) {
                    node.android('layout_height', $util.formatPX($Node.getContentBoxHeight(node) || 1));
                }
                break;
        }
        node.render(target ? node : parent);
        return $xml.getEnclosingTag(controlName, node.id, target || (node.renderDepth === 0 && !node.documentRoot) ? -1 : node.renderDepth);
    }

    public renderNodeStatic(controlName: string, depth: number, options: ExternalData = {}, width = '', height = '', node?: T, children?: boolean) {
        const renderDepth = Math.max(0, depth);
        if (node === undefined) {
            node = new View(0, undefined, this.delegateNodeInit) as T;
        }
        else {
            node.renderDepth = renderDepth;
            node.rendered = true;
        }
        node.apply(options);
        if ($util.hasValue(width)) {
            node.android('layout_width', width, false);
        }
        if ($util.hasValue(height)) {
            node.android('layout_height', height, false);
        }
        if (node.nodeType === 0 || !node.controlName) {
            node.setNodeType(controlName);
        }
        let output = $xml.getEnclosingTag(controlName, node.id, !node.documentRoot && depth === 0 ? -1 : depth, children ? $xml.formatPlaceholder(node.id) : '');
        if (this.settings.showAttributes && node.id === 0) {
            const indent = $util.repeat(renderDepth + 1);
            const attrs = node.combine().map(value => `\n${indent + value}`).join('');
            output = output.replace($xml.formatPlaceholder(node.id, '@'), attrs);
        }
        options.stringId = node.stringId;
        return output;
    }

    public renderColumnSpace(depth: number, width: string, height = '', columnSpan = 1) {
        let percent = '';
        if ($util.isPercent(width)) {
            percent = (parseInt(width) / 100).toFixed(2);
            width = '0px';
        }
        const options = createAttribute({
            android: {
                layout_columnWeight: percent,
                layout_columnSpan: columnSpan.toString()
            }
        });
        return this.renderNodeStatic(NODE_ANDROID.SPACE, depth, options, width, $util.hasValue(height) ? height : 'wrap_content');
    }

    public addGuideline(node: T, orientation = '', percent = false, opposite = false) {
        if (node.dataset.constraintPercent === 'true') {
            percent = true;
        }
        if (node.dataset.constraintOpposite === 'true') {
            opposite = true;
        }
        const parent = node.documentParent;
        const beginPercent = `layout_constraintGuide_${percent ? 'percent' : 'begin'}`;
        [AXIS_ANDROID.HORIZONTAL, AXIS_ANDROID.VERTICAL].forEach((value, index) => {
            if (!node.constraint[value] && (orientation === '' || value === orientation)) {
                let LT = '';
                let RB = '';
                let LTRB = '';
                let RBLT = '';
                let offset = 0;
                switch (index) {
                    case 0:
                        LT = !opposite ? 'left' : 'right';
                        RB = !opposite ? 'right' : 'left';
                        LTRB = !opposite ? 'leftRight' : 'rightLeft';
                        RBLT = !opposite ? 'rightLeft' : 'leftRight';
                        if (node.position === 'relative' && node.toInt('left') < 0) {
                            offset = node.toInt('left');
                        }
                        break;
                    case 1:
                        LT = !opposite ? 'top' : 'bottom';
                        RB = !opposite ? 'bottom' : 'top';
                        LTRB = !opposite ? 'topBottom' : 'bottomTop';
                        RBLT = !opposite ? 'bottomTop' : 'topBottom';
                        if (node.position === 'relative' && node.toInt('top') < 0) {
                            offset = node.toInt('top');
                        }
                        break;
                }
                const dimension = node.pageflow ? 'bounds' : 'linear';
                const position = percent ? Math.abs((node[dimension][LT] + offset) - (parent.documentBody ? 0 : parent.box[LT])) / parent.box[index === 0 ? 'width' : 'height'] : 0;
                let found = false;
                if (!parent.hasAlign($enum.NODE_ALIGNMENT.AUTO_LAYOUT) && !percent) {
                    found = parent.renderChildren.some(item => {
                        if (item !== node && item.constraint[value]) {
                            if ($util.withinFraction(node.linear[LT] + offset, item.linear[RB])) {
                                node.anchor(LTRB, item.stringId, true);
                                return true;
                            }
                            else if ($util.withinFraction(node.linear[RB] + offset, item.linear[LT])) {
                                node.anchor(RBLT, item.stringId, true);
                                return true;
                            }
                            if ($util.withinFraction(node.bounds[LT] + offset, item.bounds[LT])) {
                                node.anchor(index === 1 && node.textElement && node.baseline && item.textElement && item.baseline ? 'baseline' : LT, item.stringId, true);
                                return true;
                            }
                            else if ($util.withinFraction(node.bounds[RB] + offset, item.bounds[RB])) {
                                node.anchor(RB, item.stringId, true);
                                return true;
                            }
                        }
                        return false;
                    });
                }
                if (!found) {
                    const guideline = parent.constraint.guideline || {};
                    let location = percent ? parseFloat(Math.abs(position - (!opposite ? 0 : 1)).toFixed(this.localSettings.constraint.percentAccuracy))
                                           : (node[dimension][LT] + offset) - parent.box[!opposite ? LT : RB];
                    if (!percent && !opposite) {
                        if (location < 0) {
                            const padding = parent[`padding${$util.capitalize(LT)}`];
                            if (padding >= Math.abs(location)) {
                                location = 0;
                            }
                            else {
                                location = Math.abs(location) - padding;
                            }
                        }
                        else {
                            if (parent.documentBody) {
                                location = node[dimension][LT] + offset;
                            }
                        }
                    }
                    if (location === 0) {
                        node.anchor(LT, 'parent', true);
                    }
                    else {
                        const options = createAttribute({
                            android: {
                                orientation: index === 0 ? AXIS_ANDROID.VERTICAL : AXIS_ANDROID.HORIZONTAL
                            },
                            app: {
                                [beginPercent]: location.toString()
                            }
                        });
                        const anchors = $util.optionalAsObject(guideline, `${value}.${beginPercent}.${LT}`);
                        if (anchors) {
                            for (const stringId in anchors) {
                                if (parseInt(anchors[stringId]) === location) {
                                    node.anchor(LT, stringId, true);
                                    node.anchorDelete(RB);
                                    found = true;
                                    break;
                                }
                            }
                        }
                        if (!found) {
                            if (!percent) {
                                options.app[beginPercent] = $util.formatPX(location);
                            }
                            this.appendAfter(
                                node.id,
                                this.renderNodeStatic(
                                    NODE_ANDROID.GUIDELINE,
                                    node.renderDepth,
                                    options,
                                    'wrap_content',
                                    'wrap_content'
                                )
                            );
                            const stringId: string = options['stringId'];
                            node.anchor(LT, stringId, true);
                            node.anchorDelete(RB);
                            $util.defaultWhenNull(guideline, value, beginPercent, LT, stringId, location.toString());
                            parent.constraint.guideline = guideline;
                            value = $util.capitalize(value);
                            node.constraint[`guideline${value}`] = stringId;
                            node.constraint[`margin${value}`] = '';
                        }
                    }
                }
                node.constraint[value] = true;
            }
        });
    }

    private getNodeByStringId(id: string) {
        return this.cache.find('stringId', id) || null;
    }

    private alignParentBottom(bottom: number, boxBottom: number) {
        return bottom + this.localSettings.constraint.alignParentBottomOffset >= boxBottom;
    }

    public get delegateNodeInit(): SelfWrapped<T, void> {
        const settings = this.settings;
        return (self: T) => {
            self.localSettings = {
                targetAPI: settings.targetAPI !== undefined ? settings.targetAPI : 26,
                resolutionDPI: settings.resolutionDPI !== undefined ? settings.resolutionDPI : 160,
                supportRTL: settings.supportRTL !== undefined ? settings.supportRTL : true,
                autoSizePaddingAndBorderWidth: settings.autoSizePaddingAndBorderWidth !== undefined ? settings.autoSizePaddingAndBorderWidth : true,
                ellipsisOnTextOverflow: settings.ellipsisOnTextOverflow !== undefined ? settings.ellipsisOnTextOverflow : true,
                constraintPercentAccuracy: this.localSettings.constraint.percentAccuracy,
                customizationsOverwritePrivilege: settings.customizationsOverwritePrivilege !== undefined ? settings.customizationsOverwritePrivilege : true
            };
        };
    }
}