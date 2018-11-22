import { SettingsAndroid } from './types/module';

import { AXIS_ANDROID, BOX_ANDROID, CONTAINER_ANDROID, WEBVIEW_ANDROID, XMLNS_ANDROID } from './lib/constant';

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
        const textBaseline = $NodeList.textBaseline(nodes.filter(item => (item.baseline || $util.isUnit(item.verticalAlign)) && (item.length === 0 || !item.some(child => child.supSubscript))));
        if (textBaseline.length) {
            const optimal = textBaseline[0];
            const images: T[] = [];
            let exclude: T | undefined;
            for (const node of nodes) {
                if (node !== optimal && !node.alignParent('top') && !node.alignParent('bottom') && !node.alignParent('centerVertical')) {
                    if (node.domElement || (node.layoutHorizontal && node.renderChildren.some(item => item.textElement))) {
                        if (node.imageElement && !optimal.imageElement) {
                            images.push(node);
                        }
                        else if (optimal.position === 'relative' && node.bounds.height < optimal.bounds.height && node.lineHeight === 0) {
                            node.anchor(optimal.bottom !== null ? 'bottom' : 'top', optimal.stringId);
                        }
                        else if ((node.top === null || node.top === 0) && (node.bottom === null || node.bottom === 0)) {
                            node.anchor(node.imageElement || node.is($enum.NODE_CONTAINER.BUTTON) ? 'bottom' : 'baseline', optimal.stringId);
                        }
                    }
                    if (optimal.imageElement && (!exclude || node.bounds.height > exclude.bounds.height)) {
                        exclude = node;
                    }
                }
            }
            if (images.length) {
                images.sort((a, b) => a.bounds.height <= b.bounds.height ? 1 : -1);
                for (let i = 0; i < images.length; i++) {
                    if (i === 0) {
                        optimal.anchor('bottom', images[i].stringId);
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
                else if (exclude.bounds.height > optimal.bounds.height) {
                    exclude.anchorDelete('bottom');
                }
                else {
                    exclude = undefined;
                }
                if (exclude) {
                    optimal.anchor('bottom', exclude.stringId);
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

function constraintPercentValue<T extends View>(node: T, dimension: string, value: string, requirePX: boolean) {
    if ($util.isPercent(value)) {
        if (requirePX) {
            node.android(`layout_${dimension.toLowerCase()}`, node.convertPercent(value, dimension === 'Width', true));
        }
        else {
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
            value.content = replaceUnit(value.content, this.settings);
            value.content = replaceTab(value.content, this.settings);
            value.content = $xml.removePlaceholderAll(value.content).replace(/\n\n/g, '\n');
        }
    }

    public checkConstraintFloat(parent: T, nodes: T[], floated?: Set<string>, cleared?: Map<T, string>, linearX?: boolean) {
        if (floated === undefined) {
            floated = $NodeList.floated(nodes);
        }
        if (linearX === undefined) {
            linearX = $NodeList.linearX(nodes);
        }
        return floated.size === 1 && nodes.every(node => node.floating) && (!linearX || nodes.some(node => node.has('width', $enum.CSS_STANDARD.PERCENT)));
    }

    public checkConstraintHorizontal(parent: T, nodes: T[]) {
        const hasHeight = parent.hasHeight;
        return nodes.some(node => {
            const value = node.verticalAlign;
            return (value === 'text-top' || value === 'text-bottom' || (!hasHeight && value === 'bottom'));
        });
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
        const lineBreak = nodes.some(node => !node.floating) && $dom.getBetweenElements(nodes[0].element, nodes[nodes.length - 1].element).filter(element => element.tagName === 'BR').length > 0;
        return !lineBreak && (
            floated.has('right') ||
            cleared.size > 0 ||
            nodes.filter(node => node.autoMargin).length > 0 ||
            (!linearX && nodes.some(node => !node.inlineElement))
        );
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
        const [floating, pageflow] = $util.partition(nodes, node => node.floating);
        const flowIndex = pageflow.length ? Math.min.apply(null, pageflow.map(node => node.siblingIndex)) : Number.MAX_VALUE;
        const floatIndex = floating.length ? Math.max.apply(null, floating.map(node => node.siblingIndex)) : -1;
        if (nodes.some(node => node.autoMarginHorizontal) || (linearX && nodes.some(node => node.toInt('verticalAlign') !== 0))) {
            return false;
        }
        else if (floated.size === 1 && floating.length === nodes.length) {
            return !(linearX && cleared.size === 0);
        }
        return (
            !floated.has('right') &&
            cleared.size === 0 &&
            (pageflow.length === 0 || floating.length === 0 || floatIndex < flowIndex) && (
                nodes.some(node => (node.baseline && (node.textElement || node.imageElement || node.svgElement)) || (node.plainText && node.multiLine) || node.supSubscript) ||
                (!linearX && nodes.every(node => node.inlineElement))
            )
        );
    }

    public setConstraints() {
        for (const node of this.cache.visible) {
            if (!node.hasBit('excludeProcedure', $enum.NODE_PROCEDURE.CONSTRAINT)) {
                const children = node.renderChildren.filter(item => !item.positioned) as T[];
                if (children.length) {
                    if (node.layoutRelative) {
                        let boxWidth = node.box.width;
                        if (node.renderParent.overflowX) {
                            boxWidth = node.viewWidth || boxWidth || node.renderParent.toInt('width', true);
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
                        const noWrap = node.css('whiteSpace') === 'nowrap';
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
                            const alignParent = current.float === 'right' ? 'right' : 'left';
                            let alignSibling = current.float === 'right' ? 'rightLeft' : 'leftRight';
                            if (i === 0) {
                                current.anchor(alignParent, 'true');
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
                                const siblings = $dom.getBetweenElements(previous.element, current.element, false, true);
                                const viewGroup = current.groupElement && !current.hasAlign($enum.NODE_ALIGNMENT.SEGMENTED);
                                const previousSibling = current.previousSibling();
                                const baseWidth = rowWidth + current.marginLeft + dimension.width - (edgeOrFirefox ? current.borderRightWidth : 0);
                                let connected = false;
                                if (i === 1 && previous.textElement && current.textElement) {
                                    connected = siblings.length === 0 && !/\s+$/.test(previous.textContent) && !/^\s+/.test(current.textContent);
                                }
                                if (current.float === 'left' && previous.float === 'left') {
                                    if (previous.marginRight < 0) {
                                        const right = Math.abs(previous.marginRight);
                                        current.modifyBox($enum.BOX_STANDARD.MARGIN_LEFT, (previous.bounds.width + (previous.hasWidth ? previous.paddingLeft + previous.borderLeftWidth : 0)) - right);
                                        current.anchor('left', previous.stringId);
                                        previous.modifyBox($enum.BOX_STANDARD.MARGIN_RIGHT, null);
                                        alignSibling = '';
                                    }
                                }
                                else if (current.float === 'right' && previous.float === 'right') {
                                    if (previous.marginLeft < 0) {
                                        const left = Math.abs(previous.marginLeft);
                                        if (left < previous.bounds.width) {
                                            current.modifyBox($enum.BOX_STANDARD.MARGIN_RIGHT, previous.bounds.width - left);
                                        }
                                        current.anchor('right', previous.stringId);
                                        previous.modifyBox($enum.BOX_STANDARD.MARGIN_LEFT, null);
                                        alignSibling = '';
                                    }
                                }
                                if (!noWrap &&
                                    !connected &&
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
                                        (siblings.length && siblings.some(element => $dom.isLineBreak(element))) ||
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
                                        current.anchor(alignSibling, rowPreviousLeft.stringId);
                                    }
                                    else {
                                        current.anchor(alignParent, 'true');
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
                                    node.alignmentType |= $enum.NODE_ALIGNMENT.MULTILINE;
                                    rowWidth = 0;
                                    baseline.push([]);
                                    rows.push([current]);
                                }
                                else {
                                    if (i === 1 && rowPaddingLeft > 0 && !previous.plainText) {
                                        current.anchor(alignParent, 'true');
                                        current.modifyBox($enum.BOX_STANDARD.PADDING_LEFT, rowPaddingLeft);
                                    }
                                    else if (alignSibling !== '') {
                                        current.anchor(alignSibling, previous.stringId);
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
                        if (!node.hasAlign($enum.NODE_ALIGNMENT.MULTILINE)) {
                            if (node.marginTop < 0 && children[0].position === 'relative') {
                                rows[0].forEach((item, index) => item.modifyBox($enum.BOX_STANDARD.MARGIN_TOP, node.marginTop * (index === 0 ? 1 : -1)));
                            }
                            rows[0].forEach(item => {
                                switch (item.verticalAlign) {
                                    case 'super':
                                    case 'top':
                                        item.anchor('top', 'true');
                                        break;
                                    case 'middle':
                                        item.anchor('centerVertical', 'true');
                                        rows[0].forEach(sibling => item !== sibling && sibling.bounds.height <= item.actualHeight && sibling.anchor('centerVertical', 'true'));
                                        break;
                                    case 'sub':
                                    case 'bottom':
                                        if (!node.hasHeight) {
                                            node.css('height', $util.formatPX(node.bounds.height));
                                        }
                                        item.anchor('bottom', 'true');
                                        break;
                                    default:
                                        switch (item.tagName) {
                                            case 'SUP':
                                                item.anchor('top', 'true');
                                                break;
                                            case 'SUB':
                                                if (!node.hasHeight) {
                                                    node.css('height', $util.formatPX(node.bounds.height));
                                                }
                                                item.anchor('bottom', 'true');
                                                break;

                                        }
                                }
                            });
                        }
                        baseline.forEach(item => adjustBaseline(item));
                        if (this.settings.ellipsisOnTextOverflow) {
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
                            if (item.left === 0 && item.right === 0 && !item.hasWidth) {
                                item.android('layout_width', 'match_parent');
                            }
                            if (item.top === 0 && item.bottom === 0 && !item.hasHeight) {
                                item.android('layout_height', 'match_parent');
                            }
                            item.positioned = true;
                        }
                        if (node.layoutHorizontal) {
                            function boundsHeight(a: T, b: T) {
                                return a.bounds.height <= b.bounds.height ? 1 : -1;
                            }
                            const optimal = $NodeList.textBaseline(children)[0];
                            const baseline = children.filter(item => item.textElement && item.baseline).sort(boundsHeight);
                            const images = children.filter(item => item.imageElement && item.baseline).sort(boundsHeight);
                            if (images.length) {
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
                                let verticalAlign = current.verticalAlign;
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
                                        children.slice().sort((a, b) => a.containerType >= b.containerType ? 1 : -1).some(item => {
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
                                    case 'super':
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
                                    case 'sub':
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
                                chainHorizontal.forEach((segment, index) => {
                                    const first = segment[0];
                                    if (right) {
                                        segment.reverse();
                                    }
                                    if (index > 0 && (segment.length === 1 || !segment.some(item => item.alignParent('left') || item.alignParent('right')))) {
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
                            chainHorizontal.forEach((segment, level) => {
                                const first = segment[0];
                                const last = segment.length > 1 ? segment[segment.length - 1] : null;
                                const chained = !!last && first.alignSibling('left') === '' && first.alignSibling('right') === '';
                                if (chained) {
                                    first.app('layout_constraintHorizontal_chainStyle', 'packed');
                                    first.app('layout_constraintHorizontal_bias', node.rightAligned ? '1' : '0');
                                    first.anchor('left', 'parent');
                                    if (last) {
                                        last.anchor('right', 'parent');
                                    }
                                }
                                for (let i = 0; i < segment.length; i++) {
                                    const chain = segment[i];
                                    if (chain.autoMarginHorizontal) {
                                        chain.anchorParent(AXIS_ANDROID.HORIZONTAL);
                                    }
                                    else {
                                        const previous = segment[i - 1];
                                        const next = segment[i + 1];
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
                                            if (abovePrevious.length) {
                                                const stringId = abovePrevious[0].stringId;
                                                chain.anchor('topBottom', stringId);
                                                chain.constraint.marginVertical = stringId;
                                            }
                                            else {
                                                for (const item of segment) {
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
                        }
                        else {
                            for (const current of pageflow) {
                                const parent = documentParent || current.documentParent;
                                if (current.autoMarginHorizontal) {
                                    current.anchorParent(AXIS_ANDROID.HORIZONTAL);
                                }
                                else if (current.rightAligned) {
                                    current.anchor('right', 'parent');
                                }
                                else if ($util.withinFraction(current.linear.left, parent.box.left) || current.linear.left < parent.box.left) {
                                    current.anchor('left', 'parent');
                                }
                                if ($util.withinFraction(current.linear.top, parent.box.top) || current.linear.top < parent.box.top) {
                                    current.anchor('top', 'parent');
                                }
                                else if (this.alignParentBottom(current.linear.bottom, parent.box.bottom)) {
                                    current.anchor('bottom', 'parent');
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
                        }
                        for (const item of children) {
                            const top = item.alignParent('top');
                            let right = item.alignParent('right');
                            let bottom = item.alignParent('bottom');
                            const left = item.alignParent('left');
                            if (item.pageflow) {
                                if (absolute.length &&
                                    item.textElement &&
                                    item.multiLine &&
                                    !item.hasWidth &&
                                    !$dom.hasLineBreak(item.element) &&
                                    !children.some(sibling => sibling.alignSibling('rightLeft') === item.stringId))
                                {
                                    item.android('layout_width', 'match_parent');
                                }
                                if ((bottom && item.alignSibling('topBottom') && item.hasHeight) || (top && bottom && this.alignParentBottom(item.linear.bottom, node.box.bottom) && !item.has('marginTop', $enum.CSS_STANDARD.AUTO))) {
                                    item.anchorDelete('bottom');
                                    bottom = false;
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
                                    switch (item.verticalAlign) {
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
                                    item.modifyBox($enum.BOX_STANDARD.MARGIN_RIGHT, Math.max(item.toInt('right'), 0));
                                }
                                if (bottom && item.toInt('bottom') > 0) {
                                    item.modifyBox($enum.BOX_STANDARD.MARGIN_BOTTOM, Math.max(item.toInt('bottom'), 0));
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
                                    const elements = $dom.getBetweenElements(previous.groupElement ? (previous.item() as T).element : previous.element, item.element).filter(element => element.tagName === 'BR');
                                    if (elements.length) {
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

    public renderNodeGroup(data: LayoutData<T>) {
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
                    node.excludeResource |= $enum.NODE_RESOURCE.BOX_STYLE;
                    node.parent = previous;
                    node.resetBox($enum.BOX_STANDARD.MARGIN);
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

    public renderNode(data: LayoutData<T>) {
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
                            container.excludeProcedure |= $enum.NODE_PROCEDURE.ALL;
                            container.excludeResource |= $enum.NODE_RESOURCE.ALL;
                            container.setControlType(CONTAINER_ANDROID.FRAME, $enum.NODE_CONTAINER.FRAME);
                            container.init();
                            container.inherit(node, 'base');
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
                        const children = parent.map(item => {
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
                            container.android('orientation', $NodeList.linearX(children, children.every(item => item.documentParent === children[0].documentParent)) ? AXIS_ANDROID.HORIZONTAL : AXIS_ANDROID.VERTICAL);
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
        if (this.settings.showAttributes && node.id === 0) {
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
                    if (node.position === 'relative' && node.toInt('left') < 0) {
                        offset = node.toInt('left');
                    }
                }
                else {
                    LT = !opposite ? 'top' : 'bottom';
                    RB = !opposite ? 'bottom' : 'top';
                    LTRB = !opposite ? 'topBottom' : 'bottomTop';
                    RBLT = !opposite ? 'bottomTop' : 'topBottom';
                    if (node.position === 'relative' && node.toInt('top') < 0) {
                        offset = node.toInt('top');
                    }
                }
                const dimension = node.pageflow ? 'bounds' : 'linear';
                const position = percent ? Math.abs((node[dimension][LT] + offset) - (parent.documentBody ? 0 : parent.box[LT])) / parent.box[horizontal ? 'width' : 'height'] : 0;
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
                                           : (node[dimension][LT] + offset) - (parent.documentBody ? 0 : parent.box[!opposite ? LT : RB]);
                    if (!node.pageflow) {
                        const actualParent = node.actualParent;
                        if (horizontal) {
                            if (node.left !== null && actualParent.positionStatic) {
                                location += actualParent.paddingLeft;
                            }
                            if (parent.documentBody) {
                                location -= parent.paddingLeft;
                            }
                        }
                        else {
                            if (node.top !== null && actualParent.positionStatic) {
                                location += actualParent.paddingTop;
                            }
                            if (parent.documentBody) {
                                location -= parent.paddingTop;
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