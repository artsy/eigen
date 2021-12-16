import { FilterParamName } from "../ArtworkFilterHelpers"
import { IS_USA } from "../Filters/helpers"

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
  "dimensionRange", // keep for backward compatibility (replaced with sizes)
  "height",
  "width",
  "sizes",
]

export const FALLBACK_SIZE_OPTIONS = IS_USA
  ? [
      { displayText: `Small (under 16in)`, oldParamValue: "*-16.0", newParamValue: "SMALL" },
      { displayText: `Medium (16in – 40in)`, oldParamValue: "16.0-40.0", newParamValue: "MEDIUM" },
      { displayText: `Large (over 40in)`, oldParamValue: "40.0-*", newParamValue: "LARGE" },
    ]
  : [
      { displayText: `Small (under 40cm)`, oldParamValue: "*-16.0", newParamValue: "SMALL" },
      { displayText: `Medium (40cm – 100cm)`, oldParamValue: "16.0-40.0", newParamValue: "MEDIUM" },
      { displayText: `Large (over 100cm)`, oldParamValue: "40.0-*", newParamValue: "LARGE" },
    ]
