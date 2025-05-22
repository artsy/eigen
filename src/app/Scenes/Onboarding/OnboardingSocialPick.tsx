import { Button, EnvelopeIcon, Flex, Join, LegacyScreen, Spacer, Text } from "@artsy/palette-mobile"
import { statusCodes } from "@react-native-google-signin/google-signin"
import { NavigationProp, useNavigation } from "@react-navigation/native"
import { captureMessage } from "@sentry/react-native"
import LoadingModal from "app/Components/Modals/LoadingModal"
import { AuthPromiseRejectType, AuthPromiseResolveType } from "app/store/AuthModel"
import { GlobalStore } from "app/store/GlobalStore"
import { showBlockedAuthError } from "app/utils/auth/authHelpers"
import { osMajorVersion } from "app/utils/platformUtil"
import { capitalize } from "lodash"
import { useEffect } from "react"
import { Alert, Image, InteractionManager, Platform } from "react-native"
import { OnboardingNavigationStack } from "./Onboarding"
import { AppleToken, GoogleOrFacebookToken } from "./OnboardingSocialLink"

interface OnboardingSocialPickProps {
  mode: "login" | "signup"
}

export const OnboardingSocialPick: React.FC<OnboardingSocialPickProps> = ({ mode }) => {
  const navigation = useNavigation<NavigationProp<OnboardingNavigationStack>>()
  const isLoading = GlobalStore.useAppState((state) => state.auth.sessionState.isLoading)

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
    if (!meta) {
      return
    }

    const titleizedProvider = capitalize(meta.provider)

    const {
      email,
      name,
      existingProviders: providers,
      provider: providerToBeLinked,
      oauthToken,
      idToken,
      appleUid,
    } = meta
    const navParams: Omit<
      OnboardingNavigationStack["OnboardingSocialLink"],
      "tokenForProviderToBeLinked"
    > = {
      email,
      name: name ?? "",
      providers: providers ?? [],
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
    if (error.message === statusCodes.SIGN_IN_CANCELLED) {
      return
    } else {
      captureMessage("AUTH_FAILURE: " + error.message)

      const canBeLinked =
        error.error === "User Already Exists" && error.meta && error.meta.existingProviders
      if (canBeLinked) {
        handleErrorWithAlternativeProviders(error.meta)
        return
      }
      GlobalStore.actions.auth.setSessionState({ isLoading: false })

      InteractionManager.runAfterInteractions(() => {
        const errorMode = error.message === "Attempt blocked" ? "attempt blocked" : "no account"
        showErrorAlert(errorMode, error)
        return
      })
    }
  }

  const showErrorAlert = (
    errorMode: "no account" | "attempt blocked",
    error: AuthPromiseRejectType
  ) => {
    if (errorMode === "no account") {
      Alert.alert("No Artsy account found", error.message, [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "OK",
          onPress: () => {
            // @ts-expect-error
            navigation.replace(mode === "login" ? "OnboardingCreateAccount" : "OnboardingLogin", {
              withFadeAnimation: true,
            })
          },
        },
      ])
    } else {
      const blockedMode = mode === "login" ? "sign in" : "sign up"
      showBlockedAuthError(blockedMode)
    }
  }

  const handleSocialLogin = async (callback: () => Promise<AuthPromiseResolveType>) => {
    GlobalStore.actions.auth.setSessionState({ isLoading: true })
    InteractionManager.runAfterInteractions(() => {
      callback().catch((error: AuthPromiseRejectType) => {
        InteractionManager.runAfterInteractions(() => {
          GlobalStore.actions.auth.setSessionState({ isLoading: false })
          InteractionManager.runAfterInteractions(() => {
            handleError(error)
          })
        })
      })
    })
  }
  const continueWithApple = () =>
    GlobalStore.actions.auth.authApple({ agreedToReceiveEmails: true })

  const continueWithGoogle = () =>
    GlobalStore.actions.auth.authGoogle({
      signInOrUp: mode === "login" ? "signIn" : "signUp",
      agreedToReceiveEmails: mode === "signup",
    })

  const continueWithFacebook = () =>
    GlobalStore.actions.auth.authFacebook({
      signInOrUp: mode === "login" ? "signIn" : "signUp",
      agreedToReceiveEmails: mode === "signup",
    })

  return (
    <LegacyScreen>
      <LegacyScreen.Header onBack={() => navigation.goBack()} />
      <LegacyScreen.Body>
        <Flex justifyContent="center" flex={1}>
          <LoadingModal isVisible={isLoading} dark />
          <Join separator={<Spacer y={6} />}>
            <Text variant="xl">{mode === "login" ? "Log in" : "Sign Up"}</Text>
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

              {Platform.OS === "ios" && osMajorVersion() >= 13 && (
                <Button
                  onPress={() => handleSocialLogin(continueWithApple)}
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

              <Button
                onPress={() => handleSocialLogin(continueWithGoogle)}
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

              <Button
                onPress={() => handleSocialLogin(continueWithFacebook)}
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

            <Text variant="xs" color="mono60" textAlign="center" testID="disclaimer">
              By tapping Continue with Email, Facebook, Google
              {isIOS ? " or Apple" : ""}, you agree to Artsy's{" "}
              <Text
                onPress={() => navigation.navigate("OnboardingWebView", { url: "/terms" })}
                variant="xs"
                underline
                testID="openTerms"
              >
                Terms and Conditions
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
              <Text variant="sm-display">
                {mode === "login" ? "Don’t have an account?" : "Already have an account?"}
              </Text>
              <Button
                onPress={() =>
                  // @ts-expect-error
                  navigation.replace(
                    mode === "login" ? "OnboardingCreateAccount" : "OnboardingLogin",
                    {
                      withFadeAnimation: true,
                    }
                  )
                }
                variant="text"
              >
                <Text variant="sm-display" underline>
                  {mode === "login" ? "Sign up" : "Log in"}
                </Text>
              </Button>
            </Flex>
          </Join>
        </Flex>
        <LegacyScreen.SafeBottomPadding />
      </LegacyScreen.Body>
    </LegacyScreen>
  )
}
