'use strict';

import { findNodeHandle, NativeModules } from 'react-native';
const { AREventsModule } = NativeModules;

function postEvent(component, info) {
  AREventsModule.postEvent(findNodeHandle(component), info);
}

export default { postEvent };