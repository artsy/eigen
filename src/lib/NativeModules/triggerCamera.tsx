import { findNodeHandle } from "react-native"
import { LegacyNativeModules } from "./LegacyNativeModules"

export async function triggerCamera(component: React.Component<any, any>): Promise<any> {
  let reactTag
  try {
    reactTag = findNodeHandle(component)
  } catch (err) {
    console.error(
      "could not find tag for the component calling ARTakeCameraPhotoModule.triggerCameraModal"
    )
    return
  }
  return LegacyNativeModules.ARTakeCameraPhotoModule.triggerCameraModal(reactTag)
}
