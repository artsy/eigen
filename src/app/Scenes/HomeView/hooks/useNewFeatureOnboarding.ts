import { GlobalStore } from "app/store/GlobalStore"
import { useFeatureFlag } from "app/utils/hooks/useFeatureFlag"
import { useEffect, useState } from "react"

export const useDarkModeOnboarding = () => {
  const supportsDarkMode = useFeatureFlag("ARDarkModeSupport")
  const [isVisible, setIsVisible] = useState(false)

  const {
    sessionState: { isReady, activePopover },
    seenFeatures,
  } = GlobalStore.useAppState((state) => state.progressiveOnboarding)

  const { addSeenFeature } = GlobalStore.actions.progressiveOnboarding

  const userHasArtsyEmail = GlobalStore.useAppState((state) => state.auth.userHasArtsyEmail)

  useEffect(() => {
    if (
      isReady &&
      !activePopover &&
      supportsDarkMode &&
      !seenFeatures.includes("dark-mode") &&
      userHasArtsyEmail
    ) {
      setTimeout(() => {
        setIsVisible(true)
        addSeenFeature("dark-mode")
      }, 1000)
    } else {
      setIsVisible(false)
    }
  }, [isReady, activePopover, supportsDarkMode, seenFeatures, addSeenFeature])
  return {
    isVisible,
    setIsVisible,
  }
}
