import { StackScreenProps } from "@react-navigation/stack"
import { ArtsyNativeModule } from "lib/NativeModules/ArtsyNativeModule"
import { useScreenDimensions } from "lib/utils/useScreenDimensions"
import { color, Flex, Spacer, Text, Touchable } from "palette"
import React, { useEffect } from "react"
import { Image } from "react-native"
import LinearGradient from "react-native-linear-gradient"
import { ArtsyMarkWhiteIcon } from "../../../palette/svgs/ArtsyMarkWhiteIcon"
import { OnboardingNavigationStack } from "./Onboarding"

interface OnboardingWelcomeProps extends StackScreenProps<OnboardingNavigationStack, "OnboardingWelcome"> {}

const BUTTON_HEIGHT = 41

export const OnboardingWelcome: React.FC<OnboardingWelcomeProps> = ({ navigation }) => {
  const { height: screenHeight } = useScreenDimensions()

  useEffect(() => {
    const unsubscribe = navigation.addListener("blur", () => {
      requestAnimationFrame(() => {
        ArtsyNativeModule.setNavigationBarColor("#FFFFFF")
        ArtsyNativeModule.setAppLightContrast(false)
      })
    })
    return unsubscribe
  }, [navigation])

  useEffect(() => {
    const unsubscribe = navigation.addListener("focus", () => {
      requestAnimationFrame(() => {
        ArtsyNativeModule.setNavigationBarColor("#000000")
        ArtsyNativeModule.setAppLightContrast(true)
      })
    })
    return unsubscribe
  }, [navigation])

  return (
    <Flex flex={1} backgroundColor="black">
      <Flex alignItems="flex-end" position="absolute">
        <Image source={require("@images/WelcomeImage.png")} resizeMode="cover" style={{ height: screenHeight }}></Image>
      </Flex>

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

      <Flex ml={2} mt={6}>
        <ArtsyMarkWhiteIcon height={40} width={40} />
      </Flex>

      <Flex flex={1} p={2} justifyContent="flex-end">
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
      </Flex>
    </Flex>
  )
}
