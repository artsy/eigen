import { StackScreenProps } from "@react-navigation/stack"
import { useAnimatedValue } from "lib/Components/StickyTabPage/reanimatedHelpers"
import { useScreenDimensions } from "lib/utils/useScreenDimensions"
import { color, Flex, space, Spacer, Text, Touchable } from "palette"
import React, { useEffect } from "react"
import { Image } from "react-native"
import LinearGradient from "react-native-linear-gradient"
import Animated, { Easing } from "react-native-reanimated"
import backgoundImage from "../../../../images/WelcomeImage.png"
import { ArtsyMarkWhiteIcon } from "../../../palette/svgs/ArtsyMarkWhiteIcon"
import { OnboardingNavigationStack } from "./Onboarding"

interface OnboardingWelcomeProps extends StackScreenProps<OnboardingNavigationStack, "OnboardingWelcome"> {}

const BUTTON_HEIGHT = 41

const imgProps = Image.resolveAssetSource(backgoundImage)

export const OnboardingWelcome: React.FC<OnboardingWelcomeProps> = ({ navigation }) => {
  const { height: screenHeight, width: screenWidth } = useScreenDimensions()

  const opacity = useAnimatedValue(0)
  const translateX = useAnimatedValue(0)

  useEffect(() => {
    // We want to animate the background only when the device width is smaller than the image width
    if (screenWidth < imgProps.width) {
      const imgScale = screenHeight / imgProps.height
      const imgWidth = imgProps.width * imgScale

      Animated.timing(translateX, {
        duration: 20000,
        toValue: -(imgWidth - screenWidth),
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

  return (
    <Flex flex={1} removeClippedSubviews={false}>
      <Animated.View
        style={{
          alignItems: "flex-end",
          position: "absolute",
          overflow: "hidden",
          transform: [
            {
              translateX,
            },
          ],
        }}
      >
        <Image
          source={require("@images/WelcomeImage.png")}
          resizeMode="cover"
          style={{
            height: screenHeight,
            overflow: "hidden",
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

      <Animated.View style={{ marginLeft: space(2), marginTop: space(6), opacity }}>
        <ArtsyMarkWhiteIcon height={40} width={40} />
      </Animated.View>

      <Animated.View style={{ flex: 1, padding: space(2), justifyContent: "flex-end", opacity }}>
        {/* <Flex flex={1} p={2} justifyContent="flex-end"> */}
        <Text color="white" fontSize="48px" lineHeight={48}>
          Collect Art{"\n"}by the World’s{"\n"}
          Leading Artists
        </Text>
        <Spacer mt={1} />
        <Text variant="text" color="white">
          Build your personalized profile, get market insights, and buy and sell art with confidence.
        </Text>
        <Spacer mt={2} />
        <Touchable
          onPress={() => navigation.navigate("OnboardingCreateAccount")}
          underlayColor={color("black5")}
          haptic="impactMedium"
          style={{
            height: BUTTON_HEIGHT,
            backgroundColor: "white",
            borderRadius: 3,
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Text color="black" variant="mediumText">
            Create account
          </Text>
        </Touchable>

        <Touchable
          onPress={() => navigation.navigate("OnboardingLogin")}
          underlayColor="transparent"
          haptic="impactMedium"
          style={{ justifyContent: "center", alignItems: "center", height: BUTTON_HEIGHT }}
        >
          <Text color="white" variant="mediumText">
            Log in
          </Text>
        </Touchable>
      </Animated.View>
    </Flex>
  )
}
