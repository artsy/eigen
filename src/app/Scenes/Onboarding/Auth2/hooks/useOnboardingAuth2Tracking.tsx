import { ActionType, AuthImpression } from "@artsy/cohesion"
import { useTracking } from "react-tracking"

export const useOnboardingAuth2Tracking = () => {
  const { trackEvent } = useTracking()

  return {
    authImpression: () => {
      const payload: Partial<AuthImpression> = {
        action: ActionType.authImpression,
        trigger: "tap",
      }

      trackEvent(payload)
    },
  }
}
