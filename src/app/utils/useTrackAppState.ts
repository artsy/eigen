import { GlobalStore } from "app/store/GlobalStore"
import useAppState from "app/utils/useAppState"
import { useTracking } from "react-tracking"

/**
 * This hook is used to track the app state and send it to analytics
 */
export const useTrackAppState = () => {
  const isHydrated = GlobalStore.useAppState((state) => state.sessionState.isHydrated)
  const isUserIdentified = GlobalStore.useAppState(
    (state) => state.auth.sessionState.isUserIdentified
  )
  const isLoggedIn = !!GlobalStore.useAppState((state) => state.auth.userAccessToken)
  const { trackEvent } = useTracking()

  useAppState({
    onForeground: () => {
      if (!isHydrated || !isUserIdentified || !isLoggedIn) {
        return
      }
      trackEvent({
        action: "APP_IN_FOREGROUND",
      })
    },
    onBackground: () => {
      if (!isHydrated || !isUserIdentified || !isLoggedIn) {
        return
      }
      trackEvent({
        action: "APP_IN_BACKGROUND",
      })
    },
  })
}
