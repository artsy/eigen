import { useNavigation } from "@react-navigation/native"
import { useEnvironment } from "lib/store/GlobalStore"
import { Button, Flex, Join, Spacer, Text } from "palette"
import React from "react"
import { Image, Linking } from "react-native"
import { EnvelopeIcon } from "../../../palette/svgs/EnvelopeIcon"

interface OnboardingSocialPickProps {
  mode: "login" | "signup"
}

export const OnboardingSocialPick: React.FC<OnboardingSocialPickProps> = ({ mode }) => {
  const webURL = useEnvironment().webURL
  const navigation = useNavigation()

  return (
    <Flex justifyContent="center" alignItems="center" flex={1} px={1.5} backgroundColor="white">
      <Join separator={<Spacer height={60} />}>
        <Text variant="largeTitle">{mode === "login" ? "Log in" : "Create account"}</Text>

        <>
          <Button
            onPress={() => {
              // Do nothing
            }}
            block
            haptic="impactMedium"
            mb={1}
            variant="secondaryOutline"
            icon={<EnvelopeIcon mr={1} />}
            testID="useEmail"
          >
            {mode === "login" ? "Continue with email" : "Sign up with email"}
          </Button>
          <Button
            onPress={() => {
              // Do nothing
            }}
            block
            haptic="impactMedium"
            mb={1}
            variant="secondaryOutline"
            icon={<Image source={require("@images/facebook.png")} resizeMode="contain" style={{ marginRight: 10 }} />}
            testID="useFacebook"
          >
            {mode === "login" ? "Continue with Facebook" : "Sign up with Facebook"}
          </Button>
          <Button
            onPress={() => {
              // Do nothing
            }}
            block
            haptic="impactMedium"
            mb={1}
            variant="secondaryOutline"
            icon={<Image source={require("@images/apple.png")} resizeMode="contain" style={{ marginRight: 10 }} />}
            testID="useApple"
          >
            {mode === "login" ? "Continue with Apple" : "Sign up with Apple"}
          </Button>
        </>

        <Text variant="small" color="black60" textAlign="center">
          I agree to Artsy’s{" "}
          <Text
            onPress={() => {
              Linking.openURL(`${webURL}/terms`)
            }}
            style={{ textDecorationLine: "underline" }}
          >
            Terms of Use
          </Text>
          ,{" "}
          <Text
            onPress={() => {
              Linking.openURL(`${webURL}/privacy`)
            }}
            style={{ textDecorationLine: "underline" }}
          >
            Privacy Policy
          </Text>
          , and{" "}
          <Text
            onPress={() => {
              Linking.openURL(`${webURL}/conditions-of-sale`)
            }}
            style={{ textDecorationLine: "underline" }}
          >
            Conditions of Sale
          </Text>
          .
        </Text>
      </Join>
      <Flex position="absolute" bottom={40}>
        {mode === "login" ? (
          <Text>
            Don’t have an account?{" "}
            <Text
              onPress={() => {
                navigation.navigate("OnboardingCreateAccount")
              }}
              style={{ textDecorationLine: "underline" }}
            >
              Sign up
            </Text>
          </Text>
        ) : (
          <Text>
            Already have an account?{" "}
            <Text
              onPress={() => {
                navigation.navigate("OnboardingLogin")
              }}
              style={{ textDecorationLine: "underline" }}
            >
              Log in
            </Text>
          </Text>
        )}
      </Flex>
    </Flex>
  )
}
