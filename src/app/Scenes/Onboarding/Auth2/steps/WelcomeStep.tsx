import { Button, Flex, LinkText, Text, Touchable, useTheme } from "@artsy/palette-mobile"
import { BottomSheetScrollView, useBottomSheet } from "@gorhom/bottom-sheet"
import { StackScreenProps } from "@react-navigation/stack"
import { BottomSheetInput } from "app/Components/BottomSheetInput"
import { EmailStep } from "app/Scenes/Onboarding/Auth2/EmailStep"
import { OnboardingHomeNavigationStack } from "app/Scenes/Onboarding/OnboardingHome"
import { AuthPromiseRejectType, AuthPromiseResolveType } from "app/store/AuthModel"
import { GlobalStore } from "app/store/GlobalStore"
import { navigate } from "app/system/navigation/navigate"
import { osMajorVersion } from "app/utils/platformUtil"
import { useState } from "react"
import { Image, InteractionManager, Platform } from "react-native"

type WelcomeStepProps = StackScreenProps<OnboardingHomeNavigationStack, "WelcomeStep">

export const WelcomeStep: React.FC<WelcomeStepProps> = ({ navigation }) => {
  const [mode, _setMode] = useState<"login" | "signup">("login")

  const bottomSheet = useBottomSheet()

  const { space } = useTheme()

  const handleEmailInputFocus = () => {
    bottomSheet.snapToIndex(1)
    // navigation.navigate("EmailStep")
  }

  const handleSocialLogin = async (callback: () => Promise<AuthPromiseResolveType>) => {
    GlobalStore.actions.auth.setSessionState({ isLoading: true })
    InteractionManager.runAfterInteractions(() => {
      callback().catch((error: AuthPromiseRejectType) => {
        InteractionManager.runAfterInteractions(() => {
          GlobalStore.actions.auth.setSessionState({ isLoading: false })
          InteractionManager.runAfterInteractions(() => {
            // TODO: handle error like OnboardingSocialPick does
            console.error(error)
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

  if (currentStep) {
    return <EmailStep />
  }

  return (
    <BottomSheetScrollView>
      <Flex padding={2} gap={space(1)}>
        <Text variant="sm-display">Sign up or log in</Text>

        <Touchable onPress={handleEmailInputFocus}>
          <BottomSheetInput
            onTouchStart={handleEmailInputFocus}
            placeholder="Enter your email address"
            title="Email"
            style={{ pointerEvents: "none" }}
          />
        </Touchable>

        <Flex gap={space(1)}>
          <Text variant="xs" textAlign="center">
            Or continue with
          </Text>

          <Flex flexDirection="row" justifyContent="space-evenly">
            {Platform.OS === "ios" && osMajorVersion() >= 13 && (
              <Button
                variant="fillDark"
                width="100%"
                onPress={() => handleSocialLogin(continueWithApple)}
              >
                <Image source={require("images/apple.webp")} />
              </Button>
            )}

            <Button
              variant="outline"
              width="100%"
              onPress={() => handleSocialLogin(continueWithGoogle)}
            >
              <Image source={require("images/google.webp")} />
            </Button>

            <Button
              variant="outline"
              width="100%"
              onPress={() => handleSocialLogin(continueWithFacebook)}
            >
              <Image source={require("images/facebook.webp")} />
            </Button>
          </Flex>
        </Flex>

        <Text variant="xxs" color="black60" textAlign="center">
          By tapping Continue with Apple, Facebook, or Google, you agree to Artsy’s{" "}
          <LinkText variant="xxs" onPress={() => navigate("/terms")}>
            Terms of Use
          </LinkText>{" "}
          and{" "}
          <LinkText variant="xxs" onPress={() => navigate("/privacy")}>
            Privacy Policy
          </LinkText>
        </Text>
      </Flex>
    </BottomSheetScrollView>
  )
}
