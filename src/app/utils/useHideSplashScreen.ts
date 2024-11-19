import { homeViewScreenQueryVariables } from "app/Scenes/HomeView/HomeView"
import { GlobalStore } from "app/store/GlobalStore"
import { usePrefetch } from "app/utils/queryPrefetching"
import { useEffect } from "react"
import RNBootSplash from "react-native-bootsplash"

const HOME_VIEW_SPLASH_SCREEN_DELAY = 500

export const useHideSplashScreen = () => {
  const isNavigationReady = GlobalStore.useAppState((state) => state.sessionState.isNavigationReady)
  const isHydrated = GlobalStore.useAppState((state) => state.sessionState.isHydrated)
  const isLoggedIn = GlobalStore.useAppState((state) => state.auth.userAccessToken)

  const prefetchUrl = usePrefetch()

  useEffect(() => {
    const hideSplashScreen = async () => {
      await RNBootSplash.hide({ fade: true })
    }

    if (isHydrated) {
      if (isLoggedIn && isNavigationReady) {
        prefetchUrl("/", homeViewScreenQueryVariables(), {
          force: false,
        })

        setTimeout(() => {
          hideSplashScreen()
        }, HOME_VIEW_SPLASH_SCREEN_DELAY)

        return
      }

      if (!isLoggedIn) {
        hideSplashScreen()
      }
    }
  }, [isHydrated, isLoggedIn, isNavigationReady])
}
