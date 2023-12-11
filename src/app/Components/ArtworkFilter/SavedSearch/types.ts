import { ScreenOwnerType } from "@artsy/cohesion"
import { ArtworkSizes } from "__generated__/SavedSearchSuggestedFiltersFetchQuery.graphql"

export enum SearchCriteria {
  acquireable = "acquireable",
  additionalGeneIDs = "additionalGeneIDs",
  artistID = "artistID",
  artistIDs = "artistIDs",
  artistSeriesIDs = "artistSeriesIDs",
  atAuction = "atAuction",
  attributionClass = "attributionClass",
  colors = "colors",
  dimensionRange = "dimensionRange",
  height = "height",
  inquireableOnly = "inquireableOnly",
  locationCities = "locationCities",
  majorPeriods = "majorPeriods",
  materialsTerms = "materialsTerms",
  offerable = "offerable",
  partnerIDs = "partnerIDs",
  priceRange = "priceRange",
  sizes = "sizes",
  width = "width",
}

export interface SearchCriteriaAttributes {
  [SearchCriteria.acquireable]?: boolean | null
  [SearchCriteria.additionalGeneIDs]?: string[] | null
  [SearchCriteria.artistID]?: string | null
  [SearchCriteria.artistIDs]?: string[] | null
  [SearchCriteria.artistSeriesIDs]?: string[] | null
  [SearchCriteria.atAuction]?: boolean | null
  [SearchCriteria.attributionClass]?: string[] | null
  [SearchCriteria.colors]?: string[] | null
  [SearchCriteria.dimensionRange]?: string | null
  [SearchCriteria.height]?: string | null
  [SearchCriteria.inquireableOnly]?: boolean | null
  [SearchCriteria.locationCities]?: string[] | null
  [SearchCriteria.majorPeriods]?: string[] | null
  [SearchCriteria.materialsTerms]?: string[] | null
  [SearchCriteria.offerable]?: boolean | null
  [SearchCriteria.partnerIDs]?: string[] | null
  [SearchCriteria.priceRange]?: string | null
  [SearchCriteria.sizes]?: ArtworkSizes[] | null
  [SearchCriteria.width]?: string | null
}

export interface SavedSearchEntityArtist {
  id: string
  name: string
}

export interface SavedSearchEntityOwner {
  type: ScreenOwnerType
  slug: string
  id: string
}

export interface SavedSearchEntity {
  artists: SavedSearchEntityArtist[]
  owner: SavedSearchEntityOwner
}
