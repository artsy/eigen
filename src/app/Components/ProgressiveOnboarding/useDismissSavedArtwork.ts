import { useIsFocused } from "@react-navigation/native"
import { useOnSaveArtwork } from "app/Components/ProgressiveOnboarding/useOnSaveArtwork"
import { GlobalStore } from "app/store/GlobalStore"
import { useEffect } from "react"

// Dismiss "save-artwork" onboarding alert if an artwork was saved before
export const useDismissSavedArtwork = (saved?: boolean | null) => {
  const { setProfileTabSavedArtwork } = useOnSaveArtwork()
  const { dismiss } = GlobalStore.actions.progressiveOnboarding
  const {
    isDismissed,
    sessionState: { isReady },
  } = GlobalStore.useAppState((state) => state.progressiveOnboarding)
  const isFocused = useIsFocused()

  const dismissed = isDismissed("save-artwork").status

  useEffect(() => {
    if (!saved || dismissed || !isReady || !isFocused) {
      return
    }

    // If an Artwork was saved before and wasn't dismissed, dismiss and enable bottom tab notification
    if (saved && !dismissed) {
      dismiss("save-artwork")
      setProfileTabSavedArtwork()
    }
  }, [saved, dismissed, dismiss, setProfileTabSavedArtwork, isReady, isFocused])
}
