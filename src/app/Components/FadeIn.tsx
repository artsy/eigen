import { DEFAULT_SCREEN_ANIMATION_DURATION } from "app/Components/constants"
import React, { useEffect, useRef } from "react"
import { Animated, ViewStyle } from "react-native"

export const FadeIn: React.FC<
  React.PropsWithChildren<{
    delay?: number
    style?: ViewStyle
    slide?: boolean
    duration?: number
  }>
> = ({
  slide = true,
  delay = 0,
  children,
  style,
  duration = DEFAULT_SCREEN_ANIMATION_DURATION,
}) => {
  const animatedValue = useRef(new Animated.Value(0)).current

  useEffect(() => {
    Animated.timing(animatedValue, {
      toValue: 1,
      duration,
      delay,
      useNativeDriver: true,
    }).start()
  }, [animatedValue, delay, duration])

  const translateY = slide
    ? animatedValue.interpolate({
        inputRange: [0, 1],
        outputRange: [10, 0],
      })
    : 0

  return (
    <Animated.View
      style={[
        {
          opacity: animatedValue,
          transform: [{ translateY }],
        },
        style,
      ]}
    >
      {children}
    </Animated.View>
  )
}
