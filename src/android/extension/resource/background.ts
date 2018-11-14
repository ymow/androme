import { BackgroundImage, BackgroundGradient, SettingsAndroid } from '../../types/module';

import { EXT_ANDROID } from '../../lib/constant';

import LAYERLIST_TMPL from '../../template/resource/layer-list';
import SHAPE_TMPL from '../../template/resource/shape';
import VECTOR_TMPL from '../../template/resource/vector';

import Resource from '../../resource';
import View from '../../view';

import { getXmlNs } from '../../lib/util';

import $color = androme.lib.color;
import $dom = androme.lib.dom;
import $enum = androme.lib.enumeration;
import $util = androme.lib.util;
import $xml = androme.lib.xml;

function getBorderStyle(border: BorderAttribute, direction = -1, halfSize = false): StringMap {
    const result = {
        solid: `android:color="@color/${border.color}"`,
        groove: '',
        ridge: ''
    };
    const style = border.style;
    const borderWidth = parseInt(border.width);
    const dashed = `${result.solid} android:dashWidth="${borderWidth}px" android:dashGap="${borderWidth}px"`;
    Object.assign(result, {
        double: result.solid,
        inset: result.solid,
        outset: result.solid,
        dashed,
        dotted: dashed
    });
    const groove = style === 'groove';
    if (borderWidth > 1 && (groove || style === 'ridge')) {
        const color = $color.parseRGBA(border.color);
        if (color) {
            const reduced = $color.reduceRGBA(color.valueRGBA, groove || color.valueRGB === '#000000' ? 0.5 : -0.5);
            if (reduced) {
                const colorValue = Resource.addColor(reduced);
                if (colorValue !== '') {
                    const colorName = `android:color="@color/${colorValue}"`;
                    if (direction === 0 || direction === 2) {
                        halfSize = !halfSize;
                    }
                    if (color.valueRGB === '#000000' && ((groove && (direction === 1 || direction === 3)) || (!groove && (direction === 0 || direction === 2)))) {
                        halfSize = !halfSize;
                    }
                    if (halfSize) {
                        switch (direction) {
                            case 0:
                                result[style] = colorName;
                                break;
                            case 1:
                                result[style] = result.solid;
                                break;
                            case 2:
                                result[style] = result.solid;
                                break;
                            case 3:
                                result[style] = colorName;
                                break;
                        }
                    }
                    else {
                        switch (direction) {
                            case 0:
                                result[style] = result.solid;
                                break;
                            case 1:
                                result[style] = colorName;
                                break;
                            case 2:
                                result[style] = colorName;
                                break;
                            case 3:
                                result[style] = result.solid;
                                break;
                        }
                    }
                }
            }
        }
    }
    return result[style] || result.solid;
}

function getShapeAttribute(boxStyle: BoxStyle, name: string, direction = -1, hasInset = false, isInset = false): any[] | boolean {
    switch (name) {
        case 'stroke':
            if (boxStyle.border && Resource.isBorderVisible(boxStyle.border)) {
                if (!hasInset || isInset) {
                    return [{
                        width: boxStyle.border.width,
                        borderStyle: getBorderStyle(boxStyle.border, isInset ? direction : -1)
                    }];
                }
                else if (hasInset) {
                    return [{
                        width: $util.formatPX(Math.ceil(parseInt(boxStyle.border.width) / 2)),
                        borderStyle: getBorderStyle(boxStyle.border, direction, true)
                    }];
                }
            }
            return false;
        case 'backgroundColor':
            return $util.isString(boxStyle.backgroundColor) ? [{ color: boxStyle.backgroundColor }] : false;
        case 'radius':
            if (boxStyle.borderRadius) {
                if (boxStyle.borderRadius.length === 1) {
                    if (boxStyle.borderRadius[0] !== '0px') {
                        return [{ radius: boxStyle.borderRadius[0] }];
                    }
                }
                else if (boxStyle.borderRadius.length > 1) {
                    const result = {};
                    boxStyle.borderRadius.forEach((value, index) => result[`${['topLeft', 'topRight', 'bottomRight', 'bottomLeft'][index]}Radius`] = value);
                    return [result];
                }
            }
            return false;

    }
    return false;
}

function insertDoubleBorder(border: BorderAttribute, top: boolean, right: boolean, bottom: boolean, left: boolean, data: {}, borderRadius: boolean | any[]) {
    const width = parseInt(border.width);
    const baseWidth = Math.floor(width / 3);
    const remainder = width % 3;
    const offset =  remainder === 2 ? 1 : 0;
    const leftWidth = baseWidth + offset;
    const rightWidth = baseWidth + offset;
    let indentWidth = `${$util.formatPX(width - baseWidth)}`;
    let hideWidth = `-${indentWidth}`;
    data['7'].push({
        top: top ? '' : hideWidth,
        right: right ? '' : hideWidth,
        bottom: bottom ? '' : hideWidth,
        left: left ? '' :  hideWidth,
        'stroke': [{ width: $util.formatPX(leftWidth), borderStyle: getBorderStyle(border) }],
        'corners': borderRadius
    });
    if (width === 3) {
        indentWidth = `${$util.formatPX(width)}`;
        hideWidth = `-${indentWidth}`;
    }
    data['7'].push({
        top: top ? indentWidth : hideWidth,
        right: right ? indentWidth : hideWidth,
        bottom: bottom ? indentWidth : hideWidth,
        left: left ? indentWidth : hideWidth,
        'stroke': [{ width: $util.formatPX(rightWidth), borderStyle: getBorderStyle(border) }],
        'corners': borderRadius
    });
}

function getHideWidth(value: number) {
    return value + (value === 1 ? 1 : 2);
}

export default class ResourceBackground<T extends View> extends androme.lib.base.Extension<T> {
    public readonly options = {
        autoSizeBackgroundImage: true
    };
    public readonly eventOnly = true;

    public afterResources() {
        const application = this.application;
        const settings = <SettingsAndroid> application.settings;
        const useColorAlias = application.getExtensionOptionsValue(EXT_ANDROID.RESOURCE_SVG, 'useColorAlias');
        application.processing.cache.duplicate().sort(a => !a.visible ? -1 : 0).forEach(node => {
            const stored: BoxStyle = node.data(Resource.KEY_NAME, 'boxStyle');
            if (stored && !node.hasBit('excludeResource', $enum.NODE_RESOURCE.BOX_STYLE)) {
                function checkPartialBackgroundPosition(current: string, adjacent: string, defaultPosition: string) {
                    if (current.indexOf(' ') === -1 && adjacent.indexOf(' ') !== -1) {
                        if (/^[a-z]+$/.test(current)) {
                            return `${current === 'initial' ? defaultPosition : current} 0px`;
                        }
                        else {
                            return `${defaultPosition} ${current}`;
                        }
                    }
                    return current;
                }
                stored.backgroundColor = Resource.addColor(stored.backgroundColor);
                const backgroundImage: string[] = [];
                const backgroundVector: StringMap[] = [];
                const backgroundRepeat = stored.backgroundRepeat.split(',').map(value => value.trim());
                const backgroundDimensions: Undefined<ImageAsset>[] = [];
                const backgroundGradient: BackgroundGradient[] = [];
                const backgroundSize = stored.backgroundSize.split(',').map(value => value.trim());
                const backgroundPositionX = stored.backgroundPositionX.split(',').map(value => value.trim());
                const backgroundPositionY = stored.backgroundPositionY.split(',').map(value => value.trim());
                const backgroundPosition: string[] = [];
                if (Array.isArray(stored.backgroundImage)) {
                    if (!node.hasBit('excludeResource', $enum.NODE_RESOURCE.IMAGE_SOURCE)) {
                        backgroundImage.push(...stored.backgroundImage);
                        for (let i = 0; i < backgroundImage.length; i++) {
                            if (backgroundImage[i] && backgroundImage[i] !== 'none') {
                                backgroundDimensions.push(Resource.ASSETS.images.get($dom.cssResolveUrl(backgroundImage[i])));
                                backgroundImage[i] = Resource.addImageUrl(backgroundImage[i]);
                                const postionX = backgroundPositionX[i] || backgroundPositionX[i - 1];
                                const postionY = backgroundPositionY[i] || backgroundPositionY[i - 1];
                                const x = checkPartialBackgroundPosition(postionX, postionY, 'left');
                                const y = checkPartialBackgroundPosition(postionY, postionX, 'top');
                                backgroundPosition[i] = `${x === 'initial' ? '0px' : x} ${y === 'initial' ? '0px' : y}`;
                            }
                            else {
                                backgroundImage[i] = '';
                                backgroundRepeat[i] = '';
                                backgroundPosition[i] = '';
                            }
                        }
                    }
                }
                else if (stored.backgroundGradient) {
                    backgroundGradient.push(...Resource.createBackgroundGradient(node, stored.backgroundGradient, typeof useColorAlias === 'boolean' ? useColorAlias : true));
                }
                const companion = node.companion;
                if (companion && !companion.visible && companion.htmlElement && !$dom.cssFromParent(companion.element, 'backgroundColor')) {
                    const boxStyle: BoxStyle = companion.data(Resource.KEY_NAME, 'boxStyle');
                    const backgroundColor = Resource.addColor(boxStyle.backgroundColor);
                    if (backgroundColor !== '') {
                        stored.backgroundColor = backgroundColor;
                    }
                }
                const hasBorder = (
                    Resource.isBorderVisible(stored.borderTop) ||
                    Resource.isBorderVisible(stored.borderRight) ||
                    Resource.isBorderVisible(stored.borderBottom) ||
                    Resource.isBorderVisible(stored.borderLeft) ||
                    stored.borderRadius
                );
                const hasBackgroundImage = backgroundImage.filter(value => value !== '').length > 0;
                if (hasBorder || hasBackgroundImage || backgroundGradient.length > 0) {
                    const borders: BorderAttribute[] = [
                        stored.borderTop,
                        stored.borderRight,
                        stored.borderBottom,
                        stored.borderLeft
                    ];
                    const borderFiltered: BorderAttribute[] = [];
                    const borderVisible: boolean[] = [];
                    borders.forEach((item, index) => {
                        borderVisible[index] = Resource.isBorderVisible(item);
                        if (borderVisible[index]) {
                            item.color = Resource.addColor(item.color);
                            borderFiltered.push(item);
                        }
                    });
                    const images5: BackgroundImage[] = [];
                    const images6: BackgroundImage[] = [];
                    let data: TemplateData;
                    let resourceName = '';
                    for (let i = 0; i < backgroundImage.length; i++) {
                        if (backgroundImage[i] !== '') {
                            const boxPosition = $dom.getBackgroundPosition(backgroundPosition[i], node.bounds, node.dpi, node.fontSize);
                            const image = backgroundDimensions[i];
                            let gravity = (() => {
                                if (boxPosition.horizontal === 'center' && boxPosition.vertical === 'center') {
                                    return 'center';
                                }
                                return `${boxPosition.horizontal === 'center' ? 'center_horizontal' : boxPosition.horizontal}|${boxPosition.vertical === 'center' ? 'center_vertical' : boxPosition.vertical}`;
                            })();
                            let tileMode = '';
                            let tileModeX = '';
                            let tileModeY = '';
                            const imageRepeat = !image || image.width < node.bounds.width || image.height < node.bounds.height;
                            switch (backgroundRepeat[i]) {
                                case 'repeat-x':
                                    if (imageRepeat) {
                                        tileModeX = 'repeat';
                                    }
                                    break;
                                case 'repeat-y':
                                    if (imageRepeat) {
                                        tileModeY = 'repeat';
                                    }
                                    break;
                                case 'no-repeat':
                                    tileMode = 'disabled';
                                    break;
                                case 'repeat':
                                    if (imageRepeat) {
                                        tileMode = 'repeat';
                                    }
                                    break;
                            }
                            if (gravity !== '' && image && image.width > 0 && image.height > 0 && node.renderChildren.length === 0) {
                                if (tileModeY === 'repeat') {
                                    let backgroundWidth = node.viewWidth;
                                    if (backgroundWidth > 0) {
                                        if (settings.autoSizePaddingAndBorderWidth && !node.hasBit('excludeResource', $enum.NODE_RESOURCE.BOX_SPACING)) {
                                            backgroundWidth = node.viewWidth + node.paddingLeft + node.paddingRight;
                                        }
                                    }
                                    else {
                                        backgroundWidth = node.bounds.width - (node.borderLeftWidth + node.borderRightWidth);
                                    }
                                    if (image.width < backgroundWidth) {
                                        const layoutWidth = $util.convertInt(node.android('layout_width'));
                                        if (gravity.indexOf('left') !== -1) {
                                            boxPosition.right = backgroundWidth - image.width;
                                            if (node.viewWidth === 0 && backgroundWidth > layoutWidth) {
                                                node.android('layout_width', $util.formatPX(node.bounds.width));
                                            }
                                        }
                                        else if (gravity.indexOf('right') !== -1) {
                                            boxPosition.left = backgroundWidth - image.width;
                                            if (node.viewWidth === 0 && backgroundWidth > layoutWidth) {
                                                node.android('layout_width', $util.formatPX(node.bounds.width));
                                            }
                                        }
                                        else if (gravity === 'center' || gravity.indexOf('center_horizontal') !== -1) {
                                            boxPosition.right = Math.floor((backgroundWidth - image.width) / 2);
                                            if (node.viewWidth === 0 && backgroundWidth > layoutWidth) {
                                                node.android('layout_width', $util.formatPX(node.bounds.width));
                                            }
                                        }
                                    }
                                }
                                if (tileModeX === 'repeat') {
                                    let backgroundHeight = node.viewHeight;
                                    if (backgroundHeight > 0) {
                                        if (settings.autoSizePaddingAndBorderWidth && !node.hasBit('excludeResource', $enum.NODE_RESOURCE.BOX_SPACING)) {
                                            backgroundHeight = node.viewHeight + node.paddingTop + node.paddingBottom;
                                        }
                                    }
                                    else {
                                        backgroundHeight = node.bounds.height - (node.borderTopWidth + node.borderBottomWidth);
                                    }
                                    if (image.height < backgroundHeight) {
                                        const layoutHeight = $util.convertInt(node.android('layout_height'));
                                        if (gravity.indexOf('top') !== -1) {
                                            boxPosition.bottom = backgroundHeight - image.height;
                                            if (node.viewHeight === 0 && backgroundHeight > layoutHeight) {
                                                node.android('layout_height', $util.formatPX(node.bounds.height));
                                            }
                                        }
                                        else if (gravity.indexOf('bottom') !== -1) {
                                            boxPosition.top = backgroundHeight - image.height;
                                            if (node.viewHeight === 0 && backgroundHeight > layoutHeight) {
                                                node.android('layout_height', $util.formatPX(node.bounds.height));
                                            }
                                        }
                                        else if (gravity === 'center' || gravity.indexOf('center_vertical') !== -1) {
                                            boxPosition.bottom = Math.floor((backgroundHeight - image.height) / 2);
                                            if (node.viewHeight === 0 && backgroundHeight > layoutHeight) {
                                                node.android('layout_height', $util.formatPX(node.bounds.height));
                                            }
                                        }
                                    }
                                }
                            }
                            if (hasBackgroundImage) {
                                if (node.of($enum.NODE_STANDARD.IMAGE, $enum.NODE_ALIGNMENT.SINGLE) && backgroundPosition.length === 1) {
                                    node.android('src', `@drawable/${backgroundImage[0]}`);
                                    if (boxPosition.left > 0) {
                                        node.modifyBox($enum.BOX_STANDARD.MARGIN_LEFT, boxPosition.left);
                                    }
                                    if (boxPosition.top > 0) {
                                        node.modifyBox($enum.BOX_STANDARD.MARGIN_TOP, boxPosition.top);
                                    }
                                    let scaleType = '';
                                    switch (gravity) {
                                        case 'left|top':
                                        case 'left|center_vertical':
                                        case 'left|bottom':
                                            scaleType = 'fitStart';
                                            break;
                                        case 'right|top':
                                        case 'right|center_vertical':
                                        case 'right|bottom':
                                            scaleType = 'fitEnd';
                                            break;
                                        case 'center':
                                        case 'center_horizontal|top':
                                        case 'center_horizontal|bottom':
                                            scaleType = 'center';
                                            break;
                                    }
                                    node.android('scaleType', scaleType);
                                    if (!hasBorder) {
                                        return;
                                    }
                                    backgroundImage.length = 0;
                                }
                                else {
                                    if (gravity === 'left|top') {
                                        gravity = '';
                                    }
                                    const imageData: BackgroundImage = {
                                        top: boxPosition.top !== 0 ? $util.formatPX(boxPosition.top) : '',
                                        right: boxPosition.right !== 0 ? $util.formatPX(boxPosition.right) : '',
                                        bottom: boxPosition.bottom !== 0 ? $util.formatPX(boxPosition.bottom) : '',
                                        left: boxPosition.left !== 0 ? $util.formatPX(boxPosition.left) : '',
                                        gravity,
                                        tileMode,
                                        tileModeX,
                                        tileModeY,
                                        width: '',
                                        height: '',
                                        src: backgroundImage[i]
                                    };
                                    if (!(backgroundSize[i] === 'auto' || backgroundSize[i] === 'auto auto' || backgroundSize[i] === 'initial')) {
                                        switch (backgroundSize[i]) {
                                            case 'cover':
                                            case 'contain':
                                            case '100% 100%':
                                                tileMode = '';
                                                tileModeX = '';
                                                tileModeY = '';
                                                gravity = '';
                                                break;
                                            default:
                                                const dimensions = backgroundSize[i].split(' ');
                                                if (dimensions[0] === '100%') {
                                                    tileModeX = '';
                                                }
                                                else if (dimensions[1] === '100%') {
                                                    tileModeY = '';
                                                }
                                                dimensions.forEach((value, index) => {
                                                    if (value !== 'auto' && value !== '100%') {
                                                        const attr = index === 0 ? 'width' : 'height';
                                                        if ($util.isPercent(backgroundSize[i])) {
                                                            imageData[attr] = node.convertPercent(backgroundSize[i], index === 0);
                                                        }
                                                        else {
                                                            imageData[attr] = node.convertPX(backgroundSize[i]);
                                                        }
                                                    }
                                                });
                                                break;
                                        }
                                    }
                                    if (imageData.width === '' && imageData.height === '' && (gravity !== '' || tileMode !== '' || tileModeX !== '' || tileModeY !== '')) {
                                        images6.push(imageData);
                                    }
                                    else {
                                        images5.push(imageData);
                                    }
                                }
                            }
                        }
                    }
                    images6.sort((a, b) => {
                        if (!(a.tileModeX === 'repeat' || a.tileModeY === 'repeat' || a.tileMode === 'repeat')) {
                            return 1;
                        }
                        else if (!(b.tileModeX === 'repeat' || b.tileModeY === 'repeat' || b.tileMode === 'repeat')) {
                            return -1;
                        }
                        else {
                            if (a.tileMode === 'repeat') {
                                return -1;
                            }
                            else if (b.tileMode === 'repeat') {
                                return 1;
                            }
                            else {
                                return b.tileModeX === 'repeat' || b.tileModeY === 'repeat' ? 1 : -1;
                            }
                        }
                    });
                    const backgroundColor = getShapeAttribute(stored, 'backgroundColor');
                    const borderRadius = getShapeAttribute(stored, 'radius');
                    const vectorGradient = backgroundGradient.length > 0 && backgroundGradient.some(gradient => gradient.colorStop.length > 0);
                    if (vectorGradient) {
                        const width = node.bounds.width;
                        const height = node.bounds.height;
                        const xml = $xml.createTemplate($xml.parseTemplate(VECTOR_TMPL), {
                            namespace: getXmlNs('aapt'),
                            width: $util.formatPX(width),
                            height: $util.formatPX(height),
                            viewportWidth: width.toString(),
                            viewportHeight: height.toString(),
                            alpha: '',
                            '1': [{
                                '2': [{
                                    clipPaths: false,
                                    d: `'M0,0 L${width},0 L${width},${height} L0,${height} Z`,
                                    fill: [{ 'gradients': backgroundGradient }]
                                }]
                            }]
                        });
                        let vector = Resource.getStoredName('drawables', xml);
                        if (vector === '') {
                            vector = `${node.nodeName.toLowerCase()}_${node.nodeId}_gradient`;
                            Resource.STORED.drawables.set(vector, xml);
                        }
                        backgroundVector.push({ vector });
                    }
                    let template: StringMap;
                    if (stored.border && !((parseInt(stored.border.width) > 2 && stored.border.style === 'double') || (parseInt(stored.border.width) > 1 && (stored.border.style === 'groove' || stored.border.style === 'ridge')))) {
                        if (!hasBackgroundImage && backgroundGradient.length <= 1 && !vectorGradient) {
                            if (borderRadius && borderRadius[0]['radius'] === undefined) {
                                borderRadius[0]['radius'] = '1px';
                            }
                            template = $xml.parseTemplate(SHAPE_TMPL);
                            data = {
                                '1': getShapeAttribute(stored, 'stroke'),
                                '2': backgroundColor,
                                '3': borderRadius,
                                '4': backgroundGradient.length > 0 ? backgroundGradient : false
                            };
                        }
                        else {
                            template = $xml.parseTemplate(LAYERLIST_TMPL);
                            data = {
                                '1': backgroundColor,
                                '2': !vectorGradient && backgroundGradient.length > 0 ? backgroundGradient : false,
                                '3': backgroundVector,
                                '4': false,
                                '5': images5.length > 0 ? images5 : false,
                                '6': images6.length > 0 ? images6 : false,
                                '7': Resource.isBorderVisible(stored.border) || borderRadius ? [{ 'stroke': getShapeAttribute(stored, 'stroke'), 'corners': borderRadius }] : false
                            };
                        }
                    }
                    else {
                        template = $xml.parseTemplate(LAYERLIST_TMPL);
                        data = {
                            '1': backgroundColor,
                            '2': !vectorGradient && backgroundGradient.length > 0 ? backgroundGradient : false,
                            '3': backgroundVector,
                            '4': false,
                            '5': images5.length > 0 ? images5 : false,
                            '6': images6.length > 0 ? images6 : false,
                            '7': []
                        };
                        const borderWidth = new Set(borderFiltered.map(item => item.width));
                        const borderStyle = new Set(borderFiltered.map(item => getBorderStyle(item)));
                        const borderData = borderFiltered[0];
                        if (borderWidth.size === 1 && borderStyle.size === 1 && !(borderData.style === 'groove' || borderData.style === 'ridge')) {
                            const width = parseInt(borderData.width);
                            if (width > 2 && borderData.style === 'double') {
                                insertDoubleBorder.apply(null, [
                                    borderData,
                                    ...borderVisible,
                                    data,
                                    borderRadius
                                ]);
                            }
                            else {
                                const hideWidth = `-${$util.formatPX(getHideWidth(width))}`;
                                const leftTop = !borderVisible[0] && !borderVisible[3];
                                const topOnly = !borderVisible[0] && borderVisible[1] && borderVisible[2] && borderVisible[3];
                                const leftOnly = borderVisible[0] && borderVisible[1] && borderVisible[2] && !borderVisible[3];
                                data['7'].push({
                                    top: borderVisible[0] ? '' : hideWidth,
                                    right: borderVisible[1] ? (borderVisible[3] || leftTop || leftOnly ? '' : borderData.width) : hideWidth,
                                    bottom: borderVisible[2] ? (borderVisible[0] || leftTop || topOnly ? '' : borderData.width) : hideWidth,
                                    left: borderVisible[3] ? '' : hideWidth,
                                    'stroke': getShapeAttribute(<BoxStyle> { border: borderData }, 'stroke'),
                                    'corners': borderRadius
                                });
                            }
                        }
                        else {
                            for (let i = 0; i < borders.length; i++) {
                                if (borderVisible[i]) {
                                    const border = borders[i];
                                    const width = parseInt(border.width);
                                    if (width > 2 && border.style === 'double') {
                                        insertDoubleBorder.apply(null, [
                                            border,
                                            i === 0,
                                            i === 1,
                                            i === 2,
                                            i === 3,
                                            data,
                                            borderRadius
                                        ]);
                                    }
                                    else {
                                        const hasInset = width > 1 && (border.style === 'groove' || border.style === 'ridge');
                                        const outsetWidth = hasInset ? Math.ceil(width / 2) : width;
                                        let hideWidth = `-${$util.formatPX(getHideWidth(outsetWidth))}`;
                                        data['7'].push({
                                            top:  i === 0 ? '' : hideWidth,
                                            right: i === 1 ? (border.width === '1px' ? border.width : '') : hideWidth,
                                            bottom: i === 2 ? (border.width === '1px' ? border.width : '') : hideWidth,
                                            left: i === 3 ? '' : hideWidth,
                                            'stroke': getShapeAttribute(<BoxStyle> { border }, 'stroke', i, hasInset),
                                            'corners': borderRadius
                                        });
                                        if (hasInset) {
                                            hideWidth = `-${$util.formatPX(getHideWidth(width))}`;
                                            data['7'].unshift({
                                                top:  i === 0 ? '' : hideWidth,
                                                right: i === 1 ? (border.width === '1px' ? border.width : '') : hideWidth,
                                                bottom: i === 2 ? (border.width === '1px' ? border.width : '') : hideWidth,
                                                left: i === 3 ? '' : hideWidth,
                                                'stroke': getShapeAttribute(<BoxStyle> { border }, 'stroke', i, true, true),
                                                'corners': false
                                            });
                                        }
                                    }
                                }
                            }
                        }
                    }
                    if (template) {
                        const xml = $xml.createTemplate(template, data);
                        resourceName = Resource.getStoredName('drawables', xml);
                        if (resourceName === '') {
                            resourceName = `${node.nodeName.toLowerCase()}_${node.nodeId}`;
                            Resource.STORED.drawables.set(resourceName, xml);
                        }
                    }
                    node.android('background', `@drawable/${resourceName}`, node.renderExtension.size === 0);
                    if (hasBackgroundImage) {
                        node.data('RESOURCE', 'backgroundImage', true);
                        if (this.options.autoSizeBackgroundImage &&
                            !node.documentRoot &&
                            !node.imageElement &&
                            !node.svgElement &&
                            node.renderParent.tagName !== 'TABLE' &&
                            !node.hasBit('excludeProcedure', $enum.NODE_PROCEDURE.AUTOFIT))
                        {
                            const sizeParent: ImageAsset = { width: 0, height: 0 };
                            backgroundDimensions.forEach(item => {
                                if (item) {
                                    sizeParent.width = Math.max(sizeParent.width, item.width);
                                    sizeParent.height = Math.max(sizeParent.height, item.height);
                                }
                            });
                            if (sizeParent.width === 0) {
                                let current = node;
                                while (current && !current.documentBody) {
                                    if (current.hasWidth) {
                                        sizeParent.width = current.bounds.width;
                                    }
                                    if (current.hasHeight) {
                                        sizeParent.height = current.bounds.height;
                                    }
                                    if (!current.pageflow || (sizeParent.width > 0 && sizeParent.height > 0)) {
                                        break;
                                    }
                                    current = current.documentParent as T;
                                }
                            }
                            if (!node.has('width', $enum.CSS_STANDARD.UNIT)) {
                                const width = node.bounds.width + (!node.is($enum.NODE_STANDARD.LINE) ? node.borderLeftWidth + node.borderRightWidth : 0);
                                if (sizeParent.width === 0 || (width > 0 && width < sizeParent.width)) {
                                    node.css('width', $util.formatPX(width));
                                }
                            }
                            if (!node.has('height', $enum.CSS_STANDARD.UNIT)) {
                                const height = node.actualHeight + (!node.is($enum.NODE_STANDARD.LINE) ? node.borderTopWidth + node.borderBottomWidth : 0);
                                if (sizeParent.height === 0 || (height > 0 && height < sizeParent.height)) {
                                    node.css('height', $util.formatPX(height));
                                    if (node.marginTop < 0) {
                                        node.modifyBox($enum.BOX_STANDARD.MARGIN_TOP, null);
                                    }
                                    if (node.marginBottom < 0) {
                                        node.modifyBox($enum.BOX_STANDARD.MARGIN_BOTTOM, null);
                                    }
                                }
                            }
                        }
                    }
                }
                else if (!node.data(Resource.KEY_NAME, 'fontStyle') && $util.isString(stored.backgroundColor)) {
                    node.android('background', `@color/${stored.backgroundColor}`, node.renderExtension.size === 0);
                }
            }
        });
    }
}