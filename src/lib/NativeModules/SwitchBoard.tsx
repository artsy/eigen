import { findNodeHandle, NativeModules } from "react-native"
const { ARSwitchBoardModule } = NativeModules

function presentNavigationViewController(component: React.Component<any, any>, route: string) {
  let reactTag
  try {
    reactTag = findNodeHandle(component)
  } catch (err) {
    return
  }

  ARSwitchBoardModule.presentNavigationViewController(reactTag, route)
}

function presentModalViewController(component: React.Component<any, any>, route: string) {
  let reactTag
  try {
    reactTag = findNodeHandle(component)
  } catch (err) {
    return
  }

  ARSwitchBoardModule.presentModalViewController(reactTag, route)
}

function presentMediaPreviewController(
  component: React.Component<any, any>,
  route: string,
  mimeType: string,
  cacheKey?: string
) {
  let reactTag
  try {
    reactTag = findNodeHandle(component)
  } catch (err) {
    return
  }

  ARSwitchBoardModule.presentMediaPreviewController(reactTag, route, mimeType, cacheKey)
}

function dismissModalViewController(component: React.Component<any, any>) {
  let reactTag
  try {
    reactTag = findNodeHandle(component)
  } catch (err) {
    return
  }

  ARSwitchBoardModule.dismissModalViewController(reactTag)
}

export default {
  presentNavigationViewController,
  presentMediaPreviewController,
  presentModalViewController,
  dismissModalViewController,
}
