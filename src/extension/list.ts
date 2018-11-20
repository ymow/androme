import { EXT_NAME } from '../lib/constant';
import { BOX_STANDARD, NODE_RESOURCE } from '../lib/enumeration';

import Extension from '../base/extension';
import Node from '../base/node';
import NodeList from '../base/nodelist';

import { convertAlpha, convertRoman } from '../lib/util';

function hasSingleImage<T extends Node>(node: T) {
    return node.css('backgroundImage') !== 'none' && node.css('backgroundRepeat') === 'no-repeat';
}

export default abstract class List<T extends Node> extends Extension<T> {
    public condition(node: T) {
        return super.condition(node) && node.length > 0 && (
            node.every(item => item.blockStatic) ||
            node.every(item => item.inlineElement) ||
            (node.every(item => item.floating) && NodeList.floated(node.children).size === 1) ||
            node.every((item, index: number) => !item.floating && (index === 0 || index === node.length - 1 || item.blockStatic || (item.inlineElement && (node.item(index - 1) as T).blockStatic && (node.item(index + 1) as T).blockStatic)))
        ) && (
            node.some((item: T) => item.display === 'list-item' && (item.css('listStyleType') !== 'none' || hasSingleImage(item))) ||
            node.every((item: T) => item.tagName !== 'LI' && item.styleMap.listStyleType === 'none' && hasSingleImage(item))
        );
    }

    public processNode(node: T, parent: T): ExtensionResult<T> {
        let output = '';
        if (NodeList.linearY(node.children)) {
            output = this.application.writeGridLayout(node, parent, node.some(item => item.css('listStylePosition') === 'inside') ? 3 : 2);
        }
        else {
            output = this.application.writeLinearLayout(node, parent, true);
        }
        let i = 0;
        for (const item of node) {
            const mainData: ListData = {
                ordinal: '',
                imageSrc: '',
                imagePosition: ''
            };
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
        }
        return { output };
    }

    public postBaseLayout(node: T) {
        node.modifyBox(BOX_STANDARD.MARGIN_LEFT, null);
        node.modifyBox(BOX_STANDARD.PADDING_LEFT, null);
    }
}