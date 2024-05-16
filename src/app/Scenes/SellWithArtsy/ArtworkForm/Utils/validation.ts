import {
  ConsignmentSubmissionCategoryAggregation,
  ConsignmentSubmissionSource,
} from "__generated__/createConsignSubmissionMutation.graphql"
import {
  ConsignmentAttributionClass,
  ConsignmentSubmissionStateAggregation,
} from "__generated__/updateConsignSubmissionMutation.graphql"
import { AutosuggestResult } from "app/Components/AutosuggestResults/AutosuggestResults"
import {
  SubmitArtworkStackNavigation,
  getCurrentRoute,
} from "app/Scenes/SellWithArtsy/ArtworkForm/SubmitArtworkForm"
import { limitedEditionValue } from "app/Scenes/SellWithArtsy/SubmitArtwork/ArtworkDetails/utils/rarityOptions"
import { Photo } from "app/Scenes/SellWithArtsy/SubmitArtwork/UploadPhotos/validation"
import { unsafe_getFeatureFlag } from "app/store/GlobalStore"
import * as Yup from "yup"

export const getCurrentValidationSchema = (_injectedStep?: keyof SubmitArtworkStackNavigation) => {
  const currentStep = _injectedStep || getCurrentRoute()

  switch (currentStep) {
    case "SelectArtist":
      return artistFormSchema
    case "AddTitle":
      return artworkFormTitleSchema
    case "AddPhotos":
      return artworkFormPhotosSchema
    case "AddDetails":
      return artworkDetailsValidationSchema
    case "AddProvenance":
      return provenanceSchema
    case "AddDimensions":
      return dimensionsSchema

    default:
      // Make sure the devs are warned when they forget to add a validation schema
      if (currentStep && currentStep !== "StartFlow") {
        console.warn(`No validation schema found for step: ${currentStep}`)
      }
      return Yup.object()
  }
}

const artistFormSchema = Yup.object().shape({
  artist: Yup.string().required().trim(),
})

const artworkFormTitleSchema = Yup.object().shape({
  title: Yup.string().required().trim(),
})

const artworkFormPhotosSchema = Yup.object().shape({
  photos: Yup.array()
    .min(__TEST__ ? 0 : 1)
    .of(
      Yup.object().shape({
        id: Yup.string().required(),
        geminiToken: Yup.string().required(),
        path: Yup.string().required(),
      })
    ),
})

const dimensionsSchema = Yup.object().shape({
  depth: unsafe_getFeatureFlag("ARSWAMakeAllDimensionsOptional")
    ? Yup.string().trim()
    : Yup.string().required().trim(),
  height: unsafe_getFeatureFlag("ARSWAMakeAllDimensionsOptional")
    ? Yup.string().trim()
    : Yup.string().required().trim(),
  width: unsafe_getFeatureFlag("ARSWAMakeAllDimensionsOptional")
    ? Yup.string().trim()
    : Yup.string().required().trim(),
  dimensionsMetric: unsafe_getFeatureFlag("ARSWAMakeAllDimensionsOptional")
    ? Yup.string().trim()
    : Yup.string().required().trim(),
})

const provenanceSchema = Yup.object().shape({
  provenance: Yup.string().trim(),
})

const artworkDetailsValidationSchema = Yup.object().shape({
  category: Yup.string().required(),
  attributionClass: Yup.string().nullable(),
  editionNumber: Yup.string().when("attributionClass", {
    is: limitedEditionValue,
    then: Yup.string().required().trim(),
  }),
  editionSizeFormatted: Yup.string().when("attributionClass", {
    is: limitedEditionValue,
    then: Yup.string().required().trim(),
  }),
  medium: Yup.string(),
  year: Yup.string(),
})

export interface Location {
  city: string
  state: string
  country: string
  countryCode: string
  zipCode?: string
}

export interface ArtworkDetailsFormModel {
  submissionId: string | null
  artist: string | null
  artistId: string
  artistSearchResult: AutosuggestResult | null
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

  // Photos
  photos: Photo[]
  initialPhotos?: Photo[]

  // Contact information
  userName: string
  userEmail: string
  userPhone: string
}

export const artworkDetailsEmptyInitialValues: ArtworkDetailsFormModel = {
  submissionId: null,
  artist: "",
  artistId: "",
  artistSearchResult: null,
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

  // Photos
  photos: [],
  initialPhotos: [],

  // Contact information
  userName: "",
  userEmail: "",
  userPhone: "",
}
