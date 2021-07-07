import { NavigationContainer } from "@react-navigation/native"
import { CardStyleInterpolators, createStackNavigator, TransitionPresets } from "@react-navigation/stack"
import { ArtsyKeyboardAvoidingView, ArtsyKeyboardAvoidingViewContext } from "lib/Components/ArtsyKeyboardAvoidingView"
import { GlobalStore } from "lib/store/GlobalStore"
import React from "react"
import { View } from "react-native"
import { ForgotPassword } from "./ForgotPassword"
import { OnboardingCreateAccount } from "./OnboardingCreateAccount/OnboardingCreateAccount"
import { OnboardingLogin } from "./OnboardingLogin"
import { OnboardingPersonalization } from "./OnboardingPersonalization/OnboardingPersonalization"
import { OnboardingWelcome } from "./OnboardingWelcome"

// tslint:disable-next-line:interface-over-type-literal
export type OnboardingNavigationStack = {
  OnboardingWelcome: undefined
  OnboardingLogin: { withFadeAnimation: boolean; email: string } | undefined
  OnboardingCreateAccount: undefined
  ForgotPassword: undefined
}

const StackNavigator = createStackNavigator<OnboardingNavigationStack>()

export const OnboardingWelcomeScreens = () => (
  <NavigationContainer independent>
    <StackNavigator.Navigator
      headerMode="screen"
      screenOptions={{
        ...TransitionPresets.SlideFromRightIOS,
        headerShown: false,
      }}
    >
      <StackNavigator.Screen name="OnboardingWelcome" component={OnboardingWelcome} />
      <StackNavigator.Screen
        name="OnboardingLogin"
        component={OnboardingLogin}
        options={({ route: { params } }) => ({
          cardStyleInterpolator: params?.withFadeAnimation
            ? CardStyleInterpolators.forFadeFromBottomAndroid
            : CardStyleInterpolators.forHorizontalIOS,
        })}
      />
      <StackNavigator.Screen name="OnboardingCreateAccount" component={OnboardingCreateAccount} />
      <StackNavigator.Screen name="ForgotPassword" component={ForgotPassword} options={{ headerShown: false }} />
    </StackNavigator.Navigator>
  </NavigationContainer>
)
export const Onboarding = () => {
  const onboardingState = GlobalStore.useAppState((state) => state.auth.onboardingState)

  return (
    <View style={{ flex: 1 }}>
      <ArtsyKeyboardAvoidingViewContext.Provider
        value={{ isVisible: true, isPresentedModally: false, bottomOffset: 0 }}
      >
        <ArtsyKeyboardAvoidingView>
          {onboardingState === "incomplete" ? <OnboardingPersonalization /> : <OnboardingWelcomeScreens />}
        </ArtsyKeyboardAvoidingView>
      </ArtsyKeyboardAvoidingViewContext.Provider>
    </View>
  )
}
