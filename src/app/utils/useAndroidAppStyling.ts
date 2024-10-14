import { ArtsyNativeModule } from "app/NativeModules/ArtsyNativeModule"
import { GlobalStore } from "app/store/GlobalStore"
import { useEffect } from "react"
import { Platform, StatusBar } from "react-native"

export const useAndroidAppStyling = () => {
  const isHydrated = GlobalStore.useAppState((state) => state.sessionState.isHydrated)
  const isLoggedIn = GlobalStore.useAppState((state) => state.auth.userAccessToken)
  useEffect(() => {
    if (isHydrated) {
      // We wait a bit until the UI finishes drawing behind the splash screen
      setTimeout(() => {
        if (Platform.OS === "android") {
          ArtsyNativeModule.setAppStyling()
        }

        if (isLoggedIn && Platform.OS === "android") {
          ArtsyNativeModule.setAppStyling()
          StatusBar.setBarStyle("dark-content")
        }
      }, 500)
    }
  }, [isHydrated, isLoggedIn])
}
