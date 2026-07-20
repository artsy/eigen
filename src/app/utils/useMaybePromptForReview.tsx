import { getCurrentEmissionState } from "app/store/GlobalStore"
import { useEffect } from "react"
import { LaunchArguments } from "react-native-launch-arguments"
import { promptForReview } from "./promptForReview"

/**
 * This is used to prompt for review on the fifth app launch and later.
 */
export const useMaybePromptForReview = (context: Parameters<typeof promptForReview>[0]) => {
  const launchCount = getCurrentEmissionState().launchCount

  useEffect(() => {
    // Never show the native "rate the app" prompt during Maestro E2E runs — it
    // overlays the UI and blocks assertions (e.g. the post-signup home screen).
    const { useMaestroInit } = LaunchArguments.value<{ useMaestroInit?: boolean }>()
    if (useMaestroInit) {
      return
    }

    if (launchCount === 5) {
      promptForReview(context)
    }
  }, [])
}
