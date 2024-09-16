import { Flex, useTheme } from "@artsy/palette-mobile"
import BottomSheet, { BottomSheetScrollView } from "@gorhom/bottom-sheet"
import { EmailStep } from "app/Scenes/Onboarding/Components/EmailStep"
import { LoginPasswordStep } from "app/Scenes/Onboarding/Components/LoginPasswordStep"
import { WelcomeStep } from "app/Scenes/Onboarding/Components/WelcomeStep"
import { OnboardingStore } from "app/Scenes/Onboarding/OnboardingStore"
import React from "react"
import { View } from "react-native"

export const AuthenticationDialog: React.FC = () => {
  const currentStep = OnboardingStore.useStoreState((state) => state.currentStep)

  const { space } = useTheme()

  return (
    <View style={{ flex: 1 }}>
      <BottomSheet
        snapPoints={["100%"]}
        detached
        enableContentPanningGesture={false}
        handleComponent={null}
      >
        <BottomSheetScrollView>
          <Flex padding={2} gap={space(1)}>
            {currentStep === "WelcomeStep" && <WelcomeStep />}
            {currentStep === "EmailStep" && <EmailStep />}
            {currentStep === "LoginPasswordStep" && <LoginPasswordStep />}
          </Flex>
        </BottomSheetScrollView>
      </BottomSheet>
    </View>
  )
}
