import React from "react"
import { TextProps as RNTextProps } from "react-native"
import { color, ColorProps, compose, space, SpaceProps, style, typography, TypographyProps } from "styled-system"
import { styled as primitives } from "../../platform/primitives"
import { TEXT_VARIANTS, TextVariant } from "./tokens"

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
  ${textMixin}
`

/** Text */
export const Text: React.FC<TextProps> = ({ children, variant, ...rest }) => {
  const props = {
    ...TEXT_VARIANTS[variant ?? "text"],
    ...rest,
  }

  return <InnerText {...props}>{children}</InnerText>
}

Text.displayName = "Text"
