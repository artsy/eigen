import { useScreenDimensions } from "@artsy/palette-mobile"
import { useScreenWidthWithOffset } from "app/Scenes/InfiniteDiscovery/Components/Swiper/useScreenWidthWithOffset"
import { Key } from "react"
import { Platform, ViewStyle } from "react-native"
import Animated, {
  Extrapolation,
  interpolate,
  SharedValue,
  useAnimatedStyle,
  useDerivedValue,
} from "react-native-reanimated"

interface AnimatedViewProps {
  index: number
  activeCardX: SharedValue<number>
  swipedCardX: SharedValue<number>
  activeIndex: SharedValue<number>
  swipedKeys: SharedValue<Key[]>
  style?: ViewStyle | ViewStyle[]
  internalID: string
}

export const AnimatedView: React.FC<React.PropsWithChildren<AnimatedViewProps>> = ({
  children,
  activeCardX,
  swipedCardX,
  activeIndex,
  index,
  swipedKeys,
  internalID,
}) => {
  const { width: screenWidth } = useScreenDimensions()
  const width = useScreenWidthWithOffset()

  const isTopCard = useDerivedValue(() => activeIndex.value === index)
  const isSecondCard = useDerivedValue(() => activeIndex.value + 1 === index)
  const isSwiped = useDerivedValue(() => swipedKeys.value.includes(internalID as Key))
  const isThirdOrMoreCard = useDerivedValue(() => index > activeIndex.value + 1 && !isSwiped.value)
  const isLastSwiped = useDerivedValue(() => activeIndex.value - 1 === index)

  const transformX = useDerivedValue(() => {
    if (isTopCard.value) {
      return Math.min(0, activeCardX.value)
    }
    if (isLastSwiped.value) {
      return swipedCardX.value
    }
    if (isSwiped.value) {
      return -width
    }

    return 0
  })
  const transformY = useDerivedValue(() => {
    if (isTopCard.value) {
      return (
        -Math.sin(interpolate(activeCardX.value, [0, -width], [0, Math.PI], Extrapolation.CLAMP)) *
        ARC_RADIUSES[index % ARC_RADIUSES.length]
      )
    }
    if (isLastSwiped.value) {
      return (
        -Math.sin(interpolate(swipedCardX.value, [-width, 0], [Math.PI, 0], Extrapolation.CLAMP)) *
        ARC_RADIUSES[index % ARC_RADIUSES.length]
      )
    }

    return 0
  })

  const rotation = useDerivedValue(() =>
    isTopCard.value
      ? interpolate(
          activeCardX.value,
          [0, -width],
          [0, -MAX_ROTATIONS[index % MAX_ROTATIONS.length]],
          Extrapolation.CLAMP
        )
      : isLastSwiped.value
        ? interpolate(
            swipedCardX.value,
            [-width, 0],
            [-MAX_ROTATIONS[index % MAX_ROTATIONS.length], 0],
            Extrapolation.CLAMP
          )
        : 0
  )

  const shadowOpacity = useDerivedValue(() =>
    isTopCard.value
      ? interpolate(activeCardX.value, [0, -width], [0, MAX_SHADOW_OPACITY], Extrapolation.CLAMP)
      : isLastSwiped.value
        ? interpolate(
            swipedCardX.value,
            [-width, -width + 20, 0],
            [0, 0.13, 0],
            Extrapolation.CLAMP
          )
        : 0
  )

  const scale = useDerivedValue(() =>
    isSecondCard.value
      ? interpolate(activeCardX.value, [0, -width], [MIN_SCALE, 1], Extrapolation.CLAMP)
      : 1
  )

  const opacity = useDerivedValue(() =>
    isSecondCard.value
      ? interpolate(activeCardX.value, [0, -width], [MIN_OPACITY, 1], Extrapolation.CLAMP)
      : isThirdOrMoreCard.value
        ? 0
        : 1
  )

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      { translateX: transformX.value },
      { translateY: transformY.value },
      { rotate: `${rotation.value}deg` },
      { scale: scale.value },
    ],
    shadowRadius: 12,
    shadowOpacity: shadowOpacity.value,
    opacity: opacity.value,
  }))

  return (
    <Animated.View
      style={[
        animatedStyle,
        {
          shadowOffset: Platform.OS === "ios" ? { width: 0, height: 0 } : undefined,
          width: screenWidth,
          alignSelf: "center",
          position: "absolute",
          zIndex: 9999 - index,
        },
      ]}
    >
      {children}
    </Animated.View>
  )
}

const ARC_RADIUSES = [15, 23, 30]
const MAX_ROTATIONS = [5, 7, 9]
const MAX_SHADOW_OPACITY = 0.8
const MIN_SCALE = 0.95
const MIN_OPACITY = 0.5
