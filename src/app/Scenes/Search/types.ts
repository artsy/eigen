import { ContextModule } from "@artsy/cohesion"

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

export interface ElasticSearchResultInterface {
  __typename: string
  displayLabel: string | null
  href: string | null
  imageUrl: string | null
  internalID?: string
  slug?: string
}

export interface TappedSearchResultData {
  query: string
  type: string
  position: number
  contextModule: ContextModule
  slug: string
  objectTab?: string
}
