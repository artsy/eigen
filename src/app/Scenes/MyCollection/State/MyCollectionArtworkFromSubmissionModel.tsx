import { Photo } from "app/Scenes/Consignments/Screens/SubmitArtworkOverview/UploadPhotos/validation"
import { Action, action } from "easy-peasy"

export interface SubmissionDetails {
  submissionDetailsForMyCollection: SubmissionDetailsForMyCollectionFormModel[]
  setSubmissionDetailsForMyCollection: Action<
    SubmissionForMyCollectionModel,
    SubmissionDetailsForMyCollectionFormModel
  >
}

export interface SubmissionForMyCollectionModel {
  /*  sessionState: {
    nextId: number
    submissionsInSession: Array<Omit<SubmissionDetails, "positionIndex">>
  } */
  submissionDetailsForMyCollection: SubmissionDetailsForMyCollectionFormModel[]
  setSubmissionDetailsForMyCollection: Action<
    SubmissionForMyCollectionModel,
    SubmissionDetailsForMyCollectionFormModel
  >
  resetSubmissionDetailsForMyCollection: Action<
    SubmissionForMyCollectionModel,
    SubmissionDetailsForMyCollectionFormModel
  >
}

export interface SubmissionDetailsForMyCollectionFormModel {
  submissionId: string
  photos: Photo[]
  initialPhotos?: Photo[]
}
// export const photosForMyCollectionEmptyInitialValues: PhotosForMyCollectionFormModel[] = []

export const getSubmissionForMyCollectionModel = (): SubmissionForMyCollectionModel => ({
  /*  sessionState: {
    nextId: 0,
    submissionsInSession: [],
  }, */
  submissionDetailsForMyCollection: [],
  setSubmissionDetailsForMyCollection: action((state, data) => {
    state.submissionDetailsForMyCollection.push(data)
  }),
  resetSubmissionDetailsForMyCollection: action((state) => {
    state.submissionDetailsForMyCollection = []
  }),
})
