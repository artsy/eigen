import { Action, action, createContextStore } from "easy-peasy"

interface OnboardingCreateAccountModel {
  email: string
  password: string
  name: string
  setEmail: Action<OnboardingCreateAccountModel, { email: string }>
  setPassword: Action<OnboardingCreateAccountModel, { password: string }>
  setName: Action<OnboardingCreateAccountModel, { name: string }>
}

export const OnboardingCreateAccountStore = createContextStore<OnboardingCreateAccountModel>({
  email: "",
  password: "",
  name: "",
  setEmail: action((state, { email }) => {
    state.email = email
  }),
  setPassword: action((state, { password }) => {
    state.password = password
  }),
  setName: action((state, { name }) => {
    state.name = name
  }),
})
