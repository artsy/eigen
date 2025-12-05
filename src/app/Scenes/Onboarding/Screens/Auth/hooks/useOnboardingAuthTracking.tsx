import { ActionType, AuthImpression, OwnerType } from "@artsy/cohesion"
import { screen } from "app/utils/track/helpers"
import { useTracking } from "react-tracking"

export const useOnboardingAuthTracking = () => {
  const { trackEvent } = useTracking()

  return {
    authImpression: () => {
      const payload: Partial<AuthImpression> = {
        action: ActionType.authImpression,
        trigger: "tap",
      }

      trackEvent(payload)
    },
    authModalScreenView: () => {
      const payload = screen({ context_screen_owner_type: OwnerType.authModal })
      trackEvent(payload)
    },
  }
}
