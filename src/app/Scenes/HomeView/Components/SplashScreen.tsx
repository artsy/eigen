import { ArtsyLogoBlackIcon, Flex } from "@artsy/palette-mobile"
import React, { useEffect, useState } from "react"
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from "react-native-reanimated"

export const SplashScreen: React.FC = () => {
  const [showSplash, setShowSplash] = useState(true)

  const opacity = useSharedValue(1)
  const logoOpacity = useSharedValue(1)

  // Hide splash screen after 2.6 second
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowSplash(false)
    }, 2600)

    return () => clearTimeout(timer)
  }, [])

  // Start animation on mount
  useEffect(() => {
    // Fade out logo after 400ms
    setTimeout(() => {
      logoOpacity.value = withTiming(0, { duration: 1400 })
    }, 400)

    // Fade out splash screen after 2s
    setTimeout(() => {
      opacity.value = withTiming(0, { duration: 600 })
    }, 2000)
  }, [])

  const animatedStyle = useAnimatedStyle(() => {
    return {
      opacity: opacity.value,
    }
  })

  const animatedLogoStyle = useAnimatedStyle(() => {
    return {
      opacity: logoOpacity.value,
    }
  })

  if (!showSplash) {
    return null
  }

  return (
    <Animated.View
      style={[
        {
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: "black",
          justifyContent: "center",
          alignItems: "center",
          zIndex: 100,
        },
        animatedStyle,
      ]}
    >
      <Flex alignItems="center" justifyContent="center">
        <Animated.View style={animatedLogoStyle}>
          <ArtsyLogoBlackIcon scale={1.08} fill="white100" />
        </Animated.View>
      </Flex>
    </Animated.View>
  )
}
