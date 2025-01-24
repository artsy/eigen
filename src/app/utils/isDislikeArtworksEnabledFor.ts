import { ContextModule } from "@artsy/cohesion"

const ENABLED_CONTEXT_MODULES = [
  ContextModule.newWorksForYouRail,
  ContextModule.artworkRecommendationsRail,
  ContextModule.lotsForYouRail,
  ContextModule.newWorksByGalleriesYouFollowRail,
]

/**
 * returns true if hiding disliked artworks is enabled for the given context module
 */
export const isDislikeArtworksEnabledFor = (contextModule: string | null | undefined) => {
  return ENABLED_CONTEXT_MODULES.includes(contextModule as ContextModule)
}
