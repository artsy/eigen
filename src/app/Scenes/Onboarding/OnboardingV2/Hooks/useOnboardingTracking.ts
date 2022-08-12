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
import { useNavigation } from "@react-navigation/native"
import { useCallback } from "react"
import { useTracking } from "react-tracking"

export const useOnboardingTracking = () => {
  const { trackEvent } = useTracking()
  const { getId } = useNavigation()

  const trackStartedOnboarding = useCallback(() => {
    const payload: StartedOnboarding = {
      action: ActionType.startedOnboarding,
    }

    trackEvent(payload)
  }, [trackEvent])

  const trackAnsweredQuestionOne = useCallback(
    (response: string) => {
      const payload: OnboardingUserInputData = {
        action: ActionType.onboardingUserInputData,
        context_module: ContextModule.onboardingCollectorLevel,
        data_input: response,
      }

      trackEvent(payload)
    },
    [trackEvent]
  )

  const trackAnsweredQuestionTwo = useCallback(
    (response: string[]) => {
      const payload: OnboardingUserInputData = {
        action: ActionType.onboardingUserInputData,
        context_module: ContextModule.onboardingInterests,
        data_input: response.join(),
      }

      trackEvent(payload)
    },
    [trackEvent]
  )

  const trackAnsweredQuestionThree = useCallback(
    (response: string) => {
      const payload: OnboardingUserInputData = {
        action: ActionType.onboardingUserInputData,
        context_module: ContextModule.onboardingActivity,
        data_input: response,
      }

      trackEvent(payload)
    },
    [trackEvent]
  )

  const trackArtistFollow = useCallback(
    (isFollowed: boolean, internalID: string) => {
      const followPayload: FollowedArtist = {
        action: ActionType.followedArtist,
        context_module: ContextModule.onboardingFlow,
        context_owner_type: OwnerType.savesAndFollows,
        owner_id: internalID,
        owner_slug: getId()!,
        owner_type: OwnerType.artist,
      }

      const unfollowPayload: UnfollowedArtist = {
        action: ActionType.unfollowedArtist,
        context_module: ContextModule.onboardingFlow,
        context_owner_type: OwnerType.savesAndFollows,
        owner_id: internalID,
        owner_slug: getId()!,
        owner_type: OwnerType.artist,
      }

      trackEvent(isFollowed ? followPayload : unfollowPayload)
    },
    [trackEvent]
  )

  const trackGalleryFollow = useCallback(
    (isFollowed: boolean, internalID: string) => {
      const followPayload: FollowedPartner = {
        action: ActionType.followedPartner,
        context_module: ContextModule.onboardingFlow,
        context_owner_type: OwnerType.savesAndFollows,
        owner_id: internalID,
        owner_slug: getId()!,
        owner_type: OwnerType.partner,
      }

      const unfollowPayload: UnfollowedPartner = {
        action: ActionType.unfollowedPartner,
        context_module: ContextModule.onboardingFlow,
        context_owner_type: OwnerType.savesAndFollows,
        owner_id: internalID,
        owner_slug: getId()!,
        owner_type: OwnerType.partner,
      }

      trackEvent(isFollowed ? followPayload : unfollowPayload)
    },
    [trackEvent]
  )

  const trackGeneFollow = useCallback(
    (isFollowed: boolean, internalID: string) => {
      const followPayload: FollowedGene = {
        action: ActionType.followedGene,
        context_module: ContextModule.onboardingFlow,
        context_owner_type: OwnerType.savesAndFollows,
        owner_id: internalID,
        owner_slug: getId()!,
        owner_type: OwnerType.gene,
      }

      const unfollowPayload: UnfollowedGene = {
        action: ActionType.unfollowedGene,
        context_module: ContextModule.onboardingFlow,
        context_owner_type: OwnerType.savesAndFollows,
        owner_id: internalID,
        owner_slug: getId()!,
        owner_type: OwnerType.gene,
      }

      trackEvent(isFollowed ? followPayload : unfollowPayload)
    },
    [trackEvent]
  )

  const trackCompletedOnboarding = useCallback(() => {
    const payload: CompletedOnboarding = {
      action: ActionType.completedOnboarding,
    }

    trackEvent(payload)
  }, [trackEvent])

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
