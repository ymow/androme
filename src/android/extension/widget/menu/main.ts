import { FRAMEWORK, WIDGET_NAME } from '../common';

import Menu from './menu';

const menu = new Menu(WIDGET_NAME.MENU, FRAMEWORK.ANDROID, ['NAV']);

if (androme) {
    androme.includeAsync(menu);
}

export default menu;