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

export interface AuthContextModel {
  // state
  currentScreen: AuthScreen | undefined
  isModalExpanded: boolean
  isMounted: boolean
  previousScreens: Array<AuthScreen | undefined>

  // actions
  goBack: Action<AuthContextModel>
  setCurrentScreen: Action<AuthContextModel, AuthScreen>
  setModalExpanded: Action<AuthContextModel, boolean>
  setParams: Action<AuthContextModel, Record<string, any>>
}

export const defaultState: AuthContextModel = {
  // state
  currentScreen: { name: "LoginWelcomeStep" },
  isModalExpanded: false,
  isMounted: false,
  previousScreens: [],

  // actions
  goBack: action((state) => {
    if (state.previousScreens.length !== 0) {
      state.currentScreen = state.previousScreens.pop()
    }
  }),
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
}

export const AuthContext = createContextStore<AuthContextModel>((initialState) => ({
  ...defaultState,
  ...initialState,
}))
