import { ActionType, ContextModule, OwnerType } from "@artsy/cohesion"
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
    tappedShare: (artworkId: string, artworkSlug: string) => {
      trackEvent({
        action: ActionType.tappedShare,
        context_module: ContextModule.infiniteDiscovery,
        context_screen_owner_id: artworkId,
        context_screen_owner_slug: artworkSlug,
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
  }
}
