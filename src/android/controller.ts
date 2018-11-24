import { UserSettingsAndroid } from './types/module';

import { AXIS_ANDROID, BOX_ANDROID, CONTAINER_ANDROID, WEBVIEW_ANDROID, XMLNS_ANDROID } from './lib/constant';

import BASE_TMPL from './template/base';

import Resource from './resource';
import View from './view';
import ViewGroup from './viewgroup';

import { createAttribute, getXmlNs, replaceTab, replaceUnit } from './lib/util';

import $Layout = androme.lib.base.Layout;
import $Node = androme.lib.base.Node;
import $NodeList = androme.lib.base.NodeList;

import $color = androme.lib.color;
import $dom = androme.lib.dom;
import $enum = androme.lib.enumeration;
import $util = androme.lib.util;
import $xml = androme.lib.xml;

function adjustBaseline<T extends View>(nodes: T[]) {
    let baseline: T | undefined;
    if (nodes.length > 1) {
        const result = $NodeList.textBaseline(nodes.filter(item => item.visible && (item.baseline || (item.inlineVertical && $util.isUnit(item.verticalAlign)))));
        if (result.length) {
            baseline = result[0];
            const alignable = nodes.filter(item => item.siblingflow || item.positionRelative);
            const adjustable: number[] = [];
            for (const node of alignable) {
                if (node !== baseline && (node.domElement || (node.layoutHorizontal && node.renderChildren.some(item => item.textElement)))) {
                    if (baseline.positionRelative && baseline.renderIndex === 0 && Math.max(node.bounds.height, node.lineHeight) < Math.max(baseline.bounds.height, baseline.lineHeight)) {
                        node.anchor(baseline.bottom !== null ? 'bottom' : 'top', baseline.stringId);
                    }
                    else if (node.toInt('top') === 0 && node.toInt('bottom') === 0) {
                        node.anchor(node.is($enum.NODE_CONTAINER.BUTTON) ? 'bottom' : 'baseline', baseline.stringId);
                        if (node.imageElement && node.baseline) {
                            node.android('baselineAlignBottom', 'true');
                        }
                        adjustable.push(node.toInt('verticalAlign'));
                    }
                }
            }
            applyVerticalAlign(baseline, adjustable);
        }
    }
    return baseline;
}

function applyVerticalAlign<T extends View>(node: T, adjustable: number[]) {
    if (adjustable.length) {
        const maxOffset: number = Math.max.apply(null, adjustable);
        if (maxOffset !== 0) {
            node.modifyBox($enum.BOX_STANDARD.MARGIN_TOP, maxOffset * -1);
        }
    }
}

function adjustFloatingNegativeMargin<T extends View>(item: T, previous: T) {
    if (previous.float === 'left') {
        if (previous.marginRight < 0) {
            const right = Math.abs(previous.marginRight);
            item.modifyBox($enum.BOX_STANDARD.MARGIN_LEFT, (previous.bounds.width + (previous.hasWidth ? previous.paddingLeft + previous.borderLeftWidth : 0)) - right);
            item.anchor('left', previous.stringId);
            previous.modifyBox($enum.BOX_STANDARD.MARGIN_RIGHT, null);
            return true;
        }
    }
    else if (item.float === 'right' && previous.float === 'right') {
        if (previous.marginLeft < 0) {
            const left = Math.abs(previous.marginLeft);
            if (left < previous.bounds.width) {
                item.modifyBox($enum.BOX_STANDARD.MARGIN_RIGHT, previous.bounds.width - left);
            }
            item.anchor('right', previous.stringId);
            previous.modifyBox($enum.BOX_STANDARD.MARGIN_LEFT, null);
            return true;
        }
    }
    return false;
}

function checkSingleLine<T extends View>(node: T, nowrap = false, flexParent = false) {
    if (node && node.textElement && node.cssParent('textAlign', true) !== 'center' && (nowrap || flexParent || (!node.hasWidth && !node.multiLine && node.textContent.trim().split(String.fromCharCode(32)).length > 1))) {
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

function constraintPercentValue<T extends View>(node: T, dimension: string, value: string, requirePX: boolean) {
    if ($util.isPercent(value)) {
        if (requirePX) {
            node.android(`layout_${dimension.toLowerCase()}`, node.convertPercent(value, dimension === 'Width', true));
        }
        else if (value !== '100%') {
            node.app(`layout_constraint${dimension}_percent`, (parseInt(value) / 100).toFixed(2));
            node.android(`layout_${dimension.toLowerCase()}`, '0px');
        }
    }
}

function constraintPercentWidth<T extends View>(node: T, requirePX = false) {
    const value = node.has('width') ? node.css('width') : '';
    constraintPercentValue(node, 'Width', value, requirePX);
}

function constraintPercentHeight<T extends View>(node: T, requirePX = false) {
    if (node.documentParent.hasHeight) {
        const value = node.has('height') ? node.css('height') : '';
        constraintPercentValue(node, 'Height', value, requirePX);
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
                constraintPercentHeight(node, true);
            }
            else {
                constraintPercentWidth(node, true);
            }
        }
        constraintMinMax(node, 'Width');
        constraintMinMax(node, 'Height');
    }

    public userSettings: UserSettingsAndroid;

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
        relative: {
            superscriptFontScale: -4,
            subscriptFontScale: 4
        },
        constraint: {
            withinParentBottomOffset: 3.5,
            percentAccuracy: 4
        }
    };

    public finalize(viewData: ViewData<$NodeList<T>>) {
        const settings = this.userSettings;
        if (settings.showAttributes) {
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
                    if (node.containerType < $enum.NODE_CONTAINER.INLINE) {
                        node.android('textDirection', 'rtl');
                    }
                    else if (node.renderChildren.length) {
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
            value.content = replaceUnit(value.content, settings.resolutionDPI, settings.convertPixels);
            value.content = replaceTab(value.content, settings.insertSpaces);
            value.content = $xml.removePlaceholderAll(value.content).replace(/\n\n/g, '\n');
        }
    }

    public checkConstraintHorizontal(parent: T, nodes: T[]) {
        const hasHeight = parent.hasHeight;
        const textAlign = parent.css('textAlign');
        return new Set(nodes.map(node => node.bounds.height)).size !== 1 && (textAlign === 'left' || textAlign === 'start' || textAlign === '') && nodes.some(node => {
            const value = node.verticalAlign;
            return node.inlineVertical && (value === 'text-top' || value === 'text-bottom' || (!hasHeight && value === 'bottom'));
        });
    }

    public checkConstraintFloat(parent: T, nodes: T[], floated?: Set<string>, cleared?: Map<T, string>, linearX?: boolean) {
        if (floated === undefined) {
            floated = $NodeList.floated(nodes);
        }
        if (linearX === undefined) {
            linearX = $NodeList.linearX(nodes);
        }
        return floated.size === 1 && nodes.every(node => node.floating && node.marginLeft >= 0 && node.marginRight >= 0 && node.css('width') !== '100%');
    }

    public checkFrameHorizontal(parent: T, nodes: T[], floated?: Set<string>, cleared?: Map<T, string>, linearX?: boolean) {
        if (floated === undefined) {
            floated = $NodeList.floated(nodes);
        }
        if (cleared === undefined) {
            cleared = $NodeList.clearedAll(parent);
        }
        if (linearX === undefined) {
            linearX = $NodeList.linearX(nodes);
        }
        const [floating, sibling] = $util.partition(nodes, node => node.floating);
        if (floated.size === 2 || cleared.size > 0 || (sibling.length > 0 && floated.has('right')) || nodes.some(node => node.autoMargin) || (!linearX && floating.length > 0 && sibling.length > 0)) {
            return true;
        }
        const flowIndex = Math.min.apply(null, sibling.map(node => node.siblingIndex));
        const floatMap = floating.map(node => node.siblingIndex);
        return floated.has('left') && (floatMap.some(value => value > flowIndex) || (!linearX && floatMap.every(value => value < flowIndex)));
    }

    public checkRelativeHorizontal(parent: T, nodes: T[], floated?: Set<string>, cleared?: Map<T, string>, linearX?: boolean) {
        if (floated === undefined) {
            floated = $NodeList.floated(nodes);
        }
        if (cleared === undefined) {
            cleared = $NodeList.clearedAll(parent);
        }
        if (linearX === undefined) {
            linearX = $NodeList.linearX(nodes);
        }
        const visible = nodes.filter(node => node.visible);
        if (linearX && (visible.some(node => node.inlineVertical && node.toInt('verticalAlign') > 0)) || (floated.has('right') && nodes.some(node => !node.floating))) {
            return false;
        }
        if (!linearX && (floated.size > 0)) {
            return false;
        }
        return visible.some(node => (node.baseline && (node.textElement || node.imageElement || node.svgElement)) || (node.plainText && node.multiLine) || node.supSubscript);
    }

    public setConstraints() {
        const settings = this.userSettings;
        for (const node of this.cache.visible) {
            if (!node.hasBit('excludeProcedure', $enum.NODE_PROCEDURE.CONSTRAINT)) {
                const children = node.renderChildren.filter(item => !item.positioned) as T[];
                if (children.length) {
                    if (node.layoutRelative) {
                        const renderParent = node.renderParent;
                        const boxWidth = Math.ceil((() => {
                            if (renderParent.overflowX) {
                                if (node.has('width', $enum.CSS_STANDARD.UNIT)) {
                                    return node.toInt('width', true);
                                }
                                else if (renderParent.has('width', $enum.CSS_STANDARD.UNIT)) {
                                    return renderParent.toInt('width', true);
                                }
                                else if (renderParent.has('width', $enum.CSS_STANDARD.PERCENT)) {
                                    return renderParent.bounds.width - $Node.getContentBoxWidth(renderParent);
                                }
                            }
                            else if (node.hasAlign($enum.NODE_ALIGNMENT.FLOAT)) {
                                const minLeft: number = Math.min.apply(null, children.map(item => item.linear.left));
                                const maxRight: number = Math.max.apply(null, children.map(item => item.linear.right));
                                return maxRight - minLeft;
                            }
                            else {
                                const floatStart: number = Math.max.apply(null, node.documentParent.initial.children.filter(item => item.float === 'left' && item.siblingIndex < node.siblingIndex).map(item => item.linear.right));
                                if (children.some(item => item.linear.left === floatStart)) {
                                    return node.box.right - floatStart;
                                }
                            }
                            return node.box.width;
                        })());
                        let rowWidth = 0;
                        let rowPaddingLeft = 0;
                        let rowPreviousLeft: T | undefined;
                        let rowPreviousBottom: T | undefined;
                        const checkRowWrap = !node.hasAlign($enum.NODE_ALIGNMENT.NOWRAP);
                        const checkLineWrap = node.css('whiteSpace') !== 'nowrap';
                        const textIndent = node.toInt('textIndent');
                        if (textIndent < 0 && Math.abs(textIndent) <= node.paddingLeft) {
                            rowPaddingLeft = Math.abs(textIndent);
                            node.modifyBox($enum.BOX_STANDARD.PADDING_LEFT, node.paddingLeft + textIndent);
                            node.modifyBox($enum.BOX_STANDARD.PADDING_LEFT, null);
                        }
                        const rows: T[][] = [];
                        const rangeMultiLine = new Set<T>();
                        const cleared = $NodeList.cleared(node.initial.children);
                        const edgeOrFirefox = $dom.isUserAgent($enum.USER_AGENT.EDGE | $enum.USER_AGENT.FIREFOX);
                        const floatRight = children.every(item => item.float === 'right');
                        const alignParent = floatRight ? 'right' : 'left';
                        for (let i = 0; i < children.length; i++) {
                            const item = children[i];
                            const previous = children[i - 1];
                            let dimension = item.bounds;
                            if (item.inlineText && !item.hasWidth) {
                                const [bounds, multiLine] = $dom.getRangeClientRect(item.element);
                                if (bounds && (multiLine || bounds.width < item.box.width)) {
                                    dimension = bounds;
                                    if (edgeOrFirefox && multiLine && !/^\s*\n+/.test(item.textContent)) {
                                        rangeMultiLine.add(item);
                                    }
                                }
                            }
                            let alignSibling = floatRight ? 'rightLeft' : 'leftRight';
                            if (i === 0) {
                                item.anchor(alignParent, 'true');
                                if (!node.inline && textIndent > 0) {
                                    item.modifyBox($enum.BOX_STANDARD.MARGIN_LEFT, textIndent);
                                }
                                if (!item.siblingflow || (item.floating && item.positionRelative) || (item.multiLine && textIndent < 0)) {
                                    rowPreviousLeft = item;
                                }
                                rows.push([item]);
                            }
                            else {
                                const siblings = $dom.getBetweenElements(previous.element, item.element, false, true);
                                const baseWidth = rowWidth + item.marginLeft + (previous.float === 'left' ? 0 : dimension.width) - (edgeOrFirefox ? item.borderRightWidth : 0);
                                function checkWidthWrap() {
                                    return !item.rightAligned && (Math.floor(baseWidth) - (item.styleElement && item.inlineStatic ? item.paddingLeft + item.paddingRight : 0) > boxWidth);
                                }
                                if (adjustFloatingNegativeMargin(item, previous)) {
                                    alignSibling = '';
                                }
                                const startNewRow = (() => {
                                    if (item.textElement) {
                                        let connected = false;
                                        if (previous.textElement) {
                                            if (i === 1 && item.plainText && !previous.rightAligned) {
                                                connected = siblings.length === 0 && !/\s+$/.test(previous.textContent) && !/^\s+/.test(item.textContent);
                                            }
                                            if (connected) {
                                                checkSingleLine(item);
                                            }
                                            if (!checkRowWrap) {
                                                return false;
                                            }
                                            if (checkLineWrap && !connected && (
                                                    (previous.multiLine && previous.textContent.trim() !== '' && !/^\s*\n+/.test(previous.textContent) && !/\n+\s*$/.test(previous.textContent) && $dom.hasLineBreak(previous.element)) ||
                                                    rangeMultiLine.has(previous)
                                               ))
                                            {
                                                return true;
                                            }
                                        }
                                        if (checkLineWrap && !connected && (
                                                checkWidthWrap() ||
                                                (item.multiLine && $dom.hasLineBreak(item.element)) ||
                                                (item.preserveWhiteSpace && /^\n+/.test(item.textContent))
                                           ))
                                        {
                                            return true;
                                        }
                                    }
                                    return false;
                                })();
                                const rowItems = rows[rows.length - 1];
                                const viewGroup = item.groupElement && !item.hasAlign($enum.NODE_ALIGNMENT.SEGMENTED);
                                const previousSibling = item.previousSibling();
                                if (checkRowWrap && (
                                        startNewRow || (
                                            viewGroup ||
                                            (!item.textElement && checkWidthWrap()) ||
                                            (item.linear.top >= previous.linear.bottom && (
                                                item.blockStatic ||
                                                (item.float === 'left' && $util.withinFraction(item.linear.left, node.box.left)) ||
                                                (item.float === 'right' && $util.withinFraction(item.linear.right, node.box.right))
                                            )) ||
                                            (!item.floating && (
                                                previous.blockStatic ||
                                                (previousSibling && previousSibling.lineBreak) ||
                                                siblings.some(element => $dom.isLineBreak(element))
                                            )) ||
                                            cleared.has(item)
                                        )
                                   ))
                                {
                                    rowPreviousBottom = rowItems.filter(subitem => !subitem.floating)[0] || rowItems[0];
                                    for (let j = 0; j < rowItems.length; j++) {
                                        if (rowItems[j] !== rowPreviousBottom && rowItems[j].linear.bottom > rowPreviousBottom.linear.bottom && (!rowItems[j].floating || (rowItems[j].floating && rowPreviousBottom.floating))) {
                                            rowPreviousBottom = rowItems[j];
                                        }
                                    }
                                    if (viewGroup || (previous.groupElement && i === children.length - 1)) {
                                        item.constraint.marginVertical = rowPreviousBottom.stringId;
                                    }
                                    item.anchor('topBottom', rowPreviousBottom.stringId);
                                    if (rowPreviousLeft && item.linear.top < rowPreviousLeft.bounds.bottom && !$util.withinRange(item.bounds.top, rowPreviousLeft.bounds.top, 1) && !$util.withinRange(item.bounds.bottom, rowPreviousLeft.bounds.bottom, 1)) {
                                        item.anchor(alignSibling, rowPreviousLeft.stringId);
                                    }
                                    else {
                                        item.anchor(alignParent, 'true');
                                        rowPreviousLeft = undefined;
                                    }
                                    if (settings.ellipsisOnTextOverflow && previous.linearHorizontal) {
                                        checkSingleLine(previous.item() as T, true);
                                    }
                                    if (rowPaddingLeft > 0) {
                                        if (settings.ellipsisOnTextOverflow && rows.length === 1 && rows[0].length === 1 && rows[0][0].textElement) {
                                            checkSingleLine(rows[0][0], true);
                                        }
                                        item.modifyBox($enum.BOX_STANDARD.PADDING_LEFT, rowPaddingLeft);
                                    }
                                    node.alignmentType |= $enum.NODE_ALIGNMENT.MULTILINE;
                                    rowWidth = 0;
                                    rows.push([item]);
                                }
                                else {
                                    if (i === 1 && rowPaddingLeft > 0 && !previous.plainText) {
                                        item.anchor(alignParent, 'true');
                                        item.modifyBox($enum.BOX_STANDARD.PADDING_LEFT, rowPaddingLeft);
                                    }
                                    else if (alignSibling !== '') {
                                        item.anchor(alignSibling, previous.stringId);
                                    }
                                    if (baseWidth > boxWidth) {
                                        checkSingleLine(item);
                                    }
                                    if (rowPreviousBottom) {
                                        item.anchor('topBottom', rowPreviousBottom.stringId);
                                    }
                                    rowItems.push(item);
                                }
                            }
                            rowWidth += dimension.width + item.marginLeft + item.marginRight + (
                                            previous && !previous.floating && !previous.plainText && !previous.preserveWhiteSpace &&
                                            previous.textContent.trim() !== '' && !/\s+$/.test(previous.textContent) &&
                                            !item.floating && !item.plainText && !item.preserveWhiteSpace &&
                                            item.textContent.trim() !== '' && !/^\s+/.test(item.textContent) ? settings.whitespaceHorizontalOffset : 0
                                        );
                        }
                        const rowParent: Undefined<T>[] = [];
                        for (let i = 0; i < rows.length; i++) {
                            let tallest: T | undefined;
                            rows[i].forEach(item => {
                                if (item.inlineVertical) {
                                    if (tallest) {
                                        if (item.lineHeight > 0) {
                                            if (tallest.lineHeight > 0 && item.lineHeight > tallest.lineHeight) {
                                                tallest = item;
                                            }
                                            else if (item.lineHeight > tallest.bounds.height) {
                                                tallest = item;
                                            }
                                        }
                                        else if (item.bounds.height > tallest.bounds.height) {
                                            tallest = item;
                                        }
                                    }
                                    else {
                                        tallest = item;
                                    }
                                }
                            });
                            if (tallest) {
                                rowParent[i] = tallest;
                            }
                        }
                        for (let i = 0; i < rows.length; i++) {
                            const row = rows[i].slice();
                            const parent = rowParent[i];
                            const stringId = i === 0 && rows.length === 1 ? 'true' : (parent ? parent.stringId : '');
                            for (let j = 0, k = 0; j < row.length; j++) {
                                const item = row[j];
                                if (item.inlineVertical || item.supSubscript) {
                                    if (item.stringId !== stringId) {
                                        let anchored = false;
                                        switch (item.verticalAlign) {
                                            case 'text-top':
                                                if (i === 0 && parent) {
                                                    item.anchor('top', parent.stringId);
                                                }
                                                break;
                                            case 'super':
                                            case 'top':
                                                if (i === 0 || stringId) {
                                                    item.anchor('top', i === 0 ? 'true' : stringId);
                                                    anchored = true;
                                                }
                                                break;
                                            case 'middle':
                                                if (stringId === 'true') {
                                                    item.anchor('centerVertical', 'true');
                                                    anchored = true;
                                                }
                                                else if (parent) {
                                                    const itemHeight = Math.max(item.bounds.height, item.lineHeight);
                                                    const parentHeight = Math.max(parent.bounds.height, parent.lineHeight);
                                                    if (itemHeight < parentHeight) {
                                                        item.anchor('top', stringId);
                                                        item.modifyBox($enum.BOX_STANDARD.MARGIN_TOP, Math.round((parentHeight - itemHeight) / 2));
                                                        anchored = true;
                                                    }
                                                }
                                                break;
                                            case 'text-top':
                                                if (i === 0 && parent) {
                                                    item.anchor('bottom', parent.stringId);
                                                }
                                                break;
                                            case 'sub':
                                            case 'bottom':
                                                if (stringId) {
                                                    item.anchor('bottom', stringId);
                                                    anchored = true;
                                                }
                                                break;
                                            default:
                                                switch (item.tagName) {
                                                    case 'SUP':
                                                        item.anchor('top', i === 0 ? 'true' : stringId);
                                                        anchored = true;
                                                        break;
                                                    case 'SUB':
                                                        item.anchor('bottom', stringId);
                                                        anchored = true;
                                                        break;
                                                }
                                        }
                                        if (anchored) {
                                            rows[i].splice(j - k, 1);
                                            k++;
                                        }
                                    }
                                }
                            }
                        }
                        rows.forEach(row => {
                            const nodes = row.filter(item => !item.floating && !item.tableElement && !item.alignParent('centerVertical') && (item.length === 0 || item.every(child => child.baseline)));
                            if (nodes.length > 0) {
                                const baseline = adjustBaseline(nodes);
                                if (baseline && (node.lineHeight > 0 || baseline.lineHeight > 0)) {
                                    const offset = Math.max(node.lineHeight, baseline.lineHeight) - baseline.actualHeight;
                                    if (offset > 0) {
                                        baseline.modifyBox($enum.BOX_STANDARD.MARGIN_TOP, Math.floor(offset / 2));
                                        baseline.modifyBox($enum.BOX_STANDARD.MARGIN_BOTTOM, Math.ceil(offset / 2));
                                    }
                                }
                            }
                        });
                        if (settings.ellipsisOnTextOverflow) {
                            const widthParent = !node.ascend().some(parent => parent.hasWidth);
                            if (!node.ascend(true).some(item => item.is($enum.NODE_CONTAINER.GRID)) && (rows.length === 1 || node.hasAlign($enum.NODE_ALIGNMENT.HORIZONTAL | $enum.NODE_ALIGNMENT.FLOAT))) {
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
                            const right = item.toInt('right');
                            const bottom = item.toInt('bottom');
                            if (item.right !== null && right >= 0) {
                                item.anchor('right', 'parent');
                                item.modifyBox($enum.BOX_STANDARD.MARGIN_RIGHT, right);
                                if (item.toInt('left') > 0) {
                                    item.anchor('left', 'parent');
                                    item.modifyBox($enum.BOX_STANDARD.MARGIN_LEFT, item.toInt('left'));
                                }
                                resetPadding = true;
                            }
                            if (item.left !== null && item.toInt('left') === 0) {
                                item.anchor('left', 'parent');
                                if (right > 0) {
                                    item.anchor('right', 'parent');
                                    item.modifyBox($enum.BOX_STANDARD.MARGIN_RIGHT, right);
                                }
                                resetPadding = true;
                            }
                            if (item.top !== null && item.toInt('top') === 0) {
                                item.anchor('top', 'parent');
                                resetPadding = true;
                            }
                            if (item.bottom !== null && bottom >= 0) {
                                item.anchor('bottom', 'parent');
                                item.modifyBox($enum.BOX_STANDARD.MARGIN_BOTTOM, bottom);
                                resetPadding = true;
                            }
                            if (item.left === 0 && item.right === 0 && !item.hasWidth) {
                                item.android('layout_width', 'match_parent');
                            }
                            if (item.top === 0 && item.bottom === 0 && !item.hasHeight) {
                                item.android('layout_height', 'match_parent');
                            }
                            item.positioned = true;
                        }
                        if (node.layoutHorizontal) {
                            const tallest = children.slice().sort((a, b) => {
                                const heightA = a.bounds.height + a.marginTop;
                                const heightB = b.bounds.height + b.marginTop;
                                if (heightA === heightB) {
                                    return !a.baseline && b.baseline ? 1 : -1;
                                }
                                else {
                                    return heightA > heightB ? -1 : 1;
                                }
                            })[0];
                            const baseline: T | undefined = $NodeList.textBaseline(children)[0];
                            const rightflow = node.hasAlign($enum.NODE_ALIGNMENT.RIGHT);
                            const adjustable: number[] = [];
                            tallest.anchor('top', 'parent');
                            for (let i = 0; i < children.length; i++) {
                                const item = children[i];
                                const previous = children[i - 1];
                                if (i === 0) {
                                    item.anchor(rightflow ? 'right' : 'left', 'parent');
                                }
                                else if (previous) {
                                    if (rightflow) {
                                        item.anchor('rightLeft', previous.stringId);
                                        previous.constraint.marginHorizontal = item.stringId;
                                    }
                                    else {
                                        item.anchor('leftRight', previous.stringId);
                                        item.constraint.marginHorizontal = previous.stringId;
                                    }
                                }
                                if (item === baseline || !item.inlineVertical) {
                                    continue;
                                }
                                let verticalAlign = item.verticalAlign;
                                if (item.tagName === 'TEXTAREA' && verticalAlign === 'baseline') {
                                    verticalAlign = 'text-bottom';
                                }
                                switch (verticalAlign) {
                                    case 'text-top':
                                        item.anchor('top', baseline ? baseline.stringId : 'parent');
                                        break;
                                    case 'super':
                                    case 'top':
                                        item.anchor('top', 'parent');
                                        break;
                                    case 'middle':
                                        item.anchorParent(AXIS_ANDROID.VERTICAL);
                                        break;
                                    case 'text-bottom':
                                        item.anchor('bottom', baseline ? baseline.stringId : 'parent');
                                        break;
                                    case 'sub':
                                    case 'bottom':
                                        item.anchor('bottom', 'parent');
                                        break;
                                    default:
                                        if (baseline && (verticalAlign === 'baseline' || $util.isUnit(verticalAlign))) {
                                            item.anchor('baseline', baseline.stringId);
                                            adjustable.push(item.toInt('verticalAlign'));
                                        }
                                        break;
                                }
                            }
                            applyVerticalAlign(baseline, adjustable);
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
                                connected.forEach(segment => {
                                    const first = segment[0];
                                    const last = segment[segment.length - 1];
                                    first.anchor(horizontal ? 'left' : 'top', 'parent');
                                    last.anchor(horizontal ? 'right' : 'bottom', 'parent');
                                    for (let i = 0; i < segment.length; i++) {
                                        const chain = segment[i];
                                        const previous: T | undefined = segment[i - 1];
                                        const next: T | undefined = segment[i + 1];
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
                            const chainHorizontal = $NodeList.partitionRows(pageflow);
                            if (chainHorizontal.length > 1) {
                                node.alignmentType |= $enum.NODE_ALIGNMENT.MULTILINE;
                            }
                            for (const item of pageflow) {
                                const parent = documentParent || item.documentParent;
                                if (item.rightAligned) {
                                    if ($util.withinFraction(item.linear.right, parent.box.right) || item.linear.right > parent.box.right) {
                                        item.anchor('right', 'parent');
                                    }
                                }
                                else if ($util.withinFraction(item.linear.left, parent.box.left) || item.linear.left < parent.box.left) {
                                    item.anchor('left', 'parent');
                                }
                                if ($util.withinFraction(item.linear.top, parent.box.top) || item.linear.top < parent.box.top) {
                                    item.anchor('top', 'parent');
                                }
                                if (this.withinParentBottom(item.linear.bottom, parent.box.bottom)) {
                                    item.anchor('bottom', 'parent');
                                }
                            }
                            if (node.hasAlign($enum.NODE_ALIGNMENT.FLOAT)) {
                                const floatRight = node.hasAlign($enum.NODE_ALIGNMENT.RIGHT);
                                chainHorizontal.forEach(segment => {
                                    if (floatRight) {
                                        segment.reverse();
                                    }
                                });
                                if (pageflow.some(item => item.has('width', $enum.CSS_STANDARD.PERCENT))) {
                                    node.android('layout_width', 'match_parent');
                                }
                            }
                            chainHorizontal.forEach((segment, index) => {
                                const rowStart = segment[0];
                                const rowEnd = segment.length > 1 ? segment[segment.length - 1] : null;
                                const chained = rowEnd !== null && rowStart.alignSibling('left') === '' && rowStart.alignSibling('right') === '';
                                if (chained) {
                                    rowStart.app('layout_constraintHorizontal_chainStyle', 'packed');
                                    rowStart.app('layout_constraintHorizontal_bias', node.rightAligned ? '1' : '0');
                                    rowStart.anchor('left', 'parent');
                                    if (rowEnd) {
                                        rowEnd.anchor('right', 'parent');
                                    }
                                }
                                for (let i = 0; i < segment.length; i++) {
                                    const chain = segment[i];
                                    const previous = segment[i - 1];
                                    const next = segment[i + 1];
                                    if (chain.autoMarginHorizontal) {
                                        chain.anchorParent(AXIS_ANDROID.HORIZONTAL);
                                    }
                                    else {
                                        if (previous) {
                                            chain.anchor('leftRight', previous.stringId);
                                            chain.constraint.marginHorizontal = previous.stringId;
                                        }
                                        if (next) {
                                            chain.anchor('rightLeft', next.stringId);
                                        }
                                    }
                                    Controller.dimensionConstraint(chain);
                                    if (index > 0) {
                                        const abovePrevious = $NodeList.partitionAboveBottom(chainHorizontal[index - 1], chain);
                                        if (abovePrevious.length) {
                                            const stringId = abovePrevious[0].stringId;
                                            chain.anchor('topBottom', stringId);
                                            chain.constraint.marginVertical = stringId;
                                        }
                                        else if (i > 0) {
                                            chain.anchor('top', segment[0].stringId);
                                            chain.modifyBox($enum.BOX_STANDARD.MARGIN_TOP, segment[0].marginTop * -1);
                                        }
                                    }
                                    const rowNext = chainHorizontal[index + 1];
                                    if (rowNext) {
                                        for (let j = 0; j < rowNext.length; j++) {
                                            if (chain.intersectY(rowNext[j].linear)) {
                                                chain.anchor('bottomTop', rowNext[j].stringId);
                                                break;
                                            }
                                        }
                                    }
                                    if (index === chainHorizontal.length - 1 && node.groupElement) {
                                        chain.anchor('bottom', 'parent');
                                    }
                                }
                            });
                            Controller.anchorEvaluate(pageflow);
                        }
                        else {
                            for (const item of pageflow) {
                                const parent = documentParent || item.documentParent;
                                if (item.autoMarginHorizontal || (item.inlineStatic && item.cssParent('textAlign', true) === 'center')) {
                                    item.anchorParent(AXIS_ANDROID.HORIZONTAL);
                                }
                                else if (item.rightAligned) {
                                    item.anchor('right', 'parent');
                                }
                                else if ($util.withinFraction(item.linear.left, parent.box.left) || item.linear.left < parent.box.left) {
                                    item.anchor('left', 'parent');
                                }
                                if ($util.withinFraction(item.linear.top, parent.box.top) || item.linear.top < parent.box.top) {
                                    item.anchor('top', 'parent');
                                }
                                if (this.withinParentBottom(item.linear.bottom, parent.box.bottom)) {
                                    item.anchor('bottom', 'parent');
                                }
                            }
                            if (resetPadding && pageflow.length <= 1) {
                                const content: T | undefined = pageflow[0];
                                if (content) {
                                    if (content.alignParent('top')) {
                                        node.resetBox($enum.BOX_STANDARD.PADDING, content, true);
                                        if (this.withinParentBottom(content.linear.bottom, content.documentParent.box.bottom)) {
                                            content.anchor('bottom', 'parent');
                                        }
                                    }
                                }
                                else {
                                    node.resetBox($enum.BOX_STANDARD.PADDING);
                                }
                            }
                        }
                        Controller.anchorEvaluate(pageflow);
                        children.forEach(item => {
                            if (item.pageflow &&
                                item.textElement &&
                                item.multiLine &&
                                !item.hasWidth &&
                                !$dom.hasLineBreak(item.element) &&
                                !children.some(sibling => sibling.alignSibling('rightLeft') === item.stringId))
                            {
                                item.android('layout_width', 'match_parent');
                            }
                            if (!item.anchored) {
                                this.addGuideline(item, node);
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
                                    const elements = $dom.getBetweenElements(previous.groupElement ? (previous.item() as T).element : previous.element, item.element).filter(element => element.tagName === 'BR');
                                    if (elements.length) {
                                        bottom = Math.min(bottom, elements[0].getBoundingClientRect().top + settings.whitespaceVerticalOffset);
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

    public renderNodeGroup(data: $Layout<T>) {
        const [node, parent, containerType, alignmentType] = [data.node, data.parent, data.containerType, data.alignmentType];
        const CONTAINER = $enum.NODE_CONTAINER;
        const options = createAttribute();
        let valid = false;
        switch (containerType) {
            case CONTAINER.FRAME: {
                valid = true;
                break;
            }
            case CONTAINER.RADIO_GROUP:
            case CONTAINER.LINEAR: {
                if ($util.hasBit(data.alignmentType, $enum.NODE_ALIGNMENT.VERTICAL)) {
                    options.android.orientation = AXIS_ANDROID.VERTICAL;
                    valid = true;
                }
                else if ($util.hasBit(data.alignmentType, $enum.NODE_ALIGNMENT.HORIZONTAL)) {
                    options.android.orientation = AXIS_ANDROID.HORIZONTAL;
                    valid = true;
                }
                break;
            }
            case CONTAINER.GRID: {
                options.android.rowCount = data.rowCount ? data.rowCount.toString() : '';
                options.android.columnCount = data.columnCount ? data.columnCount.toString() : '2',
                valid = true;
                break;
            }
            case CONTAINER.RELATIVE:
            case CONTAINER.CONSTRAINT: {
                valid = true;
                break;
            }
        }
        if (valid) {
            node.alignmentType |= alignmentType;
            const controlName = View.getControlName(containerType);
            node.setControlType(controlName, containerType);
            const target = $util.hasValue(node.dataset.target) && !$util.hasValue(node.dataset.include);
            let preXml = '';
            let postXml = '';
            if (node.overflowX || node.overflowY) {
                const overflow: string[] = [];
                if (node.overflowX && node.overflowY) {
                    overflow.push(CONTAINER_ANDROID.SCROLL_HORIZONTAL, CONTAINER_ANDROID.SCROLL_VERTICAL);
                }
                else {
                    if (node.overflowX) {
                        overflow.push(CONTAINER_ANDROID.SCROLL_HORIZONTAL);
                    }
                    if (node.overflowY) {
                        overflow.push(CONTAINER_ANDROID.SCROLL_VERTICAL);
                    }
                }
                let previous: T | undefined;
                const scrollView = overflow.map((value, index) => {
                    const container = new View(this.cache.nextId, index === 0 ? node.element : undefined, this.delegateNodeInit) as T;
                    container.tagName = node.tagName;
                    container.setControlType(value);
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
                if (previous) {
                    node.overflow = 0;
                    node.parent = previous;
                    node.resetBox($enum.BOX_STANDARD.MARGIN);
                    node.exclude({ resource: $enum.NODE_RESOURCE.BOX_STYLE });
                    node.render(previous);
                }
            }
            else {
                node.render(target ? node : parent);
            }
            node.apply(options);
            return $xml.getEnclosingTag(controlName, node.id, target ? -1 : node.renderDepth, $xml.formatPlaceholder(node.id), preXml, postXml);
        }
        return '';
    }

    public renderNode(data: $Layout<T>) {
        const [node, parent, containerType, alignmentType] = [data.node, data.parent, data.containerType, data.alignmentType];
        node.alignmentType |= alignmentType;
        const controlName = View.getControlName(containerType);
        node.setControlType(controlName, containerType);
        const target = $util.hasValue(node.dataset.target) && !$util.hasValue(node.dataset.include);
        switch (node.element.tagName) {
            case 'IMG': {
                if (!node.hasBit('excludeResource', $enum.NODE_RESOURCE.IMAGE_SOURCE)) {
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
                            container.setControlType(CONTAINER_ANDROID.FRAME, $enum.NODE_CONTAINER.FRAME);
                            container.init();
                            container.inherit(node, 'base');
                            container.exclude({ procedure: $enum.NODE_PROCEDURE.ALL, resource: $enum.NODE_RESOURCE.ALL });
                            parent.replaceNode(node, container);
                            this.cache.append(container);
                            if (width > 0) {
                                container.android('layout_width', width < parent.box.width ? $util.formatPX(width) : 'match_parent');
                            }
                            if (height > 0) {
                                container.android('layout_height', height < parent.box.height ? $util.formatPX(height) : 'match_parent');
                            }
                            container.render(target ? container : parent);
                            node.render(container);
                            return $xml.getEnclosingTag(CONTAINER_ANDROID.FRAME, container.id, target ? -1 : container.renderDepth, $xml.getEnclosingTag(controlName, node.id, target ? 0 : node.renderDepth));
                        }
                    }
                    else if (node.baseline) {
                        node.android('baselineAlignBottom', 'true');
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
                        const children = parent.map(item => {
                            if (item.renderAs) {
                                item = item.renderAs;
                            }
                            const input = <HTMLInputElement> item.element;
                            if (input.type === 'radio' && input.name === element.name && !item.rendered) {
                                return item;
                            }
                            return null;
                        }).filter(item => item) as T[];
                        if (children.length > 1) {
                            const container = this.createNodeGroup(node, parent, children);
                            container.alignmentType |= $enum.NODE_ALIGNMENT.HORIZONTAL | (parent.length !== children.length ? $enum.NODE_ALIGNMENT.SEGMENTED : 0);
                            container.setControlType(CONTAINER_ANDROID.RADIO_GROUP, $enum.NODE_CONTAINER.RADIO_GROUP);
                            container.inherit(node, 'alignment');
                            container.render(target ? container : parent);
                            let xml = '';
                            container.each((item: T) => {
                                if (item !== node) {
                                    item.alignmentType |= alignmentType;
                                    item.setControlType(controlName, containerType);
                                }
                                if ((<HTMLInputElement> item.element).checked) {
                                    container.android('checkedButton', item.stringId);
                                }
                                item.render(container);
                                xml += $xml.getEnclosingTag(controlName, item.id, target ? 0 : item.renderDepth);
                            });
                            container.android('orientation', $NodeList.linearX(children) ? AXIS_ANDROID.HORIZONTAL : AXIS_ANDROID.VERTICAL);
                            return $xml.getEnclosingTag(CONTAINER_ANDROID.RADIO_GROUP, container.id, target ? -1 : container.renderDepth, xml);
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
        if (node.element.tagName === 'SUB' || (node.inlineVertical && node.verticalAlign === 'sub')) {
            if (!node.hasHeight) {
                node.css('height', $util.formatPX(node.bounds.height + Math.ceil(node.fontSize / this.localSettings.relative.subscriptFontScale)));
                if (node.inlineStatic) {
                    node.css('display', 'inline-block');
                }
            }
        }
        else if (node.element.tagName === 'SUP' || (node.inlineVertical && node.verticalAlign === 'super')) {
            node.modifyBox($enum.BOX_STANDARD.MARGIN_TOP, Math.ceil(node.fontSize / this.localSettings.relative.superscriptFontScale));
        }
        switch (node.controlName) {
            case CONTAINER_ANDROID.TEXT:
                const scrollbars: string[] = [];
                if (node.overflowX) {
                    scrollbars.push(AXIS_ANDROID.HORIZONTAL);
                }
                if (node.overflowY) {
                    scrollbars.push(AXIS_ANDROID.VERTICAL);
                }
                if (scrollbars.length) {
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
            case CONTAINER_ANDROID.LINE:
                if (!node.hasHeight) {
                    node.android('layout_height', $util.formatPX($Node.getContentBoxHeight(node) || 1));
                }
                break;
        }
        node.render(target ? node : parent);
        return $xml.getEnclosingTag(controlName, node.id, target ? -1 : node.renderDepth);
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
        if (node.containerType === 0 || !node.controlName) {
            node.setControlType(controlName);
        }
        let output = $xml.getEnclosingTag(controlName, node.id, !node.documentRoot && depth === 0 ? -1 : depth, children ? $xml.formatPlaceholder(node.id) : '');
        if (this.userSettings.showAttributes && node.id === 0) {
            const indent = $util.repeat(renderDepth + 1);
            const attrs = node.combine().map(value => `\n${indent + value}`).join('');
            output = output.replace($xml.formatPlaceholder(node.id, '@'), attrs);
        }
        options.stringId = node.stringId;
        return output;
    }

    public renderSpace(depth: number, width: string, height = '', columnSpan = 0, rowSpan = 0) {
        let percentWidth = '';
        let percentHeight = '';
        if ($util.isPercent(width)) {
            percentWidth = (parseInt(width) / 100).toFixed(2);
            width = '0px';
        }
        if ($util.isPercent(height)) {
            percentHeight = (parseInt(height) / 100).toFixed(2);
            height = '0px';
        }
        const options = createAttribute();
        if (columnSpan > 0) {
            options.android.layout_columnWeight = percentWidth,
            options.android.layout_columnSpan = columnSpan.toString();
        }
        if (rowSpan > 0) {
            options.android.layout_rowWeight = percentHeight,
            options.android.layout_rowSpan = rowSpan.toString();
        }
        return this.renderNodeStatic(CONTAINER_ANDROID.SPACE, depth, options, width, $util.hasValue(height) ? height : 'wrap_content');
    }

    public addGuideline(node: T, parent: T, orientation = '', percent = false, opposite = false) {
        if (node.dataset.constraintPercent === 'true') {
            percent = true;
        }
        if (node.dataset.constraintOpposite === 'true') {
            opposite = true;
        }
        const documentParent = parent.groupElement ? parent : node.documentParent;
        const beginPercent = `layout_constraintGuide_${percent ? 'percent' : 'begin'}`;
        [AXIS_ANDROID.HORIZONTAL, AXIS_ANDROID.VERTICAL].forEach((value, index) => {
            if (!node.constraint[value] && (orientation === '' || value === orientation)) {
                const horizontal = index === 0;
                let LT = '';
                let RB = '';
                let LTRB = '';
                let RBLT = '';
                let offset = 0;
                if (horizontal) {
                    LT = !opposite ? 'left' : 'right';
                    RB = !opposite ? 'right' : 'left';
                    LTRB = !opposite ? 'leftRight' : 'rightLeft';
                    RBLT = !opposite ? 'rightLeft' : 'leftRight';
                    if (node.positionRelative && node.toInt('left') < 0) {
                        offset = node.toInt('left');
                    }
                }
                else {
                    LT = !opposite ? 'top' : 'bottom';
                    RB = !opposite ? 'bottom' : 'top';
                    LTRB = !opposite ? 'topBottom' : 'bottomTop';
                    RBLT = !opposite ? 'bottomTop' : 'topBottom';
                    if (node.positionRelative && node.toInt('top') < 0) {
                        offset = node.toInt('top');
                    }
                }
                const dimension = !node.pageflow || (node.positionRelative && !node.alignOrigin) ? 'linear' : 'bounds';
                const position = percent ? Math.abs((node[dimension][LT] + offset) - (documentParent.documentBody ? 0 : documentParent.box[LT])) / documentParent.box[horizontal ? 'width' : 'height'] : 0;
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
                                node.anchor(!horizontal && node.textElement && node.baseline && item.textElement && item.baseline ? 'baseline' : LT, item.stringId, true);
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
                                           : (node[dimension][LT] + offset) - (documentParent.documentBody ? 0 : documentParent.box[!opposite ? LT : RB]);
                    if (!node.pageflow) {
                        const actualParent = node.actualParent;
                        if (horizontal) {
                            if (node.left !== null && documentParent === actualParent && documentParent.every(item => !item.pageflow)) {
                                location += actualParent.paddingLeft;
                            }
                            if (documentParent.documentBody) {
                                location -= documentParent.paddingLeft;
                            }
                        }
                        else {
                            if (node.top !== null && documentParent === actualParent && documentParent.every(item => !item.pageflow)) {
                                location += actualParent.paddingTop;
                            }
                            if (documentParent.documentBody) {
                                location -= documentParent.paddingTop;
                            }
                        }
                    }
                    else {
                        if (node.inlineVertical) {
                            const verticalAlign = node.toInt('verticalAlign');
                            if (verticalAlign < 0) {
                                location += verticalAlign;
                            }
                        }
                    }
                    if (location <= 0) {
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
                                    CONTAINER_ANDROID.GUIDELINE,
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

    public createNodeGroup(node: T, parent: T, children: T[]) {
        const group = new ViewGroup(this.cache.nextId, node, parent, children, this.delegateNodeInit) as T;
        this.cache.append(group);
        return group;
    }

    private getNodeByStringId(id: string) {
        return this.cache.find('stringId', id) || null;
    }

    private withinParentBottom(bottom: number, boxBottom: number) {
        return bottom + this.localSettings.constraint.withinParentBottomOffset >= boxBottom;
    }

    public get delegateNodeInit(): SelfWrapped<T, void> {
        const settings = this.userSettings;
        return (self: T) => {
            self.localSettings = {
                targetAPI: settings.targetAPI !== undefined ? settings.targetAPI : 26,
                resolutionDPI: settings.resolutionDPI !== undefined ? settings.resolutionDPI : 160,
                supportRTL: settings.supportRTL !== undefined ? settings.supportRTL : true,
                autoSizePaddingAndBorderWidth: settings.autoSizePaddingAndBorderWidth !== undefined ? settings.autoSizePaddingAndBorderWidth : true,
                constraintPercentAccuracy: this.localSettings.constraint.percentAccuracy,
                customizationsOverwritePrivilege: settings.customizationsOverwritePrivilege !== undefined ? settings.customizationsOverwritePrivilege : true
            };
        };
    }
}