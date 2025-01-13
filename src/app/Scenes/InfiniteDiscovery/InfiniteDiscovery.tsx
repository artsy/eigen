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
import { FancySwiper } from "app/Components/FancySwiper/FancySwiper"
import { InfiniteDiscoveryBottomSheet } from "app/Scenes/InfiniteDiscovery/Components/InfiniteDiscoveryBottomSheet"
import { goBack } from "app/system/navigation/navigate"
import { extractNodes } from "app/utils/extractNodes"
import { NoFallback, withSuspense } from "app/utils/hooks/withSuspense"
import { sizeToFit } from "app/utils/useSizeToFit"
import { useMemo, useState } from "react"
import { graphql, useLazyLoadQuery } from "react-relay"
import type { InfiniteDiscoveryQuery } from "__generated__/InfiniteDiscoveryQuery.graphql"
import type { Card } from "app/Components/FancySwiper/FancySwiperCard"

export const InfiniteDiscovery: React.FC = () => {
  const data = useLazyLoadQuery<InfiniteDiscoveryQuery>(infiniteDiscoveryQuery, {})
  const artworks = useMemo(() => extractNodes(data.marketingCollection?.artworksConnection), [data])

  const { color } = useTheme()
  const { width: screenWidth } = useScreenDimensions()

  const [index, setIndex] = useState(0)

  const goToPrevious = () => {
    if (index > 0) {
      setIndex(index - 1)
    }
  }

  const goToNext = () => {
    if (index < artworks.length - 1) {
      setIndex(index + 1)
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
          />
          <Spacer y={2} />

          <Flex alignItems="center" backgroundColor={color("purple60")}>
            {!!src && <Image src={src} height={size.height} width={size.width} />}
          </Flex>
          <Flex flexDirection="row" justifyContent="space-between">
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

        <InfiniteDiscoveryBottomSheet artworkID="add-fuel-modular" />
      </Screen.Body>
    </Screen>
  )
}

export const InfiniteDiscoveryQueryRenderer = withSuspense({
  Component: InfiniteDiscovery,
  LoadingFallback: () => <Text>Loading...</Text>,
  ErrorFallback: NoFallback,
})

export const infiniteDiscoveryQuery = graphql`
  query InfiniteDiscoveryQuery {
    marketingCollection(slug: "curators-picks") {
      artworksConnection(first: 10) {
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
            internalID
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
  }
`
