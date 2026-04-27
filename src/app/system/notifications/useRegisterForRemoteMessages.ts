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
      await messaging().registerDeviceForRemoteMessages()

      // Register the refresh listener before attempting to get the current token.
      // On iOS, getPushToken() can return null immediately after sign-out (clearUserData
      // wipes the stored APNS token and re-registration is async). Without this listener
      // in place first, we'd bail early and never capture the token once APNS delivers it.
      const unsubscribe = messaging().onTokenRefresh(async (newToken) => {
        await saveToken(newToken)
      })

      let token = ""
      if (Platform.OS === "android") {
        token = await messaging().getToken()
      } else {
        token = (await LegacyNativeModules.ArtsyNativeModule.getPushToken()) ?? ""
      }

      if (token) {
        await saveToken(token)
      }

      return unsubscribe
    } catch (error) {
      console.error("Error in registerForRemoteMessages:", error)
    }
  }
}
