import { IS_USA } from "../Filters/helpers"
import { SearchCriteria } from "./types"

export const shouldExtractValueNamesFromAggregation = [
  SearchCriteria.locationCities,
  SearchCriteria.materialsTerms,
  SearchCriteria.additionalGeneIDs,
  SearchCriteria.partnerIDs,
]

export const allowedSearchCriteriaKeys = [
  SearchCriteria.artistID,
  SearchCriteria.artistIDs,
  SearchCriteria.locationCities,
  SearchCriteria.colors,
  SearchCriteria.partnerIDs,
  SearchCriteria.additionalGeneIDs,
  SearchCriteria.attributionClass,
  SearchCriteria.majorPeriods,
  SearchCriteria.acquireable,
  SearchCriteria.atAuction,
  SearchCriteria.inquireableOnly,
  SearchCriteria.offerable,
  SearchCriteria.materialsTerms,
  SearchCriteria.priceRange,
  SearchCriteria.dimensionRange, // keep for backward compatibility (replaced with sizes)
  SearchCriteria.height,
  SearchCriteria.width,
  SearchCriteria.sizes,
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
