import { AnimatedView } from "app/Scenes/InfiniteDiscovery/Components/Swiper/AnimatedView"
import { useScreenWidthWithOffset } from "app/Scenes/InfiniteDiscovery/Components/Swiper/useScreenWidthWithOffset"
import React, { Key, ReactElement, useEffect, useState } from "react"
import { View } from "react-native"
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

type SwiperProps = {
  cards: ReactElement<{ key: Key }>[]
  isRewindRequested: SharedValue<boolean>
  onNewCardReached?: (key: Key) => void
  onRewind: (key: Key, wasSwiped?: boolean) => void
  onSwipe: (swipedKey: Key, nextKey: Key) => void
} & (
  | { onTrigger?: never; swipedIndexCallsOnTrigger?: never }
  | { onTrigger: (activeIndex: number) => void; swipedIndexCallsOnTrigger: number }
)

export const Swiper: React.FC<SwiperProps> = ({
  cards,
  isRewindRequested,
  onNewCardReached,
  onRewind,
  onSwipe,
  onTrigger,
  swipedIndexCallsOnTrigger,
}) => {
  const width = useScreenWidthWithOffset()
  // const [readingWindowLastIndex, setReadingWindowLastIndex] = useState(0)
  // const [readingWindowInitialIndex, setReadingWindowInitialIndex] = useState(0)

  // Horizontal position of the TOP card.
  const activeCardX = useSharedValue(0)

  // Horizontal position of the LAST SWIPED card.
  const swipedCardX = useSharedValue(-width)

  // Index of the TOP card.
  const activeIndex = useSharedValue(-1)

  // IDs of the artworks that the user has swiped LEFT.
  const swipedKeys = useSharedValue<Key[]>([])

  // IDs of the artworks that have been displayed to the user as the TOP card.
  const seenCardKeys = useSharedValue<Key[]>([])

  // Number of cards that have been loaded. Helps us update TOP card index when new cards are loaded.
  const [cardCount, setCardCount] = useState(0)

  // 1st
  //  - no cards maybe
  //  - receive new cards(reverse them) and update state and activeIndex
  //  - we set the reading window of the state

  // 2nd - swiping
  //  - animation
  //  - updating reading window

  // 3rd - fetching more data
  //  - check if we got more data (diff between cards props and cards state length)
  //    [3, 2, 1] (more data) => [6, 5, 4] + [3, 2, 1]
  //    activeIndex = 1       => activeIndex = activeIndex + newBatchLength
  //  - change the reading window to cover the maximum artworks rendered

  // endRange = Math.min(animals.length - 1, activeIndex + 2)
  // initialRange = Math.max(activeIndex - (cardsBuffer - (endRange - activeIndex) - 1), 0)
  // animals.slice(initialRange, endRange + 1)

  // const setReadingWindow = (activeIndex: number) => {
  //   // swiped cards after activeIndex, maximum of 2 always
  //   const endRange = Math.min(cards.length - 1, activeIndex + 2)
  //   // Grab left elements of the array respecting the maximumCardsRedered, -1 represents the activeCard
  //   const initialRange = Math.max(
  //     activeIndex - (maximumCardsRendered - (endRange - activeIndex) - 1),
  //     0
  //   )
  //   readingWindowInitialIndex.current = initialRange
  //   readingWindowLastIndex.current = endRange
  //   console.log(
  //     `🪩\t🦊\treading range:\tfrom ${initialRange} to ${endRange}, activeIndex -> ${activeIndex}`
  //   )
  // }

  useEffect(() => {
    cards.forEach((card, index) => console.log(`🪩\t🦊\t${index}\t${card.key}`))

    if (cards.length === 0) {
      return
    }

    if (activeIndex.value === -1) {
      /**
       * Initialize the index of the TOP card when the first batch of cards is loaded.
       */
      console.log(`🪩\t🦊\tactive index:\t${activeIndex.value} -> ${cards.length - 1}`)
      const newActiveIndex = cards.length - 1
      activeIndex.value = newActiveIndex
      // setReadingWindow(newActiveIndex)

      setCardCount(cards.length)
      return
    }

    if (cards.length > cardCount) {
      /**
       * Bump the index of the TOP card when a new batch of cards is loaded.
       */
      console.log(
        `🪩\t🦊\tactive index:\t${activeIndex.value} -> ${
          activeIndex.value + (cards.length - cardCount)
        }`
      )
      const newActiveIndex = activeIndex.value + (cards.length - cardCount)
      activeIndex.value = newActiveIndex
      // setReadingWindow(newActiveIndex)
      setCardCount(cards.length)
      return
    }
  }, [cards])

  useAnimatedReaction(
    () => isRewindRequested.value,
    (current, previous) => {
      if (current && !previous) {
        const hasSwipedCards = activeIndex.value + 1 < cards.length

        let lastSwipedCardKey = null

        if (hasSwipedCards) {
          lastSwipedCardKey = cards[activeIndex.value + 1].key
        }

        swipedCardX.value = withTiming(0, { duration: 200, easing: Easing.linear }, () => {
          /**
           * If the user tapped RIGHT, move the LAST SWIPED card to the center and tell the parent component that there is a new TOP card.
           *
           * TODO: Explain why the the nested if-statement is necessary.
           */
          if (hasSwipedCards) {
            swipedKeys.value = swipedKeys.value.slice(0, -1)
            activeIndex.value = activeIndex.value + 1
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

  const pan = Gesture.Pan()
    .onChange(({ translationX }) => {
      if (translationX > 0) {
        /**
         * If the user is swiping RIGHT, we want to move the PREVIOUS card to the right.
         */
        swipedCardX.value = interpolate(translationX, [0, width], [-width, 0], Extrapolation.CLAMP)
      } else {
        /**
         * If the user is swiping LEFT, we want to move the TOP card to the left.
         */
        activeCardX.value = translationX
      }
    })
    .onFinalize(({ translationX }) => {
      const swipeOverThreshold = Math.abs(translationX) > SWIPE_THRESHOLD

      if (!swipeOverThreshold) {
        /**
         * If the user didn't swipe enough, we want to reset the TOP card and the LAST SWIPED card to their original position.
         */
        activeCardX.value = withTiming(0)
        swipedCardX.value = withTiming(-width)
        return
      }

      const isSwipeLeft = translationX < 0
      const isLastCard = activeIndex.value === 0

      if (isSwipeLeft && !isLastCard && activeIndex.value === swipedIndexCallsOnTrigger) {
        /**
         * If the user swiped LEFT and the TOP card was the 3rd card from the end, trigger a request for a new batch of artworks.
         */
        runOnJS(onTrigger)(activeIndex.value - 1)
      }

      const swipedCardIndex = activeIndex.value
      const swipedCardKey = cards[swipedCardIndex].key

      if (isSwipeLeft && !isLastCard && swipedCardKey) {
        const nextCardIndex = swipedCardIndex - 1
        const nextCardKey = cards[nextCardIndex]?.key as Key

        if (nextCardKey && !seenCardKeys.value.includes(nextCardKey) && onNewCardReached) {
          /**
           * If the user swiped LEFT and the NEXT card is a card that the user hasn't seen yet, trigger a mutation to mark the card as seen.
           */
          seenCardKeys.value = [...seenCardKeys.value, nextCardKey]
          runOnJS(onNewCardReached)(nextCardKey)
        }

        /**
         * If the user swiped LEFT move the TOP card off the screen to the left, and tell the parent component that there is a new TOP card.
         */
        activeCardX.value = withTiming(-width, { duration: 500, easing: Easing.linear }, () => {
          swipedKeys.value = [...swipedKeys.value, swipedCardKey]
          const newIndex = activeIndex.value - 1
          activeIndex.value = newIndex
          // runOnJS(setReadingWindow)(newIndex)
          activeCardX.value = 0
          return
        })

        runOnJS(onSwipe)(swipedCardKey, nextCardKey)
        return
      }

      if (isSwipeLeft && isLastCard) {
        /**
         * If the user swiped LEFT and the TOP card is the last card, return the TOP card to the middle of the screen.
         */
        activeCardX.value = withTiming(0, { duration: 200, easing: Easing.cubic })
        return
      }

      /**
       * If the user swiped RIGHT, keep the TOP card in the middle of the screen.
       *
       * TODO: Test if doing this is still necessary.
       */
      activeCardX.value = 0

      const hasSwipedCards = activeIndex.value + 1 < cards.length
      let lastSwipedCardKey = null

      if (hasSwipedCards) {
        lastSwipedCardKey = cards[activeIndex.value + 1].key
      }

      /**
       * If the user swiped RIGHT, move the LAST SWIPED card to the center and tell the parent component that there is a new TOP card.
       *
       * TODO: Explain why the the nested if-statement is necessary.
       */
      swipedCardX.value = withTiming(0, { duration: 200, easing: Easing.linear }, () => {
        if (hasSwipedCards) {
          swipedKeys.value = swipedKeys.value.slice(0, -1)
          activeIndex.value = activeIndex.value + 1
        }
        swipedCardX.value = -width
      })

      if (!!lastSwipedCardKey) {
        runOnJS(onRewind)(lastSwipedCardKey as Key)
      }
    })

  return (
    <GestureDetector gesture={pan}>
      <View>
        {cards
          // .slice(readingWindowInitialIndex.current, readingWindowLastIndex.current + 1)
          .map((c, i) => {
            return (
              <AnimatedView
                index={i}
                card={c}
                activeCardX={activeCardX}
                activeIndex={activeIndex}
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

const SWIPE_THRESHOLD = 100
