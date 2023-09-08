import { useOnSaveArtwork } from "app/Components/ProgressiveOnboarding/useOnSaveArtwork"
import { GlobalStore } from "app/store/GlobalStore"
import { useEffect } from "react"

// Dismiss "save-artwork" onboarding alert if an artwork was saved before
export const useDismissSavedArtwork = (saved?: boolean | null) => {
  const { setProfileTabSavedArtwork } = useOnSaveArtwork()
  const { dismiss } = GlobalStore.actions.progressiveOnboarding
  const { isDismissed } = GlobalStore.useAppState((state) => state.progressiveOnboarding)

  const dismissed = isDismissed("save-artwork").status

  useEffect(() => {
    if (!saved || dismissed) {
      return
    }

    // If an Artwork was saved before and wasn't dismissed, dismiss and enable bottom tab notification
    if (saved && !dismissed) {
      dismiss("save-artwork")
      setProfileTabSavedArtwork()
    }
  }, [saved, dismissed, dismiss, setProfileTabSavedArtwork])
}
