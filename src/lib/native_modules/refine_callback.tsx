import Gene from '../containers/gene'
import { findNodeHandle, NativeModules } from 'react-native'
const { ARRefineOptionsModule } = NativeModules

async function triggerRefine(component: Gene, initialSettings: any, currentSettings: any) : Promise<any> {
  let reactTag
  try {
    reactTag = findNodeHandle(component)
  } catch (err) {
    console.error('could not find tag')
    return
  }
  return ARRefineOptionsModule.triggerRefinePanel(reactTag, initialSettings, currentSettings)
}

export default { triggerRefine }
