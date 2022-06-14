import { ArtworkFormValues } from "app/Scenes/MyCollection/State/MyCollectionArtworkModel"
import { yupToFormErrors } from "formik"
import { trim } from "lodash"
import * as Yup from "yup"

export const artworkSchema = Yup.object().shape({
  artistDisplayName: Yup.string().when("artistSearchResult", {
    is: null,
    then: Yup.string()
      .required("Artist name is required")
      .test(
        "artistDisplayName",
        "Artist name should not be empty",
        (value) => !!value && trim(value) !== ""
      ),
    otherwise: Yup.string().notRequired(),
  }),
  title: Yup.string()
    .required("Title is required")
    .test("title", "Title should not be empty", (value) => !!value && trim(value) !== ""),
  medium: Yup.string().required("Medium is required"),
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
