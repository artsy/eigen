import { THEMES } from "@artsy/palette-mobile"
import { GlobalStore } from "app/store/GlobalStore"
import * as NavigationBar from "expo-navigation-bar"
import * as StatusBar from "expo-status-bar"
import { useEffect } from "react"
import { Platform } from "react-native"

export const useAndroidAppStyling = () => {
  const isHydrated = GlobalStore.useAppState((state) => state.sessionState.isHydrated)
  const isLoggedIn = GlobalStore.useAppState((state) => state.auth.userAccessToken)
  const theme = GlobalStore.useAppState((state) => state.devicePrefs.colorScheme)

  useEffect(() => {
    if (isHydrated) {
      // We wait a bit until the UI finishes drawing behind the splash screen
      if (Platform.OS === "android") {
        // this is required for edge to edge content
        NavigationBar.setPositionAsync("absolute")
      }

      if (isLoggedIn) {
        setAppStyling(theme)
      }
    }
    // We intentionally don't want to re-run this effect when the theme changes because we handle that separately
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isHydrated, isLoggedIn])
}

export const setAppStyling = (theme: "dark" | "light") => {
  if (Platform.OS === "android") {
    NavigationBar.setPositionAsync("absolute")
  }

  if (theme === "dark") {
    setDarkTheme()
  } else {
    setLightTheme()
  }
}

const setDarkTheme = () => {
  StatusBar.setStatusBarBackgroundColor(THEMES.v3dark.colors.mono0, true)
  StatusBar.setStatusBarStyle("light", true)
  NavigationBar.setBackgroundColorAsync(`${THEMES.v3dark.colors.mono0}00`)
}

const setLightTheme = () => {
  StatusBar.setStatusBarBackgroundColor(THEMES.v3light.colors.mono0, true)
  StatusBar.setStatusBarStyle("dark", true)
  NavigationBar.setBackgroundColorAsync(`${THEMES.v3light.colors.mono0}00`)
}
