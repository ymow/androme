import Resource from '../../resource';
import View from '../../view';

import $dom = androme.lib.dom;
import $enum = androme.lib.enumeration;
import $xml = androme.lib.xml;

export default class ResourceStrings<T extends View> extends androme.lib.base.Extension<T> {
    public readonly options = {
        useNumberAlias: false
    };

    public readonly eventOnly = true;

    public afterResources() {
        for (const node of this.application.processing.cache) {
            if (node.tagName === 'SELECT') {
                const stored: ObjectMap<string[]> = node.data(Resource.KEY_NAME, 'optionArray');
                if (stored && !node.hasBit('excludeResource', $enum.NODE_RESOURCE.OPTION_ARRAY)) {
                    const result: string[] = [];
                    if (stored.numberArray) {
                        if (!this.options.useNumberAlias) {
                            result.push(...stored.numberArray);
                        }
                        else {
                            stored.stringArray = stored.numberArray;
                        }
                    }
                    if (stored.stringArray) {
                        result.push(
                            ...stored.stringArray.map(value => {
                                value = Resource.addString($xml.replaceCharacter(value), '', this.options.useNumberAlias);
                                return value !== '' ? `@string/${value}` : '';
                            })
                            .filter(value => value)
                        );
                    }
                    if (result.length) {
                        const arrayValue = result.join('-');
                        let arrayName = '';
                        for (const [storedName, storedResult] of Resource.STORED.arrays.entries()) {
                            if (arrayValue === storedResult.join('-')) {
                                arrayName = storedName;
                                break;
                            }
                        }
                        if (arrayName === '') {
                            arrayName = `${node.controlId}_array`;
                            Resource.STORED.arrays.set(arrayName, result);
                        }
                        node.android('entries', `@array/${arrayName}`, node.renderExtension.size === 0);
                    }
                }
            }
            else {
                const stored: NameValue = node.data(Resource.KEY_NAME, 'valueString');
                if (stored && !node.hasBit('excludeResource', $enum.NODE_RESOURCE.VALUE_STRING)) {
                    if (node.renderParent.layoutRelative) {
                        if (node.alignParent('left') && !$dom.cssParent(node.element, 'whiteSpace', 'pre', 'pre-wrap')) {
                            const value = node.textContent;
                            let leadingSpace = 0;
                            for (let i = 0; i < value.length; i++) {
                                switch (value.charCodeAt(i)) {
                                    case 160:
                                        leadingSpace++;
                                    case 32:
                                        continue;
                                    default:
                                        break;
                                }
                            }
                            if (leadingSpace === 0) {
                                stored.value = stored.value.replace(/^(\s|&#160;)+/, '');
                            }
                        }
                    }
                    stored.value = $xml.replaceCharacter(stored.value);
                    if (node.htmlElement) {
                        const match = node.css('textDecoration').match(/(underline|line-through)/);
                        if (match) {
                            switch (match[0]) {
                                case 'underline':
                                    stored.value = `<u>${stored.value}</u>`;
                                    break;
                                case 'line-through':
                                    stored.value = `<strike>${stored.value}</strike>`;
                                    break;
                            }
                        }
                        if (node.css('fontVariant') === 'small-caps') {
                            stored.value = stored.value.toUpperCase();
                        }
                    }
                    const actualParent = node.actualParent;
                    if (actualParent) {
                        let textIndent = 0;
                        if (actualParent.blockDimension || node.blockDimension) {
                            textIndent = node.toInt('textIndent') || actualParent.toInt('textIndent');
                        }
                        if (textIndent !== 0 && (node.blockDimension || actualParent.firstChild === node)) {
                            if (textIndent > 0) {
                                stored.value = '&#160;'.repeat(Math.ceil(textIndent / 6)) + stored.value;
                            }
                            else if (node.toInt('textIndent') + node.bounds.width < 0) {
                                stored.value = '';
                            }
                        }
                    }
                    const name = Resource.addString(stored.value, stored.name, this.options.useNumberAlias);
                    if (name !== '') {
                        node.android('text', isNaN(parseInt(name)) || parseInt(name).toString() !== name ? `@string/${name}` : name, node.renderExtension.size === 0);
                    }
                }
            }
        }
    }
}