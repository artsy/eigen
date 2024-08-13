import { Flex, Input, Join, Spacer, Text } from "@artsy/palette-mobile"
import { NavigationProp, useNavigation } from "@react-navigation/native"
import { SelectOption } from "app/Components/Select"
import { useToast } from "app/Components/Toast/toastHook"
import { CategoryPicker } from "app/Scenes/MyCollection/Screens/ArtworkForm/Components/CategoryPicker"
import { SubmitArtworkFormStore } from "app/Scenes/SellWithArtsy/ArtworkForm/Components/SubmitArtworkFormStore"
import { SubmitArtworkStackNavigation } from "app/Scenes/SellWithArtsy/ArtworkForm/SubmitArtworkForm"
import { useNavigationListeners } from "app/Scenes/SellWithArtsy/ArtworkForm/Utils/useNavigationListeners"
import { useSubmissionContext } from "app/Scenes/SellWithArtsy/ArtworkForm/Utils/useSubmissionContext"
import { SubmissionModel } from "app/Scenes/SellWithArtsy/ArtworkForm/Utils/validation"
import { useSubmitArtworkTracking } from "app/Scenes/SellWithArtsy/Hooks/useSubmitArtworkTracking"
import {
  AcceptableCategoryValue,
  acceptableCategoriesForSubmission,
} from "app/Scenes/SellWithArtsy/SubmitArtwork/ArtworkDetails/utils/acceptableCategoriesForSubmission"
import { createOrUpdateSubmission } from "app/Scenes/SellWithArtsy/SubmitArtwork/ArtworkDetails/utils/createOrUpdateSubmission"
import { useFormikContext } from "formik"
import { useEffect, useRef } from "react"
import { ScrollView } from "react-native"

export const SubmitArtworkAddDetails = () => {
  const { handleChange, setFieldValue, values } = useFormikContext<SubmissionModel>()

  const { show: showToast } = useToast()
  const setIsLoading = SubmitArtworkFormStore.useStoreActions((actions) => actions.setIsLoading)
  const setCurrentStep = SubmitArtworkFormStore.useStoreActions((actions) => actions.setCurrentStep)
  const navigation = useNavigation<NavigationProp<SubmitArtworkStackNavigation, "AddDetails">>()

  const { currentStep } = useSubmissionContext()
  const { trackSubmissionStepScreen } = useSubmitArtworkTracking()

  useEffect(() => {
    if (currentStep === "AddDetails") {
      trackSubmissionStepScreen(currentStep, values.submissionId || undefined)
    }
  }, [currentStep])

  useNavigationListeners({
    onNextStep: async () => {
      try {
        setIsLoading(true)
        await createOrUpdateSubmission(
          {
            year: values.year,
            category: values.category,
            medium: values.medium,
          },
          values.submissionId
        )

        navigation.navigate("PurchaseHistory")
        setCurrentStep("PurchaseHistory")
      } catch (error) {
        console.error("Error setting title", error)
        showToast("Something went wrong. The submission could not be updated.", "bottom")
      } finally {
        setIsLoading(false)
      }
    },
  })

  const categories = useRef<Array<SelectOption<AcceptableCategoryValue>>>(
    acceptableCategoriesForSubmission()
  ).current

  return (
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
              onChangeText={(e) => setFieldValue("year", e)}
              accessibilityLabel="Year"
              style={{ width: "50%" }}
              // Only focus on the input and toggle the keyboard if this step is visible to the user.
              autoFocus={currentStep === "AddDetails"}
            />
          </Flex>

          <CategoryPicker<AcceptableCategoryValue | null>
            handleChange={(category) => setFieldValue("category", category)}
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
  )
}
