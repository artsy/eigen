import {
  ActionType,
  ContextModule,
  OwnerType,
  ProgressiveOnboardingTooltipViewed,
} from "@artsy/cohesion"
import { ProgressiveOnboardingKey } from "app/store/ProgressiveOnboardingModel"
import { useCallback } from "react"
import { useTracking } from "react-tracking"

interface UseProgressiveOnboardingTracking {
  name: ProgressiveOnboardingKey
  contextScreenOwnerType?: OwnerType
  contextModule: ContextModule
}

export const useProgressiveOnboardingTracking = ({
  name,
  contextScreenOwnerType,
  contextModule,
}: UseProgressiveOnboardingTracking) => {
  const tracking = useTracking()

  const trackEvent = useCallback(() => {
    const payload: ProgressiveOnboardingTooltipViewed = {
      action: ActionType.tooltipViewed,
      context_owner_type: contextScreenOwnerType,
      context_module: contextModule,
      type: name,
    }

    tracking.trackEvent(payload)
  }, [contextScreenOwnerType, name])

  return { trackEvent }
}
