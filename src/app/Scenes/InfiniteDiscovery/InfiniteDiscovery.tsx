import {
  Avatar,
  Button,
  Flex,
  Image,
  Screen,
  Text,
  Touchable,
  useScreenDimensions,
  useTheme,
} from "@artsy/palette-mobile"
import { InfiniteDiscoveryQuery } from "__generated__/InfiniteDiscoveryQuery.graphql"
import { FancySwiper } from "app/Components/FancySwiper/FancySwiper"
import { Card } from "app/Components/FancySwiper/FancySwiperCard"
import { InfiniteDiscoveryContext } from "app/Scenes/InfiniteDiscovery/InfiniteDiscoveryContext"
import { navigate } from "app/system/navigation/navigate"
import { useEffect } from "react"
import { graphql, useLazyLoadQuery } from "react-relay"

export const InfiniteDiscoveryView: React.FC = () => {
  return (
    <InfiniteDiscoveryContext.Provider>
      <InfiniteDiscovery />
    </InfiniteDiscoveryContext.Provider>
  )
}

export const InfiniteDiscovery: React.FC = () => {
  const { color } = useTheme()
  const { width: screenWidth } = useScreenDimensions()

  const data = useLazyLoadQuery<InfiniteDiscoveryQuery>(infiniteDiscoveryQuery, {})

  const artworks = InfiniteDiscoveryContext.useStoreState((state) => state.artworks)
  const currentArtworkIndex = InfiniteDiscoveryContext.useStoreState(
    (state) => state.currentArtworkIndex
  )
  const goToPreviousArtwork = InfiniteDiscoveryContext.useStoreActions(
    (action) => action.goToPreviousArtwork
  )
  const goToNextArtwork = InfiniteDiscoveryContext.useStoreActions(
    (actions) => actions.goToNextArtwork
  )
  const setArtworks = InfiniteDiscoveryContext.useStoreActions((actions) => actions.setArtworks)

  useEffect(() => {
    setArtworks(
      (data.marketingCollection?.artworksConnection?.edges?.map((edge) => edge?.node) as any) || []
    )
  }, [data])

  const canGoBack = currentArtworkIndex > 0

  const handleBackPressed = () => {
    goToPreviousArtwork()
  }

  const handleExitPressed = () => {
    navigate("/home-view")
  }

  const handleSwipedRight = () => {
    // no-op
  }

  const handleSwipedLeft = () => {
    goToNextArtwork()
  }

  const artworkCards: Card[] = artworks.slice(currentArtworkIndex).map((artwork) => {
    return {
      jsx: (
        <Flex backgroundColor={color("white100")}>
          <Flex flexDirection="row" justifyContent="space-between" testID="artist-header">
            <Flex flexDirection="row">
              <Avatar
                initials={artwork.artists[0].initials || undefined}
                src={artwork.artists[0].coverArtwork?.image?.cropped?.url || undefined}
                size="xs"
              />
              <Flex>
                <Text variant="sm-display">{artwork.artistNames}</Text>
                <Text variant="xs" color={color("black60")}>
                  {artwork.artists[0].formattedNationalityAndBirthday}
                </Text>
              </Flex>
            </Flex>
            <Button variant="outlineGray">Follow</Button>
          </Flex>
          <Flex alignItems="center">
            <Image src={artwork.images[0].url} width={screenWidth} aspectRatio={0.79} />
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
            hideLeftElements={!canGoBack}
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

const infiniteDiscoveryQuery = graphql`
  query InfiniteDiscoveryQuery {
    marketingCollection(slug: "curators-picks") {
      artworksConnection(first: 10) {
        edges {
          node {
            artistNames
            artists(shallow: true) {
              initials
              formattedNationalityAndBirthday
              coverArtwork {
                image {
                  cropped(height: 45, width: 45) {
                    url
                  }
                }
              }
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
