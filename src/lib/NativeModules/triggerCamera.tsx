import { findNodeHandle, NativeModules } from "react-native"
const { ARTakeCameraModule } = NativeModules

async function triggerCamera(component: React.Component<any, any>): Promise<any> {
  let reactTag
  try {
    reactTag = findNodeHandle(component)
  } catch (err) {
    console.error("could not find tag for ")
    return
  }
  return ARTakeCameraModule.triggerCameraModal(reactTag)
}

export default { triggerCamera }
