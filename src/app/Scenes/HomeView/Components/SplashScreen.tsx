import { ArtsyLogoBlackIcon, Flex } from "@artsy/palette-mobile"
import { MotiView } from "moti"
import React, { useEffect, useState } from "react"

const CONFIG = {
  duration: 2400,
  logoFadeDelay: 0,
  logoFadeDuration: 1000,
  screenFadeDuration: 800,
}

export const SplashScreen: React.FC = () => {
  const [showSplash, setShowSplash] = useState(true)
  const [logoOpacityState, setLogoOpacityState] = useState(1)
  const [screenOpacityState, setScreenOpacityState] = useState(1)

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
      setLogoOpacityState(0)
    }, CONFIG.logoFadeDelay)

    // Fade out splash screen
    setTimeout(() => {
      setScreenOpacityState(0)
    }, CONFIG.duration - CONFIG.screenFadeDuration)
  }, [])

  if (!showSplash) {
    return null
  }

  return (
    <MotiView
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: "black",
        justifyContent: "center",
        alignItems: "center",
        zIndex: 100,
      }}
      animate={{ opacity: screenOpacityState }}
      transition={{
        type: "timing",
        duration: CONFIG.screenFadeDuration,
      }}
    >
      <Flex alignItems="center" justifyContent="center">
        <MotiView
          animate={{ opacity: logoOpacityState }}
          transition={{
            type: "timing",
            duration: CONFIG.logoFadeDuration,
          }}
        >
          <ArtsyLogoBlackIcon scale={1.08} fill="white100" />
        </MotiView>
      </Flex>
    </MotiView>
  )
}
