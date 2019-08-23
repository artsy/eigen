import { findNodeHandle, NativeModules } from "react-native"
const { ARRefineOptionsModule } = NativeModules

interface RefineSettings {
  sort: string
  selectedMedium: string
  selectedPrice: string
  aggregations: ReadonlyArray<{
    slice: string
    counts: ReadonlyArray<{
      name: string
      value: string
      count: number
    }>
  }>
}

export async function triggerRefine(
  component: React.Component<any, any>,
  initialSettings: RefineSettings,
  currentSettings: RefineSettings
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
