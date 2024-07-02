import { OwnerType } from "@artsy/cohesion"
import { Flex, Input, Join, Spacer, Text } from "@artsy/palette-mobile"
import { NavigationProp, useNavigation } from "@react-navigation/native"
import { SelectOption } from "app/Components/Select"
import { CategoryPicker } from "app/Scenes/MyCollection/Screens/ArtworkForm/Components/CategoryPicker"
import { SubmitArtworkFormStore } from "app/Scenes/SellWithArtsy/ArtworkForm/Components/SubmitArtworkFormStore"
import { SubmitArtworkStackNavigation } from "app/Scenes/SellWithArtsy/ArtworkForm/SubmitArtworkForm"
import { useSubmissionContext } from "app/Scenes/SellWithArtsy/ArtworkForm/Utils/useSubmissionContext"
import {
  ArtworkDetailsFormModel,
  getCurrentValidationSchema,
} from "app/Scenes/SellWithArtsy/ArtworkForm/Utils/validation"
import {
  AcceptableCategoryValue,
  acceptableCategoriesForSubmission,
} from "app/Scenes/SellWithArtsy/SubmitArtwork/ArtworkDetails/utils/acceptableCategoriesForSubmission"
import { createOrUpdateSubmission } from "app/Scenes/SellWithArtsy/SubmitArtwork/ArtworkDetails/utils/createOrUpdateSubmission"
import { ProvideScreenTrackingWithCohesionSchema } from "app/utils/track"
import { screen } from "app/utils/track/helpers"
import { Formik, useFormikContext } from "formik"
import { pick } from "lodash"
import { useRef } from "react"
import { ScrollView } from "react-native"

type SubmitArtworkAddDetailsModel = Pick<ArtworkDetailsFormModel, "year" | "medium" | "category">

export const SubmitArtworkAddDetails = () => {
  const { setFieldValue, values: allValues } = useFormikContext<ArtworkDetailsFormModel>()

  const { currentStep } = useSubmissionContext()

  const navigation = useNavigation<NavigationProp<SubmitArtworkStackNavigation>>()

  const setCurrentStep = SubmitArtworkFormStore.useStoreActions((actions) => actions.setCurrentStep)

  const categories = useRef<Array<SelectOption<AcceptableCategoryValue>>>(
    acceptableCategoriesForSubmission()
  ).current

  const handleSubmit = async (values: SubmitArtworkAddDetailsModel) => {
    try {
      await createOrUpdateSubmission(values, allValues.submissionId)

      setFieldValue("year", values.year)
      setFieldValue("category", values.category)
      setFieldValue("medium", values.medium)

      navigation.navigate("PurchaseHistory")
      setCurrentStep("PurchaseHistory")
    } catch (error) {
      console.error("Failed to update submission details", error)
    }
  }

  return (
    <Formik<SubmitArtworkAddDetailsModel>
      initialValues={pick(allValues, ["year", "medium", "category"])}
      validationSchema={getCurrentValidationSchema("AddDetails")}
      onSubmit={handleSubmit}
    >
      {({ handleChange, values }) => {
        return (
          <ProvideScreenTrackingWithCohesionSchema
            info={screen({
              context_screen_owner_type: OwnerType.submitArtworkStepAddDetails,
              context_screen_owner_id: allValues.submissionId || undefined,
            })}
          >
            <Flex px={2} flex={1}>
              <ScrollView keyboardShouldPersistTaps="handled">
                <Text variant="lg-display" mb={2}>
                  Artwork details
                </Text>

                <Join separator={<Spacer y={2} />}>
                  <Flex mb={2}>
                    <Input
                      title="Year"
                      placeholder="YYYY"
                      keyboardType="number-pad"
                      testID="Submission_YearInput"
                      value={values.year}
                      onChangeText={handleChange("year")}
                      accessibilityLabel="Year"
                      style={{ width: "50%" }}
                      // Only focus on the input and toggle the keyboard if this step is visible to the user.
                      autoFocus={currentStep === "AddDetails"}
                    />
                  </Flex>

                  <CategoryPicker<AcceptableCategoryValue | null>
                    handleChange={(category) => {
                      if (category !== null) {
                        handleChange("category")(category)
                      }
                    }}
                    options={categories}
                    required
                    value={values.category}
                  />

                  <Input
                    title="Materials"
                    placeholder={[
                      "Oil on canvas, mixed media, lithograph, etc.",
                      "Oil on canvas, mixed media, etc.",
                      "Oil on canvas, etc.",
                    ]}
                    testID="Submission_MaterialsInput"
                    value={values.medium}
                    onChangeText={handleChange("medium")}
                    accessibilityLabel="Materials"
                  />
                </Join>
              </ScrollView>
            </Flex>
          </ProvideScreenTrackingWithCohesionSchema>
        )
      }}
    </Formik>
  )
}
