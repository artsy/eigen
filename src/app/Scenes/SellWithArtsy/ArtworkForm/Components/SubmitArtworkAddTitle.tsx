import { Flex, Input, Spacer, Text } from "@artsy/palette-mobile"
import { NavigationProp, useNavigation } from "@react-navigation/native"
import { useToast } from "app/Components/Toast/toastHook"
import { ArtistSearchResult } from "app/Scenes/MyCollection/Screens/ArtworkForm/Components/ArtistSearchResult"
import { SubmitArtworkFormStore } from "app/Scenes/SellWithArtsy/ArtworkForm/Components/SubmitArtworkFormStore"
import { SubmitArtworkStackNavigation } from "app/Scenes/SellWithArtsy/ArtworkForm/SubmitArtworkForm"
import { useNavigationListeners } from "app/Scenes/SellWithArtsy/ArtworkForm/Utils/useNavigationListeners"
import { useSubmissionContext } from "app/Scenes/SellWithArtsy/ArtworkForm/Utils/useSubmissionContext"
import { SubmissionModel } from "app/Scenes/SellWithArtsy/ArtworkForm/Utils/validation"
import { useSubmitArtworkTracking } from "app/Scenes/SellWithArtsy/Hooks/useSubmitArtworkTracking"
import { createOrUpdateSubmission } from "app/Scenes/SellWithArtsy/SubmitArtwork/ArtworkDetails/utils/createOrUpdateSubmission"
import { useFormikContext } from "formik"
import { useEffect } from "react"
import { ScrollView } from "react-native"

export const SubmitArtworkAddTitle = () => {
  const { handleChange, values, setFieldValue } = useFormikContext<SubmissionModel>()

  const { show: showToast } = useToast()

  const setIsLoading = SubmitArtworkFormStore.useStoreActions((actions) => actions.setIsLoading)
  const setCurrentStep = SubmitArtworkFormStore.useStoreActions((actions) => actions.setCurrentStep)

  const navigation = useNavigation<NavigationProp<SubmitArtworkStackNavigation, "AddTitle">>()

  const { currentStep } = useSubmissionContext()
  const { trackSubmissionStepScreen } = useSubmitArtworkTracking()

  useEffect(() => {
    if (currentStep === "AddTitle") {
      trackSubmissionStepScreen(currentStep, values.submissionId || undefined)
    }
  }, [currentStep])

  useNavigationListeners({
    onNextStep: async () => {
      try {
        setIsLoading(true)
        let submissionId = values.submissionId

        // If no submission is present, create one
        // This is the case when the user is submitting an artwork from my collection
        if (!submissionId) {
          submissionId = (await createOrUpdateSubmission(values, null)) || null
          setFieldValue("submissionId", submissionId)
        }

        await createOrUpdateSubmission(
          {
            title: values.title,
          },
          submissionId
        )

        navigation.navigate("AddPhotos")
        setCurrentStep("AddPhotos")
      } catch (error) {
        console.error("Error setting title", error)
        showToast("Could not save your submission, please try again.", "bottom", {
          backgroundColor: "red100",
        })
      } finally {
        setIsLoading(false)
      }
    },
  })

  return (
    <Flex px={2} flex={1}>
      <ScrollView>
        <Flex>
          <Text variant="lg-display">Add artwork title</Text>

          <Spacer y={2} />

          {!!values.artistSearchResult && <ArtistSearchResult result={values.artistSearchResult} />}

          <Spacer y={2} />

          <Input
            placeholder="Artwork Title"
            onChangeText={handleChange("title")}
            value={values.title}
            // Only focus on the input and toggle the keyboard if this step is visible to the user.
            autoFocus={currentStep === "AddTitle"}
            spellCheck={false}
            autoCorrect={false}
          />

          <Spacer y={2} />

          <Text color="black60" variant="xs">
            Add ‘Unknown’ if unsure
          </Text>
        </Flex>
      </ScrollView>
    </Flex>
  )
}
