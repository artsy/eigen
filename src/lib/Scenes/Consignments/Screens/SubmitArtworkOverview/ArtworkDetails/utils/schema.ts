import { yupToFormErrors } from "formik"
import { AutosuggestResult } from "lib/Scenes/Search/AutosuggestResults"
import * as Yup from "yup"

export type OnResultPress = (result: AutosuggestResult) => void

export interface ArtworkFormValues {
  artist: string
  artistId: string
  title: string
}

export const artworkSchema = Yup.object().shape({
  artist: Yup.string().required(),
  artistId: Yup.string().required(),
  title: Yup.string().required(),
})

export const validateArtworkSchema = (x: ArtworkFormValues) => {
  let errors = {}
  try {
    artworkSchema.validateSync(x, {
      abortEarly: false,
    })
  } catch (error) {
    errors = yupToFormErrors(error)
  }
  return errors
}
