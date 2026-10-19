import { useIsFocused } from "@react-navigation/native"
import { useOnSaveArtwork } from "app/Components/ProgressiveOnboarding/useOnSaveArtwork"
import { GlobalStore } from "app/store/GlobalStore"
import { PROGRESSIVE_ONBOARDING_SAVE_ARTWORK } from "app/store/ProgressiveOnboardingModel"
import { useEffect } from "react"

// Dismiss "save-artwork" onboarding alert if an artwork was saved before
export const useDismissSavedArtwork = (saved?: boolean | null) => {
  const { setProfileTabSavedArtwork } = useOnSaveArtwork()
  const { dismiss, releaseActivePopover, setIsReady } = GlobalStore.actions.progressiveOnboarding
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
      dismiss(PROGRESSIVE_ONBOARDING_SAVE_ARTWORK)
      // Release by key, so this no-ops unless save-artwork is the current holder.
      releaseActivePopover(PROGRESSIVE_ONBOARDING_SAVE_ARTWORK)
      setIsReady(true)
      setProfileTabSavedArtwork()
    }
  }, [saved, dismissed, dismiss, setProfileTabSavedArtwork, isReady, isFocused])
}
