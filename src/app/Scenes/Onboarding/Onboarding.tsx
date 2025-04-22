import { useColor, useSpace } from "@artsy/palette-mobile"
import { NavigationContainerRef } from "@react-navigation/native"
import {
  CardStyleInterpolators,
  createStackNavigator,
  TransitionPresets,
} from "@react-navigation/stack"
import { AuthApp } from "app/Scenes/Onboarding/Auth2/AuthApp"
import { OAuthProvider } from "app/store/AuthModel"
import { GlobalStore } from "app/store/GlobalStore"
import { DevMenu } from "app/system/devTools/DevMenu/DevMenu"
import { useFeatureFlag } from "app/utils/hooks/useFeatureFlag"
import { ForgotPassword } from "./ForgotPassword"
import {
  OnboardingCreateAccount,
  OnboardingCreateAccountWithEmail,
} from "./OnboardingCreateAccount/OnboardingCreateAccount"
import { OnboardingLogin, OnboardingLoginWithEmail } from "./OnboardingLogin"
import { OnboardingLoginWithOTP, OTPMode } from "./OnboardingLoginWithOTP"
import { AppleToken, GoogleOrFacebookToken, OnboardingSocialLink } from "./OnboardingSocialLink"
import { OnboardingWebView, OnboardingWebViewRoute } from "./OnboardingWebView"
import { OnboardingWelcome } from "./OnboardingWelcome"

export type OnboardingNavigationStack = {
  OnboardingHome: undefined
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

  DevMenu: undefined
}

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace ReactNavigation {
    // @ts-ignore
    type RootParamList = OnboardingNavigationStack
  }
}

const StackNavigator = createStackNavigator<OnboardingNavigationStack>()

export const __unsafe__onboardingNavigationRef: React.MutableRefObject<NavigationContainerRef<any> | null> =
  {
    current: null,
  }

export const OnboardingWelcomeScreens = () => {
  const userIsDev = GlobalStore.useAppState((s) => s.artsyPrefs.userIsDev.value)
  const color = useColor()
  const space = useSpace()

  const signupLoginFusionEnabled = useFeatureFlag("AREnableSignupLoginFusion")

  return (
    <StackNavigator.Navigator
      initialRouteName={signupLoginFusionEnabled ? "OnboardingHome" : "OnboardingWelcome"}
      screenOptions={{
        headerShown: false,
        headerMode: "screen",
      }}
    >
      {signupLoginFusionEnabled ? (
        <StackNavigator.Group screenOptions={{ ...TransitionPresets.SlideFromRightIOS }}>
          <StackNavigator.Screen name="OnboardingHome" component={AuthApp} />
          <StackNavigator.Screen name="OnboardingSocialLink" component={OnboardingSocialLink} />
          {/**
           * There are two "Forgot Password?" forms in this flow:
           * 1. The ForgotPasswordStep step in the OnboardingHome screen
           * 2. The ForgotPassword screen linked-to in the OnboardingSocialLink screen
           */}
          <StackNavigator.Screen name="ForgotPassword" component={ForgotPassword} />
          <StackNavigator.Screen name="OnboardingWebView" component={OnboardingWebView} />
        </StackNavigator.Group>
      ) : (
        <StackNavigator.Group screenOptions={{ ...TransitionPresets.SlideFromRightIOS }}>
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
        </StackNavigator.Group>
      )}

      <StackNavigator.Group>
        {!!userIsDev && (
          <StackNavigator.Screen
            name="DevMenu"
            component={DevMenu}
            options={{
              headerLeftContainerStyle: {
                paddingLeft: space(1),
              },
              headerTitle: "Dev Settings",
              headerShown: true,
              headerTintColor: color("mono100"),
              headerLeft: () => <></>,
              headerRightContainerStyle: {
                paddingRight: space(2),
              },
            }}
          />
        )}
      </StackNavigator.Group>
    </StackNavigator.Navigator>
  )
}
