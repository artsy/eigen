import { ArtsyNativeModule } from "app/NativeModules/ArtsyNativeModule"
import { homeViewScreenQueryVariables } from "app/Scenes/HomeView/HomeView"
import { GlobalStore } from "app/store/GlobalStore"
import { useFeatureFlag } from "app/utils/hooks/useFeatureFlag"
import { usePrefetch } from "app/utils/queryPrefetching"
import { useEffect } from "react"
import RNBootSplash from "react-native-bootsplash"

export const useHideSplashScreen = () => {
  const isNavigationReady = GlobalStore.useAppState((state) => state.sessionState.isNavigationReady)
  const isHydrated = GlobalStore.useAppState((state) => state.sessionState.isHydrated)
  const isLoggedIn = GlobalStore.useAppState((state) => state.auth.userAccessToken)

  const prefetchUrl = usePrefetch()

  const preferLegacyHomeScreen = useFeatureFlag("ARPreferLegacyHomeScreen")

  const shouldDisplayNewHomeView = ArtsyNativeModule.isBetaOrDev && !preferLegacyHomeScreen

  useEffect(() => {
    const hideSplashScreen = async () => {
      await RNBootSplash.hide({ fade: true })
    }

    if (isHydrated) {
      if (isLoggedIn && isNavigationReady) {
        if (shouldDisplayNewHomeView) {
          prefetchUrl("/", homeViewScreenQueryVariables())
            ?.then(() => {
              hideSplashScreen()
            })
            .catch((error) => {
              console.error("Failed to prefetch home view", error)
              hideSplashScreen()
            })
        }
        return
      }
      if (!isLoggedIn) {
        hideSplashScreen()
      }
    }
    hideSplashScreen()
  }, [isHydrated, isLoggedIn, isNavigationReady])
}
