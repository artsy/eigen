import { useTheme } from "palette"
import { isThemeV3, TextSizeV3 } from "palette/Theme"
import React from "react"
import { StyleProp, TextStyle } from "react-native"
import { Text as RNText } from "react-native"

export interface TextProps {
  size?: TextSizeV3
  italic?: boolean
  caps?: boolean
}

export const Text: React.FC<TextProps> = ({ size = "s", italic = false, caps, children, ...rest }) => {
  const { theme } = useTheme()
  if (!isThemeV3(theme)) {
    return null
  }

  const nativeTextStyle: StyleProp<TextStyle> = [
    {
      fontFamily: theme.fonts.sans,
      fontWeight: "400",
      ...theme.textTreatments[size],
    },
    caps ? { textTransform: "uppercase" } : {},
    italic ? { fontStyle: "italic" } : {},
  ]

  console.log({ size, nativeTextStyle })

  // size={size} italic={italic} {...rest}

  return <RNText style={nativeTextStyle}>{children}</RNText>
}
