import {
  Theme as ThemeType,
  THEME_V2,
  THEME_V3,
  ThemeV2 as ThemeV2Type,
  ThemeV3 as ThemeV3Type,
} from "@artsy/palette-tokens"
import { breakpoints, themeProps as tokens } from "@artsy/palette-tokens/dist/themes/v2"
import _ from "lodash"
import React, { useContext } from "react"
import { ThemeContext, ThemeProvider } from "styled-components/native"
import { TEXT_FONTS_V2, TEXT_FONTS_V3 } from "./elements/Text/tokens"
import { fontFamily } from "./platform/fonts/fontFamily"

/**
 * All of the config for the Artsy theming system, based on the
 * design system from our design team:
 * https://www.notion.so/artsy/Master-Library-810612339f474d0997fe359af4285c56
 */
export { space, color } from "@artsy/palette-tokens/dist/helpers"
export { Color, SansSize, SpacingUnit, SerifSize, TypeSizes } from "@artsy/palette-tokens/dist/themes/v2"
export { Color as ColorV3 } from "@artsy/palette-tokens/dist/themes/v3"

const {
  breakpoints: _eigenDoesntCareAboutBreakpoints,
  mediaQueries: _eigenDoesntCareAboutMediaQueries,
  grid: _eigenDoesntCareAboutGrid,
  ...eigenUsefulTHEME_V3
} = THEME_V3

const THEMES = {
  v2: { ...THEME_V2, fontFamily, fonts: TEXT_FONTS_V2 },
  v3: { ...eigenUsefulTHEME_V3, fonts: TEXT_FONTS_V3 }, // v3 removed `fontFamily`, `fontSizes`, `letterSpacings`, `lineHeights`, `typeSizes`
}

// stop using this!! use the hook instead.
export const themeProps = THEMES.v2

// /**
//  * A wrapper component for passing down the Artsy theme context
//  */
export const Theme: React.FC<{ theme?: keyof typeof THEMES | ThemeType; override?: Partial<ThemeType> }> = ({
  children,
  theme: themeNameOrThemeObj = "v2",
  override = {},
}) => {
  const theme = _.isString(themeNameOrThemeObj) ? THEMES[themeNameOrThemeObj] : themeNameOrThemeObj

  return <ThemeProvider theme={{ ...theme, ...override }}>{children}</ThemeProvider>
}

export const ThemeV2: React.FC = ({ children }) => <ThemeProvider theme="v2">{children}</ThemeProvider>
export const ThemeV3: React.FC = ({ children }) => <ThemeProvider theme="v3">{children}</ThemeProvider>

/** Returns the current theme */
export const useTheme = <T extends ThemeType>() => {
  const theme: T = useContext(ThemeContext)
  return { theme }
}

/** Returns a config specific to the current theme. For use in React components */
export const useThemeConfig = <T, U>({ v2, v3 }: { v2: T; v3: U }): U | T => {
  const { theme = { id: "v2" } } = useTheme()
  return theme.id === "v2" ? v2 : v3
}

/** Returns a config specific to the current theme. For use in styled-components */
export const getThemeConfig = <T, U>(props: Record<string, any>, { v2, v3 }: { v2: T; v3: U }): U | T => {
  const { theme = { id: "v2" } } = props
  return theme.id === "v2" ? v2 : v3
}

export const isThemeV2 = (theme: ThemeType): theme is ThemeV2Type => theme.id === "v2"
export const isThemeV3 = (theme: ThemeType): theme is ThemeV3Type => theme.id === "v3"
