import { ResponsiveValue, Theme, TLengthStyledSystem } from "styled-system"
import {
  TEXT_FONT_SIZES,
  TEXT_LETTER_SPACING,
  TEXT_LINE_HEIGHTS,
  TEXT_TREATMENTS,
  TEXT_VARIANTS as WEB_TEXT_VARIANTS,
  TextFontSize,
  TextLetterSpacing,
  TextLineHeight,
  TextTreatment as WebTextTreatment,
} from "./tokens.shared"
export * from "./tokens.shared"

/**
 * font-families
 */
export const TEXT_FONTS = {
  sans: "Unica77LL-Regular",
  serif: "ReactNativeAGaramondPro-Regular",
}
/**
 * em-units don't exist on React Native so we convert it to a number
 * which will be evaluated as px based on the given font-size.
 */
export const calculateLetterSpacing = (
  fontSize: TextFontSize,
  letterSpacing: TextLetterSpacing
): number => {
  const tracking = parseFloat(TEXT_LETTER_SPACING[letterSpacing])
  const size = parseInt(TEXT_FONT_SIZES[fontSize], 10)
  return size * tracking
}

/**
 * unitless line-heights don't exist on React Native so we convert it
 * to a px string. Since unitless line-heights are valid/normal, styled-system
 * won't convert it to px.
 */
export const calculateLineHeight = (
  fontSize: TextFontSize,
  lineHeight: TextLineHeight
): string => {
  const size = parseInt(TEXT_FONT_SIZES[fontSize], 10)
  return `${size * TEXT_LINE_HEIGHTS[lineHeight]}px`
}

export interface TextTreatment
  extends Omit<WebTextTreatment, "lineHeight" | "letterSpacing"> {
  lineHeight: number
  letterSpacing?: string
}

/**
 * Utilizes only the small treatments on mobile
 */
const TREATMENTS = WEB_TEXT_VARIANTS.small

/**
 * TextTreatments
 */
export type TextTreatments = {
  [K in typeof TEXT_TREATMENTS[number]]: TextTreatment
}

/**
 * iOS-specific typographic treatments
 */
export const TEXT_VARIANTS = Object.keys(TREATMENTS).reduce(
  (acc, name: keyof typeof TREATMENTS) => {
    const { fontSize, fontWeight, letterSpacing, lineHeight } = TREATMENTS[name]

    return {
      ...acc,
      [name]: {
        fontSize,
        fontWeight,

        // Convert `letterSpacing`
        ...(letterSpacing
          ? {
              letterSpacing: calculateLetterSpacing(fontSize, letterSpacing),
            }
          : {}),

        // Convert `lineHeight`
        ...(lineHeight
          ? {
              lineHeight: calculateLineHeight(fontSize, lineHeight),
            }
          : {}),
      },
    }
  },
  {} as TextTreatments
)

type ThemedKey = ResponsiveValue<
  string | number | symbol,
  Required<Theme<TLengthStyledSystem>>
>

/**
 * Type-guard that determines whether or not value is within theme
 */
export const isControlledLetterSpacing = (
  key: ThemedKey
): key is TextLetterSpacing =>
  Object.keys(TEXT_LETTER_SPACING).includes(String(key))

/**
 * Type-guard that determines whether or not value is within theme
 */
export const isControlledLineHeight = (key: ThemedKey): key is TextLineHeight =>
  Object.keys(TEXT_LINE_HEIGHTS).includes(String(key))

/**
 * Type-guard that determines whether or not value is within theme
 */
export const isControlledFontSize = (key: ThemedKey): key is TextFontSize =>
  Object.keys(TEXT_FONT_SIZES).includes(String(key))
