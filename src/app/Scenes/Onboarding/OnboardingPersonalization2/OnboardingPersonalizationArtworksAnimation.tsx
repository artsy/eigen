import { Flex, Screen } from "palette"
import { useEffect } from "react"
import { Animated, Dimensions, Easing, Image } from "react-native"

export default function OnboardingArtworksAnimation() {
  const { height: screenHeight, width: screenWidth } = Dimensions.get("screen")
  const animations = new Animated.Value(0)
  const onboardingImages = [
    require("images/OnboardingImage0AdesinaPaintingOfRechel.webp"),
    require("images/OnboardingImage1KatzYellowFlags.webp"),
    require("images/OnboardingImage2SuperFutureKidHazyDaisy2022.webp"),
    require("images/OnboardingImage3WangTheSnowflakeThatComesAlive.webp"),
    require("images/OnboardingImage4AndyWarholCow.webp"),
  ]

  const { length } = onboardingImages
  const duration = 1000 * 6 // Set transition duration
  const opacity: any[] = []

  // set the opacity value for every item on our data
  onboardingImages.map((_image, index) => {
    opacity.push(
      animations.interpolate({
        inputRange: [index - 1, index, index + 1],
        outputRange: [0, 1, 0],
      })
    )
  })

  console.warn(opacity)

  useEffect(() => {
    Animated.timing(animations, {
      toValue: length - 1,
      duration,
      easing: Easing.ease,
      useNativeDriver: true,
    }).start()
  }, [animations, length])

  return (
    <Screen>
      <Screen.Background>
        <Flex flex={1} alignItems="flex-end" backgroundColor="black100">
          {onboardingImages.map((image, index) => {
            // Set opacity for each item inside the render
            const getOpacity = opacity[index]
            return (
              <Animated.View
                key={index}
                style={[{ position: "absolute", height: screenHeight, opacity: getOpacity }]}
              >
                <Image
                  source={image}
                  resizeMode="cover"
                  style={{ height: screenHeight, width: screenWidth }}
                />
              </Animated.View>
            )
          })}
        </Flex>
      </Screen.Background>
    </Screen>
  )
}
