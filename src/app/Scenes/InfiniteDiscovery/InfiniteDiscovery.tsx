import {
  Button,
  EntityHeader,
  Flex,
  Image,
  Screen,
  Spacer,
  Text,
  Touchable,
  useScreenDimensions,
  useTheme,
} from "@artsy/palette-mobile"
import { InfiniteDiscoveryRefetchQuery } from "__generated__/InfiniteDiscoveryRefetchQuery.graphql"
import { InfiniteDiscovery_Fragment$key } from "__generated__/InfiniteDiscovery_Fragment.graphql"
import { FancySwiper } from "app/Components/FancySwiper/FancySwiper"
import { InfiniteDiscoveryBottomSheet } from "app/Scenes/InfiniteDiscovery/Components/InfiniteDiscoveryBottomSheet"
import { goBack } from "app/system/navigation/navigate"
import { extractNodes } from "app/utils/extractNodes"
import { NoFallback, SpinnerFallback, withSuspense } from "app/utils/hooks/withSuspense"
import { sizeToFit } from "app/utils/useSizeToFit"
import { useEffect, useState } from "react"
import { graphql, useLazyLoadQuery, useRefetchableFragment } from "react-relay"
import type {
  InfiniteDiscoveryQuery,
  InfiniteDiscoveryQuery$data,
} from "__generated__/InfiniteDiscoveryQuery.graphql"
import type { Card } from "app/Components/FancySwiper/FancySwiperCard"

interface InfiniteDiscoveryProps {
  artworks: InfiniteDiscoveryQuery$data
}

export const InfiniteDiscovery: React.FC<InfiniteDiscoveryProps> = ({ artworks: _artworks }) => {
  const [data, refetch] = useRefetchableFragment<
    InfiniteDiscoveryRefetchQuery,
    InfiniteDiscovery_Fragment$key
  >(infiniteDiscoveryFragment, _artworks)

  const REFETCH_BUFFER = 2

  const { color } = useTheme()
  const { width: screenWidth } = useScreenDimensions()

  const [index, setIndex] = useState(0)
  const [artworks, setArtworks] = useState(extractNodes(data.discoverArtworks))

  useEffect(() => {
    setArtworks((previousArtworks) => {
      // only add new artworks to the list by filtering-out existing artworks
      const newArtworks = extractNodes(data.discoverArtworks).filter(
        (newArtwork) =>
          !previousArtworks.some((artwork) => artwork.internalID === newArtwork.internalID)
      )

      return [...previousArtworks, ...newArtworks]
    })
  }, [data, extractNodes, setArtworks])

  const goToPrevious = () => {
    if (index > 0) {
      setIndex(index - 1)
    }
  }

  const goToNext = () => {
    if (index < artworks.length - 1) {
      setIndex(index + 1)
    }

    // fetch more artworks when the user is about to reach the end of the list
    if (index === artworks.length - REFETCH_BUFFER) {
      refetch(
        { excludeArtworkIds: artworks.map((artwork) => artwork.internalID) },
        {
          fetchPolicy: "network-only",
        }
      )
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

export const InfiniteDiscoveryQueryRenderer = withSuspense({
  Component: () => {
    const initialData = useLazyLoadQuery<InfiniteDiscoveryQuery>(infiniteDiscoveryQuery, {})

    if (!initialData) {
      return null
    }

    return <InfiniteDiscovery artworks={initialData} />
  },
  LoadingFallback: SpinnerFallback,
  ErrorFallback: NoFallback,
})

const infiniteDiscoveryFragment = graphql`
  fragment InfiniteDiscovery_Fragment on Query
  @refetchable(queryName: "InfiniteDiscoveryRefetchQuery")
  @argumentDefinitions(excludeArtworkIds: { type: "[String!]" }) {
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

export const infiniteDiscoveryQuery = graphql`
  query InfiniteDiscoveryQuery {
    ...InfiniteDiscovery_Fragment
  }
`
