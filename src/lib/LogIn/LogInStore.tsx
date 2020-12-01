import { Action, action, createContextStore } from "easy-peasy"

interface LogInModel {
  email: string
  password: string
  setEmail: Action<LogInModel, { email: string }>
  setPassword: Action<LogInModel, { password: string }>
}

export const LogInStore = createContextStore<LogInModel>({
  email: "david.sheldrick@artsymail.com",
  password: "",
  setEmail: action((state, { email }) => {
    state.email = email
  }),
  setPassword: action((state, { password }) => {
    state.password = password
  }),
})
