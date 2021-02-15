import { SpaceProps } from "palette/helpers"
import { FontFamily, fontFamily } from "palette/platform/fonts/fontFamily"
import React from "react"
import { TextProps } from "react-native"
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
  textAlign,
  TextAlignProps,
  verticalAlign,
  VerticalAlignProps,
} from "styled-system"
import { styled as primitives, styledWrapper } from "../../platform/primitives"
import { SansSize, SerifSize, themeProps, TypeSizes } from "../../Theme"

/**
 * Spec: https://www.notion.so/artsy/Typography-d1f9f6731f3d47c78003d6d016c30221
 */

interface FullTextProps
  extends TextProps,
    ColorProps,
    FontSizeProps,
    LineHeightProps,
    MaxWidthProps,
    SpaceProps,
    StyledSystemDisplayProps,
    TextAlignProps,
    VerticalAlignProps {}

/** Base Text component for typography */
export const BaseText = primitives.Text<FullTextProps>`
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
}

/**
 * Any valid font weight
 */
export type FontWeights = SansProps["weight"] | SerifProps["weight"]

interface StyledTextProps extends Partial<FullTextProps> {
  size: SansSize | SerifSize
  weight?: null | FontWeights
  italic?: boolean
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
function createStyledText<P extends StyledTextProps>(fontType: keyof FontFamily) {
  return styledWrapper<React.ComponentType<P>>(
    ({ size, weight, italic, style: _style, ...textProps }: StyledTextProps) => {
      const fontFamilyString = fontFamily[fontType][weight ?? "regular"][italic ? "italic" : "normal"]
      if (fontFamilyString === null) {
        throw new Error(
          `Incompatible text style combination: {type: ${fontType}, weight: ${weight}, italic: ${!!italic}}`
        )
      }

      const fontMetrics = themeProps.typeSizes[fontType as "sans"][size as "4"]

      if (fontMetrics == null) {
        throw new Error(`"${size}" is not a valid size for ${fontType}`)
      }

      return <BaseText style={[_style, { fontFamily: fontFamilyString, ...stripPx(fontMetrics) }]} {...textProps} />
    }
  )``
}

function stripPx(fontMetrics: { fontSize: string; lineHeight: string }): { fontSize: number; lineHeight: number } {
  return {
    fontSize: Number(fontMetrics.fontSize.replace("px", "")),
    lineHeight: Number(fontMetrics.lineHeight.replace("px", "")),
  }
}

/**
 * Sans
 */

export interface SansProps extends Partial<FullTextProps> {
  italic?: boolean

  role?: string

  size: SansSize

  /**
   * Explicitly specify `null` to inherit weight from parent, otherwise default
   * to `regular`.
   */
  weight?: null | "regular" | "medium"
}

/**
 * The Sans typeface is used for presenting objective dense information
 * (such as tables) and intervening communications (such as error feedback).
 *
 * @example
 * <Sans color="black10" size="3t" weight="medium" italic>Hi</Sans>
 */
export const Sans = createStyledText<SansProps>("sans")

/**
 * Serif
 */

export interface SerifProps extends Partial<FullTextProps> {
  italic?: boolean

  size: SerifSize

  /**
   * Explicitly specify `null` to inherit weight from parent, otherwise default
   * to `regular`.
   */
  weight?: null | "regular" | "semibold"
}

/**
 * The Serif typeface is used as the primary Artsy voice, guiding users through
 * flows, instruction, and communications.
 *
 * @example
 * <Serif color="black10" size="3t" weight="semibold">Hi</Serif>
 */
export const Serif = createStyledText<SerifProps>("serif")

Sans.displayName = "Sans"
Serif.displayName = "Serif"

/**
 * The endash is used in ranges like `$10k – $20k`.
 * This export makes it easier to use in the code, without having to find
 * the character in unicode.
 * It is a different character to the regular minus, usually a bit longer.
 * (for reference: minus `-`, endash `–`)
 */
export const endash = "–"
export const bullet = "•"

// TODO: Remove this and put it as a prop on `Text`, after palette is absorbed in eigen.
export const _maxWidth = { width: "100%", maxWidth: 600, alignSelf: "center" } as const
