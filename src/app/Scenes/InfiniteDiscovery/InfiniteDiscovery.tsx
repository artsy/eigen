import { ActionType, ContextModule, OwnerType } from "@artsy/cohesion"
import {
  ArrowBackIcon,
  CloseIcon,
  Flex,
  Screen,
  Spacer,
  Spinner,
  Text,
  Touchable,
} from "@artsy/palette-mobile"
import { addBreadcrumb, captureException, captureMessage } from "@sentry/react-native"
import {
  InfiniteDiscoveryQuery,
  InfiniteDiscoveryQuery$data,
} from "__generated__/InfiniteDiscoveryQuery.graphql"
import { LoadFailureView } from "app/Components/LoadFailureView"
import { RetryErrorBoundary } from "app/Components/RetryErrorBoundary"

import { useToast } from "app/Components/Toast/toastHook"
import { ICON_HIT_SLOP } from "app/Components/constants"
import {
  InfiniteDiscoveryBottomSheet,
  InfiniteDiscoveryBottomSheetFailureView,
} from "app/Scenes/InfiniteDiscovery/Components/InfiniteDiscoveryBottomSheet"
import { InfiniteDiscoveryOnboarding } from "app/Scenes/InfiniteDiscovery/Components/InfiniteDiscoveryOnboarding"
import { Swiper } from "app/Scenes/InfiniteDiscovery/Components/Swiper/Swiper"
import { useCreateUserSeenArtwork } from "app/Scenes/InfiniteDiscovery/mutations/useCreateUserSeenArtwork"
import { GlobalStore } from "app/store/GlobalStore"
import { goBack, navigate } from "app/system/navigation/navigate"
import { getRelayEnvironment } from "app/system/relay/defaultEnvironment"
import { extractNodes } from "app/utils/extractNodes"
import { withSuspense } from "app/utils/hooks/withSuspense"
import { pluralize } from "app/utils/pluralize"
import { ExtractNodeType } from "app/utils/relayHelpers"
import { Key, useCallback, useEffect, useMemo, useState } from "react"
import { useSharedValue } from "react-native-reanimated"
import { useSafeAreaInsets } from "react-native-safe-area-context"
import { fetchQuery, graphql, useLazyLoadQuery } from "react-relay"
import { useTracking } from "react-tracking"

interface InfiniteDiscoveryProps {
  fetchMoreArtworks: (undiscoveredArtworks: string[]) => void
  artworks: InfiniteDiscoveryArtwork[]
}

export type InfiniteDiscoveryArtwork = ExtractNodeType<
  InfiniteDiscoveryQuery$data["discoverArtworks"]
>

export const InfiniteDiscovery: React.FC<InfiniteDiscoveryProps> = ({
  fetchMoreArtworks,
  artworks,
}) => {
  const toast = useToast()
  const { trackEvent } = useTracking()
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

  const isRewindRequested = useSharedValue(false)

  const insets = useSafeAreaInsets()

  useEffect(() => {
    if (!topArtworkId && artworks.length > 0) {
      // TODO: beware! the artworks are being displayed in reverse order
      const topArtwork = artworks[artworks.length - 1]
      setTopArtworkId(topArtwork.internalID)

      // Track initial shown artwork
      trackEvent(tracks.displayedNewArtwork(topArtwork.internalID, topArtwork.slug))

      // send the first seen artwork to the server
      commitMutation({
        variables: {
          input: {
            artworkId: topArtwork.internalID,
          },
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

  const currentIndex = artworks.findIndex((artwork) => artwork.internalID === topArtworkId)
  // TODO: beware! the artworks are being displayed in reverse order
  const unswipedCardIds = artworks.slice(0, currentIndex).map((artwork) => artwork.internalID)

  // TODO: beware! the artworks are being displayed in reverse order
  const hideRewindButton =
    !!artworks.length && topArtworkId === artworks[artworks.length - 1].internalID

  const handleBackPressed = () => {
    isRewindRequested.value = true
    // TODO: trackEvent(tracks.tappedRewind(artworkToRewind.internalID, artworkToRewind.slug))
  }

  /**
   * The callack for when a card is displayed to the user for the first time.
   * @param key The key of the new card.
   */
  const handleNewCardReached = (key: Key) => {
    const artwork = artworks.find((artwork) => artwork.internalID === key)

    if (!artwork) {
      return
    }

    trackEvent(tracks.displayedNewArtwork(artwork.internalID, artwork.slug))

    // Tell the backend that the user has seen this artwork so that it doesn't show up again.
    commitMutation({
      variables: {
        input: {
          artworkId: artwork.internalID,
        },
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
   * @param wasSwiped True if the card was swiped back, false if it was tapped back.
   */
  const handleRewind = (key: Key, wasSwiped = true) => {
    const artwork = artworks.find((artwork) => artwork.internalID === key)

    if (!artwork) {
      return
    }

    trackEvent(tracks.tappedRewind(artwork.internalID, artwork.slug, wasSwiped ? "swipe" : "tap"))

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

    trackEvent(tracks.swipedArtwork(swipedArtwork.internalID, swipedArtwork.slug))

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
            trackEvent(tracks.tappedSummary())
            navigate("/favorites/saves")
          },
          backgroundColor: "green100",
          description: (
            <Text
              variant="xs"
              style={{ color: "white", textDecorationLine: "underline" }}
              onPress={() => navigate("/favorites/saves")}
            >
              Tap to see all of your saved artworks.
            </Text>
          ),
          duration: "long",
        }
      )
    }

    trackEvent(tracks.tappedExit())

    goBack()
  }

  // Get the last 2 artworks from the infinite discovery
  // We are showing the last 2 artworks instead of 2 because we reverse the artworks array
  // Inside the Swiper component
  const onboardingArtworks = artworks.slice(artworks.length - 3, artworks.length)

  return (
    <Screen safeArea={false}>
      <InfiniteDiscoveryOnboarding artworks={onboardingArtworks} />

      <Screen.Body fullwidth style={{ marginTop: insets.top }}>
        <Flex zIndex={-100}>
          <Screen.Header
            title="Discover Daily"
            leftElements={
              <Touchable
                onPress={handleBackPressed}
                testID="back-icon"
                hitSlop={ICON_HIT_SLOP}
                haptic
              >
                <ArrowBackIcon />
              </Touchable>
            }
            hideLeftElements={hideRewindButton}
            rightElements={
              <Touchable
                onPress={handleExitPressed}
                testID="close-icon"
                hitSlop={ICON_HIT_SLOP}
                haptic
              >
                <CloseIcon fill="black100" />
              </Touchable>
            }
          />
        </Flex>
        <Spacer y={1} />
        <Swiper
          cards={artworks}
          isRewindRequested={isRewindRequested}
          onTrigger={handleFetchMore}
          swipedIndexCallsOnTrigger={2}
          onNewCardReached={handleNewCardReached}
          onRewind={handleRewind}
          onSwipe={handleSwipe}
        />
        {!!topArtwork && (
          <RetryErrorBoundary failureView={InfiniteDiscoveryBottomSheetFailureView}>
            <InfiniteDiscoveryBottomSheet
              artworkID={topArtwork.internalID}
              artistIDs={topArtwork.artists.map((data) => data?.internalID ?? "")}
            />
          </RetryErrorBoundary>
        )}
      </Screen.Body>
    </Screen>
  )
}

const InfiniteDiscoveryHeader = () => (
  <Screen.Header
    title="Discover Daily"
    hideLeftElements
    rightElements={
      <Touchable
        onPress={() => {
          goBack()
        }}
        testID="close-icon"
        hitSlop={ICON_HIT_SLOP}
        haptic
      >
        <CloseIcon fill="black100" />
      </Touchable>
    }
  />
)

const InfiniteDiscoverySpinner: React.FC = () => (
  <Screen>
    <InfiniteDiscoveryHeader />
    <Screen.Body fullwidth>
      <Flex
        flex={1}
        justifyContent="center"
        alignItems="center"
        // This is to make sure the spinner is centered regardless of the insets
        position="absolute"
        height="100%"
        width="100%"
      >
        <Spinner />
      </Flex>
    </Screen.Body>
  </Screen>
)

export const infiniteDiscoveryVariables = {
  excludeArtworkIds: [],
}

export const InfiniteDiscoveryQueryRenderer = withSuspense({
  Component: () => {
    const data = useLazyLoadQuery<InfiniteDiscoveryQuery>(
      infiniteDiscoveryQuery,
      infiniteDiscoveryVariables,
      { fetchPolicy: "store-and-network", networkCacheConfig: { force: true } }
    )

    const { resetSavedArtworksCount } = GlobalStore.actions.infiniteDiscovery
    const initialArtworks = extractNodes(data.discoverArtworks)
    const [artworks, setArtworks] = useState<InfiniteDiscoveryArtwork[]>(initialArtworks)

    const fetchMoreArtworks = async (excludeArtworkIds: string[], isRetry = false) => {
      try {
        const response = await fetchQuery<InfiniteDiscoveryQuery>(
          getRelayEnvironment(),
          infiniteDiscoveryQuery,
          {
            excludeArtworkIds,
          },
          {
            fetchPolicy: "network-only",
          }
        ).toPromise()
        const newArtworks = extractNodes(response?.discoverArtworks)
        if (newArtworks.length) {
          setArtworks((previousArtworks) => newArtworks.concat(previousArtworks))
        }
      } catch (error) {
        if (!isRetry) {
          addBreadcrumb({
            message: "Failed to fetch more artworks, retrying again",
          })
          fetchMoreArtworks(excludeArtworkIds, true)
          return
        }
        addBreadcrumb({
          message: "Failed to fetch more artworks",
        })
        captureException(error)
      }
    }

    useEffect(() => {
      resetSavedArtworksCount()
    }, [])

    return (
      <Flex flex={1}>
        <InfiniteDiscovery fetchMoreArtworks={fetchMoreArtworks} artworks={artworks} />
      </Flex>
    )
  },
  LoadingFallback: InfiniteDiscoverySpinner,
  ErrorFallback: () => (
    <Screen>
      <InfiniteDiscoveryHeader />
      <Screen.Body fullwidth>
        <LoadFailureView />
      </Screen.Body>
    </Screen>
  ),
})

export const infiniteDiscoveryQuery = graphql`
  query InfiniteDiscoveryQuery($excludeArtworkIds: [String!]!) {
    discoverArtworks(excludeArtworkIds: $excludeArtworkIds) {
      edges {
        node {
          ...InfiniteDiscoveryArtworkCard_artwork

          internalID @required(action: NONE)
          artists(shallow: true) @required(action: NONE) {
            internalID @required(action: NONE)
          }
          slug
        }
      }
    }
  }
`

const tracks = {
  displayedNewArtwork: (artworkId: string, artworkSlug: string) => ({
    action: ActionType.screen,
    context_screen_owner_id: artworkId,
    context_screen_owner_slug: artworkSlug,
    context_screen_owner_type: OwnerType.infiniteDiscoveryArtwork,
  }),
  swipedArtwork: (artworkId: string, artworkSlug: string) => ({
    action: ActionType.swipedInfiniteDiscoveryArtwork,
    context_module: ContextModule.infiniteDiscovery,
    context_screen_owner_id: artworkId,
    context_screen_owner_slug: artworkSlug,
    context_screen_owner_type: OwnerType.infiniteDiscoveryArtwork,
  }),
  tappedExit: () => ({
    action: ActionType.tappedClose,
    context_module: ContextModule.infiniteDiscovery,
  }),
  tappedRewind: (artworkId: string, artworkSlug: string, mode: "swipe" | "tap") => ({
    action: ActionType.tappedRewind,
    context_module: ContextModule.infiniteDiscovery,
    context_screen_owner_id: artworkId,
    context_screen_owner_slug: artworkSlug,
    context_screen_owner_type: OwnerType.infiniteDiscoveryArtwork,
    mode,
  }),
  tappedSummary: () => ({
    action: ActionType.tappedToast,
    context_module: ContextModule.infiniteDiscovery,
    context_screen_owner_type: OwnerType.home,
    subject: "Tap here to navigate to your Saves area in your profile.",
  }),
}
