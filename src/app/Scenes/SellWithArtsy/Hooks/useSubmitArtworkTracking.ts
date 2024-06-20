import { ActionType, ContextModule, OwnerType } from "@artsy/cohesion"
import { SubmitArtworkScreen } from "app/Scenes/SellWithArtsy/ArtworkForm/Utils/constants"
import { useTracking } from "react-tracking"

export const useSubmitArtworkTracking = () => {
  const { trackEvent } = useTracking()

  const trackTappedContinueSubmission = (submission_id: string, destination_step: string) => {
    trackEvent({
      action: "tappedContinueSubmission",
      context_module: ContextModule.sell,
      context_owner_type: OwnerType.sell,
      submission_id,
      destination_step,
    })
  }

  const trackTappedNewSubmission = () => {
    trackEvent({
      action: "tappedNewSubmission",
      context_module: ContextModule.sell,
      context_owner_type: getOwnerType("StartFlow"),
    })
  }

  const trackTappedStartMyCollection = () => {
    trackEvent({
      action: "tappedStartMyCollection",
      context_module: ContextModule.sell,
      context_owner_type: getOwnerType("StartFlow"),
    })
  }

  const trackTappedSubmissionSaveExit = (
    submission_id: string | null,
    currentStep: SubmitArtworkScreen
  ) => {
    trackEvent({
      action: "tappedSubmissionSaveExit",
      context_module: ContextModule.sell,
      context_owner_type: getOwnerType(currentStep),
      submission_id,
      submission_step: currentStep,
    })
  }

  const trackTappedSubmissionBack = (
    submission_id: string | null,
    currentStep: SubmitArtworkScreen
  ) => {
    trackEvent({
      action: "tappedSubmissionBack",
      context_module: ContextModule.sell,
      context_owner_type: getOwnerType(currentStep),
      submission_id,
      submission_step: currentStep,
    })
  }

  const trackConsignmentSubmitted = (submission_id: string | null) => {
    trackEvent({
      action: "consignmentSubmitted",
      context_module: ContextModule.sell,
      context_owner_type: getOwnerType("CompleteYourSubmission"),
      submission_id,
      fieldsProvided: [],
    })
  }

  const trackTappedSubmitAnotherWork = (submission_id: string | null) => {
    trackEvent({
      action: "tappedSubmitAnotherWork",
      context_module: ContextModule.sell,
      context_owner_type: getOwnerType("CompleteYourSubmission"),
      submission_id,
    })
  }

  const trackTappedViewArtworkInMyCollection = (submission_id: string | null) => {
    trackEvent({
      action: "tappedViewArtworkInMyCollection",
      context_module: ContextModule.sell,
      context_owner_type: getOwnerType("CompleteYourSubmission"),
      submission_id,
    })
  }

  const trackTappedContactAdvisor = (userId: string | undefined, userEmail: string | undefined) => {
    trackEvent({
      action: ActionType.tappedConsignmentInquiry,
      context_module: ContextModule.sell,
      context_owner_type: getOwnerType("ArtistRejected"),
      label: "contact an advisor",
      user_id: userId,
      user_email: userEmail,
    })
  }

  return {
    trackTappedContinueSubmission,
    trackTappedNewSubmission,
    trackTappedStartMyCollection,
    trackTappedSubmissionSaveExit,
    trackTappedSubmissionBack,
    trackConsignmentSubmitted,
    trackTappedSubmitAnotherWork,
    trackTappedViewArtworkInMyCollection,
    trackTappedContactAdvisor,
  }
}

const getOwnerType = (currentStep: SubmitArtworkScreen): OwnerType => {
  switch (currentStep) {
    case "StartFlow":
      return OwnerType.submitArtworkStepStart
    case "SelectArtist":
      return OwnerType.submitArtworkStepSelectArtist
    case "AddTitle":
      return OwnerType.submitArtworkStepAddTitle
    case "AddPhotos":
      return OwnerType.submitArtworkStepAddPhotos
    case "AddDetails":
      return OwnerType.submitArtworkStepAddDetails
    case "PurchaseHistory":
      return OwnerType.submitArtworkStepPurchaseHistory
    case "AddDimensions":
      return OwnerType.submitArtworkStepAddDimensions
    case "AddPhoneNumber":
      return OwnerType.submitArtworkStepAddPhoneNumber
    case "CompleteYourSubmission":
      return OwnerType.submitArtworkStepCompleteYourSubmission
    case "ArtistRejected":
      return OwnerType.submitArtworkStepArtistRejected
    case "SubmitArtworkFromMyCollection":
      return OwnerType.submitArtworkStepSelectArtworkMyCollectionArtwork
  }
}
