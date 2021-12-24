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
  name: string
  displayName: string
  disabled?: boolean
  type: PillEntityType
}

export enum AlgoliaIndiceKey {
  Artist = "artist",
  Article = "article",
  Auction = "sale",
  ArtistSeries = "artist_series",
  Collection = "kaws_collection",
  Fair = "fair",
  Show = "partner_show",
  Gallery = "partner_gallery",
}
