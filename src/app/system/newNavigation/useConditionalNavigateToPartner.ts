import { NavigationProp, useNavigation } from "@react-navigation/native"
import { NavigationRoutes } from "app/Navigation"
import { navigateToPartner as oldNavigateToPartner } from "app/system/navigation/navigate"
import { useConditionalNavigate } from "app/system/newNavigation/useConditionalNavigate"
import { useCallback } from "react"

export const useConditionalNavigateToPartner = () => {
  const navigation = useNavigation<NavigationProp<NavigationRoutes>>()

  const newNavigate = useConditionalNavigate()

  const navigateCallback = useCallback(
    (routeName: string, params?: object) => {
      const isFeatureEnabled = true // TODO: Set up a real feature flag
      if (isFeatureEnabled) {
        newNavigate(routeName, params)
      } else {
        oldNavigateToPartner(routeName)
      }
    },
    [navigation]
  )

  return navigateCallback
}
