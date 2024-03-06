import { Button, Flex, Spacer, Switch, Text } from "@artsy/palette-mobile"
import { CreateNewArtworkListInput } from "app/Components/ArtworkLists/views/CreateNewArtworkListView/components/CreateNewArtworkListInput"
import { useFeatureFlag } from "app/utils/hooks/useFeatureFlag"
import { Formik, FormikHelpers } from "formik"
import { FC } from "react"
import * as Yup from "yup"

export interface CreateOrEditArtworkListFormValues {
  name: string
  shareableWithPartners: boolean
}

const MAX_NAME_LENGTH = 40
const INITIAL_FORM_VALUES: CreateOrEditArtworkListFormValues = {
  name: "",
  shareableWithPartners: true,
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
  const AREnableArtworkListOfferability = useFeatureFlag("AREnableArtworkListOfferability")

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

            {mode === "create" && !!AREnableArtworkListOfferability && (
              <>
                <Spacer y={4} />

                <Flex flexDirection="row">
                  <Flex flex={1} mr={1}>
                    <Text variant="sm-display" color="black100" mb={0.5}>
                      Shared list
                    </Text>

                    <Text variant="xs" color="black60">
                      Share your interest in artworks with their respective galleries. Switching to
                      private will make lists visible only to you and opt them out of offers. List
                      names are always private.
                    </Text>
                  </Flex>

                  <Switch
                    value={formik.values.shareableWithPartners}
                    onValueChange={(value) => formik.setFieldValue("shareableWithPartners", value)}
                  />
                </Flex>
              </>
            )}

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
