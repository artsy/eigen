import {
  ActionType,
  BannerViewed,
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
  TappedChangePaymentMethod,
  TappedClearTask,
  TappedCollectionGroup,
  TappedFairGroup,
  TappedHeroUnitGroup,
  TappedNavigationPillsGroup,
  TappedNotificationsBell,
  TappedShowGroup,
  TappedShowMore,
  TappedTaskGroup,
  TappedViewingRoomGroup,
} from "@artsy/cohesion"
import { PaymentFailureBanner_Fragment$data } from "__generated__/PaymentFailureBanner_Fragment.graphql"
import { getArtworkSignalTrackingFields } from "app/utils/getArtworkSignalTrackingFields"
import { ExtractNodeType } from "app/utils/relayHelpers"
import { useTracking } from "react-tracking"

export const useHomeViewTracking = () => {
  const { trackEvent } = useTracking()

  return {
    screen: (ownerType: ScreenOwnerType) => {
      const payload: Screen = {
        action: ActionType.screen,
        context_screen_owner_type: ownerType,
      }

      trackEvent(payload)
    },

    bannerViewed: (
      orders: Array<ExtractNodeType<PaymentFailureBanner_Fragment$data["commerceMyOrders"]>>
    ) => {
      const payload: BannerViewed = {
        action: ActionType.bannerViewed,
        context_screen: OwnerType.home,
        context_module: ContextModule.paymentFailed,
        item_type: orders.length === 1 ? "order" : "orders",
        item_id: orders.length === 1 ? orders[0].internalID : "",
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
        ...getArtworkSignalTrackingFields(artworkCollectorSignals),
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
      entityID: string,
      entityType: ScreenOwnerType,
      href: string,
      contextModule: ContextModule,
      index: number
    ) => {
      const payload: TappedCardGroup = {
        action: ActionType.tappedCardGroup,
        context_module: contextModule,
        context_screen_owner_type: OwnerType.home,
        destination_screen_owner_type: entityType,
        destination_path: href,
        destination_screen_owner_id: entityID,
        horizontal_slide_position: index,
        type: "thumbnail",
      } as TappedCardGroup
      trackEvent(payload)
    },

    tappedClearTask: (
      contextModule: ContextModule,
      destinationPath: string,
      taskID: string,
      taskType: string
    ) => {
      const payload: TappedClearTask = {
        action: ActionType.tappedClearTask,
        context_module: contextModule,
        context_screen_owner_type: OwnerType.home,
        destination_path: destinationPath,
        task_id: taskID,
        task_type: taskType,
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

    tappedNavigationPillsGroup: ({
      title,
      href,
      index,
    }: {
      title: string
      href: string
      index: number
    }) => {
      const payload: TappedNavigationPillsGroup = {
        action: ActionType.tappedNavigationPillsGroup,
        context_module: ContextModule.quickLinks,
        context_screen_owner_type: OwnerType.home,
        title,
        href,
        horizontal_slide_position: index,
        type: "pill",
      }

      trackEvent(payload)
    },

    tappedTaskGroup: (
      contextModule: ContextModule,
      destinationPath: string,
      taskID: string,
      taskType: string
    ) => {
      const payload: TappedTaskGroup = {
        action: ActionType.tappedTaskGroup,
        context_module: contextModule,
        context_screen_owner_type: OwnerType.home,
        destination_path: destinationPath,
        task_id: taskID,
        task_type: taskType,
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

    tappedChangePaymentMethod: (
      orders: Array<ExtractNodeType<PaymentFailureBanner_Fragment$data["commerceMyOrders"]>>
    ) => {
      const payload: TappedChangePaymentMethod = {
        action: ActionType.tappedChangePaymentMethod,
        context_screen: OwnerType.home,
        context_module: ContextModule.paymentFailed,
        item_type: orders.length === 1 ? "order" : "orders",
        item_id: orders.length === 1 ? orders[0].internalID : "",
      }

      trackEvent(payload)
    },
  }
}
