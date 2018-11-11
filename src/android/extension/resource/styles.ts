import View from '../../view';

import $Resource = androme.lib.base.Resource;
import $util = androme.lib.util;

export default class ResourceStyles<T extends View> extends androme.lib.base.Extension<T> {
    public beforeFinalize() {
        const styles: ObjectMap<string[]> = {};
        for (const node of this.application.cacheSession.visible) {
            const children = node.renderChildren.filter(item => item.visible && item.auto);
            if (children.length > 1) {
                const map = new Map<string, number>();
                let style = '';
                let valid = true;
                for (let i = 0; i < children.length; i++) {
                    let found = false;
                    children[i].combine('_', 'android').some(value => {
                        if (value.startsWith('style=')) {
                            if (i === 0) {
                                style = value;
                            }
                            else {
                                if (style === '' || value !== style) {
                                    valid = false;
                                    return true;
                                }
                            }
                            found = true;
                        }
                        else {
                            if (!map.has(value)) {
                                map.set(value, 0);
                            }
                            map.set(value, (map.get(value) as number) + 1);
                        }
                        return false;
                    });
                    if (!valid || (style !== '' && !found)) {
                        valid = false;
                        break;
                    }
                }
                if (valid) {
                    for (const [attr, value] of map.entries()) {
                        if (value !== children.length) {
                            map.delete(attr);
                        }
                    }
                    if (map.size > 1) {
                        if (style !== '') {
                            style = $util.trimString(style.substring(style.indexOf('/') + 1), '"');
                        }
                        const common: string[] = [];
                        for (const attr of map.keys()) {
                            const match = attr.match(/(\w+):(\w+)="(.*?)"/);
                            if (match) {
                                children.forEach(item => item.delete(match[1], match[2]));
                                common.push(match[0]);
                            }
                        }
                        common.sort();
                        let name = '';
                        for (const index in styles) {
                            if (styles[index].join(';') === common.join(';')) {
                                name = index;
                                break;
                            }
                        }
                        if (!(name !== '' && style !== '' && name.startsWith(`${style}.`))) {
                            name = $util.convertCamelCase((style !== '' ? `${style}.` : '') + $util.capitalize(node.nodeId), '_');
                            styles[name] = common;
                        }
                        children.forEach(item => item.attr('_', 'style', `@style/${name}`));
                    }
                }
            }
        }
        for (const name in styles) {
            $Resource.STORED.styles.set(name, {
                name,
                attrs: styles[name].join(';'),
                ids: []
            });
        }
    }
}