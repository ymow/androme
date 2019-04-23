import { CONTAINER_NODE } from '../../lib/enumeration';

import View from '../../view';

import $dom = androme.lib.dom;
import $enum = androme.lib.enumeration;
import $util = androme.lib.util;
import $xml = androme.lib.xml;

const SCROLL_HORIZONTAL = 'HorizontalScrollView';
const SCROLL_VERTICAL = 'android.support.v4.widget.NestedScrollView';

export default class ScrollBar<T extends View> extends androme.lib.base.Extension<T> {
    public condition(node: T) {
        return node.length > 0 && (
            node.overflowX ||
            node.overflowY ||
            this.included(<HTMLElement> node.element) && (node.hasWidth || node.hasHeight)
        );
    }

    public processNode(node: T, parent: T): ExtensionResult<T> {
        const target = $util.hasValue(node.dataset.target) && !$util.hasValue(node.dataset.use);
        const overflow: string[] = [];
        if (node.overflowX && node.overflowY) {
            overflow.push(SCROLL_HORIZONTAL, SCROLL_VERTICAL);
        }
        else if (node.overflowX) {
            overflow.push(SCROLL_HORIZONTAL);
        }
        else if (node.overflowY) {
            overflow.push(SCROLL_VERTICAL);
        }
        else {
            let overflowType = 0;
            if (node.hasWidth) {
                overflowType |= $enum.NODE_ALIGNMENT.HORIZONTAL;
                overflow.push(SCROLL_HORIZONTAL);
            }
            if (node.hasHeight) {
                overflowType |= $enum.NODE_ALIGNMENT.VERTICAL;
                overflow.push(SCROLL_VERTICAL);
            }
            node.overflow = overflowType;
        }
        const scrollView = overflow.map((value, index) => {
            const container = this.application.createNode(index === 0 ? <HTMLElement> node.baseElement : $dom.createElement(node.actualParent ? node.actualParent.baseElement : null, node.block));
            container.setControlType(value, CONTAINER_NODE.BLOCK);
            if (index === 0) {
                container.inherit(node, 'initial', 'base', 'styleMap');
                parent.appendTry(node, container);
            }
            else {
                container.inherit(node, 'base');
                container.exclude({ resource: $enum.NODE_RESOURCE.BOX_STYLE });
            }
            container.exclude({ resource: $enum.NODE_RESOURCE.ASSET });
            container.resetBox($enum.BOX_STANDARD.PADDING);
            return container;
        }) as T[];
        let outputAs = '';
        for (let i = 0; i < scrollView.length; i++) {
            const item = scrollView[i];
            const previous = scrollView[i - 1];
            switch (item.controlName) {
                case SCROLL_VERTICAL: {
                    const value = node.css('height');
                    node.android('layout_width', 'wrap_content');
                    item.android('layout_height', node.convertPX(value, false));
                    item.cssApply({
                        overflow: 'scroll visible',
                        overflowX: 'visible',
                        overflowY: 'scroll'
                    });
                    break;
                }
                case SCROLL_HORIZONTAL: {
                    const value = node.css('width');
                    item.android('layout_width', node.convertPX(value));
                    node.android('layout_height', 'wrap_content');
                    item.cssApply({
                        overflow: 'visible scroll',
                        overflowX: 'scroll',
                        overflowY: 'visible'
                    });
                    break;
                }
            }
            item.unsetCache();
            this.application.processing.cache.append(item);
            item.render(i === 0 ? (target ? item : parent) : previous);
            const xml = this.application.controllerHandler.getEnclosingTag(
                item.controlName,
                item.id,
                target ? (i === 0 ? -1 : 0) : item.renderDepth,
                $xml.formatPlaceholder(item.id)
            );
            if (i === 0) {
                outputAs = xml;
            }
            else {
                outputAs = $xml.replacePlaceholder(outputAs, previous.id, xml);
            }
        }
        if (scrollView.length === 2) {
            node.android('layout_width', 'wrap_content');
            node.android('layout_height', 'wrap_content');
        }
        else {
            if (node.overflowX) {
                node.android('layout_width', 'wrap_content');
                node.android('layout_height', 'match_parent');
            }
            else {
                node.android('layout_width', 'match_parent');
                node.android('layout_height', 'wrap_content');
            }
        }
        const outer = scrollView[scrollView.length - 1];
        node.parent = outer;
        if (parent.layoutConstraint) {
            outer.companion = node;
        }
        node.overflow = 0;
        node.resetBox($enum.BOX_STANDARD.MARGIN);
        node.exclude({ resource: $enum.NODE_RESOURCE.BOX_STYLE });
        return { output: '', parent: node.parent as T, renderAs: scrollView[0], outputAs };
    }
}