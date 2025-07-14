import { useFlagsStatus } from "@unleash/proxy-client-react"
import { homeViewScreenQueryVariables } from "app/Scenes/HomeView/HomeView"
import { GlobalStore } from "app/store/GlobalStore"
import { usePrefetch } from "app/utils/queryPrefetching"
import { useEffect } from "react"
import { Linking } from "react-native"
import RNBootSplash from "react-native-bootsplash"

const HOME_VIEW_SPLASH_SCREEN_DELAY = 1200

export const useHideSplashScreen = () => {
  const { flagsReady: unleashFlagsReady, flagsError: unleashError } = useFlagsStatus()
  const isUnleashReady = unleashFlagsReady || unleashError
  const isNavigationReady = GlobalStore.useAppState((state) => state.sessionState.isNavigationReady)
  const isHydrated = GlobalStore.useAppState((state) => state.sessionState.isHydrated)
  const isLoggedIn = GlobalStore.useAppState((state) => state.auth.userAccessToken)
  const { setSessionState } = GlobalStore.actions

  const prefetchUrl = usePrefetch()

  useEffect(() => {
    const hideSplashScreen = async () => {
      setSessionState({ isSplashScreenVisible: false })
      await RNBootSplash.hide({ fade: true })
    }

    // Early return if basic requirements aren't met
    if (!isHydrated || !isNavigationReady) {
      return
    }

    // Handle logged-out users - hide splash immediately
    if (!isLoggedIn) {
      hideSplashScreen()
      return
    }

    // Handle logged-in users - wait for unleash flags and add delay
    if (!isUnleashReady) {
      return
    }

    let timeoutId: NodeJS.Timeout | undefined

    const handleLoggedInUser = async () => {
      const url = await Linking.getInitialURL()
      const isDeepLink = !!url

      if (!isDeepLink) {
        prefetchUrl("/", homeViewScreenQueryVariables())
      }

      timeoutId = setTimeout(() => {
        hideSplashScreen()
      }, HOME_VIEW_SPLASH_SCREEN_DELAY)
    }

    handleLoggedInUser()

    // Cleanup timeout on unmount or dependency change
    return () => {
      if (timeoutId) {
        clearTimeout(timeoutId)
      }
    }
  }, [isHydrated, isLoggedIn, isNavigationReady, isUnleashReady])
}
