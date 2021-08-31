import React from "react"
import { GestureResponderEvent, TouchableOpacity } from "react-native"
import { useTheme } from "../../Theme"
import { Flex, FlexProps } from "../Flex"
import { Text } from "../Text"

interface PillProps extends FlexProps {
  onPress?: (event: GestureResponderEvent) => void
  // if no variant is passed defaulting to textSquare
  variant?: "textRound"
  active?: boolean
}

export const Pill: React.FC<PillProps> = ({ children, style, variant, active = true, onPress, ...other }) => {
  const { colorV3, space } = useTheme()
  const borderColor = active ? colorV3("black60") : colorV3("black15")
  const borderRadius = variant === "textRound" ? 50 : 0
  const content = (
    <Flex
      style={[
        {
          borderWidth: 1,
          borderColor,
          paddingHorizontal: space(1),
          justifyContent: "center",
          height: 30,
          borderRadius,
        },
        style,
      ]}
      {...other}
    >
      <Text variant="small" numberOfLines={1}>
        {children}
      </Text>
    </Flex>
  )

  if (onPress) {
    return <TouchableOpacity onPress={onPress}>{content}</TouchableOpacity>
  }

  return content
}
