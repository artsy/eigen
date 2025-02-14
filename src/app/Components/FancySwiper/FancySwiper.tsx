import { Flex } from "@artsy/palette-mobile"
import { FancySwiperIcons } from "app/Components/FancySwiper/FancySwiperIcons"
import React, { useMemo, useRef } from "react"
import { PanResponder, Animated } from "react-native"
import { FancySwiperCard } from "./FancySwiperCard"

// the amount of swiping that is considered a full swipe
export const SWIPE_MAGNITUDE = 100

export type FancySwiperArtworkCard = {
  content: React.ReactNode
  artworkId: string
}

interface FancySwiperProps {
  cards: FancySwiperArtworkCard[]
  hideActionButtons?: boolean
  onSwipeLeft: () => void
  onSwipeRight?: () => void
  onWhiffRight?: () => void
  topCardIndex: number
}

export const FancySwiper = ({
  cards,
  hideActionButtons = false,
  onSwipeLeft,
  onSwipeRight,
  onWhiffRight,
  topCardIndex,
}: FancySwiperProps) => {
  const remainingCards = useMemo(() => cards.reverse(), [cards.length])
  const swiper = useRef<Animated.ValueXY>(new Animated.ValueXY()).current

  const panResponder = PanResponder.create({
    onStartShouldSetPanResponder: () => true,
    onPanResponderMove: (_, { dx, dy }) => {
      const isRightSwipe = dx > 0
      // lock right swipes if not allowed
      const x = isRightSwipe && !onSwipeRight ? 0 : dx

      swiper.setValue({ x, y: dy })
    },
    onPanResponderRelease: (_, { dx, dy }) => {
      const isFullSwipe = Math.abs(dx) > SWIPE_MAGNITUDE
      const isLeftSwipe = dx < 0
      const isRightSwipe = dx > 0

      if (isFullSwipe && isLeftSwipe) {
        handleLeftSwipe()
      } else if (isFullSwipe && isRightSwipe && onSwipeRight) {
        handleRightSwipe(dy)
      } else if (isFullSwipe && isRightSwipe && onWhiffRight) {
        handleRightWhiff()
      } else {
        // move the card to its original position
        Animated.spring(swiper, {
          toValue: { x: 0, y: 0 },
          friction: 50,
          useNativeDriver: true,
        }).start(() => {
          // revert the pan responder to its initial position
          swiper.setValue({ x: 0, y: 0 })
        })
      }
    },
  })

  const handleLeftSwipe = () => {
    // move the card off the screen
    Animated.timing(swiper, {
      toValue: { x: -1000, y: 0 },
      duration: 300,
      useNativeDriver: true,
    }).start(() => {
      // revert the pan responder to its initial position
      swiper.setValue({ x: 0, y: 0 })
      onSwipeLeft()
    })
  }

  const handleRightSwipe = (toValueY?: number) => {
    // move the card off the screen
    Animated.timing(swiper, {
      toValue: { x: 1000, y: toValueY || 0 },
      duration: 300,
      useNativeDriver: true,
    }).start(() => {
      // revert the pan responder to its initial position
      swiper.setValue({ x: 0, y: 0 })
      onSwipeRight?.()
    })
  }

  const handleRightWhiff = () => {
    onWhiffRight?.()
  }

  return (
    <>
      <Flex alignItems="center" flex={1}>
        {remainingCards.map((card, index) => {
          // remainingCards was reversed, so we need to compare the index to the topCardIndex
          // by calculating the index from the end of the array
          const isTopCard = remainingCards.length - 1 - index === topCardIndex
          const isSecondCard = remainingCards.length - 1 - index === topCardIndex + 1
          const isSwipedCard = remainingCards.length - 1 - index < topCardIndex

          // We would like to be able to drag the top card only
          const gestureDraggers = isTopCard ? panResponder.panHandlers : {}

          return (
            <FancySwiperCard
              card={card.content}
              key={card.artworkId}
              artworkId={card.artworkId}
              swiper={swiper}
              isTopCard={isTopCard}
              isSecondCard={isSecondCard}
              isSwipedCard={isSwipedCard}
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
