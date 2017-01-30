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

export default {
  presentNavigationViewController,
  presentModalViewController,
}
