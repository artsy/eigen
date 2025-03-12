import { useScreenDimensions } from "@artsy/palette-mobile"
import { useScreenWidthWithOffset } from "app/Scenes/InfiniteDiscovery/Components/Swiper/useScreenWidthWithOffset"
import { FC, Key, ReactElement, useEffect } from "react"
import { ViewStyle } from "react-native"
import Animated, {
  Extrapolation,
  interpolate,
  SharedValue,
  useAnimatedStyle,
  useSharedValue,
} from "react-native-reanimated"

interface AnimatedViewProps {
  index: number
  activeCardX: SharedValue<number>
  swipedCardX: SharedValue<number>
  activeIndex: SharedValue<number>
  swipedKeys: SharedValue<Key[]>
  children: ReactElement<{ key: Key }>
  style?: ViewStyle | ViewStyle[]
  internalID: string
}

export const AnimatedView: FC<AnimatedViewProps> = ({
  internalID,
  activeCardX,
  swipedCardX,
  activeIndex,
  index,
  swipedKeys,
  children,
}) => {
  const { width: screenWidth } = useScreenDimensions()
  const width = useScreenWidthWithOffset()
  const _index = useSharedValue(index)

  useEffect(() => {
    if (index !== _index.value) {
      _index.value = index
    }
  }, [index])

  const topCardStyle = useAnimatedStyle(() => {
    if (activeIndex.value === index) {
      return {
        transform: [
          { translateX: Math.min(0, activeCardX.value) },
          {
            translateY:
              -Math.sin(
                interpolate(activeCardX.value, [0, -width], [0, Math.PI], Extrapolation.CLAMP)
              ) * ARC_RADIUSES[index % ARC_RADIUSES.length],
          },
          {
            rotate: `${interpolate(
              activeCardX.value,
              [0, -width],
              [0, -MAX_ROTATIONS[index % MAX_ROTATIONS.length]],
              Extrapolation.CLAMP
            )}deg`,
          },
        ],
        shadowOffset: { width: 0, height: 0 },
        shadowRadius: 12,
        shadowOpacity: interpolate(
          activeCardX.value,
          [0, -width],
          [0, MAX_SHADOW_OPACITY],
          Extrapolation.CLAMP
        ),
        elevation: interpolate(
          activeCardX.value,
          [0, -width],
          [0, MAX_ELEVATION],
          Extrapolation.CLAMP
        ),
      }
    }

    // reanimated doesn't reset shadow styles when returning {}
    return emptyShadowStyle
  })

  const secondCardStyle = useAnimatedStyle(() => {
    const indexOfTheSecondCard = activeIndex.value - 1

    if (index === indexOfTheSecondCard) {
      return {
        transform: [
          {
            scale: interpolate(activeCardX.value, [0, -width], [MIN_SCALE, 1], Extrapolation.CLAMP),
          },
        ],
        opacity: interpolate(activeCardX.value, [0, -width], [MIN_OPACITY, 1], Extrapolation.CLAMP),
      }
    }

    return {}
  })

  const unswipedCardStyle = useAnimatedStyle(() => {
    if (index <= activeIndex.value - 2 && !swipedKeys.value.includes(internalID as Key)) {
      return { opacity: 0 }
    }

    return {}
  })

  const lastSwipedCardStyle = useAnimatedStyle(() => {
    // if the card is the last swiped, respect the pan XY value
    if (index === activeIndex.value + 1) {
      return {
        transform: [
          { translateX: swipedCardX.value },
          {
            translateY:
              -Math.sin(
                interpolate(swipedCardX.value, [-width, 0], [Math.PI, 0], Extrapolation.CLAMP)
              ) * ARC_RADIUSES[index % ARC_RADIUSES.length],
          },
          {
            rotate: `${interpolate(
              swipedCardX.value,
              [-width, 0],
              [-MAX_ROTATIONS[index % MAX_ROTATIONS.length], 0],
              Extrapolation.CLAMP
            )}deg`,
          },
        ],
        shadowOffset: { width: 0, height: 0 },
        shadowRadius: 12,
        shadowOpacity: interpolate(
          swipedCardX.value,
          [-width, -width + 20, 0],
          [0, 0.13, 0],
          Extrapolation.CLAMP
        ),
        elevation: interpolate(swipedCardX.value, [-width, 0], [8, 0], Extrapolation.CLAMP),
      }
    }

    return {}
  })

  const swipedCardStyle = useAnimatedStyle(() => {
    if (swipedKeys.value.includes(internalID as Key) && index !== activeIndex.value + 1) {
      return { transform: [{ translateX: -width }, { translateY: 0 }] }
    }

    return {}
  })

  return (
    <Animated.View
      style={[
        topCardStyle,
        secondCardStyle,
        unswipedCardStyle,
        lastSwipedCardStyle,
        swipedCardStyle,
        {
          width: screenWidth,
          alignSelf: "center",
          position: "absolute",
          zIndex: index,
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
const MAX_ELEVATION = 8
const MIN_SCALE = 0.95
const MIN_OPACITY = 0.5

const emptyShadowStyle = {
  shadowOffset: { width: 0, height: 0 },
  shadowRadius: 0,
  shadowOpacity: 0,
  elevation: 0,
}
