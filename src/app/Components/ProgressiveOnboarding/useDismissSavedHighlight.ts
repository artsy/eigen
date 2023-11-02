import { Tabs } from "@artsy/palette-mobile"
import { Tab } from "app/Scenes/MyProfile/MyProfileHeaderMyCollectionAndSavedWorks"
import { GlobalStore } from "app/store/GlobalStore"
import { useEffect } from "react"

/**
 * Used to dismiss the indicator on the Tab of Saved Works under Profile
 * can only be used with components with a Tab as parent
 */
export const useDismissSavedHighlight = () => {
  const { dismiss } = GlobalStore.actions.progressiveOnboarding
  const {
    isDismissed,
    sessionState: { isReady },
  } = GlobalStore.useAppState((state) => state.progressiveOnboarding)
  const focusedTab = Tabs.useFocusedTab()

  const dismissed = isDismissed("save-highlight").status

  useEffect(() => {
    if (dismissed || !focusedTab || focusedTab !== Tab.savedWorks || !isReady) {
      return
    }

    dismiss("save-highlight")
  }, [dismissed, dismiss, focusedTab, isReady])
}
