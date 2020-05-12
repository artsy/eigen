import * as Analytics from "@artsy/cohesion"
import {
  ActionType,
  ContextModule,
  EntityModuleHeight,
  EntityModuleType,
  OwnerType,
  TappedEntityGroup,
} from "@artsy/cohesion"
import { ArtworkRail_rail } from "__generated__/ArtworkRail_rail.graphql"
import { Schema } from "lib/utils/track"

type HomeActionType =
  | Analytics.ActionType.tappedArtistGroup
  | Analytics.ActionType.tappedArtworkGroup
  | Analytics.ActionType.tappedAuctionGroup
  | Analytics.ActionType.tappedCollectionGroup
  | Analytics.ActionType.tappedExploreGroup
  | Analytics.ActionType.tappedFairGroup

interface HomeEventData {
  id?: string
  slug?: string
  action: HomeActionType
  moduleHeight: EntityModuleHeight
  destinationScreenOwnerType: any
  contextModule: ContextModule
  eventType: EntityModuleType
}

export default class HomeAnalytics {
  // Auction events

  static auctionHeaderTapEvent() {
    const auctionHeaderTapEvent = {
      action: Analytics.ActionType.tappedAuctionGroup,
      context_module: Analytics.ContextModule.auctionRail,
      context_screen_owner_type: Analytics.OwnerType.home,
      destination_screen_owner_type: Schema.PageNames.Auctions, // TODO: Add this to cohesion so we can get some type checks here
      module_height: "double",
      type: "header",
    }
    return auctionHeaderTapEvent
  }

  static auctionThumbnailTapEvent(id: string | "unspecified", slug: string | "unspecified"): TappedEntityGroup {
    const auctionEventData: HomeEventData = {
      action: ActionType.tappedAuctionGroup,
      id,
      slug,
      moduleHeight: "double",
      destinationScreenOwnerType: Analytics.OwnerType.sale,
      contextModule: Analytics.ContextModule.auctionRail,
      eventType: "thumbnail",
    }
    return HomeAnalytics.tapEvent(auctionEventData)
  }

  // Fair events

  static fairThumbnailTapEvent(fairID: string | "unspecified", fairSlug: string | "unspecified"): TappedEntityGroup {
    const fairEventData: HomeEventData = {
      action: ActionType.tappedFairGroup,
      id: fairID,
      slug: fairSlug,
      moduleHeight: "double",
      destinationScreenOwnerType: Analytics.OwnerType.fair,
      contextModule: Analytics.ContextModule.fairRail,
      eventType: "thumbnail",
    }
    return HomeAnalytics.tapEvent(fairEventData)
  }

  // Artwork Events

  static artworkHeaderTapEvent(key: string): TappedEntityGroup | null {
    const contextModule = HomeAnalytics.artworkRailContextModule(key)
    if (contextModule) {
      const artworkHeaderEventData: HomeEventData = {
        action: ActionType.tappedArtworkGroup,
        destinationScreenOwnerType: HomeAnalytics.destinationScreen(key),
        contextModule,
        moduleHeight: "double",
        eventType: "header",
      }
      return HomeAnalytics.tapEvent(artworkHeaderEventData)
    } else {
      return null
      // TODO: What to do if key is undefined or contextModule is undefined
      // 1: Should we have a standard way of tracking untracked events so we can flag and fix?
      // In this case might mean adding a key to metaphysics or adding an additional case in the switch
      // statement, easy to see this scenario happening as more home modules are added
      // 2: Can we fix this with more strict typing in Metaphysics? Can key returned for rails be an
      // either type and then typescript can guarantee switch is exhaustive?
    }
  }

  static artworkThumbnailTapEvent(contextModule: Analytics.ContextModule, slug: string): TappedEntityGroup {
    const artworkThumbnailEventData: HomeEventData = {
      action: ActionType.tappedArtworkGroup,
      destinationScreenOwnerType: Analytics.OwnerType.artwork,
      slug,
      contextModule,
      moduleHeight: "double",
      eventType: "thumbnail",
    }
    return HomeAnalytics.tapEvent(artworkThumbnailEventData)
  }

  static artworkThumbnailTapEventFromRail(key: string | undefined, slug: string): TappedEntityGroup | null {
    const contextModule = HomeAnalytics.artworkRailContextModule(key)
    if (contextModule) {
      return HomeAnalytics.artworkThumbnailTapEvent(contextModule, slug)
    } else {
      return null // TODO: Same question as above
    }
  }

  // Artist Events

  static artistThumbnailTapEvent(key: string, id: string, slug: string): TappedEntityGroup {
    const artistThumbnailTapEvent: TappedEntityGroup = {
      action: ActionType.tappedArtistGroup,
      context_module: HomeAnalytics.artistRailContextModule(key),
      context_screen_owner_type: Analytics.OwnerType.home,
      destination_screen_owner_type: Analytics.OwnerType.artist,
      destination_screen_owner_id: id,
      destination_screen_owner_slug: slug,
      module_height: "double",
      type: "thumbnail",
    }
    return artistThumbnailTapEvent
  }

  // General Events and Helpers

  static tapEvent({
    action,
    id,
    slug,
    moduleHeight,
    destinationScreenOwnerType,
    contextModule,
    eventType,
  }: HomeEventData): TappedEntityGroup {
    return {
      action,
      context_module: contextModule,
      context_screen_owner_type: Analytics.OwnerType.home,
      destination_screen_owner_type: destinationScreenOwnerType,
      destination_screen_owner_id: id,
      destination_screen_owner_slug: slug,
      module_height: moduleHeight,
      type: eventType,
    }
  }

  static destinationScreen(key: string): OwnerType | Schema.PageNames | "unspecified" {
    switch (key) {
      case "followed_artists":
        return OwnerType.worksForYou
      case "saved_works":
        return OwnerType.savesAndFollows
      case "recommended_works":
        return OwnerType.worksForYou
      case "genes":
        return Schema.PageNames.GenePage // TODO: Add this to cohesion
      default:
        return "unspecified"
    }
  }

  static destinationScreenSlug(rail: ArtworkRail_rail): string | "unspecified" {
    const context = rail.context
    const key = rail.key
    switch (key) {
      case "followed_artist":
      case "related_artists":
        return context?.artist?.href ?? "unspecified"
      case "genes":
      case "current_fairs":
      case "live_auctions":
        return context?.href ?? "unspecified"
      default:
        return "unspecified"
    }
  }

  static artistRailContextModule(key: string): Analytics.ContextModule {
    switch (key) {
      case "SUGGESTED":
        return Analytics.ContextModule.recommendedArtistsRail
      case "TRENDING":
        return Analytics.ContextModule.trendingArtistsRail
      case "POPULAR":
        return Analytics.ContextModule.popularArtistsRail
      default:
        return Analytics.ContextModule.recommendedArtistsRail
    }
  }

  static artworkRailContextModule(key: string | undefined): Analytics.ContextModule | undefined {
    switch (key) {
      case "followed_artists":
        return Analytics.ContextModule.newWorksByArtistsYouFollowRail
      case "recently_viewed_works":
        return Analytics.ContextModule.recentlyViewedRail
      case "saved_works":
        return Analytics.ContextModule.recentlySavedRail
      case "similar_to_saved_works":
        return Analytics.ContextModule.similarToWorksYouSavedRail
      case "similar_to_recently_viewed":
        return Analytics.ContextModule.similarToWorksYouViewedRail
      case "recommended_works":
        return Analytics.ContextModule.recommendedWorksForYouRail
      case "genes":
        return Analytics.ContextModule.categoryRail
    }
  }
}
