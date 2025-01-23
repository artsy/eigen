import {
  Button,
  EntityHeader,
  Flex,
  Image,
  Screen,
  Spacer,
  Spinner,
  Text,
  Touchable,
  useScreenDimensions,
  useTheme,
} from "@artsy/palette-mobile"
import { FancySwiper } from "app/Components/FancySwiper/FancySwiper"
import { InfiniteDiscoveryBottomSheet } from "app/Scenes/InfiniteDiscovery/Components/InfiniteDiscoveryBottomSheet"
import { GlobalStore } from "app/store/GlobalStore"
import { goBack } from "app/system/navigation/navigate"
import { getRelayEnvironment } from "app/system/relay/defaultEnvironment"
import { extractNodes } from "app/utils/extractNodes"
import { sizeToFit } from "app/utils/useSizeToFit"
import { useEffect, useState } from "react"
import { fetchQuery, graphql } from "react-relay"
import type {
  InfiniteDiscoveryQuery,
  InfiniteDiscoveryQuery$data,
} from "__generated__/InfiniteDiscoveryQuery.graphql"
import type { Card } from "app/Components/FancySwiper/FancySwiperCard"

type Artwork = NonNullable<
  NonNullable<
    NonNullable<NonNullable<InfiniteDiscoveryQuery$data["discoverArtworks"]>["edges"]>[0]
  >["node"]
>

export const InfiniteDiscovery: React.FC = () => {
  const REFETCH_BUFFER = 3

  const discoveredArtworksIds = GlobalStore.useAppState(
    (state) => state.infiniteDiscovery.discoveredArtworkIds
  )
  const { addDiscoveredArtworkId } = GlobalStore.actions.infiniteDiscovery

  const { color } = useTheme()
  const { width: screenWidth } = useScreenDimensions()

  const [index, setIndex] = useState(0)
  const [artworks, setArtworks] = useState<Artwork[]>([])

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

  if (!artworks || artworks.length === 0) {
    return <InfiniteDiscoverySpinner />
  }

  const goToPrevious = () => {
    if (index > 0) {
      setIndex(index - 1)
    }
  }

  const goToNext = () => {
    if (index < artworks.length - 1) {
      addDiscoveredArtworkId(artworks[index].internalID)
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

          setArtworks((previousArtworks) => {
            const newArtworks = extractNodes(data.discoverArtworks)
            return [...previousArtworks, ...newArtworks]
          })
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

  const artworkCards: Card[] = artworks.slice(index).map((artwork) => {
    const src = !!artwork?.images?.[0]?.url ? artwork.images[0].url : undefined
    const width = !!artwork?.images?.[0]?.width ? artwork.images[0].width : 0
    const height = !!artwork?.images?.[0]?.height ? artwork.images[0].height : 0

    const size = sizeToFit({ width: width, height: height }, { width: screenWidth, height: 500 })

    return {
      jsx: (
        <Flex backgroundColor={color("white100")} width="100%" height={800}>
          <EntityHeader
            name={artwork?.artistNames ?? ""}
            meta={artwork?.artists?.[0]?.formattedNationalityAndBirthday ?? undefined}
            imageUrl={artwork?.artists?.[0]?.coverArtwork?.images?.[0]?.url ?? undefined}
            initials={artwork?.artists?.[0]?.initials ?? undefined}
            RightButton={
              <Button variant="outlineGray" size="small">
                Follow
              </Button>
            }
            p={1}
          />
          <Spacer y={2} />

          <Flex alignItems="center" backgroundColor={color("purple60")}>
            {!!src && <Image src={src} height={size.height} width={size.width} />}
          </Flex>
          <Flex flexDirection="row" justifyContent="space-between" p={1}>
            <Flex>
              <Flex flexDirection="row" maxWidth={screenWidth - 200}>
                {/* TODO: maxWidth above and ellipsizeMode + numberOfLines below are used to */}
                {/* prevent long artwork titles from pushing the save button off of the card, */}
                {/* it doesn't work as expected on Android. */}
                <Text
                  color={color("black60")}
                  italic
                  variant="sm-display"
                  ellipsizeMode="tail"
                  numberOfLines={1}
                >
                  {artwork.title}
                </Text>
                <Text color={color("black60")} variant="sm-display">
                  , {artwork.date}
                </Text>
              </Flex>
              <Text variant="sm-display">{artwork.saleMessage}</Text>
            </Flex>
            <Button variant="fillGray">Save</Button>
          </Flex>
        </Flex>
      ),
      id: artwork.internalID,
    }
  })

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
        <FancySwiper cards={artworkCards} hideActionButtons onSwipeLeft={handleSwipedLeft} />

        <InfiniteDiscoveryBottomSheet artworkID={artworks[index].internalID} />
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
          artistNames
          artists(shallow: true) {
            coverArtwork {
              images {
                url(version: "small")
              }
            }
            formattedNationalityAndBirthday
            initials
          }
          date
          internalID @required(action: NONE)
          images {
            url(version: "large")
            width
            height
          }
          saleMessage
          title
        }
      }
    }
  }
`
