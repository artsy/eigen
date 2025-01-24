import { Flex, Screen, Spinner, Text, Touchable } from "@artsy/palette-mobile"
import { FancySwiper } from "app/Components/FancySwiper/FancySwiper"
import { InfiniteDiscoveryArtworkCard } from "app/Scenes/InfiniteDiscovery/Components/InfiniteDiscoveryArtworkCard"
import { InfiniteDiscoveryBottomSheet } from "app/Scenes/InfiniteDiscovery/Components/InfiniteDiscoveryBottomSheet"
import { GlobalStore } from "app/store/GlobalStore"
import { goBack } from "app/system/navigation/navigate"
import { getRelayEnvironment } from "app/system/relay/defaultEnvironment"
import { extractNodes } from "app/utils/extractNodes"
import { useEffect, useMemo, useState } from "react"
import { fetchQuery, graphql } from "react-relay"
import type {
  InfiniteDiscoveryQuery,
  InfiniteDiscoveryQuery$data,
} from "__generated__/InfiniteDiscoveryQuery.graphql"

type InfiniteDiscoveryArtwork = NonNullable<
  NonNullable<NonNullable<InfiniteDiscoveryQuery$data["discoverArtworks"]>["edges"]>[number]
>["node"]

export const InfiniteDiscovery: React.FC = () => {
  const REFETCH_BUFFER = 3

  const discoveredArtworksIds = GlobalStore.useAppState(
    (state) => state.infiniteDiscovery.discoveredArtworkIds
  )
  const { addDiscoveredArtworkId } = GlobalStore.actions.infiniteDiscovery

  const [index, setIndex] = useState(0)
  const [artworks, setArtworks] = useState<InfiniteDiscoveryArtwork[]>([])

  useEffect(() => {
    fetchQuery<InfiniteDiscoveryQuery>(
      getRelayEnvironment(),
      infiniteDiscoveryQuery,
      { excludeArtworkIds: discoveredArtworksIds },
      {
        fetchPolicy: "network-only",
      }
    ).subscribe({
      next: (data) => {
        if (!data) {
          console.error("Error fetching infinite discovery batch: response is falsy")
          return
        }

        setArtworks(extractNodes(data.discoverArtworks))
      },
      error: (error: Error) => {
        console.error("Error fetching infinite discovery batch:", error)
      },
    })
  }, [])

  const artworkCards: React.ReactNode[] = useMemo(() => {
    return artworks.map((artwork, i) => <InfiniteDiscoveryArtworkCard artwork={artwork} key={i} />)
  }, [artworks])

  const unswipedCards: React.ReactNode[] = artworkCards.slice(index)

  if (!artworks) {
    return <InfiniteDiscoverySpinner />
  }

  const goToPrevious = () => {
    if (index > 0) {
      setIndex(index - 1)
    }
  }

  const goToNext = () => {
    if (index < artworks.length - 1) {
      addDiscoveredArtworkId(artworks[index]?.internalID)
      setIndex(index + 1)
    }

    // fetch more artworks when the user is about to reach the end of the list
    if (index === artworks.length - REFETCH_BUFFER) {
      fetchQuery<InfiniteDiscoveryQuery>(
        getRelayEnvironment(),
        infiniteDiscoveryQuery,
        { excludeArtworkIds: discoveredArtworksIds },
        {
          fetchPolicy: "network-only",
        }
      ).subscribe({
        next: (data) => {
          if (!data) {
            console.error("Error fetching infinite discovery batch: response is falsy")
            return
          }

          setArtworks((previousArtworks) => [
            ...previousArtworks,
            ...(extractNodes(data.discoverArtworks) as InfiniteDiscoveryArtwork[]),
          ])
        },
        error: (error: Error) => {
          console.error("Error fetching infinite discovery batch:", error)
        },
      })
    }
  }

  const handleBackPressed = () => {
    goToPrevious()
  }

  const handleExitPressed = () => {
    goBack()
  }

  const handleSwipedLeft = () => {
    goToNext()
  }

  return (
    <Screen>
      <Screen.Body fullwidth>
        <Flex zIndex={-100}>
          <Screen.Header
            title="Discovery"
            leftElements={
              <Touchable onPress={handleBackPressed}>
                <Text variant="xs">Back</Text>
              </Touchable>
            }
            hideLeftElements={index === 0}
            rightElements={
              <Touchable onPress={handleExitPressed}>
                <Text variant="xs">Exit</Text>
              </Touchable>
            }
          />
        </Flex>
        <FancySwiper cards={unswipedCards} hideActionButtons onSwipeLeft={handleSwipedLeft} />

        <InfiniteDiscoveryBottomSheet artworkID={artworks[index]?.internalID} />
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

export const InfiniteDiscoveryQueryRenderer = () => <InfiniteDiscovery />

export const infiniteDiscoveryQuery = graphql`
  query InfiniteDiscoveryQuery($excludeArtworkIds: [String!]!) {
    discoverArtworks(excludeArtworkIds: $excludeArtworkIds) {
      edges {
        node {
          ...InfiniteDiscoveryArtworkCard_artwork
        }
      }
    }
  }
`
