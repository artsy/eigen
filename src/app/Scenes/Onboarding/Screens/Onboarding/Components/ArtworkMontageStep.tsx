import { Flex } from "@artsy/palette-mobile"
import { useScreenDimensions } from "app/utils/hooks"
import { useEffect, useRef, useState } from "react"
import { AccessibilityInfo, Image, ImageSourcePropType, ViewStyle } from "react-native"
import Animated, {
  cancelAnimation,
  Easing,
  runOnJS,
  SharedValue,
  useAnimatedStyle,
  useSharedValue,
  withSequence,
  withTiming,
} from "react-native-reanimated"
import { Logo } from "./Logo"

const AnimatedFlex = Animated.createAnimatedComponent(Flex)

const IMG_DISPLAY_DURATION = 500
const LAST_IMG_DISPLAY_DURATION = 600

const ONBOARDING_IMAGES = [
  require("images/OnboardingImage0AdesinaPaintingOfRechel.webp"),
  require("images/OnboardingImage1KatzYellowFlags.webp"),
  require("images/OnboardingImage2SuperFutureKidHazyDaisy2022.webp"),
  require("images/OnboardingImage3WangTheSnowflakeThatComesAlive.webp"),
  require("images/OnboardingImage4AndyWarholCow.webp"),
]

interface ArtworkMontageStepProps {
  onNext: () => void
}

const ImageFadeLayer = ({
  index,
  progress,
  screenWidth,
  source,
}: {
  index: number
  progress: SharedValue<number>
  screenWidth: number
  source: ImageSourcePropType
}) => {
  const animatedStyle = useAnimatedStyle(() => {
    "worklet"
    return { opacity: progress.get() - (index + 1) }
  })

  return (
    <AnimatedFlex
      position="absolute"
      height="100%"
      width={screenWidth}
      style={animatedStyle as ViewStyle}
    >
      <Image source={source} resizeMode="cover" style={{ height: "100%", width: screenWidth }} />
    </AnimatedFlex>
  )
}

export const ArtworkMontageStep: React.FC<ArtworkMontageStepProps> = ({ onNext }) => {
  const { width: screenWidth } = useScreenDimensions()
  const progress = useSharedValue(1)
  const onNextRef = useRef(onNext)
  // null while we're checking; the montage only ever mounts once we know it's false
  const [reduceMotionEnabled, setReduceMotionEnabled] = useState<boolean | null>(null)

  useEffect(() => {
    onNextRef.current = onNext
  }, [onNext])

  useEffect(() => {
    AccessibilityInfo.isReduceMotionEnabled().then(setReduceMotionEnabled)
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

    const timings = ONBOARDING_IMAGES.map((_, index) => {
      const isLastImage = index === ONBOARDING_IMAGES.length - 1
      const config = {
        duration: isLastImage ? LAST_IMG_DISPLAY_DURATION : IMG_DISPLAY_DURATION,
        easing: Easing.linear,
      }

      if (!isLastImage) {
        return withTiming(index + 2, config)
      }

      return withTiming(index + 2, config, (finished) => {
        if (finished) {
          runOnJS(onNextRef.current)()
        }
      })
    })

    progress.set(() => withSequence(...timings))

    return () => cancelAnimation(progress)
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
        <ImageFadeLayer
          key={index}
          index={index}
          progress={progress}
          screenWidth={screenWidth}
          source={image}
        />
      ))}

      <Logo />
    </Flex>
  )
}
