import { FRAMEWORK, WIDGET_NAME } from '../common';

import Coordinator from './coodinator';

const coordinator = new Coordinator(WIDGET_NAME.COORDINATOR, FRAMEWORK.ANDROID);

if (androme) {
    androme.includeAsync(coordinator);
}

export default coordinator;