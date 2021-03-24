import { StackScreenProps } from "@react-navigation/stack"
import { Button, Flex, Text } from "palette"
import React from "react"
import { OnboardingNavigationStack } from "./Onboarding"

interface OnboardingWelcomeProps extends StackScreenProps<OnboardingNavigationStack, "OnboardingWelcome"> {}

export const OnboardingWelcome: React.FC<OnboardingWelcomeProps> = ({ navigation }) => {
  return (
    <Flex flex={1} justifyContent="center" alignItems="center" px={2}>
      <Text variant="largeTitle">Welcome Screen</Text>
      <Button block variant="primaryWhite" mt={5} onPress={() => navigation.navigate("OnboardingLogin")}>
        Login
      </Button>
      <Button block mt={1} onPress={() => navigation.navigate("OnboardingCreateAccount")}>
        Create account
      </Button>
    </Flex>
  )
}
