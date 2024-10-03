import { action, Action, createContextStore } from "easy-peasy"

interface AuthContextModel {
  isModalExpanded: boolean
  setModalExpanded: Action<AuthContextModel, boolean>
}

export const AuthContext = createContextStore<AuthContextModel>({
  isModalExpanded: false,
  setModalExpanded: action((state, isModalExpanded) => {
    state.isModalExpanded = isModalExpanded
  }),
})
