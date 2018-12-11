import { CONTAINER_NODE } from '../../lib/enumeration';

import View from '../../view';

import $Layout = androme.lib.base.Layout;
import $NodeList = androme.lib.base.NodeList;

import $dom = androme.lib.dom;
import $enum = androme.lib.enumeration;
import $util = androme.lib.util;

function getFixedNodes<T extends View>(node: T) {
    return node.filter(item => !item.pageFlow && (item.position === 'fixed' || item.absoluteParent === node));
}

function withinBoxRegion(rect: number[], value: number) {
    return rect.some(coord => coord < value);
}

export default class Fixed<T extends View> extends androme.lib.base.Extension<T> {
    public condition(node: T) {
        const fixed = getFixedNodes(node);
        if (fixed.length > 0) {
            const top = fixed.filter(item => item.has('top')).map(item => item.top);
            const right = fixed.filter(item => item.has('right')).map(item => item.right);
            const bottom = fixed.filter(item => item.has('bottom')).map(item => item.bottom);
            const left = fixed.filter(item => item.has('left')).map(item => item.left);
            return (
                withinBoxRegion(top, node.paddingTop + (node.documentBody ? node.marginTop : 0)) ||
                withinBoxRegion(right, node.paddingRight + (node.documentBody ? node.marginRight : 0)) ||
                withinBoxRegion(bottom, node.paddingBottom + (node.documentBody ? node.marginBottom : 0)) ||
                withinBoxRegion(left, node.paddingLeft + (node.documentBody ? node.marginLeft : 0))
            );
        }
        return false;
    }

    public processNode(node: T, parent: T): ExtensionResult<T> {
        const container = new View(
            this.application.nextId,
            $dom.createElement(node.absoluteParent.baseElement, node.block),
            this.application.controllerHandler.delegateNodeInit
        ) as T;
        container.inherit(node, 'initial', 'base');
        container.exclude({
            procedure: $enum.NODE_PROCEDURE.NONPOSITIONAL,
            resource: $enum.NODE_RESOURCE.BOX_STYLE | $enum.NODE_RESOURCE.ASSET
        });
        const [normal, nested] = $util.partition(getFixedNodes(node), item => item.absoluteParent === node.absoluteParent);
        normal.push(container);
        const children = [
            ...$util.sortAsc(normal, 'zIndex', 'id'),
            ...$util.sortAsc(nested, 'zIndex', 'id')
        ] as T[];
        node.duplicate().forEach((item: T) => {
            if (!children.includes(item)) {
                item.parent = container;
            }
        });
        container.parent = node;
        this.application.processing.cache.append(container);
        children.forEach((item, index) => item.siblingIndex = index);
        node.sort($NodeList.siblingIndex);
        node.resetBox($enum.BOX_STANDARD.PADDING | (node.documentBody ? $enum.BOX_STANDARD.MARGIN : 0), container, true);
        const layout = new $Layout(
            parent,
            node,
            CONTAINER_NODE.CONSTRAINT,
            $enum.NODE_ALIGNMENT.ABSOLUTE,
            children.length,
            children
        );
        const output = this.application.renderLayout(layout);
        return { output };
    }
}