import { Button, Spacer } from "@artsy/palette-mobile"
import { CreateNewArtworkListInput } from "app/Components/ArtworkLists/views/CreateNewArtworkListView/components/CreateNewArtworkListInput"
import { Formik, FormikHelpers } from "formik"
import { FC } from "react"
import * as Yup from "yup"

export interface CreateOrEditArtworkListFormValues {
  name: string
}

const MAX_NAME_LENGTH = 40
const INITIAL_FORM_VALUES: CreateOrEditArtworkListFormValues = {
  name: "",
}

const validationSchema = Yup.object().shape({
  name: Yup.string().required("Name is required").max(MAX_NAME_LENGTH),
})

interface CreateOrEditArtworkListFormProps {
  mode: "create" | "edit"
  initialValues?: Partial<CreateOrEditArtworkListFormValues>
  onSubmit: (
    values: CreateOrEditArtworkListFormValues,
    helpers: FormikHelpers<CreateOrEditArtworkListFormValues>
  ) => void
  onBackPress: () => void
}

export const CreateOrEditArtworkListForm: FC<CreateOrEditArtworkListFormProps> = ({
  mode,
  initialValues: _initialValues,
  onSubmit,
  onBackPress,
}) => {
  const handleSubmit = (
    values: CreateOrEditArtworkListFormValues,
    helpers: FormikHelpers<CreateOrEditArtworkListFormValues>
  ) => {
    onSubmit(
      {
        ...values,
        name: values.name.trim(),
      },
      helpers
    )
  }

  const initialValues: CreateOrEditArtworkListFormValues = {
    ...INITIAL_FORM_VALUES,
    ..._initialValues,
  }

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={validationSchema}
      onSubmit={handleSubmit}
    >
      {(formik) => {
        return (
          <>
            <CreateNewArtworkListInput
              placeholder="Name your list"
              value={formik.values.name}
              error={formik.errors.name}
              maxLength={MAX_NAME_LENGTH}
              onBlur={formik.handleBlur("name")}
              onChangeText={formik.handleChange("name")}
            />

            <Spacer y={4} />

            <Button
              block
              disabled={!formik.isValid || !formik.dirty}
              loading={formik.isSubmitting}
              onPress={formik.handleSubmit}
            >
              {mode === "create" ? "Save" : "Save Changes"}
            </Button>

            <Spacer y={1} />

            <Button block variant="outline" onPress={onBackPress}>
              Back
            </Button>
          </>
        )
      }}
    </Formik>
  )
}
