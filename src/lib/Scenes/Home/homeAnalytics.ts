import * as Analytics from "@artsy/cohesion"
import { ActionType, OwnerType, TappedEntityGroup, tappedEntityGroup } from "@artsy/cohesion"
import * as Sentry from "@sentry/react-native"
import { ArtworkRail_rail } from "__generated__/ArtworkRail_rail.graphql"
import { Schema } from "lib/utils/track"

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
    return tappedEntityGroup({
      contextScreenOwnerType: Analytics.OwnerType.home,
      destinationScreenOwnerId: id,
      destinationScreenOwnerSlug: slug,
      destinationScreenOwnerType: Analytics.OwnerType.sale,
      contextModule: Analytics.ContextModule.auctionRail,
      moduleHeight: "double",
      type: "thumbnail",
    })
  }

  // Fair events

  static fairThumbnailTapEvent(fairID: string | "unspecified", fairSlug: string | "unspecified"): TappedEntityGroup {
    return tappedEntityGroup({
      contextScreenOwnerType: Analytics.OwnerType.home,
      destinationScreenOwnerId: fairID,
      destinationScreenOwnerSlug: fairSlug,
      destinationScreenOwnerType: Analytics.OwnerType.fair,
      contextModule: Analytics.ContextModule.fairRail,
      moduleHeight: "double",
      type: "thumbnail",
    })
  }

  // Artwork Events

  static artworkHeaderTapEvent(key: string | null): TappedEntityGroup | null {
    const contextModule = HomeAnalytics.artworkRailContextModule(key)
    const destinationScreen = HomeAnalytics.destinationScreen(key)
    if (contextModule && destinationScreen) {
      return tappedEntityGroup({
        contextScreenOwnerType: Analytics.OwnerType.home,
        destinationScreenOwnerType: destinationScreen as any,
        contextModule,
        moduleHeight: "double",
        type: "header",
      })
    } else {
      const eventData = {
        action: ActionType.tappedArtworkGroup,
        destinationScreenOwnerType: destinationScreen ?? "unspecified",
        contextModule: contextModule ?? "unspecified",
        moduleHeight: "double",
        eventType: "header",
      }
      HomeAnalytics.logUntrackedEvent(eventData)
      return null
    }
  }

  static artworkThumbnailTapEvent(contextModule: Analytics.ContextModule, slug: string): TappedEntityGroup {
    return tappedEntityGroup({
      contextScreenOwnerType: Analytics.OwnerType.home,
      destinationScreenOwnerType: Analytics.OwnerType.artwork,
      destinationScreenOwnerSlug: slug,
      contextModule,
      moduleHeight: "double",
      type: "thumbnail",
    })
  }

  static artworkThumbnailTapEventFromRail(key: string | null, slug: string): TappedEntityGroup | null {
    const contextModule = HomeAnalytics.artworkRailContextModule(key)
    if (contextModule) {
      return HomeAnalytics.artworkThumbnailTapEvent(contextModule, slug)
    } else {
      const eventData = {
        action: ActionType.tappedArtworkGroup,
        destinationScreenOwnerType: Analytics.OwnerType.artwork,
        slug,
        contextModule: contextModule ?? "unspecifed",
        moduleHeight: "double",
        eventType: "thumbnail",
      }
      HomeAnalytics.logUntrackedEvent(eventData)
      return null
    }
  }

  // Artist Events

  static artistThumbnailTapEvent(key: string | null, id: string, slug: string): TappedEntityGroup {
    return tappedEntityGroup({
      contextModule: HomeAnalytics.artistRailContextModule(key),
      contextScreenOwnerType: Analytics.OwnerType.home,
      destinationScreenOwnerType: Analytics.OwnerType.artist,
      destinationScreenOwnerId: id,
      destinationScreenOwnerSlug: slug,
      moduleHeight: "double",
      type: "thumbnail",
    })
  }

  // Helpers

  static destinationScreen(key: string | null): OwnerType | Schema.PageNames | null {
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
        return null
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

  static artistRailContextModule(key: string | null): Analytics.ContextModule {
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

  static artworkRailContextModule(key: string | null): Analytics.ContextModule | undefined {
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

  // Error Reporting

  static logUntrackedEvent(eventData: any) {
    if (!__DEV__) {
      Sentry.withScope(scope => {
        scope.setExtra("eventData", eventData)
        Sentry.captureMessage("Untracked home rail")
      })
    }
  }
}
