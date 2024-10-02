import { NavigationContainer } from "@react-navigation/native"
import { createStackNavigator } from "@react-navigation/stack"
// import { OnboardingHomeNavigationStack } from "app/Scenes/Onboarding/Auth2/AuthenticationDialog"
import { ForgotPasswordStep } from "app/Scenes/Onboarding/Auth2/steps/ForgotPasswordStep"
import { LoginOTPStep } from "app/Scenes/Onboarding/Auth2/steps/LoginOTPStep"
import { LoginPasswordStep } from "app/Scenes/Onboarding/Auth2/steps/LoginPasswordStep"
import { SignUpNameStep } from "app/Scenes/Onboarding/Auth2/steps/SignUpNameStep"
import { SignUpPasswordStep } from "app/Scenes/Onboarding/Auth2/steps/SignUpPasswordStep"
import { WelcomeStep } from "app/Scenes/Onboarding/Auth2/steps/WelcomeStep"
import React from "react"

export type AuthNavigationStack = {
  EmailStep: undefined
  ForgotPasswordStep: { requestedPasswordReset: boolean } | undefined
  LoginPasswordStep: { email: string }
  LoginOTPStep: { otpMode: "standard" | "on_demand"; email: string; password: string }
  SignUpPasswordStep: { email: string }
  SignUpNameStep: { email: string; password: string }
  WelcomeStep: undefined
}

const Stack = createStackNavigator<AuthNavigationStack>()

export const AuthScenes: React.FC = () => {
  return (
    <NavigationContainer independent>
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
          gestureEnabled: false,
          cardStyle: { backgroundColor: "white" },
        }}
        initialRouteName="WelcomeStep"
      >
        <Stack.Screen name="WelcomeStep" component={WelcomeStep} />
        <Stack.Screen name="SignUpPasswordStep" component={SignUpPasswordStep} />
        <Stack.Screen name="SignUpNameStep" component={SignUpNameStep} />
        <Stack.Screen name="LoginPasswordStep" component={LoginPasswordStep} />
        <Stack.Screen name="LoginOTPStep" component={LoginOTPStep} />
        <Stack.Screen name="ForgotPasswordStep" component={ForgotPasswordStep} />
      </Stack.Navigator>
    </NavigationContainer>
  )
}
