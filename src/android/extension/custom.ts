import { SettingsAndroid } from '../types/module';

import View from '../view';
import ResourceHandler from '../resourcehandler';

export default class <T extends View> extends androme.lib.extensions.Custom<T> {
    public postProcedure(node: T) {
        const options: ExternalData = Object.assign({}, this.options[node.element.id]);
        node.apply(ResourceHandler.formatOptions(options, <SettingsAndroid> this.application.settings));
    }
}