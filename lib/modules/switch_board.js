'use strict';

import { findNodeHandle, NativeModules } from 'react-native';
const { ARSwitchBoardModule } = NativeModules;

function presentNavigationViewController(component, route) {
  ARSwitchBoardModule.presentNavigationViewController(findNodeHandle(component), route);
}

function presentModalViewController(component, route) {
  ARSwitchBoardModule.presentModalViewController(findNodeHandle(component), route);
}

export default {
  presentNavigationViewController,
  presentModalViewController
};
