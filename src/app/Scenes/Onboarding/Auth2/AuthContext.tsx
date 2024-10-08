import { OnboardingWebViewRoute } from "app/Scenes/Onboarding/OnboardingWebView"
import { action, Action, createContextStore } from "easy-peasy"

export type AuthScreens = {
  LoginWelcomeStep: undefined
  LoginPasswordStep: { email: string }
  LoginOTPStep: { otpMode: "standard" | "on_demand"; email: string; password: string }
  ForgotPasswordStep: { requestedPasswordReset: boolean } | undefined
  SignUpPasswordStep: { email: string }
  SignUpNameStep: { email: string; password: string }
  OnboardingWebView: { url: OnboardingWebViewRoute }
}

export interface AuthScreen {
  name: keyof AuthScreens
  params?: Record<string, any>
}

interface AuthContextModel {
  currentScreen: AuthScreen | undefined
  goBack: Action<AuthContextModel, AuthScreen["params"]>
  isModalExpanded: boolean
  isMounted: boolean
  previousScreens: Array<AuthScreen | undefined>
  setCurrentScreen: Action<AuthContextModel, AuthScreen>
  setModalExpanded: Action<AuthContextModel, boolean>
}

export const AuthContext = createContextStore<AuthContextModel>({
  isMounted: false,
  currentScreen: { name: "LoginWelcomeStep" },
  previousScreens: [],
  isModalExpanded: false,

  setCurrentScreen: action((state, currentScreen) => {
    state.previousScreens.push(state.currentScreen)
    state.currentScreen = currentScreen
  }),

  setModalExpanded: action((state, isModalExpanded) => {
    state.isMounted = true
    state.isModalExpanded = isModalExpanded
  }),

  goBack: action((state, params) => {
    const currentScreen = state.previousScreens.pop()

    if (currentScreen && params) {
      currentScreen.params = params
    }

    state.currentScreen = currentScreen
  }),
})
