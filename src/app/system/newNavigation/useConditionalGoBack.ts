import { useNavigation } from "@react-navigation/native"
import { enableNewNavigation } from "app/App"
import { goBack as oldGoBack } from "app/system/navigation/navigate"
import { useCallback } from "react"

export const useConditionalGoBack = () => {
  const navigation = useNavigation()

  const goBackCallback = useCallback(() => {
    if (enableNewNavigation) {
      navigation.goBack()
    } else {
      oldGoBack()
    }
  }, [navigation])

  return goBackCallback
}
