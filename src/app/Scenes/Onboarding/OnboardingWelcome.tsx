import { Spacer, useTheme, ArtsyLogoWhiteIcon, Flex, Text } from "@artsy/palette-mobile"
import { StackScreenProps } from "@react-navigation/stack"
import {
  ArtsyNativeModule,
  DEFAULT_NAVIGATION_BAR_COLOR,
} from "app/NativeModules/ArtsyNativeModule"
import backgroundImage from "images/WelcomeImage.jpg"
import { Button, Screen } from "palette"
import { useEffect } from "react"
import { Dimensions, Image, Platform } from "react-native"
import LinearGradient from "react-native-linear-gradient"
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withSequence,
  withTiming,
} from "react-native-reanimated"
import { useScreenDimensions } from "shared/hooks"
import { OnboardingNavigationStack } from "./Onboarding"

type OnboardingWelcomeProps = StackScreenProps<OnboardingNavigationStack, "OnboardingWelcome">

const imgProps = Image.resolveAssetSource(backgroundImage)

export const OnboardingWelcome: React.FC<OnboardingWelcomeProps> = ({ navigation }) => {
  const { space } = useTheme()
  const { width: screenWidth } = useScreenDimensions()
  // useScreenDimensions() returns the window height instead of the screen
  // We need the entire screen height here because the background image should fill
  // the entire screen including drawing below the navigation bar
  const { height: screenHeight } = Dimensions.get("screen")

  // text and logo appearance
  const opacity = useSharedValue(0)
  const appearAnim = useAnimatedStyle(() => ({ opacity: opacity.value }))
  useEffect(() => {
    opacity.value = withDelay(100, withTiming(1))
  }, [])

  // background sliding
  const translateX = useSharedValue(0)
  const slideAnim = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value }],
  }))
  useEffect(() => {
    // We want to animate the background only when the device width is smaller than the scaled image width
    const imgScale = imgProps.height / screenHeight
    const imgWidth = imgProps.width * imgScale
    // animate the background only when the device width is smaller than the scaled image width
    if (screenWidth < imgWidth) {
      const rightMarginFirstStop = 120
      const rightMarginSecondStop = 320
      translateX.value = withSequence(
        withTiming(-(imgWidth - screenWidth - rightMarginFirstStop), { duration: 40000 }),
        withTiming(-(imgWidth - screenWidth - rightMarginSecondStop), { duration: 10000 })
      )
    }
  }, [])

  useEffect(() => {
    if (Platform.OS === "ios") {
      return
    }
    const unsubscribe = navigation.addListener("blur", () => {
      requestAnimationFrame(() => {
        ArtsyNativeModule.setNavigationBarColor(DEFAULT_NAVIGATION_BAR_COLOR)
        ArtsyNativeModule.setAppLightContrast(false)
      })
    })
    return unsubscribe
  }, [navigation])

  useEffect(() => {
    if (Platform.OS === "ios") {
      return
    }
    const unsubscribe = navigation.addListener("focus", () => {
      requestAnimationFrame(() => {
        ArtsyNativeModule.setNavigationBarColor("#000000")
        ArtsyNativeModule.setAppLightContrast(true)
      })
    })
    return unsubscribe
  }, [navigation])

  return (
    <Screen>
      <Screen.Background>
        <Animated.View
          style={[
            {
              alignItems: "flex-end",
              position: "absolute",
            },
            slideAnim,
          ]}
        >
          <Image
            source={require("images/WelcomeImage.jpg")}
            resizeMode="cover"
            style={{ height: screenHeight }}
          />
        </Animated.View>

        <LinearGradient
          colors={["rgba(0, 0, 0, 0)", `rgba(0, 0, 0, 0.75)`]}
          start={{ x: 0, y: 0 }}
          end={{ x: 0, y: 1 }}
          style={{
            position: "absolute",
            width: "100%",
            height: screenHeight,
          }}
        />
      </Screen.Background>

      <Screen.Body>
        <Spacer y={1} />

        <Animated.View style={[{ alignItems: "center", width: "100%" }, appearAnim]}>
          <ArtsyLogoWhiteIcon height={25} width={75} />
        </Animated.View>

        <Animated.View
          style={[
            {
              flex: 1,
              paddingTop: space(2),
              justifyContent: "flex-end",
            },
            appearAnim,
          ]}
        >
          <Text variant="xl" color="white">
            Collect Art by the World’s Leading Artists
          </Text>

          <Spacer y={1} />

          <Text variant="sm" color="white">
            Build your personalized profile, get market insights, buy and sell art with confidence.
          </Text>

          <Spacer y={2} />

          <Flex flexDirection="row">
            <Flex flex={1}>
              <Button
                variant="fillLight"
                block
                haptic="impactMedium"
                onPress={() => navigation.navigate("OnboardingCreateAccount")}
                testID="button-create"
              >
                Sign up
              </Button>
            </Flex>

            <Spacer x={2} />

            <Flex flex={1}>
              <Button
                variant="outlineLight"
                block
                haptic="impactMedium"
                onPress={() => navigation.navigate("OnboardingLogin")}
                testID="button-login"
              >
                Log in
              </Button>
            </Flex>
          </Flex>

          <Text textAlign="center" color="white" mt={4}>
            Faith Ringgold{" "}
            <Text fontStyle="italic" color="white">
              Groovin' High, 1996
            </Text>
            .
          </Text>

          <Screen.SafeBottomPadding />
        </Animated.View>
      </Screen.Body>
    </Screen>
  )
}
