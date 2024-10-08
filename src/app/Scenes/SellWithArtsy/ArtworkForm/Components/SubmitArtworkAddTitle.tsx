import { Flex, Input, Spacer, Text } from "@artsy/palette-mobile"
import { NavigationProp, useNavigation } from "@react-navigation/native"
import { useToast } from "app/Components/Toast/toastHook"
import { ArtistSearchResult } from "app/Scenes/MyCollection/Screens/ArtworkForm/Components/ArtistSearchResult"
import { SubmitArtworkFormStore } from "app/Scenes/SellWithArtsy/ArtworkForm/Components/SubmitArtworkFormStore"
import { SubmitArtworkStackNavigation } from "app/Scenes/SellWithArtsy/ArtworkForm/SubmitArtworkForm"
import { useNavigationListeners } from "app/Scenes/SellWithArtsy/ArtworkForm/Utils/useNavigationListeners"
import { useSubmissionContext } from "app/Scenes/SellWithArtsy/ArtworkForm/Utils/useSubmissionContext"
import { SubmissionModel } from "app/Scenes/SellWithArtsy/ArtworkForm/Utils/validation"
import { createOrUpdateSubmission } from "app/Scenes/SellWithArtsy/SubmitArtwork/ArtworkDetails/utils/createOrUpdateSubmission"
import { useFormikContext } from "formik"
import { ScrollView } from "react-native"

export const SubmitArtworkAddTitle = () => {
  const { handleChange, values, setFieldValue } = useFormikContext<SubmissionModel>()

  const { show: showToast } = useToast()

  const setIsLoading = SubmitArtworkFormStore.useStoreActions((actions) => actions.setIsLoading)
  const setCurrentStep = SubmitArtworkFormStore.useStoreActions((actions) => actions.setCurrentStep)

  const navigation = useNavigation<NavigationProp<SubmitArtworkStackNavigation, "AddTitle">>()

  const { currentStep, useSubmitArtworkScreenTracking } = useSubmissionContext()

  useSubmitArtworkScreenTracking("AddTitle")

  useNavigationListeners({
    onNextStep: async () => {
      try {
        setIsLoading(true)
        const externalId = values.externalId

        // If no submission is present, create one
        // This is the case when the user is submitting an artwork from my collection
        if (!externalId) {
          const response = await createOrUpdateSubmission(values, null)
          setFieldValue("externalId", response?.externalID || externalId)
        }

        await createOrUpdateSubmission(
          {
            title: values.title,
          },
          externalId
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
