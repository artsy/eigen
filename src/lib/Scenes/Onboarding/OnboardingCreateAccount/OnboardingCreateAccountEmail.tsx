import { StackScreenProps } from "@react-navigation/stack"
import { BackButton } from "lib/navigation/BackButton"
import { Flex, Text } from "palette"
import React from "react"
import { OnboardingCreateAccountNavigationStack } from "./OnboardingCreateAccount"

export interface OnboardingCreateAccountEmailParams {
  navigateToWelcomeScreen: () => void
}

interface OnboardingCreateAccountEmailProps
  extends StackScreenProps<OnboardingCreateAccountNavigationStack, "OnboardingCreateAccountEmail"> {}

export const OnboardingCreateAccountEmail: React.FC<OnboardingCreateAccountEmailProps> = ({ route }) => {
  return (
    <Flex flex={1} justifyContent="center" alignItems="center" backgroundColor="white">
      <BackButton onPress={route.params.navigateToWelcomeScreen} />
      <Text variant="title">OnboardingCreateAccountEmail</Text>
    </Flex>
  )
}
