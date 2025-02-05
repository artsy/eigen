import { memo } from "react"
import { Animated, GestureResponderHandlers } from "react-native"
import { SWIPE_MAGNITUDE } from "./FancySwiper"

interface FancySwiperCardProps extends GestureResponderHandlers {
  card: React.ReactNode
  swiper: Animated.ValueXY
  isTopCard: boolean
}

export const FancySwiperCard = memo(
  ({ card, swiper, isTopCard, ...rest }: FancySwiperCardProps) => {
    let transformStyle = undefined
    let shadowStyle = undefined

    if (isTopCard) {
      // tilt the top card ever so slightly as it is being swiped
      const rotate = swiper.x.interpolate({
        inputRange: [-SWIPE_MAGNITUDE, 0, SWIPE_MAGNITUDE],
        outputRange: ["-10deg", "0deg", "10deg"],
      })

      transformStyle = {
        transform: [...swiper.getTranslateTransform(), { rotate }],
      }

      // drop a shadow from the top card and make it more intense as it is swiped
      const shadowOpacity = interpolateShadowOpacity(swiper)
      const elevation = interpolateElevation(swiper)

      shadowStyle = {
        shadowOffset: { width: 0, height: 0 },
        shadowRadius: 12,
        shadowOpacity,
        elevation,
      }
    }

    return (
      <Animated.View
        style={{
          position: "absolute",
          width: "100%",
          borderRadius: 10,
          ...shadowStyle,
          ...transformStyle,
        }}
        testID={isTopCard ? "top-fancy-swiper-card" : undefined}
        {...rest}
      >
        {card}
      </Animated.View>
    )
  }
)

const interpolateShadowOpacity = (swiper: Animated.ValueXY) => {
  const MAX_SHADOW_OPACITY = 0.13

  const shadowOpacityX = swiper.x.interpolate({
    inputRange: [-SWIPE_MAGNITUDE, 0, SWIPE_MAGNITUDE],
    outputRange: [MAX_SHADOW_OPACITY, 0, MAX_SHADOW_OPACITY],
  })

  const shadowOpacityY = swiper.y.interpolate({
    inputRange: [-SWIPE_MAGNITUDE, 0, SWIPE_MAGNITUDE],
    outputRange: [MAX_SHADOW_OPACITY, 0, MAX_SHADOW_OPACITY],
  })

  return Animated.add(shadowOpacityX, shadowOpacityY).interpolate({
    inputRange: [0, MAX_SHADOW_OPACITY * 2],
    outputRange: [0, MAX_SHADOW_OPACITY],
    extrapolate: "clamp",
  })
}

const interpolateElevation = (swiper: Animated.ValueXY) => {
  const MAX_ELEVATION = 8

  const elevationX = swiper.x.interpolate({
    inputRange: [-SWIPE_MAGNITUDE, 0, SWIPE_MAGNITUDE],
    outputRange: [MAX_ELEVATION, 0, MAX_ELEVATION],
  })

  const elevationY = swiper.y.interpolate({
    inputRange: [-SWIPE_MAGNITUDE, 0, SWIPE_MAGNITUDE],
    outputRange: [MAX_ELEVATION, 0, MAX_ELEVATION],
  })

  return Animated.add(elevationX, elevationY).interpolate({
    inputRange: [0, MAX_ELEVATION * 2],
    outputRange: [0, MAX_ELEVATION],
    extrapolate: "clamp",
  })
}
