import { NavigationContainer } from "@react-navigation/native"
import { createStackNavigator, TransitionPresets } from "@react-navigation/stack"
import { ArtsyKeyboardAvoidingView } from "lib/Components/ArtsyKeyboardAvoidingView"
import { useFeatureFlag } from "lib/store/GlobalStore"
import { useScreenDimensions } from "lib/utils/useScreenDimensions"
import React from "react"
import { View } from "react-native"
import { ForgotPassword } from "./ForgotPassword"
import { LogIn } from "./OldLogIn/LogIn"
import { OnboardingCreateAccount } from "./OnboardingCreateAccount"
import { OnboardingLogin } from "./OnboardingLogin"
import { OnboardingWelcome } from "./OnboardingWelcome"

// tslint:disable-next-line:interface-over-type-literal
export type OnboardingNavigationStack = {
  OnboardingWelcome: undefined
  OnboardingLogin: undefined
  OnboardingCreateAccount: undefined
  ForgotPassword: undefined
}

const StackNavigator = createStackNavigator<OnboardingNavigationStack>()

export const Onboarding = () => {
  const useNewOnboarding = useFeatureFlag("ARUseNewOnboarding")

  if (!useNewOnboarding) {
    return <LogIn />
  }

  return (
    <View style={{ flex: 1, paddingBottom: useScreenDimensions().safeAreaInsets.bottom }}>
      <NavigationContainer independent>
        <ArtsyKeyboardAvoidingView>
          <StackNavigator.Navigator
            headerMode="screen"
            screenOptions={{
              ...TransitionPresets.SlideFromRightIOS,
            }}
          >
            <StackNavigator.Screen
              name="OnboardingWelcome"
              options={{ headerShown: false }}
              component={OnboardingWelcome}
            />
            <StackNavigator.Screen
              name="OnboardingLogin"
              component={OnboardingLogin}
              options={{ headerShown: false }}
            />
            <StackNavigator.Screen name="OnboardingCreateAccount" component={OnboardingCreateAccount} />
            <StackNavigator.Screen name="ForgotPassword" component={ForgotPassword} options={{ headerShown: false }} />
          </StackNavigator.Navigator>
        </ArtsyKeyboardAvoidingView>
      </NavigationContainer>
    </View>
  )
}
