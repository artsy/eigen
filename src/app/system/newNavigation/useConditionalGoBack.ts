import { useNavigation } from "@react-navigation/native"
import { goBack as oldGoBack } from "app/system/navigation/navigate"
import { useCallback } from "react"

export const useConditionalGoBack = () => {
  const navigation = useNavigation()

  const goBackCallback = useCallback(() => {
    const isFeatureEnabled = true // TODO: Set up a real feature flag
    if (isFeatureEnabled) {
      navigation.goBack()
    } else {
      // TODO: Check that this works with the old nav
      oldGoBack()
    }
  }, [navigation])

  return goBackCallback
}
