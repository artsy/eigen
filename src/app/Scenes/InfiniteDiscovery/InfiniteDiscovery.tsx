import { ActionType, ContextModule, OwnerType } from "@artsy/cohesion"
import { ShareIcon, ChevronDownIcon } from "@artsy/icons/native"
import {
  DEFAULT_HIT_SLOP,
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
import { getShareURL } from "app/Components/ShareSheet/helpers"

import { useToast } from "app/Components/Toast/toastHook"
import { ICON_HIT_SLOP } from "app/Components/constants"
import { InfiniteDiscoveryBottomSheet } from "app/Scenes/InfiniteDiscovery/Components/InfiniteDiscoveryBottomSheet"
import { InfiniteDiscoveryOnboarding } from "app/Scenes/InfiniteDiscovery/Components/InfiniteDiscoveryOnboarding"
import { Swiper } from "app/Scenes/InfiniteDiscovery/Components/Swiper/Swiper"
import { useCreateUserSeenArtwork } from "app/Scenes/InfiniteDiscovery/mutations/useCreateUserSeenArtwork"
import { GlobalStore } from "app/store/GlobalStore"
import { goBack, navigate } from "app/system/navigation/navigate"
import { getRelayEnvironment } from "app/system/relay/defaultEnvironment"
import { extractNodes } from "app/utils/extractNodes"
import { withSuspense } from "app/utils/hooks/withSuspense"
import { pluralize } from "app/utils/pluralize"
import { usePrefetch } from "app/utils/queryPrefetching"
import { ExtractNodeType } from "app/utils/relayHelpers"
import { Key, useCallback, useEffect, useMemo, useRef, useState } from "react"
import { useSafeAreaInsets } from "react-native-safe-area-context"
import RNShare from "react-native-share"
import { fetchQuery, graphql, useLazyLoadQuery } from "react-relay"
import { useTracking } from "react-tracking"
import { commitLocalUpdate, createOperationDescriptor, Disposable, getRequest } from "relay-runtime"

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

  const insets = useSafeAreaInsets()

  useEffect(() => {
    if (!topArtworkId && artworks.length > 0) {
      const topArtwork = artworks[0]
      setTopArtworkId(topArtwork.internalID)

      // Track initial shown artwork
      trackEvent(tracks.displayedNewArtwork(topArtwork.internalID, topArtwork.slug))

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

    trackEvent(tracks.displayedNewArtwork(artwork.internalID, artwork.slug))

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

    trackEvent(tracks.tappedRewind(artwork.internalID, artwork.slug))

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

    trackEvent(tracks.tappedExit())

    goBack()
  }

  const hideShareButton = !topArtwork || !topArtwork.slug || !topArtwork.title

  const handleSharePressed = () => {
    if (!topArtwork || !topArtwork.slug || !topArtwork.title) {
      return
    }

    trackEvent(tracks.tappedShare(topArtwork.internalID, topArtwork.slug))

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
          trackEvent(tracks.share(topArtwork.internalID, topArtwork.slug, result.message))
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
          onTrigger={handleFetchMore}
          swipedIndexCallsOnTrigger={2}
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

const InfiniteDiscoveryHeader = () => (
  <Screen.Header
    title="Discover Daily"
    leftElements={
      <Touchable
        onPress={() => {
          goBack()
        }}
        testID="close-icon"
        hitSlop={ICON_HIT_SLOP}
        haptic
      >
        <ChevronDownIcon />
      </Touchable>
    }
    hideRightElements
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
      infiniteDiscoveryVariables
    )
    // Disposable queries to allow them to be GCed by Relay when calling dispose()
    const queriesForDisposal = useRef<Disposable[]>([])
    const usedExcludeArtworkIds = useRef<string[][]>([])
    const env = getRelayEnvironment()
    const prefetch = usePrefetch()

    const { resetSavedArtworksCount } = GlobalStore.actions.infiniteDiscovery
    const initialArtworks = extractNodes(data.discoverArtworks)
    const [artworks, setArtworks] = useState<InfiniteDiscoveryArtwork[]>(initialArtworks)

    // Retain the queries to not have them GCed when swiping many times
    const retainQuery = useCallback((excludeArtworkIds: string[]) => {
      const queryRequest = getRequest(infiniteDiscoveryQuery)
      const descriptor = createOperationDescriptor(queryRequest, { excludeArtworkIds })
      const disposable = env.retain(descriptor)
      queriesForDisposal.current.push(disposable)
      usedExcludeArtworkIds.current.push(excludeArtworkIds)
    }, [])

    const fetchMoreArtworks = async (excludeArtworkIds: string[], isRetry = false) => {
      try {
        const response = await fetchQuery<InfiniteDiscoveryQuery>(
          env,
          infiniteDiscoveryQuery,
          { excludeArtworkIds },
          { fetchPolicy: "network-only" }
        ).toPromise()
        const newArtworks = extractNodes(response?.discoverArtworks)
        if (newArtworks.length) {
          setArtworks((previousArtworks) => previousArtworks.concat(newArtworks))
        }
        retainQuery(excludeArtworkIds)
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
      retainQuery(infiniteDiscoveryVariables.excludeArtworkIds)
      resetSavedArtworksCount()

      // Mark the queries to be disposed by GC, invalidate cache and prefetch a infinite discovery again
      return () => {
        queriesForDisposal.current.forEach((query) => {
          if (!!query.dispose) {
            query.dispose()
          }
        })
        usedExcludeArtworkIds.current.forEach((id) => {
          commitLocalUpdate(env, (store) => {
            store
              ?.getRoot()
              ?.getLinkedRecord("discoverArtworks", { excludeArtworkIds: id })
              ?.invalidateRecord()
          })
        })
        prefetch("/infinite-discovery", infiniteDiscoveryVariables)
      }
    }, [retainQuery])

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
          title
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
  share: (artworkId: string, artworkSlug: string, service: string) => ({
    action: ActionType.share,
    context_module: ContextModule.infiniteDiscovery,
    context_owner_type: OwnerType.infiniteDiscoveryArtwork,
    context_owner_id: artworkId,
    context_owner_slug: artworkSlug,
    service,
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
  tappedRewind: (artworkId: string, artworkSlug: string) => ({
    action: ActionType.tappedRewind,
    context_module: ContextModule.infiniteDiscovery,
    context_screen_owner_id: artworkId,
    context_screen_owner_slug: artworkSlug,
    context_screen_owner_type: OwnerType.infiniteDiscoveryArtwork,
    mode: "swipe",
  }),
  tappedShare: (artworkId: string, artworkSlug: string) => ({
    action: ActionType.tappedShare,
    context_module: ContextModule.infiniteDiscovery,
    context_screen_owner_id: artworkId,
    context_screen_owner_slug: artworkSlug,
    context_screen_owner_type: OwnerType.infiniteDiscoveryArtwork,
  }),
  tappedSummary: () => ({
    action: ActionType.tappedToast,
    context_module: ContextModule.infiniteDiscovery,
    context_screen_owner_type: OwnerType.home,
    subject: "Tap here to navigate to your Saves area in your profile.",
  }),
}
