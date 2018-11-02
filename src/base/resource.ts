import { NODE_RESOURCE, USER_AGENT } from '../lib/enumeration';

import { DOM_REGEX } from '../lib/constant';

import Node from './node';
import NodeList from './nodelist';
import Application from './application';
import File from './file';

import { convertInt, convertPX, formatPX, hasValue, isNumber, isPercent, isString, resolvePath } from '../lib/util';
import { convertClientUnit, cssAttribute, cssFromParent, cssInherit, getBoxSpacing, getElementCache, getStyle, hasLineBreak, isUserAgent, isLineBreak, setElementCache } from '../lib/dom';
import { replaceEntities } from '../lib/xml';
import { parseRGBA } from '../lib/color';

function createSvgGroup(): SvgGroup {
    return Object.assign({
            name: '',
            x: 0,
            y: 0,
            width: 0,
            height: 0,
            children: []
        },
        createSvgTransformAttributes()
    );
}

function createSvgTransformAttributes(): SvgTransformAttributes {
    return {
        translateX: 0,
        translateY: 0,
        scaleX: 1,
        scaleY: 1,
        rotateAngle: 0,
        rotateX: 0,
        rotateY: 0,
        skewX: 0,
        skewY: 0
    };
}

function buildSvgPath(item: SVGGraphicsElement, d: string) {
    if (isString(d) && d !== 'none' && cssAttribute(item, 'display') !== 'none' && !['hidden', 'collpase'].includes(cssAttribute(item, 'visibility'))) {
        const values = {
            fill: cssAttribute(item, 'fill'),
            stroke: cssAttribute(item, 'stroke')
        };
        const color = parseRGBA(cssAttribute(item, 'color')) || parseRGBA(cssInherit(item, 'color'));
        const pattern = /url\(#(.*?)\)/;
        for (const attr in values) {
            const match = pattern.exec(values[attr]);
            if (match) {
                values[attr] = `@${match[1]}`;
            }
            else if (isString(values[attr])) {
                switch (values[attr].toLowerCase()) {
                    case 'none':
                    case 'transparent':
                        values[attr] = '';
                        break;
                    case 'currentcolor':
                        values[attr] = color ? color.valueRGB : '';
                        break;
                    default:
                        const rgba = parseRGBA(values[attr]);
                        if (rgba) {
                            values[attr] = rgba.valueRGB;
                        }
                        break;
                }
            }
        }
        let clipPath = '';
        const href = pattern.exec(cssAttribute(item, 'clip-path'));
        if (href) {
            clipPath = href[1];
        }
        const fillOpacity = parseFloat(cssAttribute(item, 'fill-opacity'));
        const strokeOpacity = parseFloat(cssAttribute(item, 'stroke-opacity'));
        return <SvgPath> {
            name: item.id,
            element: item,
            color: color ? color.valueRGB : '',
            fillRule: cssAttribute(item, 'fill-rule'),
            fill: values.fill,
            stroke: values.stroke,
            strokeWidth: convertInt(cssAttribute(item, 'stroke-width')).toString(),
            fillOpacity: !isNaN(fillOpacity) && fillOpacity < 1 ? fillOpacity : 1,
            strokeOpacity: !isNaN(strokeOpacity) && strokeOpacity < 1 ? strokeOpacity : 1,
            strokeLinecap: cssAttribute(item, 'stroke-linecap'),
            strokeLinejoin: cssAttribute(item, 'stroke-linejoin'),
            strokeMiterlimit: cssAttribute(item, 'stroke-miterlimit'),
            gradients: [],
            clipPath,
            clipRule: cssAttribute(item, 'clip-rule'),
            d
        };
    }
    return null;
}

export default abstract class Resource<T extends Node> implements androme.lib.base.Resource<T> {
    public static STORED: ResourceMap = {
        strings: new Map(),
        arrays: new Map(),
        fonts: new Map(),
        colors: new Map(),
        styles: new Map(),
        dimens: new Map(),
        drawables: new Map(),
        images: new Map()
    };

    public static getSvgTransform(element: SVGGraphicsElement): SvgTransformAttributes {
        const result = createSvgTransformAttributes();
        for (let i = 0; i < element.transform.baseVal.numberOfItems; i++) {
            const item = element.transform.baseVal.getItem(i);
            switch (item.type) {
                case SVGTransform.SVG_TRANSFORM_TRANSLATE:
                    result.translateX += item.matrix.e;
                    result.translateY += item.matrix.f;
                    break;
                case SVGTransform.SVG_TRANSFORM_SCALE:
                    result.scaleX *= item.matrix.a;
                    result.scaleY *= item.matrix.d;
                    break;
                case SVGTransform.SVG_TRANSFORM_ROTATE:
                    result.rotateAngle += item.angle;
                    if (item.matrix.e > 0) {
                        result.rotateX = Math.round((item.matrix.e - item.matrix.f) / 2);
                        result.rotateY = item.matrix.e - result.rotateX;
                    }
                    break;
                case SVGTransform.SVG_TRANSFORM_SKEWX:
                    result.skewX += item.angle;
                    break;
                case SVGTransform.SVG_TRANSFORM_SKEWY:
                    result.skewY += item.angle;
                    break;
            }
        }
        const style = getStyle(element);
        if (style.transformOrigin && style.transformOrigin !== '0px 0px' && style.transformOrigin !== 'left top') {
            result.origin = this.parseBackgroundPosition(style.transformOrigin, element.getBoundingClientRect(), style.fontSize || '');
        }
        return result;
    }

    public static parseBackgroundPosition(value: string, dimension: BoxDimensions, fontSize?: string, percent = false) {
        const result: BoxPosition = {
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            horizontal: 'left',
            vertical: 'top',
            originalX: '',
            originalY: ''
        };
        const orientation = value.split(' ');
        if (orientation.length === 4) {
            orientation.forEach((position, index) => {
                switch (index) {
                    case 0:
                        result.horizontal = position;
                        break;
                    case 2:
                        result.vertical = position;
                        break;
                    case 1:
                    case 3:
                        const clientXY = convertClientUnit(position, index === 1 ? dimension.width : dimension.height, fontSize, percent);
                        if (index === 1) {
                            if (result.horizontal === 'right') {
                                if (isPercent(position)) {
                                    result.originalX = `${100 - parseInt(position)}%`;
                                }
                                else {
                                    result.originalX = formatPX(dimension.width - parseInt(convertPX(position, fontSize)));
                                }
                                result.right = clientXY;
                                result.left = percent ? 1 - clientXY : dimension.width - clientXY;
                            }
                            else {
                                result.left = clientXY;
                                result.originalX = position;
                            }
                        }
                        else {
                            if (result.horizontal === 'bottom') {
                                if (isPercent(position)) {
                                    result.originalY = `${100 - parseInt(position)}%`;
                                }
                                else {
                                    result.originalY = formatPX(dimension.height - parseInt(convertPX(position, fontSize)));
                                }
                                result.bottom = clientXY;
                                result.top = percent ? 1 - clientXY : dimension.height - clientXY;
                            }
                            else {
                                result.top = clientXY;
                                result.originalY = position;
                            }
                        }
                        break;
                }
            });
        }
        else if (orientation.length === 2) {
            orientation.forEach((position, index) => {
                const offsetParent = index === 0 ? dimension.width : dimension.height;
                const direction = index === 0 ? 'left' : 'top';
                const original = index === 0 ? 'originalX' : 'originalY';
                if (isPercent(position)) {
                    result[direction] = convertClientUnit(position, offsetParent, fontSize, percent);
                    result[original] = position;
                }
                else {
                    if (/^[a-z]+$/.test(position)) {
                        result[index === 0 ? 'horizontal' : 'vertical'] = position;
                        switch (position) {
                            case 'left':
                            case 'top':
                                result[original] = '0%';
                                break;
                            case 'right':
                            case 'bottom':
                                result[direction] = percent ? 1 : offsetParent;
                                result[original] = '100%';
                                break;
                            case 'center':
                                result[direction] = percent ? 0.5 : Math.round(offsetParent / 2);
                                result[original] = '50%';
                                break;
                        }
                    }
                    else {
                        result[direction] = convertClientUnit(position, offsetParent, fontSize, percent);
                        result[original] = position;
                    }
                }
            });
        }
        return result;
    }

    public static insertStoredAsset(asset: string, name: string, value: any) {
        const stored: Map<string, any> = Resource.STORED[asset];
        if (stored) {
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

    public static isBorderVisible(border?: BorderAttribute) {
        return border != null && !(border.style === 'none' || convertPX(border.width) === '0px' || border.color === '' || (typeof border.color === 'object' && !border.color.visible));
    }

    public static hasDrawableBackground(object?: BoxStyle) {
        return (
            object != null && (
                this.isBorderVisible(object.borderTop) ||
                this.isBorderVisible(object.borderRight) ||
                this.isBorderVisible(object.borderBottom) ||
                this.isBorderVisible(object.borderLeft) ||
                object.borderRadius.length > 0 ||
                (Array.isArray(object.backgroundImage) && object.backgroundImage.length > 0)
            )
        );
    }

    public static createSvgPath(element: SVGElement) {
        switch (element.tagName) {
            case 'path': {
                const subitem = <SVGPathElement> element;
                return buildSvgPath(subitem, cssAttribute(subitem, 'd'));
            }
            case 'line': {
                const subitem = <SVGLineElement> element;
                if (subitem.x1.baseVal.value !== 0 || subitem.y1.baseVal.value !== 0 || subitem.x2.baseVal.value !== 0 || subitem.y2.baseVal.value !== 0) {
                    const path = buildSvgPath(subitem, `M${subitem.x1.baseVal.value},${subitem.y1.baseVal.value} L${subitem.x2.baseVal.value},${subitem.y2.baseVal.value}`);
                    if (path && path.stroke) {
                        path.fill = '';
                        return path;
                    }
                }
                break;
            }
            case 'rect': {
                const subitem = <SVGRectElement> element;
                if (subitem.width.baseVal.value > 0 && subitem.height.baseVal.value > 0) {
                    const x = subitem.x.baseVal.value;
                    const y = subitem.y.baseVal.value;
                    return buildSvgPath(subitem, `M${x},${y} H${x + subitem.width.baseVal.value} V${y + subitem.height.baseVal.value} H${x} Z`);
                }
                break;
            }
            case 'polyline':
            case 'polygon': {
                const subitem = <SVGPolygonElement> element;
                if (subitem.points.numberOfItems > 0) {
                    const d: string[] = [];
                    for (let j = 0; j < subitem.points.numberOfItems; j++) {
                        const point = subitem.points.getItem(j);
                        d.push(`${point.x},${point.y}`);
                    }
                    return buildSvgPath(subitem, `M${d.join(' ') + (element.tagName === 'polygon' ? ' Z' : '')}`);
                }
                break;
            }
            case 'circle': {
                const subitem = <SVGCircleElement> element;
                const r = subitem.r.baseVal.value;
                if (r > 0) {
                    return buildSvgPath(subitem, `M${subitem.cx.baseVal.value},${subitem.cy.baseVal.value} m-${r},0 a${r},${r} 0 1,0 ${r * 2},0 a${r},${r} 0 1,0 -${r * 2},0`);
                }
                break;
            }
            case 'ellipse': {
                const subitem = <SVGEllipseElement> element;
                const rx = subitem.rx.baseVal.value;
                const ry = subitem.ry.baseVal.value;
                if (rx > 0 && ry > 0) {
                    return buildSvgPath(subitem, `M${subitem.cx.baseVal.value - rx},${subitem.cy.baseVal.value} a${rx},${ry} 0 1,0 ${rx * 2},0 a${rx},${ry} 0 1,0 -${rx * 2},0`);
                }
                break;
            }
        }
        return null;
    }

    public abstract settings: Settings;
    public cache: NodeList<T>;
    public application: Application<T>;
    public imageDimensions: Map<string, ImageAsset>;

    protected constructor(public file: File<T>) {
        this.file.stored = Resource.STORED;
    }

    public abstract finalize(viewData: ViewData<NodeList<T>>): FunctionVoid[];

    public addFile(pathname: string, filename: string, content = '', uri = '') {
        this.file.addFile(pathname, filename, content, uri);
    }

    public reset() {
        for (const name in Resource.STORED) {
            Resource.STORED[name] = new Map();
        }
        this.file.reset();
    }

    public setBoxStyle() {
        for (const node of this.cache.elements) {
            if (this.checkPermissions(node, NODE_RESOURCE.BOX_STYLE, 'boxStyle')) {
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
                                    cssColor = cssInherit(node.element, `${attr}Color`);
                                    break;
                            }
                            let width = node.css(`${attr}Width`) || '1px';
                            const style = node.css(`${attr}Style`) || 'none';
                            if (style === 'inset' && width === '0px') {
                                width = '1px';
                            }
                            const color = parseRGBA(cssColor, node.css('opacity'));
                            boxStyle[attr] = {
                                width,
                                style,
                                color: style !== 'none' && color && color.visible ? color : ''
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
                                boxStyle.borderRadius = convertInt(top) === 0 ? [] : [top];
                            }
                            else {
                                boxStyle.borderRadius = [top, right, bottom, left];
                            }
                            break;
                        }
                        case 'backgroundColor': {
                            if (!node.has('backgroundColor') && (
                                    value === node.cssParent('backgroundColor', false, true) || node.documentParent.visible && cssFromParent(node.element, 'backgroundColor')
                               ))
                            {
                                boxStyle.backgroundColor = '';
                            }
                            else {
                                const color = parseRGBA(value, node.css('opacity'));
                                boxStyle.backgroundColor = color && color.visible ? color : '';
                            }
                            break;
                        }
                        case 'backgroundSize': {
                            let result: string[] = [];
                            if (value !== 'auto' && value !== 'auto auto' && value !== 'initial' && value !== '0px') {
                                const match = value.match(/^(?:([\d.]+(?:px|pt|em|%)|auto)\s*)+$/);
                                const fontSize = node.css('fontSize');
                                if (match) {
                                    if (match[1] === 'auto' || match[2] === 'auto') {
                                        result = [match[1] === 'auto' ? '' : convertPX(match[1], fontSize), match[2] === 'auto' ? '' : convertPX(match[2], fontSize)];
                                    }
                                    else if (isPercent(match[1]) && match[3] == null) {
                                        result = [match[1], match[2]];
                                    }
                                    else if (match[2] == null || (match[1] === match[2] && match[1] === match[3] && match[1] === match[4])) {
                                        result = [convertPX(match[1], fontSize)];
                                    }
                                    else if (match[3] == null || (match[1] === match[3] && match[2] === match[4])) {
                                        result = [convertPX(match[1], fontSize), convertPX(match[2], fontSize)];
                                    }
                                    else {
                                        result = [convertPX(match[1], fontSize), convertPX(match[2], fontSize), convertPX(match[3], fontSize), convertPX(match[4], fontSize)];
                                    }
                                }
                            }
                            boxStyle.backgroundSize = result;
                            break;
                        }
                        case 'background':
                        case 'backgroundImage': {
                            if (value !== 'none' && !node.hasBit('excludeResource', NODE_RESOURCE.IMAGE_SOURCE)) {
                                function colorStop(parse: boolean) {
                                    return `${parse ? '' : '(?:'},?\\s*(${parse ? '' : '?:'}rgba?\\(\\d+, \\d+, \\d+(?:, [\\d.]+)?\\)|[a-z]+)\\s*(${parse ? '' : '?:'}\\d+%)?${parse ? '' : ')'}`;
                                }
                                const gradients: Gradient[] = [];
                                let pattern: Null<RegExp> = new RegExp(`([a-z\-]+)-gradient\\(([\\w\\s%]+)?(${colorStop(false)}+)\\)`, 'g');
                                let match: Null<RegExpExecArray> = null;
                                while ((match = pattern.exec(value)) != null) {
                                    let gradient: Gradient;
                                    if (match[1] === 'linear') {
                                        gradient = <LinearGradient> {
                                            type: 'linear',
                                            x1: 0,
                                            y1: 0,
                                            x2: 0,
                                            y2: 0,
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
                                                        return convertInt(match[2]);
                                                }
                                            })(),
                                            colorStop: []
                                        };
                                    }
                                    else {
                                        gradient = <RadialGradient> {
                                            type: 'radial',
                                            cx: 0,
                                            cy: 0,
                                            r: 0,
                                            shapePosition: (() => {
                                                const result = ['ellipse', 'center'];
                                                if (match[2]) {
                                                    const shape = match[2].split('at').map(item => item.trim());
                                                    switch (shape[0]) {
                                                        case 'ellipse':
                                                        case 'circle':
                                                        case 'closest-side':
                                                        case 'closest-corner':
                                                        case 'farthest-side':
                                                        case 'farthest-corner':
                                                            result[0] = shape[0];
                                                            break;
                                                        default:
                                                            result[1] = shape[0];
                                                            break;
                                                    }
                                                    if (shape[1]) {
                                                        result[1] = shape[1];
                                                    }
                                                }
                                                return result;
                                            })(),
                                            colorStop: []
                                        };
                                    }
                                    const stopMatch = match[3].trim().split(new RegExp(colorStop(true), 'g'));
                                    const opacity = node.css('opacity');
                                    for (let i = 0; i < stopMatch.length; i += 3) {
                                        const rgba = stopMatch[i + 1];
                                        if (isString(rgba)) {
                                            const color = parseRGBA(stopMatch[i + 1], rgba.startsWith('rgba') ? undefined : opacity);
                                            if (color && color.visible) {
                                                gradient.colorStop.push({
                                                    color,
                                                    offset: stopMatch[i + 2],
                                                    opacity: color.alpha
                                                });
                                            }
                                        }
                                    }
                                    if (gradient.colorStop.length > 1) {
                                        gradients.push(gradient);
                                    }
                                }
                                if (gradients.length > 0) {
                                    boxStyle.backgroundGradient = gradients.reverse();
                                }
                                else {
                                    const images: string[] = [];
                                    pattern = new RegExp(DOM_REGEX.CSS_URL, 'g');
                                    match = null;
                                    while ((match = pattern.exec(value)) != null) {
                                        if (match) {
                                            images.push(match[0]);
                                        }
                                    }
                                    boxStyle.backgroundImage = images;
                                }
                            }
                            break;
                        }
                        case 'backgroundRepeat':
                        case 'backgroundPositionX':
                        case 'backgroundPositionY': {
                            boxStyle[attr] = value;
                            break;
                        }
                    }
                }
                const borderTop = JSON.stringify(boxStyle.borderTop);
                if (borderTop === JSON.stringify(boxStyle.borderRight) &&
                    borderTop === JSON.stringify(boxStyle.borderBottom) &&
                    borderTop === JSON.stringify(boxStyle.borderLeft))
                {
                    boxStyle.border = boxStyle.borderTop;
                }
                setElementCache(node.element, 'boxStyle', boxStyle);
            }
        }
    }

    public setFontStyle() {
        this.cache.each(node => {
            if (this.checkPermissions(node, NODE_RESOURCE.FONT_STYLE, 'fontStyle')) {
                const backgroundImage = Resource.hasDrawableBackground(<BoxStyle> getElementCache(node.element, 'boxStyle'));
                if (node.length > 0 || node.imageElement || node.tagName === 'HR' || (node.inlineText && !backgroundImage && !node.preserveWhiteSpace && node.element.innerHTML.trim() === '')) {
                    return;
                }
                else {
                    const opacity = node.css('opacity');
                    const color = parseRGBA(node.css('color'), opacity) || '';
                    let backgroundColor: string | ColorHexAlpha = node.css('backgroundColor');
                    if (!(backgroundImage ||
                        (node.cssParent('backgroundColor', false, true) === backgroundColor && (node.plainText || backgroundColor !== node.styleMap.backgroundColor)) ||
                        (!node.has('backgroundColor') && node.documentParent.visible && cssFromParent(node.element, 'backgroundColor'))))
                    {
                        backgroundColor = parseRGBA(node.css('backgroundColor'), opacity) || '';
                    }
                    else {
                        backgroundColor = '';
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
                        color,
                        backgroundColor
                    };
                    setElementCache(node.element, 'fontStyle', result);
                }
            }
        });
    }

    public setBoxSpacing() {
        for (const node of this.cache.elements) {
            if (this.checkPermissions(node, NODE_RESOURCE.BOX_SPACING, 'boxSpacing')) {
                const boxSpacing = getBoxSpacing(node.element);
                const result = {};
                for (const attr in boxSpacing) {
                    if (node.inlineStatic && (attr === 'marginTop' || attr === 'marginBottom')) {
                        result[attr] = '0px';
                    }
                    else {
                        result[attr] = convertPX(boxSpacing[attr], node.css('fontSize'));
                    }
                }
                setElementCache(node.element, 'boxSpacing', result);
            }
        }
    }

    public setValueString() {
        function replaceWhiteSpace(node: T, value: string): [string, boolean] {
            if (node.multiLine && !node.renderParent.linearVertical) {
                value = value.replace(/^\s*\n/, '');
            }
            switch (node.css('whiteSpace')) {
                case 'nowrap':
                    value = value.replace(/\n/g, ' ');
                    break;
                case 'pre':
                case 'pre-wrap':
                    if (!node.renderParent.linearVertical) {
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
                    if (isLineBreak(<Element> node.element.previousSibling)) {
                        value = value.replace(/^\s+/, '');
                    }
                    if (isLineBreak(<Element> node.element.nextSibling)) {
                        value = value.replace(/\s+$/, '');
                    }
                    return [value, false];
            }
            return [value, true];
        }
        for (const node of this.cache.visible) {
            const element = node.element;
            if (this.checkPermissions(node, NODE_RESOURCE.VALUE_STRING, 'valueString')) {
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
                        value = replaceEntities(element.children.length > 0 || element.tagName === 'CODE' ? element.innerHTML : node.textContent);
                        [value, inlineTrim] = replaceWhiteSpace(node, value);
                        value = value.replace(/\s*<br\s*\/?>\s*/g, '\\n');
                        value = value.replace(/\s+(class|style)=".*?"/g, '');
                    }
                    else if (element.innerText.trim() === '' && Resource.hasDrawableBackground(<BoxStyle> getElementCache(element, 'boxStyle'))) {
                        value = replaceEntities(element.innerText);
                        performTrim = false;
                    }
                }
                else if (node.plainText) {
                    name = node.textContent.trim();
                    value = replaceEntities(node.textContent);
                    value = value.replace(/&[A-Za-z]+;/g, match => match.replace('&', '&amp;'));
                    [value, inlineTrim] = replaceWhiteSpace(node, value);
                }
                if (value !== '') {
                    if (performTrim) {
                        const previousSibling = node.previousSibling();
                        const nextSibling = node.nextSibling();
                        let previousSpaceEnd = false;
                        if (!previousSibling || previousSibling.multiLine || previousSibling.lineBreak) {
                            value = value.replace(/^\s+/, '');
                        }
                        else {
                            previousSpaceEnd = /\s+$/.test((<HTMLElement> previousSibling.element).innerText || previousSibling.element.textContent || '');
                        }
                        if (inlineTrim) {
                            const original = value;
                            value = value.trim();
                            if (previousSibling &&
                                !previousSibling.block &&
                                !previousSibling.lineBreak &&
                                !previousSpaceEnd && /^\s+/.test(original))
                            {
                                value = '&#160;' + value;
                            }
                            if (nextSibling && !nextSibling.lineBreak && /\s+$/.test(original)) {
                                value = value + '&#160;';
                            }
                        }
                        else {
                            if (!/^\s+$/.test(value)) {
                                value = value.replace(/^\s+/, (
                                    previousSibling && (
                                        previousSibling.block ||
                                        previousSibling.lineBreak ||
                                        (previousSibling.element instanceof HTMLElement && previousSibling.element.innerText.length > 1 && previousSpaceEnd) ||
                                        (node.multiLine && hasLineBreak(element))
                                    ) ? '' : '&#160;')
                                );
                                value = value.replace(/\s+$/, nextSibling && nextSibling.lineBreak ? '' : '&#160;');
                            }
                            else if (value.length > 0) {
                                value = '&#160;' + value.substring(1);
                            }
                        }
                    }
                    if (value !== '') {
                        if (node.renderParent.layoutVertical && node.inlineText) {
                            const textIndent = node.toInt('textIndent');
                            if (textIndent > 0) {
                                value = '&#160;'.repeat(Math.ceil(textIndent / 6)) + value;
                            }
                        }
                        setElementCache(element, 'valueString', { name, value });
                    }
                }
            }
        }
    }

    public setOptionArray() {
        this.cache.list.filter(node =>
            node.visible &&
            node.tagName === 'SELECT' &&
            this.checkPermissions(node, NODE_RESOURCE.OPTION_ARRAY, 'optionArray')
        ).forEach(node => {
            const element = <HTMLSelectElement> node.element;
            const stringArray: string[] = [];
            let numberArray: Null<string[]> = [];
            let i = -1;
            while (++i < element.children.length) {
                const item = <HTMLOptionElement> element.children[i];
                const value = item.text.trim();
                if (value !== '') {
                    if (numberArray && stringArray.length === 0 && isNumber(value)) {
                        numberArray.push(value);
                    }
                    else {
                        if (numberArray && numberArray.length > 0) {
                            i = -1;
                            numberArray = null;
                            continue;
                        }
                        if (value !== '') {
                            stringArray.push(value);
                        }
                    }
                }
            }
            setElementCache(element, 'optionArray', {
                stringArray: stringArray.length > 0 ? stringArray : null,
                numberArray: numberArray && numberArray.length > 0 ? numberArray : null
            });
        });
    }

    public setImageSource() {
        function addClipPath(svg: Svg, clipPath: SVGClipPathElement) {
            if (clipPath.id) {
                const result: SvgPath[] = [];
                for (const item of Array.from(clipPath.children)) {
                    const path = Resource.createSvgPath(<SVGElement> item);
                    if (path) {
                        result.push(path);
                    }
                }
                if (result.length > 0) {
                    svg.defs.clipPath.set(`${clipPath.id}`, result);
                }
            }
        }
        function getColorStop(gradient: SVGGradientElement) {
            const result: ColorStop[] = [];
            Array.from(gradient.getElementsByTagName('stop')).forEach(stop => {
                const color = parseRGBA(cssAttribute(stop, 'stop-color'), cssAttribute(stop, 'stop-opacity'));
                if (color) {
                    result.push({
                        color,
                        offset: cssAttribute(stop, 'offset'),
                        opacity: color.alpha
                    });
                }
            });
            return result;
        }
        this.cache.visible.forEach(node => {
            if (this.checkPermissions(node, NODE_RESOURCE.IMAGE_SOURCE, 'imageSource')) {
                if (node.svgElement) {
                    const element = <SVGSVGElement> node.element;
                    if (element.children.length > 0) {
                        const opacity = parseFloat(node.css('opacity'));
                        const result: Svg = {
                            element,
                            name: element.id,
                            width: element.width.baseVal.value,
                            height: element.height.baseVal.value,
                            viewBoxWidth: element.viewBox.baseVal.width,
                            viewBoxHeight: element.viewBox.baseVal.height,
                            opacity: !isNaN(opacity) && opacity < 1 ? opacity : 1,
                            defs: {
                                image: [],
                                clipPath: new Map<string, SvgPath[]>(),
                                gradient: new Map<string, Gradient>()
                            },
                            children: []
                        };
                        element.querySelectorAll('clipPath, linearGradient, radialGradient, image').forEach((item: SVGElement) => {
                            switch (item.tagName) {
                                case 'clipPath': {
                                    addClipPath(result, <SVGClipPathElement> item);
                                    break;
                                }
                                case 'linearGradient': {
                                    const gradient = <SVGLinearGradientElement> item;
                                    result.defs.gradient.set(`@${gradient.id}`, <LinearGradient> {
                                        type: 'linear',
                                        x1: gradient.x1.baseVal.value,
                                        x2: gradient.x2.baseVal.value,
                                        y1: gradient.y1.baseVal.value,
                                        y2: gradient.y2.baseVal.value,
                                        x1AsString: gradient.x1.baseVal.valueAsString,
                                        x2AsString: gradient.x2.baseVal.valueAsString,
                                        y1AsString: gradient.y1.baseVal.valueAsString,
                                        y2AsString: gradient.y2.baseVal.valueAsString,
                                        colorStop: getColorStop(gradient)
                                    });
                                    break;
                                }
                                case 'radialGradient': {
                                    const gradient = <SVGRadialGradientElement> item;
                                    result.defs.gradient.set(`@${gradient.id}`, <RadialGradient> {
                                        type: 'radial',
                                        cx: gradient.cx.baseVal.value,
                                        cy: gradient.cy.baseVal.value,
                                        r: gradient.r.baseVal.value,
                                        cxAsString: gradient.cx.baseVal.valueAsString,
                                        cyAsString: gradient.cy.baseVal.valueAsString,
                                        rAsString: gradient.r.baseVal.valueAsString,
                                        fx: gradient.fx.baseVal.value,
                                        fy: gradient.fy.baseVal.value,
                                        fxAsString: gradient.fx.baseVal.valueAsString,
                                        fyAsString: gradient.fy.baseVal.valueAsString,
                                        colorStop: getColorStop(gradient)
                                    });
                                    break;
                                }
                                case 'image': {
                                    const image = <SVGImageElement> item;
                                    const uri = resolvePath(image.href.baseVal);
                                    const dimension = this.imageDimensions.get(uri);
                                    const transform = Resource.getSvgTransform(image);
                                    let width = image.width.baseVal.value;
                                    let height = image.height.baseVal.value;
                                    if (dimension) {
                                        if (width === 0) {
                                            width = dimension.width;
                                        }
                                        if (height === 0) {
                                            height = dimension.height;
                                        }
                                    }
                                    const data = Object.assign({
                                            element: image,
                                            width,
                                            height,
                                            uri,
                                            position: {
                                                x: image.x.baseVal.value,
                                                y: image.y.baseVal.value
                                            }
                                        },
                                        transform
                                    );
                                    result.defs.image.push(data);
                                    break;
                                }
                            }
                        });
                        const baseTags = new Set(['svg', 'g']);
                        [element, ...Array.from(element.children).filter(item => baseTags.has(item.tagName))].forEach((item: SVGGraphicsElement, index) => {
                            const group: SvgGroup = createSvgGroup();
                            group.element = item;
                            group.name = item.id;
                            if (index > 0) {
                                Object.assign(group, Resource.getSvgTransform(item));
                                if (item.tagName === 'svg') {
                                    const svg = <SVGSVGElement> item;
                                    group.x = svg.x.baseVal.value;
                                    group.y = svg.y.baseVal.value;
                                    group.width = svg.width.baseVal.value;
                                    group.height = svg.height.baseVal.value;
                                }
                            }
                            for (let i = 0; i < item.children.length; i++) {
                                const path = Resource.createSvgPath(<SVGElement> item.children[i]);
                                if (path) {
                                    group.children.push(path);
                                }
                            }
                            result.children.push(group);
                        });
                        element.querySelectorAll('use').forEach((item: SVGUseElement) => {
                            let groupParent: Null<SvgGroup> = null;
                            let pathParent: Null<SvgPath> = null;
                            for (let i = 0; i < result.children.length; i++) {
                                groupParent = result.children[i];
                                for (let j = 0; j < groupParent.children.length; j++) {
                                    if (item.href.baseVal === `#${groupParent.children[j].name}`) {
                                        pathParent = groupParent.children[j];
                                        break;
                                    }
                                }
                            }
                            if (groupParent && pathParent) {
                                const usePath = buildSvgPath(item, pathParent.d);
                                if (usePath) {
                                    if (item.transform.baseVal.numberOfItems === 0 && item.x.baseVal.value === 0 && item.y.baseVal.value === 0 && item.width.baseVal.value === 0 && item.height.baseVal.value === 0) {
                                        result.children.some(groupItem => {
                                            if (item.parentElement instanceof SVGGraphicsElement && item.parentElement === groupItem.element) {
                                                groupItem.children.push(usePath);
                                                return true;
                                            }
                                            return false;
                                        });
                                    }
                                    else {
                                        const useGroup: SvgGroup = Object.assign(createSvgGroup(), Resource.getSvgTransform(item));
                                        useGroup.element = item;
                                        useGroup.name = item.id;
                                        useGroup.x = item.x.baseVal.value;
                                        useGroup.y = item.y.baseVal.value;
                                        useGroup.width = item.width.baseVal.value;
                                        useGroup.height = item.height.baseVal.value;
                                        useGroup.children.push(usePath);
                                        result.children.push(useGroup);
                                    }
                                }
                            }
                        });
                        const sorted = new Set<SvgGroup>();
                        Array.from(element.children).forEach(item => {
                            const children = new Set(Array.from(item.querySelectorAll('*')));
                            for (const group of result.children) {
                                if (group.children.length > 0) {
                                    if (group.element && (group.element === item || children.has(group.element))) {
                                        sorted.delete(group);
                                        sorted.add(group);
                                        return;
                                    }
                                    for (const path of group.children) {
                                        if (path.element && (path.element === item || children.has(path.element))) {
                                            sorted.delete(group);
                                            sorted.add(group);
                                            return;
                                        }
                                    }
                                }
                            }
                        });
                        result.children = result.children.filter(item => item.children.length > 0 && !sorted.has(item));
                        result.children.push(...sorted);
                        if (result.children.length > 0 || result.defs.image.length > 0) {
                            setElementCache(element, 'imageSource', result);
                        }
                    }
                }
            }
        });
    }

    private checkPermissions(node: Node, resourceFlag: number, storedName: string) {
        return !node.hasBit('excludeResource', resourceFlag) && (!getElementCache(node.element, storedName) || this.settings.alwaysReevaluateResources);
    }
}