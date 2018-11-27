import { REGEX_PATTERN } from './constant';
import { USER_AGENT } from './enumeration';

import { capitalize, convertCamelCase, convertInt, convertPX, formatPercent, formatPX, hasBit, hasValue, includes, isPercent, maxArray, minArray, resolvePath, withinFraction } from './util';

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
    if (isStyleElement(element)) {
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

export function newClientRect(): BoxDimensions {
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

export function convertClientUnit(value: string, dimension: number, dpi: number, fontSize: number, percent = false) {
    if (percent) {
        return isPercent(value) ? convertInt(value) / 100 : (parseFloat(convertPX(value, dpi, fontSize)) / dimension);
    }
    else {
        return isPercent(value) ? Math.round(dimension * (convertInt(value) / 100)) : parseInt(convertPX(value, dpi, fontSize));
    }
}

export function getRangeClientRect(element: Element): [BoxDimensions, boolean] {
    const range = document.createRange();
    range.selectNodeContents(element);
    const domRect = Array.from(range.getClientRects()).filter(item => !(Math.round(item.width) === 0 && withinFraction(item.left, item.right)));
    let bounds: BoxDimensions = newClientRect();
    let multiLine = false;
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
                multiLine = true;
            }
        }
    }
    return [bounds, multiLine];
}

export function assignBounds(bounds: BoxDimensions | DOMRect): BoxDimensions {
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
                    return node.styleMap as any;
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
        if (result === 'inherit' || (exclude && exclude.some(value => result.indexOf(value) !== -1))) {
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
    if (isStyleElement(element) && element.parentElement) {
        const node = getElementAsNode<T>(element);
        const style = getStyle(element);
        return style && style[attr] === getStyle(element.parentElement)[attr] && (!node || !node.styleMap[attr]);
    }
    return false;
}

export function cssAttribute(element: Element, attr: string): string {
    return element.getAttribute(attr) || getStyle(element)[convertCamelCase(attr)] || '';
}

export function getBackgroundPosition(value: string, dimension: BoxDimensions, dpi: number, fontSize: number, leftPerspective = false, percent = false) {
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

export function getFirstChildElement(elements: Element[]) {
    if (elements.length) {
        const parentElement = elements[0].parentElement;
        if (parentElement) {
            for (let i = 0; i < parentElement.childNodes.length; i++) {
                const element = <Element> parentElement.childNodes[i];
                if (elements.includes(element)) {
                    return element;
                }
            }
        }
    }
    return null;
}

export function getLastChildElement(elements: Element[]) {
    if (elements.length) {
        const parentElement = elements[0].parentElement;
        if (parentElement) {
            for (let i = parentElement.childNodes.length - 1; i >= 0; i--) {
                const element = <Element> parentElement.childNodes[i];
                if (elements.includes(element)) {
                    return element;
                }
            }
        }
    }
    return null;
}

export function hasFreeFormText(element: Element, maxDepth = 0, whiteSpace = true) {
    let depth = -1;
    function findFreeForm(elements: any[]): boolean {
        if (depth++ === maxDepth) {
            return false;
        }
        return elements.some((sibling: Element) => {
            if (sibling.nodeName === '#text') {
                if (isPlainText(sibling, whiteSpace) || (cssParent(sibling, 'whiteSpace', 'pre', 'pre-wrap') && sibling.textContent && sibling.textContent !== '')) {
                    return true;
                }
            }
            else if (sibling instanceof HTMLElement && sibling.childNodes.length && findFreeForm(Array.from(sibling.childNodes))) {
                return true;
            }
            return false;
        });
    }
    if (element.nodeName === '#text') {
        maxDepth = 0;
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

export function hasLineBreak(element: Element) {
    if (element) {
        const node = getElementAsNode<T>(element);
        const fromParent = element.nodeName === '#text';
        const whiteSpace = node ? node.css('whiteSpace') : (getStyle(element).whiteSpace || '');
        return (
            (element instanceof HTMLElement && element.children.length && Array.from(element.children).some(item => item.tagName === 'BR')) ||
            (/\n/.test(element.textContent || '') && (
                ['pre', 'pre-wrap'].includes(whiteSpace) ||
                (fromParent && cssParent(element, 'whiteSpace', 'pre', 'pre-wrap'))
            ))
        );
    }
    return false;
}

export function isLineBreak(element: Element, excluded = true) {
    const node = getElementAsNode<T>(element);
    if (node) {
        return node.tagName === 'BR' || (excluded && node.block && (node.excluded || node.textContent.trim() === ''));
    }
    return false;
}

export function getBetweenElements(elementStart: Element | null, elementEnd: Element, cacheNode = false, whiteSpace = false) {
    if (!elementStart || elementStart.parentElement === elementEnd.parentElement) {
        const parentElement = elementEnd.parentElement;
        if (parentElement) {
            const elements = <Element[]> Array.from(parentElement.childNodes);
            const firstIndex = elementStart ? elements.findIndex(element => element === elementStart) : 0;
            const secondIndex = elements.findIndex(element => element === elementEnd);
            if (firstIndex !== -1 && secondIndex !== -1 && firstIndex !== secondIndex) {
                let result = elements.slice(Math.min(firstIndex, secondIndex) + 1, Math.max(firstIndex, secondIndex));
                if (!whiteSpace) {
                    result = result.filter(element => {
                        if (element.nodeName.charAt(0) === '#') {
                            return isPlainText(element);
                        }
                        return true;
                    });
                }
                else {
                    result = result.filter(element => element.nodeName !== '#comment');
                }
                if (cacheNode) {
                    result = result.filter(element => getElementAsNode(element));
                }
                return result;
            }
        }
    }
    return [];
}

export function isStyleElement(element: Element): element is HTMLElement {
    return element instanceof HTMLElement || element instanceof SVGSVGElement;
}

export function isElementVisible(element: Element, hideOffScreen: boolean) {
    if (!getElementCache(element, 'inlineSupport') && !(element.parentElement instanceof SVGSVGElement)) {
        if (isStyleElement(element)) {
            if (typeof element.getBoundingClientRect === 'function') {
                const bounds = element.getBoundingClientRect();
                if (bounds.width !== 0 && bounds.height !== 0) {
                    return !(hideOffScreen && bounds.left < 0 && bounds.top < 0 && Math.abs(bounds.left) >= bounds.width && Math.abs(bounds.top) >= bounds.height);
                }
                else if (hasValue(element.dataset.import) || getStyle(element).clear !== 'none') {
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
                    if (valid) {
                        if (element.children.length) {
                            return Array.from(element.children).some((item: Element) => {
                                const style = getStyle(item);
                                const float = style.cssFloat;
                                const position = style.position;
                                return (position !== 'static' && position !== 'initial') || float === 'left' || float === 'right';
                            });
                        }
                    }
                }
            }
            return false;
        }
        else {
            return isPlainText(element);
        }
    }
    return false;
}

export function getNestedExtension(element: Element, name: string) {
    if (isStyleElement(element)) {
        return Array.from(element.children).find((item: HTMLElement) => includes(item.dataset.import, name)) as HTMLElement || null;
    }
    return null;
}

export function setElementCache(element: Element, attr: string, data: any) {
    if (element) {
        element[`__${attr}`] = data;
    }
}

export function getElementCache(element: Element, attr: string) {
    return element ? element[`__${attr}`] : undefined;
}

export function deleteElementCache(element: Element, ...attrs: string[]) {
    if (element) {
        for (const attr of attrs) {
            delete element[`__${attr}`];
        }
    }
}

export function getElementAsNode<T>(element?: Element | null): T | null {
    return element ? getElementCache(element, 'node') || null : null;
}