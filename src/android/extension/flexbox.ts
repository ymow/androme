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
        const flex = node.flexbox;
        const flexWrap = flex.wrap === 'wrap' || flex.wrap === 'wrap-reverse';
        const chainHorizontal: T[][] = [];
        const chainVertical: T[][] = [];
        const basicHorizontal: T[] = [];
        const basicVertical: T[] = [];
        if (flexWrap) {
            const rowDirection = flex.direction.indexOf('row') !== -1;
            let previousSegment: T[] | undefined;
            const segments = node.children.filter(item => item.hasAlign($enum.NODE_ALIGNMENT.SEGMENTED)) as T[];
            for (let i = 0; i < segments.length; i++) {
                const item = segments[i];
                const pageflow = item.renderChildren.filter(child => child.pageflow) as T[];
                if (rowDirection) {
                    item.android('layout_width', 'match_parent');
                    chainHorizontal.push(pageflow);
                    basicVertical.push(item);
                }
                else {
                    item.android('layout_height', 'match_parent');
                    chainVertical.push(pageflow);
                    if (previousSegment) {
                        let largest = previousSegment[0];
                        for (let j = 1; j < previousSegment.length; j++) {
                            if (previousSegment[j].linear.right > largest.linear.right) {
                                largest = previousSegment[j];
                            }
                        }
                        item.constraint.horizontal = true;
                        item.constraint.marginHorizontal = largest.stringId;
                    }
                    basicHorizontal.push(item);
                    previousSegment = pageflow;
                }
            }
            if (node.is($enum.NODE_STANDARD.LINEAR)) {
                if (!rowDirection && flex.wrap === 'wrap-reverse') {
                    node.mergeGravity('gravity', 'right');
                }
            }
            else {
                if (basicVertical.length > 0) {
                    chainVertical.push(basicVertical);
                }
                if (basicHorizontal.length > 0) {
                    chainHorizontal.push(basicHorizontal);
                }
            }
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
            partitions.forEach(segment => {
                const HV = CHAIN_MAP.horizontalVertical[index];
                const HW = CHAIN_MAP.widthHeight[inverse];
                const [LT, TL] = [CHAIN_MAP.leftTop[index], CHAIN_MAP.leftTop[inverse]];
                const [RB, BR] = [CHAIN_MAP.rightBottom[index], CHAIN_MAP.rightBottom[inverse]];
                const orientation = HV.toLowerCase();
                const first = segment[0];
                const last = segment[segment.length - 1];
                let baseline: T | undefined;
                first.anchor(LT, 'parent');
                last.anchor(RB, 'parent');
                const chainStyle = `layout_constraint${HV}_chainStyle`;
                const maxSize = Math.max.apply(null, segment.map(item => item.flexElement ? 0 : item.bounds[HW.toLowerCase()]));
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
                            case 'flex-start':
                                chain.anchor(TL, 'parent');
                                break;
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
                        if (node.has('justifyContent') && segment.every(item => item.flexbox.grow < 1)) {
                            switch (flex.justifyContent) {
                                case 'space-between':
                                    first.app(chainStyle, 'spread_inside');
                                    break;
                                case 'space-evenly':
                                    first.app(chainStyle, 'spread');
                                    segment.forEach(item => item.app(`layout_constraint${HV}_weight`, (item.flexbox.grow || 1).toString()));
                                    break;
                                case 'space-around':
                                    first.app(chainStyle, 'spread_inside');
                                    first.constraint[orientation] = false;
                                    last.constraint[orientation] = false;
                                    const controller = <android.lib.base.Controller<T>> this.application.viewController;
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
                                    first.app(chainStyle, 'packed');
                                    first.app(`layout_constraint${HV}_bias`, bias);
                                    break;
                            }
                        }
                    }
                    chain.positioned = true;
                }
                const rightParent = $util.withinFraction(last.linear.right, node.box.right);
                const leftParent = $util.withinFraction(node.box.left, first.linear.left);
                const topParent = $util.withinFraction(node.box.top, first.linear.top);
                const bottomParent = $util.withinFraction(last.linear.bottom, node.box.bottom);
                if ((horizontal && leftParent && rightParent) || (!horizontal && topParent && bottomParent)) {
                    if (segment.length > 1) {
                        first.app(chainStyle, 'spread_inside', false);
                    }
                }
                else if (horizontal && (leftParent || rightParent)) {
                    first.app(chainStyle, 'packed', false);
                    first.app('layout_constraintHorizontal_bias', rightParent ? '1' : '0', false);
                }
                else if (!horizontal && (topParent || bottomParent)) {
                    first.app(chainStyle, 'packed', false);
                    first.app('layout_constraintVertical_bias', bottomParent ? '1' : '0', false);
                }
                else if (segment.length > 1) {
                    first.app(chainStyle, 'spread', false);
                }
            });
        });
    }
}