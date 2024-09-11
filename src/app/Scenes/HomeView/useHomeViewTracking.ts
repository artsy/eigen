import {
  ActionType,
  ContextModule,
  OwnerType,
  ScreenOwnerType,
  TappedActivityGroup,
  TappedArtworkGroup,
  TappedViewingRoomGroup,
} from "@artsy/cohesion"
import { getArtworkSignalTrackingFields } from "app/utils/getArtworkSignalTrackingFields"
import { useFeatureFlag } from "app/utils/hooks/useFeatureFlag"
import { camelCase } from "lodash"
import { useTracking } from "react-tracking"

/**

 Convert section ID to requested ContextModule format

 Examples
 - home-view-section-artist-rail -> artistRail
 - home-view-section-new-works-for-you -> newWorksForYouRail

*/
const formatSectionIDAsContextModule = (sectionID: string) => {
  let contextModule = sectionID.replace(/^home-view-section-/, "")
  contextModule = contextModule.replace(/(-rail)?$/, "-rail")
  contextModule = camelCase(contextModule)

  return contextModule as ContextModule
}

export const useHomeViewTracking = () => {
  const { trackEvent } = useTracking()
  const AREnableAuctionImprovementsSignals = useFeatureFlag("AREnableAuctionImprovementsSignals")

  return {
    tappedActivityGroup: (sectionID: string) => {
      const payload: TappedActivityGroup = {
        action: ActionType.tappedActivityGroup,
        context_module: formatSectionIDAsContextModule(sectionID),
        context_screen_owner_type: OwnerType.home,
        destination_screen_owner_type: "" as ScreenOwnerType,
        type: "thumbnail",
      }

      trackEvent(payload)
    },
    tappedArtworkGroup: (
      artworkID: string,
      artworkSlug: string,
      artworkCollectorSignals: any,
      sectionID: string,
      index: number
    ) => {
      const payload: TappedArtworkGroup = {
        action: ActionType.tappedArtworkGroup,
        context_module: formatSectionIDAsContextModule(sectionID),
        context_screen_owner_type: OwnerType.home,
        destination_screen_owner_id: artworkID,
        destination_screen_owner_slug: artworkSlug,
        destination_screen_owner_type: OwnerType.artwork,
        horizontal_slide_position: index,
        module_height: "single",
        type: "thumbnail",
        ...getArtworkSignalTrackingFields(
          artworkCollectorSignals,
          AREnableAuctionImprovementsSignals
        ),
      }

      trackEvent(payload)
    },

    tappedHeroUnitsGroup: (destinationPath: string, sectionID: string) => {
      // TODO: Type as TappedHeroUnitsGroup once artsy/cohesion is updated
      const payload = {
        action: ActionType.tappedHeroUnitsGroup,
        context_module: formatSectionIDAsContextModule(sectionID),
        context_screen_owner_type: OwnerType.home,
        destination_path: destinationPath,
        type: "header",
      }

      trackEvent(payload)
    },

    tappedViewingRoomGroup: (viewingRoomID: string, viewingRoomSlug: string, sectionID: string) => {
      const payload: TappedViewingRoomGroup = {
        action: ActionType.tappedViewingRoomGroup,
        context_module: formatSectionIDAsContextModule(sectionID),
        context_screen_owner_type: OwnerType.home,
        destination_screen_owner_type: OwnerType.viewingRoom,
        destination_screen_owner_id: viewingRoomID,
        destination_screen_owner_slug: viewingRoomSlug,
        type: "thumbnail",
      }

      trackEvent(payload)
    },
  }
}
