import { AXIS_ANDROID } from '../lib/constant';

import Controller from '../controller';
import View from '../view';

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
        let requireMargin = false;
        if (flex.wrap === 'wrap' || flex.wrap === 'wrap-reverse') {
            node.children.forEach((item: T) => {
                if (item.hasAlign($enum.NODE_ALIGNMENT.SEGMENTED)) {
                    item.android('layout_width', 'match_parent');
                    item.each((child: T) => child.anchorParent(AXIS_ANDROID.VERTICAL), true);
                    chainHorizontal.push(item.renderChildren as T[]);
                }
            });
            requireMargin = flex.direction.startsWith('column');
        }
        else {
            const pageflow = node.children.filter(item => item.pageflow) as T[];
            switch (flex.direction) {
                case 'row':
                    chainHorizontal.push(pageflow);
                    break;
                case 'row-reverse':
                    chainHorizontal.push(pageflow.reverse());
                    break;
                case 'column':
                    chainVertical.push(pageflow);
                    break;
                case 'column-reverse':
                    chainVertical.push(pageflow.reverse());
                    break;
            }
        }
        [chainHorizontal, chainVertical].forEach((partitions, index) => {
            if (partitions.length === 0) {
                return;
            }
            const inverse = index === 0 ? 1 : 0;
            partitions.forEach(chainable => {
                const [HV, VH] = [CHAIN_MAP['horizontalVertical'][index], CHAIN_MAP['horizontalVertical'][inverse]];
                const [LT, TL] = [CHAIN_MAP['leftTop'][index], CHAIN_MAP['leftTop'][inverse]];
                const [RB, BR] = [CHAIN_MAP['rightBottom'][index], CHAIN_MAP['rightBottom'][inverse]];
                const [WH, HW] = [CHAIN_MAP['widthHeight'][index], CHAIN_MAP['widthHeight'][inverse]];
                const orientation = HV.toLowerCase();
                const orientationInverse = VH.toLowerCase();
                const dimension = WH.toLowerCase();
                const first = chainable[0];
                const last = chainable[chainable.length - 1];
                first.anchor(LT, 'parent', orientation);
                last.anchor(RB, 'parent', orientation);
                for (let i = 0; i < chainable.length; i++) {
                    const chain = chainable[i];
                    const previous = chainable[i - 1];
                    const next = chainable[i + 1];
                    if (next) {
                        chain.anchor(CHAIN_MAP['rightLeftBottomTop'][index], next.stringId);
                    }
                    if (previous) {
                        chain.anchor(CHAIN_MAP['leftRightTopBottom'][index], previous.stringId);
                        if (index === 0 && requireMargin) {
                            chain.constraint.marginHorizontal = previous.stringId;
                        }
                    }
                    Controller.setConstraintDimension(chain, dimension);
                    if (!chain[`has${WH}`] && chain.flexbox.grow === 0 && chain.flexbox.shrink <= 1) {
                        chain.android(`layout_${dimension}`, 'wrap_content', false);
                    }
                    else if (chain.flexbox.grow > 0) {
                        chain.android(`layout_${dimension}`, '0px', false);
                        chain.app(`layout_constraint${HV}_weight`, chain.flexbox.grow.toString());
                    }
                    if (chain.flexbox.shrink === 0) {
                        chain.app(`layout_constrained${WH}`, 'true');
                    }
                    switch (chain.flexbox.alignSelf) {
                        case 'flex-start':
                            chain.anchor(TL, 'parent', orientationInverse);
                            break;
                        case 'flex-end':
                            chain.anchor(BR, 'parent', orientationInverse);
                            break;
                        case 'baseline':
                            const valid = chainable.some(adjacent => {
                                if (adjacent && adjacent !== chain && adjacent.nodeType <= $enum.NODE_STANDARD.TEXT) {
                                    chain.anchor('baseline', adjacent.stringId);
                                    return true;
                                }
                                return false;
                            });
                            if (valid) {
                                chain.anchorDelete('top', 'bottom');
                                for (const item of chainable) {
                                    if (item) {
                                        if (item.alignSibling('top') === chain.stringId) {
                                            item.anchorDelete('top');
                                        }
                                        if (item.alignSibling('bottom') === chain.stringId) {
                                            item.anchorDelete('bottom');
                                        }
                                    }
                                }
                                chain.constraint.vertical = true;
                            }
                            break;
                        case 'center':
                        case 'stretch':
                            if (chain.flexbox.alignSelf !== 'center') {
                                chain.android(`layout_${HW.toLowerCase()}`, '0px');
                            }
                            chain.anchorParent(orientationInverse, true);
                            break;
                    }
                    if (chain.flexbox.basis !== 'auto') {
                        const basis = $util.convertInt(chain.flexbox.basis);
                        if (basis > 0) {
                            if ($util.isPercent(chain.flexbox.basis)) {
                                chain.app(`layout_constraint${WH}_percent`, (basis / 100).toFixed(2));
                            }
                            else {
                                chain.app(`layout_constraint${WH}_min`, $util.formatPX(basis));
                                chain.constraint[`min${WH}`] = true;
                            }
                        }
                    }
                    if (node.has('justifyContent') && chainable.every(item => item.flexbox.grow === 0)) {
                        const chainStyle = `layout_constraint${HV}_chainStyle`;
                        switch (flex.justifyContent) {
                            case 'space-between':
                                first.app(chainStyle, 'spread_inside');
                                break;
                            case 'space-evenly':
                                first.app(chainStyle, 'spread');
                                chainable.forEach(item => item && item.app(`layout_constraint${HV}_weight`, (item.flexbox.grow || 1).toString()));
                                break;
                            case 'space-around':
                                first.app(chainStyle, 'spread_inside');
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
                                let bias = '0.5';
                                switch (justifyContent) {
                                    case 'flex-start':
                                        bias = '0';
                                        break;
                                    case 'flex-end':
                                        bias = '1';
                                        break;
                                }
                                first.app(chainStyle, 'packed');
                                first.app(`layout_constraint${HV}_bias`, bias);
                                break;
                        }
                    }
                    chain.positioned = true;
                }
                {
                    const leftParent = $util.withinFraction(node.box.left, first.linear.left);
                    const rightParent = $util.withinFraction(last.linear.right, node.box.right);
                    const topParent = $util.withinFraction(node.box.top, first.linear.top);
                    const bottomParent = $util.withinFraction(last.linear.bottom, node.box.bottom);
                    const chainStyle = `layout_constraint${HV}_chainStyle`;
                    if ((orientation === AXIS_ANDROID.HORIZONTAL && leftParent && rightParent) || (orientation === AXIS_ANDROID.VERTICAL && topParent && bottomParent)) {
                        first.app(chainStyle, 'spread_inside', false);
                    }
                    else if (orientation === AXIS_ANDROID.HORIZONTAL && (leftParent || rightParent)) {
                        first.app(chainStyle, 'packed', false);
                        first.app('layout_constraintHorizontal_bias', leftParent ? '0' : '1', false);
                    }
                    else if (orientation === AXIS_ANDROID.VERTICAL && (topParent || bottomParent)) {
                        first.app(chainStyle, 'packed', false);
                        first.app('layout_constraintVertical_bias', topParent ? '0' : '1', false);
                    }
                    else {
                        first.app(chainStyle, 'spread', false);
                    }
                }
            });
        });
    }
}