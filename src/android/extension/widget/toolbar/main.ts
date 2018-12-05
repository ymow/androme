import { FRAMEWORK, WIDGET_NAME } from '../common';

import Toolbar from './toolbar';

const toolbar = new Toolbar(WIDGET_NAME.TOOLBAR, FRAMEWORK.ANDROID);

if (androme) {
    androme.includeAsync(toolbar);
}

export default toolbar;