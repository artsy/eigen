import { internal_navigationRef } from "app/Navigation/Navigation"
import { __unsafe__onboardingNavigationRef } from "app/Scenes/Onboarding/Onboarding"
import { GlobalStore } from "app/store/GlobalStore"
// eslint-disable-next-line no-restricted-imports
import { navigate } from "app/system/navigation/navigate"
import { useEffect } from "react"
import RNShake from "react-native-shake"

export const useRageShakeDevMenu = () => {
  const userIsDev = GlobalStore.useAppState((s) => s.artsyPrefs.userIsDev.value)
  const isLoggedIn = GlobalStore.useAppState((state) => !!state.auth.userAccessToken)
  const isHydrated = GlobalStore.useAppState((state) => state.sessionState.isHydrated)

  useEffect(() => {
    const subscription = RNShake.addListener(() => {
      if (!userIsDev || !isHydrated) {
        return
      }

      if (!isLoggedIn) {
        internal_navigationRef.current?.navigate("DevMenu")
      } else {
        navigate("/dev-menu")
      }
    })

    return () => {
      subscription.remove()
    }
  }, [userIsDev, isHydrated, isLoggedIn])
}
