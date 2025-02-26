import { Text, useScreenDimensions } from "@artsy/palette-mobile"
import { FC } from "react"
import { View, ViewStyle } from "react-native"
import { Gesture, GestureDetector } from "react-native-gesture-handler"
import Animated, {
  Easing,
  Extrapolation,
  interpolate,
  SharedValue,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated"

const _cards = [
  { color: "green", id: "10" },
  { color: "red", id: "9" },
  { color: "blue", id: "8" },
  { color: "black", id: "7" },
  { color: "magenta", id: "6" },
  { color: "lightgreen", id: "5" },
  { color: "yellow", id: "4" },
  { color: "orange", id: "3" },
  { color: "lightblue", id: "2" },
  { color: "violet", id: "1" },
]
/**
 * TODOS
 * - add a prop to append more cards once we reach the 3rd
 * - organize files
 * - integrate with InfiniteDiscovery
 */
export const Swiper: React.FC<{ extraCards?: typeof _cards }> = ({
  extraCards: _extraCards = [],
}) => {
  const width = useScreenWidthWithOffset()
  const activeCardX = useSharedValue(0)
  const swipedCardX = useSharedValue(-width)
  const _activeIndex = useSharedValue(_cards.length - 1)
  const swipedIndexes = useSharedValue<number[]>([])

  const pan = Gesture.Pan()
    .onChange(({ translationX }) => {
      // when swipe to the right
      if (translationX > 0) {
        swipedCardX.value = interpolate(translationX, [0, width], [-width, 0], Extrapolation.CLAMP)
      } else {
        activeCardX.value = translationX
      }
    })
    .onEnd(({ translationX }) => {
      const swipeOverThreshold = Math.abs(translationX) > SWIPE_THRESHOLD

      if (!swipeOverThreshold) {
        activeCardX.value = withTiming(0)
        swipedCardX.value = withTiming(-width)
        return
      }

      // Swipe left
      if (translationX < 0) {
        activeCardX.value = withTiming(-width, { duration: 500, easing: Easing.linear }, () => {
          const theLastCardWasSwiped = _activeIndex.value === 0
          if (theLastCardWasSwiped) {
            // if the last card was swiped, keep it as the active card and bring it back
            activeCardX.value = withTiming(0, { easing: Easing.cubic })
            return
          }

          swipedIndexes.value = [...swipedIndexes.value, _activeIndex.value]
          _activeIndex.value = _activeIndex.value - 1
          activeCardX.value = 0
        })

        return
      }

      // Swipe right then brings the card back to the deck
      activeCardX.value = 0
      swipedCardX.value = withTiming(0, { duration: 200, easing: Easing.linear }, () => {
        if (_activeIndex.value + 1 < _cards.length) {
          swipedIndexes.value = swipedIndexes.value.slice(0, -1)
          _activeIndex.value = _activeIndex.value + 1
        }
        swipedCardX.value = -width
      })
    })

  return (
    <GestureDetector gesture={pan}>
      <View>
        {_cards.map((c, i) => {
          return (
            <AnimatedView
              index={i}
              card={c}
              activeCardX={activeCardX}
              activeIndex={_activeIndex}
              swipedIndexes={swipedIndexes}
              swipedCardX={swipedCardX}
              key={`card_${c.id}`}
            />
          )
        })}
      </View>
    </GestureDetector>
  )
}

interface AnimatedViewProps {
  index: number
  activeCardX: SharedValue<number>
  swipedCardX: SharedValue<number>
  activeIndex: SharedValue<number>
  swipedIndexes: SharedValue<number[]>
  card: (typeof _cards)[number]
  style?: ViewStyle | ViewStyle[]
}
const AnimatedView: FC<AnimatedViewProps> = ({
  card,
  activeCardX,
  swipedCardX,
  activeIndex,
  index,
  swipedIndexes,
}) => {
  const { width: screenWidth } = useScreenDimensions()
  const width = useScreenWidthWithOffset()
  // const [visible, setVisible] = useState(true)

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
    if (index <= activeIndex.value - 2 && !swipedIndexes.value.includes(index)) {
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
    if (swipedIndexes.value.includes(index) && index !== activeIndex.value + 1) {
      return { transform: [{ translateX: -width }, { translateY: 0 }] }
    }

    return {}
  })

  // Needs to be defined before any call of runOnJS
  // const toggleVisible = (_visible: boolean) => {
  //   if (visible === _visible) {
  //     return
  //   }

  //   setVisible(_visible)
  // }

  // do not render more than 2 swiped cards for performance reasons
  // useDerivedValue(() => {
  //   // do not render more than 2 swiped cards because of performance purposes
  //   if (swipedIndexes.value.slice(0, -2).includes(index)) {
  //     runOnJS(toggleVisible)(false)
  //     return
  //   }

  //   runOnJS(toggleVisible)(true)
  // }, [swipedIndexes])

  // if (!visible) {
  //   return null
  // }

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
          height: screenWidth + 200,
          backgroundColor: card.color,
          alignSelf: "center",
          position: "absolute",
          zIndex: index,
        },
      ]}
    >
      <Text>`Artwork ${card.id}`</Text>
    </Animated.View>
  )
}

const SWIPE_THRESHOLD = 100
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

const useScreenWidthWithOffset = () => {
  const { width } = useScreenDimensions()
  return width + 100
}
