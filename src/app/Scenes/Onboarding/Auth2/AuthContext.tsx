import { action, Action, createContextStore } from "easy-peasy"

interface AuthContextModel {
  isMounted: boolean
  isModalExpanded: boolean
  setModalExpanded: Action<AuthContextModel, boolean>
}

export const AuthContext = createContextStore<AuthContextModel>({
  isMounted: false,
  isModalExpanded: false,
  setModalExpanded: action((state, isModalExpanded) => {
    state.isMounted = true
    state.isModalExpanded = isModalExpanded
  }),
})
