import React from "react"
import { View } from "react-native"
import { StyleProp, ViewStyle } from "react-native"
import { PositionProps } from "styled-system"
import { useColor } from "../../hooks"
import { Color } from "../../Theme"
import { Sans } from "../Text"

export interface CardTagProps extends PositionProps {
  text: string
  textColor: Color
  color: Color
  borderColor?: Color
  style?: StyleProp<ViewStyle>
}

/**
 * `CardTag` is used for the Cards, and is controlled by their `tag` prop.
 */
export const CardTag: React.FC<CardTagProps> = ({
  text,
  textColor,
  color: bgColor,
  borderColor,
  style,
}) => {
  const color = useColor()
  return (
    <View
      style={[
        { borderRadius: 2, overflow: "hidden", borderWidth: 1 },
        style,
        {
          backgroundColor: color(bgColor),
          borderColor: !!borderColor ? color(borderColor) : undefined,
        },
      ]}
    >
      <Sans size="2" px={0.5} py={0.3} color={textColor}>
        {text}
      </Sans>
    </View>
  )
}
