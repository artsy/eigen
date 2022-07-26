import { OnboardingAnimationQuery } from "__generated__/OnboardingAnimationQuery.graphql"
import { ArtsyLogoIcon, Box, Flex, Screen, Text } from "palette"
import { useEffect } from "react"
import { Image, StatusBar } from "react-native"
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withSequence,
  withTiming,
} from "react-native-reanimated"
import { useSafeAreaInsets } from "react-native-safe-area-context"
import { graphql, useLazyLoadQuery } from "react-relay"
import { useScreenDimensions } from "shared/hooks"

const AnimatedFlex = Animated.createAnimatedComponent(Flex)

const FIRST_WELCOME_SCREEN_DELAY = 1500
const IMG_DISPLAY_DURATION = 500
const LAST_IMG_DISPLAY_DURATION = 600

export const OnboardingAnimation = () => {
  const { me } = useLazyLoadQuery<OnboardingAnimationQuery>(OnboardingAnimationScreenQuery, {})

  const opacity = useSharedValue(1)

  const onboardingImages = [
    require("images/OnboardingImage0AdesinaPaintingOfRechel.webp"),
    require("images/OnboardingImage1KatzYellowFlags.webp"),
    require("images/OnboardingImage2SuperFutureKidHazyDaisy2022.webp"),
    require("images/OnboardingImage3WangTheSnowflakeThatComesAlive.webp"),
    require("images/OnboardingImage4AndyWarholCow.webp"),
  ]

  const { height: screenHeight, width: screenWidth } = useScreenDimensions()

  const fadeOutAnimationsArr = [
    useAnimatedStyle(() => ({ opacity: opacity.value - 1 })),
    useAnimatedStyle(() => ({ opacity: opacity.value - 2 })),
    useAnimatedStyle(() => ({ opacity: opacity.value - 3 })),
    useAnimatedStyle(() => ({ opacity: opacity.value - 4 })),
    useAnimatedStyle(() => ({ opacity: opacity.value - 5 })),
    useAnimatedStyle(() => ({ opacity: opacity.value - 6 })),
  ]

  useEffect(() => {
    opacity.value = withDelay(
      FIRST_WELCOME_SCREEN_DELAY,
      withSequence(
        withTiming(2, { duration: IMG_DISPLAY_DURATION, easing: Easing.linear }),
        withTiming(3, { duration: IMG_DISPLAY_DURATION, easing: Easing.linear }),
        withTiming(4, { duration: IMG_DISPLAY_DURATION, easing: Easing.linear }),
        withTiming(5, { duration: IMG_DISPLAY_DURATION, easing: Easing.linear }),
        withTiming(6, { duration: IMG_DISPLAY_DURATION, easing: Easing.linear }),
        withTiming(7, { duration: LAST_IMG_DISPLAY_DURATION, easing: Easing.linear })
      )
    )
  }, [])

  return (
    <Screen>
      <Screen.Background>
        {/* Welcome to Artsy Screen */}
        <StatusBar barStyle="light-content" backgroundColor="black" />
        <AnimatedFlex
          position="absolute"
          px={2}
          height={screenHeight}
          width={screenWidth}
          flex={1}
          backgroundColor="black100"
          justifyContent="center"
        >
          <ArtsyLogoAbsoluteHeader />
          <Text variant="xxl" color="white100">
            Welcome{"\n"}
            to Artsy,{"\n"}
            {me?.name}
          </Text>
        </AnimatedFlex>
        {/* Onboarding Images */}
        {onboardingImages.map((image, index) => (
          <AnimatedFlex
            key={`img-${index}`}
            position="absolute"
            style={[{ height: screenHeight }, fadeOutAnimationsArr[index]]}
          >
            <Image
              source={image}
              resizeMode="cover"
              style={{ height: screenHeight, width: screenWidth }}
            />
          </AnimatedFlex>
        ))}
        {/* Start Onboarding Screen */}
        <AnimatedFlex
          position="absolute"
          flex={1}
          backgroundColor="black100"
          justifyContent="center"
          px={2}
          height={screenHeight}
          width={screenWidth}
          style={{ ...fadeOutAnimationsArr[5] }}
        >
          <ArtsyLogoAbsoluteHeader />
          <Text variant="xxl" color="white100">
            Ready to find{"\n"}
            art you love?
          </Text>
        </AnimatedFlex>
      </Screen.Background>
    </Screen>
  )
}

const ArtsyLogoAbsoluteHeader = () => {
  const { top } = useSafeAreaInsets()

  return (
    <Box position="absolute" top={`${top + 44}px`} left="20px">
      <ArtsyLogoIcon fill="white100" />
    </Box>
  )
}

export const OnboardingAnimationScreenQuery = graphql`
  query OnboardingAnimationQuery {
    me {
      name
    }
  }
`
