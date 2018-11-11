import { BackgroundImage, BackgroundGradient, SettingsAndroid } from './types/module';

import { RESERVED_JAVA } from './lib/constant';

import SHAPE_TMPL from './template/resource/shape';
import VECTOR_TMPL from './template/resource/vector';
import LAYERLIST_TMPL from './template/resource/layer-list';

import View from './view';

import { generateId, getXmlNs } from './lib/util';

import $Resource = androme.lib.base.Resource;

import $enum = androme.lib.enumeration;
import $const = androme.lib.constant;
import $util = androme.lib.util;
import $dom = androme.lib.dom;
import $xml = androme.lib.xml;
import $color = androme.lib.color;

type ThemeTemplate = {
    output: {
        path: string;
        file: string;
    }
    item?: StringMap
};

function getBorderStyle(border: BorderAttribute, direction = -1, halfSize = false): StringMap {
    const result = {
        solid: `android:color="@color/${border.color}"`,
        groove: '',
        ridge: ''
    };
    const style = border.style;
    Object.assign(result, {
        double: result.solid,
        inset: result.solid,
        outset: result.solid,
        dotted: `${result.solid} android:dashWidth="3px" android:dashGap="1px"`,
        dashed: `${result.solid} android:dashWidth="1px" android:dashGap="1px"`
    });
    const groove = style === 'groove';
    if (parseInt(border.width) > 1 && (groove || style === 'ridge')) {
        const color = $color.parseRGBA(border.color);
        if (color) {
            const reduced = $color.reduceRGBA(color.valueRGBA, groove || color.valueRGB === '#000000' ? 0.5 : -0.5);
            if (reduced) {
                const colorValue = ResourceHandler.addColor(reduced);
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

function getHexARGB(value: ColorHexAlpha | null) {
    return value ? (value.opaque ? value.valueARGB : value.valueRGB) : '';
}

export default class ResourceHandler<T extends View> extends androme.lib.base.Resource<T> {
    public static createBackgroundGradient<T extends View>(node: T, gradients: Gradient[], useNamedColors = true) {
        const result: BackgroundGradient[] = [];
        for (const shape of gradients) {
            const hasStop = node.svgElement || shape.colorStop.filter(item => $util.convertInt(item.offset) > 0).length > 0;
            const gradient: BackgroundGradient = {
                type: shape.type,
                startColor: !hasStop ? ResourceHandler.addColor(shape.colorStop[0].color) : '',
                centerColor: !hasStop && shape.colorStop.length > 2 ? ResourceHandler.addColor(shape.colorStop[1].color) : '',
                endColor: !hasStop ? ResourceHandler.addColor(shape.colorStop[shape.colorStop.length - 1].color) : '',
                colorStop: []
            };
            switch (shape.type) {
                case 'radial':
                    const radial = <RadialGradient> shape;
                    if (node.svgElement) {
                        gradient.gradientRadius = radial.r.toString();
                        gradient.centerX = radial.cx.toString();
                        gradient.centerY = radial.cy.toString();
                    }
                    else {
                        let boxPosition: BoxPosition | undefined;
                        if (radial.shapePosition && radial.shapePosition.length > 1) {
                            boxPosition = $dom.getBackgroundPosition(radial.shapePosition[1], node.bounds, node.css('fontSize'), true, !hasStop);
                        }
                        if (hasStop) {
                            gradient.gradientRadius = node.bounds.width.toString();
                            if (boxPosition) {
                                gradient.centerX = boxPosition.left.toString();
                                gradient.centerY = boxPosition.top.toString();
                            }
                        }
                        else {
                            gradient.gradientRadius = $util.formatPX(node.bounds.width);
                            if (boxPosition) {
                                gradient.centerX = $util.convertPercent(boxPosition.left);
                                gradient.centerY = $util.convertPercent(boxPosition.top);
                            }
                        }
                    }
                    break;
                case 'linear':
                    const linear = <LinearGradient> shape;
                    if (hasStop) {
                        gradient.startX = linear.x1.toString();
                        gradient.startY = linear.y1.toString();
                        gradient.endX = linear.x2.toString();
                        gradient.endY = linear.y2.toString();
                    }
                    else {
                        if (linear.angle) {
                            gradient.angle = (Math.floor(linear.angle / 45) * 45).toString();
                        }
                    }
                    break;
            }
            if (hasStop) {
                for (let i = 0; i < shape.colorStop.length; i++) {
                    const item = shape.colorStop[i];
                    let offset = $util.convertInt(item.offset);
                    const color = useNamedColors ? `@color/${ResourceHandler.addColor(item.color)}` : getHexARGB($color.parseRGBA(item.color));
                    if (i === 0) {
                        if (!node.svgElement && offset !== 0) {
                            gradient.colorStop.push({
                                color,
                                offset: '0',
                                opacity: item.opacity
                            });
                        }
                    }
                    else if (offset === 0) {
                        if (i < shape.colorStop.length - 1) {
                            offset = Math.round(($util.convertInt(shape.colorStop[i - 1].offset) + $util.convertInt(shape.colorStop[i + 1].offset)) / 2);
                        }
                        else {
                            offset = 100;
                        }
                    }
                    gradient.colorStop.push({
                        color,
                        offset: (offset / 100).toFixed(2),
                        opacity: item.opacity
                    });
                }
            }
            result.push(gradient);
        }
        return result;
    }

    public static formatOptions(options: ExternalData, settings?: SettingsAndroid): ExternalData {
        for (const namespace in options) {
            if (options.hasOwnProperty(namespace)) {
                const obj: ExternalData = options[namespace];
                if (typeof obj === 'object') {
                    for (const attr in obj) {
                        if (obj.hasOwnProperty(attr)) {
                            let value = obj[attr].toString();
                            switch (namespace) {
                                case 'android': {
                                    switch (attr) {
                                        case 'text':
                                            if (!value.startsWith('@string/')) {
                                                value = this.addString(value, '', settings);
                                                if (value !== '') {
                                                    obj[attr] = `@string/${value}`;
                                                    continue;
                                                }
                                            }
                                            break;
                                        case 'src':
                                            if ($const.DOM_REGEX.URI.test(value)) {
                                                value = this.addImage({mdpi: value});
                                                if (value !== '') {
                                                    obj[attr] = `@drawable/${value}`;
                                                    continue;
                                                }
                                            }
                                            break;
                                    }
                                    break;
                                }
                            }
                            const color = $color.parseRGBA(value);
                            if (color) {
                                const colorValue = this.addColor(color);
                                if (colorValue !== '') {
                                    obj[attr] = `@color/${colorValue}`;
                                }
                            }
                        }
                    }
                }
            }
        }
        return options;
    }

    public static addString(value: string, name = '', settings?: SettingsAndroid) {
        if (value !== '') {
            if (name === '') {
                name = value;
            }
            const numeric = $util.isNumber(value);
            if (!numeric || (settings && settings.numberResourceValue)) {
                for (const [resourceName, resourceValue] of $Resource.STORED.strings.entries()) {
                    if (resourceValue === value) {
                        return resourceName;
                    }
                }
                name = name.trim()
                    .toLowerCase()
                    .replace(/[^a-z\d]/g, '_')
                    .replace(/_+/g, '_')
                    .split('_')
                    .slice(0, 4)
                    .join('_')
                    .replace(/_+$/g, '');
                if (numeric || /^\d/.test(name) || RESERVED_JAVA.includes(name)) {
                    name = `__${name}`;
                }
                else if (name === '') {
                    name = `__symbol${Math.ceil(Math.random() * 100000)}`;
                }
                if ($Resource.STORED.strings.has(name)) {
                    name = generateId('strings', name, 1);
                }
                $Resource.STORED.strings.set(name, value);
            }
            return name;
        }
        return '';
    }

    public static addImageSrcSet(element: HTMLImageElement, prefix = '') {
        const images: StringMap = {};
        const srcset = element.srcset.trim();
        if (srcset !== '') {
            const filepath = element.src.substring(0, element.src.lastIndexOf('/') + 1);
            srcset.split(',').forEach(value => {
                const match = /^(.*?)\s*(\d+\.?\d*x)?$/.exec(value.trim());
                if (match) {
                    if (!$util.hasValue(match[2])) {
                        match[2] = '1x';
                    }
                    const src = filepath + $util.lastIndexOf(match[1]);
                    switch (match[2]) {
                        case '0.75x':
                            images.ldpi = src;
                            break;
                        case '1x':
                            images.mdpi = src;
                            break;
                        case '1.5x':
                            images.hdpi = src;
                            break;
                        case '2x':
                            images.xhdpi = src;
                            break;
                        case '3x':
                            images.xxhdpi = src;
                            break;
                        case '4x':
                            images.xxxhdpi = src;
                            break;
                    }
                }
            });
        }
        if (images.mdpi === undefined) {
            images.mdpi = element.src;
        }
        return this.addImage(images, prefix);
    }

    public static addImage(images: StringMap, prefix = '') {
        let src = '';
        if (images && images.mdpi) {
            src = $util.lastIndexOf(images.mdpi);
            const format = $util.lastIndexOf(src, '.').toLowerCase();
            src = src.replace(/.\w+$/, '').replace(/-/g, '_');
            switch (format) {
                case 'bmp':
                case 'cur':
                case 'gif':
                case 'ico':
                case 'jpg':
                case 'png':
                    src = $Resource.insertStoredAsset('images', prefix + src, images);
                    break;
                default:
                    src = '';
                    break;
            }
        }
        return src;
    }

    public static addImageURL(value: string, prefix = '') {
        const url = $dom.cssResolveUrl(value);
        if (url !== '') {
            return this.addImage({ mdpi: url }, prefix);
        }
        return '';
    }

    public static addColor(value: ColorHexAlpha | string | null) {
        if (typeof value === 'string') {
            value = $color.parseRGBA(value);
        }
        if (value && value.valueRGBA !== '#00000000') {
            const valueARGB = getHexARGB(value);
            let name = $Resource.STORED.colors.get(valueARGB) || '';
            if (name === '') {
                const shade = $color.getColorByShade(value.valueRGB);
                if (shade) {
                    shade.name = $util.convertUnderscore(shade.name);
                    if (!value.opaque && shade.hex === value.valueRGB) {
                        name = shade.name;
                    }
                    else {
                        name = generateId('color', shade.name, 1);
                    }
                    $Resource.STORED.colors.set(valueARGB, name);
                }
            }
            return name;
        }
        return '';
    }

    public static getStoredName(resource: string, value: any) {
        for (const [name, stored] of $Resource.STORED[resource].entries()) {
            if (value === stored) {
                return name;
            }
        }
        return '';
    }

    public settings: SettingsAndroid;

    public finalize() {}

    public reset() {
        super.reset();
        this.fileHandler.reset();
    }

    public setBoxStyle() {
        const outResult: T[] = [];
        super.setBoxStyle(outResult);
        outResult.sort(a => !a.visible ? -1 : 0).forEach(node => {
            if (!node.hasBit('excludeResource', $enum.NODE_RESOURCE.BOX_STYLE)) {
                const stored: BoxStyle = node.data($Resource.KEY_NAME, 'boxStyle');
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
                stored.backgroundColor = ResourceHandler.addColor(stored.backgroundColor);
                const backgroundImage: string[] = [];
                const backgroundVector: StringMap[] = [];
                const backgroundRepeat = stored.backgroundRepeat.split(',').map(value => value.trim());
                const backgroundDimensions: Undefined<ImageAsset>[] = [];
                const backgroundGradient: BackgroundGradient[] = [];
                const backgroundPositionX = stored.backgroundPositionX.split(',').map(value => value.trim());
                const backgroundPositionY = stored.backgroundPositionY.split(',').map(value => value.trim());
                const backgroundPosition: string[] = [];
                if (Array.isArray(stored.backgroundImage)) {
                    if (!node.hasBit('excludeResource', $enum.NODE_RESOURCE.IMAGE_SOURCE)) {
                        backgroundImage.push(...stored.backgroundImage);
                        for (let i = 0; i < backgroundImage.length; i++) {
                            if (backgroundImage[i] && backgroundImage[i] !== 'none') {
                                backgroundDimensions.push(this.imageAssets.get($dom.cssResolveUrl(backgroundImage[i])));
                                backgroundImage[i] = ResourceHandler.addImageURL(backgroundImage[i]);
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
                    backgroundGradient.push(...ResourceHandler.createBackgroundGradient(node, stored.backgroundGradient));
                }
                const companion = node.companion;
                if (companion && !companion.visible && companion.htmlElement && !$dom.cssFromParent(companion.element, 'backgroundColor')) {
                    const boxStyle: BoxStyle = companion.data($Resource.KEY_NAME, 'boxStyle');
                    const backgroundColor = ResourceHandler.addColor(boxStyle.backgroundColor);
                    if (backgroundColor !== '') {
                        stored.backgroundColor = backgroundColor;
                    }
                }
                const hasBorder = (
                    $Resource.isBorderVisible(stored.borderTop) ||
                    $Resource.isBorderVisible(stored.borderRight) ||
                    $Resource.isBorderVisible(stored.borderBottom) ||
                    $Resource.isBorderVisible(stored.borderLeft) ||
                    stored.borderRadius
                );
                const hasBackgroundImage = backgroundImage.filter(value => value !== '').length > 0;
                if (hasBorder || hasBackgroundImage || backgroundGradient.length > 0) {
                    function getShapeAttribute(boxStyle: BoxStyle, name: string, direction = -1, hasInset = false, isInset = false): any[] | boolean {
                        switch (name) {
                            case 'stroke':
                                if (boxStyle.border && $Resource.isBorderVisible(boxStyle.border)) {
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
                    const borders: BorderAttribute[] = [
                        stored.borderTop,
                        stored.borderRight,
                        stored.borderBottom,
                        stored.borderLeft
                    ];
                    const borderVisible: BorderAttribute[] = [];
                    borders.forEach(item => {
                        if ($Resource.isBorderVisible(item)) {
                            item.color = ResourceHandler.addColor(item.color);
                            borderVisible.push(item);
                        }
                    });
                    const images5: BackgroundImage[] = [];
                    const images6: BackgroundImage[] = [];
                    let data: TemplateData;
                    let resourceName = '';
                    for (let i = 0; i < backgroundImage.length; i++) {
                        if (backgroundImage[i] !== '') {
                            const boxPosition = $dom.getBackgroundPosition(backgroundPosition[i], node.bounds, node.css('fontSize'));
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
                                        if (this.settings.autoSizePaddingAndBorderWidth && !node.hasBit('excludeResource', $enum.NODE_RESOURCE.BOX_SPACING)) {
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
                                        if (this.settings.autoSizePaddingAndBorderWidth && !node.hasBit('excludeResource', $enum.NODE_RESOURCE.BOX_SPACING)) {
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
                            if (stored.backgroundSize.length > 0 && ($util.isPercent(stored.backgroundSize[0]) || $util.isPercent(stored.backgroundSize[1]))) {
                                if (stored.backgroundSize[0] === '100%' && stored.backgroundSize[1] === '100%') {
                                    tileMode = '';
                                    tileModeX = '';
                                    tileModeY = '';
                                    gravity = '';
                                }
                                else if (stored.backgroundSize[0] === '100%') {
                                    tileModeX = '';
                                }
                                else if (stored.backgroundSize[1] === '100%') {
                                    tileModeY = '';
                                }
                                stored.backgroundSize = [];
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
                                    const imageXml: BackgroundImage = {
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
                                    if (gravity !== '' || tileMode !== '' || tileModeX !== '' || tileModeY !== '') {
                                        images6.push(imageXml);
                                    }
                                    else {
                                        if (stored.backgroundSize.length > 0) {
                                            imageXml.width = stored.backgroundSize[0];
                                            imageXml.height = stored.backgroundSize[1];
                                        }
                                        images5.push(imageXml);
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
                        let vector = ResourceHandler.getStoredName('drawables', xml);
                        if (vector === '') {
                            vector = `${node.nodeName.toLowerCase()}_${node.nodeId}_gradient`;
                            $Resource.STORED.drawables.set(vector, xml);
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
                                '7': $Resource.isBorderVisible(stored.border) || borderRadius ? [{ 'stroke': getShapeAttribute(stored, 'stroke'), 'corners': borderRadius }] : false
                            };
                        }
                    }
                    else {
                        function getHideWidth(value: number) {
                            return value + (value === 1 ? 1 : 2);
                        }
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
                        const borderWidth = new Set(borderVisible.map(item => item.width));
                        const borderStyle = new Set(borderVisible.map(item => getBorderStyle(item)));
                        const borderData = borderVisible[0];
                        function insertDoubleBorder(border: BorderAttribute, top: boolean, right: boolean, bottom: boolean, left: boolean) {
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
                        if (borderWidth.size === 1 && borderStyle.size === 1 && !(borderData.style === 'groove' || borderData.style === 'ridge')) {
                            const width = parseInt(borderData.width);
                            if (width > 2 && borderData.style === 'double') {
                                insertDoubleBorder.apply(null, [
                                    borderData,
                                    $Resource.isBorderVisible(stored.borderTop),
                                    $Resource.isBorderVisible(stored.borderRight),
                                    $Resource.isBorderVisible(stored.borderBottom),
                                    $Resource.isBorderVisible(stored.borderLeft)
                                ]);
                            }
                            else {
                                const hideWidth = `-${$util.formatPX(getHideWidth(width))}`;
                                data['7'].push({
                                    top: $Resource.isBorderVisible(stored.borderTop) ? '' : hideWidth,
                                    right: $Resource.isBorderVisible(stored.borderRight) ? '' : hideWidth,
                                    bottom: $Resource.isBorderVisible(stored.borderBottom) ? '' : hideWidth,
                                    left: $Resource.isBorderVisible(stored.borderLeft) ? '' : hideWidth,
                                    'stroke': getShapeAttribute(<BoxStyle> { border: borderVisible[0] }, 'stroke'),
                                    'corners': borderRadius
                                });
                            }
                        }
                        else {
                            for (let i = 0; i < borders.length; i++) {
                                const border = borders[i];
                                if ($Resource.isBorderVisible(border)) {
                                    const width = parseInt(border.width);
                                    if (width > 2 && border.style === 'double') {
                                        insertDoubleBorder.apply(null, [
                                            border,
                                            i === 0,
                                            i === 1,
                                            i === 2,
                                            i === 3
                                        ]);
                                    }
                                    else {
                                        const hasInset = width > 1 && (border.style === 'groove' || border.style === 'ridge');
                                        const outsetWidth = hasInset ? Math.ceil(width / 2) : width;
                                        let hideWidth = `-${$util.formatPX(getHideWidth(outsetWidth))}`;
                                        data['7'].push({
                                            top:  i === 0 ? '' : hideWidth,
                                            right: i === 1 ? '' : hideWidth,
                                            bottom: i === 2 ? '' : hideWidth,
                                            left: i === 3 ? '' : hideWidth,
                                            'stroke': getShapeAttribute(<BoxStyle> { border }, 'stroke', i, hasInset),
                                            'corners': borderRadius
                                        });
                                        if (hasInset) {
                                            hideWidth = `-${$util.formatPX(getHideWidth(width))}`;
                                            data['7'].unshift({
                                                top:  i === 0 ? '' : hideWidth,
                                                right: i === 1 ? '' : hideWidth,
                                                bottom: i === 2 ? '' : hideWidth,
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
                        resourceName = ResourceHandler.getStoredName('drawables', xml);
                        if (resourceName === '') {
                            resourceName = `${node.nodeName.toLowerCase()}_${node.nodeId}`;
                            $Resource.STORED.drawables.set(resourceName, xml);
                        }
                    }
                    node.android('background', `@drawable/${resourceName}`, node.renderExtension.size === 0);
                    if (hasBackgroundImage) {
                        node.data('RESOURCE', 'backgroundImage', true);
                        if (this.settings.autoSizeBackgroundImage &&
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
                else if (!node.data($Resource.KEY_NAME, 'fontStyle') && $util.isString(stored.backgroundColor)) {
                    node.android('background', `@color/${stored.backgroundColor}`, node.renderExtension.size === 0);
                }
            }
        });
    }

    public setValueString() {
        const outResult: T[] = [];
        super.setValueString(outResult);
        for (const node of outResult) {
            if (!node.hasBit('excludeResource', $enum.NODE_RESOURCE.VALUE_STRING)) {
                const stored: NameValue = node.data($Resource.KEY_NAME, 'valueString');
                if (node.renderParent.is($enum.NODE_STANDARD.RELATIVE)) {
                    if (node.alignParent('left') && !$dom.cssParent(node.element, 'whiteSpace', 'pre', 'pre-wrap')) {
                        const value = node.textContent;
                        let leadingSpace = 0;
                        for (let i = 0; i < value.length; i++) {
                            switch (value.charCodeAt(i)) {
                                case 32:
                                    continue;
                                case 160:
                                    leadingSpace++;
                                    continue;
                            }
                            break;
                        }
                        if (leadingSpace === 0) {
                            stored.value = stored.value.replace(/^(\s|&#160;)+/, '');
                        }
                    }
                }
                if (node.htmlElement) {
                    if (node.css('fontVariant') === 'small-caps') {
                        stored.value = stored.value.toUpperCase();
                    }
                    const match = node.css('textDecoration').match(/(underline|line-through)/);
                    if (match) {
                        switch (match[0]) {
                            case 'underline':
                                stored.value = `<u>${$xml.replaceCharacter(stored.value)}</u>`;
                                break;
                            case 'line-through':
                                stored.value = `<strike>${$xml.replaceCharacter(stored.value)}</strike>`;
                                break;
                        }
                    }
                    else {
                        stored.value = $xml.replaceCharacter(stored.value);
                    }
                }
                else {
                    stored.value = $xml.replaceCharacter(stored.value);
                }
                const name = ResourceHandler.addString(stored.value, stored.name, this.settings);
                if (name !== '' && node.toInt('textIndent') + node.bounds.width > 0) {
                    node.android('text', isNaN(parseInt(name)) || parseInt(name).toString() !== name ? `@string/${name}` : name, node.renderExtension.size === 0);
                }
            }
        }
    }

    public setOptionArray() {
        const outResult: T[] = [];
        super.setOptionArray(outResult);
        for (const node of outResult) {
            if (!node.hasBit('excludeResource', $enum.NODE_RESOURCE.OPTION_ARRAY)) {
                const stored: ObjectMap<string[]> = node.data($Resource.KEY_NAME, 'optionArray');
                const result: string[] = [];
                if (stored.numberArray) {
                    if (!this.settings.numberResourceValue) {
                        result.push(...stored.numberArray);
                    }
                    else {
                        stored.stringArray = stored.numberArray;
                    }
                }
                if (stored.stringArray) {
                    result.push(
                        ...stored.stringArray.map(value => {
                            const name = ResourceHandler.addString($xml.replaceCharacter(value), '', this.settings);
                            return name !== '' ? `@string/${name}` : '';
                        })
                        .filter(name => name)
                    );
                }
                if (result.length > 0) {
                    const arrayValue = result.join('-');
                    let arrayName = '';
                    for (const [storedName, storedResult] of $Resource.STORED.arrays.entries()) {
                        if (arrayValue === storedResult.join('-')) {
                            arrayName = storedName;
                            break;
                        }
                    }
                    if (arrayName === '') {
                        arrayName = `${node.nodeId}_array`;
                        $Resource.STORED.arrays.set(arrayName, result);
                    }
                    node.android('entries', `@array/${arrayName}`, node.renderExtension.size === 0);
                }
            }
        }
    }

    public addStyleTheme(template: string, data: TemplateData, options: ThemeTemplate) {
        if (options.item) {
            const items = { item: options.item };
            ResourceHandler.formatOptions(items, this.settings);
            for (const name in items) {
                data['1'].push({
                    name,
                    value: items[name]
                });
            }
        }
        const xml = $xml.createTemplate($xml.parseTemplate(template), data);
        this.fileHandler.addAsset(options.output.path, options.output.file, xml);
    }
}