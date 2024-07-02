import { NavigationProp, useNavigation } from "@react-navigation/native"
import { enableNewNavigation } from "app/App"
import { NavigationRoutes } from "app/Navigation"
import { matchRoute } from "app/routes"
import { navigate as oldNavigate } from "app/system/navigation/navigate"
import { useCallback } from "react"

export const useConditionalNavigate = () => {
  const navigation = useNavigation<NavigationProp<NavigationRoutes>>()

  const navigateCallback = useCallback(
    (routeName: string, params?: object) => {
      if (enableNewNavigation) {
        // TODO: This works but is probably not what we want long term
        // There are more standard ways in react-navigation to maintain mapping between route names and modules
        const result = matchRoute(routeName)
        if (result.type === "match") {
          console.warn("Navigating to new route", result.module, result.params)
          // TODO: Danger beach! This means any screen in our old nav that is not in new nav will break, make it type safe before shipping
          navigation.navigate(result.module as any, result.params)
        }
      } else {
        oldNavigate(routeName, params)
      }
    },
    [navigation]
  )

  return navigateCallback
}
