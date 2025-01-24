import {
  ArtsyNativeModule,
  DEFAULT_NAVIGATION_BAR_COLOR,
} from "app/NativeModules/ArtsyNativeModule"
import { GlobalStore } from "app/store/GlobalStore"
import { useEffect } from "react"
import { Platform } from "react-native"

export const useAndroidAppStyling = () => {
  const isHydrated = GlobalStore.useAppState((state) => state.sessionState.isHydrated)
  const isLoggedIn = GlobalStore.useAppState((state) => state.auth.userAccessToken)
  const theme = GlobalStore.useAppState((state) => state.devicePrefs.colorScheme)

  useEffect(() => {
    if (isHydrated) {
      // We wait a bit until the UI finishes drawing behind the splash screen
      setTimeout(() => {
        if (Platform.OS === "android") {
          ArtsyNativeModule.setAppStyling()
        }

        if (isLoggedIn && Platform.OS === "android") {
          if (theme === "dark") {
            ArtsyNativeModule.setNavigationBarColor("#000000")
            ArtsyNativeModule.setAppLightContrast(true)
          } else {
            ArtsyNativeModule.setNavigationBarColor(DEFAULT_NAVIGATION_BAR_COLOR)
            ArtsyNativeModule.setAppLightContrast(false)
          }
        }
      }, 500)
    }
  }, [isHydrated, isLoggedIn])
}
