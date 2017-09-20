import { findNodeHandle, NativeModules } from "react-native"
const { AREventsModule } = NativeModules

function postEvent(info: any) {
  AREventsModule.postEvent(info)
}

export default { postEvent }
