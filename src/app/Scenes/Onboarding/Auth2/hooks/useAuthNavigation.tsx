import { AuthContext, AuthScreen } from "app/Scenes/Onboarding/Auth2/AuthContext"

export const useAuthNavigation = () => {
  const actions = AuthContext.useStoreActions((actions) => actions)

  return {
    goBack: () => {
      actions.goBack()
    },
    navigate: (screen: AuthScreen) => {
      actions.setCurrentScreen(screen)
    },
    setParams: (params: Record<string, any>) => {
      actions.setParams(params)
    },
  }
}

export const useAuthScreen = () => {
  const currentScreen = AuthContext.useStoreState((state) => state.currentScreen) as AuthScreen
  return currentScreen
}
