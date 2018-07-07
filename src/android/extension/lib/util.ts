import { ObjectMap } from '../../../lib/types';
import View from '../../view';
import { convertPX } from '../../../lib/util';
import { WIDGET_NAME } from '../lib/constants';
import parseRTL from '../../localization';

type T = View;

export function findNestedMenu(node: T, requireExt = true) {
    return (<HTMLElement> Array.from(node.element.children).find((element: HTMLElement) => element.tagName === 'NAV' && (!requireExt || (element.dataset.ext != null && element.dataset.ext.indexOf(WIDGET_NAME.MENU) !== -1))));
}

export function overwriteDefault(options: ObjectMap<any>, namespace: string, attr: string, value: string) {
    if (options[namespace] == null) {
        options[namespace] = {};
    }
    if (options[namespace][attr] == null) {
        options[namespace][attr] = value;
    }
}

export function positionIsolated(node: T) {
    const renderParent = node.renderParent;
    const parent = node.parentOriginal;
    node.renderParent = parent;
    const horizontalBias = node.horizontalBias;
    const verticalBias = node.verticalBias;
    const gravity: string[] = [];
    if (horizontalBias < 0.5) {
        gravity.push(parseRTL('left'));
    }
    else if (horizontalBias > 0.5) {
        gravity.push(parseRTL('right'));
    }
    else {
        gravity.push('center_horizontal');
    }
    if (verticalBias < 0.5) {
        gravity.push('top');
        node.app('layout_dodgeInsetEdges', 'top');
    }
    else if (verticalBias > 0.5) {
        gravity.push('bottom');
    }
    else {
        gravity.push('center_vertical');
    }
    node.android('layout_gravity', (gravity.filter(value => value.indexOf('center') !== -1).length === 2 ? 'center' : gravity.join('|')));
    if (horizontalBias > 0 && horizontalBias < 1 && horizontalBias !== 0.5) {
        if (horizontalBias < 0.5) {
            node.css('marginLeft', convertPX(Math.floor(node.bounds.left - parent.box.left)));
        }
        else {
            node.css('marginRight', convertPX(Math.floor(parent.box.right - node.bounds.right)));
        }
    }
    if (verticalBias > 0 && verticalBias < 1 && verticalBias !== 0.5) {
        if (verticalBias < 0.5) {
            node.css('marginTop', convertPX(Math.floor(node.bounds.top - parent.box.top)));
        }
        else {
            node.css('marginBottom', convertPX(Math.floor(parent.box.bottom - node.bounds.bottom)));
        }
    }
    node.renderParent = renderParent;
}