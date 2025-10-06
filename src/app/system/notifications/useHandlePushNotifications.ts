import { GlobalStore } from "app/store/GlobalStore"
// eslint-disable-next-line no-restricted-imports
import { navigate, navigationEvents } from "app/system/navigation/navigate"
import { PushNotification } from "app/system/notifications/usePushNotifications"
import { AnalyticsConstants } from "app/utils/track/constants"
import { useEffect } from "react"
import { useTracking } from "react-tracking"

/**
 * This hook is used to handle remote messages and display them
 */
export const useHandlePushNotifications = ({
  pushNotification,
  setPushNotification,
}: {
  pushNotification: PushNotification | null
  setPushNotification: (pushNotification: PushNotification | null) => void
}) => {
  const isLoggedIn = GlobalStore.useAppState((state) => !!state.auth.userAccessToken)
  const isNavigationReady = GlobalStore.useAppState((state) => state.sessionState.isNavigationReady)
  const { trackEvent } = useTracking()

  // Navigate to the notification URL if the user is logged in
  useEffect(() => {
    if (isLoggedIn && isNavigationReady && pushNotification) {
      navigationEvents.emit("requestModalDismiss")
      const url = pushNotification.data?.url as string

      trackEvent({
        event_name: AnalyticsConstants.NotificationTapped.key,
        label: pushNotification.label || pushNotification.data?.label,
        url: pushNotification.url || pushNotification.data?.url,
        message: pushNotification.message,
        ...pushNotification.data,
      })

      // Validate URL before navigation to prevent errors
      if (url) {
        navigate(url, {
          passProps: pushNotification.data,
          ignoreDebounce: true,
        })
      }

      // Reset the notification payload after navigation attempt
      setPushNotification(null)
    }
  }, [isLoggedIn, isNavigationReady, pushNotification])
}
