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

export interface TextTreatment {
  fontSize: TextFontSize
  lineHeight: TextLineHeight
  letterSpacing?: TextLetterSpacing
  fontWeight?: "normal" | "bold"
}

/**
 * Names of typographic treatments
 */
export const TEXT_TREATMENTS = [
  "largeTitle",
  "title",
  "subtitle",
  "text",
  "mediumText",
  "caption",
  "small",
] as const

/**
 * TextTreatments
 */
export type TextTreatments = {
  [K in typeof TEXT_TREATMENTS[number]]: TextTreatment
}

/**
 * Available typographic treatments
 */
export const TEXT_VARIANTS: { [key: string]: TextTreatments } = {
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

/**
 * Name of typographic treatment
 */
export type TextVariant = keyof TextTreatments
