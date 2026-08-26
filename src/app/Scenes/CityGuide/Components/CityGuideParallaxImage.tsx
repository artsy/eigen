import { Flex, Image, useScreenDimensions } from "@artsy/palette-mobile"
import { useScreenScrollContext } from "@artsy/palette-mobile/dist/elements/Screen/ScreenScrollContext"
import Animated, { Extrapolation, interpolate, useAnimatedStyle } from "react-native-reanimated"

interface CityGuideParallaxImageProps {
  src: string
  height?: number
  aspectRatio?: number
}

const DEFAULT_IMAGE_HEIGHT = 200

export const CityGuideParallaxImage: React.FC<CityGuideParallaxImageProps> = ({
  src,
  height = DEFAULT_IMAGE_HEIGHT,
  aspectRatio = 1.3,
}) => {
  const { width: screenWidth } = useScreenDimensions()
  const { currentScrollYAnimated } = useScreenScrollContext()

  const animatedImageStyle = useAnimatedStyle(() => {
    // Move the image at half the scroll speed to create a lagging parallax effect
    const translateY = interpolate(
      currentScrollYAnimated.value,
      [0, height],
      [0, height / 2],
      Extrapolation.CLAMP
    )

    return {
      transform: [{ translateY }],
    }
  })

  return (
    <Flex height={height} width={screenWidth} overflow="hidden">
      <Animated.View style={[{ width: screenWidth, height }, animatedImageStyle]}>
        <Image src={src} width={screenWidth} height={height} aspectRatio={aspectRatio} />
      </Animated.View>
    </Flex>
  )
}
