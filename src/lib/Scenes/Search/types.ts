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
  disabled: boolean
  type: PillEntityType
}
