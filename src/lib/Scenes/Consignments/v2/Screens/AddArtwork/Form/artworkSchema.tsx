import { yupToFormErrors } from "formik"
import { ArtworkFormValues } from "lib/Scenes/Consignments/v2/State/ConsignmentsArtworkModel"
import * as Yup from "yup"

export const artworkSchema = Yup.object().shape({
  artistSearchResult: Yup.object()
    .nullable()
    .test("artistSearchResult", "Artist search result required", value => value !== null),
  medium: Yup.string().test("medium", "Medium required", value => value !== ""),
  size: Yup.string().test("size", "Size required", value => value !== ""),
})

export function validateArtworkSchema(values: ArtworkFormValues) {
  let errors = {}
  try {
    artworkSchema.validateSync(values, {
      abortEarly: false,
    })
  } catch (error) {
    errors = yupToFormErrors(error)
  }
  return errors
}
