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
    let optimal: T | undefined;
    if (nodes.length > 1) {
        const result = $NodeList.textBaseline(nodes.filter(item => item.siblingflow && (item.baseline || item.textElement)));
        if (result.length) {
            optimal = result[0];
            const alignable = nodes.filter(item => item !== optimal && item.siblingflow);
            const baselineImage: T | undefined = alignable.filter(item => item.imageElement && item.baseline).sort((a, b) => a.actualHeight >= b.actualHeight ? 1 : -1)[0];
            for (const node of alignable) {
                if (node === baselineImage && node.actualHeight > optimal.actualHeight) {
                    optimal.anchor('bottom', node.stringId);
                    if ($util.withinFraction(node.linear.top, node.renderParent.box.top)) {
                        node.anchor('top', 'true');
                    }
                    continue;
                }
                if (node.domElement ||
                    node.layoutHorizontal && node.renderChildren.some(item => item.textElement && item.baseline))
                {
                    if (optimal.positionRelative && optimal.renderIndex === 0 && (optimal.top !== null || optimal.bottom !== null) && Math.max(node.actualHeight, node.lineHeight) < Math.max(optimal.bounds.height, optimal.lineHeight)) {
                        node.anchor(optimal.top !== null ? 'top' : 'bottom', optimal.stringId);
                    }
                    else if (
                        !node.positionRelative ||
                        node.toInt('top') === 0 && node.toInt('bottom') === 0)
                    {
                        node.anchor(node.is($enum.NODE_CONTAINER.BUTTON) ? 'bottom' : 'baseline', optimal.stringId);
                    }
                }
            }
        }
    }
    return optimal;
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
            tagName: new Set(['OPTION', 'MAP', 'AREA', 'IFRAME', 'svg'])
        },
        relative: {
            ellipsisOverflowWordsMinimum: 5,
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

    public checkConstraintHorizontal(data: $Layout<T>) {
        return !data.parent.hasHeight && new Set(data.map(node => node.bounds.height)).size !== 1 && data.some(node => node.verticalAlign === 'bottom') && data.every(node => node.inlineVertical && (node.baseline || node.verticalAlign === 'bottom'));
    }

    public checkConstraintFloat(data: $Layout<T>) {
        return (data.floated && data.floated.size === 1) && data.every(node => node.pageflow && node.floating && (!node.positionRelative || node.alignOrigin) && node.marginLeft >= 0 && node.marginRight >= 0 && node.css('width') !== '100%');
    }

    public checkFrameHorizontal(data: $Layout<T>) {
        const [floating, sibling] = $util.partition(data.children, node => node.floating);
        if (data.floated.size === 2 ||
            data.cleared.size > 0 ||
            data.floated.has('right') && sibling.length > 0 ||
            data.some(node => node.autoMargin.enabled) ||
            !data.linearX && floating.length > 0 && sibling.length > 0)
        {
            return true;
        }
        const flowIndex = $util.minArray(sibling.map(node => node.siblingIndex));
        const floatMap = floating.map(node => node.siblingIndex);
        return data.floated.has('left') && (
            floatMap.some(value => value > flowIndex) ||
            !data.linearX && floatMap.every(value => value < flowIndex)
        );
    }

    public checkRelativeHorizontal(data: $Layout<T>) {
        if (data.linearX && data.floated.has('right')) {
            return false;
        }
        const visible = data.filter(node => node.visible);
        const [floating, sibling] = $util.partition(visible, node => node.floating);
        const minFlow = $util.minArray(sibling.map(node => node.siblingIndex));
        const maxFloat = $util.maxArray(floating.map(node => node.siblingIndex));
        if (data.floated.size === 2 || maxFloat > minFlow) {
            return false;
        }
        return visible.some(node => node.textElement || node.svgElement || node.supSubscript || !node.baseline);
    }

    public setConstraints() {
        for (const node of this.cache.visible) {
            if (!node.hasBit('excludeProcedure', $enum.NODE_PROCEDURE.CONSTRAINT)) {
                const children = node.renderChildren.filter(item => !item.positioned) as T[];
                if (children.length) {
                    if (node.layoutRelative) {
                        this.processRelativeHorizontal(node, children);
                    }
                    else if (node.layoutConstraint) {
                        const [pageflow, absolute] = $util.partition(children, item => item.pageflow);
                        const boxParent = node.groupElement || pageflow.length === 0 ? node : pageflow[0].actualParent as T;
                        const bottomParent = absolute.length ? Math.max($util.maxArray(node.renderChildren.map(item => item.linear.bottom)), node.box.bottom) : node.box.bottom;
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
                            this.processConstraintHorizontal(node, pageflow);
                        }
                        else if (node.hasAlign($enum.NODE_ALIGNMENT.COLUMN)) {
                            this.processConstraintColumn(node, pageflow);
                        }
                        else if (pageflow.length > 1) {
                            this.processConstraintChain(node, pageflow, boxParent, bottomParent);
                        }
                        else {
                            for (const item of pageflow) {
                                if (item.autoMargin.horizontal || (item.inlineStatic && item.cssParent('textAlign', true) === 'center')) {
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
                            if (resetPadding && pageflow.length <= 1) {
                                const content: T | undefined = pageflow[0];
                                if (content) {
                                    if (content.alignParent('top')) {
                                        node.resetBox($enum.BOX_STANDARD.PADDING, content, true);
                                        if (this.withinParentBottom(content.linear.bottom, bottomParent)) {
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
                            if (!item.anchored) {
                                this.addGuideline(item, node);
                                if (item.pageflow) {
                                    Controller.anchorEvaluate(pageflow);
                                }
                            }
                        });
                    }
                }
            }
        }
    }

    public renderNodeGroup(data: $Layout<T>) {
        const CONTAINER = $enum.NODE_CONTAINER;
        const [node, parent, containerType, alignmentType] = [data.node, data.parent, data.containerType, data.alignmentType];
        const options = createAttribute();
        let valid = false;
        switch (containerType) {
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
                options.android.columnCount = data.columnCount ? data.columnCount.toString() : '2';
                valid = true;
                break;
            }
            case CONTAINER.FRAME:
            case CONTAINER.RELATIVE:
            case CONTAINER.CONSTRAINT: {
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
                    if (width > 0 && height === 0 || width === 0 && height > 0) {
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
                    if (node.baseline) {
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
                if (node.cssInitial('verticalAlign') === '') {
                    node.css('verticalAlign', 'text-bottom');
                }
                break;
            }
            case 'SELECT': {
                const element = <HTMLSelectElement> node.element;
                if (element.size > 1 && node.cssInitial('verticalAlign') === '') {
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
                            node.css('width', $util.formatPX(element.size * 10));
                        }
                        break;
                }
                break;
            }
        }
        if (node.element.tagName === 'SUB' || (node.inlineVertical && node.verticalAlign === 'sub')) {
            node.modifyBox($enum.BOX_STANDARD.MARGIN_TOP, Math.ceil(node.fontSize / this.localSettings.relative.subscriptFontScale));
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

    protected processRelativeHorizontal(node: T, children: T[]) {
        const settings = this.userSettings;
        const renderParent = node.renderParent;
        const actualParent = node.actualParent;
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
            else if (actualParent) {
                const floatStart = $util.maxArray(actualParent.initial.children.filter(item => item.float === 'left' && item.siblingIndex < node.siblingIndex).map(item => item.linear.right));
                if (children.some(item => item.linear.left === floatStart)) {
                    return node.box.right - floatStart;
                }
            }
            return node.box.width;
        })());
        const checkRowWrap = !node.hasAlign($enum.NODE_ALIGNMENT.NOWRAP);
        const checkLineWrap = node.css('whiteSpace') !== 'nowrap';
        const cleared = $NodeList.cleared(children);
        const edgeOrFirefox = $dom.isUserAgent($enum.USER_AGENT.EDGE | $enum.USER_AGENT.FIREFOX);
        const floatRight = children.every(item => item.float === 'right');
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
                    if (edgeOrFirefox && bounds.multiLine && !/^\s*\n+/.test(item.textContent)) {
                        rangeMultiLine.add(item);
                    }
                }
            }
            let alignSibling = floatRight ? 'rightLeft' : 'leftRight';
            let siblings: Element[] = [];
            if (i === 0) {
                item.anchor(alignParent, 'true');
                if (item.floating || !item.siblingflow) {
                    rowPreviousLeft = item;
                }
                rows.push([item]);
            }
            else {
                const baseWidth = (rowPreviousLeft && rows.length > 1 ? rowPreviousLeft.linear.width : 0) + rowWidth + item.marginLeft + (previous.float === 'left' && item.inlineStatic && !cleared.has(item) ? 0 : dimension.width) - (edgeOrFirefox ? item.borderRightWidth : 0);
                function checkWidthWrap() {
                    return !item.rightAligned && (Math.floor(baseWidth) - (item.styleElement && item.inlineStatic ? item.paddingLeft + item.paddingRight : 0) > boxWidth);
                }
                if (adjustFloatingNegativeMargin(item, previous)) {
                    alignSibling = '';
                }
                const viewGroup = item.groupElement && !item.hasAlign($enum.NODE_ALIGNMENT.SEGMENTED);
                siblings = !viewGroup && previous.inlineVertical && item.inlineVertical ? $dom.getBetweenElements(previous.element, item.element, false, true) : [];
                const startNewRow = (() => {
                    if (item.textElement) {
                        let connected = false;
                        if (previous.textElement) {
                            if (i === 1 && item.plainText && !previous.rightAligned) {
                                connected = siblings.length === 0 && !/\s+$/.test(previous.textContent) && !/^\s+/.test(item.textContent);
                            }
                            if (connected) {
                                this.checkSingleLine(item);
                            }
                            if (!checkRowWrap) {
                                return false;
                            }
                            if (checkLineWrap && !connected && (
                                    rangeMultiLine.has(previous) ||
                                    previous.multiLine && previous.textContent.trim() !== '' && !/^\s*\n+/.test(previous.textContent) && !/\n+\s*$/.test(previous.textContent) && $dom.hasLineBreak(previous.element)
                               ))
                            {
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
                const previousSibling = item.previousSibling();
                if (checkRowWrap && (
                        startNewRow || (
                            viewGroup ||
                            !item.textElement && checkWidthWrap() ||
                            item.linear.top >= previous.linear.bottom && (
                                item.blockStatic ||
                                item.float === 'left' && $util.withinFraction(item.linear.left, node.box.left) ||
                                item.float === 'right' && $util.withinFraction(item.linear.right, node.box.right)
                            ) ||
                            !item.floating && (
                                previous.blockStatic ||
                                previousSibling.length && previousSibling.some(sibling => sibling.lineBreak || (sibling.excluded && sibling.blockStatic)) ||
                                siblings.some(element => $dom.isLineBreak(element))
                            ) ||
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
                    item.anchor('topBottom', rowPreviousBottom.stringId);
                    if (rowPreviousLeft && item.linear.bottom <= rowPreviousLeft.bounds.bottom) {
                        item.anchor(alignSibling, rowPreviousLeft.stringId);
                    }
                    else {
                        item.anchor(alignParent, 'true');
                        rowPreviousLeft = undefined;
                    }
                    rowWidth = Math.min(0, startNewRow && !previous.multiLine && !cleared.has(item) ? item.linear.right - node.box.right : 0);
                    rows.push([item]);
                }
                else {
                    if (alignSibling !== '') {
                        item.anchor(alignSibling, previous.stringId);
                    }
                    if (baseWidth > boxWidth) {
                        this.checkSingleLine(item);
                    }
                    if (rowPreviousBottom) {
                        item.anchor('topBottom', rowPreviousBottom.stringId);
                    }
                    rowItems.push(item);
                }
            }
            let previousOffset = 0;
            if (siblings.length > 0 && !siblings.some(element => !!$dom.getElementAsNode(element) || $dom.isLineBreak(element))) {
                const betweenStart = $dom.getRangeClientRect(siblings[0]);
                const betweenEnd = siblings.length > 1 ? $dom.getRangeClientRect(siblings[siblings.length - 1]) : null;
                if (!betweenStart.multiLine && (betweenEnd === null || !betweenEnd.multiLine)) {
                    previousOffset = betweenEnd ? betweenStart.left - betweenEnd.right : betweenStart.width;
                }
            }
            rowWidth += previousOffset + item.marginLeft + dimension.width + item.marginRight;
        }
        if (rows.length > 1) {
            node.alignmentType |= $enum.NODE_ALIGNMENT.MULTILINE;
            alignmentMultiLine = true;
        }
        const rowParent: Undefined<T>[] = [];
        for (let i = 0; i < rows.length; i++) {
            let tallest: T | undefined;
            rows[i].forEach(item => {
                if (item.textElement && item.baseline) {
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
            let stringId = i === 0 && !alignmentMultiLine ? 'true' : (parent ? parent.stringId : '');
            const setHeight = (child: T) => {
                if (stringId === 'true') {
                    if (child.actualParent && child.actualHeight < child.actualParent.box.height) {
                        node.css('height', $util.formatPX(node.bounds.height));
                        return true;
                    }
                }
                return false;
            };
            for (let j = 0; j < row.length; j++) {
                const item = row[j];
                if (item.stringId !== stringId && (item.inlineVertical || item.supSubscript)) {
                    switch (item.verticalAlign) {
                        case 'text-top':
                            if (parent) {
                                if (parent !== item) {
                                    item.anchor('top', parent.stringId);
                                    break;
                                }
                                stringId = '';
                            }
                        case 'super':
                        case 'top':
                            if (i === 0 || stringId) {
                                item.anchor('top', i === 0 ? 'true' : stringId);
                            }
                            break;
                        case 'middle':
                            if (stringId === 'true') {
                                item.anchor('centerVertical', 'true');
                            }
                            else if (parent) {
                                const itemHeight = Math.max(item.bounds.height, item.lineHeight);
                                const parentHeight = Math.max(parent.bounds.height, parent.lineHeight);
                                if (itemHeight < parentHeight) {
                                    item.anchor('top', stringId);
                                    item.modifyBox($enum.BOX_STANDARD.MARGIN_TOP, Math.round((parentHeight - itemHeight) / 2));
                                }
                            }
                            break;
                        case 'text-bottom':
                            if (parent) {
                                if (parent !== item) {
                                    item.anchor('bottom', parent.stringId);
                                    break;
                                }
                                stringId = '';
                            }
                        case 'sub':
                        case 'bottom':
                            if (stringId && (i > 0 || setHeight(item))) {
                                item.anchor('bottom', stringId);
                            }
                            break;
                        case 'baseline':
                            switch (item.tagName) {
                                case 'SUP':
                                    if (i === 0 || stringId) {
                                        item.anchor('top', i === 0 ? 'true' : stringId);
                                    }
                                    break;
                                case 'SUB':
                                    if (stringId && (i > 0 || setHeight(item))) {
                                        item.anchor('bottom', stringId);
                                    }
                                    break;
                            }
                            break;
                    }
                }
            }
        }
        rows.forEach(row => {
            const nodes = row.filter(item => item.baseline && !item.floating && !item.tableElement);
            if (nodes.length > 0) {
                const baseline = adjustBaseline(nodes);
                if (baseline && (node.lineHeight > 0 || baseline.lineHeight > 0)) {
                    const offset = Math.max(node.lineHeight, baseline.lineHeight) - baseline.actualHeight;
                    if (offset > 0) {
                        baseline.modifyBox($enum.BOX_STANDARD.MARGIN_TOP, Math.floor(offset / 2));
                        baseline.modifyBox($enum.BOX_STANDARD.MARGIN_BOTTOM, Math.ceil(offset / 2));
                    }
                    baseline.anchorDelete('centerVertical');
                }
            }
        });
        if (settings.ellipsisOnTextOverflow) {
            const widthParent = node.ascend().every(item => !item.hasWidth);
            if (!alignmentMultiLine && !node.ascend(true).some(item => item.is($enum.NODE_CONTAINER.GRID))) {
                for (let i = 1; i < children.length; i++) {
                    const item = children[i];
                    if (!item.multiLine && !item.floating && !item.alignParent('left')) {
                        this.checkSingleLine(item, false, widthParent);
                    }
                }
            }
            else {
                for (const row of rows) {
                    if (row.length > 1) {
                        const item = row[row.length - 1];
                        if (item.inlineText) {
                            this.checkSingleLine(item, false, widthParent);
                        }
                    }
                }
            }
        }
    }

    protected processConstraintHorizontal(node: T, children: T[]) {
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
        if (baseline) {
            if (children.some(item => item.imageElement && item.baseline)) {
                baseline.anchor('bottom', 'parent');
            }
            else if (tallest === baseline) {
                baseline.anchor('top', 'parent');
            }
            else {
                baseline.anchor('baseline', 'parent');
            }
        }
        else {
            tallest.anchor('top', 'parent');
        }
        for (let i = 0; i < children.length; i++) {
            const item = children[i];
            const previous = children[i - 1];
            if (i === 0) {
                item.anchor(rightflow ? 'right' : 'left', 'parent');
            }
            else if (previous) {
                if (rightflow) {
                    item.anchor('rightLeft', previous.stringId);
                }
                else {
                    item.anchor('leftRight', previous.stringId);
                }
            }
            if (item === baseline || !item.inlineVertical) {
                continue;
            }
            switch (item.verticalAlign) {
                case 'text-top':
                    if (baseline) {
                        item.anchor('top', baseline.stringId);
                        break;
                    }
                case 'super':
                case 'top':
                    item.anchor('top', 'parent');
                    break;
                case 'middle':
                    item.anchorParent(AXIS_ANDROID.VERTICAL);
                    break;
                case 'text-bottom':
                    if (baseline) {
                        item.anchor('bottom', baseline.stringId);
                        break;
                    }
                case 'sub':
                case 'bottom':
                    item.anchor('bottom', 'parent');
                    break;
                case 'baseline':
                    if (baseline) {
                        item.anchor('baseline', baseline.stringId);
                    }
                    break;
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
                if (item.viewWidth === 0 || item.has('width', $enum.CSS_STANDARD.PERCENT)) {
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
        if (chainHorizontal.length > 1) {
            node.alignmentType |= $enum.NODE_ALIGNMENT.MULTILINE;
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
        if (node.hasAlign($enum.NODE_ALIGNMENT.FLOAT)) {
            const floatRight = node.hasAlign($enum.NODE_ALIGNMENT.RIGHT);
            chainHorizontal.forEach(segment => {
                if (floatRight) {
                    segment.reverse();
                }
            });
            if (children.some(item => item.has('width', $enum.CSS_STANDARD.PERCENT))) {
                node.android('layout_width', 'match_parent');
            }
        }
        chainHorizontal.forEach((segment, index) => {
            const rowStart = segment[0];
            const rowEnd = segment.length > 1 ? segment[segment.length - 1] : null;
            const chained = !!rowEnd && rowStart.alignSibling('left') === '' && rowStart.alignSibling('right') === '';
            if (chained) {
                if (actualParent && actualParent.css('textAlign') === 'center') {
                    rowStart.app('layout_constraintHorizontal_chainStyle', 'spread');
                }
                else {
                    rowStart.app('layout_constraintHorizontal_chainStyle', 'packed');
                    rowStart.app('layout_constraintHorizontal_bias', node.rightAligned ? '1' : '0');
                }
                rowStart.anchor('left', 'parent');
                if (rowEnd) {
                    rowEnd.anchor('right', 'parent');
                }
            }
            for (let i = 0; i < segment.length; i++) {
                const chain = segment[i];
                const previous = segment[i - 1];
                const next = segment[i + 1];
                if (chain.autoMargin.horizontal) {
                    chain.anchorParent(AXIS_ANDROID.HORIZONTAL);
                }
                else {
                    if (previous) {
                        chain.anchor('leftRight', previous.stringId);
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
                if (index === chainHorizontal.length - 1 && node.groupElement && chain.actualParent && !chain.actualParent.documentBody) {
                    chain.anchor('bottom', 'parent');
                }
            }
        });
        Controller.anchorEvaluate(children);
    }

    private withinParentBottom(bottom: number, boxBottom: number) {
        return bottom + this.localSettings.constraint.withinParentBottomOffset >= boxBottom;
    }

    private checkSingleLine<T extends View>(node: T, nowrap = false, widthParent = false) {
        if (node && node.textElement && node.cssParent('textAlign', true) !== 'center' && (nowrap || widthParent || (!node.hasWidth && !node.multiLine && node.textContent.trim().split(String.fromCharCode(32)).length >= this.localSettings.relative.ellipsisOverflowWordsMinimum))) {
            node.android('singleLine', 'true');
        }
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