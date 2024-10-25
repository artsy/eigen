import {
  ActionType,
  ContextModule,
  OwnerType,
  TappedArtworkGroup,
  TappedCollectionGroup,
} from "@artsy/cohesion"
import { useTracking } from "react-tracking"

export const useCollectionByCategoryTracking = () => {
  const { trackEvent } = useTracking()

  const trackChipTap = (slug: string, index: number) => {
    const payload: TappedCollectionGroup = {
      action: ActionType.tappedCollectionGroup,
      context_module: ContextModule.collectionRail,
      context_screen_owner_type: OwnerType.collectionsCategory,
      destination_screen_owner_type: OwnerType.collection,
      destination_screen_owner_slug: slug,
      horizontal_slide_position: index,
      type: "thumbnail",
    }
    trackEvent(payload)
  }

  const trackArtworkRailItemTap = (slug: string, index: number) => {
    const payload: TappedArtworkGroup = {
      action: ActionType.tappedArtworkGroup,
      context_module: ContextModule.collectionRail,
      context_screen_owner_type: OwnerType.collectionsCategory,
      destination_screen_owner_slug: slug,
      destination_screen_owner_type: OwnerType.artwork,
      horizontal_slide_position: index,
      type: "thumbnail",
    }
    trackEvent(payload)
  }

  const trackArtworkRailViewAllTap = (slug: string) => {
    const payload: TappedArtworkGroup = {
      action: ActionType.tappedArtworkGroup,
      context_module: ContextModule.collectionRail,
      context_screen_owner_type: OwnerType.collectionsCategory,
      destination_screen_owner_slug: slug,
      destination_screen_owner_type: OwnerType.collection,
      type: "viewAll",
    }
    trackEvent(payload)
  }

  return {
    trackChipTap,
    trackArtworkRailItemTap,
    trackArtworkRailViewAllTap,
  }
}
