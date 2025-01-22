import { GlobalStore } from "app/store/GlobalStore"
import { useCallback } from "react"

export const useOnSaveArtwork = () => {
  const { setTabProps } = GlobalStore.actions.bottomTabs
  const { dismiss, setActivePopover, setIsReady } = GlobalStore.actions.progressiveOnboarding
  const { tabProps, isDismissed } = GlobalStore.useAppState((state) => ({
    ...state.bottomTabs.sessionState,
    ...state.progressiveOnboarding,
  }))

  const setProfileTabSavedArtwork = useCallback(() => {
    if (!isDismissed("save-artwork").status) {
      dismiss("save-artwork")
      // same as clearActivePopover
      // imported clearActivePopover cannot be used inside the hook
      setActivePopover(undefined)
      setIsReady(true)
    }
    setTabProps({ tab: "profile", props: { ...tabProps.profile, savedArtwork: true } })
  }, [tabProps.profile?.savedArtwork, setTabProps, isDismissed, dismiss])

  return { setProfileTabSavedArtwork }
}
