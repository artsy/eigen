import { Action, action, createContextStore } from "easy-peasy"
import { __unsafe__createAccountNavigationRef } from "./OnboardingCreateAccount"

type ActiveScreen = "email" | "password" | "name"
interface OnboardingCreateAccountModel {
  email: string
  password: string
  name: string
  activeScreen: ActiveScreen
  setEmail: Action<OnboardingCreateAccountModel, string>
  setPassword: Action<OnboardingCreateAccountModel, string>
  setName: Action<OnboardingCreateAccountModel, string>
  setActiveScreen: Action<OnboardingCreateAccountModel, ActiveScreen>
  handleSubmit: Action<OnboardingCreateAccountModel>
}

export const OnboardingCreateAccountStore = createContextStore<OnboardingCreateAccountModel>({
  email: "",
  password: "",
  name: "",
  activeScreen: "email",
  setEmail: action((state, email) => {
    state.email = email
  }),
  setPassword: action((state, password) => {
    state.password = password
  }),
  setName: action((state, name) => {
    state.name = name
  }),
  setActiveScreen: action((state, activeScreen) => {
    state.activeScreen = activeScreen
  }),
  handleSubmit: action((state) => {
    if (state.activeScreen === "email") {
      __unsafe__createAccountNavigationRef.current?.navigate("OnboardingCreateAccountPassword")
      return
    }
    if (state.activeScreen === "password") {
      __unsafe__createAccountNavigationRef.current?.navigate("OnboardingCreateAccountName")
      return
    }
  }),
})
