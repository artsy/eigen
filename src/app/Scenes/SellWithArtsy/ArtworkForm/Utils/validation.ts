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
import { Location } from "app/Scenes/SellWithArtsy/SubmitArtwork/ArtworkDetails/validation"
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
    case "PurchaseHistory":
      return provenanceSchema
    case "AddDimensions":
      return dimensionsSchema
    default:
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
        id: Yup.string(),
        geminiToken: Yup.string(),
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
  signature: Yup.boolean().nullable(),
})

const artworkDetailsValidationSchema = Yup.object().shape({
  category: Yup.string().required(),
  medium: Yup.string(),
  year: Yup.string(),
})

export interface ArtworkDetailsFormModel {
  submissionId: string | null
  artist: string
  artistId: string
  artistSearchResult: AutosuggestResult | null
  attributionClass: ConsignmentAttributionClass | null
  category: Exclude<ConsignmentSubmissionCategoryAggregation, "%future added value"> | null
  depth: string
  dimensionsMetric: string
  editionNumber: string
  editionSizeFormatted: string
  height: string
  location: Location | null
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
  signature: null,
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
