import { __unsafe__onboardingNavigationRef } from "app/Scenes/Onboarding/Onboarding"
import { GlobalStore } from "app/store/GlobalStore"
import { navigate } from "app/system/navigation/navigate"
import { useSystemIsDoneBooting } from "app/system/useSystemIsDoneBooting"
import { useEffect } from "react"
import RNShake from "react-native-shake"

export const useRageShakeDevMenu = () => {
  const userIsDev = GlobalStore.useAppState((s) => s.artsyPrefs.userIsDev.value)
  const isLoggedIn = GlobalStore.useAppState((state) => !!state.auth.userAccessToken)
  const isBooted = useSystemIsDoneBooting()

  useEffect(() => {
    const subscription = RNShake.addListener(() => {
      if (!userIsDev || !isBooted) {
        return
      }

      if (!isLoggedIn) {
        __unsafe__onboardingNavigationRef.current?.navigate("DevMenu")
      } else {
        navigate("/dev-menu", { modal: true })
      }
    })

    return () => {
      subscription.remove()
    }
  }, [userIsDev, isBooted, isLoggedIn])
}
