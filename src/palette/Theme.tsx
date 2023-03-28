import { THEME_V3 } from "@artsy/palette-tokens"
import {
  TextTreatment as TextTreatmentWithUnits,
  TextVariant as TextVariantV3,
} from "@artsy/palette-tokens/dist/typography/v3"
import _ from "lodash"
import Config from "react-native-config"
import { ThemeProvider } from "styled-components/native"

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

interface TextTreatment {
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

const isOSS = Config.OSS === "True"
export const RegularFontFamily = isOSS ? "HelveticaNeue" : "Unica77LL-Regular"
export const MediumFontFamily = isOSS ? "HelveticaNeue-Medium" : "Unica77LL-Medium"
export const ItalicFontFamily = isOSS ? "HelveticaNeue-Italic" : "Unica77LL-Italic"
export const MediumItalicFontFamily = isOSS
  ? "HelveticaNeue-MediumItalic"
  : "Unica77LL-MediumItalic"

const THEMES = {
  v3: {
    ...eigenUsefulTHEME_V3,
    colors: fixColorV3(eigenUsefulTHEME_V3.colors),
    space: fixSpaceUnitsV3(spaceNumbers),
    fonts: {
      sans: {
        regular: RegularFontFamily,
        italic: ItalicFontFamily,
        medium: MediumFontFamily,
        mediumItalic: MediumItalicFontFamily,
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
        regular: RegularFontFamily,
        italic: ItalicFontFamily,
        medium: MediumFontFamily,
        mediumItalic: MediumItalicFontFamily,
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
        regular: RegularFontFamily,
        italic: ItalicFontFamily,
        medium: MediumFontFamily,
        mediumItalic: MediumItalicFontFamily,
      },
    },
    textTreatments: fixTextTreatments(textVariantsWithUnits),
  },
}

type ThemeV3Type = typeof THEMES.v3
type ThemeType = ThemeV3Type

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
