import { ArtworkFormStore } from "app/Scenes/SellWithArtsy/ArtworkForm/Components/ArtworkFormStore"
import {
  ArtworkFormScreen,
  __unsafe__SubmissionArtworkFormNavigationRef,
  getCurrentRoute,
} from "app/Scenes/SellWithArtsy/ArtworkForm/SubmissionArtworkForm"
import { goBack } from "app/system/navigation/navigate"

export const STEPS: (keyof ArtworkFormScreen)[] = [
  "SubmitArtworkStartFlow",
  "SelectArtworkFromMyCollection",
  "ArtworkFormArtist",
  "ArtworkFormTitle",
  "ArtworkFormPhotos",
  "ArtworkFormArtworkDetails",
  "ArtworkFormCompleteYourSubmission",
]

export const useSubmissionContext = () => {
  const setCurrentStep = ArtworkFormStore.useStoreActions((actions) => actions.setCurrentStep)

  function navigateToNextStep(step?: keyof ArtworkFormScreen) {
    const currentStepId = getCurrentRoute()
    const nextStepId = step || STEPS[STEPS.indexOf(currentStepId as any) + 1]

    if (!nextStepId) {
      console.error("No next step found")
      return
    }

    setCurrentStep(nextStepId)

    __unsafe__SubmissionArtworkFormNavigationRef.current?.navigate?.(nextStepId)
  }

  function navigateToPreviousStep() {
    if (getCurrentRoute() === STEPS[0]) {
      return goBack()
    }

    const currentStepId = getCurrentRoute()

    const previousStepId = STEPS[STEPS.indexOf(currentStepId as any) - 1]

    if (previousStepId) {
      setCurrentStep(previousStepId)
    }

    __unsafe__SubmissionArtworkFormNavigationRef.current?.goBack?.()
  }

  return {
    navigateToNextStep,
    navigateToPreviousStep,
  }
}

// export function navigateToNextStep() {
//   const currentStepId = getCurrentRoute()
//   const nextStepId = STEPS[STEPS.indexOf(currentStepId as any) + 1]

//   if (!nextStepId) {
//     console.error("No next step found")
//     return
//   }

//   __unsafe__SubmissionArtworkFormNavigationRef.current?.navigate?.(nextStepId)
// }

// export function navigateToPreviousStep() {
//   if (getCurrentRoute() === STEPS[0]) {
//     return goBack()
//   }

//   __unsafe__SubmissionArtworkFormNavigationRef.current?.goBack?.()
// }
