/* @flow */
'use strict'

import { findNodeHandle, NativeModules } from 'react-native'
const { ARSwitchBoardModule } = NativeModules

function presentNavigationViewController(component: any, route: any) {
  let reactTag
  try {
    reactTag = findNodeHandle(component)
  } catch (err) {
    return
  }

  ARSwitchBoardModule.presentNavigationViewController(reactTag, route)
}

function presentModalViewController(component: any, route: any) {
  let reactTag
  try {
    reactTag = findNodeHandle(component)
  } catch (err) {
    return
  }

  ARSwitchBoardModule.presentModalViewController(reactTag, route)
}

function presentSearchViewController(component: any) {
  let reactTag
  try {
    reactTag = findNodeHandle(component)
  } catch (err) {
    return
  }

  ARSwitchBoardModule.presentSearchViewController(reactTag)
}

export default {
  presentNavigationViewController,
  presentModalViewController,
  presentSearchViewController,
}
