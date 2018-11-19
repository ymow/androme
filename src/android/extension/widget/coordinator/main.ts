import { FRAMEWORK, WIDGET_NAME } from '../common';

import Coordinator from './coodinator';

const coordinator = new Coordinator(WIDGET_NAME.COORDINATOR, FRAMEWORK.ANDROID);

if (androme) {
    androme.installExtensionAsync(coordinator);
}

export default coordinator;