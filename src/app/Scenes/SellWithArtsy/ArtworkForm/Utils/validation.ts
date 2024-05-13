import {
  ConsignmentSubmissionCategoryAggregation,
  ConsignmentSubmissionSource,
} from "__generated__/createConsignSubmissionMutation.graphql"
import {
  ConsignmentAttributionClass,
  ConsignmentSubmissionStateAggregation,
} from "__generated__/updateConsignSubmissionMutation.graphql"
import { AutosuggestResult } from "app/Components/AutosuggestResults/AutosuggestResults"
import { getCurrentRoute } from "app/Scenes/SellWithArtsy/ArtworkForm/SubmitArtworkForm"
import { limitedEditionValue } from "app/Scenes/SellWithArtsy/SubmitArtwork/ArtworkDetails/utils/rarityOptions"
import { Photo } from "app/Scenes/SellWithArtsy/SubmitArtwork/UploadPhotos/validation"
import * as Yup from "yup"

export const getCurrentValidationSchema = () => {
  const currentStep = getCurrentRoute()

  switch (currentStep) {
    case "SelectArtist":
      return artistFormSchema
    case "AddTitle":
      return artworkFormTitleSchema
    case "AddPhotos":
      return artworkFormPhotosSchema
    case "AddDetails":
      return artworkDetailsValidationSchema
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
  // TODO: Activated validation
  // photos: Yup.array()
  //   .min(__TEST__ ? 0 : 1)
  //   .of(
  //     Yup.object().shape({
  //       id: Yup.string().required(),
  //       geminiToken: Yup.string().required(),
  //       path: Yup.string().required(),
  //     })
  //   ),
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
}

// export const artworkDetailsValidationSchema = Yup.object().shape({
//   artist: Yup.string().trim(),
//   artistId: Yup.string().required(
//     "Please select an artist from the list. Artists who are not  listed cannot be submitted due to limited demand."
//   ),
//   title: Yup.string().required().trim(),
//   year: Yup.string().required().trim(),
//   medium: Yup.string().required().trim(),
//   attributionClass: Yup.string().required(),
//   editionNumber: Yup.string().when("attributionClass", {
//     is: limitedEditionValue,
//     then: Yup.string().required().trim(),
//   }),
//   editionSizeFormatted: Yup.string().when("attributionClass", {
//     is: limitedEditionValue,
//     then: Yup.string().required().trim(),
//   }),
//   dimensionsMetric: Yup.string().required(),
//   height: Yup.string().required().trim(),
//   width: Yup.string().required().trim(),
//   depth: Yup.string().trim(),
//   provenance: Yup.string().required().trim(),
//   state: Yup.string(),
//   utmMedium: Yup.string(),
//   utmSource: Yup.string(),
//   utmTerm: Yup.string(),
//   location: Yup.object().shape({
//     city: Yup.string().required().trim(),
//     state: Yup.string(),
//     country: Yup.string(),
//   }),
// })
