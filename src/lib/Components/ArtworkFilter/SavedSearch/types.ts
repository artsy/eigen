export enum SearchCriteria {
  artistID = "artistID",
  artistIDs = "artistIDs",
  locationCities = "locationCities",
  colors = "colors",
  partnerIDs = "partnerIDs",
  additionalGeneIDs = "additionalGeneIDs",
  attributionClass = "attributionClass",
  majorPeriods = "majorPeriods",
  acquireable = "acquireable",
  atAuction = "atAuction",
  inquireableOnly = "inquireableOnly",
  offerable = "offerable",
  dimensionRange = "dimensionRange",
  sizes = "sizes",
  height = "height",
  width = "width",
  materialsTerms = "materialsTerms",
  priceRange = "priceRange",
}

export interface SearchCriteriaAttributes {
  [SearchCriteria.artistID]?: string | null
  [SearchCriteria.artistIDs]?: string[] | null
  [SearchCriteria.locationCities]?: string[] | null
  [SearchCriteria.colors]?: string[] | null
  [SearchCriteria.partnerIDs]?: string[] | null
  [SearchCriteria.additionalGeneIDs]?: string[] | null
  [SearchCriteria.attributionClass]?: string[] | null
  [SearchCriteria.majorPeriods]?: string[] | null
  [SearchCriteria.acquireable]?: boolean | null
  [SearchCriteria.atAuction]?: boolean | null
  [SearchCriteria.inquireableOnly]?: boolean | null
  [SearchCriteria.offerable]?: boolean | null
  [SearchCriteria.dimensionRange]?: string | null
  [SearchCriteria.sizes]?: string[] | null
  [SearchCriteria.height]?: string | null
  [SearchCriteria.width]?: string | null
  [SearchCriteria.materialsTerms]?: string[] | null
  [SearchCriteria.priceRange]?: string | null
}
