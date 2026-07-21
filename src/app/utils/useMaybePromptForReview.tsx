import { getCurrentEmissionState } from "app/store/GlobalStore"
import { useEffect } from "react"
import { promptForReview } from "./promptForReview"

/**
 * This is used to prompt for review on the fifth app launch and later.
 */
export const useMaybePromptForReview = (context: Parameters<typeof promptForReview>[0]) => {
  const launchCount = getCurrentEmissionState().launchCount

  useEffect(() => {
    if (launchCount === 5) {
      promptForReview(context)
    }
  }, [])
}
