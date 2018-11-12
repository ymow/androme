import { BackgroundGradient, SettingsAndroid } from './types/module';

import { EXT_ANDROID, RESERVED_JAVA } from './lib/constant';

import File from './file';
import View from './view';

import { generateId } from './lib/util';

import $color = androme.lib.color;
import $const = androme.lib.constant;
import $dom = androme.lib.dom;
import $util = androme.lib.util;
import $xml = androme.lib.xml;

type ThemeTemplate = {
    output: {
        path: string;
        file: string;
    }
    item?: StringMap
};

function getHexARGB(value: ColorHexAlpha | null) {
    return value ? (value.opaque ? value.valueARGB : value.valueRGB) : '';
}

export default class Resource<T extends View> extends androme.lib.base.Resource<T> implements android.lib.base.Resource<T> {
    public static createBackgroundGradient<T extends View>(node: T, gradients: Gradient[], useColorAlias = true) {
        const result: BackgroundGradient[] = [];
        for (const shape of gradients) {
            const hasStop = node.svgElement || shape.colorStop.filter(item => $util.convertInt(item.offset) > 0).length > 0;
            const gradient: BackgroundGradient = {
                type: shape.type,
                startColor: !hasStop ? Resource.addColor(shape.colorStop[0].color) : '',
                centerColor: !hasStop && shape.colorStop.length > 2 ? Resource.addColor(shape.colorStop[1].color) : '',
                endColor: !hasStop ? Resource.addColor(shape.colorStop[shape.colorStop.length - 1].color) : '',
                colorStop: []
            };
            switch (shape.type) {
                case 'radial':
                    if (node.svgElement) {
                        const radial = <SvgRadialGradient> shape;
                        gradient.gradientRadius = radial.r.toString();
                        gradient.centerX = radial.cx.toString();
                        gradient.centerY = radial.cy.toString();
                    }
                    else {
                        const radial = <RadialGradient> shape;
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
                    if (node.svgElement) {
                        const linear = <SvgLinearGradient> shape;
                        gradient.startX = linear.x1.toString();
                        gradient.startY = linear.y1.toString();
                        gradient.endX = linear.x2.toString();
                        gradient.endY = linear.y2.toString();
                    }
                    else {
                        const linear = <LinearGradient> shape;
                        if (linear.angle) {
                            gradient.angle = (Math.floor(linear.angle / 45) * 45).toString();
                        }
                    }
                    break;
            }
            if (hasStop) {
                for (let i = 0; i < shape.colorStop.length; i++) {
                    const item = shape.colorStop[i];
                    const color = useColorAlias ? `@color/${Resource.addColor(item.color)}` : getHexARGB($color.parseRGBA(item.color));
                    let offset = $util.convertInt(item.offset);
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

    public static formatOptions(options: ExternalData, useNumberAlias = false) {
        for (const namespace in options) {
            if (options.hasOwnProperty(namespace)) {
                const obj: ExternalData = options[namespace];
                if (typeof obj === 'object') {
                    for (const attr in obj) {
                        if (obj.hasOwnProperty(attr)) {
                            let value = obj[attr].toString();
                            switch (attr) {
                                case 'text':
                                    if (!value.startsWith('@string/')) {
                                        value = this.addString(value, '', useNumberAlias);
                                        if (value !== '') {
                                            obj[attr] = `@string/${value}`;
                                            continue;
                                        }
                                    }
                                    break;
                                case 'src':
                                case 'srcCompat':
                                    if ($const.REGEX_PATTERN.URI.test(value)) {
                                        value = this.addImage({ mdpi: value });
                                        if (value !== '') {
                                            obj[attr] = `@drawable/${value}`;
                                            continue;
                                        }
                                    }
                                    break;
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

    public static addString(value: string, name = '', useNumberAlias = false) {
        if (value !== '') {
            if (name === '') {
                name = value.trim();
            }
            const numeric = $util.isNumber(value);
            if (!numeric || useNumberAlias) {
                for (const [resourceName, resourceValue] of Resource.STORED.strings.entries()) {
                    if (resourceValue === value) {
                        return resourceName;
                    }
                }
                name = name.toLowerCase()
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
                if (Resource.STORED.strings.has(name)) {
                    name = generateId('strings', name, 1);
                }
                Resource.STORED.strings.set(name, value);
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
                    src = Resource.insertStoredAsset('images', prefix + src, images);
                    break;
                default:
                    src = '';
                    break;
            }
        }
        return src;
    }

    public static addImageUrl(value: string, prefix = '') {
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
            let name = Resource.STORED.colors.get(valueARGB) || '';
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
                    Resource.STORED.colors.set(valueARGB, name);
                }
            }
            return name;
        }
        return '';
    }

    public settings: SettingsAndroid;
    public fileHandler: File<T>;

    public finalize() {}

    public reset() {
        super.reset();
        this.fileHandler.reset();
    }

    public addStyleTheme(template: string, data: TemplateData, options: ThemeTemplate) {
        if (options.item) {
            const items = Resource.formatOptions({ item: options.item }, this.application.getExtensionOptionsValueAsBoolean(EXT_ANDROID.RESOURCE_STRINGS, 'useNumberAlias'));
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