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
  { color: "lightgreen", id: "5" },
  { color: "yellow", id: "4" },
  { color: "orange", id: "3" },
  { color: "lightblue", id: "2" },
  { color: "violet", id: "1" },
]

export const Swiper: React.FC<{}> = () => {
  const width = useScreenWidthWithOffset()
  const dragged = useSharedValue(false)
  const activeCardX = useSharedValue(0)
  const activeCardY = useSharedValue(0)
  const swipedCardX = useSharedValue(-width)
  const swipedCardY = useSharedValue(0)
  const _activeIndex = useSharedValue(_cards.length - 1)
  const swipedIndexes = useSharedValue<number[]>([])

  const pan = Gesture.Pan()
    .onStart(() => {
      dragged.value = true
    })
    .onChange(({ translationX, translationY }) => {
      if (translationX > 0) {
        swipedCardX.value = interpolate(
          translationX,
          [0, width / 4],
          [-width, 0],
          Extrapolation.CLAMP
        )
        swipedCardY.value = translationY
      } else {
        activeCardX.value = translationX
        activeCardY.value = translationY
      }
    })
    .onEnd(({ translationX }) => {
      dragged.value = false

      const swipeOverThreshold = Math.abs(translationX) > SWIPE_THRESHOLD

      if (!swipeOverThreshold) {
        activeCardX.value = withTiming(0)
        activeCardY.value = withTiming(0)
        swipedCardX.value = withTiming(-width)
        return
      }

      // Swipe left
      if (translationX < 0) {
        activeCardX.value = withTiming(-width, { easing: Easing.cubic }, () => {
          swipedIndexes.value = [...swipedIndexes.value, _activeIndex.value]
          _activeIndex.value = _activeIndex.value - 1
          activeCardX.value = 0
          activeCardY.value = 0
        })
        activeCardY.value = withTiming(0, { easing: Easing.cubic })

        return
      }

      // Swipe right then brings the card back to the deck
      activeCardX.value = 0
      activeCardY.value = 0
      swipedCardX.value = withTiming(0, { easing: Easing.cubic }, () => {
        swipedIndexes.value = swipedIndexes.value.slice(0, -1)
        _activeIndex.value = _activeIndex.value + 1
        swipedCardX.value = -width
        swipedCardY.value = 0
      })
      swipedCardY.value = withTiming(0, { easing: Easing.cubic })
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

  const ARC_RADIUS = 80
  const MAX_ROTATION = 8
  const MAX_SHADOW_OPACITY = 0.13
  const MAX_ELEVATION = 8
  const MIN_SCALE = 0.8
  const MIN_OPACITY = 0.3

  const topCardStyle = useAnimatedStyle(() => {
    if (activeIndex.value === index) {
      return {
        transform: [
          { translateX: Math.min(0, activeCardX.value) },
          {
            translateY:
              -Math.sin(
                interpolate(activeCardX.value, [0, -width], [0, Math.PI], Extrapolation.CLAMP)
              ) * ARC_RADIUS,
          },
          {
            rotate: `${interpolate(
              activeCardX.value,
              [0, -width],
              [0, -MAX_ROTATION],
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
    if (index === activeIndex.value - 1) {
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

  const remainingCardsInDeck = useAnimatedStyle(() => {
    if (index <= activeIndex.value - 2) {
      return { opacity: 0 }
    }
    return {}
  })

  const lastSwipedCardStyle = useAnimatedStyle(() => {
    // if the card is not swiped, no extra style
    if (!swipedIndexes.value.includes(index)) {
      return {}
    }

    // if the card is the last swiped, respect the pan XY value
    if (index === activeIndex.value + 1) {
      return {
        transform: [
          { translateX: swipedCardX.value },
          {
            translateY:
              -Math.sin(
                interpolate(swipedCardX.value, [-width, 0], [Math.PI, 0], Extrapolation.CLAMP)
              ) * ARC_RADIUS,
          },
          {
            rotate: `${interpolate(
              swipedCardX.value,
              [-width, 0],
              [-MAX_ROTATION, 0],
              Extrapolation.CLAMP
            )}deg`,
          },
        ],
        shadowOffset: { width: 0, height: 0 },
        shadowRadius: 12,
        shadowOpacity: interpolate(swipedCardX.value, [-width, 0], [0.13, 0], Extrapolation.CLAMP),
        elevation: interpolate(swipedCardX.value, [-width, 0], [8, 0], Extrapolation.CLAMP),
      }
    }

    // if the cards is swiped but not the last, keep it away
    return { transform: [{ translateX: -width }, { translateY: 0 }] }
  })

  return (
    <Animated.View
      style={[
        topCardStyle,
        secondCardStyle,
        remainingCardsInDeck,
        lastSwipedCardStyle,
        {
          width: screenWidth,
          height: screenWidth,
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
