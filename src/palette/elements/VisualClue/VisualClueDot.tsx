import { Flex, useColor } from "palette"
import React, { useEffect, useRef } from "react"
import { Animated } from "react-native"

const DOT_DIAMETER = 6
const ANIMATION_DURATION = 1600

export const VisualClueDot: React.FC = () => {
  const scaleAnimation = useRef(new Animated.Value(1))
  const opacityAnimation = useRef(new Animated.Value(1))

  const color = useColor()

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(scaleAnimation.current, {
          toValue: 3,
          duration: ANIMATION_DURATION,
          useNativeDriver: true,
        }),
        Animated.timing(scaleAnimation.current, {
          toValue: 1,
          duration: 0,
          useNativeDriver: true,
        }),
      ])
    ).start()

    Animated.loop(
      Animated.sequence([
        Animated.timing(opacityAnimation.current, {
          toValue: 0.14,
          duration: ANIMATION_DURATION / 2,
          useNativeDriver: true,
        }),
        Animated.timing(opacityAnimation.current, {
          toValue: 0,
          duration: ANIMATION_DURATION / 2,
          useNativeDriver: true,
        }),
      ])
    ).start()
  }, [])

  return (
    <Flex
      style={{
        height: DOT_DIAMETER,
        minWidth: DOT_DIAMETER,
        borderRadius: DOT_DIAMETER / 2,
        backgroundColor: color("blue100"),
      }}
    >
      <Animated.View
        style={{
          height: DOT_DIAMETER,
          minWidth: DOT_DIAMETER,
          borderRadius: DOT_DIAMETER / 2,
          backgroundColor: color("blue100"),
          transform: [{ scale: scaleAnimation.current }],
          opacity: opacityAnimation.current,
        }}
      />
    </Flex>
  )
}
