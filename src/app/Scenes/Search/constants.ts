import { SearchEntity } from "__generated__/ElasticSearchResultsQuery.graphql"
import { AlgoliaIndexKey, PillType } from "./types"

export const SEARCH_THROTTLE_INTERVAL = 500

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
  key: "artwork",
}

export const ARTIST_PILL: PillType = {
  displayName: "Artist",
  type: "elastic",
  key: "artist",
}

export const ARTICLE_PILL: PillType = {
  displayName: "Article",
  type: "elastic",
  key: "article",
}

export const AUCTION_PILL: PillType = {
  displayName: "Auction",
  type: "elastic",
  key: "sale",
}

export const ARTIST_SERIES_PILL: PillType = {
  displayName: "Artist Series",
  type: "elastic",
  key: "artist_series",
}

export const COLLECTION_PILL: PillType = {
  displayName: "Collection",
  type: "elastic",
  key: "marketing_collection",
}

export const FAIR_PILL: PillType = {
  displayName: "Fair",
  type: "elastic",
  key: "fair",
}

export const SHOW_PILL: PillType = {
  displayName: "Show",
  type: "elastic",
  key: "partner_show",
}

export const GALLERY_PILL: PillType = {
  displayName: "Gallery",
  type: "elastic",
  key: "PartnerGallery",
}

export const ES_ONLY_PILLS: PillType[] = [
  TOP_PILL,
  ARTWORKS_PILL,
  ARTIST_PILL,
  ARTICLE_PILL,
  AUCTION_PILL,
  ARTIST_SERIES_PILL,
  COLLECTION_PILL,
  FAIR_PILL,
  SHOW_PILL,
  GALLERY_PILL,
]

export const DEFAULT_PILLS: PillType[] = [TOP_PILL, ARTWORKS_PILL]

interface SearchEntityMap {
  [key: string]: SearchEntity
}

export const ELASTIC_PILL_KEY_TO_SEARCH_ENTITY: SearchEntityMap = {
  artwork: "ARTWORK",
  artist: "ARTIST",
  article: "ARTICLE",
  sale: "SALE",
  artist_series: "ARTIST_SERIES",
  marketing_collection: "COLLECTION",
  fair: "FAIR",
  partner_show: "SHOW",
  PartnerGallery: "GALLERY",
}
