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
  sessionState: {
    nextId: number
    submissionDetailsForMyCollection: SubmissionDetailsForMyCollectionFormModel[]
  }
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
  sessionState: {
    nextId: 0,
    submissionDetailsForMyCollection: [],
  },
  setSubmissionDetailsForMyCollection: action((state, data) => {
    state.sessionState.submissionDetailsForMyCollection.push(data)
    state.sessionState.nextId += 1
    return
  }),
  resetSubmissionDetailsForMyCollection: action((state) => {
    state.sessionState.submissionDetailsForMyCollection = []
  }),
})
