import * as Yup from "yup"

export interface PhotosFormModel {
  photos: Photo[]
}

export interface Photo {
  height?: number
  isDefault?: boolean
  imageURL?: string
  internalID?: string
  path?: string
  width?: number
  imageVersions?: string[]
}

export const photosEmptyInitialValues: PhotosFormModel = {
  photos: [],
}

export const photosValidationSchema = Yup.object().shape({
  photos: Yup.array()
    .min(1)
    .of(
      Yup.object().shape({
        height: Yup.string(),
        isDefault: Yup.string(),
        imageURL: Yup.string(),
        internalID: Yup.string(),
        path: Yup.string(),
        width: Yup.number(),
        imageVersions: Yup.string(),
      })
    ),
})
