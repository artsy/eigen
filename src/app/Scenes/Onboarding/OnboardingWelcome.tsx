import { StackScreenProps } from "@react-navigation/stack"
import { useAnimatedValue } from "app/Components/StickyTabPage/reanimatedHelpers"
import { ArtsyNativeModule } from "app/NativeModules/ArtsyNativeModule"
import backgoundImage from "images/WelcomeImage.webp"
import { ArtsyLogoWhiteIcon, Button, Flex, Screen, Spacer, Text, useTheme } from "palette"
import React, { useEffect } from "react"
import { Dimensions, Image, Platform } from "react-native"
import LinearGradient from "react-native-linear-gradient"
import Animated, { Easing } from "react-native-reanimated"
import { useScreenDimensions } from "shared/hooks"
import { OnboardingNavigationStack } from "./Onboarding"

interface OnboardingWelcomeProps
  extends StackScreenProps<OnboardingNavigationStack, "OnboardingWelcome"> {}

const imgProps = Image.resolveAssetSource(backgoundImage)

export const OnboardingWelcome: React.FC<OnboardingWelcomeProps> = ({ navigation }) => {
  const { space } = useTheme()
  const { width: screenWidth } = useScreenDimensions()
  // useScreenDimensions() returns the window height instead of the screen
  // We need the entire screen height here because the background image should fill
  // the entire screen including drawing below the navigation bar
  const { height: screenHeight } = Dimensions.get("screen")

  const opacity = useAnimatedValue(0)
  const translateX = useAnimatedValue(0)

  useEffect(() => {
    // We want to animate the background only when the device width is smaller than the scaled image width
    const imgScale = imgProps.height / screenHeight
    const imgWidth = imgProps.width * imgScale
    if (screenWidth < imgWidth) {
      const iOSRightMarging = Platform.OS === "ios" ? 120 : 0
      Animated.timing(translateX, {
        duration: 40000,
        toValue: -(imgWidth - iOSRightMarging - screenWidth),
        easing: Easing.inOut(Easing.ease),
      }).start()
    }

    setTimeout(() => {
      Animated.spring(opacity, {
        ...Animated.SpringUtils.makeDefaultConfig(),
        stiffness: 800,
        damping: 320,
        restSpeedThreshold: 0.5,
        mass: 3,
        toValue: 1,
      }).start()
    }, 1000)
  }, [])

  useEffect(() => {
    if (Platform.OS === "ios") {
      return
    }
    const unsubscribe = navigation.addListener("blur", () => {
      requestAnimationFrame(() => {
        ArtsyNativeModule.setNavigationBarColor("#FFFFFF")
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
          style={{
            alignItems: "flex-end",
            position: "absolute",
            transform: [{ translateX }],
          }}
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
      </Screen.Background>

      <Screen.Body>
        <Spacer y="1" />

        <Animated.View style={{ alignItems: "center", opacity, width: "100%" }}>
          <ArtsyLogoWhiteIcon height={25} width={75} />
        </Animated.View>

        <Animated.View
          style={{
            flex: 1,
            paddingTop: space(2),
            justifyContent: "flex-end",
            opacity,
          }}
        >
          <Text variant="xxl" color="white">
            Collect Art by the World’s Leading Artists
          </Text>

          <Spacer mt={1} />

          <Text variant="sm" color="white">
            Build your personalized profile, get market insights, buy and sell art with confidence.
          </Text>

          <Spacer mt={2} />

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

            <Spacer x="2" />

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

          <Text textAlign="center" color="black30" mt={4}>
            Faith Ringgold <Text fontStyle="italic">Groovin' High, 1996</Text>.
          </Text>

          <Screen.SafeBottomPadding />
        </Animated.View>
      </Screen.Body>
    </Screen>
  )
}
