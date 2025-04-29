import { useToast } from "app/Components/Toast/toastHook"
import { GlobalStore, getCurrentEmissionState } from "app/store/GlobalStore"
import { navigate } from "app/system/navigation/navigate"
import { useFeatureFlag } from "app/utils/hooks/useFeatureFlag"
import { useEffect } from "react"

export const useDarkModeOnboarding = () => {
  const toast = useToast()
  const enableDarkMode = useFeatureFlag("ARDarkModeSupport")
  const enableDarkModeOnboarding = useFeatureFlag("ARDarkModeOnboarding")
  const { isDismissed } = GlobalStore.useAppState((state) => state.progressiveOnboarding)
  const { dismiss } = GlobalStore.actions.progressiveOnboarding
  const launchCount = getCurrentEmissionState().launchCount

  useEffect(() => {
    if (!enableDarkMode || !enableDarkModeOnboarding) return

    if (isDismissed("dark-mode").status) {
      return
    }

    dismiss("dark-mode")

    // We only want to notify users who have already used the app before.
    if (launchCount < 2) return

    toast.show("Dark Mode is here!", "bottom", {
      description: "You can now toggle Dark Mode in Settings.",
      duration: "long",
      onPress: () => {
        navigate("settings/dark-mode")
      },
    })
  }, [])
}
