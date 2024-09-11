import {
  ActionType,
  ContextModule,
  OwnerType,
  TappedArticleGroup,
  TappedArtistGroup,
  TappedArtworkGroup,
  TappedAuctionGroup,
  TappedAuctionResultGroup,
  TappedCollectionGroup,
  TappedFairGroup,
  TappedShowGroup,
  TappedShowMore,
  TappedViewingRoomGroup,
} from "@artsy/cohesion"
import { ClickedNotificationsBell } from "@artsy/cohesion/dist/Schema/Events/ActivityPanel"
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
    // TODO: Shouldn't this be tappedNotificationBell?
    clickedNotificationBell: () => {
      const payload: ClickedNotificationsBell = {
        action: ActionType.clickedNotificationsBell,
      }

      trackEvent(payload)
    },

    tappedActivityGroup: (destinationPath: string, sectionID: string, index: number) => {
      // TODO: Type as TappedActivityGroup once artsy/cohesion is updated
      const payload = {
        action: ActionType.tappedActivityGroup,
        context_module: formatSectionIDAsContextModule(sectionID),
        context_screen_owner_type: OwnerType.home,
        destination_path: destinationPath,
        horizontal_slide_position: index,
        module_height: "single",
        type: "thumbnail",
      }

      trackEvent(payload)
    },

    tappedArticleGroup: (
      articleID: string,
      articleSlug: string | undefined | null,
      sectionID: string,
      index: number
    ) => {
      let payload: TappedArticleGroup = {
        action: ActionType.tappedArticleGroup,
        context_module: formatSectionIDAsContextModule(sectionID),
        context_screen_owner_type: OwnerType.home,
        destination_screen_owner_id: articleID,
        destination_screen_owner_type: OwnerType.article,
        horizontal_slide_position: index,
        module_height: "double",
        type: "thumbnail",
      }

      if (articleSlug) {
        payload = {
          ...payload,
          destination_screen_owner_slug: articleSlug,
        }
      }

      trackEvent(payload)
    },

    tappedArtistGroup: (artistID: string, artistSlug: string, sectionID: string, index: number) => {
      const payload: TappedArtistGroup = {
        action: ActionType.tappedArtistGroup,
        context_module: formatSectionIDAsContextModule(sectionID),
        context_screen_owner_type: OwnerType.home,
        destination_screen_owner_type: OwnerType.artist,
        destination_screen_owner_id: artistID,
        destination_screen_owner_slug: artistSlug,
        horizontal_slide_position: index,
        module_height: "double",
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

    tappedAuctionGroup: (saleID: string, saleSlug: string, sectionID: string, index: number) => {
      const payload: TappedAuctionGroup = {
        action: ActionType.tappedAuctionGroup,
        context_module: formatSectionIDAsContextModule(sectionID),
        context_screen_owner_type: OwnerType.home,
        destination_screen_owner_type: OwnerType.sale,
        destination_screen_owner_id: saleID,
        destination_screen_owner_slug: saleSlug,
        horizontal_slide_position: index,
        module_height: "double",
        type: "thumbnail",
      }

      trackEvent(payload)
    },

    tappedAuctionResultGroup: (
      auctionResultID: string,
      auctionResultSlug: string | null | undefined,
      sectionID: string,
      index: number
    ) => {
      let payload: TappedAuctionResultGroup = {
        action: ActionType.tappedAuctionResultGroup,
        context_module: formatSectionIDAsContextModule(sectionID),
        context_screen_owner_type: OwnerType.home,
        destination_screen_owner_id: auctionResultID,
        destination_screen_owner_type: OwnerType.auctionResult,
        horizontal_slide_position: index,
        type: "thumbnail",
      }

      if (auctionResultSlug) {
        payload = {
          ...payload,
          destination_screen_owner_slug: auctionResultSlug,
        }
      }

      trackEvent(payload)
    },

    tappedFairGroup: (fairID: string, fairSlug: string, sectionID: string, index: number) => {
      const payload: TappedFairGroup = {
        action: ActionType.tappedFairGroup,
        context_module: formatSectionIDAsContextModule(sectionID),
        context_screen_owner_type: OwnerType.home,
        destination_screen_owner_type: OwnerType.fair,
        destination_screen_owner_id: fairID,
        destination_screen_owner_slug: fairSlug,
        horizontal_slide_position: index,
        module_height: "double",
        type: "thumbnail",
      }

      trackEvent(payload)
    },

    tappedHeroUnitsGroup: (destinationPath: string, sectionID: string, index: number) => {
      // TODO: Type as TappedHeroUnitsGroup once artsy/cohesion is updated
      const payload = {
        action: ActionType.tappedHeroUnitsGroup,
        context_module: formatSectionIDAsContextModule(sectionID),
        context_screen_owner_type: OwnerType.home,
        destination_path: destinationPath,
        horizontal_slide_position: index,
        type: "header",
      }

      trackEvent(payload)
    },

    tappedMarketingCollectionGroup: (
      collectionID: string,
      collectionSlug: string,
      sectionID: string,
      index: number
    ) => {
      const payload: TappedCollectionGroup = {
        action: ActionType.tappedCollectionGroup,
        context_module: formatSectionIDAsContextModule(sectionID),
        context_screen_owner_type: OwnerType.home,
        destination_screen_owner_type: OwnerType.collection,
        destination_screen_owner_id: collectionID,
        destination_screen_owner_slug: collectionSlug,
        horizontal_slide_position: index,
        module_height: "double",
        type: "thumbnail",
      }

      trackEvent(payload)
    },

    tappedShowGroup: (showID: string, showSlug: string, sectionID: string, index: number) => {
      const payload: TappedShowGroup = {
        action: ActionType.tappedShowGroup,
        context_module: formatSectionIDAsContextModule(sectionID),
        context_screen_owner_type: OwnerType.home,
        destination_screen_owner_type: OwnerType.show,
        destination_screen_owner_id: showID,
        destination_screen_owner_slug: showSlug,
        horizontal_slide_position: index,
        type: "thumbnail",
      }

      trackEvent(payload)
    },

    tappedShowMore: (subject: string, sectionID: string) => {
      const payload: TappedShowMore = {
        action: ActionType.tappedShowMore,
        context_module: formatSectionIDAsContextModule(sectionID),
        context_screen_owner_type: OwnerType.home,
        subject: subject,
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
