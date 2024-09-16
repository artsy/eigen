import {
  ActionType,
  ContextModule,
  OwnerType,
  TappedActivityGroup,
  TappedArticleGroup,
  TappedArtistGroup,
  TappedArtworkGroup,
  TappedAuctionGroup,
  TappedAuctionResultGroup,
  TappedCollectionGroup,
  TappedFairGroup,
  TappedHeroUnitGroup,
  TappedShowGroup,
  TappedShowMore,
  TappedViewingRoomGroup,
} from "@artsy/cohesion"
import { ClickedNotificationsBell } from "@artsy/cohesion/dist/Schema/Events/ActivityPanel"
import { getArtworkSignalTrackingFields } from "app/utils/getArtworkSignalTrackingFields"
import { useFeatureFlag } from "app/utils/hooks/useFeatureFlag"
import { useTracking } from "react-tracking"

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

    tappedActivityGroup: (destinationPath: string, contextModule: ContextModule, index: number) => {
      const payload: TappedActivityGroup = {
        action: ActionType.tappedActivityGroup,
        context_module: contextModule,
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
      contextModule: ContextModule,
      index: number
    ) => {
      let payload: TappedArticleGroup = {
        action: ActionType.tappedArticleGroup,
        context_module: contextModule,
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

    tappedArtistGroup: (
      artistID: string,
      artistSlug: string,
      contextModule: ContextModule,
      index: number
    ) => {
      const payload: TappedArtistGroup = {
        action: ActionType.tappedArtistGroup,
        context_module: contextModule,
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
      contextModule: ContextModule,
      index: number
    ) => {
      const payload: TappedArtworkGroup = {
        action: ActionType.tappedArtworkGroup,
        context_module: contextModule,
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

    tappedAuctionGroup: (
      saleID: string,
      saleSlug: string,
      contextModule: ContextModule,
      index: number
    ) => {
      const payload: TappedAuctionGroup = {
        action: ActionType.tappedAuctionGroup,
        context_module: contextModule,
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
      contextModule: ContextModule,
      index: number
    ) => {
      let payload: TappedAuctionResultGroup = {
        action: ActionType.tappedAuctionResultGroup,
        context_module: contextModule,
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

    tappedFairGroup: (
      fairID: string,
      fairSlug: string,
      contextModule: ContextModule,
      index: number
    ) => {
      const payload: TappedFairGroup = {
        action: ActionType.tappedFairGroup,
        context_module: contextModule,
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

    tappedHeroUnitGroup: (destinationPath: string, contextModule: ContextModule, index: number) => {
      const payload: TappedHeroUnitGroup = {
        action: ActionType.tappedHeroUnitGroup,
        context_module: contextModule,
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
      contextModule: ContextModule,
      index: number
    ) => {
      const payload: TappedCollectionGroup = {
        action: ActionType.tappedCollectionGroup,
        context_module: contextModule,
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

    tappedShowGroup: (
      showID: string,
      showSlug: string,
      contextModule: ContextModule,
      index: number
    ) => {
      const payload: TappedShowGroup = {
        action: ActionType.tappedShowGroup,
        context_module: contextModule,
        context_screen_owner_type: OwnerType.home,
        destination_screen_owner_type: OwnerType.show,
        destination_screen_owner_id: showID,
        destination_screen_owner_slug: showSlug,
        horizontal_slide_position: index,
        type: "thumbnail",
      }

      trackEvent(payload)
    },

    tappedShowMore: (subject: string, contextModule: ContextModule) => {
      const payload: TappedShowMore = {
        action: ActionType.tappedShowMore,
        context_module: contextModule,
        context_screen_owner_type: OwnerType.home,
        subject: subject,
      }

      trackEvent(payload)
    },

    tappedViewingRoomGroup: (
      viewingRoomID: string,
      viewingRoomSlug: string,
      contextModule: ContextModule,
      index: number
    ) => {
      const payload: TappedViewingRoomGroup = {
        action: ActionType.tappedViewingRoomGroup,
        context_module: contextModule,
        context_screen_owner_type: OwnerType.home,
        destination_screen_owner_type: OwnerType.viewingRoom,
        destination_screen_owner_id: viewingRoomID,
        destination_screen_owner_slug: viewingRoomSlug,
        horizontal_slide_position: index,
        type: "thumbnail",
      }

      trackEvent(payload)
    },
  }
}
