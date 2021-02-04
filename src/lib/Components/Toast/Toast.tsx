import { useScreenDimensions } from "lib/utils/useScreenDimensions"
import { color, Flex, IconProps, Text, Touchable } from "palette"
import { Animated } from "react-native"
import React, { useEffect, useState } from "react"
import { Colors } from "react-native/Libraries/NewAppScreen"

export type ToastPlacement = "middle" | "top" | "bottom"
export interface ToastProps {
  id: string

  placement: ToastPlacement
  message: string

  onPress?: (id: string) => void
  Icon?: React.FC<IconProps>
}

export const Toast: React.FC<ToastProps> = ({ id, placement, message, onPress, Icon }) => {
  const [animation] = useState(new Animated.Value(0))
  const { width, height } = useScreenDimensions()

  if (placement === "middle") {
    return (
      <Flex position="absolute" alignItems="center" justifyContent="center">
        <Flex
          width={120}
          height={120}
          position="absolute"
          top={(height - 120) / 2}
          left={(width - 120) / 2}
          backgroundColor={color("black100")}
          opacity={0.9}
          borderRadius={5}
          overflow="hidden"
          alignItems="center"
          justifyContent="center"
          </Text>
        </Flex>
        {/* </Touchable> */}
      </Flex>
    )
  }

  return (
    <Flex position="absolute" bottom={70 * parseInt(id)} backgroundColor="white">
      <Touchable onPress={() => onPress !== undefined && onPress(id)}>
        <Text> WOW {message} </Text>
      </Touchable>
    </Flex>
  )
}
