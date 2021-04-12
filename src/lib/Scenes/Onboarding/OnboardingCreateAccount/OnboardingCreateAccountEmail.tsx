import { useIsFocused } from "@react-navigation/native"
import { StackScreenProps } from "@react-navigation/stack"
import { BackButton } from "lib/navigation/BackButton"
import { Flex, Text } from "palette"
import React, { useEffect } from "react"
import { OnboardingCreateAccountNavigationStack } from "./OnboardingCreateAccount"
import { OnboardingCreateAccountStore } from "./OnboardingCreateAccountStore"

export interface OnboardingCreateAccountEmailParams {
  navigateToWelcomeScreen: () => void
}

interface OnboardingCreateAccountEmailProps
  extends StackScreenProps<OnboardingCreateAccountNavigationStack, "OnboardingCreateAccountEmail"> {}

export const OnboardingCreateAccountEmail: React.FC<OnboardingCreateAccountEmailProps> = ({ route }) => {
  const { setActiveScreen } = OnboardingCreateAccountStore.useStoreActions((actions) => actions)

  const isFocused = useIsFocused()
  useEffect(() => {
    if (isFocused) {
      setActiveScreen("email")
    }
  }, [isFocused])

  return (
    <Flex flex={1} justifyContent="center" alignItems="center" backgroundColor="white">
      <BackButton onPress={route.params.navigateToWelcomeScreen} />
      <Text variant="title">OnboardingCreateAccountEmail</Text>
    </Flex>
  )
}
