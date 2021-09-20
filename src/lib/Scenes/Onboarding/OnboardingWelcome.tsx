import { StackScreenProps } from "@react-navigation/stack"
import { useAnimatedValue } from "lib/Components/StickyTabPage/reanimatedHelpers"
import { ArtsyNativeModule } from "lib/NativeModules/ArtsyNativeModule"
import { useScreenDimensions } from "lib/utils/useScreenDimensions"
import { Button, Flex, Spacer, Text, Touchable, useTheme } from "palette"
import React, { useEffect } from "react"
import { Dimensions, Image, Platform } from "react-native"
import LinearGradient from "react-native-linear-gradient"
import Animated, { Easing } from "react-native-reanimated"
import backgoundImage from "../../../../images/WelcomeImage.webp"
import { ArtsyMarkWhiteIcon } from "../../../palette/svgs/ArtsyMarkWhiteIcon"
import { useFeatureFlag } from "../../store/GlobalStore"
import { OnboardingNavigationStack } from "./Onboarding"

interface OnboardingWelcomeProps extends StackScreenProps<OnboardingNavigationStack, "OnboardingWelcome"> {}

const BUTTON_HEIGHT = 41

const imgProps = Image.resolveAssetSource(backgoundImage)

export const OnboardingWelcome: React.FC<OnboardingWelcomeProps> = ({ navigation }) => {
  const { space } = useTheme()
  const { width: screenWidth } = useScreenDimensions()
  const { safeAreaInsets } = useScreenDimensions()
  const AREnableNewOnboardingFlow = useFeatureFlag("AREnableNewOnboardingFlow")
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
    <Flex flex={1} style={{ paddingBottom: safeAreaInsets.bottom }}>
      <Animated.View
        style={{
          alignItems: "flex-end",
          position: "absolute",
          transform: [
            {
              translateX,
            },
          ],
        }}
      >
        <Image
          source={require("@images/WelcomeImage.webp")}
          resizeMode="cover"
          style={{
            height: screenHeight,
          }}
        ></Image>
      </Animated.View>

      <LinearGradient
        colors={["rgba(0, 0, 0, 0.14)", `rgba(0, 0, 0, 0.94)`]}
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 1 }}
        style={{
          position: "absolute",
          width: "100%",
          height: screenHeight,
        }}
      />

      <Animated.View style={{ marginLeft: space("2"), marginTop: space("6"), opacity }}>
        <ArtsyMarkWhiteIcon height={40} width={40} />
      </Animated.View>

      <Animated.View style={{ flex: 1, padding: space("2"), justifyContent: "flex-end", opacity }}>
        <Text color="white" fontSize="48px" lineHeight={52}>
          Collect Art{"\n"}by the World’s{"\n"}
          Leading Artists
        </Text>
        <Spacer mt={1} />
        <Text variant="text" color="white">
          Build your personalized profile, get market insights, and buy and sell art with confidence.
        </Text>
        <Spacer mt={2} />
        <Button
          variant="fillLight"
          block
          haptic="impactMedium"
          onPress={() =>
            AREnableNewOnboardingFlow
              ? navigation.navigate("OnboardingCreateAccount")
              : navigation.navigate("OnboardingCreateAccountWithEmail")
          }
          testID="button-create"
        >
          Create account
        </Button>

        <Touchable
          onPress={() =>
            AREnableNewOnboardingFlow
              ? navigation.navigate("OnboardingLogin")
              : navigation.navigate("OnboardingLoginWithEmail")
          }
          underlayColor="transparent"
          haptic="impactMedium"
          style={{ justifyContent: "center", alignItems: "center", height: BUTTON_HEIGHT }}
          testID="button-login"
        >
          <Text color="white" variant="mediumText">
            Log in
          </Text>
        </Touchable>
      </Animated.View>
    </Flex>
  )
}
