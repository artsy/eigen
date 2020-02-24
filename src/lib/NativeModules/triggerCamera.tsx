import { findNodeHandle, NativeModules } from "react-native"
const { ARTakeCameraPhotoModule } = NativeModules

export async function triggerCamera(component: React.Component<any, any>): Promise<any> {
  let reactTag
  try {
    reactTag = findNodeHandle(component)
  } catch (err) {
    console.error("could not find tag for the component calling ARTakeCameraPhotoModule.triggerCameraModal")
    return
  }
  return ARTakeCameraPhotoModule.triggerCameraModal(reactTag)
}
