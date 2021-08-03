import React from "react"
import { GestureResponderEvent, TouchableOpacity } from "react-native"
import { useTheme } from "../../Theme"
import { Flex, FlexProps } from "../Flex"
import { Text } from "../Text"

interface PillProps extends FlexProps {
  onPress?: (event: GestureResponderEvent) => void
}

export const Pill: React.FC<PillProps> = ({ children, style, onPress, ...other }) => {
  const { color, space } = useTheme()

  const content = (
    <Flex
      style={[
        {
          borderWidth: 1,
          borderColor: color("black60"),
          paddingHorizontal: space(1),
          justifyContent: 'center',
          height: 30,
        },
        style,
      ]}
      {...other}
    >
      <Text variant="small" numberOfLines={1}>{children}</Text>
    </Flex>
  )

  if (onPress) {
    return <TouchableOpacity onPress={onPress}>{content}</TouchableOpacity>
  }

  return content
}
