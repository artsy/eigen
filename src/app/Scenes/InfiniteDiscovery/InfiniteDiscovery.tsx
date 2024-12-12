import { Button, Flex, Image, Screen, Text, Touchable, useTheme } from "@artsy/palette-mobile"
import { FancySwiper } from "app/Components/FancySwiper/FancySwiper"
import { Card } from "app/Components/FancySwiper/FancySwiperCard"
import { InfiniteDiscoveryContext } from "app/Scenes/InfiniteDiscovery/InfiniteDiscoveryContext"
import { navigate } from "app/system/navigation/navigate"

export const InfiniteDiscoveryView: React.FC = () => {
  return (
    <InfiniteDiscoveryContext.Provider>
      <InfiniteDiscovery />
    </InfiniteDiscoveryContext.Provider>
  )
}

export const InfiniteDiscovery: React.FC = () => {
  const { color } = useTheme()

  const artworks = InfiniteDiscoveryContext.useStoreState((state) => state.artworks)
  const currentArtwork = InfiniteDiscoveryContext.useStoreState((state) => state.currentArtwork)
  const goToPreviousArtwork = InfiniteDiscoveryContext.useStoreActions(
    (action) => action.goToPreviousArtwork
  )
  const goToNextArtwork = InfiniteDiscoveryContext.useStoreActions(
    (actions) => actions.goToNextArtwork
  )

  const currentArtworkIndex = artworks.indexOf(currentArtwork)
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
        <>
          <Flex flexDirection="row" justifyContent="space-between" testID="artist-header">
            <Text variant="sm-display">Artist Name</Text>
            <Button variant="outlineGray">Follow</Button>
          </Flex>
          <Flex alignItems="center">
            <Image src="https://d32dm0rphc51dk.cloudfront.net/Wor_U4FSvsAmEAEFj1iyVg/medium.jpg" />
          </Flex>
          <Flex flexDirection="row" justifyContent="space-between" testID="artwork-info">
            <Flex>
              <Flex flexDirection="row">
                <Text color={color("black60")} italic variant="sm-display">
                  Artwork Title,
                </Text>
                <Text color={color("black60")} variant="sm-display">
                  2024
                </Text>
              </Flex>
              <Text variant="sm-display">$1,234</Text>
            </Flex>
            <Button variant="fillGray">Save</Button>
          </Flex>
        </>
      ),
      id: artwork,
    }
  })

  return (
    <Screen>
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
      <Screen.Body fullwidth>
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
