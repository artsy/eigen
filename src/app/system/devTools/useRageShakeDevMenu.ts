import { internal_navigationRef } from "app/Navigation/Navigation"
import { GlobalStore } from "app/store/GlobalStore"
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

      internal_navigationRef.current?.navigate("DevMenu")
    })

    return () => {
      subscription.remove()
    }
  }, [userIsDev, isHydrated])
}
