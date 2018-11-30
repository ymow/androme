import View from '../../view';

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
        const target = $util.hasValue(node.dataset.target) && !$util.hasValue(node.dataset.include);
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
            const container = new View(this.application.processing.cache.nextId, index === 0 ? node.element : undefined, this.application.viewController.delegateNodeInit) as T;
            container.setControlType(value, $enum.NODE_CONTAINER.BLOCK);
            if (index === 0) {
                container.inherit(node, 'initial', 'base', 'style', 'styleMap');
                parent.appendTry(node, container);
                container.render(parent);
            }
            else {
                container.init();
                container.tagName = node.tagName;
                container.documentParent = node.documentParent;
                container.inherit(node, 'initial', 'dimensions', 'style', 'styleMap');
            }
            container.resetBox($enum.BOX_STANDARD.PADDING);
            return container;
        });
        let output = '';
        for (let i = 0; i < scrollView.length; i++) {
            const item = scrollView[i];
            const previous = scrollView[i - 1];
            switch (item.controlName) {
                case SCROLL_VERTICAL: {
                    const value = item.css('height');
                    item.android('layout_height', $util.isPercent(value) ? item.convertPercent(value, false) : value);
                    item.css({
                        width: 'auto',
                        overflow: 'scroll visible',
                        overflowX: 'visible',
                        overflowY: 'scroll'
                    });
                    break;
                }
                case SCROLL_HORIZONTAL: {
                    const value = item.css('width');
                    item.android('layout_width', $util.isPercent(value) ? item.convertPercent(value, true) : value);
                    item.css({
                        height: 'auto',
                        overflow: 'visible scroll',
                        overflowX: 'scroll',
                        overflowY: 'visible'
                    });
                    break;
                }
            }
            this.application.processing.cache.append(item);
            item.render(i === 0 ? (target ? item : parent) : previous);
            const xml = $xml.getEnclosingTag(item.controlName, item.id, target ? (i === 0 ? -1 : 0) : item.renderDepth, $xml.formatPlaceholder(item.id));
            if (i === 0) {
                output = xml;
            }
            else {
                output = $xml.replacePlaceholder(output, previous.id, xml);
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
        node.overflow = 0;
        node.parent = scrollView[scrollView.length - 1];
        node.resetBox($enum.BOX_STANDARD.MARGIN);
        node.exclude({ resource: $enum.NODE_RESOURCE.BOX_STYLE });
        return { output: '', parent: node.parent, renderAs: scrollView[0], outputAs: output };
    }
}