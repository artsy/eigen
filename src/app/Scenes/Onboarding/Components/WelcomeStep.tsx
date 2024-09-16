import { Flex, LinkText, Text, useTheme } from "@artsy/palette-mobile"
import { BottomSheetInput } from "app/Components/BottomSheetInput"
import { OnboardingStore } from "app/Scenes/Onboarding/OnboardingStore"
import { navigate } from "app/system/navigation/navigate"
import { Image } from "react-native"

export const WelcomeStep: React.FC = () => {
  const navigateToEmailStep = OnboardingStore.useStoreActions(
    (actions) => actions.navigateToEmailStep
  )

  const { space } = useTheme()

  const handleEmailInputFocus = () => {
    navigateToEmailStep()
  }

  return (
    <>
      <Text variant="sm-display">Sign up or log in</Text>

      <BottomSheetInput
        onFocus={handleEmailInputFocus}
        placeholder="Enter your email address"
        title="Email"
      />

      <Flex gap={space(1)}>
        <Text variant="xs" textAlign="center">
          Or continue with
        </Text>
        <Flex flexDirection="row" justifyContent="space-evenly">
          <Flex>
            <Image source={require("images/apple.webp")} resizeMode="contain" />
          </Flex>
          <Flex>
            <Image source={require("images/google.webp")} resizeMode="contain" />
          </Flex>
          <Flex>
            <Image source={require("images/facebook.webp")} resizeMode="contain" />
          </Flex>
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
    </>
  )
}
