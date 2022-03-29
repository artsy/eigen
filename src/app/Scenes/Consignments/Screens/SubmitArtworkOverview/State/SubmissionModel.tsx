import {
  Photo,
  photosEmptyInitialValues,
  PhotosFormModel,
} from "app/Scenes/Consignments/Screens/SubmitArtworkOverview/UploadPhotos/validation"
import { Action, action } from "easy-peasy"
import { ConsignmentsSubmissionUtmParams } from "../../../ConsignmentsHome/ConsignmentsSubmissionForm"
import {
  artworkDetailsEmptyInitialValues,
  ArtworkDetailsFormModel,
} from "../ArtworkDetails/validation"

export interface ArtworkSubmissionModel {
  submissionId: string
  setSubmissionId: Action<ArtworkSubmissionModel, string>
  artworkDetails: ArtworkDetailsFormModel
  setArtworkDetailsForm: Action<ArtworkSubmissionModel, ArtworkDetailsFormModel>
  initializeArtworkDetailsForm: Action<ArtworkSubmissionModel, Partial<ArtworkDetailsFormModel>>
  initializePhotos: Action<ArtworkSubmissionModel, Photo[]>
  photos: PhotosFormModel
  setPhotos: Action<ArtworkSubmissionModel, PhotosFormModel>
  setUtmParams: Action<ArtworkSubmissionModel, ConsignmentsSubmissionUtmParams>
  resetSessionState: Action<ArtworkSubmissionModel>
}

export interface SubmissionModel {
  submission: ArtworkSubmissionModel
}

export const getSubmissionModel = (): SubmissionModel => ({
  submission: {
    submissionId: "",
    artworkDetails: artworkDetailsEmptyInitialValues,
    photos: photosEmptyInitialValues,
    setPhotos: action((state, photos) => {
      state.photos = photos
    }),
    initializePhotos: action((state, photos) => {
      state.photos.initialPhotos = photos
    }),
    setSubmissionId: action((state, id) => {
      state.submissionId = id
    }),
    setArtworkDetailsForm: action((state, form) => {
      state.artworkDetails = form
    }),
    initializeArtworkDetailsForm: action((state, form) => {
      state.artworkDetails = { ...state.artworkDetails, ...form }
    }),
    setUtmParams: action((state, params) => {
      state.artworkDetails = {
        ...state.artworkDetails,
        utmMedium: params.utm_medium,
        utmSource: params.utm_source,
        utmTerm: params.utm_term,
      }
    }),
    resetSessionState: action((state) => {
      state.submissionId = ""
      state.artworkDetails = artworkDetailsEmptyInitialValues
      state.photos = photosEmptyInitialValues
    }),
  },
})
