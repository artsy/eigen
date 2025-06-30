import React, { useEffect } from "react"
import { ViewStyle } from "react-native"
import Animated, {
  interpolate,
  useSharedValue,
  withDelay,
  withTiming,
} from "react-native-reanimated"

export const FadeIn: React.FC<{
  delay?: number
  style?: ViewStyle
  slide?: boolean
  duration?: number
}> = ({ slide = true, delay = 0, children, style, duration = 300 }) => {
  const showing = useSharedValue(0)

  useEffect(() => {
    showing.value = withDelay(
      delay,
      withTiming(1, {
        duration,
      })
    )
  }, [])

  return (
    <Animated.View
      style={[
        {
          transform: [
            {
              translateY: slide ? interpolate(showing.value, [0, 1], [10, 0]) : 0,
            },
          ],
          opacity: showing,
        },
        style,
      ]}
    >
      {children}
    </Animated.View>
  )
}
