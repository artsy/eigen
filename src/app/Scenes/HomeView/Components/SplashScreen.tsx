import { ArtsyLogoBlackIcon, Flex } from "@artsy/palette-mobile"
import React, { useEffect, useState } from "react"
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from "react-native-reanimated"

const CONFIG = {
  duration: 2000,
  logoFadeDelay: 0,
  logoFadeDuration: 1000,
  screenFadeDuration: 400,
}

export const SplashScreen: React.FC = () => {
  const [showSplash, setShowSplash] = useState(true)

  const opacity = useSharedValue(1)
  const logoOpacity = useSharedValue(1)

  // Hide splash screen
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowSplash(false)
    }, CONFIG.duration)

    return () => clearTimeout(timer)
  }, [])

  useEffect(() => {
    // Fade out logo
    setTimeout(() => {
      logoOpacity.value = withTiming(0, { duration: CONFIG.logoFadeDuration })
    }, CONFIG.logoFadeDelay)

    // Fade out splash screen
    setTimeout(() => {
      opacity.value = withTiming(0, { duration: CONFIG.screenFadeDuration })
    }, CONFIG.duration - CONFIG.screenFadeDuration)
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
