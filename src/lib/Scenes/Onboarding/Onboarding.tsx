import { useFeatureFlag } from "lib/store/GlobalStore"
import { Flex, Text } from "palette"
import React from "react"
import { LogIn } from "./OldLogIn/LogIn"

export const Onboarding = () => {
  const useNewOnboarding = useFeatureFlag("ARUseNewOnboarding")

  if (!useNewOnboarding) {
    return <LogIn />
  }

  return (
    <Flex flex={1} justifyContent="center" alignItems="center" data-test-id="new-flow">
      <Text variant="largeTitle">Onboarding</Text>
    </Flex>
  )
}
