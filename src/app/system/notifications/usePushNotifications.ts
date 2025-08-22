import notifee, { Event, EventType, Notification } from "@notifee/react-native"
import { GlobalStore } from "app/store/GlobalStore"
// eslint-disable-next-line no-restricted-imports
import { navigate, navigationEvents } from "app/system/navigation/navigate"
import { logNotification } from "app/utils/loggers"
import { AnalyticsConstants } from "app/utils/track/constants"
import { useCallback, useEffect } from "react"
import { useTracking } from "react-tracking"
import { createAndroidNotificationChannels } from "./createAndroidNotificationChannels"

export const usePushNotifications = () => {
  const isLoggedIn = GlobalStore.useAppState((state) => !!state.auth.userAccessToken)
  const isNavigationReady = GlobalStore.useAppState((state) => state.sessionState.isNavigationReady)
  const { trackEvent } = useTracking()

  useEffect(() => {
    // Create channels on app start - only on android
    createAndroidNotificationChannels()
  }, [])

  const handleNotification = useCallback(
    (notification: Notification) => {
      trackEvent({
        event_name: AnalyticsConstants.NotificationTapped.key,
        label: notification.data?.label,
        url: notification.data?.url,
        message: notification.body?.toString(),
      })

      const url = notification.data?.url as string | undefined

      if (isLoggedIn && url) {
        navigationEvents.emit("requestModalDismiss")
        navigate(url, {
          passProps: notification.data,
          ignoreDebounce: true,
        })
        // clear any pending notification
        GlobalStore.actions.pendingPushNotification.setPendingPushNotification(null)
        return
      }
    },
    [isLoggedIn, trackEvent]
  )

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const handleEvent = (event: Event) => {
    if (!event.detail.notification) {
      return
    }

    if (__DEV__ && logNotification) {
      console.log("NOTIFICATION:", event.detail.notification)
    }

    if (event.type === EventType.PRESS) {
      handleNotification(event.detail.notification)
    }
  }

  // Subscribe to events
  useEffect(() => {
    const unsubscribeFromForegroundEvent = notifee.onForegroundEvent((event) => {
      handleEvent(event)
    })

    notifee.onBackgroundEvent(async (event) => {
      handleEvent(event)
    })

    return () => {
      unsubscribeFromForegroundEvent()
    }
  }, [handleEvent])

  useEffect(() => {
    if (!isNavigationReady) {
      notifee.getInitialNotification().then((initialNotification) => {
        if (initialNotification) {
          handleNotification(initialNotification.notification)
        }
      })

      return
    }
  }, [isNavigationReady, handleNotification])
}
