import { Flex, Text, Touchable } from "palette"
import React from "react"
import { Animated } from "react-native"

export interface ToastProps {
  id: string
  message: string
}
  return (
    <Flex position="absolute" bottom={200}>
      <Text> WOW {message}</Text>
    </Flex>
  )
}
