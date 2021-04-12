import { useIsFocused } from "@react-navigation/native"
import { StackScreenProps } from "@react-navigation/stack"
import { BackButton } from "lib/navigation/BackButton"
import { Flex, Text } from "palette"
import React, { useEffect } from "react"
import { OnboardingCreateAccountNavigationStack } from "./OnboardingCreateAccount"
import { OnboardingCreateAccountStore } from "./OnboardingCreateAccountStore"

export interface OnboardingCreateAccountNameProps
  extends StackScreenProps<OnboardingCreateAccountNavigationStack, "OnboardingCreateAccountName"> {}

export const OnboardingCreateAccountName: React.FC<OnboardingCreateAccountNameProps> = ({ navigation }) => {
  const { setActiveScreen } = OnboardingCreateAccountStore.useStoreActions((actions) => actions)

  const isFocused = useIsFocused()
  useEffect(() => {
    if (isFocused) {
      setActiveScreen("name")
    }
  }, [isFocused])

  return (
    <Flex flex={1} justifyContent="center" alignItems="center" backgroundColor="white">
      <BackButton
        onPress={() => {
          navigation.goBack()
        }}
      />
      <Text variant="title">OnboardingCreateAccountName</Text>
    </Flex>
  )
}
