import { ActionType, ContextModule, OwnerType } from "@artsy/cohesion"
import {
  ArrowBackIcon,
  CloseIcon,
  Flex,
  Screen,
  Spacer,
  Spinner,
  Touchable,
} from "@artsy/palette-mobile"
import { captureMessage } from "@sentry/react-native"
import { useToast } from "app/Components/Toast/toastHook"
import { ICON_HIT_SLOP } from "app/Components/constants"
import { InfiniteDiscoveryArtworkCard } from "app/Scenes/InfiniteDiscovery/Components/InfiniteDiscoveryArtworkCard"
import { InfiniteDiscoveryBottomSheet } from "app/Scenes/InfiniteDiscovery/Components/InfiniteDiscoveryBottomSheet"
import { Swiper } from "app/Scenes/InfiniteDiscovery/Components/Swiper/Swiper"
import { useCreateUserSeenArtwork } from "app/Scenes/InfiniteDiscovery/mutations/useCreateUserSeenArtwork"
import { GlobalStore } from "app/store/GlobalStore"
import { goBack, navigate } from "app/system/navigation/navigate"
import { extractNodes } from "app/utils/extractNodes"
import { pluralize } from "app/utils/pluralize"
import { ExtractNodeType } from "app/utils/relayHelpers"
import { Key, ReactElement, useCallback, useEffect, useMemo, useState } from "react"
import { useSafeAreaInsets } from "react-native-safe-area-context"
import { graphql, PreloadedQuery, usePreloadedQuery, useQueryLoader } from "react-relay"
import { useTracking } from "react-tracking"
import type {
  InfiniteDiscoveryQuery,
  InfiniteDiscoveryQuery$data,
} from "__generated__/InfiniteDiscoveryQuery.graphql"

interface InfiniteDiscoveryProps {
  fetchMoreArtworks: (undiscoveredArtworks: string[]) => void
  queryRef: PreloadedQuery<InfiniteDiscoveryQuery>
}

type InfiniteDiscoveryArtwork = ExtractNodeType<InfiniteDiscoveryQuery$data["discoverArtworks"]>

export const InfiniteDiscovery: React.FC<InfiniteDiscoveryProps> = ({
  fetchMoreArtworks,
  queryRef,
}) => {
  // const REFETCH_BUFFER = 3
  const toast = useToast()
  const { trackEvent } = useTracking()
  const [commitMutation] = useCreateUserSeenArtwork()

  const { addDisoveredArtworkId } = GlobalStore.actions.infiniteDiscovery

  const savedArtworksCount = GlobalStore.useAppState(
    (state) => state.infiniteDiscovery.savedArtworksCount
  )

  const [artworks, setArtworks] = useState<InfiniteDiscoveryArtwork[]>([])
  const [topArtworkId, setTopArtworkId] = useState<string | null>(null)
  const topArtwork = useMemo(
    () => artworks.find((artwork) => artwork.internalID === topArtworkId),
    [artworks, topArtworkId]
  )

  const data = usePreloadedQuery<InfiniteDiscoveryQuery>(infiniteDiscoveryQuery, queryRef)

  const insets = useSafeAreaInsets()

  /**
   * This is called whenever a query for more artworks is made.
   */
  useEffect(() => {
    const newArtworks = extractNodes(data.discoverArtworks)
    setArtworks((previousArtworks) => newArtworks.concat(previousArtworks))
  }, [data, extractNodes, setArtworks])

  useEffect(() => {
    if (!topArtworkId && artworks.length > 0) {
      // TODO: this should be 0 - where is the deck of cards getting flipped?
      setTopArtworkId(artworks[artworks.length - 1].internalID)

      // send the first seen artwork to the server
      commitMutation({
        variables: {
          input: {
            artworkId: artworks[0].internalID,
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

  const artworkCards: ReactElement[] = useMemo(() => {
    return artworks.map((artwork) => (
      <InfiniteDiscoveryArtworkCard artwork={artwork} key={artwork.internalID} />
    ))
  }, [artworks])

  /**
   * TODO: We commented this out to procrastinate on implementing the logic for this. However, it
   * has a side-effect of fetching the unswiped cards when we request a new batch of artworks, which
   * causes the card keys to be duplicated - FYI.
   */
  const unswipedCardIds: string[] = []
  // const unswipedCardIds: string[] = artworkCards
  //   .slice(currentIndex)
  //   .map((card) => (card.key as Key).toString())

  // TODO: bring this back
  const handleBackPressed = () => {
    // if (currentIndex > 0) {
    //   const artworkToRewind = artworks[currentIndex - 1]
    //   trackEvent(tracks.tappedRewind(artworkToRewind.internalID, artworkToRewind.slug))
    //   setCurrentIndex((prev) => prev - 1)
    // }
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

    addDisoveredArtworkId(artwork.internalID)

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

    setTopArtworkId(nextArtwork.internalID)
  }

  const handleFetchMore = useCallback(() => {
    fetchMoreArtworks(unswipedCardIds)
  }, [fetchMoreArtworks, unswipedCardIds])

  const handleExitPressed = () => {
    if (savedArtworksCount > 0) {
      toast.show(
        `${savedArtworksCount} ${pluralize("artwork", savedArtworksCount)} saved`,
        "bottom",
        {
          onPress: () => {
            trackEvent(tracks.tappedSummary())
            navigate("/favorites/saves")
          },
          backgroundColor: "green100",
          description: "Tap here to navigate to your Saves area in your profile.",
        }
      )
    }

    trackEvent(tracks.tappedExit())

    goBack()
  }

  // TODO: the top card should be at artworks[0] - where is the deck of cards getting flipped?
  const showRewindButton =
    !!artworks.length && topArtworkId !== artworks[artworks.length - 1].internalID

  return (
    <Screen safeArea={false}>
      <Screen.Body fullwidth style={{ marginTop: insets.top }}>
        <Flex zIndex={-100}>
          <Screen.Header
            title="Discovery"
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
            hideLeftElements={showRewindButton}
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
          cards={artworkCards}
          onTrigger={handleFetchMore}
          swipedIndexCallsOnTrigger={2}
          onNewCardReached={handleNewCardReached}
          onRewind={handleRewind}
          onSwipe={handleSwipe}
        />

        {!!topArtwork && (
          <InfiniteDiscoveryBottomSheet
            artworkID={topArtwork.internalID}
            artistIDs={topArtwork.artists.map((data) => data?.internalID ?? "")}
          />
        )}
      </Screen.Body>
    </Screen>
  )
}

const InfiniteDiscoverySpinner: React.FC = () => (
  <Screen>
    <Screen.Body fullwidth>
      <Screen.Header title="Discovery" />
      <Flex flex={1} justifyContent="center" alignItems="center">
        <Spinner />
      </Flex>
    </Screen.Body>
  </Screen>
)

export const InfiniteDiscoveryQueryRenderer: React.FC = () => {
  const [queryRef, loadQuery] = useQueryLoader<InfiniteDiscoveryQuery>(infiniteDiscoveryQuery)

  const discoveredArtworksIds = GlobalStore.useAppState(
    (state) => state.infiniteDiscovery.discoveredArtworkIds
  )
  const { resetSavedArtworksCount } = GlobalStore.actions.infiniteDiscovery

  useEffect(() => {
    resetSavedArtworksCount()
  }, [])

  /**
   * This fetches the first batch of artworks. discoveredArtworksIds is omitted from the list of
   * dependencies to prevent this from being called unnecessarily, since that list is updated when
   * new artworks are fetched.
   */
  useEffect(() => {
    if (!queryRef) {
      loadQuery({ excludeArtworkIds: discoveredArtworksIds })
    }
  }, [loadQuery, queryRef])

  if (!queryRef) {
    return <InfiniteDiscoverySpinner />
  }

  const fetchMoreArtworks = (undiscoveredArtworks: string[]) => {
    loadQuery({ excludeArtworkIds: discoveredArtworksIds.concat(undiscoveredArtworks) })
  }

  return <InfiniteDiscovery fetchMoreArtworks={fetchMoreArtworks} queryRef={queryRef} />
}

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
  tappedRewind: (artworkId: string, artworkSlug: string) => ({
    action: ActionType.tappedRewind,
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
