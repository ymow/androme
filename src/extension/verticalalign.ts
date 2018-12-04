import { EXT_NAME } from '../lib/constant';
import { BOX_STANDARD } from '../lib/enumeration';

import Extension from '../base/extension';
import Node from '../base/node';
import NodeList from '../base/nodelist';

import { convertInt, isUnit } from '../lib/util';

export default class VerticalAlign<T extends Node> extends Extension<T> {
    public condition(node: T) {
        return node.block && node.length > 1 && node.some(item => item.inlineVertical && convertInt(item.verticalAlign) !== 0) && NodeList.linearX(node.children);
    }

    public processNode(node: T): ExtensionResult<T> {
        const aboveBaseline: T[] = [];
        let minTop = Number.MAX_VALUE;
        node.each((item: T) => {
            if (item.inlineVertical && item.linear.top <= minTop) {
                if (item.linear.top < minTop) {
                    aboveBaseline.length = 0;
                }
                aboveBaseline.push(item);
                minTop = item.linear.top;
            }
        });
        if (aboveBaseline.length !== node.length) {
            const belowBaseline: T[] = [];
            node.each((item: T) => {
                let reset = false;
                if (aboveBaseline.includes(item)) {
                    reset = true;
                }
                else if ((item.inlineVertical || item.plainText) && isUnit(item.verticalAlign)) {
                    item.modifyBox(BOX_STANDARD.MARGIN_TOP, item.linear.top - aboveBaseline[0].linear.top);
                    belowBaseline.push(item);
                    reset = true;
                }
                if (reset) {
                    item.css('verticalAlign', '0px', true);
                }
            });
            node.data(EXT_NAME.VERTICAL_ALIGN, 'mainData', <VerticalAlignData<T>> {
                belowBaseline,
                aboveBaseline
            });
        }
        return { output: '' };
    }

    public postConstraints(node: T) {
        const mainData: VerticalAlignData<T> = node.data(EXT_NAME.VERTICAL_ALIGN, 'mainData');
        const baseline = node.find(item => item.baselineActive) as T;
        if (mainData && baseline) {
            baseline.modifyBox(BOX_STANDARD.MARGIN_TOP, baseline.linear.top - mainData.aboveBaseline[0].linear.top);
        }
    }
}