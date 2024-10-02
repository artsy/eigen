import { Spacer, ArtsyLogoWhiteIcon, Text, Screen } from "@artsy/palette-mobile"
import { StackScreenProps } from "@react-navigation/stack"
import {
  ArtsyNativeModule,
  DEFAULT_NAVIGATION_BAR_COLOR,
} from "app/NativeModules/ArtsyNativeModule"
import { AuthenticationDialog } from "app/Scenes/Onboarding/Auth2/AuthenticationDialog"
import { useScreenDimensions } from "app/utils/hooks"
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

type OnboardingHomeProps = StackScreenProps<OnboardingNavigationStack, "OnboardingHome">

const imgProps = Image.resolveAssetSource(backgroundImage)

export const OnboardingHome: React.FC<OnboardingHomeProps> = ({ navigation }) => {
  useAndroidStatusBarColor(navigation)

  return (
    <Screen safeArea={false}>
      <Screen.Background>
        <Background />
      </Screen.Background>

      <Screen.Body>
        {/* <Flex position="absolute" width="100%" height="100%"> */}
        {/* <ArtsyLogo /> */}
        {/* <WelcomeText /> */}
        {/* </Flex> */}
        <AuthenticationDialog mt={6} mb={4} />
        {/* </Flex> */}
      </Screen.Body>
    </Screen>
  )
}

const Background: React.FC = () => {
  const { width: screenWidth } = useScreenDimensions()
  // useScreenDimensions() returns the window height instead of the screen
  // We need the entire screen height here because the background image should fill
  // the entire screen including drawing below the navigation bar
  const { height: screenHeight } = Dimensions.get("screen")

  // background sliding
  const translateX = useSharedValue(0)
  const slideAnim = useAnimatedStyle(() => {
    "worklet"
    return { transform: [{ translateX: translateX.value }] }
  })

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

  return (
    <>
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
    </>
  )
}

const ArtsyLogo: React.FC = () => {
  const currentStep = OnboardingContext.useStoreState((state) => state.currentStep)

  if (currentStep !== "WelcomeStep") {
    return null
  }

  return (
    <MotiView
      style={{ flex: 1, alignItems: "center", width: "100%" }}
      from={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ type: "timing", duration: 1500 }}
    >
      <Spacer y={1} />
      <ArtsyLogoWhiteIcon height={25} width={75} />
    </MotiView>
  )
}

const WelcomeText: React.FC = () => {
  const currentStep = OnboardingContext.useStoreState((state) => state.currentStep)

  if (currentStep !== "WelcomeStep") {
    return null
  }

  return (
    <MotiView
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
    </MotiView>
  )
}

const useAndroidStatusBarColor = (navigation: OnboardingHomeProps["navigation"]) => {
  useEffect(() => {
    if (Platform.OS === "ios") {
      return
    }

    const unsubscribeBlur = navigation.addListener("blur", () => {
      requestAnimationFrame(() => {
        ArtsyNativeModule.setNavigationBarColor(DEFAULT_NAVIGATION_BAR_COLOR)
        ArtsyNativeModule.setAppLightContrast(false)
      })
    })

    const unsubscribeFocus = navigation.addListener("focus", () => {
      requestAnimationFrame(() => {
        ArtsyNativeModule.setNavigationBarColor("#000000")
        ArtsyNativeModule.setAppLightContrast(true)
      })
    })

    return () => {
      unsubscribeBlur()
      unsubscribeFocus()
    }
  }, [navigation])
}
