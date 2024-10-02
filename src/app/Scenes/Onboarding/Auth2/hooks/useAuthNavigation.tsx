import { NavigationProp, useNavigation } from "@react-navigation/native"
import { AuthNavigationStack } from "app/Scenes/Onboarding/Auth2/AuthScenes"

export const useAuthNavigation = () => {
  const navigation = useNavigation<NavigationProp<AuthNavigationStack>>()
  return navigation
}
