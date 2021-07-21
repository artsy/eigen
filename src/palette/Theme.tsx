import { THEME_V2, THEME_V3 } from "@artsy/palette-tokens"
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
export { SansSize, SerifSize, TypeSizes } from "@artsy/palette-tokens/dist/themes/v2"

import { Color as ColorV2, SpacingUnit as SpacingUnitV2 } from "@artsy/palette-tokens/dist/themes/v2"
import { Color as ColorV3, SpacingUnit as SpacingUnitV3Numbers } from "@artsy/palette-tokens/dist/themes/v3"

type SpacingUnitV3 = `${SpacingUnitV3Numbers}`
type Color = ColorV2 | ColorV3
type SpacingUnit = SpacingUnitV2 | SpacingUnitV3
export { ColorV2, ColorV3, SpacingUnitV2, SpacingUnitV3, Color, SpacingUnit }

const {
  breakpoints: _eigenDoesntCareAboutBreakpoints,
  mediaQueries: _eigenDoesntCareAboutMediaQueries,
  grid: _eigenDoesntCareAboutGrid,
  space: spaceNumbers,
  ...eigenUsefulTHEME_V3
} = THEME_V3

const fixSpaceUnits = (
  units: typeof spaceNumbers
): {
  "0.5": number
  "1": number
  "2": number
  "4": number
  "6": number
  "12": number
} => {
  let fixed = units

  fixed = _.mapKeys(fixed, (_value, numberKey) => `${numberKey}`) as any

  fixed = _.mapValues(fixed, (stringValueWithPx) => {
    const justStringValue = _.split(stringValueWithPx, "px")[0]
    const numberValue = parseInt(justStringValue, 10)
    return numberValue
  }) as any

  return fixed as any
}

export const THEMES = {
  v2: { ...THEME_V2, fontFamily, fonts: TEXT_FONTS_V2 },
  v3: {
    ...eigenUsefulTHEME_V3,
    fonts: TEXT_FONTS_V3,
    space: fixSpaceUnits(spaceNumbers),
  }, // v3 removed `fontFamily`, `fontSizes`, `letterSpacings`, `lineHeights`, `typeSizes`
}

type ThemeV2Type = typeof THEMES.v2
type ThemeV3Type = typeof THEMES.v3
type ThemeType = ThemeV2Type | ThemeV3Type

// stop using this!! use any of the hooks in this file instead.
export const themeProps = THEMES.v2

export const Theme: React.FC<{
  theme?: keyof typeof THEMES | ThemeType
  override?: DeepPartial<ThemeV2Type> | DeepPartial<ThemeV3Type>
}> = ({ children, theme: themeNameOrThemeObj = "v2", override = {} }) => {
  const theme = _.isString(themeNameOrThemeObj) ? THEMES[themeNameOrThemeObj] : themeNameOrThemeObj

  return <ThemeProvider theme={{ ...theme, ...override }}>{children}</ThemeProvider>
}

export const ThemeV2: React.FC = ({ children }) => <ThemeProvider theme="v2">{children}</ThemeProvider>
export const ThemeV3: React.FC = ({ children }) => <ThemeProvider theme="v3">{children}</ThemeProvider>

export const useTheme = <T extends ThemeType>() => {
  const theme: T = useContext(ThemeContext)
  const color = (colorName: ColorV2 | ColorV3) =>
    isThemeV2(theme) ? theme.colors[colorName as ColorV2] : theme.colors[colorName as ColorV3]
  const space = (spaceName: SpacingUnitV2 | SpacingUnitV3) =>
    isThemeV2(theme) ? theme.space[spaceName as SpacingUnitV2] : theme.space[spaceName as SpacingUnitV3]
  return { theme, color, space }
}

export const useColor = () => useTheme().color
export const useSpace = () => useTheme().space

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
