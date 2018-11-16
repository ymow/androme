import { EXT_ANDROID } from '../lib/constant';

import Resource from '../resource';
import View from '../view';

export default class <T extends View> extends androme.lib.extensions.Custom<T> {
    public postProcedure(node: T) {
        const options: ExternalData = Object.assign({}, this.options[node.element.id]);
        node.apply(Resource.formatOptions(options, this.application.getExtensionOptionsValueAsBoolean(EXT_ANDROID.RESOURCE_STRINGS, 'useNumberAlias')));
    }
}