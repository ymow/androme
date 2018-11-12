import WIDGET_NAME from '../namespace';

import BottomNavigation from './bottomnavigation';

const bottomNavigation = new BottomNavigation(WIDGET_NAME.BOTTOM_NAVIGATION, WIDGET_NAME.__FRAMEWORK);

if (androme) {
    androme.installExtensionAsync(bottomNavigation);
}

export default bottomNavigation;