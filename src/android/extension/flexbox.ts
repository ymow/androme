import { AXIS_ANDROID } from '../lib/constant';

import Controller from '../controller';
import View from '../view';

import $NodeList = androme.lib.base.NodeList;

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
    public processChild(node: T, parent: T): ExtensionResult<T> {
        let output = '';
        if (node.hasAlign($enum.NODE_ALIGNMENT.SEGMENTED)) {
            output = this.application.writeConstraintLayout(node, parent);
        }
        return { output, complete: output !== '' };
    }

    public postBaseLayout(node: T) {
        const controller = <android.lib.base.Controller<T>> this.application.viewController;
        const flex = node.flexbox;
        const chainHorizontal: T[][] = [];
        const chainVertical: T[][] = [];
        const flexWrap = flex.wrap === 'wrap' || flex.wrap === 'wrap-reverse';
        let requireMargin = false;
        if (flexWrap) {
            node.children.forEach((item: T) => {
                if (item.hasAlign($enum.NODE_ALIGNMENT.SEGMENTED)) {
                    item.android('layout_width', 'match_parent');
                    chainHorizontal.push(item.renderChildren as T[]);
                }
            });
            requireMargin = flex.direction.startsWith('column');
        }
        else {
            const pageflow = node.children.filter(item => item.pageflow) as T[];
            switch (flex.direction) {
                case 'row':
                    chainHorizontal[0] = pageflow;
                    break;
                case 'row-reverse':
                    chainHorizontal[0] = pageflow.reverse();
                    break;
                case 'column':
                    chainVertical[0] = pageflow;
                    break;
                case 'column-reverse':
                    chainVertical[0] = pageflow.reverse();
                    break;
            }
        }
        [chainHorizontal, chainVertical].forEach((partitions, index) => {
            const horizontal = index === 0;
            const inverse = horizontal ? 1 : 0;
            partitions.forEach(chainable => {
                const HV = CHAIN_MAP.horizontalVertical[index];
                const HW = CHAIN_MAP.widthHeight[inverse];
                const [LT, TL] = [CHAIN_MAP.leftTop[index], CHAIN_MAP.leftTop[inverse]];
                const [RB, BR] = [CHAIN_MAP.rightBottom[index], CHAIN_MAP.rightBottom[inverse]];
                const orientation = HV.toLowerCase();
                const first = chainable[0];
                const last = chainable[chainable.length - 1];
                let baseline: T | undefined;
                first.anchor(LT, 'parent');
                last.anchor(RB, 'parent');
                const maxSize = Math.max.apply(null, chainable.map(item => item.flexElement ? 0 : item.bounds[HW.toLowerCase()]));
                for (let i = 0; i < chainable.length; i++) {
                    const chain = chainable[i];
                    const previous = chainable[i - 1];
                    const next = chainable[i + 1];
                    if (next) {
                        chain.anchor(CHAIN_MAP.rightLeftBottomTop[index], next.stringId);
                    }
                    if (previous) {
                        chain.anchor(CHAIN_MAP.leftRightTopBottom[index], previous.stringId);
                        if (horizontal && requireMargin) {
                            chain.constraint.marginHorizontal = previous.stringId;
                        }
                    }
                    switch (chain.flexbox.alignSelf) {
                        case 'flex-start':
                            chain.anchor(TL, 'parent');
                            break;
                        case 'flex-end':
                            chain.anchor(BR, 'parent');
                            break;
                        case 'baseline':
                            if (horizontal) {
                                if (baseline === undefined) {
                                    baseline = $NodeList.textBaseline(chainable)[0];
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
                            chain.anchor(TL, 'parent');
                            if (!chain[`has${HW}`]) {
                                if (chain.initial.bounds[HW.toLowerCase()] < maxSize) {
                                    chain.android(`layout_${HW.toLowerCase()}`, '0px');
                                    chain.anchor(BR, 'parent');
                                }
                            }
                            break;
                    }
                    Controller.dimensionFlex(chain, horizontal);
                    if (node.has('justifyContent') && chainable.every(item => item.flexbox.grow < 1)) {
                        const justifyStyle = `layout_constraint${HV}_chainStyle`;
                        switch (flex.justifyContent) {
                            case 'space-between':
                                first.app(justifyStyle, 'spread_inside');
                                break;
                            case 'space-evenly':
                                first.app(justifyStyle, 'spread');
                                chainable.forEach(item => item.app(`layout_constraint${HV}_weight`, (item.flexbox.grow || 1).toString()));
                                break;
                            case 'space-around':
                                first.app(justifyStyle, 'spread_inside');
                                first.constraint[orientation] = false;
                                last.constraint[orientation] = false;
                                controller.addGuideline(first, orientation, true, false);
                                controller.addGuideline(last, orientation, true, true);
                                break;
                            default:
                                let justifyContent = flex.justifyContent;
                                if (flex.direction.indexOf('reverse') !== -1) {
                                    switch (flex.justifyContent) {
                                        case 'flex-start':
                                            justifyContent = 'flex-end';
                                            break;
                                        case 'flex-end':
                                            justifyContent = 'flex-start';
                                            break;
                                    }
                                }
                                let bias: string;
                                switch (justifyContent) {
                                    case 'flex-start':
                                        bias = '0';
                                        break;
                                    case 'flex-end':
                                        bias = '1';
                                        break;
                                    default:
                                        bias = '0.5';
                                        break;
                                }
                                first.app(justifyStyle, 'packed');
                                first.app(`layout_constraint${HV}_bias`, bias);
                                break;
                        }
                    }
                    chain.positioned = true;
                }
                const chainStyle = `layout_constraint${HV}_chainStyle`;
                const leftParent = $util.withinFraction(node.box.left, first.linear.left);
                const rightParent = $util.withinFraction(last.linear.right, node.box.right);
                const topParent = $util.withinFraction(node.box.top, first.linear.top);
                const bottomParent = $util.withinFraction(last.linear.bottom, node.box.bottom);
                if (chainable.length > 1 && (orientation === AXIS_ANDROID.HORIZONTAL && leftParent && rightParent) || (orientation === AXIS_ANDROID.VERTICAL && topParent && bottomParent)) {
                    first.app(chainStyle, 'spread_inside', false);
                }
                else if (orientation === AXIS_ANDROID.HORIZONTAL && (leftParent || rightParent)) {
                    if (chainable.length > 1 || rightParent) {
                        first.app(chainStyle, 'packed', false);
                        first.app('layout_constraintHorizontal_bias', leftParent ? '0' : '1', false);
                    }
                }
                else if (orientation === AXIS_ANDROID.VERTICAL && (topParent || bottomParent)) {
                    if (chainable.length > 1 || bottomParent) {
                        first.app(chainStyle, 'packed', false);
                        first.app('layout_constraintVertical_bias', topParent ? '0' : '1', false);
                    }
                }
                else if (chainable.length > 1) {
                    first.app(chainStyle, 'spread', false);
                }
            });
        });
    }
}