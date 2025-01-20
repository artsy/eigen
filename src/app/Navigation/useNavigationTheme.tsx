import { THEME_DARK } from "@artsy/palette-tokens/dist/themes/v3Dark"
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
    background: THEME_DARK.colors.white100,
  },
}
