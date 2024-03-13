import { NavigationProp, useNavigation } from "@react-navigation/native"
import { NavigationRoutes } from "app/Navigation"
import { matchRoute } from "app/routes"
import { navigate as oldNavigate } from "app/system/navigation/navigate"
import { useCallback } from "react"

export const useConditionalNavigate = () => {
  const navigation = useNavigation<NavigationProp<NavigationRoutes>>()

  const navigateCallback = useCallback(
    (routeName: string, params?: object) => {
      const isFeatureEnabled = true // TODO: Set up a real feature flag
      if (isFeatureEnabled) {
        // Use React Navigation's navigate method for the new navigation system
        const result = matchRoute(routeName)
        if (result.type === "match") {
          // TODO: Danger beach!

          console.warn("navigate result", result)
          navigation.navigate(result.module as any, result.params)
        }
      } else {
        // Use the legacy navigation system's navigate function
        // Adjust this call according to how your old navigate function is structured
        oldNavigate(routeName, params)
      }
    },
    [navigation]
  )

  return navigateCallback
}
