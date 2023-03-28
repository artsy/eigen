import { CloseIcon, Flex, HeartFillIcon, HeartIcon, Touchable } from "@artsy/palette-mobile"
import { OFFSET_X } from "app/Components/FancySwiper/FancySwiper"
import { Animated } from "react-native"

interface FancySwiperIconsProps {
  swiper: Animated.ValueXY
  OnPress: (swipeDirection: "right" | "left") => void
}

export const FancySwiperIcons = ({ swiper, OnPress }: FancySwiperIconsProps) => {
  const inputRange = [-OFFSET_X, 0, OFFSET_X]

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
        <Touchable onPress={() => OnPress("left")}>
          <CloseIcon height={40} width={50} />
        </Touchable>
      </Animated.View>
      <Flex flex={1} alignItems="center">
        <Animated.View style={[likeIconAnimatedStyle, { position: "absolute" }]}>
          <Touchable onPress={() => OnPress("right")}>
            <HeartIcon height={40} width={50} />
          </Touchable>
        </Animated.View>
        <Animated.View style={[likeFilledIconAnimatedStyle, { position: "absolute" }]}>
          <Touchable onPress={() => OnPress("right")}>
            <HeartFillIcon height={40} width={50} />
          </Touchable>
        </Animated.View>
      </Flex>
    </Flex>
  )
}
