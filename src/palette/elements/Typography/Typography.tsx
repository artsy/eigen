import React, { CSSProperties } from "react"
import { FontValue } from "../../platform/fonts"
import { styled as primitives, styledWrapper } from "../../platform/primitives"

import { DisplaySize, SansSize, SerifSize, themeProps, TypeSizes } from "../../Theme"

// @ts-ignore
import { StyledComponentClass } from "styled-components"

import {
  color,
  ColorProps,
  display,
  DisplayProps as StyledSystemDisplayProps,
  fontSize,
  FontSizeProps,
  lineHeight,
  LineHeightProps,
  maxWidth,
  MaxWidthProps,
  space,
  SpaceProps,
  textAlign,
  TextAlignProps,
  verticalAlign,
  VerticalAlignProps,
} from "styled-system"

import { isReactNative } from "../../helpers/isReactNative"
import { determineFontSizes } from "./determineFontSizes"

/**
 * Spec: https://www.notion.so/artsy/Typography-d1f9f6731f3d47c78003d6d016c30221
 */

/** renderFontValue */
export const renderFontValue = (fontValue: FontValue) => {
  if (typeof fontValue === "string") {
    return `font-family: ${fontValue}`
  } else {
    return [`font-family: ${fontValue.fontFamily}`]
      .concat(fontValue.fontStyle ? `font-style: ${fontValue.fontStyle}` : [])
      .concat(fontValue.fontWeight ? `font-weight: ${fontValue.fontWeight}` : [])
      .join(";\n")
  }
}

interface TextProps
  extends ColorProps,
    FontSizeProps,
    LineHeightProps,
    MaxWidthProps,
    SpaceProps,
    StyledSystemDisplayProps,
    TextAlignProps,
    VerticalAlignProps {
  className?: string
  fontFamily?: string
  style?: CSSProperties
  /**
   * React Native specific. Allows you to tell the native renderers whether
   * this field could be multi-line or not.
   */
  numberOfLines?: number
  /**
   * React Native specific. When `numberOfLines` is set, this prop defines how
   * text will be truncated. `numberOfLines` must be set in conjunction with
   * this prop.
   */
  ellipsizeMode?: string
  element?: keyof JSX.IntrinsicElements | React.ComponentType<any>
}

/** Base Text component for typography */
export const BaseText = primitives.Text<TextProps>`
  ${({ fontFamily }) => fontFamily && renderFontValue(fontFamily)};
  ${fontSize};
  ${lineHeight};
  ${color};
  ${display};
  ${maxWidth};
  ${space};
  ${textAlign};
  ${verticalAlign};
`

/**
 * The supported typefaces
 */
export type FontTypes = keyof TypeSizes

export interface TypeSizeKeys {
  sans: SansSize
  serif: SerifSize
  display: DisplaySize
}

/**
 * Any valid font family
 */
export type FontFamily = typeof themeProps["fontFamily"]

/**
 * Any valid font weight
 */
export type FontWeights = keyof FontFamily["sans"] | keyof FontFamily["serif"] | keyof FontFamily["display"]

/**
 * Returns the weight, if given, otherwise it defaults to `regular` unless
 * explicitly given `null` in which case it returns undefined, meaning the
 * weight should be inherited from the component’s parent.
 *
 * @param weight
 */
function _fontWeight(weight?: null | FontWeights) {
  if (weight === null) {
    return undefined
  }
  return weight || "regular"
}

function _selectFontFamilyType(weight?: null | FontWeights, italic?: boolean) {
  return italic ? "italic" : weight
}

interface StyledTextProps extends Partial<TextProps> {
  size: string | string[]
  weight?: null | FontWeights
  italic?: boolean
  unstable_trackIn?: boolean
}

/**
 * Creates a wrapper around the generic `Text` component for a font type defined
 * in the palette’s theme (sans, serif, or display).
 *
 * The component’s props are specified with type parameter `P` and should hold
 * both the component’s specific props (size, weight, italic) as well as all of
 * the generic `Text` component’s props, although as optional.
 *
 * @param fontType
 *        The font type that this text component represents.
 * @param selectFontFamilyType
 *        An optional function that maps weight+italic to a font-family.
 */
function createStyledText<P extends StyledTextProps>(
  fontType: keyof FontFamily,
  selectFontFamilyType: typeof _selectFontFamilyType = _selectFontFamilyType
) {
  return styledWrapper<P>(
    ({ size, weight, italic, style: _style, unstable_trackIn, element, ...textProps }: StyledTextProps) => {
      const fontFamilyType = selectFontFamilyType(_fontWeight(weight), italic)
      // This is mostly to narrow the type of `fontFamilyType` to remove `null`.
      if (fontFamilyType === null) {
        throw new Error("Did not expect `fontType` to be `null`.")
      }

      return (
        <BaseText
          fontFamily={fontFamilyType && themeProps.fontFamily[fontType][fontFamilyType]}
          style={
            isReactNative()
              ? _style
              : {
                  ...(unstable_trackIn ? { letterSpacing: "-0.03em" } : {}),
                  ..._style,
                }
          }
          {...determineFontSizes(fontType, size)}
          // styled-components supports calling the prop `as`, but there are
          //  issues when passing it into this component named `as`. See
          //  https://github.com/styled-components/styled-components/issues/2448
          //  & https://github.com/artsy/palette/pull/327#issuecomment-473434537
          //  for context.
          // So we are naming it `element` on the way into this component, and
          //  renaming it to `as` when we pass it to through.
          {...(element ? { as: element } : {})}
          {...textProps}
        />
      )
    }
  )``
}

/**
 * Sans
 */

export interface SansProps extends Partial<TextProps> {
  italic?: boolean

  role?: string

  size: SansSize

  /**
   * Explicitly specify `null` to inherit weight from parent, otherwise default
   * to `regular`.
   */
  weight?: null | "regular" | "medium"

  unstable_trackIn?: boolean
}

/**
 * The Sans typeface is used for presenting objective dense information
 * (such as tables) and intervening communications (such as error feedback).
 *
 * @example
 *
 * <Sans color="black10" size="3t" weight="medium" italic>Hi</Sans>
 */
export const Sans = createStyledText<SansProps>("sans", (weight, italic) => {
  return italic && weight === "medium" ? "mediumItalic" : _selectFontFamilyType(weight, italic)
})

/**
 * Serif
 */

export interface SerifProps extends Partial<TextProps> {
  italic?: boolean

  size: SerifSize

  /**
   * Explicitly specify `null` to inherit weight from parent, otherwise default
   * to `regular`.
   */
  weight?: null | "regular" | "semibold"
  unstable_trackIn?: boolean
}

/**
 * The Serif typeface is used as the primary Artsy voice, guiding users through
 * flows, instruction, and communications.
 *
 * @example
 *
 * <Serif color="black10" size="3t" weight="semibold">Hi</Serif>
 */
export const Serif = createStyledText<SerifProps>("serif", (weight, italic) => {
  if (italic && weight && weight !== "regular") {
    throw new Error(`The serif font does not have an italic font with weight \`${weight}\``)
  }
  return _selectFontFamilyType(weight, italic)
})

export interface DisplayProps extends Partial<TextProps> {
  size: DisplaySize

  /**
   * Explicitly specify `null` to inherit weight from parent, otherwise default
   * to `regular`.
   */
  weight?: null | "regular"
}

/**
 * The Display typeface has limited utility and is in the process of being
 * phased out in most places. Ask your friendly neighborhood design team member
 * if you're unsure if it should be used.
 *
 * @example
 *
 * <Display color="black10" size="3t">Hi</Display>
 */
export const Display = createStyledText<DisplayProps>("display")

Sans.displayName = "Sans"
Serif.displayName = "Serif"
Display.displayName = "Display"

/**
 * The endash is used in ranges like `$10k – $20k`.
 * This export makes it easier to use in the code, without having to find
 * the character in unicode.
 * It is a different character to the regular minus, usually a bit longer.
 * (for reference: minus `-`, endash `–`)
 */
export const endash = "–"

// TODO: Remove this and put it as a prop on `Text`, after palette is absorbed in eigen.
export const _maxWidth = { width: "100%", maxWidth: 600, alignSelf: "center" }
