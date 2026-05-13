import {
  DEFAULT_NAVIGATION_BAR_COLOR,
  DEFAULT_NAVIGATION_BAR_DARK_COLOR,
} from "app/Components/constants"
import * as NavigationBar from "expo-navigation-bar"

export const setAndroidNavigationBarColor = (theme: "light" | "dark") => {
  switch (theme) {
    case "dark":
      NavigationBar.setBackgroundColorAsync(DEFAULT_NAVIGATION_BAR_DARK_COLOR)
      break
    case "light":
      NavigationBar.setBackgroundColorAsync(DEFAULT_NAVIGATION_BAR_COLOR)
      break

    default:
      if (__DEV__) {
        throw new Error("Theme needs to be light or dark")
      }

      break
  }
}
