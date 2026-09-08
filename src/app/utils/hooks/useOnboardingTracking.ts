import {
  ActionType,
  CompletedOnboarding,
  ContextModule,
  FollowedArtist,
  FollowedPartner,
  OnboardingUserInputData,
  OwnerType,
  ScreenOwnerType,
  StartedOnboarding,
  TappedSkip,
  UnfollowedArtist,
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

  const trackAnsweredExperienceQuestion = (buttonText: string) => {
    const payload: OnboardingUserInputData = {
      action: ActionType.onboardingUserInputData,
      context_module: ContextModule.onboardingCollectorLevel,
      data_input: buttonText,
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

  const trackCompletedOnboarding = () => {
    const payload: CompletedOnboarding = {
      action: ActionType.completedOnboarding,
    }

    trackEvent(payload)
  }

  const trackTappedSkip = (
    contextModule: ContextModule,
    contextScreenOwnerType: ScreenOwnerType,
    contextScreenOwnerId?: string,
    contextScreenOwnerSlug?: string
  ) => {
    const payload: TappedSkip = {
      action: ActionType.tappedSkip,
      context_module: contextModule,
      context_screen_owner_type: contextScreenOwnerType,
      context_screen_owner_id: contextScreenOwnerId,
      context_screen_owner_slug: contextScreenOwnerSlug,
      subject: "Skip",
    }

    trackEvent(payload)
  }

  return {
    trackStartedOnboarding,
    trackAnsweredExperienceQuestion,
    trackArtistFollow,
    trackGalleryFollow,
    trackCompletedOnboarding,
    trackTappedSkip,
  }
}
