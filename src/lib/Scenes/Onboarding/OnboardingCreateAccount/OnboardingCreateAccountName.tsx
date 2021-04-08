import { StackScreenProps } from "@react-navigation/stack"
import { BackButton } from "lib/navigation/BackButton"
import { Flex, Text } from "palette"
import React from "react"
import { OnboardingCreateAccountNavigationStack } from "./OnboardingCreateAccount"

export interface OnboardingCreateAccountNameProps
  extends StackScreenProps<OnboardingCreateAccountNavigationStack, "OnboardingCreateAccountName"> {}

export const OnboardingCreateAccountName = () => {
  return (
    <Flex flex={1} justifyContent="center" alignItems="center" backgroundColor="white">
      <BackButton
        onPress={() => {
          // Navigate back to OnboardingCreateAccountPassword screen
        }}
      />
      <Text variant="title">OnboardingCreateAccountName</Text>
    </Flex>
  )
}
