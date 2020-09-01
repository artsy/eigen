import { ResponsiveValue, Theme, TLengthStyledSystem } from "styled-system"

/**
 * font-families
 */
export const TEXT_FONTS = {
  sans: "Unica77LL-Regular",
  serif: "ReactNativeAGaramondPro-Regular",
}

/**
 * font-size scale
 */
export const TEXT_FONT_SIZES = {
  size12: "62px",
  size11: "55px",
  size10: "48px",
  size9: "32px",
  size8: "28px",
  size7: "24px",
  size6: "18px",
  size5: "16px",
  size4: "15px",
  size3: "14px",
  size2: "13px",
  size1: "12px",
}

/**
 * Available font-sizes
 */
export type TextFontSize = keyof typeof TEXT_FONT_SIZES

/**
 * line-height scale
 */
export const TEXT_LINE_HEIGHTS = {
  solid: 1,
  title: 1.25,
  body: 1.5,
}

/**
 * Available line-heights
 */
export type TextLineHeight = keyof typeof TEXT_LINE_HEIGHTS

/**
 * letter-spacing scale
 */
export const TEXT_LETTER_SPACING = {
  tight: "-0.02em",
  tightest: "-0.03em",
}

/**
 * Available letter-spacings
 */
export type TextLetterSpacing = keyof typeof TEXT_LETTER_SPACING

/**
 * em-units don't exist on React Native so we convert it to a number
 * which will be evaluated as px based on the given font-size.
 */
export const calculateLetterSpacing = (fontSize: TextFontSize, letterSpacing: TextLetterSpacing): number => {
  const tracking = parseFloat(TEXT_LETTER_SPACING[letterSpacing])
  const size = parseInt(TEXT_FONT_SIZES[fontSize], 10)
  return size * tracking
}

/**
 * unitless line-heights don't exist on React Native so we convert it
 * to a px string. Since unitless line-heights are valid/normal, styled-system
 * won't convert it to px.
 */
export const calculateLineHeight = (fontSize: TextFontSize, lineHeight: TextLineHeight): string => {
  const size = parseInt(TEXT_FONT_SIZES[fontSize], 10)
  return `${size * TEXT_LINE_HEIGHTS[lineHeight]}px`
}

/**
 * Names of typographic treatments
 */
export const TEXT_TREATMENTS = ["largeTitle", "title", "subtitle", "text", "mediumText", "caption", "small"] as const

export interface WebTextTreatment {
  fontSize: TextFontSize
  lineHeight: TextLineHeight
  letterSpacing?: TextLetterSpacing
  fontWeight?: "normal" | "bold"
}

export type WebTextTreatments = {
  [K in typeof TEXT_TREATMENTS[number]]: WebTextTreatment
}

/**
 * Available typographic treatments
 */
export const WEB_TEXT_VARIANTS: { [key: string]: WebTextTreatments } = {
  large: {
    largeTitle: {
      fontSize: "size9",
      lineHeight: "title",
      letterSpacing: "tight",
      fontWeight: "normal",
    },
    title: {
      fontSize: "size7",
      lineHeight: "title",
      letterSpacing: "tight",
      fontWeight: "normal",
    },
    subtitle: {
      fontSize: "size6",
      lineHeight: "title",
      fontWeight: "normal",
    },
    text: {
      fontSize: "size3",
      lineHeight: "body",
      fontWeight: "normal",
    },
    mediumText: {
      fontSize: "size3",
      lineHeight: "body",
      fontWeight: "bold",
    },
    caption: {
      fontSize: "size2",
      lineHeight: "body",
      fontWeight: "normal",
    },
    small: {
      fontSize: "size1",
      lineHeight: "body",
      fontWeight: "normal",
    },
  },
  small: {
    largeTitle: {
      fontSize: "size8",
      lineHeight: "title",
      letterSpacing: "tight",
      fontWeight: "normal",
    },
    title: {
      fontSize: "size6",
      lineHeight: "title",
      letterSpacing: "tight",
      fontWeight: "normal",
    },
    subtitle: {
      fontSize: "size5",
      lineHeight: "title",
      fontWeight: "normal",
    },
    text: {
      fontSize: "size4",
      lineHeight: "body",
      fontWeight: "normal",
    },
    mediumText: {
      fontSize: "size4",
      lineHeight: "body",
      fontWeight: "bold",
    },
    caption: {
      fontSize: "size3",
      lineHeight: "body",
      fontWeight: "normal",
    },
    small: {
      fontSize: "size2",
      lineHeight: "body",
      fontWeight: "normal",
    },
  },
}

export type TextVariant = keyof WebTextTreatments

export interface TextTreatment extends Omit<WebTextTreatment, "lineHeight" | "letterSpacing"> {
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
export const TEXT_VARIANTS = (Object.keys(TREATMENTS) as Array<keyof typeof TREATMENTS>).reduce((acc, name) => {
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
}, {} as TextTreatments)

type ThemedKey = ResponsiveValue<string | number | symbol, Required<Theme<TLengthStyledSystem>>>

/**
 * Type-guard that determines whether or not value is within theme
 */
export const isControlledLetterSpacing = (key: ThemedKey): key is TextLetterSpacing =>
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
