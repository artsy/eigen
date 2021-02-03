import {
  TEXT_FONT_SIZES,
  TEXT_LETTER_SPACING,
  TEXT_LINE_HEIGHTS,
  TEXT_TREATMENTS,
  TEXT_VARIANTS as WEB_TEXT_VARIANTS,
  TextFontSize,
  TextLetterSpacing,
  TextLineHeight,
} from "@artsy/palette-tokens/dist/text"

export { TextFontSize } from "@artsy/palette-tokens/dist/text"

/**
 * font-families
 */
export const TEXT_FONTS = {
  sans: "Unica77LL-Regular",
  sansMedium: "Unica77LL-Medium",
}

/**
 * em-units don't exist on React Native so we convert it to a number
 * which will be evaluated as px based on the given font-size.
 */
const calculateLetterSpacing = (fontSize: TextFontSize, letterSpacing: TextLetterSpacing): number => {
  const tracking = parseFloat(TEXT_LETTER_SPACING[letterSpacing])
  const size = parseInt(TEXT_FONT_SIZES[fontSize], 10)
  return size * tracking
}

/**
 * unitless line-heights don't exist on React Native so we convert it
 * to a px string. Since unitless line-heights are valid/normal, styled-system
 * won't convert it to px.
 */
const calculateLineHeight = (fontSize: TextFontSize, lineHeight: TextLineHeight): number => {
  const size = parseInt(TEXT_FONT_SIZES[fontSize], 10)
  return size * TEXT_LINE_HEIGHTS[lineHeight]
}

export interface TextTreatment {
  fontSize: string
  fontFamily: string
  lineHeight?: number
  letterSpacing?: number
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

export type TextVariant = keyof TextTreatments

/**
 * iOS-specific typographic treatments
 */
export const TEXT_VARIANTS = (Object.keys(TREATMENTS) as Array<keyof typeof TREATMENTS>).reduce((acc, name) => {
  const { fontSize, fontWeight, letterSpacing, lineHeight } = TREATMENTS[name]

  const treatment: TextTreatment = {
    fontSize: TEXT_FONT_SIZES[fontSize],
    fontFamily: fontWeight === "bold" ? TEXT_FONTS.sansMedium : TEXT_FONTS.sans,
  }
  if (letterSpacing) {
    treatment.letterSpacing = calculateLetterSpacing(fontSize, letterSpacing)
  }
  if (lineHeight) {
    treatment.lineHeight = calculateLineHeight(fontSize, lineHeight)
  }

  return {
    ...acc,
    [name]: treatment,
  }
}, {} as TextTreatments)
