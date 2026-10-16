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
      // Owner-aware: no-ops unless the save-artwork popover is the one holding the lock.
      // It used to clear the lock blindly, stealing it from whoever did hold it.
      releaseActivePopover(PROGRESSIVE_ONBOARDING_SAVE_ARTWORK)
      setIsReady(true)
    }
    setTabProps({ tab: "profile", props: { ...tabProps.profile, savedArtwork: true } })
  }, [tabProps.profile?.savedArtwork, setTabProps, isDismissed, dismiss])

  return { setProfileTabSavedArtwork }
}
