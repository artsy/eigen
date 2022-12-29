import {
  ConsignmentSubmissionCategoryAggregation,
  ConsignmentSubmissionSource,
} from "__generated__/createConsignSubmissionMutation.graphql"
import {
  ConsignmentAttributionClass,
  ConsignmentSubmissionStateAggregation,
} from "__generated__/updateConsignSubmissionMutation.graphql"
import * as Yup from "yup"
import { limitedEditionValue } from "./utils/rarityOptions"

export interface Location {
  city: string
  state: string
  country: string
  countryCode: string
  zipCode?: string
}

export interface ArtworkDetailsFormModel {
  artist: string
  artistId: string
  attributionClass: ConsignmentAttributionClass | null
  category: Exclude<ConsignmentSubmissionCategoryAggregation, "%future added value"> | null
  depth: string
  dimensionsMetric: string
  editionNumber: string
  editionSizeFormatted: string
  height: string
  location: Location
  medium: string
  myCollectionArtworkID: string | null
  provenance: string
  source: ConsignmentSubmissionSource | null
  state?: ConsignmentSubmissionStateAggregation
  utmMedium?: string
  utmSource?: string
  utmTerm?: string
  width: string
  title: string
  year: string
}

export const artworkDetailsEmptyInitialValues: ArtworkDetailsFormModel = {
  artist: "",
  artistId: "",
  attributionClass: null,
  category: null,
  depth: "",
  dimensionsMetric: "in",
  editionNumber: "",
  editionSizeFormatted: "",
  height: "",
  location: {
    city: "",
    state: "",
    country: "",
    countryCode: "",
    zipCode: "",
  },
  medium: "",
  myCollectionArtworkID: null,
  provenance: "",
  source: null,
  state: "DRAFT",
  utmMedium: "",
  utmSource: "",
  utmTerm: "",
  width: "",
  title: "",
  year: "",
}

export const countriesRequirePostalCode = [
  "US",
  "AT", // Austria
  "BE", // Belgium
  "CA", // Canada
  "CN", // China
  "HR", // Croatia
  "CY", // Cyprus
  "DK", // Denmark
  "EE", // Estonia
  "FI", // Finland
  "FR", // France
  "DE", // Germany
  "GR", // Greece
  "HU", // Hungary
  "IS", // Iceland
  "IL", // Ireland
  "IT", // Italy
  "JP", // Japan
  "LV", // Latvia
  "MC", // Monaco
  "NO", // Norway
  "PL", // Poland
  "PT", // Portugal
  "ES", // Spain
  "SE", // Sweden
  "CH", // Switzerland
  "GB", // United Kingdom
  "NL", // Netherlands
]

export const artworkDetailsValidationSchema = Yup.object().shape({
  artist: Yup.string().trim(),
  artistId: Yup.string().required(
    "Please select an artist from the list. Artists who are not  listed cannot be submitted due to limited demand."
  ),
  title: Yup.string().required().trim(),
  year: Yup.string().required().trim(),
  medium: Yup.string().required().trim(),
  attributionClass: Yup.string().required(),
  editionNumber: Yup.string().when("attributionClass", {
    is: limitedEditionValue,
    then: Yup.string().required().trim(),
  }),
  editionSizeFormatted: Yup.string().when("attributionClass", {
    is: limitedEditionValue,
    then: Yup.string().required().trim(),
  }),
  dimensionsMetric: Yup.string().required(),
  height: Yup.string().required().trim(),
  width: Yup.string().required().trim(),
  depth: Yup.string().trim(),
  provenance: Yup.string().required().trim(),
  state: Yup.string(),
  utmMedium: Yup.string(),
  utmSource: Yup.string(),
  utmTerm: Yup.string(),
  location: Yup.object().shape({
    city: Yup.string().required().trim(),
    state: Yup.string(),
    country: Yup.string(),
  }),
})
