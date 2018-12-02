import { CONTAINER_NODE } from '../lib/enumeration';

import View from '../view';

import $Layout = androme.lib.base.Layout;

import $const = androme.lib.constant;
import $enum = androme.lib.enumeration;

export default class <T extends View> extends androme.lib.extensions.VerticalAlign<T> {
    public processNode(node: T, parent: T): ExtensionResult<T> {
        const mainData: VerticalAlignData<T> = node.data($const.EXT_NAME.VERTICAL_ALIGN, 'mainData');
        let output = '';
        if (mainData) {
            let containerType = 0;
            if (node.some(item => item.inlineVertical && item.has('verticalAlign', $enum.CSS_STANDARD.UNIT))) {
                if (node.every(item => item.inlineVertical && (item.baseline || item.has('verticalAlign', $enum.CSS_STANDARD.UNIT) && item.toInt('verticalAlign') <= 0))) {
                    containerType = CONTAINER_NODE.CONSTRAINT;
                }
                else {
                    containerType = CONTAINER_NODE.RELATIVE;
                }
            }
            const layout = new $Layout(
                parent,
                node,
                containerType,
                $enum.NODE_ALIGNMENT.HORIZONTAL,
                node.length,
                node.children as T[]
            );
            layout.floated = layout.getFloated(true);
            output = this.application.renderNode(layout);
        }
        return { output };
    }

    public postConstraints(node: T) {
        super.postConstraints(node);
        const mainData: VerticalAlignData<T> = node.data($const.EXT_NAME.VERTICAL_ALIGN, 'mainData');
        if (mainData) {
            const [idMap, aboveBaseline, belowBaseline] = [mainData.idMap, mainData.aboveBaseline, mainData.belowBaseline];
            if (idMap && aboveBaseline && belowBaseline) {
                const baseline = node.find(item => item.baselineActive) as T;
                if (baseline && !aboveBaseline[0].imageElement) {
                    belowBaseline.forEach(item => item.anchor('top', baseline.stringId));
                }
            }
        }
    }
}