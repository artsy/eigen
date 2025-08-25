import { useToast } from "app/Components/Toast/toastHook"
import { ArtsyNativeModule } from "app/NativeModules/ArtsyNativeModule"
import { useEffect } from "react"
import { NativeEventEmitter, NativeModules, Platform } from "react-native"

/**
 * This is used to check for app updates on every app launch.
 * Also monitors for downloaded updates and shows restart toast.
 */
export const usePromptForUpdate = () => {
  const toast = useToast()

  useEffect(() => {
    // Only run on Android
    if (Platform.OS !== "android") {
      return
    }

    const eventEmitter = new NativeEventEmitter(NativeModules.ArtsyNativeModule)

    setTimeout(() => {
      // delay prompt until homescreen loads
      ArtsyNativeModule.checkForAppUpdate()
    }, 12000)

    // Check if an update was already downloaded and show toast
    if (ArtsyNativeModule.updateDownloaded) {
      showUpdateDownloadedToast()
    }

    // Listen for update download events
    const eventListener = eventEmitter.addListener("onAppUpdateDownloaded", () => {
      showUpdateDownloadedToast()
    })

    return () => {
      eventListener.remove()
    }
  }, [])

  const completeAppUpdate = async () => {
    try {
      await ArtsyNativeModule.completeAppUpdate()
    } catch (error: any) {
      console.log("Failed to complete app update:", error)
    }
  }

  const showUpdateDownloadedToast = () => {
    toast.show("Update downloaded. Reload to apply the update.", "bottom", {
      backgroundColor: "green100",
      cta: "Reload",
      onPress: completeAppUpdate,
      duration: "superLong",
    })
  }
}
