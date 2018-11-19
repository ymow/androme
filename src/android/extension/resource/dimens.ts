import Resource from '../../resource';
import View from '../../view';

import $util = androme.lib.util;

function getResourceKey(dimens: Map<string, string>, key: string, value: string) {
    return dimens.has(key) && dimens.get(key) !== value ? Resource.generateId('dimen', key, 1) : key;
}

function getAttributeName(value: string) {
    return $util.convertUnderscore(value).replace('layout_', '');
}

function getDisplayName(value: string) {
    return $util.lastIndexOf(value, '.');
}

export default class ResourceDimens<T extends View> extends androme.lib.base.Extension<T> {
    public readonly eventOnly = true;

    public afterProcedure() {
        const groups: ObjectMapNested<T[]> = {};
        for (const node of this.application.session.cache.visible) {
            const nodeName = node.nodeName.toLowerCase();
            if (groups[nodeName] === undefined) {
                groups[nodeName] = {};
            }
            ['android', 'app'].forEach(namespace => {
                const obj = node.unsafe(namespace);
                for (const attr in obj) {
                    const value = obj[attr].trim();
                    if (/^-?[\d.]+(px|dp|sp)$/.test(value)) {
                        const dimen = `${namespace},${attr},${value}`;
                        if (groups[nodeName][dimen] === undefined) {
                            groups[nodeName][dimen] = [];
                        }
                        groups[nodeName][dimen].push(node);
                    }
                }
            });
        }
        const dimens = Resource.STORED.dimens;
        for (const nodeName in groups) {
            const group = groups[nodeName];
            for (const name in group) {
                const [namespace, attr, value] = name.split(',');
                const key = getResourceKey(dimens, `${getDisplayName(nodeName)}_${getAttributeName(attr)}`, value);
                group[name].forEach(node => node[namespace](attr, `@dimen/${key}`));
                dimens.set(key, value);
            }
        }
    }

    public afterFinalize() {
        const dimens = Resource.STORED.dimens;
        const layouts = this.application.layouts;
        for (const value of layouts) {
            let content = value.content;
            const pattern = /[\s\n]+<[^<]*?(\w+):(\w+)="([\d.]+(?:px|dp|sp))"/g;
            let match: RegExpExecArray | null;
            while ((match = pattern.exec(content)) !== null) {
                const nodeName = /^[\s\n]+<([\w\-.]+)[\s\n]/.exec(match[0]);
                if (nodeName) {
                    const key = getResourceKey(dimens, `${getDisplayName(nodeName[1]).toLowerCase()}_${getAttributeName(match[2])}`, match[3]);
                    dimens.set(key, match[3]);
                    content = content.replace(match[0], match[0].replace(match[3], `@dimen/${key}`));
                }
            }
            value.content = content;
        }
    }
}