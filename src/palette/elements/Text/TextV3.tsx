import { useTheme } from "palette"
import { isThemeV3, TextSizeV3 } from "palette/Theme"
import React from "react"
import { StyleProp, TextStyle } from "react-native"
import { Text as RNText } from "react-native"
import styled from "styled-components/native"
import { color, ColorProps, space, SpaceProps, typography, TypographyProps } from "styled-system"

type StyledTextProps = ColorProps & SpaceProps & TypographyProps
const StyledText = styled(RNText)<StyledTextProps>`
  ${color}
  ${space}
  ${typography}
`

export type TextProps = {
  size?: TextSizeV3
  italic?: boolean
  caps?: boolean
  weight?: "regular" | "medium"
} & StyledTextProps

export const Text: React.FC<TextProps> = ({
  size = "sm",
  italic = false,
  caps,
  weight = "regular",
  children,
  ...rest
}) => {
  const { theme } = useTheme()
  if (!isThemeV3(theme)) {
    return null
  }

  const nativeTextStyle: StyleProp<TextStyle> = [
    {
      fontFamily: theme.fonts.sans,
      fontWeight: weightMap[weight],
      ...theme.textTreatments[size],
    },
    caps ? { textTransform: "uppercase" } : {},
    italic ? { fontStyle: "italic" } : {},
  ]

  return <StyledText style={nativeTextStyle} children={children} {...rest} />
}

// based on:
// https://developer.mozilla.org/en-US/docs/Web/CSS/font-weight#common_weight_name_mapping
const weightMap: Record<Exclude<TextProps["weight"], undefined>, TextStyle["fontWeight"]> = {
  regular: "400",
  medium: "500",
}
