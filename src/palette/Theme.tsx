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
import {
  Color as ColorV3BeforeDevPurple,
  SpacingUnit as SpacingUnitV3Numbers,
} from "@artsy/palette-tokens/dist/themes/v3"

type SpacingUnitV3 = `${SpacingUnitV3Numbers}`
export type Color = ColorV2 | ColorV3
export type SpacingUnit = SpacingUnitV2 | SpacingUnitV3
type ColorV3 = ColorV3BeforeDevPurple | "devpurple"
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

// this function is just adding a dev color, `devpurple`
const fixColorV3 = (
  colors: typeof eigenUsefulTHEME_V3.colors
): typeof eigenUsefulTHEME_V3.colors & { devpurple: string } => {
  const ourColors = colors as any
  ourColors.devpurple = "#6E1EFF"
  return colors as any
}

const THEMES = {
  v2: { ...THEME_V2, fontFamily, fonts: TEXT_FONTS_V2, space: fixSpaceUnitsV2(THEME_V2.space) },
  v3: {
    ...eigenUsefulTHEME_V3,
    fonts: TEXT_FONTS_V3,
    space: fixSpaceUnitsV3(spaceNumbers),
    colors: fixColorV3(eigenUsefulTHEME_V3.colors),
  }, // v3 removed `fontFamily`, `fontSizes`, `letterSpacings`, `lineHeights`, `typeSizes`
}

type ThemeV2Type = typeof THEMES.v2
type ThemeV3Type = typeof THEMES.v3
type ThemeType = ThemeV2Type | ThemeV3Type

/**
 * Do not use this!! Use any the hooks instead!
 */
export const themeProps = THEMES.v2

const figureOutTheme = (theme: keyof typeof THEMES | ThemeType): ThemeType => {
  const allowV3 = usePaletteFlagStore((state) => state.allowV3)

  if (!_.isString(theme)) {
    return theme
  }

  if (!allowV3) {
    return THEMES.v2
  }

  // forcing v3 colors, unless specifically requiring v2, in which case we use `colorV2`
  const mergedColorsV2WithV3OnTop = {
    ...THEMES.v2.colors, // get the base v2
    ...THEMES.v3.colors, // get the base v3 on top of that
    // now add the rest of the mappings
    black80: THEMES.v3.colors.black60, // TODO-PALETTE-V3 replace all black80 with black60
    purple100: THEMES.v3.colors.blue100, // TODO-PALETTE-V3 replace all purple100 with blue100
    purple30: THEMES.v3.colors.blue10, // TODO-PALETTE-V3 replace all purple30 with blue10
    purple5: THEMES.v3.colors.blue10, // TODO-PALETTE-V3 replace all purple5 with blue10
  }
  // TODO-PALETTE-V3 remove the mapping as the last TODO-PALETTE-V3 to be done

  if (theme === "v3") {
    return { ...THEMES.v3, colors: mergedColorsV2WithV3OnTop }
  }

  return { ...THEMES.v2, colors: mergedColorsV2WithV3OnTop }
}

export const Theme: React.FC<{
  theme?: keyof typeof THEMES | ThemeType
}> = ({ children, theme = "v2" }) => {
  const actualTheme = figureOutTheme(theme)
  return <ThemeProvider theme={actualTheme}>{children}</ThemeProvider>
}

export const ThemeV2: React.FC = ({ children }) => <Theme theme="v2">{children}</Theme>
export const ThemeV3: React.FC = ({ children }) => <Theme theme="v3">{children}</Theme>

interface ColorFuncOverload {
  (colorNumber: undefined): undefined
  (colorNumber: Color): string
  (colorNumber: Color | undefined): string | undefined
}
const color = (theme: ThemeType): ColorFuncOverload => (colorName: any): any => {
  if (colorName === undefined) {
    return undefined
  }
  return (theme.colors as { [key: string]: string })[colorName as Color]
}

const space = (theme: ThemeType) => (spaceName: SpacingUnitV2 | SpacingUnitV3): number =>
  isThemeV2(theme)
    ? ((theme.space[spaceName as SpacingUnitV2] as unknown) as number)
    : theme.space[spaceName as SpacingUnitV3]

export const useTheme = () => {
  const theme: ThemeType = useContext(ThemeContext)

  // if we are not wrapped in `<Theme>`, if we dev, throw error.
  // if we are in prod, we will default to v2 to avoid a crash.
  // if we are wrapped, then all good.
  if ((__DEV__ || __TEST__) && theme === undefined) {
    console.error(
      "You are trying to use the `Theme` but you have not wrapped your component/screen with `<Theme>`. Please wrap and try again."
    )
    throw new Error("ThemeContext is not defined. Wrap your component with `<Theme>` and try again.")
  }
  const themeIfUnwrapped = THEMES.v2

  return {
    theme: theme ?? themeIfUnwrapped,
    color: color(theme ?? themeIfUnwrapped),
    space: space(theme ?? themeIfUnwrapped),
    colorV2: color(THEMES.v2),
    colorV3: color(THEMES.v3),
  }
}

export const isThemeV2 = (theme: ThemeType): theme is ThemeV2Type => theme.id === "v2"
export const isThemeV3 = (theme: ThemeType): theme is ThemeV3Type => theme.id === "v3"

/**
 * Only use this if it's are absolutely neccessary, and only in tests.
 */
// tslint:disable-next-line:variable-name
export const _test_THEMES = THEMES
