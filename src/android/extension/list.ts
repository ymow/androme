import View from '../view';
import List from '../../extension/list';
import { VIEW_STANDARD } from '../../lib/constants';
import parseRTL from '../localization';

export default class ListAndroid<T extends View> extends List {
    constructor(name: string, tagNames: string[], options?: {}) {
        super(name, tagNames, options);
    }

    public processChild() {
        const node = (<T> this.node);
        const controllerHandler = this.application.controllerHandler;
        const options = node.options(this.name);
        if (options && options.listStyle != null) {
            controllerHandler.prependBefore(
                node.id,
                controllerHandler.getViewStatic(
                    (options.listStyle !== '0' ? VIEW_STANDARD.TEXT : VIEW_STANDARD.SPACE),
                    node.depth,
                    { android: { gravity: parseRTL('right'), layout_gravity: 'fill', layout_columnWeight: '0', [parseRTL('layout_marginRight')]: '8px', text: (options.listStyle !== '0' ? options.listStyle : '') } }
                )[0]
            );
            node.android('layout_columnWeight', '1');
        }
        return ['', false];
    }
}