import { EXT_ANDROID } from '../../lib/constant';
import View from '../../view';

import $Layout = androme.lib.base.Layout;
import $NodeList = androme.lib.base.NodeList;

import $dom = androme.lib.dom;
import $enum = androme.lib.enumeration;
import $util = androme.lib.util;

interface VerticalAlignData {
    containerType: number;
}

export default class VerticalAlign<T extends View> extends androme.lib.base.Extension<T> {
    public condition(node: T) {
        let containerType = 0;
        if (node.block && node.length > 1 && node.every(item => item.pageflow) && $NodeList.linearX(node.children)) {
            if (node.some(item => item.inlineVertical && item.has('verticalAlign', $enum.CSS_STANDARD.UNIT))) {
                if (node.every(item => item.inlineVertical && (item.baseline || item.has('verticalAlign', $enum.CSS_STANDARD.UNIT) && item.toInt('verticalAlign') <= 0))) {
                    containerType = $enum.NODE_CONTAINER.CONSTRAINT;
                }
                else {
                    containerType = $enum.NODE_CONTAINER.RELATIVE;
                }
            }
        }
        else if (node.inlineVertical && node.toInt('verticalAlign') !== 0) {
            containerType = $enum.NODE_CONTAINER.INLINE;
        }
        if (containerType > 0) {
            node.data(EXT_ANDROID.DELEGATE_VERTICALALIGN, 'mainData', { containerType });
            return true;
        }
        return false;
    }

    public processNode(node: T, parent: T): ExtensionResult<T> {
        const mainData: VerticalAlignData = node.data(EXT_ANDROID.DELEGATE_VERTICALALIGN, 'mainData');
        if (mainData) {
            switch (mainData.containerType) {
                case $enum.NODE_CONTAINER.INLINE: {
                    const offset = node.toInt('verticalAlign');
                    if (offset !== 0) {
                        node.modifyBox($enum.BOX_STANDARD.MARGIN_TOP, offset * -1);
                    }
                    break;
                }
                case $enum.NODE_CONTAINER.CONSTRAINT:
                case $enum.NODE_CONTAINER.RELATIVE: {
                    const alignMap = node.map(item => item.inlineVertical ? item.toInt('verticalAlign') : 0);
                    const marginTop = $util.maxArray(alignMap);
                    let offsetTop = 0;
                    const tallest: T[] = [];
                    node.each((item: T, index) => {
                        if (item.inlineVertical) {
                            const offset = alignMap[index];
                            const offsetHeight = (item.imageElement ? item.bounds.height : 0) + (offset > 0 ? offset : 0);
                            if (offsetHeight >= offsetTop) {
                                if (offsetHeight > offsetTop) {
                                    tallest.length = 0;
                                }
                                tallest.push(item);
                                offsetTop = offsetHeight;
                            }
                        }
                    });
                    if (tallest.length !== node.length) {
                        tallest.sort(a => a.imageElement ? -1 : 1);
                        node.each((item: T, index) => {
                            if ((item.inlineVertical || item.plainText) && !tallest.includes(item)) {
                                const offset = alignMap[index];
                                if (marginTop > 0) {
                                    let offsetHeight = 0;
                                    if (tallest[0].imageElement) {
                                        if ($dom.isUserAgent($enum.USER_AGENT.EDGE) && item.plainText) {
                                            offsetHeight = item.bounds.height - offsetTop;
                                        }
                                        else {
                                            offsetHeight = item.bounds.height;
                                        }
                                    }
                                    item.modifyBox($enum.BOX_STANDARD.MARGIN_TOP, offsetTop - offsetHeight, false);
                                }
                                if (offset !== 0) {
                                    item.modifyBox($enum.BOX_STANDARD.MARGIN_TOP, offset * -1);
                                    item.css('verticalAlign', '0px');
                                }
                            }
                        });
                        tallest.forEach(item => item.css('verticalAlign', '0px'));
                    }
                    const layout = new $Layout(
                        parent,
                        node,
                        mainData.containerType,
                        $enum.NODE_ALIGNMENT.HORIZONTAL,
                        node.length,
                        node.children as T[]
                    );
                    layout.floated = layout.getFloated(true);
                    const output = this.application.renderNode(layout);
                    return { output };
                }
            }
        }
        return { output: '' };
    }
}