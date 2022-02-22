import { GlobalStore } from "app/store/GlobalStore"
import { useEffect, useState } from "react"
import PushNotification from "react-native-push-notification"
import { handlePendingNotification, handleReceivedNotification } from "./PushNotification"

export function useInitialNotification() {
  const [hasHandledInitialNotification, setHasHandledInitialNotification] = useState(false)

  const isLoggedIn = GlobalStore.useAppState((state) => !!state.auth.userAccessToken)

  const pendingNotification = GlobalStore.useAppState(
    (state) => state.pendingPushNotification.notification
  )

  useEffect(() => {
    if (isLoggedIn && !hasHandledInitialNotification) {
      // initial notification is most recent and should be prioritised
      PushNotification.popInitialNotification((notification) => {
        if (notification) {
          handleReceivedNotification(notification)
          // prevent loop where user logs out and logs back in and previously
          // handled initial push notification is rehandled
          setHasHandledInitialNotification(true)
          return
        }
        handlePendingNotification(pendingNotification)
      })
      return
    }
    handlePendingNotification(pendingNotification)
  }, [isLoggedIn])
}
