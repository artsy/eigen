import { useNavigation } from "@react-navigation/native"
import { AuthPromiseRejectType } from "app/store/AuthModel"
import { GlobalStore } from "app/store/GlobalStore"
import { capitalize } from "lodash"
import { Button, Flex, Join, Screen, Spacer, Text } from "palette"
import { useEffect } from "react"
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
  const isIOS = Platform.OS === "ios"

  // When we land on OnboardingSocialPick coming from OnboardingCreateAccount or OnboardingLogin
  // withFadeAnimation is set to true which overwrites the default horizontal slide animation when
  // navigating back. To avoid that we need to reset withFadeAnimation to false
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

  const continueWithApple = () =>
    GlobalStore.actions.auth
      .authApple({ agreedToReceiveEmails: true })
      .catch((error: AuthPromiseRejectType) => handleError(error))

  const continueWithGoogle = () =>
    GlobalStore.actions.auth
      .authGoogle({
        signInOrUp: mode === "login" ? "signIn" : "signUp",
        agreedToReceiveEmails: mode === "signup",
      })
      .catch((error: AuthPromiseRejectType) => handleError(error))

  const continueWithFacebook = () =>
    GlobalStore.actions.auth
      .authFacebook({
        signInOrUp: mode === "login" ? "signIn" : "signUp",
        agreedToReceiveEmails: mode === "signup",
      })
      .catch((error: AuthPromiseRejectType) => handleError(error))

  return (
    <Screen>
      <Screen.Header onBack={() => navigation.goBack()} />
      <Screen.Body>
        <Flex justifyContent="center" flex={1}>
          <Join separator={<Spacer y={60} />}>
            <Text variant="xxl">{mode === "login" ? "Log in" : "Sign Up"}</Text>

            <>
              <Button
                onPress={() =>
                  mode === "login"
                    ? navigation.navigate("OnboardingLoginWithEmail")
                    : navigation.navigate("OnboardingCreateAccountWithEmail")
                }
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
                      source={require("images/apple.webp")}
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
                      source={require("images/google.webp")}
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
                    source={require("images/facebook.webp")}
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
              {isIOS ? " or Apple" : ""}, you agree to Artsy's{" "}
              <Text
                onPress={() => navigation.navigate("OnboardingWebView", { url: "/terms" })}
                variant="xs"
                underline
                testID="openTerms"
              >
                Terms of Use
              </Text>{" "}
              and{" "}
              <Text
                onPress={() => navigation.navigate("OnboardingWebView", { url: "/privacy" })}
                variant="xs"
                underline
                testID="openPrivacy"
              >
                Privacy Policy
              </Text>
            </Text>

            <Flex position="absolute" bottom={0} left={0} right={0} alignItems="center">
              <Text variant="lg">
                {mode === "login" ? "Don’t have an account?" : "Already have an account?"}
              </Text>
              <Text
                variant="lg"
                underline
                onPress={() =>
                  // @ts-expect-error
                  navigation.replace(
                    mode === "login" ? "OnboardingCreateAccount" : "OnboardingLogin",
                    {
                      withFadeAnimation: true,
                    }
                  )
                }
              >
                {mode === "login" ? "Sign up" : "Log in"}
              </Text>
            </Flex>
          </Join>
        </Flex>
        <Screen.SafeBottomPadding />
      </Screen.Body>
    </Screen>
  )
}
