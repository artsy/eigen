import { findNodeHandle, NativeModules } from "react-native"
const { ARTakeCameraPhotoModule } = NativeModules

async function triggerCamera(component: React.Component<any, any>): Promise<any> {
  let reactTag
  try {
    reactTag = findNodeHandle(component)
  } catch (err) {
    console.error("could not find tag for the component calling ARTakeCameraModule.triggerCameraModal")
    return
  }
  return ARTakeCameraPhotoModule.triggerCameraModal(reactTag)
}

export default triggerCamera
