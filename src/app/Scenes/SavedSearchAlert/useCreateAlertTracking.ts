import { ActionType, ContextModule, ScreenOwnerType, TappedCreateAlert } from "@artsy/cohesion"
import { useCallback } from "react"
import { useTracking } from "react-tracking"

interface UseCreateAlertTrackingProps {
  contextScreenOwnerType: ScreenOwnerType
  contextScreenOwnerId?: string
  contextScreenOwnerSlug?: string
  contextModule?: ContextModule
}

export const useCreateAlertTracking = ({
  contextScreenOwnerType,
  contextScreenOwnerId,
  contextScreenOwnerSlug,
  contextModule,
}: UseCreateAlertTrackingProps) => {
  const tracking = useTracking()

  const trackCreateAlertTap = useCallback(() => {
    const payload: TappedCreateAlert = {
      action: ActionType.tappedCreateAlert,
      context_screen_owner_type: contextScreenOwnerType,
      context_screen_owner_id: contextScreenOwnerId,
      context_screen_owner_slug: contextScreenOwnerSlug,
      context_module: contextModule,
    }

    tracking.trackEvent(payload)
  }, [
    contextModule,
    contextScreenOwnerId,
    contextScreenOwnerSlug,
    contextScreenOwnerType,
    tracking,
  ])

  return { trackCreateAlertTap }
}

export const trackTappedCreateAlert = {
  tappedCreateAlert: (
    ownerType: ScreenOwnerType,
    ownerId?: string,
    ownerSlug?: string,
    contextModule?: ContextModule
  ): TappedCreateAlert => ({
    action: ActionType.tappedCreateAlert,
    context_screen_owner_type: ownerType,
    context_screen_owner_id: ownerId,
    context_screen_owner_slug: ownerSlug,
    context_module: contextModule,
  }),
}
