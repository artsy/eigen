import {
  ActionType,
  ContextModule,
  ItemViewed,
  OwnerType,
  RailViewed,
  Screen,
  TappedArtworkGroup,
  TappedEntityDestinationType,
  TappedEntityGroup,
  tappedEntityGroup,
} from "@artsy/cohesion"
import { ArtworkModuleRail_rail$data } from "__generated__/ArtworkModuleRail_rail.graphql"
import {
  CollectorSignals,
  getArtworkSignalTrackingFields,
} from "app/utils/getArtworkSignalTrackingFields"

type ValidHomeDestination =
  | OwnerType.auctions
  | OwnerType.collection
  | OwnerType.sale
  | OwnerType.fair
  | OwnerType.artwork
  | OwnerType.worksForYou
  | OwnerType.savesAndFollows
  | OwnerType.gene

export default class HomeAnalytics {
  static homeScreenViewed(): Screen {
    return {
      context_screen_owner_type: OwnerType.home,
      action: ActionType.screen,
    }
  }

  // Auction events

  static auctionHeaderTapEvent(): TappedEntityGroup {
    return tappedEntityGroup({
      contextModule: ContextModule.auctionRail,
      contextScreenOwnerType: OwnerType.home,
      destinationScreenOwnerType: OwnerType.auctions,
      moduleHeight: "double",
      type: "header",
    })
  }

  static auctionBrowseMoreTapEvent(): TappedEntityGroup {
    return tappedEntityGroup({
      contextModule: ContextModule.auctionRail,
      contextScreenOwnerType: OwnerType.home,
      destinationScreenOwnerType: OwnerType.auctions,
      moduleHeight: "double",
      type: "viewAll",
    })
  }

  static auctionThumbnailTapEvent(
    id?: string,
    slug?: string,
    horizontalSlidePosition?: number,
    contextModule?: ContextModule
  ): TappedEntityGroup {
    return tappedEntityGroup({
      contextScreenOwnerType: OwnerType.home,
      destinationScreenOwnerId: id,
      destinationScreenOwnerSlug: slug,
      destinationScreenOwnerType: OwnerType.sale,
      contextModule: contextModule || ContextModule.auctionRail,
      horizontalSlidePosition,
      moduleHeight: "double",
      type: "thumbnail",
    })
  }

  // Fair events

  static fairThumbnailTapEvent(
    fairID?: string,
    fairSlug?: string,
    index?: number,
    contextModule?: ContextModule
  ): TappedEntityGroup {
    return tappedEntityGroup({
      contextScreenOwnerType: OwnerType.home,
      destinationScreenOwnerId: fairID,
      destinationScreenOwnerSlug: fairSlug,
      destinationScreenOwnerType: OwnerType.fair,
      contextModule: contextModule || ContextModule.fairRail,
      horizontalSlidePosition: index,
      moduleHeight: "double",
      type: "thumbnail",
    })
  }

  // Activity events

  static activityHeaderTapEvent(): TappedEntityGroup {
    return tappedEntityGroup({
      contextModule: ContextModule.activityRail,
      contextScreenOwnerType: OwnerType.home,
      destinationScreenOwnerType: OwnerType.activities,
      type: "header",
    })
  }

  static activityViewAllTapEvent(): TappedEntityGroup {
    return tappedEntityGroup({
      contextModule: ContextModule.activityRail,
      contextScreenOwnerType: OwnerType.home,
      destinationScreenOwnerType: OwnerType.activities,
      type: "viewAll",
    })
  }

  static activityThumbnailTapEvent(
    index: number,
    destinationModule: string,
    contextModule?: ContextModule
  ): TappedEntityGroup {
    return {
      action: ActionType.tappedActivityGroup,
      context_module: contextModule || ContextModule.activityRail,
      context_screen_owner_type: OwnerType.home,
      destination_screen_owner_type: destinationModule.toLowerCase() as TappedEntityDestinationType,
      horizontal_slide_position: index,
      module_height: "single",
      type: "thumbnail",
    }
  }

  // Article events

  static articleThumbnailTapEvent(
    articleID?: string,
    articleSlug?: string,
    index?: number,
    contextModule?: ContextModule
  ): TappedEntityGroup {
    return tappedEntityGroup({
      contextScreenOwnerType: OwnerType.home,
      destinationScreenOwnerId: articleID,
      destinationScreenOwnerSlug: articleSlug,
      destinationScreenOwnerType: OwnerType.article,
      contextModule: contextModule || ContextModule.articleRail,
      horizontalSlidePosition: index,
      moduleHeight: "double",
      type: "thumbnail",
    })
  }

  static articlesHeaderTapEvent(): TappedEntityGroup {
    return tappedEntityGroup({
      contextModule: ContextModule.articleRail,
      contextScreenOwnerType: OwnerType.home,
      destinationScreenOwnerType: OwnerType.articles,
      moduleHeight: "double",
      type: "header",
    })
  }

  // Artwork Events

  static artworkShowMoreCardTapEvent(key: string | null): TappedEntityGroup | null {
    const contextModule = this.artworkRailContextModule(key)
    const destinationScreen = this.artworkHeaderDestinationScreen(key)

    if (contextModule && destinationScreen) {
      return tappedEntityGroup({
        contextScreenOwnerType: OwnerType.home,
        destinationScreenOwnerType: destinationScreen,
        contextModule,
        moduleHeight: "double",
        type: "viewAll",
      })
    } else {
      console.log("homeAnalytics.ts untracked header", key)
      return null
    }
  }

  static artworkHeaderTapEvent(key: string | null): TappedEntityGroup | null {
    const contextModule = this.artworkRailContextModule(key)
    const destinationScreen = this.artworkHeaderDestinationScreen(key)

    if (contextModule && destinationScreen) {
      return tappedEntityGroup({
        contextScreenOwnerType: OwnerType.home,
        destinationScreenOwnerType: destinationScreen,
        contextModule,
        moduleHeight: "double",
        type: "header",
      })
    } else {
      console.log("homeAnalytics.ts untracked header", key)
      return null
    }
  }

  static artworkThumbnailTapEvent(
    contextModule: ContextModule,
    slug: string,
    id: string,
    index?: number,
    moduleHeight?: "single" | "double",
    collectorSignals?: CollectorSignals
  ): TappedArtworkGroup {
    return {
      action: ActionType.tappedArtworkGroup,
      context_screen_owner_type: OwnerType.home,
      destination_screen_owner_type: OwnerType.artwork,
      destination_screen_owner_slug: slug,
      destination_screen_owner_id: id,
      context_module: contextModule,
      horizontal_slide_position: index,
      module_height: moduleHeight ?? "double",
      type: "thumbnail",
      ...getArtworkSignalTrackingFields(collectorSignals),
    }
  }

  static artworkThumbnailTapEventFromKey(
    key: string | null,
    slug: string,
    id: string,
    index?: number
  ): TappedEntityGroup | null {
    const contextModule = this.artworkRailContextModule(key)
    if (contextModule) {
      return this.artworkThumbnailTapEvent(contextModule, slug, id, index)
    } else {
      console.log("homeAnalytics.ts untracked rail", key)
      return null
    }
  }

  // Artist Events

  static artistThumbnailTapEvent(
    key: string | null,
    id: string,
    slug: string,
    index?: number,
    contextModule?: ContextModule
  ): TappedEntityGroup {
    return tappedEntityGroup({
      contextModule: contextModule || this.artistRailContextModule(key),
      contextScreenOwnerType: OwnerType.home,
      destinationScreenOwnerType: OwnerType.artist,
      destinationScreenOwnerId: id,
      destinationScreenOwnerSlug: slug,
      horizontalSlidePosition: index,
      moduleHeight: "double",
      type: "thumbnail",
    })
  }

  // Collections events

  static collectionThumbnailTapEvent(
    slug?: string,
    index?: number,
    contextModule?: ContextModule
  ): TappedEntityGroup {
    return tappedEntityGroup({
      contextModule: contextModule || ContextModule.collectionRail,
      contextScreenOwnerType: OwnerType.home,
      destinationScreenOwnerType: OwnerType.collection,
      destinationScreenOwnerSlug: slug,
      horizontalSlidePosition: index,
      moduleHeight: "double",
      type: "thumbnail",
    })
  }

  // Helpers

  static artworkHeaderDestinationScreen(key: string | null): ValidHomeDestination | null {
    switch (key) {
      case "followed_artists":
        return OwnerType.worksForYou
      case "saved_works":
        return OwnerType.savesAndFollows
      case "recommended_works":
        return OwnerType.worksForYou
      case "genes":
        return OwnerType.gene
      case "curators-picks-emerging":
        return OwnerType.collection
      default:
        return null
    }
  }

  static destinationScreenSlug(rail: ArtworkModuleRail_rail$data): string | undefined {
    const context = rail.context
    const key = rail.key
    switch (key) {
      case "followed_artist":
      case "related_artists":
        return context?.artist?.href ?? undefined
      case "genes":
      case "current_fairs":
      case "live_auctions":
        return context?.href ?? undefined
      default:
        return undefined
    }
  }

  static artistRailContextModule(key: string | null): ContextModule {
    switch (key) {
      case "SUGGESTED":
        return ContextModule.recommendedArtistsRail
      case "CURATED_TRENDING":
        return ContextModule.curatedTrendingArtistsRail
      case "TRENDING":
        return ContextModule.trendingArtistsRail
      case "POPULAR":
        return ContextModule.popularArtistsRail
      default:
        return ContextModule.recommendedArtistsRail
    }
  }

  static artworkRailContextModule(key: string | null): ContextModule | undefined {
    switch (key) {
      case "followed_artists":
        return ContextModule.newWorksByArtistsYouFollowRail
      case "followed_galleries":
        return ContextModule.newWorksByGalleriesYouFollowRail
      case "recently_viewed_works":
        return ContextModule.recentlyViewedRail
      case "saved_works":
        return ContextModule.recentlySavedRail
      case "similar_to_saved_works":
        return ContextModule.similarToWorksYouSavedRail
      case "similar_to_recently_viewed":
        return ContextModule.similarToWorksYouViewedRail
      case "recommended_works":
        return ContextModule.recommendedWorksForYouRail
      case "genes":
        return ContextModule.categoryRail
      case "curators-picks-emerging":
        return ContextModule.curatorsPicksEmergingRail
    }
  }

  static trackRailViewed({
    contextModule,
    positionY,
  }: {
    contextModule: ContextModule
    positionY: number
  }): RailViewed {
    return {
      action: ActionType.railViewed,
      context_module: contextModule,
      context_screen: OwnerType.home,
      position_y: positionY,
    }
  }

  static trackItemViewed({
    artworkId,
    contextModule,
    contextScreenOwnerType = OwnerType.home,
    position,
    type,
  }: {
    artworkId: string
    contextModule: ContextModule
    contextScreenOwnerType?: OwnerType
    position: number
    type: "artwork"
  }): ItemViewed {
    return {
      action: ActionType.itemViewed,
      context_module: contextModule,
      context_screen: contextScreenOwnerType,
      item_type: type,
      item_id: artworkId,
      position,
    }
  }
}
