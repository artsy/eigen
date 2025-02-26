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
import { FancySwiperArtworkCard } from "app/Components/FancySwiper/FancySwiper"
import { useToast } from "app/Components/Toast/toastHook"
import { ICON_HIT_SLOP } from "app/Components/constants"
import { InfiniteDiscoveryArtworkCard } from "app/Scenes/InfiniteDiscovery/Components/InfiniteDiscoveryArtworkCard"
import { Swiper } from "app/Scenes/InfiniteDiscovery/Components/Swiper/Swiper"
import { useCreateUserSeenArtwork } from "app/Scenes/InfiniteDiscovery/mutations/useCreateUserSeenArtwork"
import { GlobalStore } from "app/store/GlobalStore"
import { goBack, navigate } from "app/system/navigation/navigate"
import { extractNodes } from "app/utils/extractNodes"
import { pluralize } from "app/utils/pluralize"
import { ExtractNodeType } from "app/utils/relayHelpers"
import { useCallback, useEffect, useMemo, useState } from "react"
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
  const REFETCH_BUFFER = 3
  const toast = useToast()
  const { trackEvent } = useTracking()
  const [commitMutation] = useCreateUserSeenArtwork()

  const { addDisoveredArtworkId } = GlobalStore.actions.infiniteDiscovery
  const [extraCards, setExtraCards] = useState<typeof _cards>(_cards)

  const savedArtworksCount = GlobalStore.useAppState(
    (state) => state.infiniteDiscovery.savedArtworksCount
  )

  const [currentIndex, setCurrentIndex] = useState(0)
  const [maxIndexReached, setMaxIndexReached] = useState(currentIndex)
  const [artworks, setArtworks] = useState<InfiniteDiscoveryArtwork[]>([])

  const data = usePreloadedQuery<InfiniteDiscoveryQuery>(infiniteDiscoveryQuery, queryRef)

  const insets = useSafeAreaInsets()

  /**
   * This is called whenever a query for more artworks is made.
   */
  useEffect(() => {
    const newArtworks = extractNodes(data.discoverArtworks)
    setArtworks((previousArtworks) => previousArtworks.concat(newArtworks))
  }, [data, extractNodes, setArtworks])

  /**
   * sends the first seen artwork to the server
   */
  useEffect(() => {
    if (artworks.length > 0 && index === 0) {
      commitMutation({
        variables: {
          input: {
            artworkId: artworks[index].internalID,
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

  const artworkCards: FancySwiperArtworkCard[] = useMemo(() => {
    return artworks.map((artwork) => ({
      content: <InfiniteDiscoveryArtworkCard artwork={artwork} key={artwork.internalID} />,
      artworkId: artwork.internalID,
    }))
  }, [artworks])

  const unswipedCards: FancySwiperArtworkCard[] = artworkCards.slice(currentIndex)

  const handleBackPressed = () => {
    if (currentIndex > 0) {
      const artworkToRewind = artworks[currentIndex - 1]
      trackEvent(tracks.tappedRewind(artworkToRewind.internalID, artworkToRewind.slug))
      setCurrentIndex((prev) => prev - 1)
    }
  }

  const handleCardSwipedLeft = useCallback(() => {
    if (currentIndex < artworks.length - 1) {
      const dismissedArtwork = artworks[currentIndex]

      setCurrentIndex((prev) => prev + 1)
      addDisoveredArtworkId(dismissedArtwork.internalID)

      trackEvent(tracks.swipedArtwork(dismissedArtwork.internalID, dismissedArtwork.slug))

      // because when swiping, we iterate over the array of artworks, and we want to track only
      // unique artworks, we need to track the max index reached
      const newMaxIndexReached = Math.max(currentIndex + 1, maxIndexReached)
      if (newMaxIndexReached > maxIndexReached) {
        trackEvent({
          action: ActionType.screen,
          context_screen_owner_id: artworks[newMaxIndexReached].internalID,
          context_screen_owner_slug: artworks[newMaxIndexReached].slug,
          context_screen_owner_type: OwnerType.infiniteDiscoveryArtwork,
        })

        commitMutation({
          variables: {
            input: {
              artworkId: artworks[newMaxIndexReached].internalID,
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
        const newArtwork = artworks[newMaxIndexReached]
        trackEvent(tracks.swipedToNewArtwork(newArtwork.internalID, newArtwork.slug))
      }
      setMaxIndexReached(newMaxIndexReached)
    }

    // fetch more artworks when the user is about to reach the end of the list
    if (currentIndex === artworks.length - REFETCH_BUFFER) {
      fetchMoreArtworks(unswipedCards.map((card) => card.artworkId))
    }
  }, [currentIndex, artworks.length, fetchMoreArtworks])

  const handleCardWhiffedRight = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1)
    }
  }

  const handleFetchMore = (index: number) => {
    setTimeout(() => {
      setExtraCards((prev) => [...getRandomCards(prev.length), ...prev])
    }, 1000)
  }

  // 1st -> id: 5, index: 4
  // 5th -> id: 1, index: 0

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
            hideLeftElements={currentIndex === 0}
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
        {/* <FancySwiper
          cards={artworkCards}
          topCardIndex={currentIndex}
          hideActionButtons
          onSwipeLeft={handleCardSwipedLeft}
          onWhiffRight={handleCardWhiffedRight}
        /> */}
        <Swiper
          initialCards={extraCards}
          // extraCards={extraCards}
          onTrigger={handleFetchMore}
          swipedIndexCallsOnTrigger={3}
        />

        {/* {!!artworks.length && (
          <InfiniteDiscoveryBottomSheet
            artworkID={artworks[currentIndex].internalID}
            artistIDs={artworks[currentIndex].artists.map((data) => data?.internalID ?? "")}
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
  swipedArtwork: (artworkId: string, artworkSlug: string) => ({
    action: ActionType.swipedInfiniteDiscoveryArtwork,
    context_module: ContextModule.infiniteDiscovery,
    context_screen_owner_id: artworkId,
    context_screen_owner_slug: artworkSlug,
    context_screen_owner_type: OwnerType.infiniteDiscoveryArtwork,
  }),
  swipedToNewArtwork: (artworkId: string, artworkSlug: string) => ({
    action: ActionType.screen,
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

const _cards = [
  { color: "lightgreen", id: "5" },
  { color: "yellow", id: "4" },
  { color: "orange", id: "3" },
  { color: "lightblue", id: "2" },
  { color: "violet", id: "1" },
]

const getRandomCards = (lastId: number): typeof _cards => {
  const numberOfCards = 5
  const cards = [0, 0, 0, 0, 0].map((_, i) => ({
    color: colors[Math.floor(Math.random() * 4)],
    id: (lastId + numberOfCards - i).toString(),
  }))

  return cards
}
const colors = ["lightgreen", "yellow", "orange", "lightblue", "violet"]
