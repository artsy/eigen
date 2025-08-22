import notifee, { AuthorizationStatus } from "@notifee/react-native"
import messaging, { FirebaseMessagingTypes } from "@react-native-firebase/messaging"
// eslint-disable-next-line no-restricted-imports
import { useEffect } from "react"
import { Platform } from "react-native"

/**
 * This hook is used to listen to remote messages and display them
 */
export const useListenToRemoteMessages = () => {
  useEffect(() => {
    const onMessageReceived = async (message: FirebaseMessagingTypes.RemoteMessage) => {
      try {
        console.log("DEBUG: FCM message received", {
          messageId: message.messageId,
          title: message.notification?.title,
          body: message.notification?.body,
          data: message.data,
          platform: Platform.OS,
        })

        // Check if we have notification permissions before trying to display
        const settings = await notifee.getNotificationSettings()

        if (settings.authorizationStatus !== AuthorizationStatus.AUTHORIZED) {
          console.log("DEBUG: Notifications not authorized", settings.authorizationStatus)
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
          android: {
            smallIcon: "ic_notification",
            channelId,
          },
        })
      } catch (error) {
        console.error("DEBUG: error handling FCM message:", error)
      }
    }

    // The listeners for FCM messages
    const unsubscribeFCMForeground = messaging().onMessage(onMessageReceived)

    // This is a special handler for FCM messages when the app is in the background or quit state.
    messaging().setBackgroundMessageHandler(onMessageReceived)

    return () => {
      unsubscribeFCMForeground()
    }
  }, [])
}
