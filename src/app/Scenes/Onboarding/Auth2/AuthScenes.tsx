import { NavigationContainer } from "@react-navigation/native"
import { createStackNavigator, TransitionPresets } from "@react-navigation/stack"
// import { OnboardingHomeNavigationStack } from "app/Scenes/Onboarding/Auth2/AuthenticationDialog"
import { EmailSocialStep } from "app/Scenes/Onboarding/Auth2/scenes/EmailSocialStep"
import { ForgotPasswordStep } from "app/Scenes/Onboarding/Auth2/scenes/ForgotPasswordStep"
import { LoginOTPStep } from "app/Scenes/Onboarding/Auth2/scenes/LoginOTPStep"
import { LoginPasswordStep } from "app/Scenes/Onboarding/Auth2/scenes/LoginPasswordStep"
import { SignUpNameStep } from "app/Scenes/Onboarding/Auth2/scenes/SignUpNameStep"
import { SignUpPasswordStep } from "app/Scenes/Onboarding/Auth2/scenes/SignUpPasswordStep"
import { OnboardingWebViewRoute } from "app/Scenes/Onboarding/OnboardingWebView"
import React from "react"

export type AuthNavigationStack = {
  EmailSocialStep: undefined
  ForgotPasswordStep: { requestedPasswordReset: boolean } | undefined
  LoginPasswordStep: { email: string }
  LoginOTPStep: { otpMode: "standard" | "on_demand"; email: string; password: string }
  OnboardingWebView: { url: OnboardingWebViewRoute }
  SignUpPasswordStep: { email: string }
  SignUpNameStep: { email: string; password: string }
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

          ...TransitionPresets.ModalFadeTransition,
        }}
        initialRouteName="EmailSocialStep"
      >
        <Stack.Screen
          name="EmailSocialStep"
          component={EmailSocialStep}
          options={{ animationTypeForReplace: "pop" }}
        />
        <Stack.Screen name="SignUpPasswordStep" component={SignUpPasswordStep} />
        <Stack.Screen name="SignUpNameStep" component={SignUpNameStep} />
        <Stack.Screen name="LoginPasswordStep" component={LoginPasswordStep} />
        <Stack.Screen name="LoginOTPStep" component={LoginOTPStep} />
        <Stack.Screen name="ForgotPasswordStep" component={ForgotPasswordStep} />
      </Stack.Navigator>
    </NavigationContainer>
  )
}
