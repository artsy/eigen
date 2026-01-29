import { Flex } from "@artsy/palette-mobile"
import { InfiniteDiscoveryArtworkCard } from "app/Scenes/InfiniteDiscovery/Components/InfiniteDiscoveryArtworkCard"
import { AnimatedView } from "app/Scenes/InfiniteDiscovery/Components/Swiper/AnimatedView"
import { useScreenWidthWithOffset } from "app/Scenes/InfiniteDiscovery/Components/Swiper/useScreenWidthWithOffset"
import { InfiniteDiscoveryArtwork } from "app/Scenes/InfiniteDiscovery/InfiniteDiscovery"
import { forwardRef, Key, useEffect, useImperativeHandle, useState } from "react"
import { View, ViewStyle } from "react-native"
import { Gesture, GestureDetector } from "react-native-gesture-handler"
import {
  Easing,
  Extrapolation,
  interpolate,
  runOnJS,
  useAnimatedReaction,
  useSharedValue,
  withDelay,
  withSequence,
  withTiming,
} from "react-native-reanimated"

type SwiperProps = {
  cards: InfiniteDiscoveryArtwork[]
  cardStyle?: ViewStyle
  containerStyle?: ViewStyle
  HeaderComponent?: () => React.ReactNode
  isArtworkSaved?: (index: number) => boolean
  onNewCardReached?: (key: Key) => void
  onRewind: (key: Key) => void
  onSwipe: (swipedKey: Key, nextKey: Key) => void
} & (
  | { onReachTriggerIndex?: never; triggerIndex?: never }
  | { onReachTriggerIndex: (activeIndex: number) => void; triggerIndex: number }
)

export type SwiperRefProps = {
  swipeLeftThenRight: (duration: number) => void
}

export const Swiper = forwardRef<SwiperRefProps, SwiperProps>(
  (
    {
      cards: _cards,
      cardStyle,
      containerStyle,
      HeaderComponent,
      isArtworkSaved,
      onNewCardReached,
      onReachTriggerIndex,
      onRewind,
      onSwipe,
      triggerIndex,
    },
    ref
  ) => {
    const width = useScreenWidthWithOffset()
    const activeCardX = useSharedValue(0)
    const [cards, setCards] = useState(_cards)
    const swipedCardX = useSharedValue(-width)
    const _activeIndex = useSharedValue(0)
    const [activeIndex, setActiveIndex] = useState(_activeIndex.value)

    const swipedKeys = useSharedValue<Key[]>([])
    // a list of cards that the user has seen
    const seenCardKeys = useSharedValue<Key[]>([])

    const initialSliceIndex = Math.max(activeIndex - 2, 0)

    // update the activeIndex state given changes on _activeIndex shared value
    useAnimatedReaction(
      () => _activeIndex.value,
      (current, previous) => {
        if (current !== previous) {
          runOnJS(setActiveIndex)(current)
        }
      }
    )

    useImperativeHandle(ref, () => ({ swipeLeftThenRight }))

    useEffect(() => {
      if (cards.length < _cards.length) {
        setCards(_cards)
      }
    }, [_cards.length])

    const swipeLeftThenRight = (duration: number) => {
      const swipedCardIndex = _activeIndex.value
      const swipedCardKey = cards[swipedCardIndex]?.internalID

      if (swipedCardKey) {
        activeCardX.value = withSequence(
          withTiming(-width / 3, {
            duration: duration / 2,
            easing: Easing.bezier(0.25, 0.1, 0.25, 1),
          }),

          withDelay(
            300,
            withTiming(0, { duration: duration / 2, easing: Easing.bezier(0.25, 0.1, 0.25, 1) })
          )
        )
      }
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
        const dragCardBackToTheDeck = () => {
          activeCardX.value = withTiming(0)
          swipedCardX.value = withTiming(-width)
        }

        const swipeLeft = (swipedCardKey: string, swipedCardIndex: number) => {
          const nextCardIndex = swipedCardIndex + 1
          const nextCardKey = cards[nextCardIndex]?.internalID as Key

          // if this is the first time that the user has navigated to this card, record it
          if (nextCardKey && !seenCardKeys.value.includes(nextCardKey) && onNewCardReached) {
            seenCardKeys.value = [...seenCardKeys.value, nextCardKey]
            runOnJS(onNewCardReached)(nextCardKey)
          }

          activeCardX.value = withTiming(-width, { duration: 300, easing: Easing.linear }, () => {
            swipedKeys.value = [...swipedKeys.value, swipedCardKey]
            _activeIndex.value = _activeIndex.value + 1
            activeCardX.value = 0
            return
          })

          runOnJS(onSwipe)(swipedCardKey, nextCardKey)
        }

        const swipeRight = () => {
          // Swipe right then brings the card back to the deck
          activeCardX.value = 0
          const hasSwipedCards = _activeIndex.value > 0

          if (hasSwipedCards) {
            const lastSwipedCardKey = cards[_activeIndex.value - 1].internalID
            swipedCardX.value = withTiming(
              0,
              { duration: 400, easing: Easing.out(Easing.cubic) },
              () => {
                swipedKeys.value = swipedKeys.value.slice(0, -1)
                _activeIndex.value = _activeIndex.value - 1
                swipedCardX.value = -width
              }
            )
            runOnJS(onRewind)(lastSwipedCardKey as Key)
            return
          }

          swipedCardX.value = withTiming(
            0,
            { duration: 400, easing: Easing.out(Easing.cubic) },
            () => {
              swipedCardX.value = -width
            }
          )
        }

        const swipeOverThreshold = Math.abs(translationX) > SWIPE_THRESHOLD

        if (!swipeOverThreshold) {
          dragCardBackToTheDeck()
          return
        }

        const isSwipeLeft = translationX < 0
        const isLastCard = _activeIndex.value === cards.length - 1

        // Fetching more cards on the 3rd, 8th, 13th... swipe
        if (isSwipeLeft && !isLastCard && cards.length - 1 - _activeIndex.value === triggerIndex) {
          runOnJS(onReachTriggerIndex)(_activeIndex.value + 1)
        }

        const swipedCardIndex = _activeIndex.value
        const swipedCardKey = cards[swipedCardIndex].internalID

        if (isSwipeLeft && !isLastCard && swipedCardKey) {
          swipeLeft(swipedCardKey, swipedCardIndex)
          return
        }

        if (isSwipeLeft && isLastCard) {
          dragCardBackToTheDeck()
          return
        }

        swipeRight()
      })

    return (
      <GestureDetector gesture={pan}>
        <View style={containerStyle}>
          {!!HeaderComponent && <HeaderComponent />}
          <Flex>
            {cards.map((c, i) => {
              if (i < initialSliceIndex) {
                return null
              }

              return (
                <AnimatedView
                  index={i}
                  activeCardX={activeCardX}
                  activeIndex={_activeIndex}
                  swipedKeys={swipedKeys}
                  swipedCardX={swipedCardX}
                  key={c.internalID}
                  internalID={c.internalID}
                >
                  <InfiniteDiscoveryArtworkCard
                    artwork={c}
                    key={c.internalID}
                    containerStyle={cardStyle}
                    isSaved={isArtworkSaved ? isArtworkSaved(i) : undefined}
                    index={i}
                    isTopCard={activeIndex === i}
                  />
                </AnimatedView>
              )
            })}
          </Flex>
        </View>
      </GestureDetector>
    )
  }
)

const SWIPE_THRESHOLD = 30
