import { AuthNavigationStack } from "app/Scenes/Onboarding/Auth2/AuthScenes"
import { action, Action, createContextStore } from "easy-peasy"

interface AuthContextModel {
  currentScreen: keyof AuthNavigationStack | undefined
  previousScreens: Array<keyof AuthNavigationStack | undefined>
  isMounted: boolean
  isModalExpanded: boolean
  goBack: Action<AuthContextModel>
  setModalExpanded: Action<AuthContextModel, boolean>
  setCurrentScreen: Action<AuthContextModel, keyof AuthNavigationStack>
}

export const AuthContext = createContextStore<AuthContextModel>({
  isMounted: false,
  currentScreen: "EmailSocialStep",
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
