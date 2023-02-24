import { CloseIcon, HeartFillIcon, HeartIcon } from "@artsy/palette-mobile"
import { Touchable } from "palette"
import { useState } from "react"
import Animated, {
  Easing,
  Extrapolate,
  interpolate,
  useAnimatedStyle,
  useDerivedValue,
  useSharedValue,
  withTiming,
} from "react-native-reanimated"

interface ArtQuizButtonProps {
  variant: "Like" | "Dislike"
  onPress: () => void
}

const TimingConfig = { duration: 50, easing: Easing.linear }

export const ArtQuizButton = ({ variant, onPress }: ArtQuizButtonProps) => {
  const [isAnimating, setIsAnimating] = useState(false)
  const pressed = useSharedValue(false)
  const progress = useDerivedValue(() => {
    return pressed.value ? withTiming(1, TimingConfig) : withTiming(0, TimingConfig)
  })

  const animatedStyle = useAnimatedStyle(() => {
    const scale = interpolate(progress.value, [0, 1], [1, 1.25], Extrapolate.CLAMP)
    return {
      transform: [{ scale }],
    }
  })

  const hanldeOnPressIn = () => {
    setIsAnimating(true)
    pressed.value = true
  }

  const hanldeOnPressOut = () => {
    setIsAnimating(false)
    onPress()
    pressed.value = false
  }

  return (
    <Touchable onPressIn={hanldeOnPressIn} onPressOut={hanldeOnPressOut}>
      <Animated.View style={animatedStyle}>
        {variant === "Dislike" && <CloseIcon height={40} width={50} />}
        {variant === "Like" && isAnimating && <HeartFillIcon height={40} width={50} />}
        {variant === "Like" && !isAnimating && <HeartIcon height={40} width={50} />}
      </Animated.View>
    </Touchable>
  )
}
