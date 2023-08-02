import { GlobalStore } from "app/store/GlobalStore"
import { useEffect } from "react"

export const useDismissSavedHighlight = () => {
  const { dismiss } = GlobalStore.actions.progressiveOnboarding
  const { isDismissed } = GlobalStore.useAppState((state) => state.progressiveOnboarding)

  const dismissed = isDismissed("save-highlight").status

  useEffect(() => {
    if (dismissed) {
      return
    }

    dismiss("save-highlight")
  }, [dismissed, dismiss])
}
