import { AXIS_ANDROID } from '../../lib/constant';

import View from '../../view';

import $enum = androme.lib.enumeration;
import $util = androme.lib.util;

export default class ConstraintGuideline<T extends View> extends androme.lib.base.Extension<T> {
    public readonly options = {
        circlePosition: false
    };

    public condition(node: T) {
        return this.included(<HTMLElement> node.element) && node.children.length > 0;
    }

    public processNode(node: T, parent: T): ExtensionResult<T> {
        const output = this.application.writeConstraintLayout(node, parent);
        node.alignmentType = $enum.NODE_ALIGNMENT.EXCLUDE;
        return { output };
    }

    public afterConstraints() {
        const controller = (<android.lib.base.Controller<T>> this.application.viewController);
        for (const node of this.subscribers) {
            const alignParent = new Map<T, string[]>();
            node.each((item: T) => {
                const alignment: string[] = [];
                if ($util.withinFraction(item.linear.left, node.box.left)) {
                    alignment.push('left');
                }
                if ($util.withinFraction(item.linear.top, node.box.top)) {
                    alignment.push('top');
                }
                alignParent.set(item, alignment);
            });
            if (this.options.circlePosition) {
                const leftTop = Array.from(alignParent.values()).some(value => value.length === 2);
                let anchorNode: T | undefined;
                for (const [item, alignment] of alignParent.entries()) {
                    if (leftTop) {
                        if (alignment.length === 2) {
                            item.anchor('left', 'parent', AXIS_ANDROID.HORIZONTAL);
                            item.anchor('top', 'parent', AXIS_ANDROID.VERTICAL);
                            anchorNode = item;
                            break;
                        }
                    }
                    else {
                        if (alignment.length === 1) {
                            if (alignment.includes('left')) {
                                item.anchor('left', 'parent', AXIS_ANDROID.HORIZONTAL);
                                controller.addGuideline(item, AXIS_ANDROID.VERTICAL);
                                anchorNode = item;
                            }
                            else {
                                item.anchor('top', 'parent', AXIS_ANDROID.VERTICAL);
                                controller.addGuideline(item, AXIS_ANDROID.HORIZONTAL);
                                anchorNode = item;
                            }
                            break;
                        }
                    }
                }
                if (anchorNode === undefined) {
                    anchorNode = node.item(0) as T;
                    controller.addGuideline(anchorNode);
                }
                node.each((item: T) => {
                    if (anchorNode && item !== anchorNode) {
                        const center1 = item.center;
                        const center2 = anchorNode.center;
                        const x = Math.abs(center1.x - center2.x);
                        const y = Math.abs(center1.y - center2.y);
                        const radius = Math.round(Math.sqrt(Math.pow(x, 2) + Math.pow(y, 2)));
                        let degrees = Math.round(Math.atan(Math.min(x, y) / Math.max(x, y)) * (180 / Math.PI));
                        if (center1.y > center2.y) {
                            if (center1.x > center2.x) {
                                if (x > y) {
                                    degrees += 90;
                                }
                                else {
                                    degrees = 180 - degrees;
                                }
                            }
                            else {
                                if (x > y) {
                                    degrees = 270 - degrees;
                                }
                                else {
                                    degrees += 180;
                                }
                            }
                        }
                        else if (center1.y < center2.y) {
                            if (center2.x > center1.x) {
                                if (x > y) {
                                    degrees += 270;
                                }
                                else {
                                    degrees = 360 - degrees;
                                }
                            }
                            else {
                                if (x > y) {
                                    degrees = 90 - degrees;
                                }
                            }
                        }
                        else {
                            degrees = center1.x > center2.x ? 90 : 270;
                        }
                        item.app('layout_constraintCircle', anchorNode.stringId);
                        item.app('layout_constraintCircleRadius', $util.formatPX(radius));
                        item.app('layout_constraintCircleAngle', degrees.toString());
                    }
                });
            }
            else {
                for (const [item, alignment] of alignParent.entries()) {
                    if (alignment.includes('left')) {
                        item.anchor('left', 'parent', AXIS_ANDROID.HORIZONTAL);
                    }
                    if (alignment.includes('top')) {
                        item.anchor('top', 'parent', AXIS_ANDROID.VERTICAL);
                    }
                    if (alignment.length < 2) {
                        controller.addGuideline(item);
                    }
                }
            }
        }
    }
}