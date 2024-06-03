export const useSubmitArtworkTracking = () => {
  // const { trackEvent } = useTracking()

  const trackTappedContinueSubmission = (destination_step: string) => {
    console.log("trackTappedContinueSubmission", destination_step)
    // const payload: OnboardingUserInputData = {
    //   action: "tappedContinueSubmission",
    //   context_module: ContextModule.consignSubmissionFlow,
    //   context_owner_type: ContextModule.consignSubmissionFlow,
    //   destination_step,
    // }

    // trackEvent(payload)
  }

  return {
    trackTappedContinueSubmission,
  }
}
