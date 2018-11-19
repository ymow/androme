import { FRAMEWORK, WIDGET_NAME } from '../common';

import FloatingActionButton from './floatingactionbutton';

const fab = new FloatingActionButton(WIDGET_NAME.FAB, FRAMEWORK.ANDROID, ['BUTTON', 'INPUT', 'IMG']);

if (androme) {
    androme.installExtensionAsync(fab);
}

export default fab;