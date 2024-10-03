import { AuthContext, AuthScreen } from "app/Scenes/Onboarding/Auth2/AuthContext"

export const useAuthNavigation = () => {
  // const navigation = useNavigation<NavigationProp<AuthNavigationStack>>()
  // return navigation
  const actions = AuthContext.useStoreActions((actions) => actions)

  return {
    navigate: (screen: AuthScreen) => {
      actions.setCurrentScreen(screen)
    },
    goBack: () => {
      actions.goBack()
    },
  }
}

export const useAuthScreen = () => {
  const currentScreen = AuthContext.useStoreState((state) => state.currentScreen) as AuthScreen
  return currentScreen
}
