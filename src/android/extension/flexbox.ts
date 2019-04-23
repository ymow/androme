import { AXIS_ANDROID } from '../lib/constant';
import { CONTAINER_NODE } from '../lib/enumeration';

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
            parent,
            node,
            0,
            $enum.NODE_ALIGNMENT.AUTO_LAYOUT,
            node.length
        );
        layout.rowCount = mainData.rowCount;
        layout.columnCount = mainData.columnCount;
        if (node.filter(item => !item.pageFlow).length > 0 ||
            mainData.rowDirection && (mainData.rowCount === 1 || node.hasHeight) ||
            mainData.columnDirection && mainData.columnCount === 1)
        {
            layout.containerType = CONTAINER_NODE.CONSTRAINT;
        }
        else {
            layout.setType(CONTAINER_NODE.LINEAR, mainData.columnDirection ? $enum.NODE_ALIGNMENT.HORIZONTAL : $enum.NODE_ALIGNMENT.VERTICAL);
        }
        const output = this.application.renderNode(layout);
        return { output, complete: true };
    }

    public processChild(node: T, parent: T): ExtensionResult<T> {
        let output = '';
        if (node.hasAlign($enum.NODE_ALIGNMENT.SEGMENTED)) {
            const layout = new $Layout(
                parent,
                node,
                CONTAINER_NODE.CONSTRAINT,
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
                    const pageFlow = segment.renderFilter(item => item.pageFlow) as T[];
                    if (mainData.rowDirection) {
                        segment.android('layout_width', 'match_parent');
                        if (node.hasHeight) {
                            segment.android('layout_height', '0px');
                            segment.app('layout_constraintVertical_weight', '1');
                        }
                        chainHorizontal.push(pageFlow);
                        basicVertical.push(segment);
                    }
                    else {
                        segment.android('layout_height', 'match_parent');
                        chainVertical.push(pageFlow);
                        if (previous) {
                            let largest = previous[0];
                            for (let j = 1; j < previous.length; j++) {
                                if (previous[j].linear.right > largest.linear.right) {
                                    largest = previous[j];
                                }
                            }
                            const offset = segment.linear.left - largest.actualRight();
                            if (offset > 0) {
                                segment.modifyBox($enum.BOX_STANDARD.MARGIN_LEFT, offset);
                            }
                            segment.constraint.horizontal = true;
                        }
                        basicHorizontal.push(segment);
                        previous = pageFlow;
                    }
                });
                if (node.is(CONTAINER_NODE.LINEAR)) {
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
                    if (!node.hasHeight) {
                        node.android('layout_height', 'match_parent');
                    }
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
                    const HWL = HW.toLowerCase();
                    const [LT, TL] = [CHAIN_MAP.leftTop[index], CHAIN_MAP.leftTop[inverse]];
                    const [RB, BR] = [CHAIN_MAP.rightBottom[index], CHAIN_MAP.rightBottom[inverse]];
                    const maxSize = $util.maxArray(segment.map(item => item.flexElement ? 0 : item.bounds[HW.toLowerCase()]));
                    let baseline: T | undefined;
                    for (let i = 0; i < segment.length; i++) {
                        const chain = segment[i];
                        const previous = segment[i - 1];
                        const next = segment[i + 1];
                        if (next) {
                            chain.anchor(CHAIN_MAP.rightLeftBottomTop[index], next.documentId);
                        }
                        if (previous) {
                            chain.anchor(CHAIN_MAP.leftRightTopBottom[index], previous.documentId);
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
                                            baseline = $NodeList.baseline(segment)[0];
                                        }
                                        if (baseline) {
                                            if (chain !== baseline) {
                                                chain.anchor('baseline', baseline.documentId);
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
                                    if (!chain[`has${HW}`] && !chain.has(HWL, $enum.CSS_STANDARD.PERCENT)) {
                                        const initial: InitialData<T> = chain.unsafe('initial');
                                        if (initial.bounds && initial.bounds[HWL] < maxSize) {
                                            chain.android(`layout_${HW.toLowerCase()}`, '0px');
                                            chain.anchor(mainData.wrapReverse ? TL : BR, 'parent');
                                        }
                                    }
                                    break;
                            }
                            Controller.setFlexDimension(chain, horizontal);
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
                                const controller = <android.lib.base.Controller<T>> this.application.controllerHandler;
                                const orientation = HV.toLowerCase();
                                chainStart.app(chainStyle, 'spread_inside');
                                chainStart.constraint[orientation] = false;
                                chainEnd.constraint[orientation] = false;
                                controller.addGuideline(chainStart, chainStart.parent as T, orientation, true, false);
                                controller.addGuideline(chainEnd, chainStart.parent as T, orientation, true, true);
                                break;
                        }
                    }
                    if (segment.length > 1 && (
                            horizontal && $util.withinFraction(node.box.left, chainStart.linear.left) && $util.withinFraction(chainEnd.linear.right, node.box.right) ||
                            !horizontal && $util.withinFraction(node.box.top, chainStart.linear.top) && $util.withinFraction(chainEnd.linear.bottom, node.box.bottom)
                       ))
                    {
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