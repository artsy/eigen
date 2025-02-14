import { GlobalStore } from "app/store/GlobalStore"
import { memo } from "react"
import { Animated, GestureResponderHandlers } from "react-native"
import { SWIPE_MAGNITUDE } from "./FancySwiper"

interface FancySwiperCardProps extends GestureResponderHandlers {
  artworkId: string
  card: React.ReactNode
  isTopCard: boolean
  isSecondCard: boolean
  isSwipedCard: boolean
  isLastSwipedCard: boolean
  swiper: Animated.ValueXY
}

export const FancySwiperCard = memo(
  ({
    artworkId,
    card,
    swiper,
    isTopCard,
    isSecondCard,
    isSwipedCard,
    isLastSwipedCard,
    ...rest
  }: FancySwiperCardProps) => {
    const discoveredArtworksIds = GlobalStore.useAppState(
      (state) => state.infiniteDiscovery.discoveredArtworkIds
    )

    let topCardShadow = undefined
    let topCardTransform = undefined
    let bottomCardOpacity = undefined
    let bottomCardTransform = undefined
    let lastSwipedCardTransform = undefined

    if (isTopCard) {
      if (discoveredArtworksIds.includes(artworkId)) {
        swiper.setValue({ x: -1000, y: 0 })

        // animate the card back if it has been swiped
        Animated.timing(swiper, {
          toValue: { x: 0, y: 0 },
          duration: 1000,
          useNativeDriver: true,
        }).start()
      }

      // tilt the top card as it is being swiped away
      const rotate = swiper.x.interpolate({
        inputRange: [-SWIPE_MAGNITUDE, 0, SWIPE_MAGNITUDE],
        outputRange: ["-10deg", "0deg", "10deg"],
      })

      topCardTransform = {
        transform: [...swiper.getTranslateTransform(), { rotate }],
      }

      // drop a shadow from the top card and make it more intense as it is swiped away
      const shadowOpacity = interpolateSwiper(swiper, MAX_SHADOW_OPACITY)
      const elevation = interpolateSwiper(swiper, MAX_ELEVATION)

      topCardShadow = {
        shadowOffset: { width: 0, height: 0 },
        shadowRadius: 12,
        shadowOpacity,
        elevation,
      }
    } else if (isSecondCard) {
      // make the second card fade in as the top card swipes away
      const opacity = interpolateSwiper(swiper, MAX_OPACITY, MIN_OPACITY)

      bottomCardOpacity = {
        opacity,
      }

      // make the second card grow to full size as the top card swipes away
      const scale = interpolateSwiper(swiper, MAX_SCALE, MIN_SCALE)

      bottomCardTransform = {
        transform: [{ scale }],
      }
    } else if (isSwipedCard) {
      lastSwipedCardTransform = {
        transform: [{ translateX: -1000 }, { translateY: 0 }],
      }
    } else {
      // hide the rest of the cards
      bottomCardOpacity = {
        opacity: 0,
      }
    }

    return (
      <Animated.View
        style={{
          position: "absolute",
          width: "100%",
          borderRadius: 10,
          ...topCardShadow,
          ...topCardTransform,
          ...bottomCardOpacity,
          ...bottomCardTransform,
          ...lastSwipedCardTransform,
        }}
        testID={isTopCard ? "top-fancy-swiper-card" : undefined}
        {...rest}
      >
        {card}
      </Animated.View>
    )
  }
)

const interpolateSwiper = (
  swiper: Animated.ValueXY,
  maximumOutputValue: number,
  minimumOutputValue = 0
) => {
  const x = swiper.x.interpolate({
    inputRange: [-SWIPE_MAGNITUDE, 0, SWIPE_MAGNITUDE],
    outputRange: [maximumOutputValue, minimumOutputValue, maximumOutputValue],
  })

  const y = swiper.y.interpolate({
    inputRange: [-SWIPE_MAGNITUDE, 0, SWIPE_MAGNITUDE],
    outputRange: [maximumOutputValue, minimumOutputValue, maximumOutputValue],
  })

  return Animated.add(x, y).interpolate({
    inputRange: [0, maximumOutputValue * 2],
    outputRange: [minimumOutputValue, maximumOutputValue],
    extrapolate: "clamp",
  })
}

const MIN_OPACITY = 0.3
const MAX_OPACITY = 1
const MIN_SCALE = 0.8
const MAX_SCALE = 1
const MAX_ELEVATION = 8
const MAX_SHADOW_OPACITY = 0.13
