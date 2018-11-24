import { EXT_NAME } from '../lib/constant';
import { BOX_STANDARD, NODE_ALIGNMENT, NODE_CONTAINER, NODE_RESOURCE } from '../lib/enumeration';

import Extension from '../base/extension';
import Layout from '../base/layout';
import Node from '../base/node';
import NodeList from '../base/nodelist';

import { convertAlpha, convertRoman } from '../lib/util';

function hasSingleImage<T extends Node>(node: T) {
    return node.css('backgroundImage') !== 'none' && node.css('backgroundRepeat') === 'no-repeat';
}

export default abstract class List<T extends Node> extends Extension<T> {
    public static createDataAttribute(): ListData {
        return {
            ordinal: '',
            imageSrc: '',
            imagePosition: ''
        };
    }

    public condition(node: T) {
        return super.condition(node) && node.length > 0 && (
            node.every(item => item.blockStatic) ||
            node.every(item => item.inlineVertical) ||
            (node.every(item => item.floating) && NodeList.floated(node.children).size === 1) ||
            node.every((item, index) => !item.floating && (index === 0 || index === node.length - 1 || item.blockStatic || (item.inlineflow && (node.item(index - 1) as T).blockStatic && (node.item(index + 1) as T).blockStatic)))
        ) && (
            node.some(item => item.display === 'list-item' && (item.css('listStyleType') !== 'none' || hasSingleImage(item))) ||
            node.every(item => item.tagName !== 'LI' && item.styleMap.listStyleType === 'none' && hasSingleImage(item))
        );
    }

    public processNode(node: T, parent: T): ExtensionResult<T> {
        let i = 0;
        node.each(item => {
            const mainData: ListData = List.createDataAttribute();
            if (item.display === 'list-item' || item.has('listStyleType') || hasSingleImage(item)) {
                let src = item.css('listStyleImage');
                if (src && src !== 'none') {
                    mainData.imageSrc = src;
                }
                else {
                    switch (item.css('listStyleType')) {
                        case 'disc':
                            mainData.ordinal = '●';
                            break;
                        case 'square':
                            mainData.ordinal = '■';
                            break;
                        case 'decimal':
                            mainData.ordinal = `${(i + 1).toString()}.`;
                            break;
                        case 'decimal-leading-zero':
                            mainData.ordinal = `${(i < 9 ? '0' : '') + (i + 1).toString()}.`;
                            break;
                        case 'lower-alpha':
                        case 'lower-latin':
                            mainData.ordinal = `${convertAlpha(i).toLowerCase()}.`;
                            break;
                        case 'upper-alpha':
                        case 'upper-latin':
                            mainData.ordinal = `${convertAlpha(i)}.`;
                            break;
                        case 'lower-roman':
                            mainData.ordinal = `${convertRoman(i + 1).toLowerCase()}.`;
                            break;
                        case 'upper-roman':
                            mainData.ordinal = `${convertRoman(i + 1)}.`;
                            break;
                        case 'none':
                            src = '';
                            let position = '';
                            const repeat = item.css('backgroundRepeat');
                            if (repeat === 'no-repeat') {
                                src = item.css('backgroundImage');
                                position = item.css('backgroundPosition');
                            }
                            if (src && src !== 'none') {
                                mainData.imageSrc = src;
                                mainData.imagePosition = position;
                                item.excludeResource |= NODE_RESOURCE.IMAGE_SOURCE;
                            }
                            break;
                        default:
                            mainData.ordinal = '○';
                            break;
                    }
                }
                i++;
            }
            item.data(EXT_NAME.LIST, 'mainData', mainData);
        });
        const layout = new Layout(
            node,
            parent,
            0,
            0,
            node.length,
            node.children as T[]
        );
        let complete = false;
        if (NodeList.linearY(node.children)) {
            layout.rowCount = node.length;
            layout.columnCount = node.some(item => item.css('listStylePosition') === 'inside') ? 3 : 2;
            layout.setType(NODE_CONTAINER.GRID, NODE_ALIGNMENT.AUTO_LAYOUT);
            complete = true;
        }
        else if (this.application.viewController.checkRelativeHorizontal(node, node.children as T[])) {
            layout.rowCount = 1;
            layout.columnCount = node.length;
            layout.setType(NODE_CONTAINER.RELATIVE, NODE_ALIGNMENT.HORIZONTAL);
            complete = true;
        }
        const output = complete ? this.application.renderNode(layout) : '';
        return { output, complete };
    }

    public postBaseLayout(node: T) {
        node.modifyBox(BOX_STANDARD.MARGIN_LEFT, null);
        node.modifyBox(BOX_STANDARD.PADDING_LEFT, null);
    }
}