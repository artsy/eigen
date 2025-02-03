import { Flex } from "@artsy/palette-mobile"
import { FancySwiperIcons } from "app/Components/FancySwiper/FancySwiperIcons"
import React, { useRef } from "react"
import { PanResponder, Animated } from "react-native"
import { FancySwiperCard } from "./FancySwiperCard"

export const OFFSET_X = 100
const OFFSET_Y = 100

interface FancySwiperProps {
  cards: React.ReactNode[]
  hideActionButtons?: boolean
  onSwipeAnywhere?: () => void
  onSwipeDown?: () => void
  onSwipeLeft?: () => void
  onSwipeRight?: () => void
  onSwipeUp?: () => void
}

export const FancySwiper = ({
  cards,
  hideActionButtons = false,
  onSwipeAnywhere,
  onSwipeDown,
  onSwipeLeft,
  onSwipeRight,
  onSwipeUp,
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
      const isFullHorizontalSwipe = Math.abs(dx) >= OFFSET_X
      const isFullVerticalSwipe = Math.abs(dy) >= OFFSET_Y

      const isLeftSwipe = dx < 0
      const isRightSwipe = dx > 0
      const isDownSwipe = dy > 0
      const isUpSwipe = dy < 0

      if (isFullHorizontalSwipe && isLeftSwipe && (onSwipeLeft || onSwipeAnywhere)) {
        handleLeftSwipe(dy)
      } else if (isFullHorizontalSwipe && isRightSwipe && (onSwipeRight || onSwipeAnywhere)) {
        handleRightSwipe(dy)
      } else if (isFullVerticalSwipe && isDownSwipe && (onSwipeDown || onSwipeAnywhere)) {
        handleDownSwipe(dx)
      } else if (isFullVerticalSwipe && isUpSwipe && (onSwipeUp || onSwipeAnywhere)) {
        handleUpSwipe(dx)
      } else {
        // move the card to its original position
        Animated.spring(swiper, {
          toValue: { x: 0, y: 0 },
          friction: 5,
          useNativeDriver: true,
        }).start()
      }
    },
  })

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
      } else if (onSwipeAnywhere) {
        onSwipeAnywhere()
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
      } else if (onSwipeAnywhere) {
        onSwipeAnywhere()
      }
    })
  }

  const handleDownSwipe = (toValueX?: number) => {
    // move the card off the screen
    Animated.timing(swiper, {
      toValue: { x: toValueX || 0, y: 1000 },
      duration: 300,
      useNativeDriver: true,
    }).start(() => {
      // Revert the pan responder to its initial position
      swiper.setValue({ x: 0, y: 0 })

      if (onSwipeDown) {
        onSwipeDown()
      } else if (onSwipeAnywhere) {
        onSwipeAnywhere()
      }
    })
  }

  const handleUpSwipe = (toValueX?: number) => {
    // move the card off the screen
    Animated.timing(swiper, {
      toValue: { x: toValueX || 0, y: -1000 },
      duration: 300,
      useNativeDriver: true,
    }).start(() => {
      // Revert the pan responder to its initial position
      swiper.setValue({ x: 0, y: 0 })

      if (onSwipeUp) {
        onSwipeUp()
      } else if (onSwipeAnywhere) {
        onSwipeAnywhere()
      }
    })
  }

  return (
    <>
      <Flex alignItems="center" flex={1}>
        {remainingCards.map((card, index) => {
          const isTopCard = index === remainingCards.length - 1

          // We would like to be able to drag the top card only
          const gestureDraggers = isTopCard ? panResponder.panHandlers : {}

          return (
            <FancySwiperCard
              card={card}
              key={index}
              swiper={swiper}
              isTopCard={isTopCard}
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
