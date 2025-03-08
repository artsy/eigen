import { AnimatedView } from "app/Scenes/InfiniteDiscovery/Components/Swiper/AnimatedView"
import { useScreenWidthWithOffset } from "app/Scenes/InfiniteDiscovery/Components/Swiper/useScreenWidthWithOffset"
import { forwardRef, Key, ReactElement, useEffect, useImperativeHandle, useState } from "react"
import { View, ViewStyle } from "react-native"
import { Gesture, GestureDetector } from "react-native-gesture-handler"
import {
  Easing,
  Extrapolation,
  interpolate,
  runOnJS,
  SharedValue,
  useAnimatedReaction,
  useSharedValue,
  withTiming,
} from "react-native-reanimated"
import usePrevious from "react-use/lib/usePrevious"

/**
 * TODOS
 * - organize files
 * - integrate with InfiniteDiscovery
 * - to not render more than 2 swiped cards
 * - when closing the screen, swiped cards are being dragged
 * - remove gesture navigation
 */

type SwiperProps = {
  cards: ReactElement<{ key: Key }>[]
  isRewindRequested: SharedValue<boolean>
  onNewCardReached?: (key: Key) => void
  onRewind: (key: Key, wasSwiped?: boolean) => void
  onSwipe: (swipedKey: Key, nextKey: Key) => void
  containerStyle?: ViewStyle
} & (
  | { onTrigger?: never; swipedIndexCallsOnTrigger?: never }
  | { onTrigger: (activeIndex: number) => void; swipedIndexCallsOnTrigger: number }
)

export type SwiperRefProps = {
  swipeLeft: () => void
  swipeRight: () => void
}

export const Swiper = forwardRef<SwiperRefProps, SwiperProps>(
  (
    {
      cards,
      isRewindRequested,
      onNewCardReached,
      onRewind,
      onSwipe,
      onTrigger,
      swipedIndexCallsOnTrigger,
      containerStyle,
    },
    ref
  ) => {
    const width = useScreenWidthWithOffset()
    const [numberExtraCardsAdded, setNumberExtraCardsAdded] = useState(0)

    useImperativeHandle(ref, () => ({
      swipeLeft,
      swipeRight,
    }))

    const activeCardX = useSharedValue(0)
    const swipedCardX = useSharedValue(-width)
    // TODO: remove underscore
    const _activeIndex = useSharedValue(cards.length - 1)
    const swipedKeys = useSharedValue<Key[]>([])
    // a list of cards that the user has seen
    const seenCardKeys = useSharedValue<Key[]>([])

    const previousCards = usePrevious(cards)

    useEffect(() => {
      if (previousCards && cards.length < previousCards.length) {
        setNumberExtraCardsAdded(previousCards.length - cards.length)
      }
    }, [cards.length])

    useEffect(() => {
      if (numberExtraCardsAdded !== 0) {
        _activeIndex.value = _activeIndex.value + numberExtraCardsAdded
      }
    }, [cards.length, numberExtraCardsAdded])

    useAnimatedReaction(
      () => isRewindRequested.value,
      (current, previous) => {
        if (current && !previous) {
          const hasSwipedCards = _activeIndex.value + 1 < cards.length

          let lastSwipedCardKey = null

          // TODO: clean up this minefield of if-statements
          if (hasSwipedCards) {
            lastSwipedCardKey = cards[_activeIndex.value + 1].key
          }

          swipedCardX.value = withTiming(0, { duration: 200, easing: Easing.linear }, () => {
            if (hasSwipedCards) {
              swipedKeys.value = swipedKeys.value.slice(0, -1)
              _activeIndex.value = _activeIndex.value + 1
            }
            swipedCardX.value = -width
          })

          if (!!lastSwipedCardKey) {
            runOnJS(onRewind)(lastSwipedCardKey as Key, false)
          }

          isRewindRequested.value = false
        }
      }
    )

    const swipeLeft = () => {
      const swipedCardIndex = _activeIndex.value
      const swipedCardKey = cards[swipedCardIndex].key

      if (swipedCardKey) {
        activeCardX.value = withTiming(-width, { duration: 500, easing: Easing.linear }, () => {
          swipedKeys.value = [...swipedKeys.value, swipedCardKey]
          _activeIndex.value = _activeIndex.value - 1
          activeCardX.value = 0
          return
        })
      }
    }

    const swipeRight = () => {
      const hasSwipedCards = _activeIndex.value + 1 < cards.length

      swipedCardX.value = withTiming(0, { duration: 500, easing: Easing.linear }, () => {
        if (hasSwipedCards) {
          swipedKeys.value = swipedKeys.value.slice(0, -1)
          _activeIndex.value = _activeIndex.value + 1
        }
        swipedCardX.value = -width
      })
    }

    const pan = Gesture.Pan()
      .onChange(({ translationX }) => {
        // when swipe to the right
        if (translationX > 0) {
          swipedCardX.value = interpolate(
            translationX,
            [0, width],
            [-width, 0],
            Extrapolation.CLAMP
          )
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

        // TODO: confirm that we are fetching more cards on the 3rd, 8th, 13th... swipe
        if (isSwipeLeft && !isLastCard && _activeIndex.value === swipedIndexCallsOnTrigger) {
          runOnJS(onTrigger)(_activeIndex.value - 1)
        }

        const swipedCardIndex = _activeIndex.value
        const swipedCardKey = cards[swipedCardIndex].key

        if (isSwipeLeft && !isLastCard && swipedCardKey) {
          const nextCardIndex = swipedCardIndex - 1
          const nextCardKey = cards[nextCardIndex]?.key as Key

          // if this is the first time that the user has navigated to this card, record it
          if (nextCardKey && !seenCardKeys.value.includes(nextCardKey) && onNewCardReached) {
            seenCardKeys.value = [...seenCardKeys.value, nextCardKey]
            runOnJS(onNewCardReached)(nextCardKey)
          }

          activeCardX.value = withTiming(-width, { duration: 500, easing: Easing.linear }, () => {
            // TODO: maybe fix this if errors

            swipedKeys.value = [...swipedKeys.value, swipedCardKey]
            _activeIndex.value = _activeIndex.value - 1
            activeCardX.value = 0
            return
          })

          runOnJS(onSwipe)(swipedCardKey, nextCardKey)
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

        let lastSwipedCardKey = null

        // TODO: clean up this minefield of if-statements
        if (hasSwipedCards) {
          lastSwipedCardKey = cards[_activeIndex.value + 1].key
        }
        swipedCardX.value = withTiming(0, { duration: 200, easing: Easing.linear }, () => {
          if (hasSwipedCards) {
            swipedKeys.value = swipedKeys.value.slice(0, -1)
            _activeIndex.value = _activeIndex.value + 1
          }
          swipedCardX.value = -width
        })

        if (!!lastSwipedCardKey) {
          runOnJS(onRewind)(lastSwipedCardKey as Key)
        }
      })

    return (
      <GestureDetector gesture={pan}>
        <View style={containerStyle}>
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
)

const SWIPE_THRESHOLD = 100
