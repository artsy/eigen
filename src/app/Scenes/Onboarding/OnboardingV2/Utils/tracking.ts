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
import { useTracking } from "react-tracking"

export const useOnboardingTracking = () => {
  const { trackEvent } = useTracking()
  const navigation = useNavigation()

  return {
    // user clicks get started
    userStartedOnboarding: () => {
      const payload: StartedOnboarding = {
        action: ActionType.startedOnboarding,
      }

      trackEvent(payload)
    },

    // user clicks next after answering "have you bought art before"
    userAnsweredCollectorQuestion: (response) => {
      const payload: OnboardingUserInputData = {
        action: ActionType.onboardingUserInputData,
        context_module: ContextModule.onboardingCollectorLevel,
        data_input: response,
      }

      trackEvent(payload)
    },

    // user clicks next after answering "what do you love most about art"
    userAnsweredInterestQuestion: (response) => {
      const payload: OnboardingUserInputData = {
        action: ActionType.onboardingUserInputData,
        context_module: ContextModule.onboardingInterests,
        data_input: response,
      }

      trackEvent(payload)
    },

    // user clicks next after answering "what would you like to see first"
    userAnsweredActivityQuestion: (response) => {
      const payload: OnboardingUserInputData = {
        action: ActionType.onboardingUserInputData,
        context_module: ContextModule.onboardingActivity,
        data_input: response,
      }

      trackEvent(payload)
    },

    // user follows or unfollows a artist
    trackArtistFollows: (isFollowed, internalID) => {
      const followPayload: FollowedArtist = {
        action: ActionType.followedArtist,
        context_module: ContextModule.onboardingFlow,
        context_owner_type: OwnerType.savesAndFollows,
        owner_id: internalID,
        owner_slug: contextPage?.pageSlug!,
        owner_type: OwnerType.artist,
      }

      const unfollowPayload: UnfollowedArtist = {
        action: ActionType.unfollowedArtist,
        context_module: ContextModule.onboardingFlow,
        context_owner_type: OwnerType.savesAndFollows,
        owner_id: internalID,
        owner_slug: contextPage?.pageSlug!,
        owner_type: OwnerType.artist,
      }

      trackEvent(isFollowed ? followPayload : unfollowPayload)
    },

    // user follows or unfollows a gallery
    trackGalleryFollows: (isFollowed, internalID) => {
      const followedPayload: FollowedPartner = {
        action: ActionType.followedPartner,
        context_module: ContextModule.onboardingFlow,
        context_owner_type: OwnerType.savesAndFollows,
        owner_id: internalID,
        owner_slug: contextPage?.pageSlug!,
        owner_type: OwnerType.partner,
      }

      const unfollowedPayload: UnfollowedPartner = {
        action: ActionType.unfollowedPartner,
        context_module: ContextModule.onboardingFlow,
        context_owner_type: OwnerType.savesAndFollows,
        owner_id: internalID,
        owner_slug: contextPage?.pageSlug!,
        owner_type: OwnerType.partner,
      }

      trackEvent(isFollowed ? followedPayload : unfollowedPayload)
    },

    // user follows or unfollows a gene
    trackGeneFollows: (isFollowed, internalID) => {
      const followedPayload: FollowedGene = {
        action: ActionType.followedGene,
        context_module: ContextModule.onboardingFlow,
        context_owner_type: OwnerType.savesAndFollows,
        owner_id: internalID,
        owner_slug: contextPage?.pageSlug!,
        owner_type: OwnerType.gene,
      }

      const unfollowedPayload: UnfollowedGene = {
        action: ActionType.unfollowedGene,
        context_module: ContextModule.onboardingFlow,
        context_owner_type: OwnerType.savesAndFollows,
        owner_id: internalID,
        owner_slug: contextPage?.pageSlug!,
        owner_type: OwnerType.gene,
      }

      trackEvent(isFollowed ? followedPayload : unfollowedPayload)
    },

    // whenever we decide onboarding is complete
    userCompletedOnboarding: () => {
      const payload: CompletedOnboarding = {
        action: ActionType.completedOnboarding,
      }

      trackEvent(payload)
    },
  }
}
