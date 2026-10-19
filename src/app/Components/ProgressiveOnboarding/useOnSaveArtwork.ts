import { GlobalStore } from "app/store/GlobalStore"
import { PROGRESSIVE_ONBOARDING_SAVE_ARTWORK } from "app/store/ProgressiveOnboardingModel"
import { useCallback } from "react"

export const useOnSaveArtwork = () => {
  const { setTabProps } = GlobalStore.actions.bottomTabs
  const { dismiss, releaseActivePopover, setIsReady } = GlobalStore.actions.progressiveOnboarding
  const { tabProps, isDismissed } = GlobalStore.useAppState((state) => ({
    ...state.bottomTabs.sessionState,
    ...state.progressiveOnboarding,
  }))

  const setProfileTabSavedArtwork = useCallback(() => {
    if (!isDismissed("save-artwork").status) {
      dismiss(PROGRESSIVE_ONBOARDING_SAVE_ARTWORK)
      // Release by key, so this no-ops unless save-artwork is the current holder.
      releaseActivePopover(PROGRESSIVE_ONBOARDING_SAVE_ARTWORK)
      setIsReady(true)
    }
    setTabProps({ tab: "profile", props: { ...tabProps.profile, savedArtwork: true } })
  }, [tabProps.profile?.savedArtwork, setTabProps, isDismissed, dismiss])

  return { setProfileTabSavedArtwork }
}
