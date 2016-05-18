'use strict';

import React from 'react-native';
const { findNodeHandle } = React;
const { ARSwitchBoardModule } = React.NativeModules;

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
