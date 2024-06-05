import { ContextModule } from "@artsy/cohesion"
import { SubmitArtworkScreen } from "app/Scenes/SellWithArtsy/ArtworkForm/Utils/constants"
import { ArtworkDetailsFormModel } from "app/Scenes/SellWithArtsy/ArtworkForm/Utils/validation"
import { useTracking } from "react-tracking"

export const useSubmitArtworkTracking = () => {
  const { trackEvent } = useTracking()

  const trackTappedContinueSubmission = (submission_id: string, destination_step: string) => {
    trackEvent({
      action: "tappedContinueSubmission",
      context_module: ContextModule.sell,
      context_owner_type: ContextModule.sell,
      submission_id,
      destination_step,
    })
  }

  const trackTappedNewSubmission = () => {
    trackEvent({
      action: "tappedNewSubmission",
      context_module: ContextModule.sell,
      context_owner_type: ContextModule.sell,
    })
  }

  const trackTappedStartMyCollection = () => {
    trackEvent({
      action: "tappedStartMyCollection",
      context_module: ContextModule.sell,
      context_owner_type: ContextModule.sell,
    })
  }

  const trackTappedSubmissionSaveExit = (
    submission_id: string | null,
    submission_step: SubmitArtworkScreen
  ) => {
    trackEvent({
      action: "tappedSubmissionSaveExit",
      context_module: ContextModule.sell,
      context_owner_type: ContextModule.sell,
      submission_id,
      submission_step,
    })
  }

  const trackTappedSubmissionBack = (
    submission_id: string | null,
    submission_step: SubmitArtworkScreen
  ) => {
    trackEvent({
      action: "tappedSubmissionBack",
      context_module: ContextModule.sell,
      context_owner_type: ContextModule.sell,
      submission_id,
      submission_step,
    })
  }

  const trackTappedViewSubmission = (
    submission_id: string | null,
    user_email: string,
    user_id: string,
    values: ArtworkDetailsFormModel
  ) => {
    trackEvent({
      action: "consignmentSubmitted",
      context_module: ContextModule.sell,
      context_owner_type: ContextModule.sell,
      submission_id,
      user_email,
      user_id,
      fieldsProvided: values,
    })
  }

  return {
    trackTappedContinueSubmission,
    trackTappedNewSubmission,
    trackTappedStartMyCollection,
    trackTappedSubmissionSaveExit,
    trackTappedSubmissionBack,
    trackTappedViewSubmission,
  }
}
