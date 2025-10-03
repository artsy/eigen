import { listenToNativeEvents } from "app/NativeModules/utils/listenToNativeEvents"
import { PushNotification } from "app/system/notifications/usePushNotifications"
// eslint-disable-next-line no-restricted-imports
import { useEffect, useRef } from "react"
import { EmitterSubscription, Platform } from "react-native"

/**
 * This hook is used to listen to listen to push notifications and display them
 * This is used for iOS only
 */
export const useIOSListenToPushNotifications = ({
  setPushNotification,
}: {
  setPushNotification: (pushNotification: PushNotification) => void
}) => {
  if (__DEV__ && Platform.OS === "android") {
    throw new Error("useIOSListenToPushNotifications is used for iOS only")
  }

  const iosListenerRef = useRef<EmitterSubscription | null>(null)

  // Listen to iOS events
  useEffect(() => {
    iosListenerRef.current = listenToNativeEvents((event) => {
      if (
        event.type === "NOTIFICATION_RECEIVED" &&
        event.payload?.NotificationAction === "Tapped"
      ) {
        // Create a Notification object from the iOS payload
        const notification: PushNotification = {
          label: event.payload?.label,
          url: event.payload?.url,
          message: event.payload?.message,
          data: event.payload,
        }

        setPushNotification(notification)
      }
    })

    return () => {
      iosListenerRef.current?.remove?.()
    }
  }, [setPushNotification])
}
