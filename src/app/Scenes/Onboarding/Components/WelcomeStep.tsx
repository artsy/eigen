import { Flex, LinkText, Text, useTheme } from "@artsy/palette-mobile"
import { BottomSheetScrollView } from "@gorhom/bottom-sheet"
import { StackScreenProps } from "@react-navigation/stack"
import { BottomSheetInput } from "app/Components/BottomSheetInput"
import { OnboardingHomeNavigationStack } from "app/Scenes/Onboarding/OnboardingHome"
import { OnboardingStore } from "app/Scenes/Onboarding/OnboardingStore"
import { navigate } from "app/system/navigation/navigate"
import { Image } from "react-native"

type WelcomeStepProps = StackScreenProps<OnboardingHomeNavigationStack, "WelcomeStep">

export const WelcomeStep: React.FC<WelcomeStepProps> = ({ navigation }) => {
  const changeStep = OnboardingStore.useStoreActions((actions) => actions.changeStep)
  changeStep("WelcomeStep")

  const { space } = useTheme()

  const handleEmailInputFocus = () => {
    navigation.navigate("EmailStep")
  }

  return (
    <BottomSheetScrollView>
      <Flex padding={2} gap={space(1)}>
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
      </Flex>
    </BottomSheetScrollView>
  )
}
