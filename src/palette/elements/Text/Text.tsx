import { useTheme } from "palette"
import { isThemeV3, TextSizeV3 } from "palette/Theme"
import React from "react"
import { StyleProp, TextStyle } from "react-native"
import { Text as RNText, TextProps as RNTextProps } from "react-native"
import styled from "styled-components/native"
import { color, ColorProps, space, SpaceProps, typography, TypographyProps } from "styled-system"
import { useFontFamilyFor } from "./helpers"

export type TextProps = {
  size?: TextSizeV3
  italic?: boolean
  caps?: boolean
  weight?: "regular" | "medium"
} & RNTextProps &
  InnerStyledTextProps

export const Text: React.FC<TextProps> = ({
  size = "sm",
  italic = false,
  caps,
  weight = "regular",
  style,
  children,
  ...rest
}) => {
  const { theme } = useTheme()
  const fontFamily = useFontFamilyFor({ italic, weight })
  if (!isThemeV3(theme)) {
    return null
  }

  const nativeTextStyle: StyleProp<TextStyle> = [
    {
      fontFamily,
      ...theme.textTreatments[size],
    },
    caps ? { textTransform: "uppercase" } : {},
  ]

  return <InnerStyledText style={[nativeTextStyle, style]} children={children} {...rest} />
}

type InnerStyledTextProps = ColorProps & SpaceProps & TypographyProps
const InnerStyledText = styled(RNText)<InnerStyledTextProps>`
  ${color}
  ${space}
  ${typography}
`
