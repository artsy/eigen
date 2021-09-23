import { useNavigation } from "@react-navigation/native"
import { BackButton } from "lib/navigation/BackButton"
import { GlobalStore, useEnvironment } from "lib/store/GlobalStore"
import { Button, Flex, Join, Spacer, Text } from "palette"
import React, { useEffect } from "react"
import { Alert, Image, Linking, Platform } from "react-native"
import { EnvelopeIcon } from "../../../palette/svgs/EnvelopeIcon"

interface OnboardingSocialPickProps {
  mode: "login" | "signup"
}

export const OnboardingSocialPick: React.FC<OnboardingSocialPickProps> = ({ mode }) => {
  const webURL = useEnvironment().webURL
  const navigation = useNavigation()

  /**
   * When we land on OnboardingSocialPick coming from OnboardingCreatAccount or OnboardingLogin
   * withFadeAnimation is set to true which overrwites the default horizontal slide animation when
   * navigating back,  To avoid that we need to reset withFadeAnimation to false
   */
  useEffect(() => {
    const timeout = setTimeout(() => {
      navigation.setParams({ withFadeAnimation: false })
    }, 1000)

    // When the user presses back on the back button immediately
    // after opening the screen, we need to clear the timeout to avoid
    // setting params on an unmounted screen
    return clearTimeout(timeout)
  }, [])

  const useFacebook = async () => {
    try {
      if (mode === "login") {
        await GlobalStore.actions.auth.authFacebook({ signInOrUp: "signIn" })
      } else {
        await GlobalStore.actions.auth.authFacebook({ signInOrUp: "signUp", agreedToReceiveEmails: true })
      }
    } catch (error) {
      if (typeof error === "string") {
        Alert.alert("Try again", error)
      }
    }
  }

  const useApple = async () => {
    try {
      await GlobalStore.actions.auth.authApple({ agreedToReceiveEmails: true })
    } catch (error) {
      if (typeof error === "string") {
        Alert.alert("Try again", error)
      }
    }
  }

  return (
    <Flex justifyContent="center" alignItems="center" flex={1} px={1.5} backgroundColor="white">
      <BackButton
        onPress={() => {
          navigation.goBack()
        }}
      />
      <Join separator={<Spacer height={60} />}>
        <Text variant="largeTitle">{mode === "login" ? "Log in" : "Create account"}</Text>

        <>
          <Button
            onPress={() => {
              if (mode === "login") {
                navigation.navigate("OnboardingLoginWithEmail")
              } else {
                navigation.navigate("OnboardingCreateAccountWithEmail")
              }
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
            onPress={useFacebook}
            block
            haptic="impactMedium"
            mb={1}
            variant="secondaryOutline"
            icon={<Image source={require("@images/facebook.webp")} resizeMode="contain" style={{ marginRight: 10 }} />}
            testID="useFacebook"
          >
            {mode === "login" ? "Continue with Facebook" : "Sign up with Facebook"}
          </Button>
          {Platform.OS === "ios" && (
            <Button
              onPress={useApple}
              block
              haptic="impactMedium"
              mb={1}
              variant="secondaryOutline"
              icon={<Image source={require("@images/apple.webp")} resizeMode="contain" style={{ marginRight: 10 }} />}
              testID="useApple"
            >
              {mode === "login" ? "Continue with Apple" : "Sign up with Apple"}
            </Button>
          )}
        </>

        <Text variant="small" color="black60" textAlign="center">
          By tapping {mode === "login" ? "Continue with Facebook" : "Sign up with Facebook"} or Apple, you agree to
          Artsy's{" "}
          <Text
            onPress={() => {
              Linking.openURL(`${webURL}/terms`)
            }}
            variant="small"
            style={{ textDecorationLine: "underline" }}
          >
            Terms of Use
          </Text>{" "}
          and{" "}
          <Text
            onPress={() => {
              Linking.openURL(`${webURL}/privacy`)
            }}
            variant="small"
            style={{ textDecorationLine: "underline" }}
          >
            Privacy Policy
          </Text>
        </Text>
      </Join>
      <Flex position="absolute" bottom={40}>
        {mode === "login" ? (
          <Text>
            Don’t have an account?{" "}
            <Text
              onPress={() => {
                // @ts-ignore
                navigation.replace("OnboardingCreateAccount", { withFadeAnimation: true })
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
                // @ts-ignore
                navigation.replace("OnboardingLogin", { withFadeAnimation: true })
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
