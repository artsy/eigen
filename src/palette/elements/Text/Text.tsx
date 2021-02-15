import { TEXT_LINE_HEIGHTS } from "@artsy/palette-tokens/dist/text"
import { SpaceProps } from "palette/helpers"
import React from "react"
import { TextProps as RNTextProps } from "react-native"
import {
  color,
  ColorProps,
  compose,
  space,
  style,
  typography,
  TypographyProps,
  variant as systemVariant,
} from "styled-system"
import { styled as primitives } from "../../platform/primitives"
import {
  calculateLetterSpacing,
  calculateLineHeight,
  isControlledFontSize,
  isControlledLetterSpacing,
  isControlledLineHeight,
  TEXT_VARIANTS,
  TextVariant,
  TREATMENTS,
} from "./tokens"

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
    ...(variant && fontSize && typeof fontSize === "number" && !lineHeight
      ? // Possibly convert the lineHeight
        {
          lineHeight: fontSize * TEXT_LINE_HEIGHTS[TREATMENTS[variant].lineHeight],
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
