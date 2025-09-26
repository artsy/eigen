import messaging from "@react-native-firebase/messaging"
import { LegacyNativeModules } from "app/NativeModules/LegacyNativeModules"
import { GlobalStore } from "app/store/GlobalStore"
import { saveToken } from "app/utils/PushNotification"
import { useEffect } from "react"
import { Platform } from "react-native"

/**
 * This hook is used to register the device for push notifications
 */
export const useRegisterForPushNotifications = () => {
  const isLoggedIn = GlobalStore.useAppState((state) => !!state.auth.userAccessToken)

  useEffect(() => {
    // On Android, we need to register for remote messages to get the token
    // On iOS, we don't need to register for remote messages to get the token
    // because it's handled by the app delegate
    if (isLoggedIn) {
      registerForRemoteMessages()
    }
  }, [isLoggedIn])

  const registerForRemoteMessages = async () => {
    try {
      // Register the device with FCM
      await messaging().registerDeviceForRemoteMessages()

      let token = ""
      if (Platform.OS === "android") {
        // Get the token
        token = await messaging().getToken()
      } else {
        // Get the token
        token = (await LegacyNativeModules.ArtsyNativeModule.getPushToken()) ?? ""
      }

      if (!token) {
        console.error("DEBUG: Failed to obtain FCM token")
        return
      }

      // Save the token
      const savedToken = await saveToken(token)
      if (!savedToken) {
        console.error("DEBUG: Failed to save token:")
      }

      // Set up token refresh listener
      const unsubscribe = messaging().onTokenRefresh(async (newToken) => {
        const savedToken = await saveToken(newToken)
        if (!savedToken) {
          console.error("DEBUG: Failed to save refreshed token:")
        }
      })

      return unsubscribe
    } catch (error) {
      console.error("DEBUG: Error in registerForRemoteMessages:", error)
    }
  }
}
