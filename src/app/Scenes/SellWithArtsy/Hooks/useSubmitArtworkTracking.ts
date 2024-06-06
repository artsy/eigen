import { ContextModule, OwnerType } from "@artsy/cohesion"
import { SubmitArtworkScreen } from "app/Scenes/SellWithArtsy/ArtworkForm/Utils/constants"
import { ArtworkDetailsFormModel } from "app/Scenes/SellWithArtsy/ArtworkForm/Utils/validation"
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

  const trackConsignmentSubmitted = (
    submission_id: string | null,
    user_email: string,
    user_id: string,
    values: ArtworkDetailsFormModel
  ) => {
    trackEvent({
      action: "consignmentSubmitted",
      context_module: ContextModule.sell,
      context_owner_type: getOwnerType("CompleteYourSubmission"),
      submission_id,
      user_email,
      user_id,
      fieldsProvided: values,
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

  return {
    trackTappedContinueSubmission,
    trackTappedNewSubmission,
    trackTappedStartMyCollection,
    trackTappedSubmissionSaveExit,
    trackTappedSubmissionBack,
    trackConsignmentSubmitted,
    trackTappedSubmitAnotherWork,
    trackTappedViewArtworkInMyCollection,
  }
}

const getOwnerType = (currentStep: SubmitArtworkScreen): OwnerType => {
  switch (currentStep) {
    case "StartFlow":
      return OwnerType.submissionStepStart
    case "SelectArtist":
      return OwnerType.submissionStepSelectArtist
    case "AddTitle":
      return OwnerType.submissionStepAddTitle
    case "AddPhotos":
      return OwnerType.submissionStepAddPhotos
    case "AddDetails":
      return OwnerType.submissionStepAddDetails
    case "PurchaseHistory":
      return OwnerType.submissionStepPurchaseHistory
    case "AddDimensions":
      return OwnerType.submissionStepAddDimensions
    case "AddPhoneNumber":
      return OwnerType.submissionStepAddPhoneNumber
    case "CompleteYourSubmission":
      return OwnerType.submissionStepCompleteYourSubmission
    case "ArtistRejected":
      return OwnerType.submissionStepArtistRejected
    case "SelectArtworkMyCollectionArtwork":
      return OwnerType.submissionStepSelectArtworkMyCollectionArtwork
  }
}
