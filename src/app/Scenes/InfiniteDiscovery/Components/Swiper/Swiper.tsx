import { useScreenDimensions } from "@artsy/palette-mobile"
import { FC, Key, ReactElement, useEffect, useState } from "react"
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

/**
 * TODOS
 * - organize files
 * - to not render more than 2 swiped cards
 * - integrate with InfiniteDiscovery
 * - when closing the screen, swiped cards are being dragged
 * - remove gesture navigation
 */

type SwiperProps = {
  cards: ReactElement<{ key: Key }>[]
} & (
  | { onTrigger?: never; swipedIndexCallsOnTrigger?: never }
  | { onTrigger: (activeIndex: number) => void; swipedIndexCallsOnTrigger: number }
)

export const Swiper: React.FC<SwiperProps> = ({
  cards: _cards,
  onTrigger,
  swipedIndexCallsOnTrigger,
}) => {
  const width = useScreenWidthWithOffset()
  const [cards, setCards] = useState(_cards)
  const [numberExtraCardsAdded, setNumberExtraCardsAdded] = useState(0)
  const activeCardX = useSharedValue(0)
  const swipedCardX = useSharedValue(-width)
  // TODO: remove underscore
  const _activeIndex = useSharedValue(cards.length - 1)
  const swipedKeys = useSharedValue<Key[]>([])

  useEffect(() => {
    if (cards.length < _cards.length) {
      setNumberExtraCardsAdded(_cards.length - cards.length)
      setCards(_cards)
    }
  }, [_cards.length])

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
      const cardKey = cards[_activeIndex.value].key
      if (isSwipeLeft && !isLastCard && cardKey) {
        activeCardX.value = withTiming(-width, { duration: 500, easing: Easing.linear }, () => {
          // TODO: maybe fix this if errors

          swipedKeys.value = [...swipedKeys.value, cardKey]
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
          swipedKeys.value = swipedKeys.value.slice(0, -1)
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
              swipedKeys={swipedKeys}
              swipedCardX={swipedCardX}
              key={`card_${c.key}`}
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
  swipedKeys: SharedValue<Key[]>
  card: ReactElement<{ key: Key }>
  style?: ViewStyle | ViewStyle[]
}
const AnimatedView: FC<AnimatedViewProps> = ({
  card,
  activeCardX,
  swipedCardX,
  activeIndex,
  index,
  swipedKeys,
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
    if (index <= activeIndex.value - 2 && !swipedKeys.value.includes(card.key as Key)) {
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
    if (swipedKeys.value.includes(card.key as Key) && index !== activeIndex.value + 1) {
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
  //   if (swipedKeys.value.slice(0, -2).includes(index)) {
  //     runOnJS(toggleVisible)(false)
  //     return
  //   }

  //   runOnJS(toggleVisible)(true)
  // }, [swipedKeys])

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
          alignSelf: "center",
          position: "absolute",
          zIndex: index,
        },
      ]}
    >
      {card}
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
