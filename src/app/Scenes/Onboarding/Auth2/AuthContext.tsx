import { action, Action, createContextStore } from "easy-peasy"

export type AuthScreens = {
  LoginWelcomeStep: undefined
  LoginPasswordStep: undefined
  LoginOTPStep: undefined
  ForgotPasswordStep: undefined
  SignUpPasswordStep: undefined
  SignUpNameStep: undefined
  OnboardingWebView: undefined
}

export interface AuthScreen {
  name: keyof AuthScreens
  params?: Record<string, any>
}

interface AuthContextModel {
  currentScreen: AuthScreen | undefined
  goBack: Action<AuthContextModel>
  isModalExpanded: boolean
  isMounted: boolean
  previousScreens: Array<AuthScreen | undefined>
  setCurrentScreen: Action<AuthContextModel, AuthScreen>
  setModalExpanded: Action<AuthContextModel, boolean>
  setParams: Action<AuthContextModel, Record<string, any>>
}

export const AuthContext = createContextStore<AuthContextModel>({
  currentScreen: { name: "LoginWelcomeStep" },
  goBack: action((state) => {
    state.currentScreen = state.previousScreens.pop()
  }),
  isModalExpanded: false,
  isMounted: false,
  previousScreens: [],
  setCurrentScreen: action((state, currentScreen) => {
    state.previousScreens.push(state.currentScreen)
    state.currentScreen = currentScreen
  }),
  setModalExpanded: action((state, isModalExpanded) => {
    state.isMounted = true
    state.isModalExpanded = isModalExpanded
  }),
  setParams: action((state, params) => {
    if (state.currentScreen && params) {
      state.currentScreen.params = { ...(state.currentScreen.params ?? {}), ...params }
    }
  }),
})
