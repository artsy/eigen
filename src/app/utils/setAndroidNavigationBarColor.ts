import * as NavigationBar from "expo-navigation-bar"

/**
 * Since Expo SDK 56 (edge-to-edge) the system owns the navigation bar background, so only the
 * button color can change.
 *
 * `setStyle` takes the button color, although expo's type docs say it takes the bar color. The
 * native module maps "dark" to dark buttons.
 */
export const setAndroidNavigationBarColor = (theme: "light" | "dark") => {
  switch (theme) {
    case "dark":
      NavigationBar.setStyle("light")
      break
    case "light":
      NavigationBar.setStyle("dark")
      break

    default:
      if (__DEV__) {
        throw new Error("Theme needs to be light or dark")
      }

      break
  }
}
