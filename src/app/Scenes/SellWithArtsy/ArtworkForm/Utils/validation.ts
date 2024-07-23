import {
  ConsignmentSubmissionCategoryAggregation,
  ConsignmentSubmissionSource,
} from "__generated__/createConsignSubmissionMutation.graphql"
import { ArtworkConditionEnumType } from "__generated__/myCollectionCreateArtworkMutation.graphql"
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
    case "ShippingLocation":
      return shippingLocationSchema
    case "FrameInformation":
      return frameInformationSchema
    case "Condition":
      return conditionSchema
    default:
      return Yup.object()
  }
}

const conditionSchema = Yup.object().shape({
  condition: Yup.string()
    .oneOf(
      ["EXCELLENT", "FAIR", "GOOD", "VERY_GOOD"],
      "Condition must be one of EXCELLENT, FAIR, GOOD, VERY_GOOD"
    )
    .nullable(),
  conditionDescription: Yup.string().trim(),
})

const frameInformationSchema = Yup.object().shape({
  isFramed: Yup.boolean().nullable(),
  framedMetric: Yup.string().trim(),
  framedWidth: Yup.string().trim(),
  framedHeight: Yup.string().trim(),
  framedDepth: Yup.string().trim(),
})

const shippingLocationSchema = Yup.object().shape({
  location: Yup.object().shape({
    city: Yup.string().required().trim(),
    state: Yup.string().required().trim(),
    country: Yup.string().required().trim(),
    countryCode: Yup.string().trim(),
    zipCode: Yup.string().required().trim(),
    address: Yup.string().required().trim(),
    address2: Yup.string().trim(),
  }),
})

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

export interface SubmissionModel {
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
  state?: ConsignmentSubmissionStateAggregation | null
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

  // Artwork
  artwork: {
    internalID: string | null | undefined
    isFramed: boolean | null | undefined
    framedMetric: string | null | undefined
    framedWidth: string | null | undefined
    framedHeight: string | null | undefined
    framedDepth: string | null | undefined
    condition: ArtworkConditionEnumType | null | undefined
    conditionDescription: string | null | undefined
  }
}

export const submissionModelInitialValues: SubmissionModel = {
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

  // Artwork
  artwork: {
    internalID: null,
    isFramed: null,
    framedMetric: "in",
    framedWidth: null,
    framedHeight: null,
    framedDepth: null,
    condition: null,
    conditionDescription: null,
  },
}
