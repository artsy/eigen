import {
  Avatar,
  Button,
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
import { InfiniteDiscoveryContext } from "app/Scenes/InfiniteDiscovery/InfiniteDiscoveryContext"
import { navigate } from "app/system/navigation/navigate"
import { extractNodes } from "app/utils/extractNodes"
import { NoFallback, withSuspense } from "app/utils/hooks/withSuspense"
import { graphql, useLazyLoadQuery } from "react-relay"
import type { InfiniteDiscoveryQuery } from "__generated__/InfiniteDiscoveryQuery.graphql"
import type { Card } from "app/Components/FancySwiper/FancySwiperCard"

export const InfiniteDiscoveryView: React.FC = () => {
  return (
    <InfiniteDiscoveryContext.Provider>
      <InfiniteDiscoveryWithSuspense />
    </InfiniteDiscoveryContext.Provider>
  )
}

export const InfiniteDiscovery: React.FC = () => {
  const { color } = useTheme()
  const { width: screenWidth } = useScreenDimensions()

  const currentIndex = InfiniteDiscoveryContext.useStoreState((state) => state.currentIndex)
  const goToPrevious = InfiniteDiscoveryContext.useStoreActions((action) => action.goToPrevious)
  const goToNext = InfiniteDiscoveryContext.useStoreActions((actions) => actions.goToNext)

  const data = useLazyLoadQuery<InfiniteDiscoveryQuery>(infiniteDiscoveryQuery, {})

  const artworks = extractNodes(data.marketingCollection?.artworksConnection)

  const handleBackPressed = () => {
    goToPrevious()
  }

  const handleExitPressed = () => {
    navigate("/home-view")
  }

  const handleSwipedRight = () => {
    // no-op
  }

  const handleSwipedLeft = () => {
    goToNext()
  }

  const artworkCards: Card[] = artworks.map((artwork) => {
    return {
      jsx: (
        <Flex backgroundColor={color("white100")}>
          <Flex flexDirection="row" justifyContent="space-between" testID="artist-header">
            <Flex flexDirection="row" px={2}>
              <Avatar
                initials={artwork?.artists?.[0]?.initials || undefined}
                src={artwork?.artists?.[0]?.coverArtwork?.image?.cropped?.url || undefined}
                size="xs"
              />
              <Flex>
                <Text variant="sm-display">{artwork.artistNames}</Text>
                <Text variant="xs" color={color("black60")}>
                  {artwork?.artists?.[0]?.formattedNationalityAndBirthday}
                </Text>
              </Flex>
            </Flex>
            <Button variant="outlineGray" size="small">
              Follow
            </Button>
          </Flex>
          <Spacer y={2} />
          <Flex alignItems="center">
            {!!artwork?.images?.[0]?.url && (
              <Image src={artwork.images[0].url} width={screenWidth} aspectRatio={0.79} />
            )}
          </Flex>
          <Flex flexDirection="row" justifyContent="space-between" testID="artwork-info">
            <Flex>
              <Flex flexDirection="row">
                <Text color={color("black60")} italic variant="sm-display">
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
            hideLeftElements={currentIndex === 0}
            rightElements={
              <Touchable onPress={handleExitPressed}>
                <Text variant="xs">Exit</Text>
              </Touchable>
            }
          />
        </Flex>
        <FancySwiper
          cards={artworkCards}
          hideActionButtons
          onSwipeRight={handleSwipedRight}
          onSwipeLeft={handleSwipedLeft}
        />
      </Screen.Body>
    </Screen>
  )
}

export const InfiniteDiscoveryWithSuspense = withSuspense({
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
                image {
                  cropped(height: 45, width: 45) {
                    url
                  }
                }
              }
              formattedNationalityAndBirthday
              initials
            }
            date
            internalID
            images {
              url(version: "large")
            }
            saleMessage
            title
          }
        }
      }
    }
  }
`
