import { useIsFocused } from "@react-navigation/native"
import { GlobalStore } from "app/store/GlobalStore"
import { runAfterInteractions } from "app/utils/runAfterInteractions"
import { useEffect } from "react"

/**
 * Sets the Progressive Onboarding to a ready state when the caller screen is focused
 */
export const useEnableProgressiveOnboarding = () => {
  const { setIsReady } = GlobalStore.actions.progressiveOnboarding
  const {
    sessionState: { isReady },
  } = GlobalStore.useAppState((state) => state.progressiveOnboarding)
  const isFocused = useIsFocused()

  useEffect(() => {
    if (isFocused && !isReady) {
      runAfterInteractions(() => {
        setIsReady(true)
      })
    }
  }, [setIsReady, isFocused, isReady])
}
