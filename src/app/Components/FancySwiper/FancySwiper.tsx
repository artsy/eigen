import { Flex } from "@artsy/palette-mobile"
import { FancySwiperIcons } from "app/Components/FancySwiper/FancySwiperIcons"
import React, { useRef } from "react"
import { PanResponder, Animated } from "react-native"
import { FancySwiperCard } from "./FancySwiperCard"

// the amount of swiping that is considered a full swipe
export const SWIPE_MAGNITUDE = 100

interface FancySwiperProps {
  cards: React.ReactNode[]
  hideActionButtons?: boolean
  onSwipeAnywhere?: () => void
  onSwipeLeft?: () => void
  onSwipeRight?: () => void
}

export const FancySwiper = ({
  cards,
  hideActionButtons = false,
  onSwipeAnywhere,
  onSwipeLeft,
  onSwipeRight,
}: FancySwiperProps) => {
  const remainingCards = cards.reverse()
  const swiper = useRef<Animated.ValueXY>(new Animated.ValueXY()).current

  const panResponder = PanResponder.create({
    onStartShouldSetPanResponder: () => true,
    onPanResponderMove: (_, { dx, dy }) => {
      // set the position of the card
      swiper.setValue({ x: dx, y: dy })
    },
    onPanResponderRelease: (_, { dx, dy }) => {
      const isFullSwipe = Math.hypot(dx, dy) >= SWIPE_MAGNITUDE
      const isLeftSwipe = dx < 0
      const isRightSwipe = dx > 0

      if (isFullSwipe && onSwipeAnywhere) {
        handle360Swipe(dx, dy)
      } else if (isFullSwipe && isLeftSwipe && onSwipeLeft) {
        handleLeftSwipe(dy)
      } else if (isFullSwipe && isRightSwipe && onSwipeRight) {
        handleRightSwipe(dy)
      } else {
        // move the card to its original position
        Animated.spring(swiper, {
          toValue: { x: 0, y: 0 },
          friction: 50,
          useNativeDriver: true,
        }).start()
      }
    },
  })

  const handle360Swipe = (dx: number, dy: number) => {
    // send the card on the same trajectory by multiplying the dx and dy by 100 (but cap it at 1000)
    const toValueX = Math.abs(dx) * 100 > 1000 ? Math.sign(dx) * 1000 : dx * 100
    const toValueY = Math.abs(dy) * 100 > 1000 ? Math.sign(dy) * 1000 : dy * 100

    // move the card off the screen
    Animated.timing(swiper, {
      toValue: { x: toValueX, y: toValueY },
      duration: 300,
      useNativeDriver: true,
    }).start(() => {
      // Revert the pan responder to its initial position
      swiper.setValue({ x: 0, y: 0 })

      if (onSwipeAnywhere) {
        onSwipeAnywhere()
      }
    })
  }

  const handleLeftSwipe = (toValueY?: number) => {
    // move the card off the screen
    Animated.timing(swiper, {
      toValue: { x: -1000, y: toValueY || 0 },
      duration: 300,
      useNativeDriver: true,
    }).start(() => {
      // revert the pan responder to its initial position
      swiper.setValue({ x: 0, y: 0 })

      if (onSwipeLeft) {
        onSwipeLeft()
      }
    })
  }

  const handleRightSwipe = (toValueY?: number) => {
    // move the card off the screen
    Animated.timing(swiper, {
      toValue: { x: 1000, y: toValueY || 0 },
      duration: 300,
      useNativeDriver: true,
    }).start(() => {
      // Revert the pan responder to its initial position
      swiper.setValue({ x: 0, y: 0 })

      if (onSwipeRight) {
        onSwipeRight()
      }
    })
  }

  return (
    <>
      <Flex alignItems="center" flex={1}>
        {remainingCards.map((card, index) => {
          const isTopCard = index === remainingCards.length - 1
          const isSecondCard = index === remainingCards.length - 2

          // We would like to be able to drag the top card only
          const gestureDraggers = isTopCard ? panResponder.panHandlers : {}

          return (
            <FancySwiperCard
              card={card}
              key={index}
              swiper={swiper}
              isTopCard={isTopCard}
              isSecondCard={isSecondCard}
              {...gestureDraggers}
            />
          )
        })}
      </Flex>
      {!hideActionButtons && (
        <FancySwiperIcons onDislike={handleLeftSwipe} onLike={handleRightSwipe} swiper={swiper} />
      )}
    </>
  )
}
