import {
  ArtsyLogoWhiteIcon,
  Button,
  Flex,
  LegacyScreen,
  Spacer,
  Text,
  useTheme,
} from "@artsy/palette-mobile"
import { StackScreenProps } from "@react-navigation/stack"
import {
  ArtsyNativeModule,
  DEFAULT_NAVIGATION_BAR_COLOR,
} from "app/NativeModules/ArtsyNativeModule"
import { useScreenDimensions } from "app/utils/hooks"
import { MotiImage, MotiView } from "moti"
import { useEffect } from "react"
import { Dimensions, Platform } from "react-native"
import { OnboardingNavigationStack } from "./Onboarding"

type OnboardingWelcomeProps = StackScreenProps<OnboardingNavigationStack, "OnboardingWelcome">

export const OnboardingWelcome: React.FC<OnboardingWelcomeProps> = ({ navigation }) => {
  const { space } = useTheme()
  const { width: screenWidth } = useScreenDimensions()
  // useScreenDimensions() returns the window height instead of the screen
  // We need the entire screen height here because the background image should fill
  // the entire screen including drawing below the navigation bar
  const { height: screenHeight } = Dimensions.get("screen")

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
        <MotiImage
          source={require("images/WelcomeImage.webp")}
          resizeMode="cover"
          style={{ height: screenHeight, width: screenWidth, alignSelf: "center" }}
          from={{ scale: 1 }}
          animate={{ scale: 1.2 }}
          transition={{ type: "timing", duration: 10000 }}
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
          <ArtsyLogoWhiteIcon height={25} width={75} />
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
          <Text variant="xl" color="white">
            Collect Art by the World’s Leading Artists
          </Text>

          <Spacer y={1} />

          <Text variant="sm" color="white">
            Build your personalized profile, get market insights, buy and sell art with confidence.
          </Text>

          <Spacer y={2} />

          <Flex flexDirection="row" mb={6}>
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

          <LegacyScreen.SafeBottomPadding />
        </MotiView>
      </LegacyScreen.Body>
    </LegacyScreen>
  )
}
