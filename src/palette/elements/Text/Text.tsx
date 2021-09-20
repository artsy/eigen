import { ColorV3, useTheme } from "palette"
import { TextSizeV3 } from "palette/Theme"
import React from "react"
import { StyleProp, TextStyle } from "react-native"
import { Text as RNText, TextProps as RNTextProps } from "react-native"
import styled from "styled-components/native"
import {
  color,
  ColorProps,
  fontSize,
  FontSizeProps,
  space,
  SpaceProps,
  typography,
  TypographyProps,
} from "styled-system"
import { useFontFamilyFor } from "./helpers"

export interface TextProps extends RNTextProps, InnerStyledTextProps {
  size?: TextSizeV3
  italic?: boolean
  caps?: boolean
  weight?: "regular" | "medium"
  maxChars?: number
}

export const Text: React.FC<TextProps> = React.forwardRef<RNText, TextProps>(
  ({ size = "sm", italic = false, caps, weight = "regular", style, children, ...rest }, ref) => {
    const { theme } = useTheme()
    const fontFamily = useFontFamilyFor({ italic, weight })

    const nativeTextStyle: StyleProp<TextStyle> = [caps ? { textTransform: "uppercase" } : {}]

    return (
      <InnerStyledText
        ref={ref}
        style={[...nativeTextStyle, style]}
        fontFamily={fontFamily}
        {...theme.textTreatments[size]}
        children={children}
        {...rest}
      />
    )
  }
)

type InnerStyledTextProps = ColorProps<any, ColorV3> & SpaceProps & TypographyProps & FontSizeProps
const InnerStyledText = styled(RNText)<InnerStyledTextProps>`
  ${color}
  ${space}
  ${typography}
  ${fontSize}
`
