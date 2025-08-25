import { ArtsyNativeModule } from "app/NativeModules/ArtsyNativeModule"

export const promptForUpdate = () => {
  console.warn("promptForUpdate called")
  return ArtsyNativeModule.checkForAppUpdate()
    ?.then((wasTriggered: boolean) => {
      console.warn("App update check result:", wasTriggered)
      if (!wasTriggered) {
        return
      }
    })
    .catch((error: any) => {
      console.warn("App update check failed: ", error)
    })
}

export const completeAppUpdate = () => {
  return ArtsyNativeModule.completeAppUpdate()?.catch((error: any) => {
    console.warn("Failed to complete app update:", error)
  })
}
