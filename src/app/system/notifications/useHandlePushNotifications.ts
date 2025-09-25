import notifee, { Event, EventType } from "@notifee/react-native"
import messaging from "@react-native-firebase/messaging"
import { listenToNativeEvents } from "app/NativeModules/utils/listenToNativeEvents"
import { GlobalStore } from "app/store/GlobalStore"
// eslint-disable-next-line no-restricted-imports
import { navigate, navigationEvents } from "app/system/navigation/navigate"
import { AnalyticsConstants } from "app/utils/track/constants"
import { useCallback, useEffect, useRef, useState } from "react"
import { EmitterSubscription, Platform } from "react-native"
import { useTracking } from "react-tracking"

type PendingNotification = {
  label: string | null | undefined
  url: string | null | undefined
  message: string | null | undefined
  data: any
}
/**
 * This hook is used to handle remote messages and display them
 */
export const useHandlePushNotifications = () => {
  const isLoggedIn = GlobalStore.useAppState((state) => !!state.auth.userAccessToken)
  const isNavigationReady = GlobalStore.useAppState((state) => state.sessionState.isNavigationReady)
  const { trackEvent } = useTracking()
  const iosListenerRef = useRef<EmitterSubscription | null>(null)
  const [pendingNotification, setPendingNotification] = useState<PendingNotification | null>(null)

  const handleNotification = useCallback(
    (notification: PendingNotification) => {
      trackEvent({
        event_name: AnalyticsConstants.NotificationTapped.key,
        label: notification.data?.label,
        url: notification.data?.url,
        message: notification.message,
      })

      setPendingNotification(notification)
    },
    [trackEvent]
  )

  // Listen to iOS events
  useEffect(() => {
    if (Platform.OS === "ios") {
      iosListenerRef.current = listenToNativeEvents((event) => {
        console.log("DEBUG: iOS event", event)
        if (
          event.type === "NOTIFICATION_RECEIVED" &&
          event.payload?.NotificationAction === "Tapped"
        ) {
          // Create a Notification object from the iOS payload
          const notification: PendingNotification = {
            label: event.payload?.label,
            url: event.payload?.url,
            message: event.payload?.message,
            data: event.payload,
          }

          handleNotification(notification)
        }
      })

      return () => {
        iosListenerRef.current?.remove?.()
      }
    }
  }, [handleNotification])

  useEffect(() => {
    messaging()
      .getInitialNotification()
      .then((initialNotification) => {
        if (initialNotification) {
          console.log("DEBUG: initialNotification", initialNotification)
          const notification: PendingNotification = {
            label: initialNotification.notification?.title,
            url: initialNotification.data?.url as string | null | undefined,
            message: initialNotification.notification?.body,
            data: initialNotification.data,
          }
          handleNotification(notification)
        }
      })
  }, [isNavigationReady, handleNotification])

  // Listen to Android events
  useEffect(() => {
    // if (Platform.OS === "ios") {
    //   return
    // }

    const handleAndroidEvent = (event: Event) => {
      console.log("DEBUG: handleAndroidEvent", event)
      if (!event.detail.notification) {
        return
      }

      const notification: PendingNotification = {
        label: event.detail.notification.title,
        url: event.detail.notification.data?.url as string | null | undefined,
        message: event.detail.notification.body,
        data: event.detail.notification.data,
      }

      switch (event.type) {
        case EventType.PRESS:
          handleNotification(notification)
          break
      }
    }

    const unsubscribeFromForegroundEvent = notifee.onForegroundEvent((event) => {
      handleAndroidEvent(event)
    })

    // This method handles the notification when the app is in the background
    const unsubscribeFromBackgroundEvent = messaging().onNotificationOpenedApp(async (event) => {
      const notification: PendingNotification = {
        label: event.notification?.title,
        url: event.data?.url as string | null | undefined,
        message: event.notification?.body,
        data: event.data,
      }
      handleNotification(notification)
    })

    return () => {
      unsubscribeFromForegroundEvent()
      unsubscribeFromBackgroundEvent()
    }
  }, [handleNotification])

  // Navigate to the notification URL if the user is logged in
  useEffect(() => {
    if (isLoggedIn && isNavigationReady && pendingNotification) {
      navigationEvents.emit("requestModalDismiss")

      const url = pendingNotification.data?.url as string

      // Validate URL before navigation to prevent errors
      navigate(url, {
        passProps: pendingNotification.data,
        ignoreDebounce: true,
      })

      // Reset the notification payload after navigation attempt
      setPendingNotification(null)
    }
  }, [isLoggedIn, isNavigationReady, pendingNotification])
}
