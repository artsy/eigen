import notifee from "@notifee/react-native"
import { GlobalStore } from "app/store/GlobalStore"
import { useEffect, useState } from "react"
import { Platform } from "react-native"
import { handlePendingNotification, handleReceivedNotification } from "./PushNotification"

export function useInitialNotification() {
  const [hasHandledInitialNotification, setHasHandledInitialNotification] = useState(false)

  const isLoggedIn = GlobalStore.useAppState((state) => !!state.auth.userAccessToken)
  const isNavigationReady = GlobalStore.useAppState((state) => state.sessionState.isNavigationReady)

  const pendingNotification = GlobalStore.useAppState(
    (state) => state.pendingPushNotification.notification
  )

  useEffect(() => {
    if (
      isLoggedIn &&
      isNavigationReady &&
      !hasHandledInitialNotification &&
      Platform.OS === "android"
    ) {
      // initial notification is most recent and should be prioritised
      // POTENTIAL ISSUE: This duplicates the getInitialNotification() call in configure()
      // Could lead to race conditions or handling the same notification twice :shrug:
      notifee
        .getInitialNotification()
        .then((initialNotification) => {
          if (initialNotification?.notification) {
            const notification = {
              data: initialNotification.notification.data || {},
              userInteraction: true,
              foreground: false,
              message:
                initialNotification.notification.title || initialNotification.notification.body,
            }
            handleReceivedNotification(notification)
            // prevent loop where user logs out and logs back in and previously
            // handled initial push notification is rehandled
            setHasHandledInitialNotification(true)
            return
          }
          handlePendingNotification(pendingNotification)
        })
        .catch((error) => {
          if (__DEV__) {
            console.warn("Error getting initial notification:", error)
          }
          handlePendingNotification(pendingNotification)
        })
      return
    }
    handlePendingNotification(pendingNotification)
  }, [hasHandledInitialNotification, isLoggedIn, isNavigationReady, pendingNotification])
}
