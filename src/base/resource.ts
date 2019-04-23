import { REGEX_PATTERN } from '../lib/constant';
import { NODE_RESOURCE, USER_AGENT } from '../lib/enumeration';

import Application from './application';
import File from './file';
import Node from './node';
import NodeList from './nodelist';

import { parseColor } from '../lib/color';
import { cssFromParent, cssInheritStyle, getElementAsNode, hasLineBreak, isLineBreak, isUserAgent } from '../lib/dom';
import { convertAngle, convertInt, hasValue, isNumber } from '../lib/util';
import { replaceEntity } from '../lib/xml';

const REGEXP_DECIMAL = '(-?[\\d.]+)';
const REGEXP_COLORSTOP = `(?:\\s*(rgba?\\(\\d+, \\d+, \\d+(?:, [\\d.]+)?\\)|#[a-zA-Z\\d]{3,}|[a-z]+)\\s*(\\d+%|${REGEXP_DECIMAL})?,?\\s*)`;
const REGEXP_POSITION = /(.+?)?\s*at (.+?)$/;
const REGEXP_DEGREE = REGEXP_DECIMAL + '(deg|rad|turn|grad)';

function replaceExcluded<T extends Node>(element: HTMLElement, attr: string) {
    let result = element[attr];
    Array.from(element.children).forEach((item: Element) => {
        const child = getElementAsNode<T>(item);
        if (child && (child.excluded || hasValue(child.dataset.target)) && child[attr] && child[attr].trim() !== '') {
            result = result.replace(child[attr], '');
        }
    });
    return result;
}

function getColorStops(value: string, opacity: string, conic = false) {
    const result: ColorStop[] = [];
    const pattern = new RegExp(REGEXP_COLORSTOP, 'g');
    let match: RegExpExecArray | null;
    while ((match = pattern.exec(value)) !== null) {
        const color = parseColor(match[1], opacity);
        if (color && color.visible) {
            const item: ColorStop = {
                color: color.valueAsRGBA,
                opacity: color.alpha,
                offset: ''
            };
            if (conic) {
                if (match[3] && match[4]) {
                    item.offset = convertAngle(match[3], match[4]).toString();
                }
            }
            else {
                if (match[2]) {
                    item.offset = match[2];
                }
            }
            result.push(item);
        }
    }
    const lastStop = result[result.length - 1];
    if (lastStop.offset === '') {
        lastStop.offset = conic ? '360' : '100%';
    }
    let previousIncrement = 0;
    for (let i = 0; i < result.length; i++) {
        const item = result[i];
        if (item.offset === '') {
            if (i === 0) {
                item.offset = '0';
            }
            else {
                for (let j = i + 1, k = 2; j < result.length - 1; j++, k++) {
                    if (result[j].offset !== '') {
                        item.offset = ((previousIncrement + parseInt(result[j].offset)) / k).toString();
                        break;
                    }
                }
                if (item.offset === '') {
                    item.offset = (previousIncrement + parseInt(lastStop.offset) / (result.length - 1)).toString();
                }
            }
            if (!conic) {
                item.offset += '%';
            }
        }
        previousIncrement = parseInt(item.offset);
    }
    if (conic && previousIncrement < 360 || !conic && previousIncrement < 100) {
        const colorFill = Object.assign({}, result[result.length - 1]);
        colorFill.offset = conic ? '360' : '100%';
        result.push(colorFill);
    }
    return result;
}

function parseAngle(value: string | undefined) {
    if (value) {
        const match = new RegExp(REGEXP_DEGREE).exec(value.trim());
        if (match) {
            return convertAngle(match[1], match[2]);
        }
    }
    return 0;
}

function replaceWhiteSpace<T extends Node>(node: T, value: string): [string, boolean] {
    const renderParent = node.renderParent;
    if (node.multiLine && renderParent && !renderParent.layoutVertical) {
        value = value.replace(/^\s*\n/, '');
    }
    switch (node.css('whiteSpace')) {
        case 'nowrap':
            value = value.replace(/\n/g, ' ');
            break;
        case 'pre':
        case 'pre-wrap':
            if (renderParent && !renderParent.layoutVertical) {
                value = value.replace(/^\n/, '');
            }
            value = value.replace(/\n/g, '\\n');
            value = value.replace(/\s/g, '&#160;');
            break;
        case 'pre-line':
            value = value.replace(/\n/g, '\\n');
            value = value.replace(/\s+/g, ' ');
            break;
        default:
            const element = node.baseElement;
            if (element) {
                if (element.previousSibling && isLineBreak(<Element> element.previousSibling)) {
                    value = value.replace(/^\s+/, '');
                }
                if (element.nextSibling && isLineBreak(<Element> element.nextSibling)) {
                    value = value.replace(/\s+$/, '');
                }
            }
            return [value, false];
    }
    return [value, true];
}

export default abstract class Resource<T extends Node> implements androme.lib.base.Resource<T> {
    public static KEY_NAME = 'androme.resource';

    public static ASSETS: ResourceAssetMap = {
        ids: new Map(),
        images: new Map()
    };

    public static STORED: ResourceStoredMap = {
        strings: new Map(),
        arrays: new Map(),
        fonts: new Map(),
        colors: new Map(),
        styles: new Map(),
        dimens: new Map(),
        drawables: new Map(),
        images: new Map()
    };

    public static generateId(section: string, name: string, start: number) {
        const prefix = name;
        let i = start;
        if (start === 1) {
            name += `_${i.toString()}`;
        }
        const previous = this.ASSETS.ids.get(section) || [];
        do {
            if (!previous.includes(name)) {
                previous.push(name);
                break;
            }
            else {
                name = `${prefix}_${(++i).toString()}`;
            }
        }
        while (true);
        this.ASSETS.ids.set(section, previous);
        return name;
    }

    public static getStoredName(asset: string, value: any) {
        for (const [name, stored] of Resource.STORED[asset].entries()) {
            if (JSON.stringify(value) === JSON.stringify(stored)) {
                return name as string;
            }
        }
        return '';
    }

    public static insertStoredAsset(asset: string, name: string, value: any) {
        const stored: Map<string, any> = Resource.STORED[asset];
        if (stored) {
            let result = this.getStoredName(asset, value);
            if (result === '') {
                if (isNumber(name) || /^\d/.test(name)) {
                    name = `__${name}`;
                }
                if (hasValue(value)) {
                    let i = 0;
                    do {
                        result = name;
                        if (i > 0) {
                            result += `_${i}`;
                        }
                        if (!stored.has(result)) {
                            stored.set(result, value);
                        }
                        i++;
                    }
                    while (stored.has(result) && stored.get(result) !== value);
                }
            }
            return result;
        }
        return '';
    }

    public static isBorderVisible(border: BorderAttribute | undefined) {
        return !!border && !(
            border.style === 'none' ||
            border.width === '0px' ||
            border.color === '' ||
            border.color.length === 9 && border.color.endsWith('00')
        );
    }

    public static hasDrawableBackground(object: BoxStyle | undefined) {
        return (
            !!object && (
                this.isBorderVisible(object.borderTop) ||
                this.isBorderVisible(object.borderRight) ||
                this.isBorderVisible(object.borderBottom) ||
                this.isBorderVisible(object.borderLeft) ||
                !!object.backgroundImage ||
                !!object.borderRadius ||
                !!object.backgroundGradient
            )
        );
    }

    public fileHandler: File<T> | undefined;

    protected constructor(
        public application: Application<T>,
        public cache: NodeList<T>)
    {
    }

    public abstract get userSettings(): UserSettings;

    public finalize(data: SessionData<NodeList<T>>) {}

    public reset() {
        for (const name in Resource.ASSETS) {
            Resource.ASSETS[name] = new Map();
        }
        for (const name in Resource.STORED) {
            Resource.STORED[name] = new Map();
        }
        if (this.fileHandler) {
            this.fileHandler.reset();
        }
    }

    public setBoxStyle() {
        for (const node of this.cache.elements) {
            const boxStyle: BoxStyle = {
                background: null,
                borderTop: null,
                borderRight: null,
                borderBottom: null,
                borderLeft: null,
                borderRadius: null,
                backgroundColor: null,
                backgroundSize: null,
                backgroundImage: null,
                backgroundRepeat: null,
                backgroundPositionX: null,
                backgroundPositionY: null
            } as any;
            for (const attr in boxStyle) {
                const value = node.css(attr);
                switch (attr) {
                    case 'borderTop':
                    case 'borderRight':
                    case 'borderBottom':
                    case 'borderLeft': {
                        let cssColor = node.css(`${attr}Color`);
                        switch (cssColor.toLowerCase()) {
                            case 'initial':
                                cssColor = '#000000';
                                break;
                            case 'inherit':
                            case 'currentcolor':
                                cssColor = cssInheritStyle(node.element, `${attr}Color`);
                                break;
                        }
                        let width = node.css(`${attr}Width`) || '1px';
                        const style = node.css(`${attr}Style`) || 'none';
                        if (style === 'inset' && width === '0px') {
                            width = '1px';
                        }
                        const color = parseColor(cssColor, node.css('opacity'));
                        boxStyle[attr] = <BorderAttribute> {
                            width,
                            style,
                            color: style !== 'none' && color ? color.valueAsRGBA : ''
                        };
                        break;
                    }
                    case 'borderRadius': {
                        const [top, right, bottom, left] = [
                            node.css('borderTopLeftRadius'),
                            node.css('borderTopRightRadius'),
                            node.css('borderBottomLeftRadius'),
                            node.css('borderBottomRightRadius')
                        ];
                        if (top === right && right === bottom && bottom === left) {
                            boxStyle.borderRadius = convertInt(top) === 0 ? undefined : [top];
                        }
                        else {
                            boxStyle.borderRadius = [top, right, bottom, left];
                        }
                        break;
                    }
                    case 'backgroundColor': {
                        if (!node.has('backgroundColor') && (value === node.cssAscend('backgroundColor', false, true) || node.documentParent.visible && cssFromParent(node.element, 'backgroundColor'))) {
                            boxStyle.backgroundColor = '';
                        }
                        else {
                            const color = parseColor(value, node.css('opacity'));
                            boxStyle.backgroundColor = color ? color.valueAsRGBA : '';
                        }
                        break;
                    }
                    case 'background':
                    case 'backgroundImage': {
                        if (value !== 'none' && !node.hasBit('excludeResource', NODE_RESOURCE.IMAGE_SOURCE)) {
                            const gradients: Gradient[] = [];
                            const opacity = node.css('opacity');
                            let pattern = new RegExp(`(linear|radial|conic)-gradient\\(((?:to [a-z ]+|(?:from )?-?[\\d.]+(?:deg|rad|turn|grad)|circle|ellipse|closest-side|closest-corner|farthest-side|farthest-corner)?(?:\\s*at [\\w %]+)?),?\\s*(${REGEXP_COLORSTOP}+)\\)`, 'g');
                            let match: RegExpExecArray | null;
                            while ((match = pattern.exec(value)) !== null) {
                                let gradient!: Gradient;
                                switch (match[1]) {
                                    case 'linear': {
                                        if (match[2] === undefined) {
                                            match[2] = 'to bottom';
                                        }
                                        gradient = <LinearGradient> {
                                            type: 'linear',
                                            angle: (() => {
                                                switch (match[2]) {
                                                    case 'to top':
                                                        return 0;
                                                    case 'to right top':
                                                        return 45;
                                                    case 'to right':
                                                        return 90;
                                                    case 'to right bottom':
                                                        return 135;
                                                    case 'to bottom':
                                                        return 180;
                                                    case 'to left bottom':
                                                        return 225;
                                                    case 'to left':
                                                        return 270;
                                                    case 'to left top':
                                                        return 315;
                                                    default:
                                                        return parseAngle(match[2]);
                                                }
                                            })(),
                                            colorStops: getColorStops(match[3], opacity)
                                        };
                                        break;
                                    }
                                    case 'radial': {
                                        gradient = <RadialGradient> {
                                            type: 'radial',
                                            position: (() => {
                                                const result = ['center', 'ellipse'];
                                                if (match[2]) {
                                                    const position = REGEXP_POSITION.exec(match[2]);
                                                    if (position) {
                                                        if (position[1]) {
                                                            switch (position[1]) {
                                                                case 'ellipse':
                                                                case 'circle':
                                                                case 'closest-side':
                                                                case 'closest-corner':
                                                                case 'farthest-side':
                                                                case 'farthest-corner':
                                                                    result[1] = position[1];
                                                                    break;
                                                            }
                                                        }
                                                        if (position[2]) {
                                                            result[0] = position[2];
                                                        }
                                                    }
                                                }
                                                return result;
                                            })(),
                                            colorStops: getColorStops(match[3], opacity)
                                        };
                                        break;
                                    }
                                    case 'conic': {
                                        gradient = <ConicGradient> {
                                            type: 'conic',
                                            angle: parseAngle(match[2]),
                                            position: (() => {
                                                if (match[2]) {
                                                    const position = REGEXP_POSITION.exec(match[2]);
                                                    if (position) {
                                                        return [position[2]];
                                                    }
                                                }
                                                return ['center'];
                                            })(),
                                            colorStops: getColorStops(match[3], opacity, true)
                                        };
                                        break;
                                    }
                                }
                                if (gradient.colorStops.length > 1) {
                                    gradients.push(gradient);
                                }
                            }
                            if (gradients.length) {
                                boxStyle.backgroundGradient = gradients;
                            }
                            else {
                                const images: string[] = [];
                                pattern = new RegExp(REGEX_PATTERN.CSS_URL, 'g');
                                while ((match = pattern.exec(value)) !== null) {
                                    images.push(match[0]);
                                }
                                if (images.length) {
                                    boxStyle.backgroundImage = images;
                                }
                            }
                        }
                        break;
                    }
                    case 'backgroundSize':
                    case 'backgroundRepeat':
                    case 'backgroundPositionX':
                    case 'backgroundPositionY': {
                        boxStyle[attr] = value;
                        break;
                    }
                }
            }
            const borderTop = JSON.stringify(boxStyle.borderTop);
            if (borderTop === JSON.stringify(boxStyle.borderRight) && borderTop === JSON.stringify(boxStyle.borderBottom) && borderTop === JSON.stringify(boxStyle.borderLeft)) {
                boxStyle.border = boxStyle.borderTop;
            }
            node.data(Resource.KEY_NAME, 'boxStyle', boxStyle);
        }
    }

    public setFontStyle() {
        for (const node of this.cache) {
            const backgroundImage = Resource.hasDrawableBackground(node.data(Resource.KEY_NAME, 'boxStyle'));
            if (!(node.renderChildren.length ||
                node.baseElement === undefined ||
                node.imageElement ||
                node.svgElement ||
                node.tagName === 'HR' ||
                node.inlineText && !backgroundImage && !node.preserveWhiteSpace && node.element.innerHTML.trim() === ''))
            {
                const opacity = node.css('opacity');
                const color = parseColor(node.css('color'), opacity);
                let backgroundColor: ColorData | undefined;
                if (backgroundImage ||
                    node.cssAscend('backgroundColor', false, true) === node.css('backgroundColor') && (node.plainText || node.style.backgroundColor !== node.cssInitial('backgroundColor')) ||
                    !node.has('backgroundColor') && node.documentParent.visible && cssFromParent(node.element, 'backgroundColor'))
                {
                    backgroundColor = undefined;
                }
                else {
                    backgroundColor = parseColor(node.css('backgroundColor'), opacity);
                }
                let fontFamily = node.css('fontFamily');
                let fontSize = node.css('fontSize');
                let fontWeight = node.css('fontWeight');
                if (isUserAgent(USER_AGENT.EDGE) && !node.has('fontFamily')) {
                    switch (node.tagName) {
                        case 'TT':
                        case 'CODE':
                        case 'KBD':
                        case 'SAMP':
                            fontFamily = 'monospace';
                            break;
                    }
                }
                if (convertInt(fontSize) === 0) {
                    switch (fontSize) {
                        case 'xx-small':
                            fontSize = '8px';
                            break;
                        case 'x-small':
                            fontSize = '10px';
                            break;
                        case 'small':
                            fontSize = '13px';
                            break;
                        case 'medium':
                            fontSize = '16px';
                            break;
                        case 'large':
                            fontSize = '18px';
                            break;
                        case 'x-large':
                            fontSize = '24px';
                            break;
                        case 'xx-large':
                            fontSize = '32px';
                            break;
                    }
                }
                if (!isNumber(fontWeight)) {
                    switch (fontWeight) {
                        case 'lighter':
                            fontWeight = '200';
                            break;
                        case 'bold':
                            fontWeight = '700';
                            break;
                        case 'bolder':
                            fontWeight = '900';
                            break;
                        default:
                            fontWeight = '400';
                            break;
                    }
                }
                const result: FontAttribute = {
                    fontFamily,
                    fontStyle: node.css('fontStyle'),
                    fontSize,
                    fontWeight,
                    color: color ? color.valueAsRGBA : '',
                    backgroundColor: backgroundColor ? backgroundColor.valueAsRGBA : ''
                };
                node.data(Resource.KEY_NAME, 'fontStyle', result);
            }
        }
    }

    public setValueString() {
        for (const node of this.cache.visible) {
            const element = node.baseElement;
            if (element) {
                let name = '';
                let value = '';
                let inlineTrim = false;
                let performTrim = true;
                if (element instanceof HTMLInputElement) {
                    switch (element.type) {
                        case 'text':
                        case 'number':
                        case 'email':
                        case 'search':
                        case 'submit':
                        case 'reset':
                        case 'button':
                            value = element.value.trim();
                            break;
                        default:
                            if (node.companion && !node.companion.visible) {
                                value = node.companion.textContent.trim();
                            }
                            break;
                    }
                }
                else if (element instanceof HTMLTextAreaElement) {
                    value = element.value.trim();
                }
                else if (element instanceof HTMLElement) {
                    if (element.tagName === 'BUTTON') {
                        value = element.innerText;
                    }
                    else if (node.inlineText) {
                        name = node.textContent.trim();
                        if (element.tagName === 'CODE') {
                            value = replaceEntity(replaceExcluded(element, 'innerHTML'));
                        }
                        else if (hasLineBreak(element, true)) {
                            value = replaceEntity(replaceExcluded(element, 'innerHTML'));
                            value = value.replace(/\s*<br[^>]*>\s*/g, '\\n');
                            value = value.replace(/(<([^>]+)>)/ig, '');
                        }
                        else {
                            value = replaceEntity(replaceExcluded(element, 'textContent'));
                        }
                        [value, inlineTrim] = replaceWhiteSpace(node, value);
                    }
                    else if (element.innerText.trim() === '' && Resource.hasDrawableBackground(node.data(Resource.KEY_NAME, 'boxStyle'))) {
                        value = replaceEntity(element.innerText);
                        performTrim = false;
                    }
                }
                else if (node.plainText) {
                    name = node.textContent.trim();
                    value = replaceEntity(node.textContent);
                    value = value.replace(/&[A-Za-z]+;/g, match => match.replace('&', '&amp;'));
                    [value, inlineTrim] = replaceWhiteSpace(node, value);
                }
                if (value !== '') {
                    if (performTrim) {
                        const previousSibling = node.previousSiblings().pop();
                        const nextSibling = node.nextSiblings().shift();
                        let previousSpaceEnd = false;
                        if (previousSibling === undefined || previousSibling.multiLine || previousSibling.lineBreak || previousSibling.plainText && /\s+$/.test(previousSibling.textContent)) {
                            value = value.replace(/^\s+/, '');
                        }
                        else if (previousSibling.baseElement) {
                            previousSpaceEnd = /\s+$/.test((<HTMLElement> previousSibling.baseElement).innerText || previousSibling.textContent);
                        }
                        if (inlineTrim) {
                            const original = value;
                            value = value.trim();
                            if (previousSibling && !previousSibling.block && !previousSibling.lineBreak && !previousSpaceEnd && /^\s+/.test(original)) {
                                value = '&#160;' + value;
                            }
                            if (nextSibling && !nextSibling.lineBreak && /\s+$/.test(original)) {
                                value = value + '&#160;';
                            }
                        }
                        else {
                            if (!/^\s+$/.test(value)) {
                                value = value.replace(/^\s+/,
                                    previousSibling && (
                                        previousSibling.block ||
                                        previousSibling.lineBreak ||
                                        previousSpaceEnd && previousSibling.htmlElement && previousSibling.textContent.length > 1 ||
                                        node.multiLine && hasLineBreak(element)
                                    ) ? '' : '&#160;'
                                );
                                value = value.replace(/\s+$/, node.display === 'table-cell' || nextSibling && nextSibling.lineBreak || node.blockStatic ? '' : '&#160;');
                            }
                            else if (value.length) {
                                value = '&#160;' + value.substring(1);
                            }
                        }
                    }
                    if (value !== '') {
                        node.data(Resource.KEY_NAME, 'valueString', { name, value });
                    }
                }
            }
        }
    }

    get stored() {
        return Resource.STORED;
    }
}