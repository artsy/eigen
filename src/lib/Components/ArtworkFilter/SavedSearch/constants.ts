import { FilterParamName } from "../ArtworkFilterHelpers"

export const shouldExtractValueNamesFromAggregation = [
  FilterParamName.locationCities,
  FilterParamName.materialsTerms,
  FilterParamName.additionalGeneIDs,
  FilterParamName.partnerIDs,
]

export const allowedSearchCriteriaKeys = [
  "artistID",
  "locationCities",
  "colors",
  "partnerIDs",
  "additionalGeneIDs",
  "attributionClass",
  "majorPeriods",
  "acquireable",
  "atAuction",
  "inquireableOnly",
  "offerable",
  "materialsTerms",
  "priceRange",
  "dimensionRange",
  "height",
  "width",
]
