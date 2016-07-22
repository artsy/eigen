'use strict';

import { findNodeHandle, NativeModules } from 'react-native';
const { AREventsModule } = NativeModules;

function postEvent(component, info) {
  let reactTag;
  try {
    reactTag = findNodeHandle(component);
  } catch (err) {
    return;
  }

  AREventsModule.postEvent(reactTag, info);
}

export default { postEvent };
