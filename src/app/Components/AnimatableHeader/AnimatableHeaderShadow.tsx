import { Box, useColor } from "palette"
import Animated, { Extrapolate, interpolate, useAnimatedStyle } from "react-native-reanimated"
import { useAnimatableHeaderContext } from "./AnimatableHeaderContext"

const SHADOW_SCROLL_OFFSET = 15
const SHADOW_CONTAINER_HEIGHT = 5

export const AnimatableHeaderShadow = () => {
  const { scrollOffsetY, headerHeight } = useAnimatableHeaderContext()
  const color = useColor()

  const shadowAnim = useAnimatedStyle(() => ({
    shadowOpacity: interpolate(
      scrollOffsetY.value,
      [0, SHADOW_SCROLL_OFFSET],
      [0, 0.1],
      Extrapolate.CLAMP
    ),
    elevation: interpolate(
      scrollOffsetY.value,
      [0, SHADOW_SCROLL_OFFSET],
      [0, 3],
      Extrapolate.CLAMP
    ),
  }))

  return (
    <Box
      paddingBottom={6}
      overflow="hidden"
      position="absolute"
      top={headerHeight - SHADOW_CONTAINER_HEIGHT}
      left={0}
      right={0}
      pointerEvents="none"
    >
      <Animated.View
        style={[
          {
            width: "100%",
            height: SHADOW_CONTAINER_HEIGHT,
            backgroundColor: color("white100"),
            shadowColor: color("black100"),
            shadowOffset: {
              width: 0,
              height: 1,
            },
            shadowRadius: 3,
          },
          shadowAnim,
        ]}
      />
    </Box>
  )
}
