import { ActionType, PageOwnerType, TooltipViewed } from "@artsy/cohesion"
import { useEffect } from "react"
import { useTracking } from "react-tracking"

interface UseProgressiveOnboardingTracking {
  name: string
  contextPageOwnerType: PageOwnerType
}

//TODO: Find equivalents
export const useProgressiveOnboardingTracking = ({
  contextPageOwnerType,
  name,
}: UseProgressiveOnboardingTracking) => {
  const { trackEvent } = useTracking()

  // const { contextPageOwnerId, contextPageOwnerSlug, contextPageOwnerType } = useAnalyticsContext()

  useEffect(() => {
    // if ((!contextPageOwnerId && !contextPageOwnerSlug) || !contextPageOwnerType) {
    //   console.warn("Missing analytics context")
    //   return
    // }

    const payload: Partial<TooltipViewed> = {
      action: ActionType.tooltipViewed,
      // context_owner_id: contextPageOwnerId!,
      // context_owner_slug: contextPageOwnerSlug!,
      context_owner_type: contextPageOwnerType,
      type: name,
    }

    trackEvent(payload)
  }, [contextPageOwnerType, name, trackEvent])
}
