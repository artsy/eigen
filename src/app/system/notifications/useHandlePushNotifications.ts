import notifee, { Event, EventType, Notification } from "@notifee/react-native"
import { listenToNativeEvents } from "app/NativeModules/utils/listenToNativeEvents"
import { GlobalStore } from "app/store/GlobalStore"
// eslint-disable-next-line no-restricted-imports
import { navigate, navigationEvents } from "app/system/navigation/navigate"
import { logNotification } from "app/utils/loggers"
import { AnalyticsConstants } from "app/utils/track/constants"
import { useCallback, useEffect, useRef } from "react"
import { EmitterSubscription, Platform } from "react-native"
import { useTracking } from "react-tracking"

/**
 * This hook is used to handle remote messages and display them
 */
export const useHandlePushNotifications = () => {
  const isLoggedIn = GlobalStore.useAppState((state) => !!state.auth.userAccessToken)
  const isNavigationReady = GlobalStore.useAppState((state) => state.sessionState.isNavigationReady)
  const { trackEvent } = useTracking()
  const iosListenerRef = useRef<EmitterSubscription | null>(null)
  const notificationPayload = useRef<Notification | null>(null)

  const handleNotification = useCallback(
    (notification: Notification) => {
      trackEvent({
        event_name: AnalyticsConstants.NotificationTapped.key,
        label: notification.data?.label,
        url: notification.data?.url,
        message: notification.body?.toString(),
      })

      notificationPayload.current = notification
    },
    [trackEvent]
  )

  // Subscribe to iOS native notification taps
  useEffect(() => {
    if (Platform.OS === "ios" && isNavigationReady) {
      iosListenerRef.current = listenToNativeEvents((event) => {
        if (
          event.type === "NOTIFICATION_RECEIVED" &&
          event.payload?.NotificationAction === "Tapped"
        ) {
          console.log("DEBUG: iOS notification tapped", event.payload)

          // Create a Notification object from the iOS payload
          const notification: Notification = {
            title: event.payload?.aps?.alert?.title || event.payload?.title,
            body: event.payload?.aps?.alert?.body || event.payload?.body,
            data: event.payload,
          }

          handleNotification(notification)
        }
      })

      return () => {
        iosListenerRef.current?.remove?.()
      }
    }
  }, [handleNotification, isLoggedIn, isNavigationReady])

  // Subscribe to Notifee events (mainly for Android)
  useEffect(() => {
    const handleAndroidEvent = (event: Event) => {
      if (!event.detail.notification) {
        return
      }

      if (__DEV__ && logNotification) {
        console.log("[DEBUG] NOTIFICATION:", event.detail.notification)
      }

      switch (event.type) {
        case EventType.PRESS:
          handleNotification(event.detail.notification)
          break
        case EventType.DELIVERED:
          // Don't navigate on delivery - only log or track if needed
          if (__DEV__ && logNotification) {
            console.log("[DEBUG] NOTIFICATION DELIVERED: ", event.detail.notification)
          }
          break
      }
    }

    const unsubscribeFromForegroundEvent = notifee.onForegroundEvent((event) => {
      handleAndroidEvent(event)
    })

    notifee.onBackgroundEvent(async (event) => {
      handleAndroidEvent(event)
    })

    return () => {
      unsubscribeFromForegroundEvent()
    }
  }, [handleNotification])

  useEffect(() => {
    if (isNavigationReady) {
      notifee.getInitialNotification().then((initialNotification) => {
        if (initialNotification) {
          handleNotification(initialNotification.notification)
        }
      })

      return
    }
  }, [isNavigationReady, handleNotification])

  // Navigate to the notification URL if the user is logged in
  useEffect(() => {
    if (isLoggedIn && notificationPayload.current) {
      navigationEvents.emit("requestModalDismiss")

      const url = notificationPayload.current.data?.url as string

      navigate(url, {
        passProps: notificationPayload.current.data,
        ignoreDebounce: true,
      })

      // Reset the notification payload after navigation
      notificationPayload.current = null
    }
  }, [isLoggedIn])
}
