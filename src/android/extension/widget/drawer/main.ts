import { FRAMEWORK, WIDGET_NAME } from '../common';

import Drawer from './drawer';

const drawer = new Drawer(WIDGET_NAME.DRAWER, FRAMEWORK.ANDROID);

if (androme) {
    androme.installExtensionAsync(drawer);
}

export default drawer;