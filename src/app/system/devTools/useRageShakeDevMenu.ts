import { GlobalStore } from "app/store/GlobalStore"
import { navigateToDevMenu } from "app/system/devTools/DevMenu/utils/navigateToDevMenu"
import { useEffect } from "react"
import RNShake from "react-native-shake"

export const useRageShakeDevMenu = () => {
  const userIsDev = GlobalStore.useAppState((s) => s.artsyPrefs.userIsDev.value)
  const isHydrated = GlobalStore.useAppState((state) => state.sessionState.isHydrated)

  useEffect(() => {
    const subscription = RNShake.addListener(() => {
      if (!userIsDev || !isHydrated) {
        return
      }

      navigateToDevMenu()
    })

    return () => {
      subscription.remove()
    }
  }, [userIsDev, isHydrated])
}
