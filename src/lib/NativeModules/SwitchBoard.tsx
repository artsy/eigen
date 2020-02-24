import { findNodeHandle, NativeModules } from "react-native"
const { ARSwitchBoardModule } = NativeModules

function presentNavigationViewController(component: React.Component<any, any>, route: string) {
  let reactTag
  try {
    reactTag = findNodeHandle(component)
  } catch (err) {
    console.error(`Unable to find tag in presentNavigationViewController: ${err.message}`)
    return
  }

  ARSwitchBoardModule.presentNavigationViewController(reactTag, route)
}

function presentModalViewController(component: React.Component<any, any>, route: string) {
  let reactTag
  try {
    reactTag = findNodeHandle(component)
  } catch (err) {
    console.error(`Unable to find tag in presentModalViewController: ${err.message}`)
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
    console.error(`Unable to find tag in presentMediaPreviewController: ${err.message}`)
    return
  }

  ARSwitchBoardModule.presentMediaPreviewController(reactTag, route, mimeType, cacheKey)
}

function dismissModalViewController(component: React.Component<any, any>) {
  let reactTag
  try {
    reactTag = findNodeHandle(component)
  } catch (err) {
    console.error(`Unable to find tag in dismissModalViewController: ${err.message}`)
    return
  }

  ARSwitchBoardModule.dismissModalViewController(reactTag)
}

function dismissNavigationViewController(component: React.Component<any, any>) {
  let reactTag
  try {
    reactTag = findNodeHandle(component)
  } catch (err) {
    console.error(`Unable to find tag in dismissNavigationViewController: ${err.message}`)
    return
  }

  ARSwitchBoardModule.dismissNavigationViewController(reactTag)
}

function presentEmailComposer(component: React.Component<any, any>, to: string, subject: string, body?: string) {
  let reactTag
  try {
    reactTag = findNodeHandle(component)
  } catch (err) {
    console.error(`Unable to find tag in dismissNavigationViewController: ${err.message}`)
    return
  }

  ARSwitchBoardModule.presentEmailComposer(reactTag, to, subject, body)
}

export default {
  presentEmailComposer,
  presentNavigationViewController,
  presentMediaPreviewController,
  presentModalViewController,
  dismissModalViewController,
  dismissNavigationViewController,
}
