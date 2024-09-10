import { ActionType, ContextModule, OwnerType, TappedArtworkGroup, TappedEntityDestinationType, TappedHeroUnitsGroup } from "@artsy/cohesion"
import { LargeArtworkRail_artworks$data } from "__generated__/LargeArtworkRail_artworks.graphql"
import { SmallArtworkRail_artworks$data } from "__generated__/SmallArtworkRail_artworks.graphql"
import { matchRoute } from "app/routes"
import { HeroUnit } from "app/Scenes/Home/Components/HeroUnitsRail"
import { getArtworkSignalTrackingFields } from "app/utils/getArtworkSignalTrackingFields"
import { useFeatureFlag } from "app/utils/hooks/useFeatureFlag"
import { useTracking } from "react-tracking"

export const useHomeViewTracking = () => {
  const { trackEvent } = useTracking()
  const AREnableAuctionImprovementsSignals = useFeatureFlag("AREnableAuctionImprovementsSignals")

  return {
    tappedArtworkGroup: (
      artwork: LargeArtworkRail_artworks$data[0] | SmallArtworkRail_artworks$data[0],
      contextModule: ContextModule,
      index: number
    ) => {
      const payload: TappedArtworkGroup = {
        action: ActionType.tappedArtworkGroup,
        context_module: contextModule,
        context_screen_owner_type: OwnerType.home,
        destination_screen_owner_type: OwnerType.artwork,
        destination_screen_owner_slug: artwork.slug,
        destination_screen_owner_id: artwork.internalID,
        horizontal_slide_position: index,
        module_height: "single",
        type: "thumbnail",
        ...getArtworkSignalTrackingFields(
          artwork.collectorSignals,
          AREnableAuctionImprovementsSignals
        ),
      }

      trackEvent(payload)
    },
  }
}
