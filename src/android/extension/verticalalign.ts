import View from '../view';

import $const = androme.lib.constant;
import $enum = androme.lib.enumeration;

export default class <T extends View> extends androme.lib.extensions.VerticalAlign<T> {
    public postConstraints(node: T) {
        super.postConstraints(node);
        const mainData: VerticalAlignData<T> = node.data($const.EXT_NAME.VERTICAL_ALIGN, 'mainData');
        if (mainData) {
            switch (mainData.containerType) {
                case $enum.NODE_CONTAINER.CONSTRAINT:
                case $enum.NODE_CONTAINER.RELATIVE: {
                    const [idMap, aboveBaseline, belowBaseline] = [mainData.idMap, mainData.aboveBaseline, mainData.belowBaseline];
                    if (idMap && aboveBaseline && belowBaseline) {
                        const baseline = node.find(item => item.baselineActive) as T;
                        if (baseline && !aboveBaseline[0].imageElement) {
                            belowBaseline.forEach(item => item.anchor('top', baseline.stringId));
                        }
                    }
                    break;
                }
            }
        }
    }
}