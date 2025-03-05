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
import { InfiniteDiscoveryOnboarding } from "app/Scenes/InfiniteDiscovery/Components/InfiniteDiscoveryOnboarding"
import { Swiper } from "app/Scenes/InfiniteDiscovery/Components/Swiper/Swiper"
import { useCreateUserSeenArtwork } from "app/Scenes/InfiniteDiscovery/mutations/useCreateUserSeenArtwork"
import { GlobalStore } from "app/store/GlobalStore"
import { goBack, navigate } from "app/system/navigation/navigate"
import { extractNodes } from "app/utils/extractNodes"
import { pluralize } from "app/utils/pluralize"
import { ExtractNodeType } from "app/utils/relayHelpers"
import { Key, ReactElement, useCallback, useEffect, useMemo, useState } from "react"
import { useSharedValue } from "react-native-reanimated"
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

export type InfiniteDiscoveryArtwork = ExtractNodeType<
  InfiniteDiscoveryQuery$data["discoverArtworks"]
>

export const InfiniteDiscovery: React.FC<InfiniteDiscoveryProps> = ({
  fetchMoreArtworks,
  queryRef,
}) => {
  // const REFETCH_BUFFER = 3
  const toast = useToast()
  const { trackEvent } = useTracking()
  const [commitMutation] = useCreateUserSeenArtwork()

  const hasInteractedWithOnboarding = GlobalStore.useAppState(
    (state) => state.infiniteDiscovery.hasInteractedWithOnboarding
  )

  const savedArtworksCount = GlobalStore.useAppState(
    (state) => state.infiniteDiscovery.savedArtworksCount
  )

  const [artworks, setArtworks] = useState<InfiniteDiscoveryArtwork[]>([])
  const [topArtworkId, setTopArtworkId] = useState<string | null>(null)
  const topArtwork = useMemo(
    () => artworks.find((artwork) => artwork.internalID === topArtworkId),
    [artworks, topArtworkId]
  )

  const isRewindRequested = useSharedValue(false)

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
      // TODO: beware! the artworks are being displayed in reverse order
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

  return (
    <Screen safeArea={false}>
      <Screen.Body fullwidth style={{ marginTop: insets.top }}>
        <InfiniteDiscoveryOnboarding artworks={artworks.slice(0, 3)} />

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
        {/* <Swiper
          cards={artworkCards}
          isRewindRequested={isRewindRequested}
          onTrigger={handleFetchMore}
          swipedIndexCallsOnTrigger={2}
          onNewCardReached={handleNewCardReached}
          onRewind={handleRewind}
          onSwipe={handleSwipe}
        /> */}

        {/* {!!topArtwork && (
          <InfiniteDiscoveryBottomSheet
            artworkID={topArtwork.internalID}
            artistIDs={topArtwork.artists.map((data) => data?.internalID ?? "")}
          />
        )} */}
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

  const { resetSavedArtworksCount } = GlobalStore.actions.infiniteDiscovery

  useEffect(() => {
    resetSavedArtworksCount()
  }, [])

  // This fetches the first batch of artworks
  useEffect(() => {
    if (!queryRef) {
      loadQuery({ excludeArtworkIds: [] })
    }
  }, [loadQuery, queryRef])

  if (!queryRef) {
    return <InfiniteDiscoverySpinner />
  }

  const fetchMoreArtworks = (undiscoveredArtworks: string[]) => {
    loadQuery({ excludeArtworkIds: undiscoveredArtworks })
  }

  return (
    <Flex flex={1}>
      <InfiniteDiscovery fetchMoreArtworks={fetchMoreArtworks} queryRef={queryRef} />
    </Flex>
  )
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
