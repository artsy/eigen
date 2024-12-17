import { memo } from "react"
import { Animated, GestureResponderHandlers } from "react-native"
import { OFFSET_X } from "./FancySwiper"

export interface Card {
  jsx: JSX.Element
  id: string
}

interface FancySwiperCardProps extends GestureResponderHandlers {
  card: Card
  swiper: Animated.ValueXY
  isTopCard: boolean
}

export const FancySwiperCard = memo(
  ({ card, swiper, isTopCard, ...rest }: FancySwiperCardProps) => {
    const rotate = swiper.x.interpolate({
      inputRange: [-OFFSET_X, 0, OFFSET_X],
      outputRange: ["-10deg", "0deg", "10deg"],
    })

    const animatedStyle = {
      transform: [...swiper.getTranslateTransform(), { rotate }],
    }

    return (
      <Animated.View
        style={[{ position: "absolute", zIndex: -1 }, isTopCard && animatedStyle]}
        {...rest}
      >
        {card.jsx}
      </Animated.View>
    )
  }
)
