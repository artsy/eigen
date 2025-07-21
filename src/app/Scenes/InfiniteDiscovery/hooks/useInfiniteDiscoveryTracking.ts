import { ActionType, ContextModule, OwnerType } from "@artsy/cohesion"
import { Schema } from "app/utils/track"
import { useTracking } from "react-tracking"

export const useInfiniteDiscoveryTracking = () => {
  const { trackEvent } = useTracking()

  return {
    displayedNewArtwork: (artworkId: string, artworkSlug: string) => {
      trackEvent({
        action: ActionType.screen,
        context_screen_owner_id: artworkId,
        context_screen_owner_slug: artworkSlug,
        context_screen_owner_type: OwnerType.infiniteDiscoveryArtwork,
      })
    },
    share: (artworkId: string, artworkSlug: string, service: string) => {
      trackEvent({
        action: ActionType.share,
        context_module: ContextModule.infiniteDiscovery,
        context_owner_type: OwnerType.infiniteDiscoveryArtwork,
        context_owner_id: artworkId,
        context_owner_slug: artworkSlug,
        service,
      })
    },
    swipedArtwork: (artworkId: string, artworkSlug: string) => {
      trackEvent({
        action: ActionType.swipedInfiniteDiscoveryArtwork,
        context_module: ContextModule.infiniteDiscovery,
        context_screen_owner_id: artworkId,
        context_screen_owner_slug: artworkSlug,
        context_screen_owner_type: OwnerType.infiniteDiscoveryArtwork,
      })
    },
    tappedExit: () => {
      trackEvent({
        action: ActionType.tappedClose,
        context_module: ContextModule.infiniteDiscovery,
      })
    },
    tappedRewind: (artworkId: string, artworkSlug: string) => {
      trackEvent({
        action: ActionType.tappedRewind,
        context_module: ContextModule.infiniteDiscovery,
        context_screen_owner_id: artworkId,
        context_screen_owner_slug: artworkSlug,
        context_screen_owner_type: OwnerType.infiniteDiscoveryArtwork,
        mode: "swipe",
      })
    },
    tappedMore: () => {
      // TODO: ActionType
      // trackEvent({
      //   action: ActionType.tappedMore,
      //   context_module: ContextModule.infiniteDiscovery,
      //   context_screen_owner_id: artworkId,
      //   context_screen_owner_slug: artworkSlug,
      //   context_screen_owner_type: OwnerType.infiniteDiscoveryArtwork,
      // })
    },
    tappedShare: (id: string, slug: string) => {
      // TODO: check if something else is necessary to differentiate Artist/Artwork share
      trackEvent({
        action: ActionType.tappedShare,
        context_module: ContextModule.infiniteDiscovery,
        context_screen_owner_id: id,
        context_screen_owner_slug: slug,
        context_screen_owner_type: OwnerType.infiniteDiscoveryArtwork,
      })
    },
    tappedSummary: () => {
      trackEvent({
        action: ActionType.tappedToast,
        context_module: ContextModule.infiniteDiscovery,
        context_screen_owner_type: OwnerType.home,
        subject: "Tap here to navigate to your Saves area in your profile.",
      })
    },
    artworkImageSwipe: () => {
      trackEvent({
        action_name: Schema.ActionNames.ArtworkImageSwipe,
        action_type: Schema.ActionTypes.Swipe,
        context_module: ContextModule.infiniteDiscoveryArtworkCard,
      })
    },
    savedArtwork: (isSaved: boolean, ownerId: string, ownerSlug: string) => {
      trackEvent({
        action_name: isSaved ? Schema.ActionNames.ArtworkSave : Schema.ActionNames.ArtworkUnsave,
        action_type: Schema.ActionTypes.Success,
        context_module: ContextModule.infiniteDiscoveryArtworkCard,
        context_screen_owner_id: ownerId,
        context_screen_owner_slug: ownerSlug,
        context_screen_owner_type: OwnerType.infiniteDiscoveryArtwork,
      })
    },
    onboardingView: () => {
      trackEvent({
        action: ActionType.screen,
        context_screen_owner_type: OwnerType.infiniteDiscoveryOnboarding,
      })
    },
  }
}
