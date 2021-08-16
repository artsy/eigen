import {
  TEXT_FONT_SIZES,
  TEXT_LETTER_SPACING,
  TEXT_LINE_HEIGHTS,
  TEXT_VARIANT_NAMES as TEXT_TREATMENTS,
  TEXT_VARIANTS as WEB_TEXT_VARIANTS,
  TextTreatment as WebTextTreatment,
} from "@artsy/palette-tokens/dist/typography/v2"
import React from "react"
import { TextProps as RNTextProps } from "react-native"
// @ts-ignore
import { animated } from "react-spring/renderprops-native.cjs"
import styled from "styled-components/native"
import { ResponsiveValue, Theme, TLengthStyledSystem } from "styled-system"
import {
  color,
  ColorProps,
  compose,
  space,
  SpaceProps,
  style,
  typography,
  TypographyProps,
  variant as systemVariant,
} from "styled-system"

const TREATMENTS = WEB_TEXT_VARIANTS.small

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
            letterSpacing: calculateLetterSpacing(fontSize as TextFontSize, letterSpacing as TextLetterSpacing),
          }
        : {}),

      // Convert `lineHeight`
      ...(lineHeight
        ? {
            lineHeight: calculateLineHeight(fontSize as TextFontSize, lineHeight as TextLineHeight),
          }
        : {}),
    },
  }
}, {} as TextTreatments)
/** BaseTextProps */
export type BaseTextProps = TypographyProps &
  ColorProps &
  SpaceProps & {
    variant?: TextVariant
  }

const textColor = style({
  prop: "textColor",
  cssProperty: "color",
  key: "colors",
})

/** styled functions for Text */
export const textMixin = compose(typography, color, textColor, space)

/** TextProps */
export type TextProps = BaseTextProps & RNTextProps

const InnerStyledText = styled.Text<TextProps>`
  ${systemVariant({ variants: TEXT_VARIANTS })}
  ${textMixin}
`

const InnerText = animated(InnerStyledText)

/** Text */
export const Text: React.FC<TextProps> = ({ children, variant, fontSize, letterSpacing, lineHeight, ...rest }) => {
  const props = {
    variant,
    fontSize,
    ...(!variant && letterSpacing && fontSize
      ? // Possibly convert the letterSpacing
        {
          letterSpacing:
            isControlledLetterSpacing(letterSpacing) && isControlledFontSize(fontSize)
              ? calculateLetterSpacing(fontSize, letterSpacing)
              : letterSpacing,
        }
      : {}),
    ...(!variant && lineHeight && fontSize
      ? // Possibly convert the lineHeight
        {
          lineHeight:
            isControlledLineHeight(lineHeight) && isControlledFontSize(fontSize)
              ? calculateLineHeight(fontSize, lineHeight)
              : lineHeight,
        }
      : {}),
    ...(variant && fontSize && typeof fontSize === "number" && !lineHeight
      ? // Possibly convert the lineHeight
        {
          lineHeight: fontSize * TEXT_LINE_HEIGHTS[TREATMENTS[variant].lineHeight as TextLineHeight],
        }
      : {}),
    ...rest,
  }

  return <InnerText {...props}>{children}</InnerText>
}

Text.displayName = "Text"

Text.defaultProps = {
  fontFamily: "sans",
}

/**
 * TextTreatments
 */
type TextTreatments = {
  [K in typeof TEXT_TREATMENTS[number]]: TextTreatment
}

type TextVariant = keyof TextTreatments

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

interface TextTreatment extends Omit<WebTextTreatment, "lineHeight" | "letterSpacing"> {
  lineHeight: number
  letterSpacing?: string
}

type ThemedKey = ResponsiveValue<string | number | symbol, Required<Theme<TLengthStyledSystem>>>

/**
 * Type-guard that determines whether or not value is within theme
 */
const isControlledLetterSpacing = (key: ThemedKey): key is TextLetterSpacing =>
  Object.keys(TEXT_LETTER_SPACING).includes(String(key))

/**
 * Type-guard that determines whether or not value is within theme
 */
const isControlledLineHeight = (key: ThemedKey): key is TextLineHeight =>
  Object.keys(TEXT_LINE_HEIGHTS).includes(String(key))

/**
 * Type-guard that determines whether or not value is within theme
 */
const isControlledFontSize = (key: ThemedKey): key is TextFontSize => Object.keys(TEXT_FONT_SIZES).includes(String(key))

type TextFontSize = keyof typeof TEXT_FONT_SIZES
type TextLetterSpacing = keyof typeof TEXT_LETTER_SPACING
type TextLineHeight = keyof typeof TEXT_LINE_HEIGHTS
