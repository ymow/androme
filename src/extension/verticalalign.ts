import { EXT_NAME } from '../lib/constant';
import { BOX_STANDARD, USER_AGENT } from '../lib/enumeration';

import Extension from '../base/extension';
import Node from '../base/node';
import NodeList from '../base/nodelist';

import { isUserAgent } from '../lib/dom';
import { maxArray } from '../lib/util';

function isBlock<T extends Node>(node: T) {
    return node.block && node.length > 1 && node.every(item => item.pageFlow) && NodeList.linearX(node.children);
}

function isInline<T extends Node>(node: T) {
    return node.inlineVertical && node.toInt('verticalAlign') !== 0;
}

export default class VerticalAlign<T extends Node> extends Extension<T> {
    public condition(node: T) {
        return isBlock(node) || isInline(node);
    }

    public processNode(node: T): ExtensionResult<T> {
        if (isBlock(node)) {
            const alignMap = node.map(item => item.inlineVertical ? item.toInt('verticalAlign') : 0);
            const marginTop = maxArray(alignMap);
            const aboveBaseline: T[] = [];
            let offsetTop = 0;
            node.each((item: T, index) => {
                if (item.inlineVertical) {
                    const offset = (item.imageElement ? item.bounds.height : 0) + (alignMap[index] > 0 ? alignMap[index] : 0);
                    if (offset !== 0 && offset >= offsetTop) {
                        if (offset > offsetTop) {
                            aboveBaseline.length = 0;
                        }
                        aboveBaseline.push(item);
                        offsetTop = offset;
                    }
                }
            });
            if (aboveBaseline.length && aboveBaseline.length !== node.length) {
                const idMap: ObjectIndex<number> = {};
                const belowBaseline: T[] = [];
                aboveBaseline.sort(a => a.imageElement ? -1 : 1);
                node.each((item: T, index) => {
                    let value = 0;
                    if (!aboveBaseline.includes(item) && (item.inlineVertical || item.plainText)) {
                        if (marginTop > 0) {
                            let offsetHeight = 0;
                            if (aboveBaseline[0].imageElement) {
                                if (isUserAgent(USER_AGENT.EDGE) && item.plainText) {
                                    offsetHeight = item.bounds.height - offsetTop;
                                }
                                else {
                                    offsetHeight = item.bounds.height;
                                }
                            }
                            value += offsetTop - offsetHeight;
                        }
                        const offset = alignMap[index];
                        if (offset !== 0) {
                            value += offset * -1;
                            if (offset < 0) {
                                belowBaseline.push(item);
                            }
                            item.css('verticalAlign', '0px', true);
                        }
                    }
                    idMap[item.id] = value;
                });
                aboveBaseline.forEach(item => item.css('verticalAlign', '0px', true));
                if (!aboveBaseline[0].imageElement) {
                    node.modifyBox(BOX_STANDARD.MARGIN_TOP, marginTop * -1);
                }
                node.data(EXT_NAME.VERTICAL_ALIGN, 'mainData', <VerticalAlignData<T>> {
                    marginTop,
                    idMap,
                    belowBaseline,
                    aboveBaseline
                });
            }
        }
        else if (isInline(node)) {
            const offset = node.toInt('verticalAlign');
            if (offset !== 0) {
                node.modifyBox(BOX_STANDARD.MARGIN_TOP, offset * -1);
            }
        }
        return { output: '' };
    }

    public postConstraints(node: T) {
        const mainData: VerticalAlignData<T> = node.data(EXT_NAME.VERTICAL_ALIGN, 'mainData');
        if (mainData) {
            const [idMap, aboveBaseline, belowBaseline] = [mainData.idMap, mainData.aboveBaseline, mainData.belowBaseline];
            if (idMap && aboveBaseline && belowBaseline) {
                const baseline = node.find(item => item.baselineActive) as T;
                node.each((item: T) => {
                    const below = belowBaseline.includes(item);
                    if (item === baseline || below || baseline === undefined && item.baseline || item.css('verticalAlign') === '0px') {
                        const value = idMap[item.id];
                        if (value) {
                            item.modifyBox(BOX_STANDARD.MARGIN_TOP, value, below);
                        }
                    }
                });
            }
        }
    }
}