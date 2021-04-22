import { NavigationContainer } from "@react-navigation/native"
import { CardStyleInterpolators, createStackNavigator, TransitionPresets } from "@react-navigation/stack"
import { ArtsyKeyboardAvoidingView, ArtsyKeyboardAvoidingViewContext } from "lib/Components/ArtsyKeyboardAvoidingView"
import { useFeatureFlag } from "lib/store/GlobalStore"
import { useScreenDimensions } from "lib/utils/useScreenDimensions"
import React from "react"
import { View } from "react-native"
import { ForgotPassword } from "./ForgotPassword"
import { LogIn } from "./OldLogIn/LogIn"
import { OnboardingCreateAccount } from "./OnboardingCreateAccount/OnboardingCreateAccount"
import { OnboardingLogin } from "./OnboardingLogin"
import { OnboardingWelcome } from "./OnboardingWelcome"

// tslint:disable-next-line:interface-over-type-literal
export type OnboardingNavigationStack = {
  OnboardingWelcome: undefined
  OnboardingLogin: { withFadeAnimation: boolean; email: string } | undefined
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
        <ArtsyKeyboardAvoidingViewContext.Provider
          value={{ isVisible: true, isPresentedModally: false, bottomOffset: 0 }}
        >
          <ArtsyKeyboardAvoidingView>
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
              <StackNavigator.Screen
                name="ForgotPassword"
                component={ForgotPassword}
                options={{ headerShown: false }}
              />
            </StackNavigator.Navigator>
          </ArtsyKeyboardAvoidingView>
        </ArtsyKeyboardAvoidingViewContext.Provider>
      </NavigationContainer>
    </View>
  )
}
