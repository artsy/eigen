import { useEffect } from "react"
import { ColorSchemeName, useColorScheme } from "react-native"
import { postEventToProviders } from "./track/providers"

// the purpose of this hook is to track the preferred theme of a user
export const usePreferredThemeTracking = () => {
  const colorScheme = useColorScheme()
  useEffect(() => {
    postEventToProviders(tracks.getUserPreferredTheme(colorScheme))
  }, [])
}

export const tracks = {
  getUserPreferredTheme: (preferredTheme: ColorSchemeName) => ({
    name: "user_preferred_theme",
    user_interface_style: preferredTheme,
  }),
}
