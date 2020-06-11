import { Action, action } from "easy-peasy"

export interface NavigationState {
  hello: string
  setHello: Action<NavigationState, string>
}

export const navigationState: NavigationState = {
  hello: "world",
  setHello: action((state, payload) => {
    state.hello = payload
  }),
}
