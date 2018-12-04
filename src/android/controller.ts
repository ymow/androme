import { UserSettingsAndroid } from './types/module';

import { AXIS_ANDROID, BOX_ANDROID, CONTAINER_ANDROID, XMLNS_ANDROID } from './lib/constant';
import { CONTAINER_NODE } from './lib/enumeration';

import BASE_TMPL from './template/base';

import Resource from './resource';
import View from './view';
import ViewGroup from './viewgroup';

import { createAttribute, getXmlNs, replaceTab, replaceUnit } from './lib/util';

import $Layout = androme.lib.base.Layout;
import $NodeList = androme.lib.base.NodeList;

import $color = androme.lib.color;
import $dom = androme.lib.dom;
import $enum = androme.lib.enumeration;
import $util = androme.lib.util;
import $xml = androme.lib.xml;

function sortByAlignment<T extends View>(list: T[], alignmentType: number) {
    if ($util.hasBit($enum.NODE_ALIGNMENT.HORIZONTAL | $enum.NODE_ALIGNMENT.FLOAT, alignmentType)) {
        function sortHorizontal(nodes: T[]) {
            if (nodes.some(node => node.floating) && !($util.hasBit($enum.NODE_ALIGNMENT.HORIZONTAL, alignmentType) && nodes.every(node => node.float === 'right'))) {
                nodes.sort((a, b) => {
                    if (a.floating && !b.floating) {
                        return a.float === 'left' ? -1 : 1;
                    }
                    else if (!a.floating && b.floating) {
                        return b.float === 'left' ? 1 : -1;
                    }
                    else if (a.floating && b.floating) {
                        if (a.float !== b.float) {
                            return a.float === 'left' ? -1 : 1;
                        }
                        else if (a.float === 'right' && b.float === 'right') {
                            return -1;
                        }
                    }
                    return 0;
                });
                return true;
            }
            return false;
        }
        return sortHorizontal(list);
    }
    return false;
}

function adjustBaseline<T extends View>(baseline: T, nodes: T[]) {
    if (nodes.length) {
        for (const node of nodes) {
            if (node !== baseline) {
                if (node.imageElement && node.actualHeight > baseline.actualHeight) {
                    if (node.renderParent && $util.withinFraction(node.linear.top, node.renderParent.box.top)) {
                        node.anchor('top', 'true');
                    }
                }
                else if (node.baseElement || node.layoutHorizontal && node.renderChildren.every(item => item.baseline)) {
                    node.anchor('baseline', baseline.stringId);
                }
            }
        }
    }
}

function checkSingleLine<T extends View>(node: T, nowrap = false) {
    if (node.textElement && node.cssParent('textAlign', true) !== 'center' && (nowrap || (!node.hasWidth && !node.multiLine && node.textContent.trim().split(String.fromCharCode(32)).length > 0))) {
        node.android('singleLine', 'true');
    }
}

function adjustDocumentRootOffset<T extends View>(value: number, parent: T, direction: string, boxReset = false) {
    if (value > 0) {
        if (!boxReset) {
            value -= parent[`padding${direction}`];
        }
        if (parent.documentBody) {
            value -= parent[`margin${direction}`];
        }
        return Math.max(value, 0);
    }
    return value;
}

function adjustFloatingNegativeMargin<T extends View>(node: T, previous: T) {
    if (previous.float === 'left') {
        if (previous.marginRight < 0) {
            const right = Math.abs(previous.marginRight);
            node.modifyBox($enum.BOX_STANDARD.MARGIN_LEFT, (previous.bounds.width + (previous.hasWidth ? previous.paddingLeft + previous.borderLeftWidth : 0)) - right);
            node.anchor('left', previous.stringId);
            previous.modifyBox($enum.BOX_STANDARD.MARGIN_RIGHT, null);
            return true;
        }
    }
    else if (node.float === 'right' && previous.float === 'right') {
        if (previous.marginLeft < 0) {
            const left = Math.abs(previous.marginLeft);
            if (left < previous.bounds.width) {
                node.modifyBox($enum.BOX_STANDARD.MARGIN_RIGHT, previous.bounds.width - left);
            }
            node.anchor('right', previous.stringId);
            previous.modifyBox($enum.BOX_STANDARD.MARGIN_LEFT, null);
            return true;
        }
    }
    return false;
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
            node.android(`layout_${dimension.toLowerCase()}`, node.convertPercent(value, dimension === 'Width'));
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

function isTargeted<T extends View>(node: T, parent: T) {
    if (parent.baseElement && node.dataset.target) {
        const element = document.getElementById(node.dataset.target);
        return !!element && element !== parent.baseElement;
    }
    return false;
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

    public readonly localSettings: ControllerSettings = {
        baseTemplate: BASE_TMPL,
        layout: {
            pathName: 'res/layout',
            fileExtension: 'xml'
        },
        unsupported: {
            excluded: new Set(['BR']),
            tagName: new Set(['OPTION', 'MAP', 'AREA', 'IFRAME', 'svg'])
        },
        relative: {
            boxWidthWordWrapPercent: 0.9,
            superscriptFontScale: -4,
            subscriptFontScale: 4
        },
        constraint: {
            withinParentBottomOffset: 3.5,
            percentAccuracy: 4
        }
    };

    public finalize(data: SessionData<$NodeList<T>>) {
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
                    node.android(node.length ? 'layoutDirection' : 'textDirection', 'rtl');
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
            const cache: StringMap[] = data.cache.visible.map(node => ({ pattern: $xml.formatPlaceholder(node.id, '@'), attributes: parseAttributes(node) }));
            for (const value of [...data.views, ...data.includes]) {
                cache.forEach(item => value.content = value.content.replace(item.pattern, item.attributes));
                value.content = value.content.replace(`{#0}`, getRootNamespace(value.content));
            }
        }
        for (const value of [...data.views, ...data.includes]) {
            value.content = replaceUnit(value.content, settings.resolutionDPI, settings.convertPixels);
            value.content = replaceTab(value.content, settings.insertSpaces);
            value.content = $xml.removePlaceholderAll(value.content).replace(/\n\n/g, '\n');
        }
    }

    public processUnknownParent(layout: $Layout<T>) {
        const [node, parent] = [layout.node, layout.parent];
        let next = false;
        let renderAs: T | undefined;
        if (node.has('columnCount')) {
            layout.columnCount = node.toInt('columnCount');
            layout.setType(CONTAINER_NODE.CONSTRAINT, $enum.NODE_ALIGNMENT.COLUMN, $enum.NODE_ALIGNMENT.AUTO_LAYOUT);
        }
        else if (layout.some(item => !item.pageFlow)) {
            layout.setType(CONTAINER_NODE.CONSTRAINT, $enum.NODE_ALIGNMENT.ABSOLUTE, $enum.NODE_ALIGNMENT.UNKNOWN);
        }
        else {
            if (layout.length === 1) {
                const child = node.item(0) as T;
                if (node.documentRoot && isTargeted(child, node)) {
                    node.hide();
                    next = true;
                }
                else if (
                    this.userSettings.collapseUnattributedElements &&
                    node.positionStatic &&
                    !$util.hasValue(node.element.id) &&
                    !$util.hasValue(node.dataset.import) &&
                    !$util.hasValue(node.dataset.target) &&
                    !node.hasWidth &&
                    !node.hasHeight &&
                    !node.visibleStyle.background &&
                    !node.has('textAlign') && !node.has('verticalAlign') &&
                    node.toInt('lineHeight') > 0 &&
                    !node.rightAligned && !node.autoMargin.horizontal &&
                    !child.hasWidth &&
                    !child.visibleStyle.borderWidth &&
                    !this.hasAppendProcessing(node.id))
                {
                    child.documentRoot = node.documentRoot;
                    child.siblingIndex = node.siblingIndex;
                    child.parent = parent;
                    node.renderAs = child;
                    node.resetBox($enum.BOX_STANDARD.MARGIN | $enum.BOX_STANDARD.PADDING, child, true);
                    node.hide();
                    renderAs = child;
                }
                else {
                    layout.setType(CONTAINER_NODE.FRAME, $enum.NODE_ALIGNMENT.SINGLE);
                }
            }
            else {
                layout.init();
                if (node.baseElement && $dom.hasLineBreak(node.baseElement, true)) {
                    layout.setType(CONTAINER_NODE.LINEAR, $enum.NODE_ALIGNMENT.VERTICAL, $enum.NODE_ALIGNMENT.UNKNOWN);
                }
                else if (this.checkConstraintFloat(layout)) {
                    layout.setType(CONTAINER_NODE.CONSTRAINT);
                }
                else if (layout.linearX) {
                    if (this.checkFrameHorizontal(layout)) {
                        layout.renderType = $enum.NODE_ALIGNMENT.FLOAT | $enum.NODE_ALIGNMENT.HORIZONTAL;
                    }
                    else if (this.checkConstraintHorizontal(layout)) {
                        layout.setType(CONTAINER_NODE.CONSTRAINT);
                    }
                    else if (this.checkRelativeHorizontal(layout)) {
                        layout.setType(CONTAINER_NODE.RELATIVE);
                    }
                    else {
                        layout.setType(CONTAINER_NODE.LINEAR);
                        if (layout.floated.size) {
                            layout.renderPosition = sortByAlignment(layout.children, $enum.NODE_ALIGNMENT.FLOAT);
                        }
                    }
                    layout.add($enum.NODE_ALIGNMENT.HORIZONTAL);
                }
                else if (layout.linearY) {
                    layout.setType(CONTAINER_NODE.LINEAR, $enum.NODE_ALIGNMENT.VERTICAL, node.documentRoot ? $enum.NODE_ALIGNMENT.UNKNOWN : 0);
                }
                else if (layout.every(item => item.inlineFlow)) {
                    if (this.checkFrameHorizontal(layout)) {
                        layout.renderType = $enum.NODE_ALIGNMENT.FLOAT | $enum.NODE_ALIGNMENT.HORIZONTAL;
                    }
                    else {
                        layout.setType(CONTAINER_NODE.RELATIVE, $enum.NODE_ALIGNMENT.HORIZONTAL, $enum.NODE_ALIGNMENT.UNKNOWN);
                    }
                }
                else if (layout.some(item => item.alignedVertically(item.previousSiblings(), layout.children, layout.cleared))) {
                    layout.setType(CONTAINER_NODE.LINEAR, $enum.NODE_ALIGNMENT.VERTICAL, $enum.NODE_ALIGNMENT.UNKNOWN);
                }
                else {
                    layout.setType(CONTAINER_NODE.CONSTRAINT, $enum.NODE_ALIGNMENT.UNKNOWN);
                }
            }
        }
        return { layout, next, renderAs };
    }

    public processUnknownChild(layout: $Layout<T>) {
        const [node, parent] = [layout.node, layout.parent];
        const visible = node.visibleStyle;
        let next = false;
        if (node.inlineText || visible.borderWidth && node.textContent.length) {
            layout.setType(CONTAINER_NODE.TEXT);
        }
        else if (visible.backgroundImage && !visible.backgroundRepeat && (!node.inlineText || node.toInt('textIndent') + node.bounds.width < 0)) {
            layout.setType(CONTAINER_NODE.IMAGE, $enum.NODE_ALIGNMENT.SINGLE);
            node.exclude({ resource: $enum.NODE_RESOURCE.FONT_STYLE | $enum.NODE_RESOURCE.VALUE_STRING });
        }
        else if (node.block && (visible.borderWidth || visible.backgroundImage || visible.paddingVertical)) {
            layout.setType(CONTAINER_NODE.LINE);
        }
        else if (!node.documentRoot) {
            if (this.userSettings.collapseUnattributedElements && node.bounds.height === 0 && !visible.background && !$util.hasValue(node.element.id) && !$util.hasValue(node.dataset.import)) {
                parent.remove(node);
                node.hide();
                next = true;
            }
            else {
                layout.setType(visible.background ? CONTAINER_NODE.TEXT : CONTAINER_NODE.FRAME);
            }
        }
        return { layout, next };
    }

    public processTraverseHorizontal(layout: $Layout<T>, siblings?: T[]) {
        const parent = layout.parent;
        if (this.checkFrameHorizontal(layout)) {
            layout.node = this.createNodeGroup(layout.node, layout.children, layout.parent);
            layout.renderType |= $enum.NODE_ALIGNMENT.FLOAT | $enum.NODE_ALIGNMENT.HORIZONTAL;
        }
        else if (siblings === undefined || layout.length !== siblings.length) {
            layout.node = this.createNodeGroup(layout.node, layout.children, layout.parent);
            this.processLayoutHorizontal(layout);
        }
        else {
            parent.alignmentType |= $enum.NODE_ALIGNMENT.HORIZONTAL;
        }
        return { layout };
    }

    public processTraverseVertical(layout: $Layout<T>, siblings?: T[]) {
        const parent = layout.parent;
        if (layout.floated.size && layout.cleared.size && !(layout.floated.size === 1 && layout.every((node, index) => index === 0 || index === layout.length - 1 || layout.cleared.has(node)))) {
            if (!parent.layoutVertical || $util.hasValue(layout.node.dataset.import)) {
                layout.node = this.createNodeGroup(layout.node, layout.children, parent);
            }
            layout.renderType |= $enum.NODE_ALIGNMENT.FLOAT | $enum.NODE_ALIGNMENT.VERTICAL;
        }
        else if (siblings === undefined || layout.length !== siblings.length) {
            if (!parent.layoutVertical) {
                layout.node = this.createNodeGroup(layout.node, layout.children, parent);
                layout.setType(CONTAINER_NODE.LINEAR, $enum.NODE_ALIGNMENT.VERTICAL);
            }
        }
        else {
            parent.alignmentType |= $enum.NODE_ALIGNMENT.VERTICAL;
        }
        return { layout };
    }

    public processLayoutHorizontal(layout: $Layout<T>, strictMode = false) {
        let containerType = 0;
        if (this.checkConstraintFloat(layout)) {
            layout.setType(CONTAINER_NODE.CONSTRAINT);
        }
        else if (this.checkConstraintHorizontal(layout)) {
            containerType = CONTAINER_NODE.CONSTRAINT;
        }
        else if (this.checkRelativeHorizontal(layout)) {
            containerType = CONTAINER_NODE.RELATIVE;
        }
        else if (!strictMode || layout.linearX && !layout.floated.has('right')) {
            containerType = CONTAINER_NODE.LINEAR;
            if (layout.floated.size) {
                layout.renderPosition = sortByAlignment(layout.children, $enum.NODE_ALIGNMENT.FLOAT);
            }
        }
        if (containerType !== 0) {
            layout.setType(containerType, $enum.NODE_ALIGNMENT.HORIZONTAL);
        }
        return { layout };
    }

    public sortRenderPosition(parent: T, children: T[]) {
        if (parent.layoutConstraint && children.some(item => !item.pageFlow)) {
            const ordered: T[] = [];
            const below: T[] = [];
            const middle: T[] = [];
            const above: T[] = [];
            for (const item of children) {
                const zIndex = item.toInt('zIndex');
                if (item.pageFlow || item.actualParent !== parent) {
                    middle.push(item);
                }
                else {
                    if (zIndex >= 0) {
                        above.push(item);
                    }
                    else {
                        below.push(item);
                    }
                }
            }
            ordered.push(...$util.sortAsc(below, 'style.zIndex', 'id'));
            ordered.push(...middle);
            ordered.push(...$util.sortAsc(above, 'style.zIndex', 'id'));
            return ordered;
        }
        return [];
    }

    public checkFrameHorizontal(layout: $Layout<T>) {
        const [floating, sibling] = layout.partition(node => node.floating);
        if (layout.floated.size === 2 || layout.cleared.size || layout.some(node => node.pageFlow && node.autoMargin.horizontal)) {
            return true;
        }
        if (sibling.length) {
            if (layout.floated.has('right')) {
                return true;
            }
            else {
                const flowIndex = $util.minArray(sibling.map(node => node.siblingIndex));
                const floatMap = floating.map(node => node.siblingIndex);
                return layout.floated.has('left') && floatMap.some(value => value > flowIndex);
            }
        }
        return false;
    }

    public checkConstraintFloat(layout: $Layout<T>) {
        return layout.floated.size === 1 && layout.every(node => node.pageFlow && node.floating && node.marginLeft >= 0 && node.marginRight >= 0 && node.css('width') !== '100%');
    }

    public checkConstraintHorizontal(layout: $Layout<T>) {
        return !layout.parent.hasHeight && new Set(layout.map(node => node.bounds.height)).size !== 1 && layout.some(node => node.verticalAlign === 'bottom') && layout.every(node => node.inlineVertical && (node.baseline || node.verticalAlign === 'bottom'));
    }

    public checkRelativeHorizontal(layout: $Layout<T>) {
        const [floating, sibling] = layout.partition(node => node.floating);
        const minFlow = $util.minArray(sibling.map(node => node.siblingIndex));
        const maxFloat = $util.maxArray(floating.map(node => node.siblingIndex));
        if (layout.floated.size === 2 || maxFloat > minFlow) {
            return false;
        }
        return layout.some(node => node.positionRelative || node.textElement || node.imageElement || !node.baseline);
    }

    public setConstraints() {
        for (const node of this.cache.visible) {
            if (!node.hasBit('excludeProcedure', $enum.NODE_PROCEDURE.CONSTRAINT)) {
                const children = node.renderChildren.filter(item => !item.positioned) as T[];
                if (children.length) {
                    if (node.layoutConstraint) {
                        const [pageFlow, absolute] = $util.partition(children, item => item.pageFlow);
                        const boxParent = node.actualBoxParent as T;
                        const bottomParent = absolute.length ? Math.max($util.maxArray(node.renderChildren.map(item => item.linear.bottom)), node.box.bottom) : node.box.bottom;
                        for (const item of absolute) {
                            if (!item.positionAuto && (item.documentParent === item.absoluteParent || item.position === 'fixed')) {
                                if (item.hasWidth && item.autoMargin.horizontal) {
                                    if (item.has('left') && item.autoMargin.right) {
                                        item.anchor('left', 'parent');
                                        item.modifyBox($enum.BOX_STANDARD.MARGIN_LEFT, item.left);
                                    }
                                    else if (item.has('right') && item.autoMargin.left) {
                                        item.anchor('right', 'parent');
                                        item.modifyBox($enum.BOX_STANDARD.MARGIN_RIGHT, item.right);
                                    }
                                    else {
                                        item.anchorParent(AXIS_ANDROID.HORIZONTAL);
                                        item.modifyBox($enum.BOX_STANDARD.MARGIN_LEFT, item.left);
                                        item.modifyBox($enum.BOX_STANDARD.MARGIN_RIGHT, item.right);
                                    }
                                }
                                else {
                                    const hasLeft = item.has('left');
                                    if (hasLeft) {
                                        item.anchor('left', 'parent');
                                        item.modifyBox($enum.BOX_STANDARD.MARGIN_LEFT, adjustDocumentRootOffset(item.left, item.documentParent as T, 'Left'));
                                    }
                                    if ((!item.hasWidth || !hasLeft) && item.has('right')) {
                                        item.anchor('right', 'parent');
                                        item.modifyBox($enum.BOX_STANDARD.MARGIN_RIGHT, adjustDocumentRootOffset(item.right, item.documentParent as T, 'Right'));
                                    }
                                }
                                if (item.hasHeight && item.autoMargin.vertical) {
                                    if (item.has('top') && item.autoMargin.bottom) {
                                        item.anchor('top', 'parent');
                                        item.modifyBox($enum.BOX_STANDARD.MARGIN_TOP, item.top);
                                    }
                                    else if (item.has('bottom') && item.autoMargin.top) {
                                        item.anchor('bottom', 'parent');
                                        item.modifyBox($enum.BOX_STANDARD.MARGIN_BOTTOM, item.bottom);
                                    }
                                    else {
                                        item.anchorParent(AXIS_ANDROID.VERTICAL);
                                        item.modifyBox($enum.BOX_STANDARD.MARGIN_TOP, item.top);
                                        item.modifyBox($enum.BOX_STANDARD.MARGIN_BOTTOM, item.bottom);
                                    }
                                }
                                else {
                                    const hasTop = item.has('top');
                                    if (hasTop) {
                                        const reset = boxParent.valueBox($enum.BOX_STANDARD.PADDING_TOP);
                                        item.anchor('top', 'parent');
                                        item.modifyBox($enum.BOX_STANDARD.MARGIN_TOP, adjustDocumentRootOffset(item.top, item.documentParent as T, 'Top', reset[0] === 1));
                                    }
                                    if ((!item.hasHeight || !hasTop) && item.has('bottom')) {
                                        const reset = boxParent.valueBox($enum.BOX_STANDARD.PADDING_BOTTOM);
                                        item.anchor('bottom', 'parent');
                                        item.modifyBox($enum.BOX_STANDARD.MARGIN_BOTTOM, adjustDocumentRootOffset(item.bottom, item.documentParent as T, 'Bottom', reset[0] === 1));
                                    }
                                }
                                item.positioned = true;
                            }
                        }
                        if (node.layoutHorizontal) {
                            this.processConstraintHorizontal(node, pageFlow);
                        }
                        else if (node.hasAlign($enum.NODE_ALIGNMENT.COLUMN)) {
                            this.processConstraintColumn(node, pageFlow);
                        }
                        else if (pageFlow.length > 1) {
                            this.processConstraintChain(node, pageFlow, boxParent, bottomParent);
                        }
                        else {
                            for (const item of pageFlow) {
                                if (item.autoMargin.leftRight || (item.inlineStatic && item.cssParent('textAlign', true) === 'center')) {
                                    item.anchorParent(AXIS_ANDROID.HORIZONTAL);
                                }
                                else if (item.rightAligned) {
                                    item.anchor('right', 'parent');
                                }
                                else if ($util.withinFraction(item.linear.left, boxParent.box.left) || item.linear.left < boxParent.box.left) {
                                    item.anchor('left', 'parent');
                                }
                                if ($util.withinFraction(item.linear.top, boxParent.box.top) || item.linear.top < boxParent.box.top) {
                                    item.anchor('top', 'parent');
                                }
                                if (item.actualParent && !item.actualParent.documentBody && this.withinParentBottom(item.linear.bottom, bottomParent)) {
                                    item.anchor('bottom', 'parent');
                                }
                            }
                        }
                        Controller.anchorEvaluate(pageFlow);
                        children.forEach(item => {
                            if (!item.anchored) {
                                this.addGuideline(item, node);
                                if (item.pageFlow) {
                                    Controller.anchorEvaluate(pageFlow);
                                }
                            }
                            if (!item.hasWidth && item.alignParent('left') && item.alignParent('right')) {
                                item.android('layout_width', 'match_parent');
                            }
                            if (!item.hasHeight && item.alignParent('top') && item.alignParent('bottom')) {
                                item.android('layout_height', 'match_parent');
                            }
                        });
                    }
                    else if (node.layoutRelative) {
                        this.processRelativeHorizontal(node, children);
                    }
                }
            }
        }
    }

    public renderNodeGroup(layout: $Layout<T>) {
        const [node, parent, containerType, alignmentType] = [layout.node, layout.parent, layout.containerType, layout.alignmentType];
        const options = createAttribute();
        let valid = false;
        switch (containerType) {
            case CONTAINER_NODE.LINEAR: {
                if ($util.hasBit(alignmentType, $enum.NODE_ALIGNMENT.VERTICAL)) {
                    options.android.orientation = AXIS_ANDROID.VERTICAL;
                    valid = true;
                }
                else if ($util.hasBit(alignmentType, $enum.NODE_ALIGNMENT.HORIZONTAL)) {
                    options.android.orientation = AXIS_ANDROID.HORIZONTAL;
                    valid = true;
                }
                break;
            }
            case CONTAINER_NODE.GRID: {
                options.android.rowCount = layout.rowCount ? layout.rowCount.toString() : '';
                options.android.columnCount = layout.columnCount ? layout.columnCount.toString() : '2';
                valid = true;
                break;
            }
            case CONTAINER_NODE.FRAME:
            case CONTAINER_NODE.RELATIVE:
            case CONTAINER_NODE.CONSTRAINT: {
                valid = true;
                break;
            }
        }
        if (valid) {
            const target = $util.hasValue(node.dataset.target) && !$util.hasValue(node.dataset.include);
            const controlName = View.getControlName(containerType);
            node.alignmentType |= alignmentType;
            node.setControlType(controlName, containerType);
            node.render(target ? node : parent);
            node.apply(options);
            return $xml.getEnclosingTag(controlName, node.id, target ? -1 : node.renderDepth, $xml.formatPlaceholder(node.id));
        }
        return '';
    }

    public renderNode(layout: $Layout<T>) {
        const [node, parent, containerType, alignmentType] = [layout.node, layout.parent, layout.containerType, layout.alignmentType];
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
                                node.css('width', $util.formatPX(match[1]), true);
                            }
                        }
                        if (height === 0) {
                            const match = /height="(\d+)"/.exec(element.outerHTML);
                            if (match) {
                                height = parseInt(match[1]);
                                node.css('height', $util.formatPX(match[1]), true);
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
                    if (width > 0 && height === 0 || width === 0 && height > 0) {
                        node.android('adjustViewBounds', 'true');
                    }
                    if (node.baseline) {
                        node.android('baselineAlignBottom', 'true');
                    }
                    const src = Resource.addImageSrcSet(element);
                    if (src !== '') {
                        node.android('src', `@drawable/${src}`);
                    }
                    if (!node.pageFlow && node.left < 0 || node.top < 0) {
                        const absoluteParent = node.absoluteParent;
                        if (absoluteParent && absoluteParent.css('overflow') === 'hidden') {
                            const container = new View(
                                this.cache.nextId,
                                $dom.createElement(parent.actualBoxParent.baseElement),
                                this.delegateNodeInit
                            ) as T;
                            container.setControlType(CONTAINER_ANDROID.FRAME, CONTAINER_NODE.FRAME);
                            container.init();
                            container.inherit(node, 'base');
                            container.css('zIndex', node.css('zIndex'));
                            container.companion = node;
                            container.exclude({ procedure: $enum.NODE_PROCEDURE.ALL, resource: $enum.NODE_RESOURCE.ALL });
                            parent.appendTry(node, container);
                            this.cache.append(container);
                            if (width > 0) {
                                container.android('layout_width', width < parent.box.width ? $util.formatPX(width) : 'match_parent');
                            }
                            else {
                                container.android('layout_width', 'wrap_content');
                            }
                            if (height > 0) {
                                container.android('layout_height', height < parent.box.height ? $util.formatPX(height) : 'match_parent');
                            }
                            else {
                                container.android('layout_height', 'wrap_content');
                            }
                            container.render(target ? container : parent);
                            node.modifyBox($enum.BOX_STANDARD.MARGIN_TOP, node.top);
                            node.modifyBox($enum.BOX_STANDARD.MARGIN_LEFT, node.left);
                            node.render(container);
                            return $xml.getEnclosingTag(
                                CONTAINER_ANDROID.FRAME,
                                container.id,
                                target ? -1 : container.renderDepth,
                                $xml.getEnclosingTag(controlName, node.id, target ? 0 : node.renderDepth)
                            );
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
                if (element.maxLength) {
                    node.android('maxLength', element.maxLength.toString());
                }
                if (!node.hasWidth) {
                    if (element.cols) {
                        node.css('width', $util.formatPX(element.cols * 10), true);
                    }
                }
                node.android('hint', element.placeholder);
                node.android('scrollbars', AXIS_ANDROID.VERTICAL);
                node.android('inputType', 'textMultiLine');
                if (node.overflowX) {
                    node.android('scrollHorizontally', 'true');
                }
                if (!node.cssInitial('verticalAlign')) {
                    node.css('verticalAlign', 'text-bottom');
                }
                break;
            }
            case 'SELECT': {
                const element = <HTMLSelectElement> node.element;
                if (element.size > 1 && !node.cssInitial('verticalAlign')) {
                    node.css('verticalAlign', 'text-bottom');
                }
                break;
            }
            case 'INPUT': {
                const element = <HTMLInputElement> node.element;
                switch (element.type) {
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
                            node.css('width', $util.formatPX(element.size * 10), true);
                        }
                        break;
                }
                break;
            }
        }
        if (node.inlineVertical) {
            switch (node.verticalAlign) {
                case 'sub':
                    node.modifyBox($enum.BOX_STANDARD.MARGIN_TOP, Math.ceil(node.fontSize / this.localSettings.relative.subscriptFontScale));
                    break;
                case 'super':
                    node.modifyBox($enum.BOX_STANDARD.MARGIN_TOP, Math.ceil(node.fontSize / this.localSettings.relative.superscriptFontScale));
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
            case CONTAINER_ANDROID.BUTTON:
                if (!node.cssInitial('verticalAlign')) {
                    node.css('verticalAlign', 'text-bottom');
                }
                break;
            case CONTAINER_ANDROID.LINE:
                if (!node.hasHeight) {
                    node.android('layout_height', $util.formatPX(node.contentBoxHeight || 1));
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
        node.android('layout_width', width, false);
        node.android('layout_height', height, false);
        if (node.containerType === 0 || node.controlName === '') {
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
            options.android.layout_columnWeight = percentWidth;
            options.android.layout_columnSpan = columnSpan.toString();
        }
        if (rowSpan > 0) {
            options.android.layout_rowWeight = percentHeight;
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
        const documentParent = parent.groupParent ? parent : node.documentParent;
        [AXIS_ANDROID.HORIZONTAL, AXIS_ANDROID.VERTICAL].forEach((value, index) => {
            if (!node.constraint[value] && (orientation === '' || value === orientation)) {
                const horizontal = index === 0;
                const dimension = node.positionStatic ? 'bounds' : 'linear';
                let LT: string;
                let RB: string;
                let LTRB: string;
                let RBLT: string;
                let offset = 0;
                if (horizontal) {
                    LT = !opposite ? 'left' : 'right';
                    RB = !opposite ? 'right' : 'left';
                    LTRB = !opposite ? 'leftRight' : 'rightLeft';
                    RBLT = !opposite ? 'rightLeft' : 'leftRight';
                    if (node.positionRelative && node.left < 0) {
                        offset = node.left;
                    }
                    if (node.marginLeft < 0) {
                        offset -= node.marginLeft;
                    }
                }
                else {
                    LT = !opposite ? 'top' : 'bottom';
                    RB = !opposite ? 'bottom' : 'top';
                    LTRB = !opposite ? 'topBottom' : 'bottomTop';
                    RBLT = !opposite ? 'bottomTop' : 'topBottom';
                    if (node.positionRelative && node.top < 0) {
                        offset = node.top;
                    }
                    if (node.marginTop < 0) {
                        offset -= node.marginTop;
                    }
                }
                let beginPercent = 'layout_constraintGuide_';
                let usePercent = false;
                let location: number;
                if (!node.pageFlow && $util.isPercent(node.css(LT))) {
                    location = parseInt(node.css(LT)) / 100;
                    usePercent = true;
                    beginPercent += 'percent';
                }
                else {
                    if (!percent && !parent.hasAlign($enum.NODE_ALIGNMENT.AUTO_LAYOUT)) {
                        const found = parent.renderChildren.some(item => {
                            if (item !== node && item.constraint[value]) {
                                const pageFlow = node.pageFlow && item.pageFlow;
                                let valid = false;
                                if (pageFlow) {
                                    if ($util.withinFraction(node.linear[LT] + offset, item.linear[RB])) {
                                        node.anchor(LTRB, item.stringId, true);
                                        valid = true;
                                    }
                                    else if ($util.withinFraction(node.linear[RB] + offset, item.linear[LT])) {
                                        node.anchor(RBLT, item.stringId, true);
                                        valid = true;
                                    }
                                }
                                if (pageFlow || !node.pageFlow && !item.pageFlow) {
                                    if ($util.withinFraction(node.linear[LT] + offset, item.linear[LT])) {
                                        node.anchor(!horizontal && node.textElement && item.textElement && item.baseline && node.baseline && node.bounds.height === item.bounds.height ? 'baseline' : LT, item.stringId, true);
                                        valid = true;
                                    }
                                    else if ($util.withinFraction(node.linear[RB] + offset, item.linear[RB])) {
                                        node.anchor(RB, item.stringId, true);
                                        valid = true;
                                    }
                                }
                                if (valid) {
                                    item.constraint[value] = true;
                                    return true;
                                }
                            }
                            return false;
                        });
                        if (found) {
                            return;
                        }
                    }
                    if (node.positionAuto) {
                        const previousSiblings = node.previousSiblings() as T[];
                        if (previousSiblings.length && !node.alignedVertically(previousSiblings)) {
                            const previous = previousSiblings[previousSiblings.length - 1];
                            if (previous.renderParent === node.renderParent) {
                                node.anchor(horizontal ? 'rightLeft' : 'top', previous.stringId, true);
                                node.constraint[value] = previous.constraint[value];
                                return;
                            }
                        }
                    }
                    if (percent) {
                        const position = Math.abs((node[dimension][LT] + offset) - (documentParent.documentBody ? 0 : documentParent.box[LT])) / documentParent.box[horizontal ? 'width' : 'height'];
                        location = parseFloat(Math.abs(position - (!opposite ? 0 : 1)).toFixed(this.localSettings.constraint.percentAccuracy));
                        usePercent = true;
                        beginPercent += 'percent';
                    }
                    else {
                        location = (node[dimension][LT] + offset) - (documentParent.documentBody ? 0 : documentParent.box[!opposite ? LT : RB]);
                        beginPercent += 'begin';
                    }
                }
                const guideline = parent.constraint.guideline || {};
                if (!node.pageFlow) {
                    if (horizontal) {
                        location = adjustDocumentRootOffset(location, documentParent as T, 'Left');
                    }
                    else {
                        location = adjustDocumentRootOffset(location, documentParent as T, 'Top');
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
                else if (
                    horizontal && documentParent.hasWidth && location + node[dimension].width >= documentParent.box.right ||
                    !horizontal && documentParent.hasHeight && location + node[dimension].height >= documentParent.box.bottom)
                {
                    node.anchor(RB, 'parent', true);
                }
                else {
                    const anchors = $util.optionalAsObject(guideline, `${value}.${beginPercent}.${LT}`);
                    let found = false;
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
                        const options = createAttribute({
                            android: {
                                orientation: index === 0 ? AXIS_ANDROID.VERTICAL : AXIS_ANDROID.HORIZONTAL
                            },
                            app: {
                                [beginPercent]: usePercent ? location.toString() : $util.formatPX(location)
                            }
                        });
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
                        node.constraint[horizontal ? 'guidelineHorizontal' : 'guidelineVertical'] = stringId;
                    }
                }
                node.constraint[value] = true;
            }
        });
    }

    public createNodeGroup(node: T, children: T[], parent?: T, replaceWith?: T) {
        const group = new ViewGroup(this.cache.nextId, node, children, this.delegateNodeInit) as T;
        if (parent) {
            parent.appendTry(replaceWith || node, group);
            group.init();
        }
        this.cache.append(group);
        return group;
    }

    protected processRelativeHorizontal(node: T, children: T[]) {
        const edgeOrFirefox = $dom.isUserAgent($enum.USER_AGENT.EDGE | $enum.USER_AGENT.FIREFOX);
        const floatRight = children.every(item => item.float === 'right');
        const cleared = $NodeList.cleared(children);
        const boxWidth = Math.ceil((() => {
            const renderParent = node.renderParent;
            if (renderParent) {
                if (renderParent.overflowX) {
                    if (node.has('width', $enum.CSS_STANDARD.UNIT)) {
                        return node.toInt('width', true);
                    }
                    else if (renderParent.has('width', $enum.CSS_STANDARD.UNIT)) {
                        return renderParent.toInt('width', true);
                    }
                    else if (renderParent.has('width', $enum.CSS_STANDARD.PERCENT)) {
                        return renderParent.bounds.width - renderParent.contentBoxWidth;
                    }
                }
                else {
                    const floating = renderParent.children.filter((item: T) => item.float === 'left' && item.siblingIndex < node.siblingIndex).map(item => item.linear.right);
                    if (floating.length) {
                        const floatStart = $util.maxArray(floating);
                        if (children.some(item => item.linear.left === floatStart)) {
                            return node.box.right - floatStart;
                        }
                    }
                }
            }
            return node.box.width;
        })());
        const wrapWidth = boxWidth * this.localSettings.relative.boxWidthWordWrapPercent;
        const checkLineWrap = node.css('whiteSpace') !== 'nowrap';
        const alignParent = floatRight ? 'right' : 'left';
        const rows: T[][] = [];
        const rangeMultiLine = new Set<T>();
        let alignmentMultiLine = false;
        let rowWidth = 0;
        let rowPreviousLeft: T | undefined;
        let rowPreviousBottom: T | undefined;
        for (let i = 0; i < children.length; i++) {
            const item = children[i];
            const previous = children[i - 1];
            let dimension = item.bounds;
            if (item.inlineText && !item.hasWidth) {
                const bounds = $dom.getRangeClientRect(item.element);
                if (bounds.multiLine || bounds.width > 0 && bounds.width < item.box.width) {
                    dimension = bounds;
                    item.multiLine = bounds.multiLine;
                    if (edgeOrFirefox && bounds.multiLine && !/^\s*\n+/.test(item.textContent)) {
                        rangeMultiLine.add(item);
                    }
                }
            }
            let alignSibling = floatRight ? 'rightLeft' : 'leftRight';
            let siblings: Element[] = [];
            if (i === 0) {
                item.anchor(alignParent, 'true');
                rows.push([item]);
            }
            else {
                const baseWidth = (rowPreviousLeft && rows.length > 1 ? rowPreviousLeft.linear.width : 0) + rowWidth + item.marginLeft + (previous.float === 'left' && !cleared.has(item) ? 0 : dimension.width) - (edgeOrFirefox ? item.borderRightWidth : 0);
                function checkWidthWrap() {
                    return !item.rightAligned && (Math.floor(baseWidth) - (item.styleElement && item.inlineStatic ? item.paddingLeft + item.paddingRight : 0) > boxWidth);
                }
                if (adjustFloatingNegativeMargin(item, previous)) {
                    alignSibling = '';
                }
                const viewGroup = item.groupParent && !item.hasAlign($enum.NODE_ALIGNMENT.SEGMENTED);
                siblings = !viewGroup && previous.inlineVertical && item.inlineVertical ? $dom.getBetweenElements(previous.element, item.element, true) : [];
                const startNewRow = (() => {
                    if (item.textElement) {
                        let connected = false;
                        if (previous.textElement) {
                            if (i === 1 && item.plainText && !previous.rightAligned) {
                                connected = siblings.length === 0 && !/\s+$/.test(previous.textContent) && !/^\s+/.test(item.textContent);
                            }
                            if (connected) {
                                checkSingleLine(item, checkLineWrap);
                            }
                            if (checkLineWrap && !connected && (rangeMultiLine.has(previous) || previous.multiLine && $dom.hasLineBreak(previous.element, false, true))) {
                                return true;
                            }
                        }
                        if (checkLineWrap && !connected && (
                                checkWidthWrap() ||
                                item.multiLine && $dom.hasLineBreak(item.element) ||
                                item.preserveWhiteSpace && /^\n+/.test(item.textContent)
                           ))
                        {
                            return true;
                        }
                    }
                    return false;
                })();
                const rowItems = rows[rows.length - 1];
                const previousSiblings = item.previousSiblings();
                if (startNewRow || (
                        viewGroup ||
                        !item.textElement && checkWidthWrap() ||
                        item.linear.top >= previous.linear.bottom && (
                            item.blockStatic ||
                            item.float === 'left' && $util.withinFraction(item.linear.left, node.box.left) ||
                            item.float === 'right' && $util.withinFraction(item.linear.right, node.box.right)
                        ) ||
                        !item.floating && (
                            previous.blockStatic ||
                            previousSiblings.length && previousSiblings.some(sibling => sibling.lineBreak || (sibling.excluded && sibling.blockStatic)) ||
                            siblings.some(element => $dom.isLineBreak(element))
                        ) ||
                        cleared.has(item)
                   ))
                {
                    rowPreviousBottom = rowItems.filter(subitem => !subitem.floating)[0] || rowItems[0];
                    for (let j = 0; j < rowItems.length; j++) {
                        if (rowItems[j] !== rowPreviousBottom && rowItems[j].linear.bottom > rowPreviousBottom.linear.bottom && (!rowItems[j].floating || (rowItems[j].floating && rowPreviousBottom.floating))) {
                            rowPreviousBottom = rowItems[j];
                        }
                    }
                    item.anchor('topBottom', rowPreviousBottom.stringId);
                    if (rowPreviousLeft && item.linear.bottom <= rowPreviousLeft.bounds.bottom) {
                        item.anchor(alignSibling, rowPreviousLeft.stringId);
                    }
                    else {
                        item.anchor(alignParent, 'true');
                        rowPreviousLeft = undefined;
                    }
                    if (startNewRow && item.multiLine) {
                        checkSingleLine(previous, checkLineWrap);
                    }
                    rowWidth = Math.min(0, startNewRow && !previous.multiLine && !cleared.has(item) ? item.linear.right - node.box.right : 0);
                    rows.push([item]);
                }
                else {
                    if (alignSibling !== '') {
                        item.anchor(alignSibling, previous.stringId);
                    }
                    if (rowPreviousBottom) {
                        item.anchor('topBottom', rowPreviousBottom.stringId);
                    }
                    rowItems.push(item);
                }
            }
            if (item.float === 'left') {
                rowPreviousLeft = item;
            }
            let previousOffset = 0;
            if (siblings.length && !siblings.some(element => !!$dom.getElementAsNode(element) || $dom.isLineBreak(element))) {
                const betweenStart = $dom.getRangeClientRect(siblings[0]);
                const betweenEnd = siblings.length > 1 ? $dom.getRangeClientRect(siblings[siblings.length - 1]) : null;
                if (!betweenStart.multiLine && (betweenEnd === null || !betweenEnd.multiLine)) {
                    previousOffset = betweenEnd ? betweenStart.left - betweenEnd.right : betweenStart.width;
                }
            }
            rowWidth += previousOffset + item.marginLeft + dimension.width + item.marginRight;
            if (Math.ceil(rowWidth) >= wrapWidth && !item.alignParent(alignParent)) {
                checkSingleLine(item, checkLineWrap);
            }
        }
        if (rows.length > 1) {
            node.alignmentType |= $enum.NODE_ALIGNMENT.MULTILINE;
            alignmentMultiLine = true;
        }
        for (let i = 0; i < rows.length; i++) {
            const baseline: T[] = [];
            const optimal = $NodeList.baseline(rows[i]);
            const optimalText = $NodeList.baseline(rows[i], true)[0];
            const currentBaseline = optimal.length ? optimal[0] : null;
            let stringId = i === 0 ? 'true' : currentBaseline ? currentBaseline.stringId : '';
            const tryHeight = (child: T) => {
                if (!alignmentMultiLine) {
                    if (optimal.includes(child) || child.actualParent && child.actualHeight >= child.actualParent.box.height) {
                        return true;
                    }
                    else if (!node.hasHeight) {
                        node.css('height', $util.formatPX(node.bounds.height), true);
                    }
                }
                return false;
            };
            for (const item of rows[i]) {
                if (item !== currentBaseline) {
                    if (item.baseline) {
                        baseline.push(item);
                    }
                    else if (item.inlineVertical) {
                        switch (item.verticalAlign) {
                            case 'text-top':
                                if (optimalText) {
                                    item.anchor('top', optimalText.stringId);
                                }
                                break;
                            case 'super':
                            case 'top':
                                if (stringId) {
                                    item.anchor('top', stringId);
                                }
                                break;
                            case 'middle':
                                if (!alignmentMultiLine) {
                                    item.anchor('centerVertical', 'true');
                                }
                                else if (currentBaseline) {
                                    const height = Math.max(item.bounds.height, item.lineHeight);
                                    const heightParent = Math.max(currentBaseline.bounds.height, currentBaseline.lineHeight);
                                    if (height < heightParent) {
                                        item.anchor('top', currentBaseline.stringId);
                                        item.modifyBox($enum.BOX_STANDARD.MARGIN_TOP, Math.round((heightParent - height) / 2));
                                    }
                                }
                                break;
                            case 'text-bottom':
                                if (optimalText) {
                                    item.anchor('bottom', optimalText.stringId);
                                }
                                break;
                            case 'sub':
                            case 'bottom':
                                if (tryHeight(item)) {
                                    stringId = '';
                                }
                                if (stringId) {
                                    item.anchor('bottom', stringId);
                                }
                                break;
                        }
                    }
                }
            }
            if (currentBaseline) {
                adjustBaseline(currentBaseline, baseline);
                currentBaseline.baselineActive = true;
                if (node.lineHeight || currentBaseline.lineHeight) {
                    let offset = 0;
                    if (currentBaseline.lineHeight) {
                        offset = currentBaseline.lineHeight - currentBaseline.bounds.height;
                    }
                    else {
                        offset = node.lineHeight - (currentBaseline.bounds.height - (currentBaseline.paddingTop + currentBaseline.paddingBottom));
                    }
                    if (offset > 0) {
                        currentBaseline.modifyBox($enum.BOX_STANDARD.MARGIN_TOP, Math.floor(offset / 2));
                        currentBaseline.modifyBox($enum.BOX_STANDARD.MARGIN_BOTTOM, Math.ceil(offset / 2));
                    }
                }
            }
        }
    }

    protected processConstraintHorizontal(node: T, children: T[]) {
        const optimal: T | undefined = $NodeList.baseline(children)[0];
        const optimalText: T | undefined = $NodeList.baseline(children, true)[0];
        const reverse = node.hasAlign($enum.NODE_ALIGNMENT.RIGHT);
        if (optimal) {
            optimal.baselineActive = true;
        }
        for (let i = 0; i < children.length; i++) {
            const item = children[i];
            const previous = children[i - 1];
            if (i === 0) {
                item.anchor(reverse ? 'right' : 'left', 'parent');
            }
            else if (previous) {
                item.anchor(reverse ? 'rightLeft' : 'leftRight', previous.stringId);
            }
            if (item.inlineVertical) {
                switch (item.verticalAlign) {
                    case 'text-top':
                        if (optimalText && item !== optimalText) {
                            item.anchor('top', optimalText.stringId);
                        }
                        break;
                    case 'super':
                    case 'top':
                        item.anchor('top', 'parent');
                        break;
                    case 'middle':
                        item.anchorParent(AXIS_ANDROID.VERTICAL);
                        break;
                    case 'text-bottom':
                        if (optimalText && item !== optimalText) {
                            item.anchor('bottom', optimalText.stringId);
                        }
                        break;
                    case 'sub':
                    case 'bottom':
                        item.anchor('bottom', 'parent');
                        break;
                    case 'baseline':
                        if (optimal && item !== optimal) {
                            item.anchor('baseline', optimal.stringId);
                        }
                        break;
                }
            }
        }
    }

    protected processConstraintColumn(node: T, children: T[]) {
        const columnCount = node.toInt('columnCount');
        const perRowCount = Math.ceil(children.length / Math.min(columnCount, children.length));
        const columns: T[][] = [];
        for (let i = 0, j = 0; i < children.length; i++) {
            const item = children[i];
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
        const columnGap = $util.convertInt(node.css('columnGap')) || 16;
        const totalGap = columns.map(column => $util.maxArray(column.map(item => item.marginLeft + item.marginRight))).reduce((a, b) => a + b, 0);
        const percentGap = Math.max(((totalGap + (columnGap * (columnCount - 1))) / node.box.width) / columnCount, 0.01);
        const chainHorizontal: T[][] = [];
        const chainVertical: T[][] = [];
        const columnStart: T[] = [];
        for (let i = 0; i < columns.length; i++) {
            const column = columns[i];
            const first = column[0];
            if (i > 0) {
                first.android(first.localizeString(BOX_ANDROID.MARGIN_LEFT), $util.formatPX(first.marginLeft + columnGap));
            }
            columnStart.push(first);
            column.forEach(item => {
                if (item.has('width', $enum.CSS_STANDARD.PERCENT)) {
                    const percent = item.toInt('width');
                    item.android('layout_width', '0px');
                    item.app('layout_constraintWidth_percent', (percent ? percent / 100 : ((1 / columnCount) - percentGap)).toFixed(2));
                }
            });
            chainVertical.push(column);
        }
        chainHorizontal.push(columnStart);
        [chainHorizontal, chainVertical].forEach((partition, index) => {
            const horizontal = index === 0;
            partition.forEach(segment => {
                const rowStart = segment[0];
                const rowEnd = segment[segment.length - 1];
                rowStart.anchor(horizontal ? 'left' : 'top', 'parent');
                rowEnd.anchor(horizontal ? 'right' : 'bottom', 'parent');
                for (let i = 0; i < segment.length; i++) {
                    const chain = segment[i];
                    const previous: T | undefined = segment[i - 1];
                    const next: T | undefined = segment[i + 1];
                    if (horizontal) {
                        chain.app('layout_constraintVertical_bias', '0');
                    }
                    else {
                        if (i > 0) {
                            chain.anchor('left', rowStart.stringId);
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
                    rowStart.app('layout_constraintHorizontal_chainStyle', 'spread_inside');
                }
                else {
                    rowStart.app('layout_constraintVertical_chainStyle', 'packed');
                }
            });
        });
    }

    protected processConstraintChain(node: T, children: T[], boxParent: T, bottomParent: number) {
        const actualParent = $NodeList.actualParent(children);
        const chainHorizontal = $NodeList.partitionRows(children);
        let reverse = false;
        if (chainHorizontal.length > 1) {
            node.alignmentType |= $enum.NODE_ALIGNMENT.MULTILINE;
        }
        if (node.hasAlign($enum.NODE_ALIGNMENT.FLOAT)) {
            reverse = node.hasAlign($enum.NODE_ALIGNMENT.RIGHT);
            if (children.some(item => item.has('width', $enum.CSS_STANDARD.PERCENT))) {
                node.android('layout_width', 'match_parent');
            }
        }
        for (const item of children) {
            if (item.rightAligned) {
                if ($util.withinFraction(item.linear.right, boxParent.box.right) || item.linear.right > boxParent.box.right) {
                    item.anchor('right', 'parent');
                }
            }
            else if ($util.withinFraction(item.linear.left, boxParent.box.left) || item.linear.left < boxParent.box.left) {
                item.anchor('left', 'parent');
            }
            if ($util.withinFraction(item.linear.top, boxParent.box.top) || item.linear.top < boxParent.box.top) {
                item.anchor('top', 'parent');
            }
            if (actualParent && !actualParent.documentBody && this.withinParentBottom(item.linear.bottom, bottomParent)) {
                item.anchor('bottom', 'parent');
            }
        }
        chainHorizontal.forEach((segment, index) => {
            const rowStart = segment[0];
            const rowEnd = segment.length > 1 ? segment[segment.length - 1] : null;
            rowStart.anchor(reverse ? 'right' : 'left', 'parent');
            if (rowEnd) {
                if (actualParent && actualParent.css('textAlign') === 'center') {
                    rowStart.app('layout_constraintHorizontal_chainStyle', 'spread');
                }
                else {
                    rowStart.app('layout_constraintHorizontal_chainStyle', 'packed');
                    rowStart.app('layout_constraintHorizontal_bias', reverse || node.rightAligned ? '1' : '0');
                }
                rowEnd.anchor(reverse ? 'left' : 'right', 'parent');
            }
            for (let i = 0; i < segment.length; i++) {
                const chain = segment[i];
                const previous = segment[i - 1];
                const next = segment[i + 1];
                if (chain.autoMargin.leftRight) {
                    chain.anchorParent(AXIS_ANDROID.HORIZONTAL);
                }
                else {
                    if (previous) {
                        chain.anchor(reverse ? 'rightLeft' : 'leftRight', previous.stringId);
                    }
                    if (next) {
                        chain.anchor(reverse ? 'leftRight' : 'rightLeft', next.stringId);
                    }
                }
                Controller.dimensionConstraint(chain);
                if (index > 0) {
                    const abovePrevious = $NodeList.nextAboveBottom(chainHorizontal[index - 1], chain);
                    if (abovePrevious.length) {
                        const stringId = abovePrevious[0].stringId;
                        chain.anchor('topBottom', stringId);
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
                if (index === chainHorizontal.length - 1 && node.groupParent && chain.actualParent && !chain.actualParent.documentBody) {
                    chain.anchor('bottom', 'parent');
                }
            }
        });
        Controller.anchorEvaluate(children);
    }

    private withinParentBottom(bottom: number, boxBottom: number) {
        return $util.withinRange(bottom + this.localSettings.constraint.withinParentBottomOffset, boxBottom);
    }

    get userSettings() {
        return this.application.userSettings as UserSettingsAndroid;
    }

    get containerTypeHorizontal(): LayoutType {
        return {
            containerType: CONTAINER_NODE.LINEAR,
            alignmentType: $enum.NODE_ALIGNMENT.HORIZONTAL,
            renderType: 0
        };
    }

    get containerTypeVertical(): LayoutType {
        return {
            containerType: CONTAINER_NODE.LINEAR,
            alignmentType: $enum.NODE_ALIGNMENT.VERTICAL,
            renderType: 0
        };
    }

    get containerTypeVerticalMargin(): LayoutType {
        return {
            containerType: CONTAINER_NODE.FRAME,
            alignmentType: $enum.NODE_ALIGNMENT.COLUMN,
            renderType: 0
        };
    }

    get delegateNodeInit(): SelfWrapped<T, void> {
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