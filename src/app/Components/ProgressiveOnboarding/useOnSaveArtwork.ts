import { useSetActivePopover } from "app/Components/ProgressiveOnboarding/useSetActivePopover"
import { GlobalStore } from "app/store/GlobalStore"
import { useCallback } from "react"

export const useOnSaveArtwork = () => {
  const { setTabProps } = GlobalStore.actions.bottomTabs
  const { dismiss } = GlobalStore.actions.progressiveOnboarding
  const { tabProps, isDismissed } = GlobalStore.useAppState((state) => ({
    ...state.bottomTabs.sessionState,
    ...state.progressiveOnboarding,
  }))

  const dismissed = isDismissed("save-artwork").status
  const { clearActivePopover } = useSetActivePopover(!dismissed)

  const setProfileTabSavedArtwork = useCallback(() => {
    if (!dismissed) {
      dismiss("save-artwork")
      clearActivePopover()
    }
    setTabProps({ tab: "profile", props: { ...tabProps.profile, savedArtwork: true } })
  }, [tabProps.profile?.savedArtwork, setTabProps, isDismissed, dismiss])

  return { setProfileTabSavedArtwork }
}
