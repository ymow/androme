import View from '../view';
import ResourceHandler from '../resourcehandler';

import { EXT_ANDROID } from '../lib/constant';

export default class <T extends View> extends androme.lib.extensions.Custom<T> {
    public postProcedure(node: T) {
        const options: ExternalData = Object.assign({}, this.options[node.element.id]);
        node.apply(ResourceHandler.formatOptions(options, this.application.getExtensionOptionsValueAsBoolean(EXT_ANDROID.RESOURCE_STRINGS, 'useNumberAlias')));
    }
}