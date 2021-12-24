import { AlgoliaIndiceKey } from "./types"

export const INDEXES_WITH_AN_ARTICLE = ["Artist", "Auction", "Artist Series", "Article"]
export const ALLOWED_ALGOLIA_KEYS = [
  AlgoliaIndiceKey.Artist,
  AlgoliaIndiceKey.Article,
  AlgoliaIndiceKey.Auction,
  AlgoliaIndiceKey.ArtistSeries,
  AlgoliaIndiceKey.Collection,
  AlgoliaIndiceKey.Fair,
  AlgoliaIndiceKey.Show,
  AlgoliaIndiceKey.Gallery,
]
