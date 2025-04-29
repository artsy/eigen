import { ChevronDownIcon, ShareIcon } from "@artsy/icons/native"
import { DEFAULT_HIT_SLOP, Flex, Screen, Spacer, Text, Touchable } from "@artsy/palette-mobile"
import { captureMessage } from "@sentry/react-native"
import { InfiniteDiscoveryQueryRendererQuery$data } from "__generated__/InfiniteDiscoveryQueryRendererQuery.graphql"
import { getShareURL } from "app/Components/ShareSheet/helpers"
import { useToast } from "app/Components/Toast/toastHook"
import { InfiniteDiscoveryBottomSheet } from "app/Scenes/InfiniteDiscovery/Components/InfiniteDiscoveryBottomSheet"
import { InfiniteDiscoveryOnboarding } from "app/Scenes/InfiniteDiscovery/Components/InfiniteDiscoveryOnboarding"
import { Swiper } from "app/Scenes/InfiniteDiscovery/Components/Swiper/Swiper"
import { useInfiniteDiscoveryTracking } from "app/Scenes/InfiniteDiscovery/hooks/useInfiniteDiscoveryTracking"
import { useCreateUserSeenArtwork } from "app/Scenes/InfiniteDiscovery/mutations/useCreateUserSeenArtwork"
import { GlobalStore } from "app/store/GlobalStore"
import { goBack, navigate } from "app/system/navigation/navigate"
import { pluralize } from "app/utils/pluralize"
import { ExtractNodeType } from "app/utils/relayHelpers"
import { Key, useCallback, useEffect, useMemo, useState } from "react"
import { useSafeAreaInsets } from "react-native-safe-area-context"
import RNShare from "react-native-share"

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
  const toast = useToast()
  const track = useInfiniteDiscoveryTracking()
  const [commitMutation] = useCreateUserSeenArtwork()

  const hasInteractedWithOnboarding = GlobalStore.useAppState(
    (state) => state.infiniteDiscovery.hasInteractedWithOnboarding
  )

  const savedArtworksCount = GlobalStore.useAppState(
    (state) => state.infiniteDiscovery.savedArtworksCount
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

  const handleExitPressed = () => {
    if (savedArtworksCount > 0) {
      toast.show(
        `Nice! You saved ${savedArtworksCount} ${pluralize("artwork", savedArtworksCount)}.`,
        "bottom",
        {
          onPress: () => {
            track.tappedSummary()
            navigate("/favorites/saves")
          },
          backgroundColor: "green100",
          description: (
            <Text
              variant="xs"
              color="mono0"
              style={{ textDecorationLine: "underline" }}
              onPress={() => navigate("/favorites/saves")}
            >
              Tap to see all of your saved artworks.
            </Text>
          ),
          duration: "long",
        }
      )
    }

    track.tappedExit()

    goBack()
  }

  const hideShareButton = !topArtwork || !topArtwork.slug || !topArtwork.title

  const handleSharePressed = () => {
    if (!topArtwork || !topArtwork.slug || !topArtwork.title) {
      return
    }

    track.tappedShare(topArtwork.internalID, topArtwork.slug)

    const url = getShareURL(
      `/artwork/${topArtwork.slug}?utm_content=discover-daily-share&utm_medium=product-share`
    )
    const message = `View ${topArtwork.title} on Artsy`

    RNShare.open({
      title: topArtwork.title,
      message: message + "\n" + url,
      failOnCancel: false,
    })
      .then((result) => {
        if (result.success) {
          track.share(topArtwork.internalID, topArtwork.slug, result.message)
        }
      })
      .catch((error) => {
        console.error("InfiniteDiscovery.tsx", error)
      })
  }

  // Get the last 2 artworks from the infinite discovery
  // We are showing the last 2 artworks instead of 2 because we reverse the artworks array
  // Inside the Swiper component
  const onboardingArtworks = artworks.slice(0, Math.min(artworks.length - 2, 2))

  return (
    <Screen safeArea={false}>
      <InfiniteDiscoveryOnboarding artworks={onboardingArtworks} />

      <Screen.Body fullwidth style={{ marginTop: insets.top }}>
        <Flex zIndex={-100}>
          <Screen.Header
            title="Discover Daily"
            leftElements={
              <Touchable
                onPress={handleExitPressed}
                testID="close-icon"
                hitSlop={DEFAULT_HIT_SLOP}
                haptic
              >
                <ChevronDownIcon />
              </Touchable>
            }
            hideRightElements={hideShareButton}
            rightElements={
              <Touchable
                onPress={handleSharePressed}
                testID="share-icon"
                hitSlop={DEFAULT_HIT_SLOP}
                haptic
              >
                <ShareIcon width={24} height={24} />
              </Touchable>
            }
          />
        </Flex>
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
          <InfiniteDiscoveryBottomSheet
            artworkID={topArtwork.internalID}
            artworkSlug={topArtwork.slug}
            artistIDs={topArtwork.artists.map((data) => data?.internalID ?? "")}
          />
        )}
      </Screen.Body>
    </Screen>
  )
}
