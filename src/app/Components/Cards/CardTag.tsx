import { useColor } from "@artsy/palette-mobile"
import { Color, Text } from "palette"
import { View, StyleProp, ViewStyle } from "react-native"
import { PositionProps } from "styled-system"

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
      <Text variant="xs" px={0.5} py={0.5} color={textColor}>
        {text}
      </Text>
    </View>
  )
}
