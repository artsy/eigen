import { ArtsyLogoIcon } from "@artsy/icons/native"
import { Spacer, useTheme, Flex, Text, Button, LegacyScreen } from "@artsy/palette-mobile"
import { StackScreenProps } from "@react-navigation/stack"
import {
  ArtsyNativeModule,
  DEFAULT_NAVIGATION_BAR_COLOR,
} from "app/NativeModules/ArtsyNativeModule"
import { useScreenDimensions } from "app/utils/hooks"
import { useSwitchStatusBarStyle } from "app/utils/useStatusBarStyle"
import backgroundImage from "images/WelcomeImage.webp"
import { MotiView } from "moti"
import { useEffect } from "react"
import { Dimensions, Image, Platform } from "react-native"
import LinearGradient from "react-native-linear-gradient"
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSequence,
  withTiming,
} from "react-native-reanimated"
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

  // background sliding
  const translateX = useSharedValue(0)
  const slideAnim = useAnimatedStyle(() => {
    "worklet"
    return { transform: [{ translateX: translateX.get() }] }
  })
  useEffect(() => {
    // We want to animate the background only when the device width is smaller than the scaled image width
    const imgScale = imgProps.height / screenHeight
    const imgWidth = imgProps.width * imgScale
    // animate the background only when the device width is smaller than the scaled image width
    if (screenWidth < imgWidth) {
      const rightMarginFirstStop = 120
      const rightMarginSecondStop = 320
      translateX.set(() =>
        withSequence(
          withTiming(-(imgWidth - screenWidth - rightMarginFirstStop), { duration: 40000 }),
          withTiming(-(imgWidth - screenWidth - rightMarginSecondStop), { duration: 10000 })
        )
      )
    }
  }, [])

  useSwitchStatusBarStyle("light-content", "dark-content")

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
    <LegacyScreen>
      <LegacyScreen.Background>
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
            source={require("images/WelcomeImage.webp")}
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
      </LegacyScreen.Background>

      <LegacyScreen.Body>
        <Spacer y={1} />

        <MotiView
          style={{ alignItems: "center", width: "100%" }}
          from={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ type: "timing", duration: 1500 }}
        >
          {/* we explicitly want it to be white */}
          <ArtsyLogoIcon fill="white" height={25} width={75} />
        </MotiView>

        <MotiView
          style={{
            flex: 1,
            paddingTop: space(2),
            justifyContent: "flex-end",
          }}
          from={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ type: "timing", duration: 1500 }}
        >
          <Text variant="xl" color="mono0">
            Collect Art by the World’s Leading Artists
          </Text>

          <Spacer y={1} />

          <Text variant="sm" color="mono0">
            Build your personalized profile, get market insights and buy art with confidence.
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

          <Text textAlign="center" color="mono30" mt={4}>
            Faith Ringgold{" "}
            <Text fontStyle="italic" color="mono30">
              Groovin' High, 1996
            </Text>
            .
          </Text>

          <LegacyScreen.SafeBottomPadding />
        </MotiView>
      </LegacyScreen.Body>
    </LegacyScreen>
  )
}
