import notifee, { AuthorizationStatus } from "@notifee/react-native"
import messaging, { FirebaseMessagingTypes } from "@react-native-firebase/messaging"
import { listenToNativeEvents } from "app/store/NativeModel"
// eslint-disable-next-line no-restricted-imports
import { useEffect, useRef } from "react"
import { EmitterSubscription, Platform } from "react-native"

/**
 * This hook is used to listen to remote messages and display them
 */
export const useListenToRemoteMessages = () => {
  const iosListenerRef = useRef<EmitterSubscription | null>(null)

  useEffect(() => {
    const onMessageReceived = async (message: FirebaseMessagingTypes.RemoteMessage) => {
      try {
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

      // This is a special handler for FCM messages when the app is in the background or quit state.
      messaging().setBackgroundMessageHandler(onMessageReceived)

      return () => {
        unsubscribeFCMForeground()
      }
    }

    if (Platform.OS === "ios") {
      iosListenerRef.current = listenToNativeEvents((event) => {
        if (event.type === "NOTIFICATION_RECEIVED") {
          console.log("DEBUG: NOTIFICATION_RECEIVED", event)
          const alert = event.payload?.aps?.alert
          const eventID = event.payload?.["item_id"]

          const message: FirebaseMessagingTypes.RemoteMessage = {
            messageId: event.payload?.["item_id"],
            fcmOptions: {},
            notification: event.payload,
          }
          onMessageReceived(message)
        }
      })

      return () => {
        iosListenerRef.current?.remove?.()
      }
    }
  }, [])
}
