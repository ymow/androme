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
        for (const node of this.application.cacheProcessing) {
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
                                const name = Resource.addString($xml.replaceCharacter(value), '', this.options.useNumberAlias);
                                return name !== '' ? `@string/${name}` : '';
                            })
                            .filter(name => name)
                        );
                    }
                    if (result.length > 0) {
                        const arrayValue = result.join('-');
                        let arrayName = '';
                        for (const [storedName, storedResult] of Resource.STORED.arrays.entries()) {
                            if (arrayValue === storedResult.join('-')) {
                                arrayName = storedName;
                                break;
                            }
                        }
                        if (arrayName === '') {
                            arrayName = `${node.nodeId}_array`;
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
                    const name = Resource.addString(stored.value, stored.name, this.options.useNumberAlias);
                    if (name !== '' && node.toInt('textIndent') + node.bounds.width > 0) {
                        node.android('text', isNaN(parseInt(name)) || parseInt(name).toString() !== name ? `@string/${name}` : name, node.renderExtension.size === 0);
                    }
                }
            }
        }
    }
}