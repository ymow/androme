import WIDGET_NAME from '../namespace';

import Coordinator from './coodinator';

const coordinator = new Coordinator(WIDGET_NAME.COORDINATOR, WIDGET_NAME.__FRAMEWORK);

if (androme) {
    androme.installExtensionAsync(coordinator);
}

export default coordinator;