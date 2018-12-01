import { REGEX_PATTERN } from './constant';
import { USER_AGENT } from './enumeration';

import { capitalize, convertCamelCase, convertInt, convertPX, formatPercent, formatPX, hasBit, hasValue, isPercent, maxArray, minArray, resolvePath, withinFraction } from './util';

type T = androme.lib.base.Node;

export function isUserAgent(value: number) {
    let client = USER_AGENT.CHROME;
    if (navigator.userAgent.indexOf('Edge') !== -1) {
        client = USER_AGENT.EDGE;
    }
    else if (navigator.userAgent.indexOf('Firefox') !== -1) {
        client = USER_AGENT.FIREFOX;
    }
    else if (navigator.userAgent.indexOf('Chrome') === -1 && navigator.userAgent.indexOf('Safari') !== -1) {
        client = USER_AGENT.SAFARI;
    }
    return hasBit(value, client);
}

export function getDataSet(element: Element, prefix: string) {
    const result: StringMap = {};
    if (hasComputedStyle(element)) {
        prefix = convertCamelCase(prefix, '\\.');
        for (const attr in element.dataset) {
            if (attr.length > prefix.length && attr.startsWith(prefix)) {
                result[capitalize(attr.substring(prefix.length), false)] = element.dataset[attr] as string;
            }
        }
    }
    return result;
}

export function newBoxRect(): BoxRect {
    return {
        top: 0,
        left: 0,
        right: 0,
        bottom: 0
    };
}

export function newRectDimensions(): RectDimensions {
    return Object.assign({ width: 0, height: 0 }, newBoxRect());
}

export function newBoxModel(): BoxModel {
    return {
        marginTop: 0,
        marginRight: 0,
        marginBottom: 0,
        marginLeft: 0,
        paddingTop: 0,
        paddingRight: 0,
        paddingBottom: 0,
        paddingLeft: 0
    };
}

export function createElement(parent?: Element, block = false) {
    const element = document.createElement(block ? 'DIV' : 'SPAN');
    element.style.display = 'none';
    element.className = 'androme.display.none';
    if (parent instanceof HTMLElement) {
        parent.appendChild(element);
    }
    return element;
}

export function removeElementsByClassName(className: string) {
    Array.from(document.getElementsByClassName(className)).forEach(element => element.parentElement && element.parentElement.removeChild(element));
}

export function convertClientUnit(value: string, dimension: number, dpi: number, fontSize: number, percent = false) {
    if (percent) {
        return isPercent(value) ? convertInt(value) / 100 : (parseFloat(convertPX(value, dpi, fontSize)) / dimension);
    }
    else {
        return isPercent(value) ? Math.round(dimension * (convertInt(value) / 100)) : parseInt(convertPX(value, dpi, fontSize));
    }
}

export function getRangeClientRect(element: Element): TextDimensions {
    const range = document.createRange();
    range.selectNodeContents(element);
    const domRect = Array.from(range.getClientRects()).filter(item => !(Math.round(item.width) === 0 && withinFraction(item.left, item.right)));
    let bounds: RectDimensions = newRectDimensions();
    let multiLine = 0;
    if (domRect.length) {
        bounds = assignBounds(domRect[0]);
        const top = new Set([bounds.top]);
        const bottom = new Set([bounds.bottom]);
        for (let i = 1 ; i < domRect.length; i++) {
            const rect = domRect[i];
            top.add(rect.top);
            bottom.add(rect.bottom);
            bounds.width += rect.width;
            bounds.right = Math.max(rect.right, bounds.right);
            bounds.height = Math.max(rect.height, bounds.height);
        }
        if (top.size > 1 && bottom.size > 1) {
            bounds.top = minArray(Array.from(top));
            bounds.bottom = maxArray(Array.from(bottom));
            if (domRect[domRect.length - 1].top >= domRect[0].bottom && element.textContent && (element.textContent.trim() !== '' || /^\s*\n/.test(element.textContent))) {
                multiLine = domRect.length - 1;
            }
        }
    }
    return Object.assign(bounds, { multiLine });
}

export function assignBounds(bounds: RectDimensions | DOMRect): RectDimensions {
    return {
        top: bounds.top,
        right: bounds.right,
        bottom: bounds.bottom,
        left: bounds.left,
        width: bounds.width,
        height: bounds.height
    };
}

export function getStyle(element: Element | null, cache = true): CSSStyleDeclaration {
    if (element) {
        if (cache) {
            const node = getElementAsNode<T>(element);
            const style = getElementCache(element, 'style');
            if (style) {
                return style;
            }
            else if (node) {
                if (node.style) {
                    return node.style;
                }
                else if (node.plainText) {
                    return node.unsafe('styleMap') as CSSStyleDeclaration || {};
                }
            }
        }
        if (element.nodeName && element.nodeName.charAt(0) !== '#') {
            const style = getComputedStyle(element);
            setElementCache(element, 'style', style);
            return style;
        }
    }
    return <CSSStyleDeclaration> {};
}

export function getBoxSpacing(element: Element, complete = false, merge = false) {
    const result = {};
    const node = getElementAsNode(element);
    const style = getStyle(element);
    ['Top', 'Left', 'Right', 'Bottom'].forEach(direction => {
        let total = 0;
        ['padding', 'margin'].forEach(region => {
            const attr = region + direction;
            const value = convertInt((node || style)[attr]);
            if (complete || value !== 0) {
                result[attr] = value;
            }
            total += value;
        });
        if (merge) {
            result[`padding${direction}`] = total;
            if (complete) {
                result[`margin${direction}`] = 0;
            }
            else {
                delete result[`margin${direction}`];
            }
        }
    });
    return <BoxModel> result;
}

export function cssResolveUrl(value: string) {
    const match = value.match(REGEX_PATTERN.CSS_URL);
    if (match) {
        return resolvePath(match[1]);
    }
    return '';
}

export function cssInherit(element: Element, attr: string, exclude?: string[], tagNames?: string[]) {
    let result = '';
    let current = element.parentElement;
    while (current && (tagNames === undefined || !tagNames.includes(current.tagName))) {
        result = getStyle(current)[attr] || '';
        if (result === 'inherit' || exclude && exclude.some(value => result.indexOf(value) !== -1)) {
            result = '';
        }
        if (current === document.body || result) {
            break;
        }
        current = current.parentElement;
    }
    return result;
}

export function cssParent(element: Element, attr: string, ...styles: string[]) {
    if (element.nodeName.charAt(0) !== '#') {
        if (styles.includes(getStyle(element)[attr])) {
            return true;
        }
    }
    if (element.parentElement) {
        return styles.includes(getStyle(element.parentElement)[attr]);
    }
    return false;
}

export function cssFromParent(element: Element, attr: string) {
    if (element.parentElement && hasComputedStyle(element)) {
        const node = getElementAsNode<T>(element);
        const style = getStyle(element);
        if (node && style) {
            return style[attr] === getStyle(element.parentElement)[attr] && !node.cssInitial(attr);
        }
    }
    return false;
}

export function cssAttribute(element: Element, attr: string): string {
    return element.getAttribute(attr) || getStyle(element)[convertCamelCase(attr)] || '';
}

export function getBackgroundPosition(value: string, dimension: RectDimensions, dpi: number, fontSize: number, leftPerspective = false, percent = false) {
    const result: RectPosition = {
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
                    const clientXY = convertClientUnit(position, index === 1 ? dimension.width : dimension.height, dpi, fontSize, percent);
                    if (index === 1) {
                        if (leftPerspective) {
                            if (result.horizontal === 'right') {
                                if (isPercent(position)) {
                                    result.originalX = formatPercent(100 - parseInt(position));
                                }
                                else {
                                    result.originalX = formatPX(dimension.width - parseInt(convertPX(position, dpi, fontSize)));
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
                            if (result.horizontal !== 'center') {
                                result[result.horizontal] = clientXY;
                            }
                        }
                    }
                    else {
                        if (leftPerspective) {
                            if (result.vertical === 'bottom') {
                                if (isPercent(position)) {
                                    result.originalY = formatPercent(100 - parseInt(position));
                                }
                                else {
                                    result.originalY = formatPX(dimension.height - parseInt(convertPX(position, dpi, fontSize)));
                                }
                                result.bottom = clientXY;
                                result.top = percent ? 1 - clientXY : dimension.height - clientXY;
                            }
                            else {
                                result.top = clientXY;
                                result.originalY = position;
                            }
                        }
                        else {
                            if (result.vertical !== 'center') {
                                result[result.vertical] = clientXY;
                            }
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
            const clientXY = convertClientUnit(position, offsetParent, dpi, fontSize, percent);
            if (isPercent(position)) {
                result[direction] = clientXY;
                result[original] = position;
            }
            else {
                if (/^[a-z]+$/.test(position)) {
                    result[index === 0 ? 'horizontal' : 'vertical'] = position;
                    if (leftPerspective) {
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
                }
                else {
                    result[direction] = clientXY;
                    result[original] = position;
                }
            }
        });
    }
    return result;
}

export function getFirstChildElement(element: Element, lineBreak = false) {
    if (element instanceof HTMLElement) {
        for (let i = 0; i < element.childNodes.length; i++) {
            const node = getElementAsNode<T>(<Element> element.childNodes[i]);
            if (node && (!node.excluded || (lineBreak && node.lineBreak))) {
                return node.element;
            }
        }
    }
    return null;
}

export function getLastChildElement(element: Element, lineBreak = false) {
    if (element instanceof HTMLElement) {
        for (let i = element.childNodes.length - 1; i >= 0; i--) {
            const node = getElementAsNode<T>(<Element> element.childNodes[i]);
            if (node && (!node.excluded || (lineBreak && node.lineBreak))) {
                return node.element;
            }
        }
    }
    return null;
}

export function hasFreeFormText(element: Element, whiteSpace = true) {
    function findFreeForm(elements: any[]): boolean {
        return elements.some((child: Element) => {
            if (child.nodeName === '#text') {
                if (isPlainText(child, whiteSpace) || cssParent(child, 'whiteSpace', 'pre', 'pre-wrap') && child.textContent && child.textContent !== '') {
                    return true;
                }
            }
            else if (child instanceof HTMLElement && hasVisibleDimensions(child) && child.childNodes.length && findFreeForm(Array.from(child.childNodes))) {
                return true;
            }
            return false;
        });
    }
    if (element.nodeName === '#text') {
        return findFreeForm([element]);
    }
    else {
        return findFreeForm(Array.from(element.childNodes));
    }
}

export function isPlainText(element: Element, whiteSpace = false) {
    if (element && element.nodeName === '#text' && element.textContent) {
        if (whiteSpace) {
            const value = element.textContent;
            let valid = false;
            for (let i = 0; i < value.length; i++) {
                switch (value.charCodeAt(i)) {
                    case 9:
                    case 10:
                    case 13:
                    case 32:
                        continue;
                    default:
                        valid = true;
                        break;
                }
            }
            return valid && value !== '';
        }
        else {
            return element.textContent.trim() !== '';
        }
    }
    return false;
}

export function hasLineBreak(element: Element, trim = false) {
    if (element) {
        const node = getElementAsNode<T>(element);
        const whiteSpace = node ? node.css('whiteSpace') : (getStyle(element).whiteSpace || '');
        let value = element.textContent || '';
        if (trim) {
            value = value.trim();
        }
        return (
            (element instanceof HTMLElement && element.children.length && Array.from(element.children).some(item => item.tagName === 'BR')) ||
            (/\n/.test(value) && (
                ['pre', 'pre-wrap'].includes(whiteSpace) ||
                (element.nodeName === '#text' && cssParent(element, 'whiteSpace', 'pre', 'pre-wrap'))
            ))
        );
    }
    return false;
}

export function isLineBreak(element: Element, excluded = true) {
    const node = getElementAsNode<T>(element);
    if (node) {
        return node.tagName === 'BR' || excluded && node.excluded && node.blockStatic;
    }
    return false;
}

export function getBetweenElements(elementStart: Element | null, elementEnd: Element, whiteSpace = false, asNode = false) {
    if (!elementStart || elementStart.parentElement === elementEnd.parentElement) {
        const parent = elementEnd.parentElement;
        if (parent) {
            const elements = Array.from(parent.childNodes) as Element[];
            const indexStart = elementStart ? elements.findIndex(element => element === elementStart) : 0;
            const indexEnd = elements.findIndex(element => element === elementEnd);
            if (indexStart !== -1 && indexEnd !== -1 && indexStart !== indexEnd) {
                let result = elements.slice(Math.min(indexStart, indexEnd) + 1, Math.max(indexStart, indexEnd));
                if (whiteSpace) {
                    result = result.filter(element => element.nodeName !== '#comment');
                }
                else {
                    result = result.filter(element => {
                        if (element.nodeName.charAt(0) === '#') {
                            return isPlainText(element);
                        }
                        return true;
                    });
                }
                if (asNode) {
                    result = result.filter(element => getElementAsNode<T>(element));
                }
                return result;
            }
        }
    }
    return [];
}

export function getPreviousElementSibling(element: Element) {
    element = <Element> element.previousSibling;
    while (element) {
        const node = getElementAsNode<T>(element);
        if (node && (!node.excluded || node.lineBreak)) {
            return node.element;
        }
        element = <Element> element.previousSibling;
    }
    return null;
}

export function getNextElementSibling(element: Element) {
    element = <Element> element.nextSibling;
    while (element) {
        const node = getElementAsNode<T>(element);
        if (node && (!node.excluded || node.lineBreak)) {
            return node.element;
        }
        element = <Element> element.nextSibling;
    }
    return null;
}

export function hasComputedStyle(element: Element): element is HTMLElement {
    return element instanceof HTMLElement || element instanceof SVGSVGElement;
}

export function hasVisibleDimensions(element: Element) {
    const bounds = element.getBoundingClientRect();
    if (bounds.width !== 0 && bounds.height !== 0) {
        return !(bounds.left < 0 && bounds.top < 0 && Math.abs(bounds.left) >= bounds.width && Math.abs(bounds.top) >= bounds.height);
    }
    return false;
}

export function isElementIncluded(element: Element) {
    if (element.parentElement instanceof SVGSVGElement) {
        return false;
    }
    else if (hasComputedStyle(element)) {
        if (hasValue(element.dataset.import)) {
            return true;
        }
        else if (hasVisibleDimensions(element)) {
            return true;
        }
        else {
            let current = element.parentElement;
            let valid = true;
            while (current) {
                if (getStyle(current).display === 'none') {
                    valid = false;
                    break;
                }
                current = current.parentElement;
            }
            if (valid && element.children.length) {
                return Array.from(element.children).some((item: Element) => {
                    const style = getStyle(item);
                    const float = style.cssFloat;
                    const position = style.position;
                    return position === 'absolute' || position === 'fixed' || float === 'left' || float === 'right';
                });
            }
        }
        return false;
    }
    else {
        return isPlainText(element);
    }
}

export function setElementCache(element: Element, attr: string, data: any) {
    element[`__${attr}`] = data;
}

export function getElementCache(element: Element, attr: string) {
    return element[`__${attr}`] || undefined;
}

export function deleteElementCache(element: Element, ...attrs: string[]) {
    for (const attr of attrs) {
        delete element[`__${attr}`];
    }
}

export function getElementAsNode<T>(element: Element): T | null {
    return getElementCache(element, 'node') || null;
}