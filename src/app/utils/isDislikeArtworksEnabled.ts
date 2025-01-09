import { ContextModule } from "@artsy/cohesion"

/**
 * returns true if supressing artworks is enabled for the given contextModule
 * @param contextModule
 * @returns
 */
export const isDislikeArtworksEnabled = (contextModule: string | null | undefined) => {
  return contextModule === ContextModule.newWorksForYouRail
}
