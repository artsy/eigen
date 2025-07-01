import { DEFAULT_SCREEN_ANIMATION_DURATION } from "app/Components/constants"
import React, { useEffect } from "react"
import { ViewStyle } from "react-native"
import Animated, {
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withTiming,
} from "react-native-reanimated"

export const FadeIn: React.FC<{
  delay?: number
  style?: ViewStyle
  slide?: boolean
  duration?: number
}> = ({
  slide = true,
  delay = 0,
  children,
  style,
  duration = DEFAULT_SCREEN_ANIMATION_DURATION,
}) => {
  const showing = useSharedValue(0)

  useEffect(() => {
    showing.value = withDelay(
      delay,
      withTiming(1, {
        duration,
      })
    )
  }, [])

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateY: slide ? interpolate(showing.get(), [0, 1], [10, 0]) : 0 }],
      opacity: showing.get(),
    }
  })

  return <Animated.View style={[animatedStyle, style]}>{children}</Animated.View>
}
