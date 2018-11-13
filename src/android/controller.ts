import { SettingsAndroid } from './types/module';

import { AXIS_ANDROID, BOX_ANDROID, NODE_ANDROID, WEBVIEW_ANDROID, XMLNS_ANDROID } from './lib/constant';

import BASE_TMPL from './template/base';

import Resource from './resource';
import View from './view';
import ViewGroup from './viewgroup';

import { createAttribute, getXmlNs, replaceRTL, replaceTab, replaceUnit, resetId } from './lib/util';

import $NodeList = androme.lib.base.NodeList;

import $color = androme.lib.color;
import $dom = androme.lib.dom;
import $enum = androme.lib.enumeration;
import $util = androme.lib.util;
import $xml = androme.lib.xml;

const LAYOUT_MAP = {
    relativeParent: {
        top: 'layout_alignParentTop',
        bottom: 'layout_alignParentBottom'
    },
    relative: {
        top: 'layout_alignTop',
        bottom: 'layout_alignBottom',
        baseline: 'layout_alignBaseline',
        bottomTop: 'layout_above',
        topBottom: 'layout_below'
    },
    constraint: {
        top: 'layout_constraintTop_toTopOf',
        bottom: 'layout_constraintBottom_toBottomOf',
        baseline: 'layout_constraintBaseline_toBaselineOf',
        bottomTop: 'layout_constraintBottom_toTopOf',
        topBottom: 'layout_constraintTop_toBottomOf'
    }
};

const CHAIN_MAP = {
    leftTop: ['left', 'top'],
    rightBottom: ['right', 'bottom'],
    rightLeftBottomTop: ['rightLeft', 'bottomTop'],
    leftRightTopBottom: ['leftRight', 'topBottom'],
    widthHeight: ['Width', 'Height'],
    horizontalVertical: ['Horizontal', 'Vertical']
};

function setAlignParent(node: View, orientation = '', bias = false) {
    [AXIS_ANDROID.HORIZONTAL, AXIS_ANDROID.VERTICAL].forEach((value, index) => {
        if (!node.constraint[value] && (orientation === '' || value === orientation)) {
            node.app(LAYOUT_MAP.constraint[index === 0 ? 'left' : 'top'], 'parent');
            node.app(LAYOUT_MAP.constraint[index === 0 ? 'right' : 'bottom'], 'parent');
            node.constraint[value] = true;
            if (bias) {
                node.app(`layout_constraint${value.charAt(0).toUpperCase() + value.substring(1)}_bias`, node[`${value}Bias`]);
            }
        }
    });
}

export default class Controller<T extends View> extends androme.lib.base.Controller<T> {
    public static getEnclosingTag(depth: number, controlName: string, id: number, xml = '', preXml = '', postXml = '') {
        const indent = $util.repeat(Math.max(0, depth));
        let output = preXml +
                     `{<${id}}`;
        if (xml !== '') {
            output += indent + `<${controlName}${depth === 0 ? '{#0}' : ''}{@${id}}>\n` +
                               xml +
                      indent + `</${controlName}>\n`;
        }
        else {
            output += indent + `<${controlName}${depth === 0 ? '{#0}' : ''}{@${id}} />\n`;
        }
        output += `{>${id}}` +
                  postXml;
        return output;
    }

    public settings: SettingsAndroid;
    public readonly localSettings: ControllerSettings = {
        includes: true,
        baseTemplate: BASE_TMPL,
        layout: {
            pathName: 'res/layout',
            fileExtension: 'xml'
        },
        inline: {
            always: ['BR'],
            tagName: WEBVIEW_ANDROID,
        },
        unsupported: {
            tagName: new Set(['OPTION', 'MAP', 'AREA', 'svg'])
        }
    };

    private _merge = {};

    public finalize(data: ViewData<$NodeList<T>>) {
        this.setAttributes(data);
        for (const value of [...data.views, ...data.includes]) {
            value.content = replaceUnit(value.content, this.settings);
            value.content = replaceTab(value.content, this.settings);
            value.content = $xml.removePlaceholderAll(value.content).replace(/\n\n/g, '\n');
        }
    }

    public reset() {
        super.reset();
        resetId();
        this._merge = {};
    }

    public setConstraints() {
        const relativeParent = LAYOUT_MAP.relativeParent;
        let layoutMap: StringMap;
        let constraint = false;
        Object.assign(relativeParent, {
            left: replaceRTL('layout_alignParentLeft', this.settings),
            right: replaceRTL('layout_alignParentRight', this.settings)
        });
        Object.assign(LAYOUT_MAP.relative, {
            left: replaceRTL('layout_alignLeft', this.settings),
            right: replaceRTL('layout_alignRight', this.settings),
            leftRight: replaceRTL('layout_toRightOf', this.settings),
            rightLeft: replaceRTL('layout_toLeftOf', this.settings)
        });
        Object.assign(LAYOUT_MAP.constraint, {
            left: replaceRTL('layout_constraintLeft_toLeftOf', this.settings),
            right: replaceRTL('layout_constraintRight_toRightOf', this.settings),
            leftRight: replaceRTL('layout_constraintLeft_toRightOf', this.settings),
            rightLeft: replaceRTL('layout_constraintRight_toLeftOf', this.settings)
        });
        function mapParent(node: T, direction: string) {
            if (constraint) {
                return node.app(layoutMap[direction]) === 'parent';
            }
            else {
                return node.android(relativeParent[direction]) === 'true';
            }
        }
        function mapSibling(node: T, direction: string) {
            return node[constraint ? 'app' : 'android'](layoutMap[direction]);
        }
        function mapAnchored(node: T, nodes: T[], orientation: string) {
            if (!node.constraint[orientation]) {
                const connected: string[] = [];
                let parent: T | undefined = node;
                while (parent && !connected.includes(parent.stringId)) {
                    connected.push(parent.stringId);
                    const stringId = mapSibling(parent, orientation === AXIS_ANDROID.HORIZONTAL ? 'leftRight' : 'topBottom');
                    if (stringId) {
                        parent = nodes.find(item => item.stringId === stringId);
                        if (parent && parent.constraint[orientation]) {
                            return true;
                        }
                    }
                    else {
                        parent = undefined;
                    }
                }
                return false;
            }
            return true;
        }
        function mapDelete(node: T, ...direction: string[]) {
            node.delete(constraint ? 'app' : 'android', ...direction.map(value => layoutMap[value]));
        }
        for (const node of this.cache.visible) {
            const nodes = node.renderChildren.filter(item => !item.positioned) as T[];
            if (nodes.length === 0) {
                continue;
            }
            if (node.layoutRelative) {
                function checkSingleLine(item: T, nowrap = false, flexParent = false) {
                    if (item && item.textElement && (nowrap || flexParent || (!item.hasWidth && !item.multiLine && item.textContent.trim().split(String.fromCharCode(32)).length > 1))) {
                        item.android('singleLine', 'true');
                    }
                }
                function adjustBaseline(siblings: T[]) {
                    if (nodes.length > 1) {
                        const textBaseline = $NodeList.textBaseline(siblings.filter(item => item.baseline && item.toInt('top') === 0 && item.toInt('bottom') === 0));
                        if (textBaseline.length > 0) {
                            const alignWith = textBaseline[0];
                            const images: T[] = [];
                            let baseExcluded: T | undefined;
                            for (const current of siblings) {
                                if (current !== alignWith) {
                                    if (current.baseline && (current.nodeType <= $enum.NODE_STANDARD.INLINE || (current.linearHorizontal && current.renderChildren.some(item => item.baseline && item.nodeType <= $enum.NODE_STANDARD.INLINE)))) {
                                        if (!alignWith.imageElement && current.imageElement) {
                                            images.push(current);
                                        }
                                        else if (current.alignOrigin) {
                                            current.android(LAYOUT_MAP.relative[current.imageElement || current.is($enum.NODE_STANDARD.BUTTON) ? 'bottom' : 'baseline'], alignWith.stringId);
                                        }
                                        else if (alignWith.position === 'relative' && current.bounds.height < alignWith.bounds.height && current.lineHeight === 0) {
                                            current.android(LAYOUT_MAP.relative[$util.convertInt(alignWith.top) > 0 ? 'top' : 'bottom'], alignWith.stringId);
                                        }
                                    }
                                    if (alignWith.imageElement && (!baseExcluded || current.bounds.height > baseExcluded.bounds.height)) {
                                        baseExcluded = current;
                                    }
                                }
                            }
                            if (images.length > 0) {
                                images.sort((a, b) => a.bounds.height <= b.bounds.height ? 1 : -1);
                                for (let i = 0; i < images.length; i++) {
                                    if (i === 0) {
                                        alignWith.android(layoutMap['bottom'], images[i].stringId);
                                    }
                                    else {
                                        images[i].android(layoutMap['bottom'], images[0].stringId);
                                    }
                                }
                                baseExcluded = undefined;
                            }
                            if (baseExcluded) {
                                if (!baseExcluded.imageElement) {
                                    baseExcluded.delete('android', layoutMap['baseline']);
                                }
                                else if (baseExcluded.bounds.height > alignWith.bounds.height) {
                                    baseExcluded.delete('android', layoutMap['bottom']);
                                }
                                else {
                                    baseExcluded = undefined;
                                }
                                if (baseExcluded) {
                                    alignWith.android(layoutMap['bottom'], baseExcluded.stringId);
                                }
                            }
                        }
                    }
                }
                layoutMap = LAYOUT_MAP.relative;
                let boxWidth = node.box.width;
                if (node.renderParent.overflowX) {
                    boxWidth = node.viewWidth || boxWidth || node.renderParent.toInt('width', 0, { map: 'initial' });
                }
                else if (node.renderParent.hasAlign($enum.NODE_ALIGNMENT.FLOAT)) {
                    const minLeft: number = Math.min.apply(null, nodes.map(item => item.linear.left));
                    const maxRight: number = Math.max.apply(null, nodes.map(item => item.linear.right));
                    boxWidth = maxRight - minLeft;
                }
                else {
                    const floatEnd = Math.max.apply(null, node.documentParent.initial.children.filter(item => item.float === 'left' && item.siblingIndex < node.siblingIndex).map(item => item.linear.right));
                    if (nodes.some(item => item.linear.left === floatEnd)) {
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
                const baseline: T[] = [];
                const rangeMultiLine = new Set<T>();
                const cleared = $NodeList.cleared(node.initial.children);
                const noWrap = node.css('whiteSpace') === 'nowrap';
                const edgeOrFirefox = $dom.isUserAgent($enum.USER_AGENT.EDGE | $enum.USER_AGENT.FIREFOX);
                for (let i = 0; i < nodes.length; i++) {
                    const current = nodes[i];
                    const previous = nodes[i - 1];
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
                    const sideParent = relativeParent[current.float === 'right' ? 'right' : 'left'];
                    const sideSibling = layoutMap[current.float === 'right' ? 'rightLeft' : 'leftRight'];
                    if (i === 0) {
                        current.android(sideParent, 'true');
                        if (!node.inline && textIndent > 0) {
                            current.modifyBox($enum.BOX_STANDARD.MARGIN_LEFT, textIndent);
                        }
                        if (!current.siblingflow || (current.floating && current.position === 'relative') || (current.multiLine && textIndent < 0)) {
                            rowPreviousLeft = current;
                        }
                        rows[rows.length] = [current];
                    }
                    else if (previous) {
                        const items = rows[rows.length - 1];
                        const siblings = $dom.getElementsBetweenSiblings(previous.baseElement, current.baseElement, false, true);
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
                            rowPreviousBottom = items.filter(item => !item.floating)[0] || items[0];
                            for (let j = 0; j < items.length; j++) {
                                if (items[j] !== rowPreviousBottom && items[j].linear.bottom > rowPreviousBottom.linear.bottom && (!items[j].floating || (items[j].floating && rowPreviousBottom.floating))) {
                                    rowPreviousBottom = items[j];
                                }
                            }
                            if (viewGroup || (previous.groupElement && i === nodes.length - 1)) {
                                current.constraint.marginVertical = rowPreviousBottom.stringId;
                            }
                            current.anchor(layoutMap['topBottom'], rowPreviousBottom.stringId);
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
                            adjustBaseline(baseline);
                            node.alignmentType ^= $enum.NODE_ALIGNMENT.HORIZONTAL;
                            node.alignmentType |= $enum.NODE_ALIGNMENT.MULTILINE;
                            rowWidth = 0;
                            baseline.length = 0;
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
                                current.anchor(layoutMap['topBottom'], rowPreviousBottom.stringId);
                            }
                            items.push(current);
                        }
                    }
                    rowWidth += dimension.width + current.marginLeft + current.marginRight + (
                                    previous && !previous.floating && !previous.plainText && !previous.preserveWhiteSpace &&
                                    previous.textContent.trim() !== '' && !/\s+$/.test(previous.textContent) &&
                                    !current.floating && !current.plainText && !current.preserveWhiteSpace &&
                                    current.textContent.trim() !== '' && !/^\s+/.test(current.textContent) ? this.settings.whitespaceHorizontalOffset : 0
                                );
                    if (!current.floating) {
                        baseline.push(current);
                    }
                }
                adjustBaseline(baseline);
                if (node.marginTop < 0 && nodes[0].position === 'relative') {
                    rows[0].forEach((item, index) => item.modifyBox($enum.BOX_STANDARD.MARGIN_TOP, node.marginTop * (index === 0 ? 1 : -1), true));
                }
                if (node.baseline && rows.length === 1) {
                    rows[0].forEach(item => {
                        switch (item.css('verticalAlign')) {
                            case 'top':
                                item.anchor(relativeParent['top'], 'true');
                                break;
                            case 'middle':
                                rows[0].forEach(sibling => sibling.bounds.height <= item.bounds.height && sibling.anchor('layout_centerVertical', 'true'));
                                break;
                        }
                    });
                }
                if (this.settings.ellipsisOnTextOverflow) {
                    const widthParent = !node.ascend().some(parent => parent.hasWidth);
                    if (!node.ascend(true).some(item => item.is($enum.NODE_STANDARD.GRID)) && (rows.length === 1 || node.hasAlign($enum.NODE_ALIGNMENT.HORIZONTAL))) {
                        for (let i = 1; i < nodes.length; i++) {
                            const item = nodes[i];
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
            else {
                constraint = node.layoutConstraint;
                if (constraint) {
                    layoutMap = LAYOUT_MAP.constraint;
                    if (node.hasAlign($enum.NODE_ALIGNMENT.HORIZONTAL)) {
                        function boundsHeight(a: T, b: T) {
                            return a.bounds.height <= b.bounds.height ? 1 : -1;
                        }
                        const optimal = $NodeList.textBaseline(nodes)[0];
                        const baseline = nodes.filter(item => item.textElement && item.baseline).sort(boundsHeight);
                        let images = nodes.filter(item => item.imageElement && item.baseline).sort(boundsHeight);
                        if (images.length > 0) {
                            const tallest = images[0];
                            images.forEach((item, index) => index > 0 && item.app(layoutMap['baseline'], tallest.stringId));
                            if (!optimal.imageElement) {
                                optimal.app(layoutMap['bottom'], tallest.stringId);
                            }
                            images = images.filter(item => item !== tallest);
                        }
                        for (let i = 0; i < nodes.length; i++) {
                            const current = nodes[i];
                            const previous = nodes[i - 1];
                            let alignWith: T | undefined = optimal;
                            if (i === 0) {
                                current.app(layoutMap['left'], 'parent');
                            }
                            else if (previous) {
                                current.app(layoutMap['leftRight'], previous.stringId);
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
                                    nodes.slice().sort((a, b) => a.nodeType >= b.nodeType ? 1 : -1).some(item => {
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
                                        current.app(layoutMap['top'], alignWith.stringId);
                                    }
                                    break;
                                case 'top':
                                    current.app(layoutMap['top'], 'parent');
                                    break;
                                case 'middle':
                                    setAlignParent(current, AXIS_ANDROID.VERTICAL);
                                    break;
                                case 'baseline':
                                    if (alignWith) {
                                        current.app(layoutMap['baseline'], alignWith.stringId);
                                    }
                                    break;
                                case 'text-bottom':
                                    if (alignWith) {
                                        current.app(layoutMap['bottom'], alignWith.stringId);
                                    }
                                    break;
                                case 'bottom':
                                    current.app(layoutMap['bottom'], 'parent');
                                    break;
                            }
                        }
                    }
                    else {
                        const flex = node.flex;
                        const [absolute, pageflow] = $util.partition(nodes, item => !item.pageflow || (item.position === 'relative' && item.alignNegative));
                        const percentage = node.hasAlign($enum.NODE_ALIGNMENT.PERCENT);
                        const columnCount = node.toInt('columnCount');
                        if (percentage) {
                            node.android('layout_width', 'match_parent');
                        }
                        else if (columnCount === 0) {
                            for (const current of pageflow) {
                                const parent = node.renderParent.is($enum.NODE_STANDARD.GRID) && !node.styleElement ? node : current.documentParent;
                                if (current.autoMarginHorizontal) {
                                    setAlignParent(current, AXIS_ANDROID.HORIZONTAL);
                                }
                                else {
                                    if (current.linear.left <= parent.box.left || $util.withinFraction(current.linear.left, parent.box.left)) {
                                        current.anchor(layoutMap['left'], 'parent', AXIS_ANDROID.HORIZONTAL);
                                    }
                                    if (current.linear.right >= parent.box.right || $util.withinFraction(current.linear.right, parent.box.right)) {
                                        current.anchor(layoutMap['right'], 'parent', parent.hasWidth || current.float === 'right' || current.autoMarginLeft ? AXIS_ANDROID.HORIZONTAL : '');
                                    }
                                }
                                if (current.linear.top <= parent.box.top || $util.withinFraction(current.linear.top, parent.box.top)) {
                                    current.anchor(layoutMap['top'], 'parent', AXIS_ANDROID.VERTICAL);
                                }
                                else if (current.linear.bottom >= parent.box.bottom || $util.withinFraction(current.linear.bottom, parent.box.bottom)) {
                                    current.anchor(layoutMap['bottom'], 'parent', parent.hasHeight ? AXIS_ANDROID.VERTICAL : '');
                                }
                                for (const adjacent of pageflow) {
                                    if (current !== adjacent) {
                                        const stringId = adjacent.stringId;
                                        const horizontal = mapAnchored(adjacent, nodes, AXIS_ANDROID.HORIZONTAL) ? AXIS_ANDROID.HORIZONTAL : '';
                                        const vertical = mapAnchored(adjacent, nodes, AXIS_ANDROID.VERTICAL) ? AXIS_ANDROID.VERTICAL : '';
                                        const intersectY = current.intersectY(adjacent.linear);
                                        const alignOrigin = current.alignOrigin && adjacent.alignOrigin;
                                        if (!current.hasWidth && current.linear.left === adjacent.linear.left && current.linear.right === adjacent.linear.right) {
                                            if (!mapParent(current, 'right')) {
                                                current.anchor(layoutMap['left'], stringId);
                                            }
                                            if (!mapParent(current, 'left')) {
                                                current.anchor(layoutMap['right'], stringId);
                                            }
                                        }
                                        if ($util.withinFraction(current.linear.left, adjacent.linear.right) || (alignOrigin && $util.withinRange(current.linear.left, adjacent.linear.right, this.settings.whitespaceHorizontalOffset))) {
                                            if (current.float !== 'right' || current.float === adjacent.float) {
                                                current.anchor(layoutMap['leftRight'], stringId, horizontal, current.withinX(adjacent.linear));
                                            }
                                        }
                                        if ($util.withinFraction(current.linear.right, adjacent.linear.left) || (alignOrigin && $util.withinRange(current.linear.right, adjacent.linear.left, this.settings.whitespaceHorizontalOffset))) {
                                            current.anchor(layoutMap['rightLeft'], stringId, horizontal, current.withinX(adjacent.linear));
                                        }
                                        const topParent = mapParent(current, 'top');
                                        const bottomParent = mapParent(current, 'bottom');
                                        const blockElement = !flex.enabled && !current.inlineElement;
                                        if ($util.withinFraction(current.linear.top, adjacent.linear.bottom) || (alignOrigin && intersectY && $util.withinRange(current.linear.top, adjacent.linear.bottom, this.settings.whitespaceVerticalOffset))) {
                                            if (intersectY || !bottomParent || blockElement) {
                                                current.anchor(layoutMap['topBottom'], stringId, vertical, intersectY);
                                            }
                                        }
                                        if ($util.withinFraction(current.linear.bottom, adjacent.linear.top) || (alignOrigin && intersectY && $util.withinRange(current.linear.bottom, adjacent.linear.top, this.settings.whitespaceVerticalOffset))) {
                                            if (intersectY || !topParent || blockElement) {
                                                current.anchor(layoutMap['bottomTop'], stringId, vertical, intersectY);
                                            }
                                        }
                                        if (!topParent && !bottomParent) {
                                            if (current.linear.top === adjacent.linear.top) {
                                                current.anchor(layoutMap['top'], stringId, vertical);
                                            }
                                            if (current.linear.bottom === adjacent.linear.bottom) {
                                                current.anchor(layoutMap['bottom'], stringId, vertical);
                                            }
                                        }
                                    }
                                }
                            }
                            for (const current of pageflow) {
                                const leftRight = mapSibling(current, 'leftRight');
                                if (leftRight) {
                                    if (!current.constraint.horizontal) {
                                        current.constraint.horizontal = flex.enabled || mapAnchored(current, pageflow, AXIS_ANDROID.HORIZONTAL);
                                    }
                                    current.constraint.marginHorizontal = leftRight;
                                }
                                const topBottom = mapSibling(current, 'topBottom');
                                if (topBottom) {
                                    if (!current.constraint.vertical) {
                                        current.constraint.vertical = flex.enabled || mapAnchored(current, pageflow, AXIS_ANDROID.VERTICAL);
                                    }
                                    current.constraint.marginVertical = topBottom;
                                    mapDelete(current, 'top');
                                }
                                if (mapParent(current, 'left') && mapParent(current, 'right')) {
                                    if (current.autoMargin) {
                                        if (current.autoMarginLeft) {
                                            mapDelete(current, 'left');
                                        }
                                        if (current.autoMarginRight) {
                                            mapDelete(current, 'right');
                                        }
                                        if (current.autoMarginHorizontal) {
                                            if (node.hasWidth && !current.has('width', $enum.CSS_STANDARD.PERCENT)) {
                                                current.android('layout_width', 'match_parent');
                                            }
                                            else if (current.inlineElement && !current.hasWidth) {
                                                current.android('layout_width', 'wrap_content');
                                            }
                                        }
                                    }
                                    else if (current.floating) {
                                        mapDelete(current, current.float === 'right' ? 'left' : 'right');
                                    }
                                    else if (current.inlineElement) {
                                        if (current.nodeType <= $enum.NODE_STANDARD.IMAGE) {
                                            switch (current.css('textAlign')) {
                                                case 'center':
                                                    break;
                                                case 'right':
                                                case 'end' :
                                                    mapDelete(current, 'left');
                                                    break;
                                                default:
                                                    mapDelete(current, 'right');
                                                    break;
                                            }
                                        }
                                        else {
                                            mapDelete(current, 'right');
                                        }
                                    }
                                    else {
                                        mapDelete(current, 'right');
                                        current.android('layout_width', 'match_parent');
                                    }
                                }
                                if (mapSibling(current, 'bottomTop')) {
                                    mapDelete(current, 'bottom');
                                }
                                if (current.plainText || (!current.styleElement && current.renderChildren.some(item => item.textElement))) {
                                    const textAlign = current.cssParent('textAlign');
                                    if (textAlign === 'right') {
                                        current.anchor(layoutMap['right'], 'parent', AXIS_ANDROID.HORIZONTAL);
                                        current.constraint.horizontal = true;
                                    }
                                    else if (textAlign === 'center') {
                                        current.constraint.horizontal = false;
                                        setAlignParent(current, AXIS_ANDROID.HORIZONTAL);
                                    }
                                }
                            }
                            for (let i = 0; i < pageflow.length; i++) {
                                const current = pageflow[i];
                                if (!current.anchored) {
                                    const result = $util.searchObject(current.namespace('app'), '*constraint*');
                                    const localizeLeft = current.localizeString('Left');
                                    const localizeRight = current.localizeString('Right');
                                    for (const [key, value] of result) {
                                        if (value !== 'parent' && pageflow.filter(item => item.anchored).find(item => item.stringId === value)) {
                                            if ($util.indexOf(key, localizeLeft, localizeRight) !== -1) {
                                                current.constraint.horizontal = true;
                                            }
                                            if ($util.indexOf(key, 'Top', 'Bottom', 'Baseline', 'above', 'below') !== -1) {
                                                current.constraint.vertical = true;
                                            }
                                        }
                                    }
                                    if (current.anchored) {
                                        i = -1;
                                    }
                                }
                            }
                            let adjustPadding = false;
                            for (const current of absolute) {
                                let alignMarginLeft = false;
                                if (current.right !== null && current.toInt('right') >= 0) {
                                    current.anchor(layoutMap['right'], 'parent', AXIS_ANDROID.HORIZONTAL);
                                    adjustPadding = true;
                                    if (current.toInt('left') > 0) {
                                        current.anchor(layoutMap['left'], 'parent');
                                        current.modifyBox($enum.BOX_STANDARD.MARGIN_LEFT, current.toInt('left'));
                                        alignMarginLeft = true;
                                    }
                                }
                                if (!alignMarginLeft && current.left !== null && current.toInt('left') === 0) {
                                    current.anchor(layoutMap['left'], 'parent', AXIS_ANDROID.HORIZONTAL);
                                    adjustPadding = true;
                                    if (current.toInt('right') > 0) {
                                        current.anchor(layoutMap['right'], 'parent');
                                        current.modifyBox($enum.BOX_STANDARD.MARGIN_RIGHT, current.toInt('right'));
                                    }
                                }
                                if (current.top !== null && current.toInt('top') === 0) {
                                    current.anchor(layoutMap['top'], 'parent', AXIS_ANDROID.VERTICAL);
                                    adjustPadding = true;
                                }
                                if (current.bottom !== null && current.toInt('bottom') >= 0) {
                                    current.anchor(layoutMap['bottom'], 'parent', AXIS_ANDROID.VERTICAL);
                                    adjustPadding = true;
                                }
                                if (current.left === 0 && current.right === 0 && !current.floating && !current.has('width', $enum.CSS_STANDARD.PERCENT)) {
                                    current.android('layout_width', 'match_parent');
                                }
                                if (current.top === 0 && current.bottom === 0) {
                                    current.android('layout_height', 'match_parent');
                                }
                            }
                            if (adjustPadding && pageflow.length <= 1) {
                                node.resetBox($enum.BOX_STANDARD.PADDING, pageflow[0]);
                            }
                        }
                        if (flex.enabled || columnCount > 0 || (!this.settings.constraintChainDisabled && pageflow.length > 1)) {
                            const horizontal: T[][] = [];
                            const vertical: T[][] = [];
                            if (flex.enabled) {
                                if (flex.wrap === 'nowrap') {
                                    switch (flex.direction) {
                                        case 'row-reverse':
                                            const row = pageflow.slice();
                                            row.reverse();
                                            horizontal.push(row);
                                            break;
                                        case 'row':
                                            horizontal.push(pageflow.slice());
                                            break;
                                        case 'column-reverse':
                                            const column = pageflow.slice();
                                            column.reverse();
                                            vertical.push(column);
                                            break;
                                        case 'column':
                                            vertical.push(pageflow.slice());
                                            break;
                                    }
                                }
                                else {
                                    const sorted = pageflow.slice();
                                    const map: ObjectIndex<T[]> = {};
                                    const levels: number[] = [];
                                    function reverseMap() {
                                        for (const y in map) {
                                            map[y].reverse();
                                        }
                                    }
                                    switch (flex.direction) {
                                        case 'row-reverse':
                                        case 'column-reverse':
                                            sorted.reverse();
                                            break;
                                    }
                                    for (const item of sorted) {
                                        const y = item.linear.top;
                                        if (map[y] === undefined) {
                                            map[y] = [];
                                            levels.push(y);
                                        }
                                        map[y].push(item);
                                    }
                                    switch (flex.wrap) {
                                        case 'wrap':
                                            if (flex.direction === 'column-reverse') {
                                                reverseMap();
                                            }
                                            break;
                                        case 'wrap-reverse':
                                            if (flex.direction.indexOf('row') !== -1) {
                                                levels.reverse();
                                            }
                                            else if (flex.direction === 'column') {
                                                reverseMap();
                                            }
                                            break;
                                    }
                                    levels.forEach(value => horizontal.push(map[value]));
                                }
                            }
                            else if (columnCount > 0) {
                                const columns: T[][] = [];
                                const perRowCount = Math.ceil(pageflow.length / Math.min(columnCount, pageflow.length));
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
                                const row: T[] = [];
                                const marginLeft = $util.convertInt(node.css('columnGap')) || 16;
                                const marginTotal: number = columns.map(list => Math.max.apply(null, list.map(item => item.marginLeft + item.marginRight))).reduce((a: number, b: number) => a + b, 0);
                                const marginPercent = Math.max(((marginTotal + (marginLeft * (columnCount - 1))) / node.box.width) / columnCount, 0.01);
                                for (let i = 0; i < columns.length; i++) {
                                    const column = columns[i];
                                    const first = column[0];
                                    if (i > 0) {
                                        first.android(first.localizeString(BOX_ANDROID.MARGIN_LEFT), $util.formatPX(first.marginLeft + marginLeft));
                                    }
                                    row.push(first);
                                    column.forEach(item => {
                                        if (!item.hasWidth) {
                                            item.android('layout_width', '0px');
                                            item.app('layout_constraintWidth_percent', ((1 / columnCount) - marginPercent).toFixed(2));
                                        }
                                    });
                                    vertical.push(column);
                                }
                                horizontal.push(row);
                            }
                            else {
                                function partitionChain<T extends View>(current: T, siblings: T[], orientation: string, validate: boolean) {
                                    const layoutParent: string[] = [];
                                    const coordinate: string[] = [];
                                    const connected: string[] = [];
                                    switch (orientation) {
                                        case AXIS_ANDROID.HORIZONTAL:
                                            layoutParent.push(layoutMap['left'], layoutMap['right']);
                                            coordinate.push('linear.top', 'linear.bottom');
                                            connected.push(layoutMap['leftRight'], layoutMap['rightLeft']);
                                            break;
                                        case AXIS_ANDROID.VERTICAL:
                                            layoutParent.push(layoutMap['top'], layoutMap['bottom']);
                                            coordinate.push('linear.left', 'linear.right');
                                            connected.push(layoutMap['topBottom'], layoutMap['bottomTop']);
                                            break;
                                    }
                                    return coordinate.map(value => {
                                        const sameXY = $util.sortAsc(siblings.filter(item => $util.hasSameValue(current, item, value) && item[orientation === AXIS_ANDROID.HORIZONTAL ? 'intersectX' : 'intersectY'](current.linear)), coordinate[0]);
                                        if (sameXY.length > 1) {
                                            if (!validate || (sameXY.every(item => !item.floating) && sameXY[0].app(layoutParent[0]) === 'parent' && sameXY[sameXY.length - 1].app(layoutParent[1]) === 'parent')) {
                                                return sameXY;
                                            }
                                            else {
                                                const chained = new Set([current]);
                                                let valid: boolean;
                                                do {
                                                    valid = false;
                                                    Array.from(chained).some(item =>
                                                        sameXY.some(adjacent => {
                                                            if (!chained.has(adjacent) && (adjacent.app(connected[0]) === item.stringId || adjacent.app(connected[1]) === item.stringId)) {
                                                                chained.add(adjacent);
                                                                valid = true;
                                                            }
                                                            return valid;
                                                        })
                                                    );
                                                }
                                                while (valid);
                                                return Array.from(chained);
                                            }
                                        }
                                        return [];
                                    })
                                    .reduce((a, b) => a.length >= b.length ? a : b);
                                }
                                const horizontalChain = pageflow.filter(current => !current.constraint.horizontal);
                                const verticalChain = pageflow.filter(current => !current.constraint.vertical);
                                const available = new Set<string>();
                                function chainAvailable(list: T[]) {
                                    const id = list.map(item => item.id).sort().join('-');
                                    return !available.has(id) && !!available.add(id);
                                }
                                function chainLength(a, b) {
                                    return a.length <= b.length ? 1 : -1;
                                }
                                pageflow.some(current => {
                                    const horizontalOutput: T[] = [];
                                    const verticalOutput: T[] = [];
                                    if (horizontalChain.includes(current)) {
                                        horizontalOutput.push(...partitionChain(current, pageflow, AXIS_ANDROID.HORIZONTAL, !percentage));
                                        if (horizontalOutput.length > 1 && chainAvailable(horizontalOutput)) {
                                            horizontal.push($util.sortAsc(horizontalOutput, 'linear.left'));
                                        }
                                    }
                                    if (verticalChain.includes(current) && !percentage) {
                                        verticalOutput.push(...partitionChain(current, pageflow, AXIS_ANDROID.VERTICAL, true));
                                        if (verticalOutput.length > 1 && chainAvailable(verticalOutput)) {
                                            vertical.push($util.sortAsc(verticalOutput, 'linear.top'));
                                        }
                                    }
                                    return horizontalOutput.length === pageflow.length || verticalOutput.length === pageflow.length;
                                });
                                horizontal.sort(chainLength);
                                vertical.sort(chainLength);
                            }
                            [horizontal, vertical].forEach((connected, index) => {
                                if (connected.length > 0) {
                                    const inverse = index === 0 ? 1 : 0;
                                    const connectedRows: T[][] = [];
                                    connected.forEach((chainable, level) => {
                                        if (chainable.length > 0) {
                                            const [HV, VH] = [CHAIN_MAP['horizontalVertical'][index], CHAIN_MAP['horizontalVertical'][inverse]];
                                            const [LT, TL] = [CHAIN_MAP['leftTop'][index], CHAIN_MAP['leftTop'][inverse]];
                                            const [RB, BR] = [CHAIN_MAP['rightBottom'][index], CHAIN_MAP['rightBottom'][inverse]];
                                            const [WH, HW] = [CHAIN_MAP['widthHeight'][index], CHAIN_MAP['widthHeight'][inverse]];
                                            const orientation = HV.toLowerCase();
                                            const orientationInverse = VH.toLowerCase();
                                            const dimension = WH.toLowerCase();
                                            if (flex.enabled) {
                                                if (chainable.some(item => item.flex.order > 0)) {
                                                    if (flex.direction.indexOf('reverse') !== -1) {
                                                        $util.sortDesc(chainable, 'flex.order');
                                                    }
                                                    else {
                                                        $util.sortAsc(chainable, 'flex.order');
                                                    }
                                                }
                                            }
                                            else if (!percentage && columnCount === 0) {
                                                if (chainable.every(item => mapAnchored(item, nodes, orientation))) {
                                                    return;
                                                }
                                            }
                                            const first = chainable[0];
                                            const last = chainable[chainable.length - 1];
                                            let disconnected = false;
                                            let marginDelete = false;
                                            let maxOffset = -1;
                                            const attrs = index === 0 ? ['left', 'leftRight', 'top', AXIS_ANDROID.VERTICAL, 'hasWidth', 'right', 'marginHorizontal']
                                                                        : ['top', 'topBottom', 'left', AXIS_ANDROID.HORIZONTAL, 'hasHeight', 'bottom', 'marginVertical'];
                                            for (let i = 0; i < chainable.length; i++) {
                                                const item = chainable[i];
                                                if (i === 0) {
                                                    if (!mapParent(item, attrs[0])) {
                                                        disconnected = true;
                                                        break;
                                                    }
                                                }
                                                else {
                                                    if (!mapSibling(item, attrs[1])) {
                                                        disconnected = true;
                                                        break;
                                                    }
                                                }
                                            }
                                            if (!disconnected) {
                                                if (chainable.every(item => $util.hasSameValue(first, item, `linear.${attrs[2]}`))) {
                                                    for (let j = 1; j < chainable.length; j++) {
                                                        const item = chainable[j];
                                                        if (!item.constraint[attrs[3]]) {
                                                            item.anchor(layoutMap[attrs[2]], first.stringId, attrs[3]);
                                                        }
                                                    }
                                                }
                                                if (!flex.enabled && node[attrs[4]] === 0) {
                                                    mapDelete(last, attrs[5]);
                                                    last.constraint[attrs[6]] = mapSibling(last, attrs[1]);
                                                }
                                            }
                                            if (percentage) {
                                                first.anchor(layoutMap[LT], 'parent', orientation);
                                                last.anchor(layoutMap[RB], 'parent', orientation);
                                                if (!node.renderParent.autoMarginHorizontal) {
                                                    if (first.float === 'right' && last.float === 'right') {
                                                        first.app(`layout_constraint${HV}_bias`, '1');
                                                    }
                                                    else {
                                                        first.app(`layout_constraint${HV}_bias`, '0');
                                                    }
                                                }
                                            }
                                            else {
                                                first.anchor(layoutMap[LT], 'parent', orientation);
                                                last.anchor(layoutMap[RB], 'parent', orientation);
                                            }
                                            for (let i = 0; i < chainable.length; i++) {
                                                const chain = chainable[i];
                                                const next = chainable[i + 1];
                                                const previous = chainable[i - 1];
                                                if (flex.enabled) {
                                                    if (chain.linear[TL] === node.box[TL] && chain.linear[BR] === node.box[BR]) {
                                                        setAlignParent(chain, orientationInverse);
                                                    }
                                                    const rowNext = connected[level + 1];
                                                    if (rowNext) {
                                                        const chainNext = rowNext[i];
                                                        if (chainNext && chain.withinY(chainNext.linear)) {
                                                            chain.anchor(layoutMap['bottomTop'], chainNext.stringId);
                                                            if (!mapParent(chain, 'bottom')) {
                                                                mapDelete(chain, 'bottom');
                                                            }
                                                        }
                                                    }
                                                }
                                                else if (percentage) {
                                                    if (connectedRows.length === 0) {
                                                        chain.anchor(layoutMap['top'], 'parent');
                                                    }
                                                    else {
                                                        const previousRow = connectedRows[connectedRows.length - 1];
                                                        const bottom = Math.max.apply(null, previousRow.map(item => item.linear.bottom));
                                                        let anchorAbove: T | undefined;
                                                        if (chainable.length === previousRow.length) {
                                                            anchorAbove = previousRow[i];
                                                        }
                                                        else {
                                                            anchorAbove = previousRow.find(item => item.linear.bottom === bottom);
                                                        }
                                                        if (anchorAbove) {
                                                            chain.anchor(layoutMap['topBottom'], anchorAbove.stringId);
                                                        }
                                                    }
                                                    const width = chain.css('width');
                                                    if ($util.isPercent(width)) {
                                                        chain.android('layout_width', '0px');
                                                        chain.app(`layout_constraint${WH}_percent`, (parseInt(width) / 100).toFixed(2));
                                                    }
                                                    chain.constraint.horizontal = true;
                                                    chain.constraint.vertical = true;
                                                }
                                                else if (columnCount > 0) {
                                                    if (index === 0) {
                                                        chain.app(`layout_constraint${VH}_bias`, '0');
                                                    }
                                                    if (index === 1 && i > 0) {
                                                        chain.anchor(layoutMap['left'], first.stringId);
                                                    }
                                                    chain.constraint.horizontal = true;
                                                    chain.constraint.vertical = true;
                                                }
                                                if (next) {
                                                    chain.anchor(layoutMap[CHAIN_MAP['rightLeftBottomTop'][index]], next.stringId);
                                                    maxOffset = Math.max(next.linear[LT] - chain.linear[RB], maxOffset);
                                                }
                                                if (previous) {
                                                    chain.anchor(layoutMap[CHAIN_MAP['leftRightTopBottom'][index]], previous.stringId);
                                                    chain.constraint[`margin${HV}`] = previous.stringId;
                                                }
                                                chain.constraint[`chain${HV}`] = true;
                                                if (!chain.has(dimension) || chain.has(dimension, $enum.CSS_STANDARD.PERCENT)) {
                                                    const minWH = chain.styleMap[`min${WH}`];
                                                    const maxWH = chain.styleMap[`max${WH}`];
                                                    if ($util.isUnit(minWH)) {
                                                        chain.app(`layout_constraint${WH}_min`, minWH);
                                                        chain.android(`layout_${dimension}`, '0px');
                                                    }
                                                    if ($util.isUnit(maxWH)) {
                                                        chain.app(`layout_constraint${WH}_max`, maxWH);
                                                        chain.android(`layout_${dimension}`, '0px');
                                                    }
                                                }
                                                if (flex.enabled) {
                                                    chain.app(`layout_constraint${HV}_weight`, chain.flex.grow.toString());
                                                    if (chain[`view${WH}`] === 0 && chain.flex.grow === 0 && chain.flex.shrink <= 1) {
                                                        chain.android(`layout_${dimension}`, 'wrap_content');
                                                    }
                                                    else if (chain.flex.grow > 0) {
                                                        chain.android(`layout_${dimension}`, '0px');
                                                    }
                                                    if (chain.flex.shrink === 0) {
                                                        chain.app(`layout_constrained${WH}`, 'true');
                                                    }
                                                    switch (chain.flex.alignSelf) {
                                                        case 'flex-start':
                                                            chain.anchor(layoutMap[TL], 'parent', orientationInverse);
                                                            break;
                                                        case 'flex-end':
                                                            chain.anchor(layoutMap[BR], 'parent', orientationInverse);
                                                            break;
                                                        case 'baseline':
                                                            const valid = chainable.some(adjacent => {
                                                                if (adjacent !== chain && adjacent.nodeType <= $enum.NODE_STANDARD.TEXT) {
                                                                    chain.anchor(layoutMap['baseline'], adjacent.stringId);
                                                                    return true;
                                                                }
                                                                return false;
                                                            });
                                                            if (valid) {
                                                                mapDelete(chain, 'top', 'bottom');
                                                                for (const item of chainable) {
                                                                    if (mapSibling(item, 'top') === chain.stringId) {
                                                                        mapDelete(item, 'top');
                                                                    }
                                                                    if (mapSibling(item, 'bottom') === chain.stringId) {
                                                                        mapDelete(item, 'bottom');
                                                                    }
                                                                }
                                                                chain.constraint.vertical = true;
                                                            }
                                                            break;
                                                        case 'center':
                                                        case 'stretch':
                                                            if (chain.flex.alignSelf !== 'center') {
                                                                chain.android(`layout_${HW.toLowerCase()}`, '0px');
                                                            }
                                                            chain.constraint[orientationInverse] = false;
                                                            setAlignParent(chain, orientationInverse);
                                                            break;
                                                    }
                                                    if (chain.flex.basis !== 'auto') {
                                                        const basis = $util.convertInt(chain.flex.basis);
                                                        if (basis > 0) {
                                                            if ($util.isPercent(chain.flex.basis)) {
                                                                chain.app(`layout_constraint${WH}_percent`, (basis / 100).toFixed(2));
                                                            }
                                                            else {
                                                                chain.app(`layout_constraint${WH}_min`, $util.formatPX(basis));
                                                                chain.constraint[`min${WH}`] = true;
                                                            }
                                                        }
                                                    }
                                                }
                                            }
                                            const chainStyle = `layout_constraint${HV}_chainStyle`;
                                            if (flex.enabled && flex.justifyContent !== 'normal' && Math.max.apply(null, chainable.map(item => item.flex.grow)) === 0) {
                                                switch (flex.justifyContent) {
                                                    case 'space-between':
                                                        first.app(chainStyle, 'spread_inside');
                                                        break;
                                                    case 'space-evenly':
                                                        first.app(chainStyle, 'spread');
                                                        chainable.forEach(item => item.app(`layout_constraint${HV}_weight`, (item.flex.grow || 1).toString()));
                                                        break;
                                                    case 'space-around':
                                                        first.app(`layout_constraint${HV}_chainStyle`, 'spread_inside');
                                                        first.constraint[orientation] = false;
                                                        last.constraint[orientation] = false;
                                                        this.addGuideline(first, orientation, true, false);
                                                        this.addGuideline(last, orientation, true, true);
                                                        break;
                                                    default:
                                                        let justifyContent = flex.justifyContent;
                                                        if (flex.direction.indexOf('reverse') !== -1) {
                                                            switch (flex.justifyContent) {
                                                                case 'flex-start':
                                                                    justifyContent = 'flex-end';
                                                                    break;
                                                                case 'flex-end':
                                                                    justifyContent = 'flex-start';
                                                                    break;
                                                            }
                                                        }
                                                        let bias = '0.5';
                                                        switch (justifyContent) {
                                                            case 'flex-start':
                                                                bias = '0';
                                                                break;
                                                            case 'flex-end':
                                                                bias = '1';
                                                                break;
                                                        }
                                                        first.app(chainStyle, 'packed');
                                                        first.app(`layout_constraint${HV}_bias`, bias);
                                                        break;
                                                }
                                                marginDelete = true;
                                            }
                                            else if (percentage) {
                                                first.app(chainStyle, 'packed');
                                            }
                                            else if (!flex.enabled && columnCount > 0) {
                                                first.app(chainStyle, index === 0 ? 'spread_inside' : 'packed');
                                                marginDelete = index === 0;
                                            }
                                            else {
                                                const alignLeft = $util.withinFraction(node.box.left, first.linear.left);
                                                const alignRight = $util.withinFraction(last.linear.right, node.box.right);
                                                const alignTop = $util.withinFraction(node.box.top, first.linear.top);
                                                const alignBottom = $util.withinFraction(last.linear.bottom, node.box.bottom);
                                                if ((orientation === AXIS_ANDROID.HORIZONTAL && alignLeft && alignRight) || (orientation === AXIS_ANDROID.VERTICAL && alignTop && alignBottom)) {
                                                    if (flex.enabled || chainable.length > 2) {
                                                        if (!flex.enabled && node.inlineElement) {
                                                            first.app(chainStyle, 'packed');
                                                            first.app(`layout_constraint${HV}_bias`, index === 0 && node.float === 'right' ? '1' : '0');
                                                        }
                                                        else {
                                                            first.app(chainStyle, 'spread_inside');
                                                            marginDelete = true;
                                                        }
                                                    }
                                                    else if (maxOffset > this.settings[`constraintChainPacked${HV}Offset`]) {
                                                        if (mapParent(first, LT)) {
                                                            mapDelete(first, CHAIN_MAP['rightLeftBottomTop'][index]);
                                                        }
                                                        if (mapParent(last, RB)) {
                                                            mapDelete(last, CHAIN_MAP['leftRightTopBottom'][index]);
                                                        }
                                                    }
                                                }
                                                else if ((maxOffset <= this.settings[`chainPacked${HV}Offset`] || node.flex.wrap !== 'nowrap') || (orientation === AXIS_ANDROID.HORIZONTAL && (alignLeft || alignRight))) {
                                                    first.app(chainStyle, 'packed');
                                                    let bias = '';
                                                    if (orientation === AXIS_ANDROID.HORIZONTAL) {
                                                        if (alignLeft) {
                                                            bias = '0';
                                                        }
                                                        else if (alignRight) {
                                                            bias = '1';
                                                        }
                                                    }
                                                    if (bias === '') {
                                                        bias = chainable[`${orientation}Bias`];
                                                    }
                                                    first.app(`layout_constraint${HV}_bias`, bias);
                                                }
                                                else {
                                                    first.app(chainStyle, 'spread');
                                                    marginDelete = true;
                                                }
                                                if (!flex.enabled) {
                                                    (index === 0 ? [[TL, BR], [BR, TL]] : [[LT, RB], [RB, LT]]).forEach(opposing => {
                                                        if (chainable.some(lower => !$util.hasSameValue(first, lower, `linear.${opposing[1]}`)) && chainable.every(upper => $util.hasSameValue(first, upper, `linear.${opposing[0]}`))) {
                                                            chainable.forEach(item => mapDelete(item, opposing[1]));
                                                        }
                                                    });
                                                    for (const item of chainable) {
                                                        for (const list of connected) {
                                                            if (list.find(subitem => subitem.id === item.id)) {
                                                                list.length = 0;
                                                            }
                                                        }
                                                    }
                                                }
                                            }
                                            if (marginDelete) {
                                                for (const item of chainable) {
                                                    delete item.constraint.marginHorizontal;
                                                    delete item.constraint.marginVertical;
                                                }
                                            }
                                            connectedRows.push(chainable);
                                        }
                                    });
                                }
                            });
                        }
                        for (const current of pageflow) {
                            current.constraint.horizontal = mapAnchored(current, nodes, AXIS_ANDROID.HORIZONTAL);
                            current.constraint.vertical = mapAnchored(current, nodes, AXIS_ANDROID.VERTICAL);
                        }
                        if (flex.enabled) {
                            if (flex.wrap !== 'nowrap') {
                                ['topBottom', 'bottomTop'].forEach((value, index) => {
                                    for (const current of pageflow) {
                                        if (mapParent(current, index === 0 ? 'bottom' : 'top')) {
                                            const chain: T[] = [current];
                                            let valid = false;
                                            let adjacent: T | undefined = current;
                                            while (adjacent) {
                                                const topBottom = mapSibling(adjacent, value);
                                                if (topBottom) {
                                                    adjacent = nodes.find(item => item.stringId === topBottom);
                                                    if (adjacent && current.withinY(adjacent.linear)) {
                                                        chain.push(adjacent);
                                                        if (mapParent(adjacent, index === 0 ? 'top' : 'bottom')) {
                                                            valid = true;
                                                            break;
                                                        }
                                                    }
                                                }
                                                else {
                                                    adjacent = undefined;
                                                }
                                            }
                                            if (!valid) {
                                                for (const item of chain) {
                                                    pageflow.some(next => {
                                                        if (item !== next && next.linear.top === item.linear.top && next.linear.bottom === item.linear.bottom) {
                                                            mapDelete(item, 'topBottom', 'bottomTop');
                                                            item.app(layoutMap['top'], next.stringId);
                                                            item.app(layoutMap['bottom'], next.stringId);
                                                            return true;
                                                        }
                                                        return false;
                                                    });
                                                }
                                            }
                                        }
                                    }
                                });
                            }
                        }
                        else if (columnCount === 0) {
                            for (const current of pageflow) {
                                [['top', 'bottom', 'topBottom'], ['bottom', 'top', 'bottomTop']].forEach(direction => {
                                    if (mapParent(current, direction[1]) && !mapSibling(current, direction[2])) {
                                        ['leftRight', 'rightLeft'].forEach(value => {
                                            const stringId = mapSibling(current, value);
                                            if (stringId) {
                                                const aligned = pageflow.find(item => item.stringId === stringId);
                                                if (aligned && mapSibling(aligned, direction[2])) {
                                                    if ($util.withinFraction(current.linear[direction[0]], aligned.linear[direction[0]])) {
                                                        current.anchor(layoutMap[direction[0]], aligned.stringId);
                                                    }
                                                    if ($util.withinFraction(current.linear[direction[1]], aligned.linear[direction[1]])) {
                                                        current.anchor(layoutMap[direction[1]], aligned.stringId);
                                                    }
                                                }
                                            }
                                        });
                                    }
                                });
                            }
                            const unbound = pageflow.filter(current =>
                                !current.anchored && (
                                    mapParent(current, 'top') ||
                                    mapParent(current, 'right') ||
                                    mapParent(current, 'bottom') ||
                                    mapParent(current, 'left')
                                )
                            );
                            if (nodes.filter(item => item.anchored).length === 0 && unbound.length === 0) {
                                unbound.push(nodes[0]);
                            }
                            unbound.forEach(current => this.addGuideline(current, '', false, false));
                            const [adjacent, unanchored] = $util.partition(nodes, item => item.anchored);
                            for (const current of unanchored) {
                                if (this.settings.constraintCirclePositionAbsolute && adjacent.length > 0 && !current.constraint.horizontal && !current.constraint.vertical) {
                                    const opposite = adjacent[0];
                                    const center1 = current.center;
                                    const center2 = opposite.center;
                                    const x = Math.abs(center1.x - center2.x);
                                    const y = Math.abs(center1.y - center2.y);
                                    const radius = Math.round(Math.sqrt(Math.pow(x, 2) + Math.pow(y, 2)));
                                    let degrees = Math.round(Math.atan(Math.min(x, y) / Math.max(x, y)) * (180 / Math.PI));
                                    if (center1.y > center2.y) {
                                        if (center1.x > center2.x) {
                                            if (x > y) {
                                                degrees += 90;
                                            }
                                            else {
                                                degrees = 180 - degrees;
                                            }
                                        }
                                        else {
                                            if (x > y) {
                                                degrees = 270 - degrees;
                                            }
                                            else {
                                                degrees += 180;
                                            }
                                        }
                                    }
                                    else if (center1.y < center2.y) {
                                        if (center2.x > center1.x) {
                                            if (x > y) {
                                                degrees += 270;
                                            }
                                            else {
                                                degrees = 360 - degrees;
                                            }
                                        }
                                        else {
                                            if (x > y) {
                                                degrees = 90 - degrees;
                                            }
                                        }
                                    }
                                    else {
                                        degrees = center1.x > center2.x ? 90 : 270;
                                    }
                                    current.delete('app', 'layout_constraint*');
                                    current.app('layout_constraintCircle', opposite.stringId);
                                    current.app('layout_constraintCircleRadius', $util.formatPX(radius));
                                    current.app('layout_constraintCircleAngle', degrees.toString());
                                    current.constraint.horizontal = true;
                                    current.constraint.vertical = true;
                                }
                                else {
                                    this.addGuideline(current);
                                }
                            }
                            let bottomParent: boolean | undefined;
                            let rightParent: boolean | undefined;
                            const maxBottom: number = Math.max.apply(null, nodes.map(item => item.linear.bottom));
                            const connected: ObjectMapNested<string> = {};
                            function deleteChain(item: T, value: string) {
                                mapDelete(item, value);
                                delete connected[item.stringId][value];
                            }
                            for (const current of nodes) {
                                const top = mapParent(current, 'top');
                                const right = mapParent(current, 'right');
                                let bottom = mapParent(current, 'bottom');
                                const left = mapParent(current, 'left');
                                connected[current.stringId] = {
                                    leftRight: mapSibling(current, 'leftRight'),
                                    rightLeft: mapSibling(current, 'rightLeft'),
                                    topBottom: mapSibling(current, 'topBottom'),
                                    bottomTop: mapSibling(current, 'bottomTop')
                                };
                                if ((bottom && mapSibling(current, 'topBottom') && current.hasHeight) || (top && bottom && current.linear.bottom < maxBottom && !current.has('marginTop', $enum.CSS_STANDARD.AUTO))) {
                                    mapDelete(current, 'bottom');
                                    bottom = false;
                                }
                                if (current.pageflow) {
                                    [[left, right, 'rightLeft', 'leftRight', 'right', 'left', 'Horizontal'], [top, bottom, 'bottomTop', 'topBottom', 'bottom', 'top', 'Vertical']].forEach((value: [boolean, boolean, string, string, string, string, string], index) => {
                                        if (value[0] || value[1]) {
                                            let valid = value[0] && value[1];
                                            let next: T | undefined = current;
                                            if (!valid) {
                                                do {
                                                    const stringId = mapSibling(next, value[0] ? value[2] : value[3]);
                                                    if (stringId) {
                                                        next = this.findByStringId(stringId);
                                                        if (next && ((value[0] && mapParent(next, value[4])) || (value[1] && mapParent(next, value[5])))) {
                                                            valid = true;
                                                            break;
                                                        }
                                                    }
                                                    else {
                                                        next = undefined;
                                                    }
                                                }
                                                while (next);
                                            }
                                            if (valid) {
                                                node.constraint[`layout${value[6]}`] = true;
                                            }
                                            if (!current.constraint[`chain${value[6]}`]) {
                                                if (value[0] && value[1]) {
                                                    if (!current.autoMargin && !current.linearVertical) {
                                                        current.android(`layout_${index === 0 ? 'width' : 'height'}`, 'match_parent', false);
                                                    }
                                                }
                                                else if (value[1]) {
                                                    if (valid) {
                                                        const below = this.findByStringId(mapSibling(current, value[3]));
                                                        if (below && below.marginBottom === 0) {
                                                            mapDelete(current, value[4]);
                                                        }
                                                    }
                                                }
                                            }
                                        }
                                    });
                                    if (right) {
                                        if (!rightParent) {
                                            rightParent = false;
                                            rightParent = mapAnchored(current, nodes, AXIS_ANDROID.HORIZONTAL);
                                        }
                                    }
                                    else if (left) {
                                        if (current.is($enum.NODE_STANDARD.TEXT) && current.cssParent('textAlign', true) === 'center') {
                                            current.anchor(layoutMap['right'], 'parent');
                                        }
                                        if (current.textElement &&
                                            !current.hasWidth &&
                                            current.toInt('maxWidth') === 0 &&
                                            current.multiLine &&
                                            !$dom.hasLineBreak(current.element) &&
                                            !nodes.some(item => mapSibling(item, 'rightLeft') === current.stringId))
                                        {
                                            current.android('layout_width', 'match_parent');
                                        }
                                    }
                                    if (bottom) {
                                        if (!bottomParent) {
                                            bottomParent = false;
                                            bottomParent = mapAnchored(current, nodes, AXIS_ANDROID.VERTICAL);
                                        }
                                    }
                                }
                                else {
                                    if (left && right && current.right === null && current.hasWidth) {
                                        switch (current.cssParent('textAlign', true)) {
                                            case 'center':
                                            case 'right':
                                            case 'end':
                                                break;
                                            default:
                                                mapDelete(current, 'right');
                                                break;
                                        }
                                    }
                                    if (top && bottom && current.bottom === null && current.hasHeight) {
                                        switch (current.css('verticalAlign')) {
                                            case 'bottom':
                                            case 'text-bottom':
                                            case 'middle':
                                                break;
                                            default:
                                                mapDelete(current, 'bottom');
                                                break;
                                        }
                                    }
                                    if (left && right && !node.hasWidth) {
                                        node.constraint.layoutWidth = true;
                                    }
                                    if (top && bottom && !node.hasHeight) {
                                        node.constraint.layoutHeight = true;
                                    }
                                    if (right && current.toInt('right') > 0) {
                                        current.modifyBox($enum.BOX_STANDARD.MARGIN_RIGHT, Math.max(current.toInt('right') - node.paddingRight, 0));
                                    }
                                    if (bottom && current.toInt('bottom') > 0) {
                                        current.modifyBox($enum.BOX_STANDARD.MARGIN_BOTTOM, Math.max(current.toInt('bottom') - node.paddingBottom, 0));
                                    }
                                    if (right && bottom) {
                                        if (node.documentRoot) {
                                            if (!node.hasWidth) {
                                                node.constraint.layoutWidth = false;
                                                node.constraint.layoutHorizontal = false;
                                            }
                                            if (!node.hasHeight) {
                                                node.constraint.layoutHeight = false;
                                                node.constraint.layoutVertical = false;
                                            }
                                        }
                                    }
                                }
                            }
                            for (const left in connected) {
                                for (const right in connected) {
                                    if (left !== right) {
                                        ['leftRight', 'rightLeft', 'bottomTop', 'topBottom'].forEach(value => {
                                            if (connected[left][value] && connected[left][value] === connected[right][value]) {
                                                const conflict = nodes.find(item => item.stringId === connected[left][value]);
                                                if (conflict) {
                                                    [nodes.find(item => item.stringId === left), nodes.find(item => item.stringId === right)].some((item, index) => {
                                                        if (item) {
                                                            const stringId = index === 0 ? left : right;
                                                            switch (value) {
                                                                case 'leftRight':
                                                                case 'rightLeft':
                                                                    if ((mapSibling(item, 'left') || mapSibling(item, 'right')) && mapSibling(conflict, value === 'rightLeft' ? 'leftRight' : 'rightLeft') !== stringId) {
                                                                        deleteChain(item, value);
                                                                        return true;
                                                                    }
                                                                    break;
                                                                case 'bottomTop':
                                                                case 'topBottom':
                                                                    if ((mapSibling(item, 'top') || mapSibling(item, 'bottom')) && mapSibling(conflict, value === 'topBottom' ? 'bottomTop' : 'topBottom') !== stringId) {
                                                                        deleteChain(item, value);
                                                                        return true;
                                                                    }
                                                                    break;
                                                            }
                                                        }
                                                        return false;
                                                    });
                                                }
                                            }
                                        });
                                    }
                                }
                            }
                            if (rightParent === false) {
                                node.constraint.layoutWidth = true;
                            }
                            if (bottomParent === false) {
                                node.constraint.layoutHeight = true;
                            }
                        }
                    }
                }
            }
            for (const current of nodes) {
                if (current.constraint.marginHorizontal) {
                    const previous = this.findByStringId(current.constraint.marginHorizontal);
                    if (previous) {
                        const offset = current.linear.left - previous.actualRight();
                        if (offset >= 1) {
                            current.modifyBox($enum.BOX_STANDARD.MARGIN_LEFT, offset);
                        }
                    }
                }
                if (current.constraint.marginVertical) {
                    const previous = this.findByStringId(current.constraint.marginVertical);
                    if (previous) {
                        let bottom = previous.linear.bottom;
                        if ($dom.isUserAgent($enum.USER_AGENT.EDGE)) {
                            const elements = $dom.getElementsBetweenSiblings(previous.groupElement ? (previous.item() as T).baseElement : previous.baseElement, current.baseElement).filter(element => element.tagName === 'BR');
                            if (elements.length > 0) {
                                bottom = Math.min(bottom, elements[0].getBoundingClientRect().top + this.settings.whitespaceVerticalOffset);
                            }
                        }
                        const offset = current.linear.top - bottom;
                        if (offset >= 1) {
                            current.modifyBox($enum.BOX_STANDARD.MARGIN_TOP, offset);
                        }
                    }
                }
            }
        }
    }

    public createGroup(parent: T, node: T, children: T[]) {
        const group = new ViewGroup(this.cache.nextId, node, parent, children, this.delegateNodeInit) as T;
        if (children.length > 0) {
            children.forEach(item => item.inherit(group, 'data'));
        }
        this.cache.append(group);
        return group;
    }

    public renderGroup(node: T, parent: T, nodeType: number | string, options?: ObjectMap<StringMap>) {
        const target = $util.hasValue(node.dataset.target) && !$util.hasValue(node.dataset.include);
        if (typeof nodeType === 'number') {
            node.nodeType = nodeType;
            nodeType = View.getControlName(nodeType);
        }
        switch (nodeType) {
            case NODE_ANDROID.LINEAR:
                options = {
                    android: {
                        orientation: options && options.horizontal ? AXIS_ANDROID.HORIZONTAL : AXIS_ANDROID.VERTICAL
                    }
                };
                break;
            case NODE_ANDROID.GRID:
                options = {
                    android: {
                        columnCount: options && $util.convertInt(options.columnCount) > 0 ? options.columnCount.toString() : '2',
                        rowCount: options && $util.convertInt(options.rowCount) > 0 ? options.rowCount.toString() : ''
                    }
                };
                break;
            default:
                options = {};
                break;
        }
        node.setNodeType(nodeType);
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
            let previous: T | undefined;
            const scrollView = overflow.map((controlName, index) => {
                const container = new View(this.cache.nextId, index === 0 ? node.element : undefined, this.delegateNodeInit) as T;
                container.nodeName = node.nodeName;
                container.setNodeType(controlName);
                if (index === 0) {
                    container.inherit(node, 'initial', 'base', 'data', 'style', 'styleMap');
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
                preXml += `{<${container.id}}${indent}<${controlName}{@${container.id}}>\n` +
                          `{:${container.id}}`;
                postXml = `${indent}</${controlName}>\n{>${container.id}}` + (index === 1 ? '\n' : '') + postXml;
                previous = container;
                this.cache.append(container);
                return container;
            });
            if (scrollView.length === 2) {
                node.android('layout_width', 'wrap_content');
                node.android('layout_height', 'wrap_content');
            }
            else {
                node.android(node.overflowX ? 'layout_width' : 'layout_height', 'wrap_content');
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
        return Controller.getEnclosingTag(
            target || $util.hasValue(parent.dataset.target) || (node.renderDepth === 0 && !node.documentRoot) ? -1 : node.renderDepth,
            nodeType,
            node.id,
            $xml.formatPlaceholder(node.id),
            preXml,
            postXml
        );
    }

    public renderNode(node: T, parent: T, nodeType: number | string, recursive = false): string {
        const target = $util.hasValue(node.dataset.target) && !$util.hasValue(node.dataset.include);
        if (typeof nodeType === 'number') {
            node.nodeType = nodeType;
            nodeType = View.getControlName(nodeType);
        }
        node.setNodeType(nodeType);
        switch (node.tagName) {
            case 'IMG': {
                if (!node.hasBit('excludeResource', $enum.NODE_RESOURCE.IMAGE_SOURCE)) {
                    if (!recursive) {
                        const element = <HTMLImageElement> node.element;
                        const percentWidth = node.has('width', $enum.CSS_STANDARD.PERCENT);
                        const percentHeight = node.has('height', $enum.CSS_STANDARD.PERCENT);
                        let width = node.toInt('width');
                        let height = node.toInt('height');
                        let scaleType = '';
                        if (percentWidth || percentHeight) {
                            scaleType = percentWidth && percentHeight ? 'fitXY' : 'fitCenter';
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
                        if (scaleType !== '') {
                            node.android('scaleType', scaleType);
                        }
                        if ((width > 0 && height === 0) || (width === 0 && height > 0)) {
                            node.android('adjustViewBounds', 'true');
                        }
                        if (!node.pageflow) {
                            const left = node.toInt('left');
                            const top = node.toInt('top');
                            if (left < 0 || top < 0) {
                                const container = new View(this.cache.nextId, node.element, this.delegateNodeInit) as T;
                                container.excludeProcedure |= $enum.NODE_PROCEDURE.ALL;
                                container.excludeResource |= $enum.NODE_RESOURCE.ALL;
                                container.android('layout_width', width > 0 ? $util.formatPX(width) : 'wrap_content');
                                container.android('layout_height', height > 0 ? $util.formatPX(height) : 'wrap_content');
                                container.setBounds();
                                container.setNodeType(NODE_ANDROID.FRAME);
                                container.render(parent);
                                if (left < 0) {
                                    node.modifyBox($enum.BOX_STANDARD.MARGIN_LEFT, left, true);
                                    container.css('left', '0px');
                                }
                                if (top < 0) {
                                    node.modifyBox($enum.BOX_STANDARD.MARGIN_TOP, top, true);
                                    container.css('top', '0px');
                                }
                                node.parent = container;
                                this.cache.append(container);
                                return Controller.getEnclosingTag(
                                    container.renderDepth,
                                    NODE_ANDROID.FRAME,
                                    container.id,
                                    this.renderNode(node, container, nodeType, true)
                                );
                            }
                        }
                        else {
                            if (parent.layoutHorizontal && node.baseline) {
                                node.android('baselineAlignBottom', 'true');
                            }
                        }
                        const result = Resource.addImageSrcSet(element);
                        if (result !== '') {
                            node.android('src', `@drawable/${result}`, node.renderExtension.size === 0);
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
                    const cols = $util.convertInt(element.cols);
                    if (cols > 0) {
                        node.css('width', $util.formatPX(cols * 10));
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
                                group.setNodeType(NODE_ANDROID.RADIO_GROUP);
                                group.inherit(node, 'alignment');
                                group.render(parent);
                                let xml = '';
                                let checked = '';
                                group.each((item: T) => {
                                    if ((<HTMLInputElement> item.element).checked) {
                                        checked = item.stringId;
                                    }
                                    xml += this.renderNode(item, group, $enum.NODE_STANDARD.RADIO, true);
                                });
                                group.android('orientation', $NodeList.linearX(radiogroup, radiogroup.every(item => item.documentParent === radiogroup[0].documentParent)) ? AXIS_ANDROID.HORIZONTAL : AXIS_ANDROID.VERTICAL);
                                group.alignmentType |= $enum.NODE_ALIGNMENT.SEGMENTED;
                                if (checked !== '') {
                                    group.android('checkedButton', checked);
                                }
                                return Controller.getEnclosingTag(group.renderDepth, NODE_ANDROID.RADIO_GROUP, group.id, xml);
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
                        if (!node.hasWidth) {
                            const size = $util.convertInt(element.size);
                            if (size > 0) {
                                node.css('width', $util.formatPX(size * 10));
                            }
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
                    node.android('layout_height', $util.formatPX(node.borderTopWidth + node.borderBottomWidth + node.paddingTop + node.paddingBottom || 1));
                }
                break;
        }
        node.render(target ? node : parent);
        return Controller.getEnclosingTag(
            target || $util.hasValue(parent.dataset.target) || (node.renderDepth === 0 && !node.documentRoot) ? -1 : node.renderDepth,
            node.controlName,
            node.id
        );
    }

    public renderNodeStatic(nodeType: number | string, depth: number, options = {}, width = '', height = '', node?: T, children?: boolean) {
        if (!node) {
            node = new View(0, undefined, this.delegateNodeInit) as T;
        }
        node.apply(options);
        const renderDepth = Math.max(0, depth);
        let viewName =  '';
        if (typeof nodeType === 'number') {
            node.nodeType = nodeType;
            viewName = View.getControlName(nodeType);
        }
        else {
            viewName = nodeType;
        }
        switch (viewName) {
            case 'include':
            case 'merge':
            case 'menu':
                break;
            default:
                node.setNodeType(viewName);
                break;
        }
        if ($util.hasValue(width)) {
            node.android('layout_width', width, false);
        }
        if ($util.hasValue(height)) {
            node.android('layout_height', height, false);
        }
        node.renderDepth = renderDepth;
        let output = Controller.getEnclosingTag(
            !node.documentRoot && depth === 0 ? -1 : depth,
            viewName,
            node.id,
            children ? $xml.formatPlaceholder(node.id) : ''
        );
        if (this.settings.showAttributes && node.id === 0) {
            const indent = $util.repeat(renderDepth + 1);
            const attrs = node.combine().map(value => `\n${indent + value}`).join('');
            output = output.replace($xml.formatPlaceholder(node.id, '@'), attrs);
        }
        options['stringId'] = node.stringId;
        return output;
    }

    public renderInclude(node: T, parent: T, name: string) {
        this._merge[name] = node.dataset.includeMerge === 'true';
        node.documentRoot = !this._merge[name];
        return this.renderNodeStatic(
            'include',
            parent.renderDepth + 1,
            {
                layout: `@layout/${name}`
            }
        );
    }

    public renderMerge(name: string, value: string[]) {
        let xml = value.join('');
        if (this._merge[name]) {
            const node = new View(0, undefined, this.delegateNodeInit) as T;
            node.documentRoot = true;
            xml = this.renderNodeStatic(
                'merge',
                0,
                {},
                '',
                '',
                node,
                true
            )
            .replace('{:0}', xml);
        }
        return xml;
    }

    public renderColumnSpace(depth: number, width: string, height = '', columnSpan = 1) {
        let percent = '';
        if ($util.isPercent(width)) {
            percent = (parseInt(width) / 100).toFixed(2);
            width = '0px';
        }
        return this.renderNodeStatic(
            $enum.NODE_STANDARD.SPACE,
            depth,
            {
                android: {
                    layout_columnWeight: percent,
                    layout_columnSpan: columnSpan.toString()
                }
            },
            width,
            $util.hasValue(height) ? height : 'wrap_content'
        );
    }

    public baseRenderDepth(name: string) {
        return this._merge[name] ? 0 : -1;
    }

    protected addGuideline(node: T, orientation = '', percent?: boolean, opposite?: boolean) {
        const layoutMap = LAYOUT_MAP.constraint;
        if (node.pageflow) {
            if (opposite === undefined) {
                opposite = (
                    node.float === 'right' ||
                    (node.left === null && node.right !== null) ||
                    (node.textElement && node.css('textAlign') === 'right') ||
                    node.alignParent('right')
                );
            }
            if (percent === undefined && opposite) {
                percent = true;
            }
        }
        if (node.dataset.constraintPercent) {
            percent = node.dataset.constraintPercent === 'true';
        }
        const parent = node.documentParent;
        const beginPercent = `layout_constraintGuide_${percent ? 'percent' : 'begin'}`;
        [AXIS_ANDROID.HORIZONTAL, AXIS_ANDROID.VERTICAL].forEach((value, index) => {
            if (!node.constraint[value] && (orientation === '' || value === orientation)) {
                let LT = '';
                let RB = '';
                let LTRB = '';
                let RBLT = '';
                let found = false;
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
                if (!percent) {
                    const direction = $util.capitalize(value);
                    found = parent.renderChildren.some(item => {
                        if (item !== node && item.constraint[value] && (!item.constraint[`chain${direction}`] || item.constraint[`margin${direction}`])) {
                            if ($util.withinFraction(node.linear[LT] + offset, item.linear[RB])) {
                                node.anchor(layoutMap[LTRB], item.stringId, value, true);
                                return true;
                            }
                            else if ($util.withinFraction(node.linear[RB] + offset, item.linear[LT])) {
                                node.anchor(layoutMap[RBLT], item.stringId, value, true);
                                return true;
                            }
                            if ($util.withinFraction(node.bounds[LT] + offset, item.bounds[LT])) {
                                node.anchor(
                                    layoutMap[
                                        index === 1 &&
                                        node.textElement &&
                                        node.baseline &&
                                        item.textElement &&
                                        item.baseline ? 'baseline' : LT
                                    ],
                                    item.stringId,
                                    value,
                                    true
                                );
                                return true;
                            }
                            else if ($util.withinFraction(node.bounds[RB] + offset, item.bounds[RB])) {
                                node.anchor(layoutMap[RB], item.stringId, value, true);
                                return true;
                            }
                        }
                        return false;
                    });
                }
                if (!found) {
                    const guideline = parent.constraint.guideline || {};
                    let location = percent ? parseFloat(Math.abs(position - (!opposite ? 0 : 1)).toFixed(this.settings.constraintPercentAccuracy))
                                           : (!opposite ? (node[dimension][LT] + offset) - parent.box[LT] : (node[dimension][LT] + offset) - parent.box[RB]);
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
                        node.anchor(layoutMap[LT], 'parent', value, true);
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
                                if (anchors[stringId] === location) {
                                    node.anchor(layoutMap[LT], stringId, value, true);
                                    node.delete('app', layoutMap[RB]);
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
                            node.anchor(layoutMap[LT], stringId, value, true);
                            node.delete('app', layoutMap[RB]);
                            node.constraint[`${value}Guideline`] = stringId;
                            if (guideline[value] === undefined) {
                                guideline[value] = {};
                            }
                            if (guideline[value][beginPercent] === undefined) {
                                guideline[value][beginPercent] = {};
                            }
                            if (guideline[value][beginPercent][LT] === undefined) {
                                guideline[value][beginPercent][LT] = {};
                            }
                            guideline[value][beginPercent][LT][stringId] = location;
                            parent.constraint.guideline = guideline;
                        }
                    }
                }
            }
        });
    }

    private setAttributes(data: ViewData<$NodeList<T>>) {
        if (this.settings.showAttributes) {
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
            function getRootNamespace(content: string) {
                let output = '';
                for (const namespace in XMLNS_ANDROID) {
                    if (new RegExp(`\\s+${namespace}:`).test(content)) {
                        output += `\n\t${getXmlNs(namespace)}`;
                    }
                }
                return output;
            }
            const cache: StringMap[] = data.cache.visible.map(node => ({ pattern: $xml.formatPlaceholder(node.id, '@'), attributes: parseAttributes(node) }));
            for (const value of [...data.views, ...data.includes]) {
                cache.forEach(item => value.content = value.content.replace(item.pattern, item.attributes));
                value.content = value.content.replace(`{#0}`, getRootNamespace(value.content));
            }
        }
    }

    private findByStringId(id: string) {
        return this.cache.find('stringId', id);
    }

    public get delegateNodeInit(): SelfWrapped<T, void> {
        const settings = this.settings;
        return (self: T) => {
            self.localSettings = {
                targetAPI: settings.targetAPI !== undefined ? settings.targetAPI : 26,
                supportRTL: settings.supportRTL !== undefined ? settings.supportRTL : true,
                autoSizePaddingAndBorderWidth: settings.autoSizePaddingAndBorderWidth !== undefined ? settings.autoSizePaddingAndBorderWidth : true,
                ellipsisOnTextOverflow: settings.ellipsisOnTextOverflow !== undefined ? settings.ellipsisOnTextOverflow : true,
                constraintPercentAccuracy: settings.constraintPercentAccuracy !== undefined ? settings.constraintPercentAccuracy : 4,
                customizationsOverwritePrivilege: settings.customizationsOverwritePrivilege !== undefined ? settings.customizationsOverwritePrivilege : true
            };
        };
    }
}