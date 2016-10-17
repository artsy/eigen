/* @flow */
'use strict'

import { findNodeHandle, NativeModules } from 'react-native'
const { ARRefineOptionsModule } = NativeModules

async function triggerRefine(component: number, info: any) : Promise<any> {
  let reactTag
  try {
    reactTag = findNodeHandle(component)
  } catch (err) {
    console.error('could not find tag')
    return
  }
  return ARRefineOptionsModule.triggerRefinePanel(reactTag, info)
}

export default { triggerRefine }
