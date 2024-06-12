import {
  ConsignmentSubmissionCategoryAggregation,
  ConsignmentSubmissionSource,
} from "__generated__/createConsignSubmissionMutation.graphql"
import {
  ConsignmentAttributionClass,
  ConsignmentSubmissionStateAggregation,
} from "__generated__/updateConsignSubmissionMutation.graphql"
import { unsafe_getFeatureFlag } from "app/store/GlobalStore"
import * as Yup from "yup"
import { limitedEditionValue } from "./utils/rarityOptions"

export interface Location {
  city: string
  state: string
  country: string
  countryCode: string
  zipCode?: string
}

/**
 * @deprecated
 * Please use ArtworkDetailsFormModel from app/Scenes/SellWithArtsy/ArtworkForm/Utils/validation.ts
 */
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
  signature?: boolean | null | undefined
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

export const artworkDetailsValidationSchema = Yup.object().shape({
  // Required fields
  artist: Yup.string().trim(),
  artistId: Yup.string().required(
    "Please select an artist from the list. Artists who are not  listed cannot be submitted due to limited demand."
  ),
  title: Yup.string().required("Title is a required field").trim(),
  category: Yup.string().required("Please choose a medium from the list."),

  // Optional fields
  medium: Yup.string().trim(),
  year: Yup.string().trim(),
  attributionClass: Yup.string().nullable(),
  editionNumber: Yup.string().when("attributionClass", {
    is: limitedEditionValue,
    then: Yup.string().required().trim(),
  }),
  editionSizeFormatted: Yup.string().when("attributionClass", {
    is: limitedEditionValue,
    then: Yup.string().required().trim(),
  }),
  dimensionsMetric:
    !__TEST__ && unsafe_getFeatureFlag("ARSWAMakeAllDimensionsOptional")
      ? Yup.string()
      : Yup.string().required(),
  height:
    !__TEST__ && unsafe_getFeatureFlag("ARSWAMakeAllDimensionsOptional")
      ? Yup.string().trim()
      : Yup.string().required().trim(),
  width:
    !__TEST__ && unsafe_getFeatureFlag("ARSWAMakeAllDimensionsOptional")
      ? Yup.string().trim()
      : Yup.string().required().trim(),
  depth: Yup.string().trim(),
  provenance: Yup.string().trim(),
  state: Yup.string(),
  utmMedium: Yup.string(),
  utmSource: Yup.string(),
  utmTerm: Yup.string(),
  location: Yup.object().shape({
    city: Yup.string().trim(),
    state: Yup.string(),
    country: Yup.string(),
  }),
})

export interface ContactInformationFormModel {
  userName: string
  userEmail: string
  userPhone: string | undefined
}

export const contactInformationValidationSchema = Yup.object().shape({
  userName: Yup.string()
    .required()
    .test(
      "userName",
      "Please enter your full name.",
      (name) => typeof name === "string" && name.length > 1
    ),
  userEmail: Yup.string().required().email("Please enter a valid email address."),
})
