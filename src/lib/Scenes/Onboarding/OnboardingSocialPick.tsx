import { useNavigation } from "@react-navigation/native"
import { BackButton } from "lib/navigation/BackButton"
import { navigate } from "lib/navigation/navigate"
import { GlobalStore } from "lib/store/GlobalStore"
import { Button, Flex, Join, Spacer, Text } from "palette"
import React, { useEffect } from "react"
import { Alert, Image, Platform } from "react-native"
import { EnvelopeIcon } from "../../../palette/svgs/EnvelopeIcon"
import { useFeatureFlag } from "../../store/GlobalStore"

interface OnboardingSocialPickProps {
  mode: "login" | "signup"
}

export const OnboardingSocialPick: React.FC<OnboardingSocialPickProps> = ({ mode }) => {
  const navigation = useNavigation()

  const enableGoogleAuth = useFeatureFlag("ARGoogleAuth")

  /**
   * When we land on OnboardingSocialPick coming from OnboardingCreateAccount or OnboardingLogin
   * withFadeAnimation is set to true which overrwites the default horizontal slide animation when
   * navigating back. To avoid that we need to reset withFadeAnimation to false
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
        await GlobalStore.actions.auth.authFacebook({
          signInOrUp: "signUp",
          agreedToReceiveEmails: true,
        })
      }
    } catch (error) {
      if (typeof error === "string") {
        Alert.alert("Try again", error)
      }
    }
  }

  const useGoogle = async () => {
    try {
      if (mode === "login") {
        await GlobalStore.actions.auth.authGoogle({ signInOrUp: "signIn" })
      } else {
        await GlobalStore.actions.auth.authGoogle({
          signInOrUp: "signUp",
          agreedToReceiveEmails: true,
        })
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

  const isiOS = Platform.OS === "ios"
  return (
    <Flex justifyContent="center" flex={1} backgroundColor="white">
      <BackButton
        onPress={() => {
          navigation.goBack()
        }}
      />
      <Flex px={1.5}>
        <Join separator={<Spacer height={60} />}>
          <Text variant="xxl">{mode === "login" ? "Log in" : "Sign Up"}</Text>

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
              variant="outline"
              iconPosition="left-start"
              icon={<EnvelopeIcon mr={1} />}
              testID="useEmail"
            >
              Continue with Email
            </Button>
            {Platform.OS === "ios" && (
              <Button
                onPress={useApple}
                block
                haptic="impactMedium"
                mb={1}
                variant="fillDark"
                iconPosition="left-start"
                icon={
                  <Image
                    source={require("@images/apple.webp")}
                    resizeMode="contain"
                    style={{ marginRight: 10 }}
                  />
                }
                testID="useApple"
              >
                Continue with Apple
              </Button>
            )}
            {!!enableGoogleAuth && (
              <Button
                onPress={useGoogle}
                block
                haptic="impactMedium"
                mb={1}
                variant="outline"
                iconPosition="left-start"
                icon={
                  <Image
                    source={require("@images/google.webp")}
                    resizeMode="contain"
                    style={{ marginRight: 10 }}
                  />
                }
                testID="useGoogle"
              >
                Continue with Google
              </Button>
            )}

            <Button
              onPress={useFacebook}
              block
              haptic="impactMedium"
              mb={1}
              variant="outline"
              iconPosition="left-start"
              icon={
                <Image
                  source={require("@images/facebook.webp")}
                  resizeMode="contain"
                  style={{ marginRight: 10 }}
                />
              }
              testID="useFacebook"
            >
              Continue with Facebook
            </Button>
          </>

          <Text variant="xs" color="black60" textAlign="center">
            By tapping Continue with Facebook
            {!!enableGoogleAuth ? ", Google" : ""}
            {isiOS ? " or Apple" : ""}, you agree to Artsy's{" "}
            <Text
              onPress={() =>
                isiOS ? navigate("/terms", { modal: true }) : navigation.navigate("Terms")
              }
              variant="xs"
              style={{ textDecorationLine: "underline" }}
              testID="openTerms"
            >
              Terms of Use
            </Text>{" "}
            and{" "}
            <Text
              onPress={() =>
                isiOS ? navigate("/privacy", { modal: true }) : navigation.navigate("Privacy")
              }
              variant="xs"
              style={{ textDecorationLine: "underline" }}
              testID="openPrivacy"
            >
              Privacy Policy
            </Text>
          </Text>
        </Join>
      </Flex>
      <Flex position="absolute" bottom={40} width="100%">
        {mode === "login" ? (
          <Text variant="lg" textAlign="center">
            Don’t have an account?{"\n"}
            <Text
              onPress={() => {
                // @ts-ignore
                navigation.replace("OnboardingCreateAccount", { withFadeAnimation: true })
              }}
              style={{ textDecorationLine: "underline" }}
              variant="lg"
            >
              Sign up
            </Text>
          </Text>
        ) : (
          <Text variant="lg" textAlign="center">
            Already have an account?{"\n"}
            <Text
              onPress={() => {
                // @ts-ignore
                navigation.replace("OnboardingLogin", { withFadeAnimation: true })
              }}
              style={{ textDecorationLine: "underline" }}
              variant="lg"
            >
              Log in
            </Text>
          </Text>
        )}
      </Flex>
    </Flex>
  )
}
