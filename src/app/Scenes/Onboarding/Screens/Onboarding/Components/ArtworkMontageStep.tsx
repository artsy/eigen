import { Flex } from "@artsy/palette-mobile"
import { useScreenDimensions } from "app/utils/hooks"
import { MotiView } from "moti"
import { useEffect, useRef, useState } from "react"
import { AccessibilityInfo, Image } from "react-native"
import { Easing } from "react-native-reanimated"
import { Logo } from "./Logo"

const IMG_DISPLAY_DURATION = 500
const LAST_IMG_DISPLAY_DURATION = 600

const ONBOARDING_IMAGES = [
  require("images/OnboardingImage0AdesinaPaintingOfRechel.webp"),
  require("images/OnboardingImage1KatzYellowFlags.webp"),
  require("images/OnboardingImage2SuperFutureKidHazyDaisy2022.webp"),
  require("images/OnboardingImage3WangTheSnowflakeThatComesAlive.webp"),
  require("images/OnboardingImage4AndyWarholCow.webp"),
]

const ARTWORKS_DURATION =
  ONBOARDING_IMAGES.length * IMG_DISPLAY_DURATION + LAST_IMG_DISPLAY_DURATION

interface ArtworkMontageStepProps {
  onNext: () => void
}

export const ArtworkMontageStep: React.FC<ArtworkMontageStepProps> = ({ onNext }) => {
  const { width: screenWidth } = useScreenDimensions()
  const onNextRef = useRef(onNext)
  // null while we're checking; the montage only ever mounts once we know it's false
  const [reduceMotionEnabled, setReduceMotionEnabled] = useState<boolean | null>(null)

  useEffect(() => {
    onNextRef.current = onNext
  }, [onNext])

  useEffect(() => {
    AccessibilityInfo.isReduceMotionEnabled()
      .then(setReduceMotionEnabled)
      .catch(() => setReduceMotionEnabled(false))
  }, [])

  useEffect(() => {
    if (reduceMotionEnabled) {
      onNextRef.current()
    }
  }, [reduceMotionEnabled])

  useEffect(() => {
    if (reduceMotionEnabled !== false) {
      return
    }

    const timer = setTimeout(() => onNextRef.current(), ARTWORKS_DURATION)
    return () => clearTimeout(timer)
  }, [reduceMotionEnabled])

  if (reduceMotionEnabled !== false) {
    return (
      <Flex flex={1} backgroundColor="mono100">
        <Logo />
      </Flex>
    )
  }

  return (
    <Flex flex={1} backgroundColor="mono100">
      {ONBOARDING_IMAGES.map((image, index) => (
        <MotiView
          key={index}
          from={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          delay={index * IMG_DISPLAY_DURATION}
          transition={{ type: "timing", duration: IMG_DISPLAY_DURATION, easing: Easing.linear }}
          style={{ position: "absolute", height: "100%", width: screenWidth }}
        >
          <Image source={image} resizeMode="cover" style={{ height: "100%", width: screenWidth }} />
        </MotiView>
      ))}

      <Logo />
    </Flex>
  )
}
