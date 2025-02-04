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
    // tilt the top card ever so slightly as it is being swiped
    const rotate = swiper.x.interpolate({
      inputRange: [-SWIPE_MAGNITUDE, 0, SWIPE_MAGNITUDE],
      outputRange: ["-10deg", "0deg", "10deg"],
    })

    const transformStyle = {
      transform: [...swiper.getTranslateTransform(), { rotate }],
    }

    // drop a shadow from the top card and make it more intense as it is swiped
    const shadowOpacityX = swiper.x.interpolate({
      inputRange: [-SWIPE_MAGNITUDE, 0, SWIPE_MAGNITUDE],
      outputRange: [0.13, 0, 0.13],
    })

    const shadowOpacityY = swiper.y.interpolate({
      inputRange: [-SWIPE_MAGNITUDE, 0, SWIPE_MAGNITUDE],
      outputRange: [0.13, 0, 0.13],
    })

    const shadowOpacity = Animated.add(shadowOpacityX, shadowOpacityY).interpolate({
      inputRange: [0, 0.26],
      outputRange: [0, 1],
      extrapolate: "clamp",
    })

    const shadowStyle = {
      shadowOffset: {
        width: 0,
        height: 0,
      },
      shadowOpacity,
      shadowRadius: 12,
    }

    return (
      <Animated.View
        style={[
          { position: "absolute", zIndex: -1, width: "100%" },
          isTopCard && transformStyle,
          isTopCard && shadowStyle,
        ]}
        testID={isTopCard ? "top-fancy-swiper-card" : undefined}
        {...rest}
      >
        {card}
      </Animated.View>
    )
  }
)
