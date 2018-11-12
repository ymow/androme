import WIDGET_NAME from '../namespace';

import Drawer from './drawer';

const drawer = new Drawer(WIDGET_NAME.DRAWER, WIDGET_NAME.__FRAMEWORK);

if (androme) {
    androme.installExtensionAsync(drawer);
}

export default drawer;