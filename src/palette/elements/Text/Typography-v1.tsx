import React from "react"
import { TextProps } from "react-native"
import styled from "styled-components/native"
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
import { _test_THEMES, themeProps } from "../../Theme"
import { SansProps } from "./Sans"
import { SerifProps } from "./Serif"

export interface FullTextProps
  extends TextProps,
    ColorProps,
    FontSizeProps,
    LineHeightProps,
    MaxWidthProps,
    SpaceProps,
    StyledSystemDisplayProps,
    TextAlignProps,
    VerticalAlignProps {}

const BaseText = styled.Text<FullTextProps>`
  ${fontSize};
  ${lineHeight};
  ${color};
  ${display};
  ${maxWidth};
  ${space};
  ${textAlign};
  ${verticalAlign};
`

type FontWeights = SansProps["weight"] | SerifProps["weight"]

interface StyledTextProps extends Partial<FullTextProps> {
  size: any
  weight?: null | FontWeights
  italic?: boolean
}

const fontFamily = _test_THEMES.v2.fontFamily
type FontFamily = typeof fontFamily

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
export function createStyledText<P extends StyledTextProps>(fontType: keyof FontFamily) {
  return styled<React.ComponentType<P>>(
    ({ size, weight, italic, style: _style, ...textProps }: StyledTextProps) => {
      const fontFamilyString =
        fontFamily[fontType][weight ?? "regular"][italic ? "italic" : "normal"]
      if (fontFamilyString === null) {
        throw new Error(
          `Incompatible text style combination: {type: ${fontType}, weight: ${weight}, italic: ${!!italic}}`
        )
      }

      const fontMetrics = themeProps.typeSizes[fontType as "sans"][size as "4"]

      if (fontMetrics == null) {
        throw new Error(`"${size}" is not a valid size for ${fontType}`)
      }

      return (
        <BaseText
          style={[_style, { fontFamily: fontFamilyString, ...stripPx(fontMetrics) }]}
          {...textProps}
        />
      )
    }
  )``
}

function stripPx(fontMetrics: { fontSize: string; lineHeight: string }): {
  fontSize: number
  lineHeight: number
} {
  return {
    fontSize: Number(fontMetrics.fontSize.replace("px", "")),
    lineHeight: Number(fontMetrics.lineHeight.replace("px", "")),
  }
}

// TODO: Remove this and put it as a prop on `Text`, after palette is absorbed in eigen.
export const _maxWidth = { width: "100%", maxWidth: 600, alignSelf: "center" } as const
