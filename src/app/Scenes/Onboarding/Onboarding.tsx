import { NavigationContainer } from "@react-navigation/native"
import {
  CardStyleInterpolators,
  createStackNavigator,
  TransitionPresets,
} from "@react-navigation/stack"
import { FPSCounter } from "app/Components/FPSCounter"
import { OAuthProvider } from "app/store/AuthModel"
import { GlobalStore, useDevToggle } from "app/store/GlobalStore"
import { NetworkAwareProvider } from "app/utils/NetworkAwareProvider"
import { Platform, View } from "react-native"
import { ArtsyKeyboardAvoidingViewContext } from "shared/utils"
import { ForgotPassword } from "./ForgotPassword"
import {
  OnboardingCreateAccount,
  OnboardingCreateAccountWithEmail,
} from "./OnboardingCreateAccount/OnboardingCreateAccount"
import { OnboardingLogin, OnboardingLoginWithEmail } from "./OnboardingLogin"
import { OnboardingLoginWithOTP, OTPMode } from "./OnboardingLoginWithOTP"
import { OnboardingQuiz } from "./OnboardingQuiz/OnboardingQuiz"
import { AppleToken, GoogleOrFacebookToken, OnboardingSocialLink } from "./OnboardingSocialLink"
import { OnboardingWebView, OnboardingWebViewRoute } from "./OnboardingWebView"
import { OnboardingWelcome } from "./OnboardingWelcome"

export type OnboardingNavigationStack = {
  OnboardingWelcome: undefined
  OnboardingLogin: { withFadeAnimation: boolean } | undefined
  OnboardingLoginWithEmail: { withFadeAnimation: boolean; email: string } | undefined
  OnboardingLoginWithOTP: {
    email: string
    password: string
    otpMode: OTPMode
    onSignIn?: () => void
  }
  OnboardingCreateAccount: { withFadeAnimation: boolean } | undefined
  OnboardingCreateAccountWithEmail: undefined
  OnboardingSocialLink: {
    email: string
    name: string
    providers: OAuthProvider[]
    providerToBeLinked: OAuthProvider
    tokenForProviderToBeLinked: GoogleOrFacebookToken | AppleToken
  }
  ForgotPassword: undefined
  OnboardingWebView: { url: OnboardingWebViewRoute }
}

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace ReactNavigation {
    // @ts-ignore
    type RootParamList = OnboardingNavigationStack
  }
}

const StackNavigator = createStackNavigator<OnboardingNavigationStack>()

export const OnboardingWelcomeScreens = () => {
  return (
    <NavigationContainer independent>
      <StackNavigator.Navigator
        initialRouteName="OnboardingWelcome"
        screenOptions={{
          ...TransitionPresets.SlideFromRightIOS,
          headerShown: false,
          headerMode: "screen",
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
        <StackNavigator.Screen
          name="OnboardingLoginWithEmail"
          component={OnboardingLoginWithEmail}
          options={({ route: { params } }) => ({
            cardStyleInterpolator: params?.withFadeAnimation
              ? CardStyleInterpolators.forFadeFromBottomAndroid
              : CardStyleInterpolators.forHorizontalIOS,
          })}
        />
        <StackNavigator.Screen name="OnboardingLoginWithOTP" component={OnboardingLoginWithOTP} />
        <StackNavigator.Screen
          name="OnboardingCreateAccount"
          component={OnboardingCreateAccount}
          options={({ route: { params } }) => ({
            cardStyleInterpolator: params?.withFadeAnimation
              ? CardStyleInterpolators.forFadeFromBottomAndroid
              : CardStyleInterpolators.forHorizontalIOS,
          })}
        />
        <StackNavigator.Screen
          name="OnboardingCreateAccountWithEmail"
          component={OnboardingCreateAccountWithEmail}
        />
        <StackNavigator.Screen name="OnboardingSocialLink" component={OnboardingSocialLink} />
        <StackNavigator.Screen name="ForgotPassword" component={ForgotPassword} />
        <StackNavigator.Screen name="OnboardingWebView" component={OnboardingWebView} />
      </StackNavigator.Navigator>
    </NavigationContainer>
  )
}
export const Onboarding = () => {
  const onboardingState = GlobalStore.useAppState((state) => state.auth.onboardingState)
  const fpsCounter = useDevToggle("DTFPSCounter")

  return (
    <View style={{ flex: 1 }}>
      <ArtsyKeyboardAvoidingViewContext.Provider
        value={{ isVisible: true, isPresentedModally: false, bottomOffset: 0 }}
      >
        {onboardingState === "incomplete" ? <OnboardingQuiz /> : <OnboardingWelcomeScreens />}
        <NetworkAwareProvider />
      </ArtsyKeyboardAvoidingViewContext.Provider>
      {!!fpsCounter && <FPSCounter style={{ bottom: Platform.OS === "ios" ? 40 : undefined }} />}
    </View>
  )
}
