import { useNavigation } from "@react-navigation/native"
import { OnboardingWelcomeQuery } from "__generated__/OnboardingWelcomeQuery.graphql"
import { GlobalStore } from "app/store/GlobalStore"
import { ArtsyLogoIcon, Box, Button, Flex, Screen, Spacer, Text } from "palette"
import { useEffect } from "react"
import { Image, StatusBar } from "react-native"
import Animated, {
  Easing,
  FadeInRight,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withSequence,
  withTiming,
} from "react-native-reanimated"
import { useSafeAreaInsets } from "react-native-safe-area-context"
import { graphql, useLazyLoadQuery } from "react-relay"
import { useScreenDimensions } from "shared/hooks"
import { useOnboardingContext } from "./Hooks/useOnboardingContext"

const AnimatedFlex = Animated.createAnimatedComponent(Flex)

const FIRST_WELCOME_SCREEN_DELAY = 1500
const IMG_DISPLAY_DURATION = 500
const LAST_IMG_DISPLAY_DURATION = 600

const BUTTONS_ENTERING_DURATION = 500

const BUTTONS_ENTERING_DELAY = 300
const BUTTONS_ENTERING_DELAY_TOTAL =
  FIRST_WELCOME_SCREEN_DELAY +
  IMG_DISPLAY_DURATION * 5 +
  LAST_IMG_DISPLAY_DURATION +
  BUTTONS_ENTERING_DELAY

export const OnboardingWelcome = () => {
  const { me } = useLazyLoadQuery<OnboardingWelcomeQuery>(OnboardingWelcomeScreenQuery, {})
  const { navigate } = useNavigation()
  const { next } = useOnboardingContext()
  const opacity = useSharedValue(1)

  const enteringAnim = FadeInRight.duration(BUTTONS_ENTERING_DURATION)
    .delay(BUTTONS_ENTERING_DELAY_TOTAL)
    .easing(Easing.out(Easing.quad))

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
        <StatusBar barStyle="light-content" backgroundColor="black" />
        {/* Welcome to Artsy Screen */}
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
          <Flex flex={1} justifyContent="center">
            <Text variant="xxl" color="white100">
              Ready to find{"\n"}
              art you love?
            </Text>
            <Spacer mt={4} />
            <AnimatedFlex entering={enteringAnim}>
              <Text variant="lg" color="white100">
                Start building your profile and tailor Artsy to your tastes.
              </Text>
            </AnimatedFlex>
            <AnimatedFlex entering={enteringAnim} paddingBottom={2} position="absolute" bottom={10}>
              <Button
                accessible
                accessibilityLabel="Start Onboarding Quiz"
                accessibilityHint="Starts the Onboarding Quiz"
                variant="fillLight"
                block
                haptic="impactMedium"
                onPress={() => {
                  next()
                  // @ts-expect-error
                  navigate("OnboardingQuestionOne")
                }}
              >
                Get Started
              </Button>
              <Spacer mt={1} />
              <Button
                accessible
                accessibilityLabel="Skip Onboarding Quiz"
                accessibilityHint="Navigates to the home screen"
                variant="fillDark"
                block
                haptic="impactMedium"
                onPress={() => GlobalStore.actions.auth.setState({ onboardingState: "complete" })}
              >
                Skip
              </Button>
            </AnimatedFlex>
          </Flex>
        </AnimatedFlex>
      </Screen.Background>
      <Screen.SafeBottomPadding />
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

const OnboardingWelcomeScreenQuery = graphql`
  query OnboardingWelcomeQuery {
    me {
      name
    }
  }
`
