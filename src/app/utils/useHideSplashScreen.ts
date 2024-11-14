import { ArtsyNativeModule } from "app/NativeModules/ArtsyNativeModule"
import { homeViewScreenQueryVariables } from "app/Scenes/HomeView/HomeView"
import { GlobalStore } from "app/store/GlobalStore"
import { useFeatureFlag } from "app/utils/hooks/useFeatureFlag"
import { usePrefetch } from "app/utils/queryPrefetching"
import { useEffect } from "react"
import { Linking } from "react-native"
import RNBootSplash from "react-native-bootsplash"

const HOME_VIEW_SPLASH_SCREEN_DELAY = 500

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
      if (shouldDisplayNewHomeView) {
        if (isLoggedIn && isNavigationReady) {
          if (shouldDisplayNewHomeView) {
            Linking.getInitialURL().then((url) => {
              const isDeepLink = !!url
              if (!isDeepLink) {
                prefetchUrl("/", homeViewScreenQueryVariables(), {
                  force: false,
                })
              }
              setTimeout(() => {
                hideSplashScreen()
              }, HOME_VIEW_SPLASH_SCREEN_DELAY)
            })
          }
          return
        }
        if (!isLoggedIn) {
          hideSplashScreen()
        }
      } else {
        hideSplashScreen()
      }
    }
  }, [isHydrated, isLoggedIn, isNavigationReady])
}
