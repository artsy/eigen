'use strict';

import { findNodeHandle, NativeModules } from 'react-native';
const { ARSwitchBoardModule } = NativeModules;

function presentNavigationViewController(component, route) {
  try {
    ARSwitchBoardModule.presentNavigationViewController(findNodeHandle(component), route);
  }

  catch(err) {}
}

function presentModalViewController(component, route) {
  try {
    ARSwitchBoardModule.presentModalViewController(findNodeHandle(component), route);
  }

  catch(err) {}
}

export default {
  presentNavigationViewController,
  presentModalViewController
};
