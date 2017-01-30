import { findNodeHandle, NativeModules } from 'react-native'
const { AREventsModule } = NativeModules

function postEvent(component: any, info: any) {
  let reactTag
  try {
    reactTag = findNodeHandle(component)
  } catch (err) {
    return
  }

  AREventsModule.postEvent(reactTag, info)
}

export default { postEvent }
