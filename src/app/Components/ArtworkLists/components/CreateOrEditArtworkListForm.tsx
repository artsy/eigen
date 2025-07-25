import { ChevronSmallRightIcon } from "@artsy/icons/native"
import { Collapse, Touchable, Flex, Spacer, Switch, Text, Button } from "@artsy/palette-mobile"
import { CreateNewArtworkListInput } from "app/Components/ArtworkLists/views/CreateNewArtworkListView/components/CreateNewArtworkListInput"
import { useFeatureFlag } from "app/utils/hooks/useFeatureFlag"
import { Formik, FormikHelpers } from "formik"
import { MotiView } from "moti"
import { FC, useState } from "react"
import { Keyboard, Platform } from "react-native"
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
  mode?: "create" | "edit"
  initialValues?: Partial<CreateOrEditArtworkListFormValues>
  onSubmit: (
    values: CreateOrEditArtworkListFormValues,
    helpers: FormikHelpers<CreateOrEditArtworkListFormValues>
  ) => void
}

export const CreateOrEditArtworkListForm: FC<CreateOrEditArtworkListFormProps> = ({
  mode,
  initialValues: _initialValues,
  onSubmit,
}) => {
  const [isExpanded, setIsExpanded] = useState(false)
  const AREnableArtworkListOfferability = useFeatureFlag("AREnableArtworkListOfferability")
  const isAndroid = Platform.OS === "android"

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
              onBlur={() => {
                formik.handleBlur("name")
              }}
              onChangeText={formik.handleChange("name")}
              onSubmitEditing={() => {
                formik.validateForm()
                if (formik.values.name) {
                  formik.handleSubmit()
                }
              }}
              returnKeyType="done"
              autoFocus
            />

            {!!AREnableArtworkListOfferability && (
              <>
                <Spacer y={2} />

                <Flex flexDirection="row" alignItems="center">
                  <Switch
                    value={formik.values.shareableWithPartners}
                    onValueChange={(value) => formik.setFieldValue("shareableWithPartners", value)}
                  />
                  <Touchable accessibilityRole="button" onPress={() => setIsExpanded(!isExpanded)}>
                    <Flex flexDirection="row">
                      <Text variant="sm-display" color="mono100" mr={0.5} ml={1}>
                        Share list with galleries
                      </Text>

                      <MotiView
                        animate={{ transform: [{ rotate: !!isExpanded ? "-90deg" : "90deg" }] }}
                        transition={{ type: "timing" }}
                      >
                        <ChevronSmallRightIcon fill="mono100" />
                      </MotiView>
                    </Flex>
                  </Touchable>
                </Flex>

                <Collapse opened={!!isExpanded}>
                  <Text variant="xs" color="mono60" mt={1}>
                    Shared lists are eligible to receive offers from galleries. Switching sharing
                    off will make them visible only to you, and you won't receive offers. List names
                    are always private.
                  </Text>
                </Collapse>
              </>
            )}

            {!!isAndroid && (
              <>
                <Spacer y={4} />
                <Button
                  block
                  disabled={!formik.isValid || !formik.dirty}
                  loading={formik.isSubmitting}
                  onPress={() => {
                    Keyboard.dismiss()
                    formik.handleSubmit()
                  }}
                >
                  {mode === "create" ? "Save" : "Save Changes"}
                </Button>
              </>
            )}
          </>
        )
      }}
    </Formik>
  )
}
