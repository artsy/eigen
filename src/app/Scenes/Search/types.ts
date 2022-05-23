export interface AlgoliaSearchResult {
  href: string
  image_url: string
  name: string
  objectID: string
  slug: string
  __position: number
  __queryID: string
}

export type PillEntityType = "algolia" | "elastic"

export interface PillType {
  indexName?: string
  displayName: string
  disabled?: boolean
  type: PillEntityType
  key: AlgoliaIndexKey | string
}

export enum AlgoliaIndexKey {
  Artist = "artist",
  Article = "article",
  Auction = "sale",
  ArtistSeries = "artist_series",
  Collection = "marketing_collection",
  Fair = "fair",
  Show = "partner_show",
  Gallery = "partner_gallery",
}
