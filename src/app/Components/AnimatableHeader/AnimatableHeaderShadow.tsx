import { Box, useColor } from "palette"
import React from "react"
import Animated, { Extrapolate } from "react-native-reanimated"
import { useAnimatableHeaderContext } from "./AnimatableHeaderContext"

const SHADOW_SCROLL_OFFSET = 15
const SHADOW_CONTAINER_HEIGHT = 5

export const AnimatableHeaderShadow = () => {
  const { scrollOffsetY, headerHeight } = useAnimatableHeaderContext()
  const color = useColor()
  const shadowOpacity = Animated.interpolate(scrollOffsetY, {
    inputRange: [0, SHADOW_SCROLL_OFFSET],
    outputRange: [0, 0.1],
    extrapolate: Extrapolate.CLAMP,
  })

  const elevation = Animated.interpolate(scrollOffsetY, {
    inputRange: [0, SHADOW_SCROLL_OFFSET],
    outputRange: [0, 3],
    extrapolate: Extrapolate.CLAMP,
  })

  return (
    <Box
      paddingBottom={5}
      overflow="hidden"
      position="absolute"
      top={headerHeight - SHADOW_CONTAINER_HEIGHT}
      left={0}
      right={0}
      pointerEvents="none"
    >
      <Animated.View
        style={{
          width: "100%",
          height: SHADOW_CONTAINER_HEIGHT,
          backgroundColor: color("white100"),
          shadowColor: color("black100"),
          shadowOffset: {
            width: 0,
            height: 1,
          },
          shadowOpacity,
          shadowRadius: 3,
          elevation,
        }}
      />
    </Box>
  )
}
