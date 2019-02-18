import { NativeModules } from "react-native"
const { AREventsModule } = NativeModules

function postEvent(info: any) {
  if (__DEV__) {
    console.log("[Event tracked]", JSON.stringify(info, null, 2))
  }
  AREventsModule.postEvent(info)
}

export default { postEvent }
