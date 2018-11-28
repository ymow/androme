import { AXIS_ANDROID, CONTAINER_ANDROID } from '../../lib/constant';

import View from '../../view';

import $NodeList = androme.lib.base.NodeList;

import $enum = androme.lib.enumeration;
import $util = androme.lib.util;
import $xml = androme.lib.xml;

const RADIO_GROUP = 'RadioGroup';

export default class ScrollView<T extends View> extends androme.lib.base.Extension<T> {
    public condition(node: T) {
        const element = <HTMLInputElement> node.element;
        return element.tagName === 'INPUT' && element.type === 'radio' && element.name !== '';
    }

    public processNode(node: T, parent: T): ExtensionResult<T> {
        const target = $util.hasValue(node.dataset.target) && !$util.hasValue(node.dataset.include);
        const element = <HTMLInputElement> node.element;
        const children = parent.flatMap(item => {
            if (item.renderAs) {
                item = item.renderAs;
            }
            const input = <HTMLInputElement> item.element;
            if (input.type === 'radio' && input.name === element.name && !item.rendered) {
                return item;
            }
            return null;
        }) as T[];
        if (children.length > 1) {
            const container = this.application.viewController.createNodeGroup(node, parent, children);
            container.alignmentType |= $enum.NODE_ALIGNMENT.HORIZONTAL | (parent.length !== children.length ? $enum.NODE_ALIGNMENT.SEGMENTED : 0);
            container.setControlType(RADIO_GROUP, $enum.NODE_CONTAINER.INLINE);
            container.inherit(node, 'alignment');
            container.each((item: T) => {
                if (item !== node) {
                    item.setControlType(CONTAINER_ANDROID.RADIO, $enum.NODE_CONTAINER.RADIO);
                }
                item.positioned = true;
                item.parent = container;
            });
            container.css('verticalAlign', 'text-bottom');
            container.android('orientation', $NodeList.linearX(children) ? AXIS_ANDROID.HORIZONTAL : AXIS_ANDROID.VERTICAL);
            container.render(target ? container : parent);
            this.subscribers.add(container);
            const output = $xml.getEnclosingTag(RADIO_GROUP, container.id, target ? -1 : container.renderDepth, $xml.formatPlaceholder(container.id));
            return { output: '', parent: container, renderAs: container, outputAs: output };
        }
        return { output: '' };
    }

    public postBaseLayout(node: T) {
        node.some((item: T) => {
            if ((<HTMLInputElement> item.element).checked) {
                node.android('checkedButton', item.stringId);
                return true;
            }
            return false;
        });
    }
}