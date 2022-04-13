import { ConsignmentSubmissionSource } from "__generated__/createConsignSubmissionMutation.graphql"
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
  title: string
  year: string
  medium: string
  attributionClass: ConsignmentAttributionClass | null
  editionNumber: string
  editionSizeFormatted: string
  dimensionsMetric: string
  height: string
  width: string
  depth: string
  provenance: string
  state: ConsignmentSubmissionStateAggregation
  utmMedium: string | undefined
  utmSource: string | undefined
  utmTerm: string | undefined
  location: Location
  source: ConsignmentSubmissionSource | null
  myCollectionArtworkID: string | null
}

export const artworkDetailsEmptyInitialValues: ArtworkDetailsFormModel = {
  artist: "",
  artistId: "",
  title: "",
  year: "",
  medium: "",
  attributionClass: null,
  editionNumber: "",
  editionSizeFormatted: "",
  dimensionsMetric: "in",
  height: "",
  width: "",
  depth: "",
  provenance: "",
  state: "DRAFT",
  utmMedium: "",
  utmSource: "",
  utmTerm: "",
  location: {
    city: "",
    state: "",
    country: "",
    countryCode: "",
    zipCode: "",
  },
  source: null,
  myCollectionArtworkID: null,
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

const usPostalCodeErrorMessage = "Please enter a 5-digit US zip code."

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
    zipCode: Yup.string().when("countryCode", {
      is: (countryCode) => countryCode?.toUpperCase() === "US",
      then: Yup.string()
        .required(usPostalCodeErrorMessage)
        .matches(/^[0-9]{5}$/, usPostalCodeErrorMessage)
        .trim(),
      otherwise: Yup.string().when("countryCode", {
        is: (countryCode) => countriesRequirePostalCode.includes(countryCode?.toUpperCase()),
        then: Yup.string().required("Please enter a valid zip/postal code for your region").trim(),
      }),
    }),
  }),
})
