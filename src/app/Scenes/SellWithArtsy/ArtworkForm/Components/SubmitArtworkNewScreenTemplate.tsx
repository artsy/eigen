import { OwnerType } from "@artsy/cohesion"
import { Flex, Input, Spacer, Text } from "@artsy/palette-mobile"
import { NavigationProp, useNavigation } from "@react-navigation/native"
import { useToast } from "app/Components/Toast/toastHook"
import { SubmitArtworkFormStore } from "app/Scenes/SellWithArtsy/ArtworkForm/Components/SubmitArtworkFormStore"
import { SubmitArtworkStackNavigation } from "app/Scenes/SellWithArtsy/ArtworkForm/SubmitArtworkForm"
import { useNavigationListeners } from "app/Scenes/SellWithArtsy/ArtworkForm/Utils/useNavigationListeners"
import { useSubmissionContext } from "app/Scenes/SellWithArtsy/ArtworkForm/Utils/useSubmissionContext"
import { SubmissionModel } from "app/Scenes/SellWithArtsy/ArtworkForm/Utils/validation"
import { createOrUpdateSubmission } from "app/Scenes/SellWithArtsy/SubmitArtwork/ArtworkDetails/utils/createOrUpdateSubmission"
import { ProvideScreenTrackingWithCohesionSchema } from "app/utils/track"
import { screen } from "app/utils/track/helpers"
import { useFormikContext } from "formik"
import { ScrollView } from "react-native"

export const SubmitArtworkNewScreenTemplate = () => {
  const { handleChange, values } = useFormikContext<SubmissionModel>()

  const { show: showToast } = useToast()

  const { currentStep } = useSubmissionContext()

  const setIsLoading = SubmitArtworkFormStore.useStoreActions((actions) => actions.setIsLoading)
  const setCurrentStep = SubmitArtworkFormStore.useStoreActions((actions) => actions.setCurrentStep)

  // TODO: Replace with the correct screen name
  // @ts-expect-error
  const navigation = useNavigation<NavigationProp<SubmitArtworkStackNavigation, "ScreenName">>()

  useNavigationListeners({
    onNextStep: async () => {
      try {
        setIsLoading(true)

        await createOrUpdateSubmission(
          {
            // values you want to update
          },
          values.submissionId
        )

        // TODO: Replace with the correct next screen name
        // @ts-expect-error
        navigation.navigate("NextScreenName")
        // TODO: Replace with the correct next screen name
        // @ts-expect-error
        setCurrentStep("NextScreenName")
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
    <ProvideScreenTrackingWithCohesionSchema
      info={screen({
        // TODO: Replace with the correct context screen owner type
        // @ts-expect-error
        context_screen_owner_type: OwnerType.newScreenTitle,
        context_screen_owner_id: values.submissionId || undefined,
      })}
    >
      <Flex px={2} flex={1}>
        <ScrollView>
          <Flex>
            <Text variant="lg-display">New Screen Title</Text>

            <Spacer y={2} />

            <Input
              placeholder="My new field"
              // TODO: Replace with the correct field name
              onChangeText={handleChange("new field")}
              // TODO: Replace with the correct field name
              // @ts-expect-error
              value={values.newField}
              // Only focus on the input and toggle the keyboard if this step is visible to the user.
              // TODO: Replace with the correct field name
              // @ts-expect-error
              autoFocus={currentStep === "NewScreenTitle"}
              spellCheck={false}
              autoCorrect={false}
            />
          </Flex>
        </ScrollView>
      </Flex>
    </ProvideScreenTrackingWithCohesionSchema>
  )
}
