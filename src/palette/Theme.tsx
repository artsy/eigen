import { THEME_V2, THEME_V3 } from "@artsy/palette-tokens"
import _ from "lodash"
import React, { useContext } from "react"
import { ThemeContext, ThemeProvider } from "styled-components/native"
import { TEXT_FONTS_V2, TEXT_FONTS_V3 } from "./elements/Text/tokens"
import { usePaletteFlagStore } from "./PaletteFlag"
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
export type Color = ColorV2 | ColorV3
export type SpacingUnit = SpacingUnitV2 | SpacingUnitV3
export { ColorV2, ColorV3, SpacingUnitV2, SpacingUnitV3 }

const {
  breakpoints: _eigenDoesntCareAboutBreakpoints,
  mediaQueries: _eigenDoesntCareAboutMediaQueries,
  grid: _eigenDoesntCareAboutGrid,
  space: spaceNumbers,
  ...eigenUsefulTHEME_V3
} = THEME_V3

// this function is converting the space values that come from palette-tokens
// from a string `"120px"` to a number `120`.
const fixSpaceUnitsV2 = (
  units: typeof THEME_V2.space
): {
  0.3: number
  0.5: number
  1: number
  1.5: number
  2: number
  3: number
  4: number
  5: number
  6: number
  9: number
  12: number
  18: number
} => {
  let fixed = units

  fixed = _.mapValues(fixed, (stringValueWithPx) => {
    const justStringValue = _.split(stringValueWithPx, "px")[0]
    const numberValue = parseInt(justStringValue, 10)
    return numberValue
  }) as any

  return fixed as any
}

// this function is converting the space values that come from palette-tokens
// from a string `"120px"` to a number `120`, and the key values
// from a number `0.5` to a string `"0.5"`.
const fixSpaceUnitsV3 = (
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

const THEMES = {
  v2: { ...THEME_V2, fontFamily, fonts: TEXT_FONTS_V2, space: fixSpaceUnitsV2(THEME_V2.space) },
  v3: {
    ...eigenUsefulTHEME_V3,
    fonts: TEXT_FONTS_V3,
    space: fixSpaceUnitsV3(spaceNumbers),
  }, // v3 removed `fontFamily`, `fontSizes`, `letterSpacings`, `lineHeights`, `typeSizes`
}

type ThemeV2Type = typeof THEMES.v2
type ThemeV3Type = typeof THEMES.v3
type ThemeType = ThemeV2Type | ThemeV3Type

/**
 * Do not use this!! Use any the hooks instead!
 */
export const themeProps = THEMES.v2

export const Theme: React.FC<{
  theme?: keyof typeof THEMES | ThemeType
  override?: DeepPartial<ThemeV2Type> | DeepPartial<ThemeV3Type>
}> = ({ children, theme = "v2", override = {} }) => {
  const allowV3 = usePaletteFlagStore((state) => state.allowV3)

  let actualTheme: ThemeType
  if (_.isString(theme)) {
    if (allowV3) {
      actualTheme = THEMES[theme]
    } else {
      actualTheme = THEMES.v2
    }
  } else {
    actualTheme = theme
  }

  return <ThemeProvider theme={{ ...actualTheme, ...override }}>{children}</ThemeProvider>
}

export const ThemeV2: React.FC = ({ children }) => <Theme theme="v2">{children}</Theme>
export const ThemeV3: React.FC = ({ children }) => <Theme theme="v3">{children}</Theme>

export interface ColorFuncOverload {
  (colorNumber: undefined): undefined
  (colorNumber: Color): string
  (colorNumber: Color | undefined): string | undefined
}
const color = (theme: ThemeType): ColorFuncOverload => (colorName: any): any =>
  colorName === undefined
    ? undefined
    : isThemeV2(theme)
    ? theme.colors[colorName as ColorV2]
    : //  @ts-ignore
      theme.colors[colorName as ColorV3]

const space = (theme: ThemeType) => (spaceName: SpacingUnitV2 | SpacingUnitV3): number =>
  isThemeV2(theme)
    ? ((theme.space[spaceName as SpacingUnitV2] as unknown) as number)
    : theme.space[spaceName as SpacingUnitV3]

export const useTheme = () => {
  const theme: ThemeType = useContext(ThemeContext)

  // if we are not wrapped in `<Theme>`, if we dev, throw error. if we are in prod, just default to v2 to avoid a crash.
  if (theme === undefined) {
    if (__DEV__ || __TEST__) {
      console.error(
        "You are trying to use the `Theme` but you have not wrapped your component/screen with `<Theme>`. Please wrap and try again."
      )
      throw new Error("ThemeContext is not defined. Wrap your component with `<Theme>` and try again.")
    } else {
      return { theme: THEMES.v2, color: color(THEMES.v2), space: space(THEMES.v2) }
    }
  }

  // if we are wrapped, then all good.
  return { theme, color: color(theme), space: space(theme) }
}

export const isThemeV2 = (theme: ThemeType): theme is ThemeV2Type => theme.id === "v2"
export const isThemeV3 = (theme: ThemeType): theme is ThemeV3Type => theme.id === "v3"

/**
 * Only use this if it's are absolutely neccessary.
 */
// tslint:disable-next-line:variable-name
export const _test_colorV2 = color(THEMES.v2)
/**
 * Only use this if it's are absolutely neccessary.
 */
// tslint:disable-next-line:variable-name
export const _test_colorV3 = color(THEMES.v3)
