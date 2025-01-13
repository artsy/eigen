import { Flex } from "@artsy/palette-mobile"
import { FancySwiperIcons } from "app/Components/FancySwiper/FancySwiperIcons"
import { useRef } from "react"
import { PanResponder, Animated } from "react-native"
import { Card, FancySwiperCard } from "./FancySwiperCard"

export const OFFSET_X = 100

interface FancySwiperProps {
  cards: Card[]
  hideActionButtons?: boolean
  onSwipeLeft?: () => void
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

  const panResponder = PanResponder.create({
    onStartShouldSetPanResponder: () => true,
    onPanResponderMove: (_, { dx, dy }) => {
      // set the position of the card
      swiper.setValue({ x: dx, y: dy })
    },
    onPanResponderRelease: (_, { dx, dy }) => {
      const isFullSwipe = Math.abs(dx) >= OFFSET_X
      const isRightSwipe = dx > 0
      const isLeftSwipe = dx < 0

      if (isFullSwipe && isRightSwipe && onSwipeRight) {
        handleRightSwipe(dy)
      } else if (isFullSwipe && isLeftSwipe && onSwipeLeft) {
        handleLeftSwipe(dy)
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
      {!hideActionButtons && (
        <FancySwiperIcons onDislike={handleLeftSwipe} onLike={handleRightSwipe} swiper={swiper} />
      )}
    </>
  )
}
