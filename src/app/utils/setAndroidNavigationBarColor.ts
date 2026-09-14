import * as NavigationBar from "expo-navigation-bar"

/**
 * Sets the appearance of the Android system navigation bar.
 *
 * Since Expo SDK 56 (edge-to-edge), the navigation bar background color can no longer be set:
 * the system owns the background and the app draws behind it. We can only control the content
 * (button/icon) style, where "light" means a light bar with dark content and "dark" means a dark
 * bar with light content — matching the backgrounds we used to set explicitly.
 */
export const setAndroidNavigationBarColor = (theme: "light" | "dark") => {
  switch (theme) {
    case "dark":
      NavigationBar.setStyle("dark")
      break
    case "light":
      NavigationBar.setStyle("light")
      break

    default:
      if (__DEV__) {
        throw new Error("Theme needs to be light or dark")
      }

      break
  }
}
