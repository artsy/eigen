import React from "react"
import {
  color,
  ColorProps,
  compose,
  ResponsiveValue,
  style,
  typography,
  TypographyProps,
  variant as systemVariant,
} from "styled-system"
import { styled as primitives } from "../../platform/primitives"
import { Color } from "../../Theme"
import {
  calculateLetterSpacing,
  calculateLineHeight,
  isControlledFontSize,
  isControlledLetterSpacing,
  isControlledLineHeight,
  TEXT_VARIANTS,
  TextVariant,
} from "./tokens"

/** BaseTextProps */
export type BaseTextProps = TypographyProps &
  Omit<ColorProps, "color"> & {
    variant?: TextVariant
    textColor?: ResponsiveValue<Color>
  }

const textColor = style({
  prop: "textColor",
  cssProperty: "color",
  key: "colors",
})

/** styled functions for Text */
export const textMixin = compose(typography, color, textColor)

/** TextProps */
export type TextProps = BaseTextProps

const InnerText = primitives.Text<TextProps>`
  ${systemVariant({ variants: TEXT_VARIANTS })}
  ${textMixin}
`

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
    ...rest,
  }

  return <InnerText {...props}>{children}</InnerText>
}

Text.displayName = "Text"

Text.defaultProps = {
  fontFamily: "sans",
}
