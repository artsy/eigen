import * as TrackingSchema from "@artsy/cohesion"
import { ArtworkRail_rail } from "__generated__/ArtworkRail_rail.graphql"
import { Schema } from "lib/utils/track"

export function railContextModule(rail: ArtworkRail_rail): TrackingSchema.ContextModule | "untracked_rail" {
  const key = rail.key
  switch (key) {
    case "followed_artists":
      return TrackingSchema.ContextModule.newWorksByArtistsYouFollowRail
    case "recently_viewed_works":
      return TrackingSchema.ContextModule.recentlyViewedRail
    case "saved_works":
      return TrackingSchema.ContextModule.recentlySavedRail
    case "similar_to_saved_works":
      return TrackingSchema.ContextModule.similarToWorksYouSavedRail
    case "similar_to_recently_viewed":
      return TrackingSchema.ContextModule.similarToWorksYouViewedRail
    case "recommended_works":
      return TrackingSchema.ContextModule.recommendedWorksForYouRail
    case "genes":
      return TrackingSchema.ContextModule.categoryRail
    default:
      return "untracked_rail"
  }
}

export function destinationScreen(rail: ArtworkRail_rail): Schema.PageNames | "untracked_page" {
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
