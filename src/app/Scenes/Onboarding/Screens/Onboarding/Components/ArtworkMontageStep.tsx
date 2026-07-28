import { Flex } from "@artsy/palette-mobile"
import { useScreenDimensions } from "app/utils/hooks"
import { MotiView } from "moti"
import { useEffect, useState } from "react"
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

export const REDUCE_MOTION_CHECK_TIMEOUT = 1000

interface ArtworkMontageStepProps {
  onNext: () => void
}

export const ArtworkMontageStep: React.FC<ArtworkMontageStepProps> = ({ onNext }) => {
  const { width: screenWidth } = useScreenDimensions()

  // Reduce Motion is an accessibility feature that users can enable, but it makes this artwork
  // montage look broken because it skips the transitions between each artwork and shows the last
  // artwork for the entire animation's duration.
  //
  // We can tell whether a user has Reduce Motion enabled by calling
  // AccessibilityInfo.isReduceMotionEnabled(), but it is an async function, so this component needs
  // to handle (1) the time that it takes to get a response, (2) the case where we learn that the
  // user has Reduce Motion enabled, or (3) the case where we learn that the user does not have it
  // enabled.
  //
  // The way that it does this is by showing a black screen with the Artsy logo while racing the
  // check for Reduce Motion against a short timeout. If the check times-out, we will assume that
  // the user does not have it enabled and start the artwork montage. If the check completes before
  // the timeout we will either start the artwork montage or skip it depending on the actual user's
  // setting.
  const [reduceMotionEnabled, setReduceMotionEnabled] = useState<boolean | null>(null)

  useEffect(() => {
    const giveUp = new Promise<boolean>((resolve) =>
      setTimeout(() => resolve(false), REDUCE_MOTION_CHECK_TIMEOUT)
    )

    Promise.race([AccessibilityInfo.isReduceMotionEnabled(), giveUp])
      .then(setReduceMotionEnabled)
      .catch(() => setReduceMotionEnabled(false))
  }, [])

  useEffect(() => {
    if (reduceMotionEnabled === null) {
      return
    }

    if (reduceMotionEnabled) {
      onNext()
      return
    }

    const timer = setTimeout(onNext, ARTWORKS_DURATION)
    return () => clearTimeout(timer)
  }, [reduceMotionEnabled, onNext])

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
