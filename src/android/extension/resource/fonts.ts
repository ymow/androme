import { ResourceStyleData, SettingsAndroid } from '../../types/module';

import { BUILD_ANDROID } from '../../lib/enumeration';

import View from '../../view';
import ResourceHandler from '../../resourcehandler';

import { replaceUnit } from '../../lib/util';

import $Resource = androme.lib.base.Resource;

import $enum = androme.lib.enumeration;
import $util = androme.lib.util;
import $dom = androme.lib.dom;

type StyleList = ObjectMap<number[]>;
type SharedAttributes = ObjectMapNested<number[]>;
type AttributeMap = ObjectMap<number[]>;
type TagNameMap = ObjectMap<ResourceStyleData[]>;
type NodeStyleMap = ObjectMapNested<string[]>;

const FONT_ANDROID = {
    'sans-serif': BUILD_ANDROID.ICE_CREAM_SANDWICH,
    'sans-serif-thin': BUILD_ANDROID.JELLYBEAN,
    'sans-serif-light': BUILD_ANDROID.JELLYBEAN,
    'sans-serif-condensed': BUILD_ANDROID.JELLYBEAN,
    'sans-serif-condensed-light': BUILD_ANDROID.JELLYBEAN,
    'sans-serif-medium': BUILD_ANDROID.LOLLIPOP,
    'sans-serif-black': BUILD_ANDROID.LOLLIPOP,
    'sans-serif-smallcaps': BUILD_ANDROID.LOLLIPOP,
    'serif-monospace' : BUILD_ANDROID.LOLLIPOP,
    'serif': BUILD_ANDROID.LOLLIPOP,
    'casual' : BUILD_ANDROID.LOLLIPOP,
    'cursive': BUILD_ANDROID.LOLLIPOP,
    'monospace': BUILD_ANDROID.LOLLIPOP,
    'sans-serif-condensed-medium': BUILD_ANDROID.OREO
};

const FONTALIAS_ANDROID = {
    'arial': 'sans-serif',
    'helvetica': 'sans-serif',
    'tahoma': 'sans-serif',
    'verdana': 'sans-serif',
    'times': 'serif',
    'times new roman': 'serif',
    'palatino': 'serif',
    'georgia': 'serif',
    'baskerville': 'serif',
    'goudy': 'serif',
    'fantasy': 'serif',
    'itc stone serif': 'serif',
    'sans-serif-monospace': 'monospace',
    'monaco': 'monospace',
    'courier': 'serif-monospace',
    'courier new': 'serif-monospace'
};

const FONTREPLACE_ANDROID = {
    'ms shell dlg \\32': 'sans-serif',
    'system-ui': 'sans-serif',
    '-apple-system': 'sans-serif'
};

const FONTWEIGHT_ANDROID = {
    '100': 'thin',
    '200': 'extra_light',
    '300': 'light',
    '400': 'normal',
    '500': 'medium',
    '600': 'semi_bold',
    '700': 'bold',
    '800': 'extra_bold',
    '900': 'black'
};

const FONT_STYLE = {
    'fontFamily': 'android:fontFamily="{0}"',
    'fontStyle': 'android:textStyle="{0}"',
    'fontWeight': 'android:fontWeight="{0}"',
    'fontSize': 'android:textSize="{0}"',
    'color': 'android:textColor="@color/{0}"',
    'backgroundColor': 'android:background="@color/{0}"'
};

function deleteStyleAttribute(sorted: AttributeMap[], attrs: string, ids: number[]) {
    attrs.split(';').forEach(value => {
        for (let i = 0; i < sorted.length; i++) {
            if (sorted[i]) {
                let index = -1;
                let key = '';
                for (const j in sorted[i]) {
                    if (j === value) {
                        index = i;
                        key = j;
                        i = sorted.length;
                        break;
                    }
                }
                if (index !== -1) {
                    sorted[index][key] = sorted[index][key].filter(id => !ids.includes(id));
                    if (sorted[index][key].length === 0) {
                        delete sorted[index][key];
                    }
                    break;
                }
            }
        }
    });
}

export default class ResourceFonts<T extends View> extends androme.lib.base.Extension<T> {
    public readonly options = {
        useFontAlias: true
    };
    public readonly eventOnly = true;

    public beforeRenderDocument() {
        if ($dom.isUserAgent($enum.USER_AGENT.EDGE)) {
            FONTREPLACE_ANDROID['consolas'] = 'monospace';
        }
    }

    public afterRenderDocument() {
        const nodeName: ObjectMap<T[]> = {};
        const tagStyle: ObjectMap<StyleList[]> = {};
        for (const node of this.application.cacheSession) {
            if (node.visible && node.data($Resource.KEY_NAME, 'fontStyle') && !node.hasBit('excludeResource', $enum.NODE_RESOURCE.FONT_STYLE)) {
                if (nodeName[node.nodeName] === undefined) {
                    nodeName[node.nodeName] = [];
                }
                nodeName[node.nodeName].push(node);
            }
        }
        for (const tag in nodeName) {
            const sorted: StyleList[] = [];
            for (let node of nodeName[tag]) {
                const nodeId = node.id;
                const companion = node.companion;
                if (companion && !companion.visible && companion.tagName === 'LABEL') {
                    node = companion as T;
                }
                const stored = Object.assign({}, <FontAttribute> node.data($Resource.KEY_NAME, 'fontStyle'));
                let system = false;
                stored.backgroundColor = ResourceHandler.addColor(stored.backgroundColor);
                if (stored.fontFamily) {
                    let fontFamily = stored.fontFamily.split(',')[0].replace(/"/g, '').toLowerCase().trim();
                    let fontStyle = '';
                    let fontWeight = '';
                    stored.color = ResourceHandler.addColor(stored.color);
                    if (this.options.useFontAlias && FONTREPLACE_ANDROID[fontFamily]) {
                        fontFamily = FONTREPLACE_ANDROID[fontFamily];
                    }
                    if ((FONT_ANDROID[fontFamily] && node.localSettings.targetAPI >= FONT_ANDROID[fontFamily]) || (this.options.useFontAlias && FONTALIAS_ANDROID[fontFamily] && node.localSettings.targetAPI >= FONT_ANDROID[FONTALIAS_ANDROID[fontFamily]])) {
                        system = true;
                        stored.fontFamily = fontFamily;
                        if (stored.fontStyle === 'normal') {
                            delete stored.fontStyle;
                        }
                        if (stored.fontWeight === '400') {
                            delete stored.fontWeight;
                        }
                    }
                    else {
                        fontFamily = $util.convertWord(fontFamily);
                        stored.fontFamily = `@font/${fontFamily + (stored.fontStyle !== 'normal' ? `_${stored.fontStyle}` : '') + (stored.fontWeight !== '400' ? `_${FONTWEIGHT_ANDROID[stored.fontWeight] || stored.fontWeight}` : '')}`;
                        fontStyle = stored.fontStyle;
                        fontWeight = stored.fontWeight;
                        delete stored.fontStyle;
                        delete stored.fontWeight;
                    }
                    if (!system) {
                        const fonts = $Resource.STORED.fonts.get(fontFamily) || {};
                        fonts[`${fontStyle}-${FONTWEIGHT_ANDROID[fontWeight] || fontWeight}`] = true;
                        $Resource.STORED.fonts.set(fontFamily, fonts);
                    }
                }
                const keys = Object.keys(FONT_STYLE);
                for (let i = 0; i < keys.length; i++) {
                    if (sorted[i] === undefined) {
                        sorted[i] = {};
                    }
                    const value: string = stored[keys[i]];
                    if ($util.hasValue(value) && node.supported('android', keys[i])) {
                        const attr = $util.formatString(FONT_STYLE[keys[i]], value);
                        if (sorted[i][attr] === undefined) {
                            sorted[i][attr] = [];
                        }
                        sorted[i][attr].push(nodeId);
                    }
                }
            }
            tagStyle[tag] = sorted;
        }
        const style: SharedAttributes = {};
        const layout: SharedAttributes = {};
        for (const tag in tagStyle) {
            style[tag] = {};
            layout[tag] = {};
            const count = nodeName[tag].length;
            let sorted = tagStyle[tag].filter(item => Object.keys(item).length > 0).sort((a, b) => {
                let maxA = 0;
                let maxB = 0;
                let countA = 0;
                let countB = 0;
                for (const attr in a) {
                    maxA = Math.max(a[attr].length, maxA);
                    countA += a[attr].length;
                }
                for (const attr in b) {
                    if (b[attr]) {
                        maxB = Math.max(b[attr].length, maxB);
                        countB += b[attr].length;
                    }
                }
                if (maxA !== maxB) {
                    return maxA > maxB ? -1 : 1;
                }
                else {
                    return countA >= countB ? -1 : 1;
                }
            });
            do {
                if (sorted.length === 1) {
                    for (const attr in sorted[0]) {
                        const value = sorted[0][attr];
                        if (value.length === 1) {
                            layout[tag][attr] = value;
                        }
                        else if (value.length > 1) {
                            style[tag][attr] = value;
                        }
                    }
                    sorted.length = 0;
                }
                else {
                    const styleKey: AttributeMap = {};
                    const layoutKey: AttributeMap = {};
                    for (let i = 0; i < sorted.length; i++) {
                        if (!sorted[i]) {
                            continue;
                        }
                        const filtered: AttributeMap = {};
                        const combined: ObjectMap<Set<string>> = {};
                        const deleteKeys = new Set<string>();
                        for (const attr1 in sorted[i]) {
                            const ids: number[] = sorted[i][attr1];
                            let revalidate = false;
                            if (!ids || ids.length === 0) {
                                continue;
                            }
                            else if (ids.length === count) {
                                styleKey[attr1] = ids.slice();
                                sorted[i] = {};
                                revalidate = true;
                            }
                            else if (ids.length === 1) {
                                layoutKey[attr1] = ids.slice();
                                sorted[i][attr1] = [];
                                revalidate = true;
                            }
                            if (!revalidate) {
                                const found: AttributeMap = {};
                                let merged = false;
                                for (let j = 0; j < sorted.length; j++) {
                                    if (i !== j && sorted[j]) {
                                        for (const attr in sorted[j]) {
                                            const compare = sorted[j][attr];
                                            if (compare.length > 0) {
                                                for (const nodeId of ids) {
                                                    if (compare.includes(nodeId)) {
                                                        if (found[attr] === undefined) {
                                                            found[attr] = [];
                                                        }
                                                        found[attr].push(nodeId);
                                                    }
                                                }
                                            }
                                        }
                                    }
                                }
                                for (const attr2 in found) {
                                    if (found[attr2].length > 1) {
                                        filtered[[attr1, attr2].sort().join(';')] = found[attr2];
                                        merged = true;
                                    }
                                }
                                if (!merged) {
                                    filtered[attr1] = ids;
                                }
                            }
                        }
                        for (const attr1 in filtered) {
                            for (const attr2 in filtered) {
                                if (attr1 !== attr2 && filtered[attr1].join('') === filtered[attr2].join('')) {
                                    const index = filtered[attr1].join(',');
                                    if (combined[index]) {
                                        combined[index] = new Set([...combined[index], ...attr2.split(';')]);
                                    }
                                    else {
                                        combined[index] = new Set([...attr1.split(';'), ...attr2.split(';')]);
                                    }
                                    deleteKeys.add(attr1).add(attr2);
                                }
                            }
                        }
                        deleteKeys.forEach(value => delete filtered[value]);
                        for (const attrs in filtered) {
                            deleteStyleAttribute(sorted, attrs, filtered[attrs]);
                            style[tag][attrs] = filtered[attrs];
                        }
                        for (const index in combined) {
                            const attrs = Array.from(combined[index]).sort().join(';');
                            const ids = index.split(',').map(value => parseInt(value));
                            deleteStyleAttribute(sorted, attrs, ids);
                            style[tag][attrs] = ids;
                        }
                    }
                    const shared = Object.keys(styleKey);
                    if (shared.length > 0) {
                        if (shared.length > 1 || styleKey[shared[0]].length > 1) {
                            style[tag][shared.join(';')] = styleKey[shared[0]];
                        }
                        else {
                            Object.assign(layoutKey, styleKey);
                        }
                    }
                    for (const attr in layoutKey) {
                        layout[tag][attr] = layoutKey[attr];
                    }
                    for (let i = 0; i < sorted.length; i++) {
                        if (sorted[i] && Object.keys(sorted[i]).length === 0) {
                            delete sorted[i];
                        }
                    }
                    sorted = sorted.filter(item => {
                        if (item) {
                            for (const attr in item) {
                                if (item[attr] && item[attr].length > 0) {
                                    return true;
                                }
                            }
                        }
                        return false;
                    });
                }
            }
            while (sorted.length > 0);
        }
        const settings = <SettingsAndroid> this.application.settings;
        const resource: TagNameMap = {};
        const mapNode: NodeStyleMap = {};
        const parentStyle = new Set<string>();
        for (const tagName in style) {
            const tagData = style[tagName];
            const styleData: ResourceStyleData[] = [];
            for (const attrs in tagData) {
                styleData.push({
                    name: '',
                    attrs,
                    ids: tagData[attrs]
                });
            }
            styleData.sort((a, b) => {
                let [c, d] = [a.ids.length, b.ids.length];
                if (c === d) {
                    [c, d] = [a.attrs.split(';').length, b.attrs.split(';').length];
                }
                return c >= d ? -1 : 1;
            });
            styleData.forEach((item, index) => item.name = $util.capitalize(tagName) + (index > 0 ? `_${index}` : ''));
            resource[tagName] = styleData;
        }
        for (const tagName in resource) {
            for (const group of resource[tagName]) {
                for (const id of group.ids) {
                    if (mapNode[id] === undefined) {
                        mapNode[id] = { styles: [], attrs: [] };
                    }
                    mapNode[id].styles.push(group.name);
                }
            }
            const tagData = <AttributeMap> layout[tagName];
            if (tagData) {
                for (const attr in tagData) {
                    for (const id of tagData[attr]) {
                        if (mapNode[id] === undefined) {
                            mapNode[id] = { styles: [], attrs: [] };
                        }
                        mapNode[id].attrs.push(attr);
                    }
                }
            }
        }
        for (const id in mapNode) {
            const node = this.application.cacheSession.find('id', parseInt(id));
            if (node) {
                const styles = mapNode[id].styles;
                if (styles.length > 0) {
                    parentStyle.add(styles.join('.'));
                    node.attr('_', 'style', `@style/${styles.pop()}`);
                }
                mapNode[id].attrs.sort().forEach(value => node.formatted(replaceUnit(value, settings, true), false));
            }
        }
        for (const name of parentStyle) {
            let parent = '';
            name.split('.').forEach(value => {
                const match = value.match(/^(\w*?)(?:_(\d+))?$/);
                if (match) {
                    const tagData = Object.assign({ name: value, parent }, resource[match[1].toUpperCase()][match[2] === undefined ? 0 : parseInt(match[2])]);
                    $Resource.STORED.styles.set(value, tagData);
                    parent = value;
                }
            });
        }
    }
}