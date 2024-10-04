import { Button, Flex, Input, LinkText, Spacer, Text, Touchable } from "@artsy/palette-mobile"
import { AuthContext } from "app/Scenes/Onboarding/Auth2/AuthContext"
import { useAuthNavigation } from "app/Scenes/Onboarding/Auth2/hooks/useAuthNavigation"
import { AuthPromiseRejectType, AuthPromiseResolveType } from "app/store/AuthModel"
import { GlobalStore } from "app/store/GlobalStore"
import { navigate } from "app/system/navigation/navigate"
import { osMajorVersion } from "app/utils/platformUtil"
import { useState } from "react"
import { Image, InteractionManager, Platform } from "react-native"

export const WelcomeStep: React.FC = () => {
  const setModalExpanded = AuthContext.useStoreActions((actions) => actions.setModalExpanded)

  const navigation = useAuthNavigation()

  const handleEmailPress = () => {
    requestAnimationFrame(() => {
      navigation.navigate({ name: "LoginEmailStep" })
      setModalExpanded(true)
    })
  }

  return (
    <Flex p={2}>
      <Text variant="sm-display">Sign up or log in</Text>

      <Touchable onPress={handleEmailPress}>
        <Input
          placeholder="Enter your email address"
          title="Email"
          style={{
            pointerEvents: "none",
          }}
        />
      </Touchable>

      <Spacer y={2} />

      <SocialLoginButtons />

      <Spacer y={1} />

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
  )
}

const SocialLoginButtons: React.FC = () => {
  const [mode, _setMode] = useState<"login" | "signup">("login")

  const handleApplePress = () =>
    onSocialLogin(() => {
      return GlobalStore.actions.auth.authApple({ agreedToReceiveEmails: true })
    })

  const handleGooglePress = () =>
    onSocialLogin(() => {
      return GlobalStore.actions.auth.authGoogle({
        signInOrUp: mode === "login" ? "signIn" : "signUp",
        agreedToReceiveEmails: mode === "signup",
      })
    })

  const handleFacebookPress = () =>
    onSocialLogin(() => {
      return GlobalStore.actions.auth.authFacebook({
        signInOrUp: mode === "login" ? "signIn" : "signUp",
        agreedToReceiveEmails: mode === "signup",
      })
    })

  return (
    <Flex>
      <Text variant="xs" textAlign="center">
        Or continue with
      </Text>

      <Spacer y={1} />

      <Flex flexDirection="row" justifyContent="space-evenly" width="100%">
        {Platform.OS === "ios" && osMajorVersion() >= 13 && (
          <Button variant="fillDark" width="100%" onPress={handleApplePress}>
            <Flex height="100%" justifyContent="center" alignItems="center">
              <Image source={require("images/apple.webp")} />
            </Flex>
          </Button>
        )}

        <Button variant="outline" onPress={handleGooglePress}>
          <Flex justifyContent="center" alignItems="center">
            <Image
              source={require("images/google.webp")}
              style={{ position: "relative", top: 2 }}
            />
          </Flex>
        </Button>

        <Button variant="outline" width="100%" onPress={handleFacebookPress}>
          <Flex justifyContent="center" alignItems="center">
            <Image
              source={require("images/facebook.webp")}
              style={{ position: "relative", top: 2 }}
            />
          </Flex>
        </Button>
      </Flex>
    </Flex>
  )
}

const onSocialLogin = async (callback: () => Promise<AuthPromiseResolveType>) => {
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
