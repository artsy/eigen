import { ContextModule } from "@artsy/cohesion"

export interface PillType {
  indexName?: string
  displayName: string
  disabled?: boolean
  key: string
}

export interface SearchResultInterface {
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
