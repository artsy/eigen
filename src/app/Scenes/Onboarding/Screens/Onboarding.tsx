import { useColor } from "@artsy/palette-mobile"
import { NavigationContainerRef } from "@react-navigation/native"
import { createNativeStackNavigator } from "@react-navigation/native-stack"
import { AuthApp } from "app/Scenes/Onboarding/Screens/Auth/AuthApp"
import { OAuthProvider } from "app/store/AuthModel"
import { GlobalStore } from "app/store/GlobalStore"
import { DevMenu } from "app/system/devTools/DevMenu/DevMenu"
import { isTablet } from "react-native-device-info"
import { ForgotPassword } from "./ForgotPassword"
import { AppleToken, GoogleOrFacebookToken, OnboardingSocialLink } from "./OnboardingSocialLink"
import { OnboardingWebView, OnboardingWebViewRoute } from "./OnboardingWebView"

export type OTPMode = "on_demand" | "standard"

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

const StackNavigator = createNativeStackNavigator<OnboardingNavigationStack>()

export const __unsafe__onboardingNavigationRef: React.MutableRefObject<NavigationContainerRef<any> | null> =
  {
    current: null,
  }

export const OnboardingWelcomeScreens = () => {
  const userIsDev = GlobalStore.useAppState((s) => s.artsyPrefs.userIsDev.value)
  const color = useColor()

  return (
    <StackNavigator.Navigator
      initialRouteName="OnboardingHome"
      screenOptions={{
        headerShown: false,
      }}
    >
      <StackNavigator.Group
        screenOptions={{
          animation: "slide_from_right",
          orientation: !isTablet() ? "portrait" : "default",
        }}
      >
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

      <StackNavigator.Group
        screenOptions={{
          orientation: !isTablet() ? "portrait" : "default",
        }}
      >
        {!!userIsDev && (
          <StackNavigator.Screen
            name="DevMenu"
            component={DevMenu}
            options={{
              headerTitle: "Dev Settings",
              headerShown: true,
              headerTintColor: color("mono100"),
              headerLeft: () => <></>,
            }}
          />
        )}
      </StackNavigator.Group>
    </StackNavigator.Navigator>
  )
}
