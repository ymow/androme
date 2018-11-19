import { FRAMEWORK, WIDGET_NAME } from '../common';

import BottomNavigation from './bottomnavigation';

const bottomNavigation = new BottomNavigation(WIDGET_NAME.BOTTOM_NAVIGATION, FRAMEWORK.ANDROID);

if (androme) {
    androme.installExtensionAsync(bottomNavigation);
}

export default bottomNavigation;