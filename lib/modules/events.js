'use strict'

import { findNodeHandle, NativeModules } from 'react-native'
const { AREventsModule } = NativeModules

function postEvent(component, info) {
  let reactTag
  try {
    reactTag = findNodeHandle(component)
  } catch (err) {
    return
  }

  AREventsModule.postEvent(reactTag, info)
}

type LayoutEvent = {
  nativeEvent: {
    layout: {
      x: number;
      y: number;
      width: number;
      height: number;
    }
  }
}

export default { postEvent, LayoutEvent }
