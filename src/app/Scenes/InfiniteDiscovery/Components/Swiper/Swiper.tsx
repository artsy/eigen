import { Text, useScreenDimensions } from "@artsy/palette-mobile"
import { FC, useEffect, useState } from "react"
import { View, ViewStyle } from "react-native"
import { Gesture, GestureDetector } from "react-native-gesture-handler"
import Animated, {
  Easing,
  Extrapolation,
  interpolate,
  runOnJS,
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
 * - organize files
 * - to not render more than 2 swiped cards
 * - integrate with InfiniteDiscovery
 * - when closing the screen, swiped cards are being dragged
 * - remove gesture navigation
 */

type SwiperProps = {
  initialCards: typeof _cards
  extraCards?: typeof _cards
} & (
  | { onTrigger?: never; swipedIndexCallsOnTrigger?: never }
  | { onTrigger: (activeIndex: number) => void; swipedIndexCallsOnTrigger: number }
)

export const Swiper: React.FC<SwiperProps> = ({
  initialCards,
  onTrigger,
  swipedIndexCallsOnTrigger,
}) => {
  const width = useScreenWidthWithOffset()
  const [cards, setCards] = useState(initialCards)
  const [numberExtraCardsAdded, setNumberExtraCardsAdded] = useState(0)
  const activeCardX = useSharedValue(0)
  const swipedCardX = useSharedValue(-width)
  // TODO: remove underscore
  const _activeIndex = useSharedValue(cards.length - 1)
  const swipedIds = useSharedValue<string[]>([])

  useEffect(() => {
    if (cards.length < initialCards.length) {
      setNumberExtraCardsAdded(initialCards.length - cards.length)
      setCards(initialCards)
    }
  }, [initialCards.length])

  useEffect(() => {
    if (numberExtraCardsAdded !== 0) {
      _activeIndex.value = _activeIndex.value + numberExtraCardsAdded
    }
  }, [cards.length, numberExtraCardsAdded])

  const pan = Gesture.Pan()
    .onChange(({ translationX }) => {
      // when swipe to the right
      if (translationX > 0) {
        swipedCardX.value = interpolate(translationX, [0, width], [-width, 0], Extrapolation.CLAMP)
      } else {
        activeCardX.value = translationX
      }
    })
    .onFinalize(({ translationX }) => {
      const swipeOverThreshold = Math.abs(translationX) > SWIPE_THRESHOLD

      if (!swipeOverThreshold) {
        activeCardX.value = withTiming(0)
        swipedCardX.value = withTiming(-width)
        return
      }

      // Swipe left
      const isSwipeLeft = translationX < 0
      const isLastCard = _activeIndex.value === 0
      if (isSwipeLeft && !isLastCard && _activeIndex.value === swipedIndexCallsOnTrigger) {
        runOnJS(onTrigger)(_activeIndex.value - 1)
      }
      if (isSwipeLeft && !isLastCard) {
        activeCardX.value = withTiming(-width, { duration: 500, easing: Easing.linear }, () => {
          // TODO: maybe fix this if errors
          swipedIds.value = [...swipedIds.value, cards[_activeIndex.value].id]
          _activeIndex.value = _activeIndex.value - 1
          activeCardX.value = 0
          return
        })

        return
      }
      // when it's the last card drag it back to the deck nicely
      if (isSwipeLeft && isLastCard) {
        activeCardX.value = withTiming(0, { duration: 200, easing: Easing.cubic })
        return
      }

      // Swipe right then brings the card back to the deck
      activeCardX.value = 0
      const hasSwipedCards = _activeIndex.value + 1 < cards.length
      swipedCardX.value = withTiming(0, { duration: 200, easing: Easing.linear }, () => {
        if (hasSwipedCards) {
          swipedIds.value = swipedIds.value.slice(0, -1)
          _activeIndex.value = _activeIndex.value + 1
        }
        swipedCardX.value = -width
      })
    })

  return (
    <GestureDetector gesture={pan}>
      <View>
        {cards.map((c, i) => {
          return (
            <AnimatedView
              index={i}
              card={c}
              activeCardX={activeCardX}
              activeIndex={_activeIndex}
              swipedIds={swipedIds}
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
  swipedIds: SharedValue<string[]>
  card: (typeof _cards)[number]
  style?: ViewStyle | ViewStyle[]
}
const AnimatedView: FC<AnimatedViewProps> = ({
  card,
  activeCardX,
  swipedCardX,
  activeIndex,
  index,
  swipedIds,
}) => {
  const { width: screenWidth } = useScreenDimensions()
  const width = useScreenWidthWithOffset()
  const _index = useSharedValue(index)
  const [visible, setVisible] = useState(true)

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
    if (index <= activeIndex.value - 2 && !swipedIds.value.includes(card.id)) {
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
    if (swipedIds.value.includes(card.id) && index !== activeIndex.value + 1) {
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
  //   if (swipedIds.value.slice(0, -2).includes(index)) {
  //     runOnJS(toggleVisible)(false)
  //     return
  //   }

  //   runOnJS(toggleVisible)(true)
  // }, [swipedIds])

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
      <Text>Artwork {card.id}</Text>
      <Text>Index {index}</Text>
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
