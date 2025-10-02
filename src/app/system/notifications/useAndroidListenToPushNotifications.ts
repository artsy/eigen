import notifee, { AuthorizationStatus, Event, EventType } from "@notifee/react-native"
import messaging, { FirebaseMessagingTypes } from "@react-native-firebase/messaging"
import { PushNotification } from "app/system/notifications/usePushNotifications"
// eslint-disable-next-line no-restricted-imports
import { useEffect } from "react"
import { Platform } from "react-native"

/**
 * This hook is used to listen to listen to push notifications and display them
 * This is used for Android only
 */
export const useAndroidListenToPushNotifications = ({
  setPushNotification,
}: {
  setPushNotification: (pushNotification: PushNotification) => void
}) => {
  if (__DEV__ && !__TEST__ && Platform.OS === "ios") {
    throw new Error("useAndroidListenToPushNotifications is used for Android only")
  }

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
                  badgeCount: Number(message.notification?.android?.count) || undefined,
                }
              : undefined,
        })
      } catch (error) {
        console.error("DEBUG: error handling FCM message:", error)
      }
    }

    // The listeners for FCM messages
    const unsubscribeFCMForeground = messaging().onMessage(onMessageReceived)

    return () => {
      unsubscribeFCMForeground()
    }
  }, [])

  useEffect(() => {
    messaging()
      .getInitialNotification()
      .then((initialNotification) => {
        if (initialNotification) {
          const notification: PushNotification = {
            label: initialNotification.notification?.title,
            url: initialNotification.data?.url as string | null | undefined,
            message: initialNotification.notification?.body,
            data: initialNotification.data,
          }
          setPushNotification(notification)
        }
      })
  }, [setPushNotification])

  useEffect(() => {
    const handleAndroidEvent = (event: Event) => {
      if (!event.detail.notification) {
        return
      }

      const notification: PushNotification = {
        label: event.detail.notification.title,
        url: event.detail.notification.data?.url as string | null | undefined,
        message: event.detail.notification.body,
        data: event.detail.notification.data,
      }

      switch (event.type) {
        case EventType.PRESS:
          setPushNotification(notification)
          break
      }
    }

    const unsubscribeFromForegroundEvent = notifee.onForegroundEvent((event) => {
      handleAndroidEvent(event)
    })

    // This method handles the notification when the app is in the background
    const unsubscribeFromBackgroundEvent = messaging().onNotificationOpenedApp(async (event) => {
      const notification: PushNotification = {
        label: event.notification?.title,
        url: event.data?.url as string | null | undefined,
        message: event.notification?.body,
        data: event.data,
      }
      setPushNotification(notification)
    })

    return () => {
      unsubscribeFromForegroundEvent()
      unsubscribeFromBackgroundEvent()
    }
  }, [setPushNotification])
}
