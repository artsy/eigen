import notifee, { AuthorizationStatus } from "@notifee/react-native"
import messaging, { FirebaseMessagingTypes } from "@react-native-firebase/messaging"
// eslint-disable-next-line no-restricted-imports
import { useEffect } from "react"
import { Platform } from "react-native"

/**
 * This hook is used to listen to FCM messages and display them
 * This is used for Android only
 */
export const useAndroidListenToFCMMessages = () => {
  useEffect(() => {
    const onMessageReceived = async (message: FirebaseMessagingTypes.RemoteMessage) => {
      try {
        // Check if we have notification permissions before trying to display
        const settings = await notifee.getNotificationSettings()

        if (settings.authorizationStatus !== AuthorizationStatus.AUTHORIZED) {
          return
        }

        // Display the notification using Notifee
        const channelId =
          Platform.OS === "android"
            ? message.notification?.android?.channelId || "Default"
            : undefined

        await notifee.displayNotification({
          title: message.notification?.title,
          body: message.notification?.body,
          data: { ...message.notification, ...message.data },
          android:
            Platform.OS === "android"
              ? {
                  smallIcon: "ic_notification",
                  channelId,
                  badgeCount: message.notification?.android?.count,
                }
              : undefined,
        })
      } catch (error) {
        console.error("DEBUG: error handling FCM message:", error)
      }
    }

    if (Platform.OS === "android") {
      // The listeners for FCM messages
      const unsubscribeFCMForeground = messaging().onMessage(onMessageReceived)

      // TODO: Do we need a background message handler?
      // messaging().setBackgroundMessageHandler(onMessageReceived)

      return () => {
        unsubscribeFCMForeground()
      }
    }
  }, [])
}
