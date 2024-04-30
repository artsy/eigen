import {
  ArtworkFormScreen,
  __unsafe__SubmissionArtworkFormNavigationRef,
  getCurrentRoute,
} from "app/Scenes/SellWithArtsy/ArtworkForm/SubmissionArtworkForm"
import { goBack } from "app/system/navigation/navigate"

export const STEPS: (keyof ArtworkFormScreen)[] = [
  "ArtworkFormArtist",
  "ArtworkFormTitle",
  "ArtworkFormPhotos",
  "ArtworkFormArtworkDetails",
  "ArtworkFormCompleteYourSubmission",
]

export function navigateToNextStep() {
  const currentStepId = getCurrentRoute()
  const nextStepId = STEPS[STEPS.indexOf(currentStepId as any) + 1]

  if (!nextStepId) {
    console.error("No next step found")
    return
  }

  __unsafe__SubmissionArtworkFormNavigationRef.current?.navigate?.(nextStepId)
}

export function navigateToPreviousStep() {
  if (getCurrentRoute() === STEPS[0]) {
    return goBack()
  }

  __unsafe__SubmissionArtworkFormNavigationRef.current?.goBack?.()
}

export const useSubmissionContext = () => {
  return {
    navigateToNextStep,
    navigateToPreviousStep,
  }
}
