import { Button, Flex, FlexProps, Text, useTheme } from "@artsy/palette-mobile"
import BottomSheet, { BottomSheetModal, BottomSheetModalProvider } from "@gorhom/bottom-sheet"
import { NavigationContainer, NavigationState } from "@react-navigation/native"
import { createStackNavigator } from "@react-navigation/stack"
import { EmailStep } from "app/Scenes/Onboarding/Auth2/EmailStep"
import { ForgotPasswordStep } from "app/Scenes/Onboarding/Auth2/ForgotPasswordStep"
import { LoginOTPStep } from "app/Scenes/Onboarding/Auth2/LoginOTPStep"
import { LoginPasswordStep } from "app/Scenes/Onboarding/Auth2/LoginPasswordStep"
import { SignUpNameStep } from "app/Scenes/Onboarding/Auth2/SignUpNameStep"
import { SignUpPasswordStep } from "app/Scenes/Onboarding/Auth2/SignUpPasswordStep"
import { WelcomeStep } from "app/Scenes/Onboarding/Auth2/WelcomeStep"
import { OnboardingContext } from "app/Scenes/Onboarding/OnboardingContext"
import { OnboardingHomeNavigationStack } from "app/Scenes/Onboarding/OnboardingHome"
import React, { useCallback, useEffect, useMemo, useRef } from "react"

export type OnboardingHomeNavigationStack = {
  EmailStep: undefined
  ForgotPasswordStep: { requestedPasswordReset: boolean } | undefined
  LoginPasswordStep: { email: string }
  LoginOTPStep: { otpMode: "standard" | "on_demand"; email: string; password: string }
  SignUpPasswordStep: { email: string }
  SignUpNameStep: { email: string; password: string }
  WelcomeStep: undefined
}

export const AuthenticationDialog: React.FC<FlexProps> = ({ ...flexProps }) => {
  const setCurrentStep = OnboardingContext.useStoreActions((actions) => actions.setCurrentStep)

  const { space } = useTheme()

  const handleStateChange = (state: NavigationState | undefined) => {
    const currentStep = state?.routes?.at(state.index)?.name

    if (currentStep) {
      setCurrentStep(currentStep as keyof OnboardingHomeNavigationStack)
    } else {
      setCurrentStep(null)
    }
  }

  // ref
  const bottomSheetModalRef = useRef<BottomSheetModal>(null)

  const snapPoints = useMemo(() => ["35%", "100%"], [])

  useEffect(() => {
    bottomSheetModalRef.current?.present()
  }, [])

  return (
    <Flex flex={1} {...flexProps}>
      <BottomSheetModalProvider>
        <BottomSheetModal
          ref={bottomSheetModalRef}
          snapPoints={snapPoints}
          enableContentPanningGesture={false}
          handleComponent={null}
          enablePanDownToClose={false}
          detached
        >
          <Flex borderRadius={space(2)} overflow="hidden" flex={1} ml={-1} mr={-1} mb={-6}>
            <NavigationContainer independent onStateChange={handleStateChange}>
              <Stack.Navigator
                screenOptions={{
                  headerShown: false,
                  gestureEnabled: false,
                  cardStyle: { backgroundColor: "white" },
                }}
                initialRouteName="WelcomeStep"
              >
                <Stack.Screen name="WelcomeStep" component={WelcomeStep} />
                <Stack.Screen
                  name="EmailStep"
                  component={EmailStep}
                  options={{ animationEnabled: false }}
                />
                <Stack.Screen name="SignUpPasswordStep" component={SignUpPasswordStep} />
                <Stack.Screen name="SignUpNameStep" component={SignUpNameStep} />
                <Stack.Screen name="LoginPasswordStep" component={LoginPasswordStep} />
                <Stack.Screen name="LoginOTPStep" component={LoginOTPStep} />
                <Stack.Screen name="ForgotPasswordStep" component={ForgotPasswordStep} />
              </Stack.Navigator>
            </NavigationContainer>
          </Flex>
        </BottomSheetModal>
      </BottomSheetModalProvider>
    </Flex>
  )
}

const Stack = createStackNavigator<OnboardingHomeNavigationStack>()
