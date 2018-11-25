import { AXIS_ANDROID } from '../lib/constant';

import Controller from '../controller';
import View from '../view';

import $Layout = androme.lib.base.Layout;
import $NodeList = androme.lib.base.NodeList;

import $const = androme.lib.constant;
import $enum = androme.lib.enumeration;
import $util = androme.lib.util;

const CHAIN_MAP = {
    leftTop: ['left', 'top'],
    rightBottom: ['right', 'bottom'],
    rightLeftBottomTop: ['rightLeft', 'bottomTop'],
    leftRightTopBottom: ['leftRight', 'topBottom'],
    widthHeight: ['Width', 'Height'],
    horizontalVertical: ['Horizontal', 'Vertical']
};

export default class <T extends View> extends androme.lib.extensions.Flexbox<T> {
    public processNode(node: T, parent: T): ExtensionResult<T> {
        super.processNode(node, parent);
        const mainData: FlexboxData<T> = node.data($const.EXT_NAME.FLEXBOX, 'mainData');
        const layout = new $Layout(
            node,
            parent,
            0,
            $enum.NODE_ALIGNMENT.AUTO_LAYOUT,
            node.length
        );
        layout.rowCount = mainData.rowCount;
        layout.columnCount = mainData.columnCount;
        if (node.filter(item => !item.pageflow).length > 0 || (mainData.rowDirection && (mainData.rowCount === 1 || node.hasHeight)) || (mainData.columnDirection && mainData.columnCount === 1)) {
            layout.containerType = $enum.NODE_CONTAINER.CONSTRAINT;
        }
        else {
            layout.setType($enum.NODE_CONTAINER.LINEAR, mainData.columnDirection ? $enum.NODE_ALIGNMENT.HORIZONTAL : $enum.NODE_ALIGNMENT.VERTICAL);
        }
        const output = this.application.renderNode(layout);
        return { output, complete: true };
    }

    public processChild(node: T, parent: T): ExtensionResult<T> {
        let output = '';
        if (node.hasAlign($enum.NODE_ALIGNMENT.SEGMENTED)) {
            const layout = new $Layout(
                node,
                parent,
                $enum.NODE_CONTAINER.CONSTRAINT,
                $enum.NODE_ALIGNMENT.AUTO_LAYOUT,
                node.length,
                node.children as T[]
            );
            output = this.application.renderNode(layout);
        }
        return { output, complete: output !== '' };
    }

    public postBaseLayout(node: T) {
        const mainData: FlexboxData<T> = node.data($const.EXT_NAME.FLEXBOX, 'mainData');
        if (mainData) {
            const chainHorizontal: T[][] = [];
            const chainVertical: T[][] = [];
            const basicHorizontal: T[] = [];
            const basicVertical: T[] = [];
            if (mainData.wrap) {
                let previous: T[] | undefined;
                node.filter(item => item.hasAlign($enum.NODE_ALIGNMENT.SEGMENTED)).forEach((segment: T) => {
                    const pageflow = segment.renderChildren.filter(item => item.pageflow) as T[];
                    if (mainData.rowDirection) {
                        segment.android('layout_width', 'match_parent');
                        if (node.hasHeight) {
                            segment.android('layout_height', '0px');
                            segment.app('layout_constraintVertical_weight', '1');
                        }
                        chainHorizontal.push(pageflow);
                        basicVertical.push(segment);
                    }
                    else {
                        segment.android('layout_height', 'match_parent');
                        chainVertical.push(pageflow);
                        if (previous) {
                            let largest = previous[0];
                            for (let j = 1; j < previous.length; j++) {
                                if (previous[j].linear.right > largest.linear.right) {
                                    largest = previous[j];
                                }
                            }
                            segment.constraint.horizontal = true;
                            segment.constraint.marginHorizontal = largest.stringId;
                        }
                        basicHorizontal.push(segment);
                        previous = pageflow;
                    }
                });
                if (node.is($enum.NODE_CONTAINER.LINEAR)) {
                    if (mainData.columnDirection && mainData.wrapReverse) {
                        node.mergeGravity('gravity', 'right');
                    }
                }
                else {
                    if (basicVertical.length) {
                        chainVertical.push(basicVertical);
                    }
                    if (basicHorizontal.length) {
                        chainHorizontal.push(basicHorizontal);
                    }
                }
            }
            else {
                if (mainData.rowDirection) {
                    if (mainData.directionReverse) {
                        chainHorizontal[0] = mainData.children.reverse();
                    }
                    else {
                        chainHorizontal[0] = mainData.children;
                    }
                }
                else {
                    if (mainData.directionReverse) {
                        chainVertical[0] = mainData.children.reverse();
                    }
                    else {
                        chainVertical[0] = mainData.children;
                    }
                }
            }
            [chainHorizontal, chainVertical].forEach((partition, index) => {
                const horizontal = index === 0;
                const inverse = horizontal ? 1 : 0;
                partition.forEach(segment => {
                    const HW = CHAIN_MAP.widthHeight[inverse];
                    const [LT, TL] = [CHAIN_MAP.leftTop[index], CHAIN_MAP.leftTop[inverse]];
                    const [RB, BR] = [CHAIN_MAP.rightBottom[index], CHAIN_MAP.rightBottom[inverse]];
                    const maxSize = $util.maxArray(segment.map(item => item.flexElement ? 0 : item.bounds[HW.toLowerCase()]));
                    let baseline: T | undefined;
                    for (let i = 0; i < segment.length; i++) {
                        const chain = segment[i];
                        const previous = segment[i - 1];
                        const next = segment[i + 1];
                        if (next) {
                            chain.anchor(CHAIN_MAP.rightLeftBottomTop[index], next.stringId);
                        }
                        if (previous) {
                            chain.anchor(CHAIN_MAP.leftRightTopBottom[index], previous.stringId);
                        }
                        if (segment !== basicHorizontal && segment !== basicVertical) {
                            switch (chain.flexbox.alignSelf) {
                                case 'start':
                                case 'flex-start':
                                    chain.anchor(TL, 'parent');
                                    break;
                                case 'end':
                                case 'flex-end':
                                    chain.anchor(BR, 'parent');
                                    break;
                                case 'baseline':
                                    if (horizontal) {
                                        if (baseline === undefined) {
                                            baseline = $NodeList.textBaseline(segment)[0];
                                        }
                                        if (baseline) {
                                            if (chain !== baseline) {
                                                chain.anchor('baseline', baseline.stringId);
                                                chain.constraint.vertical = true;
                                            }
                                            else {
                                                chain.anchor('top', 'parent');
                                            }
                                        }
                                    }
                                    break;
                                case 'center':
                                    chain.anchorParent(horizontal ? AXIS_ANDROID.VERTICAL : AXIS_ANDROID.HORIZONTAL);
                                    break;
                                default:
                                    chain.anchor(mainData.wrapReverse ? BR : TL, 'parent');
                                    if (!chain[`has${HW}`] && chain.initial.bounds[HW.toLowerCase()] < maxSize) {
                                        chain.android(`layout_${HW.toLowerCase()}`, '0px');
                                        chain.anchor(mainData.wrapReverse ? TL : BR, 'parent');
                                    }
                                    break;
                            }
                            Controller.dimensionFlex(chain, horizontal);
                        }
                        chain.positioned = true;
                    }
                    const HV = CHAIN_MAP.horizontalVertical[index];
                    const chainStart = segment[0];
                    const chainEnd = segment[segment.length - 1];
                    const chainStyle = `layout_constraint${HV}_chainStyle`;
                    chainStart.anchor(LT, 'parent');
                    chainEnd.anchor(RB, 'parent');
                    if (segment.every(item => item.flexbox.grow < 1)) {
                        switch (mainData.justifyContent) {
                            case 'left':
                                if (!horizontal) {
                                    break;
                                }
                            case 'start':
                            case 'flex-start':
                                chainStart.app(chainStyle, 'packed');
                                chainStart.app(`layout_constraint${HV}_bias`, '0');
                                break;
                            case 'center':
                                chainStart.app(chainStyle, 'packed');
                                chainStart.app(`layout_constraint${HV}_bias`, '0.5');
                                break;
                            case 'right':
                                if (!horizontal) {
                                    break;
                                }
                            case 'end':
                            case 'flex-end':
                                chainStart.app(chainStyle, 'packed');
                                chainStart.app(`layout_constraint${HV}_bias`, '1');
                                break;
                            case 'space-between':
                                chainStart.app(chainStyle, 'spread_inside');
                                break;
                            case 'space-evenly':
                                chainStart.app(chainStyle, 'spread');
                                segment.forEach(item => item.app(`layout_constraint${HV}_weight`, (item.flexbox.grow || 1).toString()));
                                break;
                            case 'space-around':
                                const controller = <android.lib.base.Controller<T>> this.application.viewController;
                                const orientation = HV.toLowerCase();
                                chainStart.app(chainStyle, 'spread_inside');
                                chainStart.constraint[orientation] = false;
                                chainEnd.constraint[orientation] = false;
                                controller.addGuideline(chainStart, chainStart.parent as T, orientation, true, false);
                                controller.addGuideline(chainEnd, chainStart.parent as T, orientation, true, true);
                                break;
                        }
                    }
                    const rightParent = $util.withinFraction(chainEnd.linear.right, node.box.right);
                    const leftParent = $util.withinFraction(node.box.left, chainStart.linear.left);
                    const topParent = $util.withinFraction(node.box.top, chainStart.linear.top);
                    const bottomParent = $util.withinFraction(chainEnd.linear.bottom, node.box.bottom);
                    if (segment.length > 1 && (horizontal && leftParent && rightParent) || (!horizontal && topParent && bottomParent)) {
                        chainStart.app(chainStyle, 'spread_inside', false);
                    }
                    else {
                        chainStart.app(chainStyle, 'packed', false);
                        chainStart.app(`layout_constraint${HV}_bias`, mainData.directionReverse ? '1' : '0', false);
                    }
                });
            });
        }
    }
}