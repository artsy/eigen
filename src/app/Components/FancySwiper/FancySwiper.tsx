import { Flex } from "@artsy/palette-mobile"
import { FancySwiperIcons } from "app/Components/FancySwiper/FancySwiperIcons"
import { useRef, useCallback } from "react"
import { PanResponder, Animated } from "react-native"
import { Card, FancySwiperCard } from "./FancySwiperCard"

export const OFFSET_X = 100

interface FancySwiperProps {
  cards: Card[]
  hideActionButtons?: boolean
  onSwipeLeft: () => void
  onSwipeRight?: () => void
}

export const FancySwiper = ({
  cards,
  hideActionButtons = false,
  onSwipeLeft,
  onSwipeRight,
}: FancySwiperProps) => {
  const remainingCards = cards.reverse()
  const swiper = useRef<Animated.ValueXY>(new Animated.ValueXY()).current

  const removeCardFromTop = useCallback(
    (swipeDirection: "right" | "left") => {
      // Revert the pan responder to its initial position
      swiper.setValue({ x: 0, y: 0 })

      if (onSwipeRight && swipeDirection === "right") {
        onSwipeRight()
      } else {
        onSwipeLeft()
      }
    },
    [remainingCards, swiper]
  )

  const panResponder = PanResponder.create({
    onStartShouldSetPanResponder: () => true,
    onPanResponderMove: (_, { dx, dy }) => {
      // set the position of the card
      swiper.setValue({ x: dx, y: dy })
    },
    onPanResponderRelease: (_, { dx, dy }) => {
      // if the card was swiped enough, attempt to remove it from the top
      if (Math.abs(dx) >= OFFSET_X) {
        const sign = Math.sign(dx)
        const swipeDirection = sign > 0 ? "right" : "left"

        // only allow the swipe if the swipe direction is supported
        if ((onSwipeRight && swipeDirection === "right") || swipeDirection === "left") {
          onSwipeHandler(swipeDirection, dy)
          return
        }
      }

      // move the card to its original position if it wasn't swiped enough or the swipe was invalid
      Animated.spring(swiper, {
        toValue: { x: 0, y: 0 },
        friction: 5,
        useNativeDriver: true,
      }).start()
    },
  })

  const onSwipeHandler = (swipeDirection: "right" | "left", toValueY?: number) => {
    const sign = swipeDirection === "left" ? -1 : 1
    // Move the card off the screen
    Animated.timing(swiper, {
      toValue: { x: 1000 * sign, y: toValueY || 0 },
      duration: 300,
      useNativeDriver: true,
    }).start(() => {
      removeCardFromTop(swipeDirection)
    })
  }

  return (
    <>
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
      {!hideActionButtons && <FancySwiperIcons swiper={swiper} OnPress={onSwipeHandler} />}
    </>
  )
}
