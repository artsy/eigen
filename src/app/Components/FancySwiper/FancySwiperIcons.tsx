import { CloseIcon, Flex, HeartFillIcon, HeartIcon, Touchable } from "@artsy/palette-mobile"
import { SWIPE_MAGNITUDE } from "app/Components/FancySwiper/FancySwiper"
import { Animated } from "react-native"

interface FancySwiperIconsProps {
  onDislike: () => void
  onLike: () => void
  swiper: Animated.ValueXY
}

export const FancySwiperIcons = ({ onDislike, onLike, swiper }: FancySwiperIconsProps) => {
  const inputRange = [-SWIPE_MAGNITUDE, 0, SWIPE_MAGNITUDE]

  const likeIconScale = swiper.x.interpolate({
    inputRange,
    outputRange: [1, 1, 1],
  })

  const likeIconOpacity = swiper.x.interpolate({
    inputRange,
    outputRange: [1, 1, 0],
  })

  const likeFilledIconScale = swiper.x.interpolate({
    inputRange,
    outputRange: [1, 1, 1.05],
  })

  const likeFilledIconOpacity = swiper.x.interpolate({
    inputRange,
    outputRange: [0, 0, 1],
  })

  const dislikeIconScale = swiper.x.interpolate({
    inputRange,
    outputRange: [1.05, 1, 1],
  })

  const likeIconAnimatedStyle = {
    transform: [{ scale: likeIconScale }],
    opacity: likeIconOpacity,
  }

  const likeFilledIconAnimatedStyle = {
    transform: [{ scale: likeFilledIconScale }],
    opacity: likeFilledIconOpacity,
  }

  const dislikeIconAnimatedStyle = {
    transform: [{ scale: dislikeIconScale }],
  }

  return (
    <Flex flexDirection="row" justifyContent="space-around" pb={4} mx={4}>
      <Animated.View style={[{ flex: 1, alignItems: "center" }, dislikeIconAnimatedStyle]}>
        <Touchable onPress={() => onDislike()} accessibilityLabel="Skip" accessibilityRole="button">
          <CloseIcon height={40} width={50} />
        </Touchable>
      </Animated.View>
      <Flex flex={1} alignItems="center">
        <Animated.View style={[likeIconAnimatedStyle, { position: "absolute" }]}>
          <Touchable onPress={() => onLike()} accessibilityLabel="Like" accessibilityRole="button">
            <HeartIcon height={40} width={50} />
          </Touchable>
        </Animated.View>
        <Animated.View style={[likeFilledIconAnimatedStyle, { position: "absolute" }]}>
          <Touchable accessibilityRole="button" onPress={() => onLike()}>
            <HeartFillIcon height={40} width={50} />
          </Touchable>
        </Animated.View>
      </Flex>
    </Flex>
  )
}
