import * as Yup from "yup"

export interface PhotosFormModel {
  photos: Photo[]
}

export interface Photo {
  id?: string
  geminiToken?: string
  height?: number
  isDefault?: boolean
  imageURL?: string
  internalID?: string
  path?: string
  width?: number
  imageVersions?: string[]
  loading?: boolean
  error?: boolean
  errorMsg?: string
  size?: number
  sizeDisplayValue?: string
}

export const photosEmptyInitialValues: PhotosFormModel = {
  photos: [],
}

export const photosValidationSchema = Yup.object().shape({
  photos: Yup.array()
    .min(1)
    .of(
      Yup.object().shape({
        id: Yup.string().required(),
        geminiToken: Yup.string().required(),
        height: Yup.string(),
        isDefault: Yup.string(),
        imageURL: Yup.string(),
        internalID: Yup.string(),
        path: Yup.string(),
        width: Yup.number(),
        imageVersions: Yup.string(),
        loading: Yup.boolean(),
        error: Yup.boolean(),
        errorMsg: Yup.string(),
        size: Yup.number(),
        sizeDisplayValue: Yup.string(),
      })
    ),
})
