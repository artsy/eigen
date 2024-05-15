import { SubmitArtworkFormStore } from "app/Scenes/SellWithArtsy/ArtworkForm/Components/SubmitArtworkFormStore"
import {
  __unsafe__SubmissionArtworkFormNavigationRef,
  getCurrentRoute,
} from "app/Scenes/SellWithArtsy/ArtworkForm/SubmitArtworkForm"
import {
  ARTWORK_FORM_STEPS,
  SubmitArtworkScreen,
} from "app/Scenes/SellWithArtsy/ArtworkForm/Utils/constants"
import { createOrUpdateSubmission } from "app/Scenes/SellWithArtsy/SubmitArtwork/ArtworkDetails/utils/createOrUpdateSubmission"
import { ArtworkDetailsFormModel } from "app/Scenes/SellWithArtsy/SubmitArtwork/ArtworkDetails/validation"
import { goBack } from "app/system/navigation/navigate"
import { useFormikContext } from "formik"
import { Alert } from "react-native"

export const useSubmissionContext = () => {
  const setCurrentStep = SubmitArtworkFormStore.useStoreActions((actions) => actions.setCurrentStep)
  const setIsLoading = SubmitArtworkFormStore.useStoreActions((actions) => actions.setIsLoading)

  const { values } = useFormikContext<ArtworkDetailsFormModel>()

  const navigateToNextStep = async (step?: SubmitArtworkScreen) => {
    try {
      setIsLoading(true)
      const currentStepId = getCurrentRoute()
      const nextStepId =
        step || ARTWORK_FORM_STEPS[ARTWORK_FORM_STEPS.indexOf(currentStepId as any) + 1]

      if (!nextStepId) {
        console.error("No next step found")
        return
      }

      if (values.submissionId) {
        await createOrUpdateSubmission(values, values.submissionId)
      }

      setCurrentStep(nextStepId)
      __unsafe__SubmissionArtworkFormNavigationRef.current?.navigate?.(nextStepId)
    } catch (error) {
      console.error("Error navigating to next step", error)
      Alert.alert("Could not navigate to next step")
    } finally {
      setIsLoading(false)
    }
  }

  const navigateToPreviousStep = () => {
    if (getCurrentRoute() === ARTWORK_FORM_STEPS[0]) {
      return goBack()
    }
    // Order is important here to make sure getCurrentRoute returns the correct value
    __unsafe__SubmissionArtworkFormNavigationRef.current?.goBack?.()
    const previousStepId = getCurrentRoute()

    if (previousStepId) {
      setCurrentStep(previousStepId)
    }
  }

  return {
    navigateToNextStep,
    navigateToPreviousStep,
  }
}
