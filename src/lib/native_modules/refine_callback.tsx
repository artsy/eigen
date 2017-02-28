import { findNodeHandle, NativeModules } from "react-native"
import Gene from "../containers/gene"
const { ARRefineOptionsModule } = NativeModules

async function triggerRefine(
  component: React.Component<any, any>,
  initialSettings: any,
  currentSettings: any,
): Promise<any> {
  let reactTag
  try {
    reactTag = findNodeHandle(component)
  } catch (err) {
    console.error("could not find tag")
    return
  }
  return ARRefineOptionsModule.triggerRefinePanel(reactTag, initialSettings, currentSettings)
}

export default { triggerRefine }
