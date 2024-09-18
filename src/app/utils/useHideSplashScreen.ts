import { GlobalStore } from "app/store/GlobalStore"
import { useEffect } from "react"
import RNBootSplash from "react-native-bootsplash"

export const useHideSplashScreen = () => {
  const isNavigationReady = GlobalStore.useAppState((state) => state.sessionState.isNavigationReady)
  const isHydrated = GlobalStore.useAppState((state) => state.sessionState.isHydrated)
  const isLoggedIn = GlobalStore.useAppState((state) => state.auth.userAccessToken)

  useEffect(() => {
    const hideSplashScreen = async () => {
      await RNBootSplash.hide({ fade: true })
    }

    if (isHydrated) {
      if (isLoggedIn && isNavigationReady) {
        hideSplashScreen()
        return
      }
      if (!isLoggedIn) {
        hideSplashScreen()
      }
    }
    hideSplashScreen()
  }, [isHydrated, isLoggedIn, isNavigationReady])
}
