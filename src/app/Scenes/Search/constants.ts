import { AlgoliaIndexKey, PillType } from "./types"

export const ALGOLIA_INDICES_WITH_AN_ARTICLE = [
  AlgoliaIndexKey.Artist,
  AlgoliaIndexKey.Auction,
  AlgoliaIndexKey.ArtistSeries,
  AlgoliaIndexKey.Article,
]
export const ALLOWED_ALGOLIA_KEYS = [
  AlgoliaIndexKey.Artist,
  AlgoliaIndexKey.Article,
  AlgoliaIndexKey.Auction,
  AlgoliaIndexKey.ArtistSeries,
  AlgoliaIndexKey.Collection,
  AlgoliaIndexKey.Fair,
  AlgoliaIndexKey.Show,
  AlgoliaIndexKey.Gallery,
]

export const TOP_PILL: PillType = {
  displayName: "Top",
  type: "elastic",
  key: "top",
}

export const ARTWORKS_PILL: PillType = {
  displayName: "Artworks",
  type: "elastic",
  key: "artworks",
}

export const DEFAULT_PILLS: PillType[] = [TOP_PILL, ARTWORKS_PILL]
