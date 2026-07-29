import { Flex } from "@artsy/palette-mobile"
import { ALWAYS_BLACK } from "app/utils/colors"
import { useScreenDimensions } from "app/utils/hooks"
import { MotiView } from "moti"
import { useEffect } from "react"
import { Image } from "react-native"
import { Easing, useReducedMotion } from "react-native-reanimated"
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

export const ARTWORKS_DURATION =
  ONBOARDING_IMAGES.length * IMG_DISPLAY_DURATION + LAST_IMG_DISPLAY_DURATION

interface ArtworkMontageStepProps {
  onNext: () => void
}

export const ArtworkMontageStep: React.FC<ArtworkMontageStepProps> = ({ onNext }) => {
  const { width: screenWidth } = useScreenDimensions()

  // Reduce Motion is an accessibility feature that users can enable, but it makes this artwork
  // montage look broken because it skips the transitions between each artwork and shows the last
  // artwork for the entire animation's duration.
  //
  // Reanimated's useReducedMotion() tells us whether the setting was on when the app launched.
  // It's synchronous and cached, so we know on the very first render whether to skip the
  // crossfade entirely — no async check, no loading state to juggle. The one thing it won't catch
  // is the user toggling the setting mid-session, since it's only read once at launch.
  const reduceMotionEnabled = useReducedMotion()

  useEffect(() => {
    if (reduceMotionEnabled) {
      onNext()
      return
    }

    const timer = setTimeout(onNext, ARTWORKS_DURATION)
    return () => clearTimeout(timer)
  }, [reduceMotionEnabled, onNext])

  if (reduceMotionEnabled) {
    return (
      <Flex flex={1} backgroundColor="mono100">
        <Logo />
      </Flex>
    )
  }

  return (
    <Flex flex={1} backgroundColor={ALWAYS_BLACK}>
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
