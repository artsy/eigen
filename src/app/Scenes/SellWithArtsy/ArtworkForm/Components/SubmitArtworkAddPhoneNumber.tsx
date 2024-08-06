import { OwnerType } from "@artsy/cohesion"
import { Flex, Text } from "@artsy/palette-mobile"
import { NavigationProp, useNavigation } from "@react-navigation/native"
import { PhoneInput } from "app/Components/Input/PhoneInput"
import { useToast } from "app/Components/Toast/toastHook"
import { SubmitArtworkFormStore } from "app/Scenes/SellWithArtsy/ArtworkForm/Components/SubmitArtworkFormStore"
import { SubmitArtworkStackNavigation } from "app/Scenes/SellWithArtsy/ArtworkForm/SubmitArtworkForm"
import { TIER_1_STATES } from "app/Scenes/SellWithArtsy/ArtworkForm/Utils/constants"
import { updateMyCollectionArtwork } from "app/Scenes/SellWithArtsy/ArtworkForm/Utils/updateMyCollectionArtwork"
import { useNavigationListeners } from "app/Scenes/SellWithArtsy/ArtworkForm/Utils/useNavigationListeners"
import { useSubmissionContext } from "app/Scenes/SellWithArtsy/ArtworkForm/Utils/useSubmissionContext"
import { SubmissionModel } from "app/Scenes/SellWithArtsy/ArtworkForm/Utils/validation"
import { createOrUpdateSubmission } from "app/Scenes/SellWithArtsy/SubmitArtwork/ArtworkDetails/utils/createOrUpdateSubmission"
import { GlobalStore } from "app/store/GlobalStore"
import { refreshMyCollection } from "app/utils/refreshHelpers"
import { ProvideScreenTrackingWithCohesionSchema } from "app/utils/track"
import { screen } from "app/utils/track/helpers"
import { useFormikContext } from "formik"
import { ScrollView } from "react-native"

export const SubmitArtworkAddPhoneNumber = () => {
  const { handleChange, values } = useFormikContext<SubmissionModel>()

  const { show: showToast } = useToast()

  const { currentStep } = useSubmissionContext()

  const setIsLoading = SubmitArtworkFormStore.useStoreActions((actions) => actions.setIsLoading)
  const setCurrentStep = SubmitArtworkFormStore.useStoreActions((actions) => actions.setCurrentStep)

  const navigation = useNavigation<NavigationProp<SubmitArtworkStackNavigation, "AddPhoneNumber">>()

  useNavigationListeners({
    onNextStep: async () => {
      try {
        setIsLoading(true)

        const nextStep =
          values.state && TIER_1_STATES.includes(values.state)
            ? "CompleteYourSubmission"
            : "ShippingLocation"
        const newValues = {
          userPhone: values.userPhone,
          state: values.state && TIER_1_STATES.includes(values.state) ? "SUBMITTED" : undefined,
        } as const

        await createOrUpdateSubmission(newValues, values.submissionId)

        navigation.navigate(nextStep)
        setCurrentStep(nextStep)

        if (nextStep === "CompleteYourSubmission") {
          // Reset saved draft if submission is successful
          GlobalStore.actions.artworkSubmission.setDraft(null)
          // Refetch associated My Collection artwork to display the updated submission status on the artwork screen.
          if (values.myCollectionArtworkID) {
            await updateMyCollectionArtwork({
              artworkID: values.myCollectionArtworkID,
            })
          }
          refreshMyCollection()
        }
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
        context_screen_owner_type: OwnerType.submitArtworkStepAddPhoneNumber,
        context_screen_owner_id: values.submissionId || undefined,
      })}
    >
      <Flex px={2}>
        <ScrollView>
          <Text variant="lg-display" mb={2}>
            Add phone number
          </Text>

          <Text variant="xs" color="black60" mb={1}>
            Add your number (optional) to allow an Artsy Advisor to contact you by phone.
          </Text>

          <PhoneInput
            title="Phone number"
            placeholder="(000) 000-0000"
            onChangeText={handleChange("userPhone")}
            value={values.userPhone}
            accessibilityLabel="Phone number"
            shouldDisplayLocalError={false}
            testID="phone-input"
            // Only focus on the input and toggle the keyboard if this step is visible to the user.
            autoFocus={currentStep === "AddPhoneNumber"}
          />
        </ScrollView>
      </Flex>
    </ProvideScreenTrackingWithCohesionSchema>
  )
}
