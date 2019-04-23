import View from '../../view';

import $util = androme.lib.util;
import $xml = androme.lib.xml;

type NodeRenderIndex = {
    item: View;
    name: string;
    index: number;
    merge: boolean;
};

export default class ResourceIncludes<T extends View> extends androme.lib.base.Extension<T> {
    public readonly eventOnly = true;

    public afterDepthLevel() {
        const processing = this.application.processing;
        for (const node of processing.cache) {
            const open: NodeRenderIndex[] = [];
            const close: NodeRenderIndex[] = [];
            node.renderEach((item: T, index) => {
                const openTag = $util.hasValue(item.dataset.androidInclude);
                const closeTag = item.dataset.androidIncludeEnd === 'true';
                if (openTag || closeTag) {
                    const merge = item.dataset.androidIncludeMerge === 'true';
                    const data: NodeRenderIndex = {
                        item,
                        name: (item.dataset.androidInclude || '').trim(),
                        index,
                        merge
                    };
                    if (openTag) {
                        open.push(data);
                    }
                    if (closeTag) {
                        close.push(data);
                    }
                }
            });
            if (open.length && close.length) {
                open.length = Math.min(open.length, close.length);
                for (let i = open.length; i < close.length; i++) {
                    close.shift();
                }
                for (let i = open.length - 1; i >= 0; i--) {
                    const openData = open[i];
                    for (let j = 0; j < close.length; j++) {
                        const closeData = close[j];
                        if (closeData.index >= openData.index) {
                            const location = new Map<number, T[]>();
                            let valid = true;
                            for (let k = openData.index; k <= closeData.index; k++) {
                                const item = node.renderChildren[k] as T;
                                const depthMap = processing.depthMap.get(node.id);
                                if (depthMap && depthMap.has(item.renderPositionId)) {
                                    const items = location.get(node.id) || [];
                                    items.push(item);
                                    location.set(node.id, items);
                                }
                                else {
                                    valid = false;
                                }
                            }
                            if (valid) {
                                const content = new Map<string, string>();
                                const group: T[] = [];
                                let k = 0;
                                for (const [id, templates] of processing.depthMap.entries()) {
                                    const parent = location.get(id);
                                    if (parent) {
                                        const deleteIds: string[] = [];
                                        for (const [key, template] of templates.entries()) {
                                            const item = parent.find(sibling => sibling.renderPositionId === key);
                                            if (item) {
                                                if (k === 0) {
                                                    const xml = this.application.controllerHandler.renderNodeStatic('include', item.renderDepth, { layout: `@layout/${openData.name}` });
                                                    templates.set(key, xml);
                                                    k++;
                                                }
                                                else {
                                                    deleteIds.push(key);
                                                }
                                                content.set(key, template);
                                                group.push(item);
                                            }
                                        }
                                        deleteIds.forEach(value => templates.delete(value));
                                    }
                                }
                                if (content.size) {
                                    const controller = this.application.controllerHandler;
                                    const merge = openData.merge || content.size > 1;
                                    const depth = merge ? 1 : 0;
                                    for (const item of group) {
                                        if (item.renderDepth !== depth) {
                                            const key = item.renderPositionId;
                                            const output = content.get(key);
                                            if (output) {
                                                content.set(key, controller.replaceIndent(output, depth, controller.cache.children));
                                            }
                                        }
                                    }
                                    let xml = Array.from(content.values()).join('');
                                    if (merge) {
                                        xml = controller.getEnclosingTag('merge', 0, 0, xml);
                                    }
                                    else if (!openData.item.documentRoot) {
                                        const placeholder = $xml.formatPlaceholder(openData.item.id, '@');
                                        xml = xml.replace(placeholder, `{#0}${placeholder}`);
                                    }
                                    this.application.addIncludeFile(openData.name, xml);
                                }
                            }
                            close.splice(j, 1);
                            break;
                        }
                    }
                }
            }
        }
    }
}