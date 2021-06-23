export interface SearchCriteriaAttributes {
  artistID?: string | null
  locationCities?: string[] | null
  colors?: string[] | null
  partnerIDs?: string[] | null
  additionalGeneIDs?: string[] | null
  attributionClass?: string[] | null
  majorPeriods?: string[] | null
  acquireable?: boolean | null
  atAuction?: boolean | null
  inquireableOnly?: boolean | null
  offerable?: boolean | null
  dimensionRange?: string | null
  height?: string | null
  width?: string | null
  materialsTerms?: string[] | null
  priceRange?: string | null
}

export type SearchCriteriaAttributeKeys = keyof SearchCriteriaAttributes
