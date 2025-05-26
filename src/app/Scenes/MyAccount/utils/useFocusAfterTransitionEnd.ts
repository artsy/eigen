import { useNavigation } from "@react-navigation/native"
import { useEffect } from "react"

export const useAfterTransitionEnd = (callback: () => void) => {
  const navigation = useNavigation()

  useEffect(() => {
    const unsubscribe = navigation.addListener("transitionEnd" as any, () => {
      callback()
    })

    return unsubscribe
  }, [navigation])
}
