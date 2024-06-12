import * as Yup from "yup"

export interface PhotosFormModel {
  submissionId?: string
  photos: Photo[]
  initialPhotos?: Photo[]
}

export interface Photo {
  id?: string
  geminiToken?: string
  height?: number
  isDefault?: boolean
  imageURL?: string
  internalID?: string
  path: string
  width?: number
  imageVersions?: string[]
  loading?: boolean
  error?: boolean
  errorMessage?: string
  size?: number
  sizeDisplayValue?: string
  automaticallyAdded?: boolean
}

export const photosEmptyInitialValues: PhotosFormModel = {
  photos: [],
  initialPhotos: [],
}

export const photosValidationSchema = Yup.object().shape({
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
