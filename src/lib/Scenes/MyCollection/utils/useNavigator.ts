import { AppStore } from "lib/store/AppStore"
import { useEffect } from "react"
import NavigatorIOS from "react-native-navigator-ios"

export function useNavigator(newNavigator: NavigatorIOS) {
  const navActions = AppStore.actions.myCollection.navigation

  useEffect(() => {
    navActions.setNavigator(newNavigator)
  }, [])

  return newNavigator
}
