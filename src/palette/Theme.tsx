import { THEME_V3 } from "@artsy/palette-tokens"
import {
  Color as ColorV3BeforeDevPurple,
  SpacingUnit as SpacingUnitV3Numbers,
} from "@artsy/palette-tokens/dist/themes/v3"
import {
  TextTreatment as TextTreatmentWithUnits,
  TextVariant as TextVariantV3,
} from "@artsy/palette-tokens/dist/typography/v3"
import _ from "lodash"
import React, { useContext } from "react"
import { ThemeContext, ThemeProvider } from "styled-components/native"

/**
 * All of the config for the Artsy theming system, based on the
 * design system from our design team:
 * https://www.notion.so/artsy/Master-Library-810612339f474d0997fe359af4285c56
 */

type SpacingUnitV3 = `${SpacingUnitV3Numbers}`
export type SpacingUnit = SpacingUnitV3 | (number & {})
export type Color =
  | ColorV3BeforeDevPurple
  | "devpurple"
  | "yellow150"
  | "yellow100"
  | "yellow10"
  | "orange10"
  | "orange100" // yellows and orange are temporary, until we add them to palette-tokens
  | "copper100" // this needs to go once we extract palette-mobile
  // v5 stuff
  | "appBackground"
  | "appForeground"
export type { SpacingUnitV3 }
export type { TextVariantV3 }

const {
  breakpoints: _eigenDoesntCareAboutBreakpoints,
  mediaQueries: _eigenDoesntCareAboutMediaQueries,
  grid: _eigenDoesntCareAboutGrid,
  textVariants: textVariantsWithUnits,
  space: spaceNumbers,
  ...eigenUsefulTHEME_V3
} = THEME_V3

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
): typeof eigenUsefulTHEME_V3.colors & { devpurple: string; copper100: string } => {
  const ourColors = colors as any
  ourColors.devpurple = "#6E1EFF"
  ourColors.yellow150 = "#A47A0F"
  ourColors.yellow100 = "#E2B929"
  ourColors.yellow10 = "#F6EFE5"
  ourColors.orange10 = "#FCF7F3"
  ourColors.orange150 = "#A8501C"
  // From our v2 colors
  ourColors.copper100 = "#A85F00"
  return colors as any
}

export interface TextTreatment {
  fontSize: number
  lineHeight: number
  letterSpacing?: number
}

// this function is removing the `px` and `em` suffix and making the values into numbers
const fixTextTreatments = (
  variantsWithUnits: Record<TextVariantV3, TextTreatmentWithUnits>
): Record<TextVariantV3, TextTreatment> => {
  const textTreatments = _.mapValues(variantsWithUnits, (treatmentWithUnits) => {
    const newTreatment = {} as TextTreatment
    ;(
      [
        ["fontSize", "px"],
        ["lineHeight", "px"],
        ["letterSpacing", "em"],
      ] as Array<[keyof TextTreatment, string]>
    ).forEach(([property, unit]) => {
      const originalValue = treatmentWithUnits[property]
      if (originalValue === undefined) {
        return undefined
      }
      const justStringValue = _.split(originalValue, unit)[0]
      const numberValue = parseInt(justStringValue, 10)
      newTreatment[property] = numberValue
    })
    return newTreatment
  })
  return textTreatments
}

const THEMES = {
  v3: {
    ...eigenUsefulTHEME_V3,
    colors: fixColorV3(eigenUsefulTHEME_V3.colors),
    space: fixSpaceUnitsV3(spaceNumbers),
    fonts: {
      sans: {
        regular: "Unica77LL-Regular",
        italic: "Unica77LL-Italic",
        medium: "Unica77LL-Medium",
        mediumItalic: "Unica77LL-MediumItalic",
      },
    },
    textTreatments: fixTextTreatments(textVariantsWithUnits),
  },
  v5: {
    ...eigenUsefulTHEME_V3,
    colors: {
      ...fixColorV3(eigenUsefulTHEME_V3.colors),
      appBackground: "white",
      appForeground: "black",
    },
    space: fixSpaceUnitsV3(spaceNumbers),
    fonts: {
      sans: {
        regular: "Unica77LL-Regular",
        italic: "Unica77LL-Italic",
        medium: "Unica77LL-Medium",
        mediumItalic: "Unica77LL-MediumItalic",
      },
    },
    textTreatments: fixTextTreatments(textVariantsWithUnits),
  },
  v5dark: {
    ...eigenUsefulTHEME_V3,
    colors: {
      ...fixColorV3(eigenUsefulTHEME_V3.colors),
      appBackground: "black",
      appForeground: "white",
    },
    space: fixSpaceUnitsV3(spaceNumbers),
    fonts: {
      sans: {
        regular: "Unica77LL-Regular",
        italic: "Unica77LL-Italic",
        medium: "Unica77LL-Medium",
        mediumItalic: "Unica77LL-MediumItalic",
      },
    },
    textTreatments: fixTextTreatments(textVariantsWithUnits),
  },
}

export type ThemeV3Type = typeof THEMES.v3
export type ThemeType = ThemeV3Type

const figureOutTheme = (theme: keyof typeof THEMES | ThemeType): ThemeType => {
  if (!_.isString(theme)) {
    return theme
  }

  if (theme === "v5") {
    return THEMES.v5
  }
  if (theme === "v5dark") {
    return THEMES.v5dark
  }

  return THEMES.v3
}

export const Theme: React.FC<{
  theme?: keyof typeof THEMES | ThemeType
}> = ({ children, theme = "v3" }) => {
  const actualTheme = figureOutTheme(theme)
  return <ThemeProvider theme={actualTheme}>{children}</ThemeProvider>
}

interface ColorFuncOverload {
  (colorNumber: undefined): undefined
  (colorNumber: Color): string
  (colorNumber: Color | undefined): string | undefined
}
const color =
  (theme: ThemeType): ColorFuncOverload =>
  (colorName: any): any => {
    if (colorName === undefined) {
      return undefined
    }
    return (theme.colors as { [key: string]: string })[colorName as Color]
  }

const space =
  (theme: ThemeType) =>
  (spaceName: SpacingUnitV3): number =>
    theme.space[spaceName]

export const useTheme = () => {
  const theme: ThemeType = useContext(ThemeContext)

  // if we are not wrapped in `<Theme>`, if we dev, throw error.
  // if we are in prod, we will default to v2 to avoid a crash.
  // if we are wrapped, then all good.
  if ((__DEV__ || __TEST__) && theme === undefined) {
    console.error(
      "You are trying to use the `Theme` but you have not wrapped your component/screen with `<Theme>`. Please wrap and try again."
    )
    throw new Error(
      "ThemeContext is not defined. Wrap your component with `<Theme>` and try again."
    )
  }
  const themeIfUnwrapped = THEMES.v3

  return {
    theme: theme ?? themeIfUnwrapped,
    color: color(theme ?? themeIfUnwrapped),
    space: space(theme ?? themeIfUnwrapped),
  }
}

export const isThemeV3 = (theme: ThemeType): theme is ThemeV3Type => theme.id === "v3"

// these here are temporary, for better editor completion
type SpacingUnitAnyNumber = number & {} // for things like `12` (which RN handles as number of pixels)
type SpacingUnitAnyString = string & {} // for things like `12px`
type SpacingUnits = SpacingUnitV3 | SpacingUnitAnyNumber | SpacingUnitAnyString
export type SpacingUnitTheme = { space: Record<SpacingUnits, any> }
type ColorAnyString = string & {}
type Colors = Color | ColorAnyString

export type ColorsTheme = { colors: Record<Colors, any> }

/**
 * Only use this if it's are absolutely neccessary, and only in tests.
 */

export const _test_THEMES = THEMES
