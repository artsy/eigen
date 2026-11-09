import { ContextModule, ScreenOwnerType, TappedSearchByImage } from "@artsy/cohesion"
import { tappedSearchByImage } from "app/Components/SearchByPhotoButton/tracks"

const FIND_SIMILAR_TRACKING_TYPE = "find_similar"

/** Tap on a "Find similar" entry point; reuses `tappedSearchByImage` with a dedicated `type`. */
export const tappedFindSimilarArtworks = ({
  contextModule,
  contextScreenOwnerType,
}: {
  contextModule: ContextModule
  contextScreenOwnerType: ScreenOwnerType
}): TappedSearchByImage =>
  tappedSearchByImage({ contextModule, contextScreenOwnerType, type: FIND_SIMILAR_TRACKING_TYPE })

export const findSimilarArtworksPath = (artworkSlug: string) => `/artwork/${artworkSlug}/similar`
