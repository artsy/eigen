import { NavigationProp, RouteProp, useNavigation, useRoute } from "@react-navigation/native"
import { AuthContext } from "app/Scenes/Onboarding/Auth2/AuthContext"
import { AuthNavigationStack } from "app/Scenes/Onboarding/Auth2/AuthScenes"

export const useAuthNavigation = () => {
  // const navigation = useNavigation<NavigationProp<AuthNavigationStack>>()
  // return navigation
  const actions = AuthContext.useStoreActions((actions) => actions)

  return {
    navigate: (screen: keyof AuthNavigationStack) => {
      actions.setCurrentScreen(screen)
    },
    goBack: () => {
      actions.goBack()
    },
  }
}

export const useAuthRoute = <T extends keyof AuthNavigationStack>() => {
  const route = useRoute<RouteProp<AuthNavigationStack, T>>()
  return route
}
