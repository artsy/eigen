import { NativeModules } from "react-native"
const { AREventsModule } = NativeModules

function postEvent(info: any) {
  if (__DEV__) {
    console.log("[Event tracked]", info)
  }
  AREventsModule.postEvent(info)
}

export default { postEvent }
