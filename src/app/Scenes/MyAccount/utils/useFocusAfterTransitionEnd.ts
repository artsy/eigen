import { useNavigation } from "@react-navigation/native"
import { useEffect } from "react"

/**
 * This hook is used to focus an input after a transition ends.
 * Ideally, we would use the `autoFocus` prop on the input, but this is not possible
 * because the input is not mounted until the transition ends.
 * We can remove this hook once React-native fixes this issue.
 * https://github.com/software-mansion/react-native-screens/issues/236
 * https://github.com/software-mansion/react-native-screens/issues/1637
 */
export const useAfterTransitionEnd = (callback: () => void) => {
  const navigation = useNavigation()

  useEffect(() => {
    const unsubscribe = navigation.addListener("transitionEnd" as any, () => {
      callback()
    })

    return unsubscribe
  }, [navigation])
}
