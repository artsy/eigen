import { OnboardingWebViewRoute } from "app/Scenes/Onboarding/OnboardingWebView"
import { action, Action, createContextStore } from "easy-peasy"

export type AuthScreens = {
  EmailSocialStep: undefined
  ForgotPasswordStep: { requestedPasswordReset: boolean } | undefined
  LoginPasswordStep: { email: string }
  LoginOTPStep: { otpMode: "standard" | "on_demand"; email: string; password: string }
  OnboardingWebView: { url: OnboardingWebViewRoute }
  SignUpPasswordStep: { email: string }
  SignUpNameStep: { email: string; password: string }
}

export interface AuthScreen {
  name: keyof AuthScreens
  params?: Record<string, any>
}

interface AuthContextModel {
  currentScreen: AuthScreen | undefined
  previousScreens: Array<AuthScreen | undefined>
  isMounted: boolean
  isModalExpanded: boolean
  goBack: Action<AuthContextModel>
  setCurrentScreen: Action<AuthContextModel, AuthScreen>
  setModalExpanded: Action<AuthContextModel, boolean>
}

export const AuthContext = createContextStore<AuthContextModel>({
  isMounted: false,
  currentScreen: { name: "EmailSocialStep" },
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

  goBack: action((state) => {
    state.currentScreen = state.previousScreens.pop()
  }),
})
