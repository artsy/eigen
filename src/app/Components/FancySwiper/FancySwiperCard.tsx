import { memo } from "react"
import { Animated, GestureResponderHandlers } from "react-native"
import { OFFSET_X } from "./FancySwiper"

interface FancySwiperCardProps extends GestureResponderHandlers {
  card: React.ReactNode
  swiper: Animated.ValueXY
  isTopCard: boolean
}

export const FancySwiperCard = memo(
  ({ card, swiper, isTopCard, ...rest }: FancySwiperCardProps) => {
    /**
     * Give the top card a small rotation as it is being swiped so that it gives users the
     * impression that they are moving a real card.
     */
    const rotate = swiper.x.interpolate({
      inputRange: [-OFFSET_X, 0, OFFSET_X],
      outputRange: ["-10deg", "0deg", "10deg"],
    })

    const animatedStyle = {
      transform: [...swiper.getTranslateTransform(), { rotate }],
    }

    return (
      <Animated.View
        style={[{ position: "absolute", zIndex: -1, width: "100%" }, isTopCard && animatedStyle]}
        testID={isTopCard ? "top-fancy-swiper-card" : undefined}
        {...rest}
      >
        {card}
      </Animated.View>
    )
  }
)
