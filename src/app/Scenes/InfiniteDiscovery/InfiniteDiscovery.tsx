import { ContextModule } from "@artsy/cohesion"
import { Screen, Spacer } from "@artsy/palette-mobile"
import { captureMessage } from "@sentry/react-native"
import { InfiniteDiscoveryNegativeSignalsBottomSheetQuery$variables } from "__generated__/InfiniteDiscoveryNegativeSignalsBottomSheetQuery.graphql"
import { InfiniteDiscoveryQueryRendererQuery$data } from "__generated__/InfiniteDiscoveryQueryRendererQuery.graphql"
import { ArtworkCardBottomSheet } from "app/Components/ArtworkCard/ArtworkCardBottomSheet"
import { InfiniteDiscoveryHeader } from "app/Scenes/InfiniteDiscovery/Components/InfiniteDiscoveryHeader"
import {
  InfiniteDiscoveryNegativeSignalsBottomSheet,
  negativeSignalsQuery,
} from "app/Scenes/InfiniteDiscovery/Components/InfiniteDiscoveryNegativeSignalsBottomSheet"
import { InfiniteDiscoveryOnboarding } from "app/Scenes/InfiniteDiscovery/Components/InfiniteDiscoveryOnboarding"
import { Swiper } from "app/Scenes/InfiniteDiscovery/Components/Swiper/Swiper"
import { useInfiniteDiscoveryTracking } from "app/Scenes/InfiniteDiscovery/hooks/useInfiniteDiscoveryTracking"
import { useCreateUserSeenArtwork } from "app/Scenes/InfiniteDiscovery/mutations/useCreateUserSeenArtwork"
import { GlobalStore } from "app/store/GlobalStore"
import { useFeatureFlag } from "app/utils/hooks/useFeatureFlag"
import { prefetchQuery } from "app/utils/queryPrefetching"
import { ExtractNodeType } from "app/utils/relayHelpers"
import { Key, useCallback, useEffect, useMemo, useState } from "react"
import { useSafeAreaInsets } from "react-native-safe-area-context"

interface InfiniteDiscoveryProps {
  fetchMoreArtworks: (undiscoveredArtworks: string[]) => void
  artworks: InfiniteDiscoveryArtwork[]
}

export type InfiniteDiscoveryArtwork = ExtractNodeType<
  InfiniteDiscoveryQueryRendererQuery$data["discoverArtworks"]
>

export const InfiniteDiscovery: React.FC<InfiniteDiscoveryProps> = ({
  fetchMoreArtworks,
  artworks,
}) => {
  const track = useInfiniteDiscoveryTracking()
  const [commitMutation] = useCreateUserSeenArtwork()
  const negativeSignalsEnabled = useFeatureFlag("AREnabledDiscoverDailyNegativeSignals")

  const hasInteractedWithOnboarding = GlobalStore.useAppState(
    (state) => state.infiniteDiscovery.hasInteractedWithOnboarding
  )

  const [topArtworkId, setTopArtworkId] = useState<string | null>(null)
  const topArtwork = useMemo(
    () => artworks.find((artwork) => artwork.internalID === topArtworkId),
    [artworks, topArtworkId]
  )

  const insets = useSafeAreaInsets()

  useEffect(() => {
    if (!topArtworkId && artworks.length > 0) {
      const topArtwork = artworks[0]
      setTopArtworkId(topArtwork.internalID)

      // Track initial shown artwork
      track.displayedNewArtwork(topArtwork.internalID, topArtwork.slug)

      // send the first seen artwork to the server
      commitMutation({
        variables: {
          input: { artworkId: topArtwork.internalID },
        },
        onError: (error) => {
          if (__DEV__) {
            console.error(error)
          } else {
            captureMessage(`useCreateUserSeenArtwork ${error?.message}`)
          }
        },
      })
    }
  }, [artworks])

  // Prefetches the negative signals bottom sheet when top card changes
  useEffect(() => {
    if (topArtworkId && negativeSignalsEnabled) {
      prefetchQuery<InfiniteDiscoveryNegativeSignalsBottomSheetQuery$variables>({
        query: negativeSignalsQuery,
        variables: { id: topArtworkId },
      })
    }
  }, [topArtworkId, negativeSignalsEnabled])

  const topCardIndex = artworks.findIndex((artwork) => artwork.internalID === topArtworkId)
  const unswipedCardIds = artworks
    .slice(topCardIndex + 1, artworks.length)
    .map((artwork) => artwork.internalID)

  /**
   * The callack for when a card is displayed to the user for the first time.
   * @param key The key of the new card.
   */
  const handleNewCardReached = (key: Key) => {
    const artwork = artworks.find((artwork) => artwork.internalID === key)

    if (!artwork) {
      return
    }

    track.displayedNewArtwork(artwork.internalID, artwork.slug)

    // Tell the backend that the user has seen this artwork so that it doesn't show up again.
    commitMutation({
      variables: {
        input: { artworkId: artwork.internalID },
      },
      onError: (error) => {
        if (__DEV__) {
          console.error(error)
        } else {
          captureMessage(`useCreateUserSeenArtwork ${error?.message}`)
        }
      },
    })
  }

  /**
   * The callback for when a swiped card is brought back.
   * @param key The key of the card that was brought back.
   */
  const handleRewind = (key: Key) => {
    const artwork = artworks.find((artwork) => artwork.internalID === key)

    if (!artwork) {
      return
    }

    track.tappedRewind(artwork.internalID, artwork.slug)

    setTopArtworkId(artwork.internalID)
  }

  /**
   * The callback for when a card is swiped away.
   * @param swipedKey The key of the card that was swiped away.
   * @param nextKey They key of the card under the card that was swiped away.
   */
  const handleSwipe = (swipedKey: Key, nextKey: Key) => {
    const swipedArtwork = artworks.find((artwork) => artwork.internalID === swipedKey)

    if (!swipedArtwork) {
      return
    }

    track.swipedArtwork(swipedArtwork.internalID, swipedArtwork.slug)

    const nextArtwork = artworks.find((artwork) => artwork.internalID === nextKey)

    if (!nextArtwork) {
      return
    }

    // If this is the first time the user swipes, dismiss the onboarding.
    if (!hasInteractedWithOnboarding) {
      GlobalStore.actions.infiniteDiscovery.setHasInteractedWithOnboarding(true)
    }

    setTopArtworkId(nextArtwork.internalID)
  }

  const handleFetchMore = useCallback(() => {
    fetchMoreArtworks(unswipedCardIds)
  }, [fetchMoreArtworks, unswipedCardIds])

  // Get the last 2 artworks from the infinite discovery
  // We are showing the last 2 artworks instead of 2 because we reverse the artworks array
  // Inside the Swiper component
  const onboardingArtworks = artworks.slice(0, Math.min(artworks.length - 2, 2))

  return (
    <Screen safeArea={false}>
      <InfiniteDiscoveryOnboarding artworks={onboardingArtworks} />

      {/*
        disableKeyboardAvoidance necessary to avoid a white area appearing when hiding the keyboard
        related issues:
          - https://github.com/facebook/react-native/issues/27526
          - https://github.com/facebook/react-native/issues/47140
      */}
      <Screen.Body fullwidth style={{ marginTop: insets.top }} disableKeyboardAvoidance>
        <InfiniteDiscoveryHeader topArtwork={topArtwork} />

        <Spacer y={1} />

        <Swiper
          cards={artworks}
          onReachTriggerIndex={handleFetchMore}
          triggerIndex={2}
          onNewCardReached={handleNewCardReached}
          onRewind={handleRewind}
          onSwipe={handleSwipe}
        />
        {!!topArtwork && (
          <>
            <ArtworkCardBottomSheet
              artworkID={topArtwork.internalID}
              artworkSlug={topArtwork.slug}
              artistIDs={topArtwork.artists.map((data) => data?.internalID ?? "")}
              contextModule={ContextModule.infiniteDiscovery}
            />
            {!!negativeSignalsEnabled && (
              <InfiniteDiscoveryNegativeSignalsBottomSheet
                artworkID={topArtwork.internalID}
                key={topArtwork.internalID}
              />
            )}
          </>
        )}
      </Screen.Body>
    </Screen>
  )
}
