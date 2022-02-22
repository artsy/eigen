import { useNavigation } from "@react-navigation/native"
import { BackButton } from "app/navigation/BackButton"
import { navigate } from "app/navigation/navigate"
import { AuthPromiseRejectType } from "app/store/AuthModel"
import { GlobalStore } from "app/store/GlobalStore"
import { capitalize } from "lodash"
import { Button, Flex, Join, Spacer, Text } from "palette"
import React, { useEffect } from "react"
import { Alert, Image, Platform } from "react-native"
import { EnvelopeIcon } from "../../../palette/svgs/EnvelopeIcon"
import { useFeatureFlag } from "../../store/GlobalStore"
import { AppleToken, GoogleOrFacebookToken } from "./OnboardingSocialLink"

interface OnboardingSocialPickProps {
  mode: "login" | "signup"
}

export const OnboardingSocialPick: React.FC<OnboardingSocialPickProps> = ({ mode }) => {
  const navigation = useNavigation()

  const enableGoogleAuth = useFeatureFlag("ARGoogleAuth")

  const allowLinkingOnSignUp = useFeatureFlag("ARAllowLinkSocialAccountsOnSignUp")

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

  const handleErrorWithAlternativeProviders = (meta: AuthPromiseRejectType["meta"]) => {
    const titleizedProvider = capitalize(meta?.provider ?? "")
    const {
      email,
      name,
      existingProviders: providers,
      provider: providerToBeLinked,
      oauthToken,
      idToken,
      appleUid,
    } = meta!
    const navParams = {
      email,
      name,
      providers,
      providerToBeLinked,
    }
    let tokenForProviderToBeLinked: GoogleOrFacebookToken | AppleToken
    if (["google", "facebook"].includes(providerToBeLinked)) {
      if (!oauthToken) {
        console.warn(`Error: No oauthToken provided for ${titleizedProvider}`)
        return
      }
      tokenForProviderToBeLinked = oauthToken
      navigation.navigate("OnboardingSocialLink", {
        ...navParams,
        tokenForProviderToBeLinked,
      })
    } else if (providerToBeLinked === "apple") {
      if (!idToken || !appleUid) {
        console.warn(`Error: idToken and appleUid must be provided for ${titleizedProvider}`)
        return
      }
      tokenForProviderToBeLinked = { idToken, appleUid }
      navigation.navigate("OnboardingSocialLink", {
        ...navParams,
        tokenForProviderToBeLinked,
      })
    }
  }

  const handleError = (error: AuthPromiseRejectType) => {
    const canBeLinked =
      error.error === "User Already Exists" && error.meta && error.meta.existingProviders
    if (canBeLinked && allowLinkingOnSignUp) {
      handleErrorWithAlternativeProviders(error.meta)
      return
    }
    Alert.alert("Try again", error.message)
  }

  const continueWithFacebook = () => {
    if (mode === "login") {
      GlobalStore.actions.auth
        .authFacebook({ signInOrUp: "signIn" })
        .catch((error: AuthPromiseRejectType) => {
          handleError(error)
        })
    } else {
      GlobalStore.actions.auth
        .authFacebook({ signInOrUp: "signUp", agreedToReceiveEmails: true })
        .catch((error: AuthPromiseRejectType) => {
          handleError(error)
        })
    }
  }

  const continueWithGoogle = () => {
    if (mode === "login") {
      GlobalStore.actions.auth
        .authGoogle({ signInOrUp: "signIn" })
        .catch((error: AuthPromiseRejectType) => {
          handleError(error)
        })
    } else {
      GlobalStore.actions.auth
        .authGoogle({ signInOrUp: "signUp", agreedToReceiveEmails: true })
        .catch((error: AuthPromiseRejectType) => {
          handleError(error)
        })
    }
  }

  const continueWithApple = () => {
    GlobalStore.actions.auth
      .authApple({ agreedToReceiveEmails: true })
      .catch((error: AuthPromiseRejectType) => {
        handleError(error)
      })
  }

  const isiOS = Platform.OS === "ios"
  return (
    <Flex justifyContent="center" flex={1} backgroundColor="white">
      <BackButton onPress={() => navigation.goBack()} />
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
              testID="continueWithEmail"
            >
              Continue with Email
            </Button>
            {Platform.OS === "ios" && (
              <Button
                onPress={continueWithApple}
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
                testID="continueWithApple"
              >
                Continue with Apple
              </Button>
            )}
            {!!enableGoogleAuth && (
              <Button
                onPress={continueWithGoogle}
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
                testID="continueWithGoogle"
              >
                Continue with Google
              </Button>
            )}

            <Button
              onPress={continueWithFacebook}
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
              testID="continueWithFacebook"
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
