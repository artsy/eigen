import * as Analytics from "@artsy/cohesion"
import { ArtistRail_rail } from "__generated__/ArtistRail_rail.graphql"
import { ArtworkRail_rail } from "__generated__/ArtworkRail_rail.graphql"
import { Schema } from "lib/utils/track"

export enum HomeActionType {
  Header = "header",
  Thumbnail = "thumbnail",
  Follow = "follow",
}

export default class HomeAnalytics {
  static destinationScreen(rail: ArtworkRail_rail): Schema.PageNames | "untracked_page" {
    const key = rail.key
    switch (key) {
      case "followed_artists":
        return Schema.PageNames.WorksForYou
      case "saved_works":
        return Schema.PageNames.SavesAndFollows
      case "recommended_works":
        return Schema.PageNames.WorksForYou
      case "genes":
        return Schema.PageNames.GenePage
      default:
        return "untracked_page"
    }
  }

  static destinationScreenSlug(rail: ArtworkRail_rail): string | null | undefined {
    const context = rail.context
    const key = rail.key
    switch (key) {
      case "followed_artist":
      case "related_artists":
        return context?.artist?.href
      case "genes":
      case "current_fairs":
      case "live_auctions":
        return context?.href
      default:
        return null
    }
  }

  static artistRailContextModule(rail: ArtistRail_rail): Analytics.ContextModule | "untracked_rail" {
    const key = rail.key
    switch (key) {
      case "SUGGESTED":
        return Analytics.ContextModule.recommendedArtistsRail
      case "TRENDING":
        return Analytics.ContextModule.trendingArtistsRail
      case "POPULAR":
        return Analytics.ContextModule.popularArtistsRail
      default:
        return "untracked_rail"
    }
  }

  static artworkRailContextModule(rail: ArtworkRail_rail): Analytics.ContextModule | "untracked_rail" {
    const key = rail.key
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
      default:
        return "untracked_rail"
    }
  }
}
