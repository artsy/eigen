import { StackScreenProps } from "@react-navigation/stack"
import { useScreenDimensions } from "lib/utils/useScreenDimensions"
import { Button, Flex, Spacer, Text } from "palette"
import React from "react"
import { Image, StatusBar } from "react-native"
import LinearGradient from "react-native-linear-gradient"
import { ArtsyMarkWhiteIcon } from "../../../palette/svgs/ArtsyMarkWhiteIcon"
import { OnboardingNavigationStack } from "./Onboarding"

interface OnboardingWelcomeProps extends StackScreenProps<OnboardingNavigationStack, "OnboardingWelcome"> {}

export const OnboardingWelcome: React.FC<OnboardingWelcomeProps> = ({ navigation }) => {
  const { height: screenHeight } = useScreenDimensions()
  return (
    <Flex flex={1} removeClippedSubviews={false}>
      <StatusBar translucent />

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
          Where{"\n"}Collectors{"\n"}Belong
        </Text>
        <Spacer mt={1} />
        <Text variant="text" color="white">
          Build your personalized profile, get market insights, buy and sell with confidence.
        </Text>
        <Spacer mt={2} />
        <Button variant="primaryWhite" block onPress={() => navigation.navigate("OnboardingCreateAccount")}>
          <Text color="black" variant="mediumText">
            Create account
          </Text>
        </Button>
        <Button variant="noOutline" block onPress={() => navigation.navigate("OnboardingLogin")}>
          <Text color="white" variant="mediumText">
            Log in
          </Text>
        </Button>
      </Flex>
    </Flex>
  )
}
