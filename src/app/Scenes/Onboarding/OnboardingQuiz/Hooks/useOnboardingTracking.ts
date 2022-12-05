import {
  ActionType,
  CompletedOnboarding,
  ContextModule,
  FollowedArtist,
  FollowedGene,
  FollowedPartner,
  OnboardingUserInputData,
  OwnerType,
  StartedOnboarding,
  UnfollowedArtist,
  UnfollowedGene,
  UnfollowedPartner,
} from "@artsy/cohesion"
import { useTracking } from "react-tracking"

export const useOnboardingTracking = () => {
  const { trackEvent } = useTracking()

  const trackStartedOnboarding = () => {
    const payload: StartedOnboarding = {
      action: ActionType.startedOnboarding,
    }

    trackEvent(payload)
  }

  const trackAnsweredQuestionOne = (response: string) => {
    const payload: OnboardingUserInputData = {
      action: ActionType.onboardingUserInputData,
      context_module: ContextModule.onboardingCollectorLevel,
      data_input: response,
    }

    trackEvent(payload)
  }

  const trackAnsweredQuestionTwo = (response: string[]) => {
    const payload: OnboardingUserInputData = {
      action: ActionType.onboardingUserInputData,
      context_module: ContextModule.onboardingInterests,
      data_input: response.join(),
    }

    trackEvent(payload)
  }

  const trackAnsweredQuestionThree = (response: string) => {
    const payload: OnboardingUserInputData = {
      action: ActionType.onboardingUserInputData,
      context_module: ContextModule.onboardingActivity,
      data_input: response,
    }

    trackEvent(payload)
  }

  const trackArtistFollow = (isFollowed: boolean, internalID: string, ownerSlug: string) => {
    const followPayload: FollowedArtist = {
      action: ActionType.followedArtist,
      context_module: ContextModule.onboardingFlow,
      context_owner_type: OwnerType.savesAndFollows,
      owner_id: internalID,
      owner_slug: ownerSlug,
      owner_type: OwnerType.artist,
    }

    const unfollowPayload: UnfollowedArtist = {
      action: ActionType.unfollowedArtist,
      context_module: ContextModule.onboardingFlow,
      context_owner_type: OwnerType.savesAndFollows,
      owner_id: internalID,
      owner_slug: ownerSlug,
      owner_type: OwnerType.artist,
    }

    trackEvent(isFollowed ? unfollowPayload : followPayload)
  }

  const trackGalleryFollow = (isFollowed: boolean, internalID: string, ownerSlug: string) => {
    const followPayload: FollowedPartner = {
      action: ActionType.followedPartner,
      context_module: ContextModule.onboardingFlow,
      context_owner_type: OwnerType.savesAndFollows,
      owner_id: internalID,
      owner_slug: ownerSlug,
      owner_type: OwnerType.partner,
    }

    const unfollowPayload: UnfollowedPartner = {
      action: ActionType.unfollowedPartner,
      context_module: ContextModule.onboardingFlow,
      context_owner_type: OwnerType.savesAndFollows,
      owner_id: internalID,
      owner_slug: ownerSlug,
      owner_type: OwnerType.partner,
    }

    trackEvent(isFollowed ? unfollowPayload : followPayload)
  }

  const trackGeneFollow = (isFollowed: boolean, internalID: string, ownerSlug: string) => {
    const followPayload: FollowedGene = {
      action: ActionType.followedGene,
      context_module: ContextModule.onboardingFlow,
      context_owner_type: OwnerType.savesAndFollows,
      owner_id: internalID,
      owner_slug: ownerSlug,
      owner_type: OwnerType.gene,
    }

    const unfollowPayload: UnfollowedGene = {
      action: ActionType.unfollowedGene,
      context_module: ContextModule.onboardingFlow,
      context_owner_type: OwnerType.savesAndFollows,
      owner_id: internalID,
      owner_slug: ownerSlug,
      owner_type: OwnerType.gene,
    }

    trackEvent(isFollowed ? unfollowPayload : followPayload)
  }

  const trackCompletedOnboarding = () => {
    const payload: CompletedOnboarding = {
      action: ActionType.completedOnboarding,
    }

    trackEvent(payload)
  }

  return {
    trackStartedOnboarding,
    trackAnsweredQuestionOne,
    trackAnsweredQuestionTwo,
    trackAnsweredQuestionThree,
    trackArtistFollow,
    trackGalleryFollow,
    trackGeneFollow,
    trackCompletedOnboarding,
  }
}
