import { useScreenDimensions } from "lib/utils/useScreenDimensions"
import { Flex, Text, Touchable } from "palette"
import { Animated } from "react-native"
import React, { useEffect, useState } from "react"

export interface ToastProps {
  id: string
  message: string
  onPress?: (id: string) => void
}

export const Toast: React.FC<ToastProps> = ({ id, message, onPress }) => {
  const [animation] = useState(new Animated.Value(0))
  const { width, height } = useScreenDimensions()

  return (
    <Flex position="absolute" bottom={70 * parseInt(id)} backgroundColor="white">
      <Touchable onPress={() => onPress !== undefined && onPress(id)}>
        <Text> WOW {message} </Text>
      </Touchable>
    </Flex>
  )
}
