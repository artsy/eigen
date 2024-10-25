import {
  ActionType,
  ContextModule,
  OwnerType,
  RailViewed,
  Screen,
  ScreenOwnerType,
  TappedActivityGroup,
  TappedArticleGroup,
  TappedArtistGroup,
  TappedArtworkGroup,
  TappedAuctionGroup,
  TappedAuctionResultGroup,
  TappedCardGroup,
  TappedClearNotification,
  TappedCollectionGroup,
  TappedFairGroup,
  TappedHeroUnitGroup,
  TappedNotification,
  TappedNotificationsBell,
  TappedShowGroup,
  TappedShowMore,
  TappedViewingRoomGroup,
} from "@artsy/cohesion"
import { getArtworkSignalTrackingFields } from "app/utils/getArtworkSignalTrackingFields"
import { useFeatureFlag } from "app/utils/hooks/useFeatureFlag"
import { useTracking } from "react-tracking"

export const useHomeViewTracking = () => {
  const { trackEvent } = useTracking()
  const AREnableAuctionImprovementsSignals = useFeatureFlag("AREnableAuctionImprovementsSignals")

  return {
    screen: (ownerType: ScreenOwnerType) => {
      const payload: Screen = {
        action: ActionType.screen,
        context_screen_owner_type: ownerType,
      }

      trackEvent(payload)
    },

    tappedNotificationBell: () => {
      const payload: TappedNotificationsBell = {
        action: ActionType.tappedNotificationsBell,
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

    tappedActivityGroupViewAll: (
      contextModule: ContextModule,
      destinationOwnerType: ScreenOwnerType
    ) => {
      const payload: TappedActivityGroup = {
        action: ActionType.tappedActivityGroup,
        context_module: contextModule,
        context_screen_owner_type: OwnerType.home,
        destination_screen_owner_type: destinationOwnerType,
        type: "viewAll",
      }

      trackEvent(payload)
    },

    tappedArticleGroup: (
      articleID: string,
      articleSlug: string | null | undefined,
      contextModule: ContextModule,
      index: number
    ) => {
      const payload: TappedArticleGroup = {
        action: ActionType.tappedArticleGroup,
        context_module: contextModule,
        context_screen_owner_type: OwnerType.home,
        destination_screen_owner_id: articleID,
        destination_screen_owner_slug: articleSlug ?? undefined,
        destination_screen_owner_type: OwnerType.article,
        horizontal_slide_position: index,
        module_height: "double",
        type: "thumbnail",
      }

      trackEvent(payload)
    },

    tappedArticleGroupViewAll: (
      contextModule: ContextModule,
      destinationOwnerType: ScreenOwnerType
    ) => {
      const payload: TappedArticleGroup = {
        action: ActionType.tappedArticleGroup,
        context_module: contextModule,
        context_screen_owner_type: OwnerType.home,
        destination_screen_owner_type: destinationOwnerType,
        type: "viewAll",
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

    tappedArtistGroupViewAll: (
      contextModule: ContextModule,
      destinationOwnerType: ScreenOwnerType
    ) => {
      const payload: TappedArtistGroup = {
        action: ActionType.tappedArtistGroup,
        context_module: contextModule,
        context_screen_owner_type: OwnerType.home,
        destination_screen_owner_type: destinationOwnerType,
        type: "viewAll",
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

    tappedArtworkGroupViewAll: (
      contextModule: ContextModule,
      destinationOwnerType: ScreenOwnerType
    ) => {
      const payload: TappedArtworkGroup = {
        action: ActionType.tappedArtworkGroup,
        context_module: contextModule,
        context_screen_owner_type: OwnerType.home,
        destination_screen_owner_type: destinationOwnerType,
        type: "viewAll",
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

    tappedAuctionGroupViewAll: (
      contextModule: ContextModule,
      destinationOwnerType: ScreenOwnerType
    ) => {
      const payload: TappedAuctionGroup = {
        action: ActionType.tappedAuctionGroup,
        context_module: contextModule,
        context_screen_owner_type: OwnerType.home,
        destination_screen_owner_type: destinationOwnerType,
        type: "viewAll",
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

    tappedAuctionResultGroupViewAll: (
      contextModule: ContextModule,
      destinationOwnerType: ScreenOwnerType
    ) => {
      const payload: TappedAuctionResultGroup = {
        action: ActionType.tappedAuctionResultGroup,
        context_module: contextModule,
        context_screen_owner_type: OwnerType.home,
        destination_screen_owner_type: destinationOwnerType,
        type: "viewAll",
      }

      trackEvent(payload)
    },

    tappedCardGroup: (
      contextModule: ContextModule,
      destinationOwnerType: ScreenOwnerType,
      href: string,
      entityID?: string,
      horizontalSlidePosition?: number
    ) => {
      const payload: TappedCardGroup = {
        action: ActionType.tappedCardGroup,
        context_module: contextModule,
        context_screen_owner_type: OwnerType.home,
        destination_screen_owner_type: destinationOwnerType,
        destination_path: href,
        destination_screen_owner_id: entityID,
        horizontal_slide_position: horizontalSlidePosition,
        type: "thumbnail",
      } as TappedCardGroup
      trackEvent(payload)
    },

    tappedClearNotification: (
      contextModule: ContextModule,
      destinationPath: string,
      notificationID: string,
      notificationCategory: string
    ) => {
      const payload: TappedClearNotification = {
        action: ActionType.tappedClearNotification,
        context_module: contextModule,
        context_screen_owner_type: OwnerType.home,
        destination_path: destinationPath,
        notification_id: notificationID,
        notification_category: notificationCategory,
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

    tappedFairGroupViewAll: (
      contextModule: ContextModule,
      destinationOwnerType: ScreenOwnerType
    ) => {
      const payload: TappedFairGroup = {
        action: ActionType.tappedFairGroup,
        context_module: contextModule,
        context_screen_owner_type: OwnerType.home,
        destination_screen_owner_type: destinationOwnerType,
        type: "viewAll",
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

    tappedMarketingCollectionGroupViewAll: (
      contextModule: ContextModule,
      destinationOwnerType: ScreenOwnerType
    ) => {
      const payload: TappedCollectionGroup = {
        action: ActionType.tappedCollectionGroup,
        context_module: contextModule,
        context_screen_owner_type: OwnerType.home,
        destination_screen_owner_type: destinationOwnerType,
        type: "viewAll",
      }

      trackEvent(payload)
    },

    tappedNotification: (
      contextModule: ContextModule,
      destinationPath: string,
      notificationID: string,
      notificationCategory: string
    ) => {
      const payload: TappedNotification = {
        action: ActionType.tappedNotification,
        context_module: contextModule,
        context_screen_owner_type: OwnerType.home,
        destination_path: destinationPath,
        notification_id: notificationID,
        notification_category: notificationCategory,
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

    tappedViewingRoomGroupViewAll: (
      contextModule: ContextModule,
      destinationOwnerType: ScreenOwnerType
    ) => {
      const payload: TappedViewingRoomGroup = {
        action: ActionType.tappedViewingRoomGroup,
        context_module: contextModule,
        context_screen_owner_type: OwnerType.home,
        destination_screen_owner_type: destinationOwnerType,
        type: "viewAll",
      }

      trackEvent(payload)
    },

    viewedSection: (contextModule: ContextModule, index: number) => {
      const payload: RailViewed = {
        action: ActionType.railViewed,
        context_module: contextModule,
        context_screen: OwnerType.home,
        position_y: index,
      }

      trackEvent(payload)
    },
  }
}
