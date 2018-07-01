import { BorderAttribute, Null, ObjectMap, StringMap } from '../lib/types';
import File from './file';
import Node from './node';
import NodeList from './nodelist';
import { INLINE_CHROME, MAPPING_CHROME, VIEW_RESOURCE } from '../lib/constants';
import { cameltoLowerCase, convertPX, generateId, getFileExt, getFileName, hasValue, isNumber, resolveRelativePath } from '../lib/util';
import { findNearestColor, parseRGBA } from '../lib/color';
import { getBoxSpacing, sameAsParent } from '../lib/dom';
import SETTINGS from '../settings';

export default abstract class Resource<T extends Node> {
    public static STORED: ObjectMap<any> = {
        STRINGS: new Map(),
        COLORS: new Map(),
        IMAGES: new Map()
    };

    public static addString(value: string, name = '') {
        if (hasValue(value)) {
            if (name === '') {
                name = value;
            }
            const num = isNumber(value);
            if (SETTINGS.numberResourceValue || !num) {
                for (const key of Resource.STORED.STRINGS.keys()) {
                    if (key === value) {
                        return (<string> key);
                    }
                }
                name = name.trim().replace(/[^a-zA-Z0-9]/g, '_').toLowerCase().replace(/_+/g, '_').split('_').slice(0, 4).join('_').replace(/_+$/g, '');
                if (num || /^[0-9]/.test(value)) {
                    name = `__${name}`;
                }
                else if (name === '') {
                    name = `__symbol${Math.ceil(Math.random() * 100000)}`;
                }
                Resource.STORED.STRINGS.set(value, name);
            }
            return value;
        }
        return '';
    }

    public static addImageSrcSet(element: HTMLImageElement, prefix = '') {
        const srcset = element.srcset.trim();
        const images: StringMap = {};
        if (hasValue(srcset)) {
            const filePath = element.src.substring(0, element.src.lastIndexOf('/') + 1);
            srcset.split(',').forEach((value: string) => {
                const match = /^(.*?)\s*([0-9]+\.?[0-9]*x)?$/.exec(value.trim());
                if (match != null) {
                    if (match[2] == null) {
                        match[2] = '1x';
                    }
                    const image = filePath + getFileName(match[1]);
                    switch (match[2]) {
                        case '0.75x':
                            images['ldpi'] = image;
                            break;
                        case '1x':
                            images['mdpi'] = image;
                            break;
                        case '1.5x':
                            images['hdpi'] = image;
                            break;
                        case '2x':
                            images['xhdpi'] = image;
                            break;
                        case '3x':
                            images['xxhdpi'] = image;
                            break;
                        case '4x':
                            images['xxxhdpi'] = image;
                            break;
                    }
                }
            });
        }
        if (images['mdpi'] == null) {
            images['mdpi'] = element.src;
        }
        return Resource.addImage(images, prefix);
    }

    public static addImage(images: StringMap, prefix = '') {
        let src = '';
        if (images['mdpi'] != null && hasValue(images['mdpi'])) {
            src = getFileName(images['mdpi']);
            const format = getFileExt(src).toLowerCase();
            src = src.replace(/.\w+$/, '').replace(/-/g, '_');
            switch (format) {
                case 'bmp':
                case 'bmpf':
                case 'cur':
                case 'gif':
                case 'ico':
                case 'jpg':
                case 'png':
                case 'tif':
                case 'tiff':
                case 'webp':
                case 'xbm':
                    src = Resource.insertStoredAsset('IMAGES', prefix + src, images);
                    break;
                default:
                    src = '';
            }
        }
        return src;
    }

    public static addImageURL(value: string, prefix: string = '') {
        const match = value.match(/^url\("(.*?)"\)$/);
        if (match != null) {
            return Resource.addImage({ 'mdpi': resolveRelativePath(match[1]) }, prefix);
        }
        return '';
    }

    public static addColor(value: string) {
        value = value.toUpperCase().trim();
        if (value !== '') {
            let colorName = '';
            if (!Resource.STORED.COLORS.has(value)) {
                const color = findNearestColor(value);
                if (color !== '') {
                    color.name = cameltoLowerCase(<string> color.name);
                    if (value === color.hex) {
                        colorName = color.name;
                    }
                    else {
                        colorName = generateId('color', `${color.name}_1`);
                    }
                    Resource.STORED.COLORS.set(value, colorName);
                }
            }
            else {
                colorName = Resource.STORED.COLORS.get(value);
            }
            return colorName;
        }
        return '';
    }

    public static insertStoredAsset(asset: string, name: string, value: any) {
        const stored: Map<string, any> = Resource.STORED[asset];
        if (stored != null) {
            let storedName = '';
            for (const [storedKey, storedValue] of stored.entries()) {
                if (JSON.stringify(value) === JSON.stringify(storedValue)) {
                    storedName = storedKey;
                    break;
                }
            }
            if (storedName === '') {
                if (isNumber(name)) {
                    name = `__${name}`;
                }
                if (hasValue(value)) {
                    let i = 0;
                    do {
                        storedName = name;
                        if (i > 0) {
                            storedName += `_${i}`;
                        }
                        if (!stored.has(storedName)) {
                            stored.set(storedName, value);
                        }
                        i++;
                    }
                    while (stored.has(storedName) && stored.get(storedName) !== value);
                }
            }
            return storedName;
        }
        return '';
    }

    public views: string[];
    public cache: NodeList<T>;

    constructor(public file: File) {
    }

    public abstract finalize(viewData: {}): void;

    public addFile(pathname: string, filename: string, content = '', uri = '') {
        this.file.addFile(pathname, filename, content, uri);
    }

    public reset() {
        Resource.STORED.STRINGS = new Map();
        Resource.STORED.COLORS = new Map();
        Resource.STORED.IMAGES = new Map();
        this.file.reset();
    }

    public setBoxSpacing() {
        this.cache.elements.forEach(node => {
            if ((node.ignoreResource & VIEW_RESOURCE.BOX_SPACING) !== VIEW_RESOURCE.BOX_SPACING) {
                const element = node.element;
                const object = (<any> element);
                if (!hasValue(object.__boxSpacing) || SETTINGS.alwaysReevaluateResources) {
                    const result: any = getBoxSpacing(element);
                    for (const i in result) {
                        result[i] += 'px';
                    }
                    object.__boxSpacing = result;
                }
            }
        });
    }

    public setBoxStyle() {
        this.cache.elements.forEach(node => {
            if ((node.ignoreResource & VIEW_RESOURCE.BOX_STYLE) !== VIEW_RESOURCE.BOX_STYLE) {
                const element = node.element;
                const object = (<any> element);
                if (!hasValue(object.__boxStyle) || SETTINGS.alwaysReevaluateResources) {
                    const result: any = {
                        borderTop: this.parseBorderStyle,
                        borderRight: this.parseBorderStyle,
                        borderBottom: this.parseBorderStyle,
                        borderLeft: this.parseBorderStyle,
                        borderRadius: this.parseBorderRadius,
                        backgroundColor: parseRGBA,
                        backgroundImage: Resource.addImageURL,
                        backgroundSize: this.parseBoxDimensions
                    };
                    for (const i in result) {
                        result[i] = result[i](node.css(i), node, i);
                    }
                    if (result.backgroundColor.length > 0) {
                        if (SETTINGS.excludeBackgroundColor.includes(result.backgroundColor[0]) || (node.styleMap.backgroundColor == null && sameAsParent(element, 'backgroundColor'))) {
                            result.backgroundColor = [];
                        }
                        else {
                            result.backgroundColor[0] = Resource.addColor(result.backgroundColor[0]);
                        }
                    }
                    const borderTop = JSON.stringify(result.borderTop);
                    if (borderTop === JSON.stringify(result.borderRight) && borderTop === JSON.stringify(result.borderBottom) && borderTop === JSON.stringify(result.borderLeft)) {
                        result.border = result.borderTop;
                    }
                    object.__boxStyle = result;
                }
            }
        });
    }

    public setFontStyle() {
        this.cache.elements.forEach(node => {
            if ((node.visible || node.companion) && (node.ignoreResource & VIEW_RESOURCE.FONT_STYLE) !== VIEW_RESOURCE.FONT_STYLE) {
                const element = node.element;
                const object = (<any> element);
                if (!hasValue(object.__fontStyle) || SETTINGS.alwaysReevaluateResources) {
                    if (node.renderChildren.length > 0 || node.tagName === 'IMG' || node.tagName === 'HR') {
                        return;
                    }
                    else {
                        let color = parseRGBA(node.css('color'));
                        if (color.length > 0) {
                            if (SETTINGS.excludeTextColor.includes(color[0])) {
                                color = [];
                            }
                            else {
                                color[0] = Resource.addColor(color[0]);
                            }
                        }
                        let backgroundColor = parseRGBA(node.css('backgroundColor'));
                        if (backgroundColor.length > 0) {
                            if (SETTINGS.excludeBackgroundColor.includes(backgroundColor[0]) || (node.styleMap.backgroundColor == null && sameAsParent(element, 'backgroundColor'))) {
                                backgroundColor = [];
                            }
                            else {
                                backgroundColor[0] = Resource.addColor(backgroundColor[0]);
                            }
                        }
                        const result = {
                            fontFamily: node.css('fontFamily'),
                            fontStyle: node.css('fontStyle'),
                            fontSize: node.css('fontSize'),
                            fontWeight: node.css('fontWeight'),
                            color: (color.length > 0 ? `@color/${color[0]}` : ''),
                            backgroundColor: (backgroundColor.length > 0 ? `@color/${backgroundColor[0]}` : '')
                        };
                        object.__fontStyle = result;
                    }
                }
            }
        });
    }

    public setImageSource() {
        this.cache.list.filter(node => node.tagName === 'IMG').forEach(node => {
            const element = (<HTMLImageElement> node.element);
            const object = (<any> element);
            if ((node.ignoreResource & VIEW_RESOURCE.IMAGE_SOURCE) !== VIEW_RESOURCE.IMAGE_SOURCE) {
                if (!hasValue(object.__imageSource) || SETTINGS.alwaysReevaluateResources) {
                    const result = Resource.addImageSrcSet(element);
                    object.__imageSource = result;
                }
            }
        });
    }

    public setOptionArray() {
        this.cache.list.filter(node => node.tagName === 'SELECT').forEach(node => {
            if ((node.ignoreResource & VIEW_RESOURCE.OPTION_ARRAY) !== VIEW_RESOURCE.OPTION_ARRAY) {
                const element = (<HTMLSelectElement> node.element);
                const object = (<any> element);
                if (!hasValue(object.__optionArray) || SETTINGS.alwaysReevaluateResources) {
                    const stringArray: string[] = [];
                    let numberArray: Null<string[]> = [];
                    for (let i = 0; i < element.children.length; i++) {
                        const item = (<HTMLOptionElement> element.children[i]);
                        const value = item.text.trim();
                        if (value !== '') {
                            if (numberArray != null && stringArray.length === 0 && isNumber(value)) {
                                numberArray.push(value);
                            }
                            else {
                                if (numberArray != null && numberArray.length > 0) {
                                    i = -1;
                                    numberArray = null;
                                    continue;
                                }
                                const result = Resource.addString(value);
                                if (result !== '') {
                                    stringArray.push(result);
                                }
                            }
                        }
                    }
                    object.__optionArray = { stringArray: (stringArray.length > 0 ? stringArray : null), numberArray: (numberArray != null && numberArray.length > 0 ? numberArray : null) };
                }
            }
        });
    }

    public setValueString() {
        this.cache.elements.forEach(node => {
            if ((node.ignoreResource & VIEW_RESOURCE.VALUE_STRING) !== VIEW_RESOURCE.VALUE_STRING) {
                const element = (<HTMLInputElement> node.element);
                const object = (<any> element);
                if (!hasValue(object.__valueString) || SETTINGS.alwaysReevaluateResources) {
                    let name = '';
                    let value = '';
                    if (element.tagName === 'INPUT' || element.tagName === 'TEXTAREA') {
                        if (element.type !== 'range') {
                            value = element.value.trim();
                        }
                    }
                    else if (element.nodeName === '#text') {
                        value = (element.textContent ? element.textContent.trim() : '');
                    }
                    else if ((element.children.length === 0 && MAPPING_CHROME[element.tagName] == null) || (element.children.length > 0 && Array.from(element.children).every((child: HTMLElement) => (MAPPING_CHROME[child.tagName] == null && INLINE_CHROME.includes(child.tagName))))) {
                        name = element.innerText.trim();
                        value = element.innerHTML.trim();
                    }
                    if (hasValue(value)) {
                        Resource.addString(value, name);
                        object.__valueString = value;
                    }
                }
            }
        });
    }

    protected borderVisible(border: BorderAttribute) {
        return (border != null && !(border.style === 'none' || border.width === '0px'));
    }

    protected getBorderStyle(border: BorderAttribute) {
        const result: StringMap = { solid: `android:color="@color/${border.color}"` };
        Object.assign(result, {
            inset: result.solid,
            outset: result.solid,
            dotted: `${result.solid} android:dashWidth="3px" android:dashGap="1px"`,
            dashed: `${result.solid} android:dashWidth="1px" android:dashGap="1px"`
        });
        return result[border.style] || 'android:color="@android:color/black"';
    }

    private parseBorderStyle(value: string, node: T, attribute: string): BorderAttribute {
        const style = node.css(`${attribute}Style`) || 'none';
        let width = node.css(`${attribute}Width`) || '1px';
        const color = (style !== 'none' ? parseRGBA(node.css(`${attribute}Color`)) : []);
        if (color.length > 0) {
            color[0] = (<string> Resource.addColor(color[0]));
        }
        if (style === 'inset' && width === '0px') {
            width = '1px';
        }
        return { style, width, color: (color.length > 0 ? color[0] : '#000000') };
    }

    private parseBorderRadius(value: string, node: T, attribute: string) {
        const radiusTop = node.css('borderTopLeftRadius');
        const radiusRight = node.css('borderTopRightRadius');
        const radiusBottom = node.css('borderBottomLeftRadius');
        const radiusLeft = node.css('borderBottomRightRadius');
        if (radiusTop === radiusRight && radiusRight === radiusBottom && radiusBottom === radiusLeft) {
            return (radiusTop === '' || radiusTop === '0px' ? [] : [radiusTop]);
        }
        else {
            return [radiusTop, radiusRight, radiusBottom, radiusLeft];
        }
    }

    private parseBoxDimensions(value: string, node?: T, attribute?: string) {
        const match = value.match(/^([0-9]+(?:px|pt|em)|auto)(?: ([0-9]+(?:px|pt|em)|auto))?(?: ([0-9]+(?:px|pt|em)))?(?: ([0-9]+(?:px|pt|em)))?$/);
        if (match != null) {
            if ((match[1] === '0px' && match[2] == null) || (match[1] === 'auto' && match[2] === 'auto')) {
                return [];
            }
            if (match[1] === 'auto' || match[2] === 'auto') {
                return [(match[1] === 'auto' ? '' : convertPX(match[1])), (match[2] === 'auto' ? '' : convertPX(match[2]))];
            }
            else if (match[2] == null || (match[1] === match[2] && match[1] === match[3] && match[1] === match[4])) {
                return [convertPX(match[1])];
            }
            else if (match[3] == null || (match[1] === match[3] && match[2] === match[4])) {
                return [convertPX(match[1]), convertPX(match[2])];
            }
            else {
                return [convertPX(match[1]), convertPX(match[2]), convertPX(match[3]), convertPX(match[4])];
            }
        }
        return [];
    }
}