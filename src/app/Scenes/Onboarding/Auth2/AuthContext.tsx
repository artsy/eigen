import { OnboardingWebViewRoute } from "app/Scenes/Onboarding/OnboardingWebView"
import { action, Action, createContextStore, Thunk, thunk } from "easy-peasy"

export type AuthScreens = {
  WelcomeStep: undefined
  LoginEmailStep: undefined
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
  goBack: Thunk<AuthContextModel>
  isGoingBack: boolean
  isModalExpanded: boolean
  isMounted: boolean
  popScreen: Action<AuthContextModel>
  previousScreens: Array<AuthScreen | undefined>
  setCurrentScreen: Action<AuthContextModel, AuthScreen>
  setIsGoingBack: Action<AuthContextModel, boolean>
  setModalExpanded: Action<AuthContextModel, boolean>
}

export const AuthContext = createContextStore<AuthContextModel>({
  isMounted: false,
  isGoingBack: false,
  currentScreen: { name: "WelcomeStep" },
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

  setIsGoingBack: action((state, isGoingBack) => {
    state.isGoingBack = isGoingBack
  }),

  popScreen: action((state) => {
    state.currentScreen = state.previousScreens.pop()
  }),

  goBack: thunk(async (actions) => {
    actions.setIsGoingBack(true)

    actions.popScreen()
    setTimeout(() => {}, 0)

    setTimeout(() => {
      actions.setIsGoingBack(false)
    }, 100)
  }),
})
