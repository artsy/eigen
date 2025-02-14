import { THEMES } from "@artsy/palette-mobile"
import { DarkTheme, DefaultTheme } from "@react-navigation/native"
import { GlobalStore } from "app/store/GlobalStore"

export const useNavigationTheme = () => {
  const theme = GlobalStore.useAppState((state) => state.devicePrefs.colorScheme)

  return theme === "dark" ? DefaultDarkTheme : DefaultLightTheme
}

export const DefaultLightTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    background: "#FFF",
  },
}

export const DefaultDarkTheme = {
  ...DarkTheme,
  colors: {
    ...DarkTheme.colors,
    background: THEMES.v3dark.colors.background,
  },
}
