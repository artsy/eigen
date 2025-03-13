import { ActionType, ContextModule, OwnerType } from "@artsy/cohesion"
import { ProgressiveOnboardingKey } from "app/store/ProgressiveOnboardingModel"
import { useCallback } from "react"
import { useTracking } from "react-tracking"

interface UseProgressiveOnboardingTracking {
  name: ProgressiveOnboardingKey
  contextScreenOwnerType?: OwnerType
  contextModule: ContextModule
}

// TODO: move to cohesion when approved by data
interface TooltipViewedApp {
  action: ActionType.tooltipViewed
  context_owner_type?: OwnerType
  context_module: string
  type: string
}

export const useProgressiveOnboardingTracking = ({
  name,
  contextScreenOwnerType,
  contextModule,
}: UseProgressiveOnboardingTracking) => {
  const tracking = useTracking()

  const trackEvent = useCallback(() => {
    const payload: TooltipViewedApp = {
      action: ActionType.tooltipViewed,
      context_owner_type: contextScreenOwnerType,
      context_module: contextModule,
      type: name,
    }

    tracking.trackEvent(payload)
  }, [contextScreenOwnerType, name])

  return { trackEvent }
}
