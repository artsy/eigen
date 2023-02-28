import { Flex } from "@artsy/palette-mobile"
import { useState, useRef, useCallback, useEffect } from "react"
import { PanResponder, Animated } from "react-native"
import { Card, FancySwiperCard } from "./FancySwiperCard"

export const OFFSET_X = 100

interface FancySwiperProps {
  cards: Card[]
  onSwipeRight: (index: number) => void
  onSwipeLeft: (index: number) => void
  shouldRevertCard?: boolean
  setShouldRevertCard?: (s: boolean) => void
}

export const FancySwiper = ({
  cards,
  onSwipeRight,
  onSwipeLeft,
  shouldRevertCard,
  setShouldRevertCard,
}: FancySwiperProps) => {
  const [remainingCards, setRemainingCardsCards] = useState(cards)
  const [backUpCards, setBackUpCards] = useState<Card[]>([])
  const swiper = useRef<Animated.ValueXY>(new Animated.ValueXY()).current

  useEffect(() => {
    if (shouldRevertCard) {
      bringBackCardOnTop()
    }
  }, [shouldRevertCard])

  const removeCardFromTop = useCallback(
    (swipeDirection: "right" | "left", index: number) => {
      const topCard = remainingCards.slice(-1)[0]
      const newRemainingCards = remainingCards.slice(0, -1)
      const newBackUpCards = backUpCards.concat(topCard)
      setRemainingCardsCards(newRemainingCards)
      setBackUpCards(newBackUpCards)
      // Revert the pan responder to its initial position
      swiper.setValue({ x: 0, y: 0 })

      if (swipeDirection === "right") {
        onSwipeRight(index)
      } else {
        onSwipeLeft(index)
      }
    },
    [remainingCards, backUpCards, swiper]
  )

  const bringBackCardOnTop = useCallback(() => {
    if (backUpCards.length) {
      const lastCard = backUpCards.slice(-1)[0]
      const newBackUpCards = backUpCards.slice(0, -1)
      const newRemainingCards = remainingCards.concat(lastCard)
      setBackUpCards(newBackUpCards)
      setRemainingCardsCards(newRemainingCards)
      swiper.setValue({ x: 0, y: 0 })
      setShouldRevertCard?.(false)
    }
  }, [remainingCards, backUpCards, swiper])

  const panResponder = PanResponder.create({
    onStartShouldSetPanResponder: () => true,
    onPanResponderMove: (_, { dx, dy }) => {
      // set the position of the card
      swiper.setValue({ x: dx, y: dy })
    },
    onPanResponderRelease: (_, { dx, dy }) => {
      // If the user didn't swipe far enough, reset the position
      if (Math.abs(dx) < OFFSET_X) {
        Animated.spring(swiper, {
          toValue: { x: 0, y: 0 },
          friction: 5,
          useNativeDriver: true,
        }).start()
      } else {
        const sign = Math.sign(dx)
        const swipeDirection = sign > 0 ? "right" : "left"
        // Move the card off the screen
        Animated.timing(swiper, {
          toValue: { x: 1000 * sign, y: dy },
          useNativeDriver: true,
        }).start(() => {
          removeCardFromTop(swipeDirection, remainingCards.length - 1)
        })
      }
    },
  })

  return (
    <Flex justifyContent="center" alignItems="center" flex={1}>
      {remainingCards.map((card, index) => {
        const isTopCard = index === remainingCards.length - 1

        // We would like to be able to drag the top card only
        const gestureDraggers = isTopCard ? panResponder.panHandlers : {}

        return (
          <FancySwiperCard
            card={card}
            key={card.id}
            swiper={swiper}
            isTopCard={isTopCard}
            {...gestureDraggers}
          />
        )
      })}
    </Flex>
  )
}
