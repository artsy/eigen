export interface AlgoliaSearchResult {
  href: string
  image_url: string
  name: string
  objectID: string
  slug: string
  __position: number
  __queryID: string
}

export type PillEntityType = "algolia" | "elastic" | "global"

export interface PillType {
  name: string
  displayName: string
  type: PillEntityType
}
